import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";

// Exercise the HTML and scripts Astro actually ships, without pretending DOM
// simulation can check pixel layout, focus rendering, or browser performance.
function page(route = "", setup = () => {}) {
  const file = path.join("dist", route, "index.html");
  const errors = [];
  const navigations = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (error) => {
    if (error.message.includes("navigation")) navigations.push(error);
    else errors.push(error);
  });
  const dom = new JSDOM(readFileSync(file, "utf8"), {
    url: `https://koradesk.test/${route}`,
    runScripts: "outside-only",
    virtualConsole: vc,
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      this.callback([{ target, isIntersecting: true }]);
    }
    disconnect() {}
  };
  setup(window);
  for (const script of window.document.scripts) {
    if (script.type && script.type !== "module") continue;
    const source = script.src
      ? readFileSync(path.join("dist", new URL(script.src).pathname), "utf8")
      : script.textContent;
    window.eval(`(function(){${source}\n})();`);
  }
  assert.deepEqual(errors, [], "no script errors during initialization");
  return {
    window,
    doc: window.document,
    errors,
    navigations,
    close: () => window.close(),
  };
}

function clockFor(window) {
  let now = 0,
    sequence = 0;
  const pending = new Map();
  window.setTimeout = (callback, delay = 0) => {
    const id = ++sequence;
    pending.set(id, { at: now + Number(delay), callback });
    return id;
  };
  window.clearTimeout = (id) => pending.delete(id);
  return {
    advance(ms) {
      const end = now + ms;
      let iterations = 0;
      while (true) {
        const next = [...pending.entries()]
          .filter(([, job]) => job.at <= end)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        if (++iterations > 100) throw new Error("Runaway playback timer");
        now = next[1].at;
        pending.delete(next[0]);
        next[1].callback();
      }
      now = end;
    },
    pending: () => pending.size,
  };
}

test("all four chats can be stepped forward, reversed, replayed, and switched", () => {
  const p = page();
  const { doc } = p;
  const root = doc.querySelector("[data-desk-demo]");
  for (const id of ["orders", "payments", "stock", "books", "orders"]) {
    doc.querySelector(`[data-agent="${id}"]`).click();
    assert.equal(root.dataset.messageCount, "1");
    assert.equal(
      doc.querySelectorAll('[data-agent][aria-pressed="true"]').length,
      1,
    );
    for (let i = 0; i < 10 && root.dataset.complete !== "true"; i++)
      doc.querySelector("[data-next]").click();
    assert.equal(root.dataset.complete, "true");
    assert.ok(doc.querySelectorAll(".chat-owner").length > 0);
    assert.ok(doc.querySelectorAll(".chat-kora").length > 0);
    doc.querySelector("[data-previous]").click();
    assert.equal(root.dataset.complete, "false");
    doc.querySelector("[data-demo-reset]").click();
    assert.equal(root.dataset.messageCount, "1");
  }
  assert.deepEqual(p.errors, []);
  p.close();
});

test("two conversation instances keep their messages and selection isolated", () => {
  const p = page("", (window) => {
    const root = window.document.querySelector("[data-desk-demo]");
    root.after(root.cloneNode(true));
  });
  const [first, second] = p.doc.querySelectorAll("[data-desk-demo]");
  first.querySelector('[data-agent="stock"]').click();
  first.querySelector("[data-next]").click();
  assert.equal(first.dataset.messageCount, "2");
  assert.equal(second.dataset.messageCount, "1");
  assert.equal(
    second.querySelector('[data-agent="orders"]').getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    second.querySelector(".transcript-toggle").getAttribute("aria-expanded"),
    "false",
  );
  const ids = [...p.doc.querySelectorAll("[id]")].map((el) => el.id);
  assert.equal(ids.length, new Set(ids).size);
  p.close();
});

test("timed playback shows typing, delivers messages in order, and waits for owner approval", () => {
  let clock;
  const p = page("", (window) => {
    clock = clockFor(window);
  });
  const root = p.doc.querySelector("[data-desk-demo]");
  root.querySelector("[data-play]").click();
  assert.equal(root.querySelector("[data-typing]").hidden, false);
  clock.advance(1549);
  assert.equal(root.dataset.messageCount, "1");
  clock.advance(1);
  assert.equal(root.dataset.messageCount, "2");
  assert.equal(
    root.querySelector("[data-ticks]").getAttribute("aria-label"),
    "Read",
  );
  clock.advance(1550);
  assert.equal(root.dataset.playback, "awaiting-reply");
  assert.equal(root.dataset.messageCount, "3");
  clock.advance(60000);
  assert.equal(root.dataset.messageCount, "3");
  assert.equal(clock.pending(), 0);
  root.querySelector("[data-quick-reply]").click();
  assert.equal(root.dataset.messageCount, "4");
  clock.advance(3100);
  assert.equal(root.dataset.playback, "finished");
  assert.equal(root.dataset.messageCount, "6");
  assert.match(
    root.querySelector("[data-messages]").textContent,
    /Invoice KD-1840/,
  );
  assert.equal(clock.pending(), 0);
  p.close();
});

