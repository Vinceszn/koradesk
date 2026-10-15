# Kora Desk

Marketing website for **Kora Desk**: AI agents that run a small-business back office on WhatsApp. Naira pricing, guided 14-day pilot onboarding, pilot-stage social proof.

## Stack

Astro, Tailwind CSS v4, Markdown for the blog and help centre. English only for this first version. Sign-up is a guided pilot form (no self-serve product login). First verticals: food distribution and retail.

## Design system

Modern & minimal. Tokens live in the `@theme` block of `src/styles/global.css`: `ink`, `paper`, `surface`, `sand`, `muted`/`faint`, `accent` (plus `accent-deep`/`accent-soft`/`accent-bright`), `leaf`/`clay`/`warning` for status, `sun`/`blush`/`lavender` agent colors, and `chat`/`bubble`/`bubble-out`/`tick`/`whatsapp` chat tokens. Type is Inter Variable for body with Nunito Variable display headings (`font-display`, tight-tracked `h1`–`h4`). Shared component classes: `.btn` (`btn-primary` / `btn-accent` / `btn-ghost` / `btn-light` / `btn-on-dark`), `.field`, `.eyebrow` (plus `.eyebrow-bright` on dark), `.link-accent`, and `.prose-kora` for long-form content. `CheckIcon` (`ink`/`accent`/`plain` tones) and `AgentIcon` (per-agent tinted tile) live in `src/components`. Dark mode remaps the tokens under a `.dark` class toggle (header button, `kora-theme` in `localStorage`, pre-paint inline script in `BaseLayout`). Cards use hairline borders and a 16px radius; alternate sections use `bg-surface`, dark bands use `bg-ink`.

## Run locally

```bash
cd kora-desk
npm install
npm run dev
```

Then open the URL Astro prints (usually `http://localhost:4321`).

## What is in this version

- Home, product (four agents), how it works, audience pages, pricing with annual toggle and ROI calculator
- Customers, trust, resources (help, blog, templates), about, contact, legal
- Guided pilot form with WhatsApp number validation and a confirmation page
- Demo booking and partner enquiry via WhatsApp/email handoff, cookie consent banner
- Tap-through WhatsApp demo (no autoplay, respects reduced motion)

The pilot form saves a tab-scoped draft and hands off to WhatsApp after review. Other enquiry forms use WhatsApp or email compose. No backend submission is implied.

## UI refresh

The original playful brand system is retained: Nunito headlines, colourful
agent artwork, crossed-out paperwork, moving benefits, and tilted cards.
`HeroDesk` powers the three-stage sample inside `DemoPhone` on the homepage and
walkthrough. Its message, draft, and result states are reversible. The benefit
strips include user pause, off-screen/hidden-tab suspension, and reduced motion.

Shared colour/type tokens remain in `global.css`; demo and form refinements live
in `refresh.css`. Annual prices show their actual yearly charge. Pilot drafts
use `sessionStorage` until the tab closes and are sent only after the visitor
chooses the WhatsApp handoff.

Run `npm test` to build all 41 routes and exercise the built HTML/scripts in DOM
simulation. Ten checks cover sample progression and isolation, motion controls,
billing/calculator updates, pilot validation/storage failures, safe draft review,
navigation, and local destinations. Rendered browser QA remains separate.
See `docs/ui-refresh.md` for the visual thesis, motion contract, and QA limits.
