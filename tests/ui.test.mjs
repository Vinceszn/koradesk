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

test("all four sample actions complete, reverse, and reset without stale agent content", () => {
  const p = page();
  const { doc } = p;
  for (const id of ["orders", "payments", "stock", "books", "orders"]) {
    doc.querySelector(`[data-agent="${id}"]`).click();
    assert.equal(
      doc.querySelectorAll('[data-agent][aria-pressed="true"]').length,
      1,
    );
    assert.equal(doc.querySelector("[data-reply]").hidden, true);
    assert.equal(doc.querySelector(".desk-receipt").hidden, true);
    doc.querySelector("[data-demo-next]").click();
    assert.equal(doc.querySelector(".desk-receipt").hidden, false);
    assert.equal(doc.querySelector("[data-reply]").hidden, true);
    doc.querySelector("[data-demo-next]").click();
    assert.equal(doc.querySelector("[data-reply]").hidden, false);
    assert.equal(
      doc.querySelector("[data-desk-demo]").dataset.complete,
      "true",
    );
    doc.querySelector("[data-demo-next]").click();
    assert.equal(doc.querySelector("[data-reply]").hidden, true);
    doc.querySelector("[data-demo-next]").click();
    doc.querySelector("[data-demo-reset]").click();
    assert.equal(
      doc.querySelector("[data-desk-demo]").dataset.complete,
      "false",
    );
  }
  assert.deepEqual(p.errors, []);
  p.close();
});

test("two sample instances keep their selections and results isolated", () => {
  const p = page("", (window) => {
    const root = window.document.querySelector("[data-desk-demo]");
    root.after(root.cloneNode(true));
  });
  const [first, second] = p.doc.querySelectorAll("[data-desk-demo]");
  first.querySelector('[data-agent="stock"]').click();
  first.querySelector("[data-demo-next]").click();
  first.querySelector("[data-demo-next]").click();
  assert.equal(first.querySelector("[data-reply]").hidden, false);
  assert.equal(second.querySelector("[data-reply]").hidden, true);
  assert.equal(
    second.querySelector('[data-agent="orders"]').getAttribute("aria-pressed"),
    "true",
  );
  assert.match(second.querySelector("[data-total]").textContent, /192,500/);
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