test("pause, replay, and agent switching cancel pending messages", () => {
  let clock;
  const p = page("", (window) => {
    clock = clockFor(window);
  });
  const root = p.doc.querySelector("[data-desk-demo]");
  root.querySelector("[data-play]").click();
  clock.advance(500);
  root.querySelector("[data-play]").click();
  clock.advance(10000);
  assert.equal(root.dataset.messageCount, "1");
  assert.equal(root.querySelector("[data-typing]").hidden, true);
  root.querySelector("[data-play]").click();
  root.querySelector("[data-demo-reset]").click();
  clock.advance(1550);
  assert.equal(root.dataset.messageCount, "2");
  root.querySelector('[data-agent="payments"]').click();
  clock.advance(60000);
  assert.equal(root.dataset.messageCount, "1");
  assert.doesNotMatch(
    root.querySelector("[data-messages]").textContent,
    /rice|noodles/,
  );
  root.querySelector("[data-play]").click();
  clock.advance(10000);
  assert.equal(root.dataset.playback, "finished");
  assert.match(
    root.querySelector("[data-messages]").textContent,
    /Receipt KD-1839/,
  );
  p.close();
});

test("typed sample replies validate, continue the chat, and return focus to playback", () => {
  let clock;
  const p = page("", (window) => {
    clock = clockFor(window);
  });
  const root = p.doc.querySelector("[data-desk-demo]");
  root.querySelector("[data-play]").click();
  clock.advance(3100);
  const input = root.querySelector("[data-reply-input]");
  const form = root.querySelector("[data-reply-form]");
  input.value = "wait";
  input.dispatchEvent(new p.window.Event("input"));
  form.dispatchEvent(new p.window.Event("submit", { cancelable: true }));
  assert.equal(input.getAttribute("aria-invalid"), "true");
  assert.equal(root.dataset.messageCount, "3");
  input.value = "YES";
  input.dispatchEvent(new p.window.Event("input"));
  input.focus();
  form.dispatchEvent(new p.window.Event("submit", { cancelable: true }));
  assert.equal(root.dataset.messageCount, "4");
  assert.equal(p.doc.activeElement, root.querySelector("[data-play]"));
  assert.equal(input.disabled, true);
  clock.advance(3100);
  assert.equal(root.dataset.complete, "true");
  p.close();
});

test("reduced motion skips timed effects while preserving approval and transcript controls", () => {
  let clock;
  const p = page("", (window) => {
    clock = clockFor(window);
    window.matchMedia = (query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    });
  });
  const root = p.doc.querySelector("[data-desk-demo]");
  const transcript = root.querySelector(".transcript-toggle");
  transcript.click();
  assert.equal(transcript.getAttribute("aria-expanded"), "true");
  assert.equal(
    p.doc.getElementById(transcript.getAttribute("aria-controls")).hidden,
    false,
  );
  root.querySelector("[data-play]").click();
  assert.equal(root.dataset.playback, "awaiting-reply");
  assert.equal(clock.pending(), 0);
  root.querySelector("[data-quick-reply]").click();
  assert.equal(root.dataset.complete, "true");
  assert.equal(root.querySelector("[data-typing]").hidden, true);
  assert.equal(clock.pending(), 0);
  p.close();
});

test("hidden tabs pause conversation playback without appending background messages", () => {
  let clock;
  const p = page("", (window) => {
    clock = clockFor(window);
  });
  const root = p.doc.querySelector("[data-desk-demo]");
  root.querySelector("[data-play]").click();
  Object.defineProperty(p.doc, "hidden", { configurable: true, value: true });
  p.doc.dispatchEvent(new p.window.Event("visibilitychange"));
  clock.advance(20000);
  assert.equal(root.dataset.messageCount, "1");
  assert.notEqual(root.dataset.playback, "playing");
  assert.equal(clock.pending(), 0);
  p.close();
});

test("annual billing discloses actual yearly totals and updates the calculator, then reverses", () => {
  const p = page("pricing");
  const { doc } = p;
  const prices = () =>
    [...doc.querySelectorAll("[data-price-monthly]")].map((x) =>
      x.textContent.trim(),
    );
  const initial = prices();
  doc.querySelector("#billing-toggle").click();
  assert.equal(
    doc.querySelector("#billing-toggle").getAttribute("aria-checked"),
    "true",
  );
  assert.match(
    doc.querySelector(".price-note").textContent,
    /150,000.*billed once a year.*12 months/,
  );
  assert.match(
    doc.querySelectorAll(".price-note")[2].textContent,
    /80,000 per client/,
  );
  assert.match(doc.querySelector("#roi-out").textContent, /37,500/);
  doc.querySelector("#billing-toggle").click();
  assert.deepEqual(prices(), initial);
  assert.match(doc.querySelector("#roi-out").textContent, /45,000/);
  const share = doc.querySelector('[name="share"]');
  share.value = "-10";
  share.dispatchEvent(new p.window.Event("input", { bubbles: true }));
  assert.match(doc.querySelector("#roi-out").textContent, /0\.0/);
  assert.doesNotMatch(
    doc.querySelector("#roi-out").textContent,
    /NaN|Infinity/,
  );
  assert.deepEqual(p.errors, []);
  p.close();
});

test("empty pilot submission focuses first invalid input and does not save a request", () => {
  const p = page("pilot");
  const { doc, window } = p;
  doc
    .querySelector("#pilot-form")
    .dispatchEvent(
      new window.Event("submit", { bubbles: true, cancelable: true }),
    );
  assert.equal(doc.activeElement.id, "pilot-name");
  assert.equal(doc.querySelectorAll('[aria-invalid="true"]').length, 5);
  assert.equal(window.sessionStorage.getItem("kora-pilot"), null);
  const name = doc.querySelector('[name="name"]');
  name.value = "Test";
  name.dispatchEvent(new window.Event("input"));
  assert.equal(name.getAttribute("aria-invalid"), "false");
  assert.equal(
    doc.querySelector("#pilot-name-error").classList.contains("hidden"),
    true,
  );
  p.close();
});

function fillPilot(p) {
  for (const [name, value] of Object.entries({
    name: "Sample Owner",
    business: "Sample Shop",
    type: "Retail shop",
    whatsapp: "+234 (801) 234-5678",
  }))
    p.doc.querySelector(`[name="${name}"]`).value = value;
  p.doc.querySelector('[name="consent"]').checked = true;
}

test("valid pilot normalizes the phone, saves only a tab draft, and initiates review navigation", () => {
  const p = page("pilot");
  fillPilot(p);
  p.doc
    .querySelector("#pilot-form")
    .dispatchEvent(new p.window.Event("submit", { cancelable: true }));
  const saved = JSON.parse(p.window.sessionStorage.getItem("kora-pilot"));
  assert.equal(saved.whatsapp, "+2348012345678");
  assert.equal(p.navigations.length, 1);
  assert.equal(saved.business, "Sample Shop");
  assert.equal(p.window.localStorage.getItem("kora-pilot"), null);
  assert.deepEqual(p.errors, []);
  p.close();
});

test("blocked tab storage gives actionable feedback instead of a false confirmation", () => {
  const p = page("pilot", (window) => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  fillPilot(p);
  p.doc
    .querySelector("#pilot-form")
    .dispatchEvent(new p.window.Event("submit", { cancelable: true }));
  assert.equal(
    p.doc.querySelector("#pilot-storage-error").classList.contains("hidden"),
    false,
  );
  assert.deepEqual(p.errors, []);
  p.close();
});

test("review page handles missing or corrupt drafts and safely renders a real draft", () => {
  for (const raw of [null, "{broken", JSON.stringify({ name: 123 })]) {
    const p = page("pilot/thanks", (window) => {
      if (raw) window.sessionStorage.setItem("kora-pilot", raw);
    });
    assert.match(
      p.doc.querySelector("#summary").textContent,
      /could not find a draft/,
    );
    assert.equal(
      p.doc.querySelector("#thanks-wa").classList.contains("hidden"),
      true,
    );
    p.close();
  }
  const p = page("pilot/thanks", (window) =>
    window.sessionStorage.setItem(
      "kora-pilot",
      JSON.stringify({
        name: "<img src=x onerror=alert(1)>",
        business: "Sample & Shop",
        type: "Retail shop",
        whatsapp: "+2348012345678",
      }),
    ),
  );
  assert.equal(p.doc.querySelector("#summary img"), null);
  const url = new URL(p.doc.querySelector("#thanks-wa").href);
  assert.equal(url.hostname, "wa.me");
  assert.match(url.searchParams.get("text"), /Sample & Shop/);
  assert.equal(
    p.doc.querySelector("#thanks-wa").classList.contains("hidden"),
    false,
  );
  p.close();
});

test("inline navigation closes with Escape and returns focus; theme and cookie choice work", () => {
  const p = page();
  const { doc, window } = p;
  const menu = doc.querySelector("[data-menu-toggle]");
  menu.click();
  assert.equal(menu.getAttribute("aria-expanded"), "true");
  doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
  assert.equal(menu.getAttribute("aria-expanded"), "false");
  assert.equal(doc.activeElement, menu);
  doc.querySelector("#theme-toggle").click();
  assert.equal(doc.documentElement.classList.contains("dark"), true);
  doc.querySelector("#theme-toggle").click();
  assert.equal(doc.documentElement.classList.contains("dark"), false);
  doc.querySelector("#cookie-reject").click();
  assert.equal(window.localStorage.getItem("kora-consent"), "essential");
  assert.equal(
    doc.querySelector("#cookie-banner").classList.contains("hidden"),
    true,
  );
  p.close();
});

test("built routes keep one main heading, unique IDs, labelled fields, and working local destinations", () => {
  const files = [];
  function walk(dir) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full);
      else if (item.name.endsWith(".html")) files.push(full);
    }
  }
  walk("dist");
  for (const file of files) {
    if (file.includes("/templates/")) continue;
    const doc = new JSDOM(readFileSync(file, "utf8")).window.document;
    assert.equal(doc.querySelectorAll("h1").length, 1, `${file}: one h1`);
    const ids = [...doc.querySelectorAll("[id]")].map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, `${file}: unique ids`);
    for (const input of doc.querySelectorAll("input,select,textarea"))
      assert.ok(
        input.closest("label") ||
          doc.querySelector(`label[for="${input.id}"]`) ||
          input.hasAttribute("aria-label"),
        `${file}: field has label`,
      );
    for (const link of doc.querySelectorAll('a[href^="/"]')) {
      const pathname = new URL(
        link.getAttribute("href"),
        "https://koradesk.test",
      ).pathname;
      assert.ok(
        existsSync(path.join("dist", pathname)) ||
          existsSync(path.join("dist", pathname, "index.html")),
        `${file}: ${pathname} exists`,
      );
    }
  }
});

test("moving benefit strips can pause and resume, and reduced motion disables them", () => {
  const p = page();
  const hero = p.doc.querySelector("[data-creative-hero]");
  const button = hero.querySelector("[data-ticker-pause]");
  assert.equal(hero.dataset.moving, "true");
  button.click();
  assert.equal(hero.dataset.moving, "false");
  assert.equal(button.getAttribute("aria-pressed"), "true");
  button.click();
  assert.equal(hero.dataset.moving, "true");
  p.close();
  const reduced = page("", (window) => {
    window.matchMedia = (query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    });
  });
  assert.equal(
    reduced.doc.querySelector("[data-creative-hero]").dataset.moving,
    "false",
  );
  assert.equal(reduced.doc.querySelector("[data-ticker-pause]").hidden, true);
  reduced.close();
});

test("ecosystem chapters reserve stock, preserve it on payment, and deduct only at pickup", () => {
  const p = page("ecosystem-preview");
  const root = p.doc.querySelector("[data-desk-demo]");
  const counts = () => ["on-hand", "reserved", "available"].map(key => Number(root.querySelector(`[data-${key}]`).textContent));
  for (const [channel, initial] of [["whatsapp", 3], ["website", 2], ["instore", 1]]) {
    root.querySelector(`[data-agent="${channel}"]`).click();
    assert.deepEqual(counts(), [initial, 0, initial]);
    const data = JSON.parse(root.querySelector("[data-demo-data]").textContent).find(s => s.id === channel);
    for (let i = 1; i < data.messages.length; i++) {
      root.querySelector("[data-next]").click();
      const [onHand, reserved, available] = counts();
      assert.equal(available, onHand - reserved);
      assert.ok(available >= 0);
      if (data.messages[i].text.includes("sample payment verified")) assert.deepEqual(counts(), [initial, 1, initial - 1]);
    }
    assert.deepEqual(counts(), [initial - 1, 0, initial - 1]);
    root.querySelector("[data-previous]").click();
    root.querySelector("[data-demo-reset]").click();
    assert.deepEqual(counts(), [initial, 0, initial]);
  }
  p.close();
});

test("ecosystem timed playback gates checkout and cancels old channel timers", () => {
  let clock;
  const p = page("ecosystem-preview", window => { clock = clockFor(window); });
  const root = p.doc.querySelector("[data-desk-demo]");
  root.querySelector("[data-play]").click();
  clock.advance(3100);
  assert.equal(root.dataset.playback, "awaiting-reply");
  root.querySelector("[data-quick-reply]").click();
  clock.advance(1550);
  assert.equal(root.querySelector("[data-reserved]").textContent, "1");
  root.querySelector('[data-agent="website"]').click();
  clock.advance(60000);
  assert.equal(root.dataset.messageCount, "1");
  assert.equal(root.querySelector("[data-reserved]").textContent, "0");
  assert.ok(root.querySelector(".chat-storefront"));
  root.querySelector("[data-play]").click();
  clock.advance(1550);
  assert.equal(root.dataset.playback, "awaiting-reply");
  root.querySelector("[data-quick-reply]").click();
  clock.advance(10000);
  assert.equal(root.dataset.complete, "true");
  assert.equal(root.querySelector("[data-on-hand]").textContent, "1");
  p.close();
});
