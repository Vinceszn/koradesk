# Kora Desk

Marketing website for **Kora Desk**: AI agents that run a small-business back office on WhatsApp. Naira pricing, guided 14-day pilot onboarding, pilot-stage social proof.

## Stack

Astro, Tailwind CSS v4, Markdown for the blog and help centre. English only for this first version. Sign-up is a guided pilot form (no self-serve product login). First verticals: food distribution and retail.

## Design system

Modern & minimal. Tokens live in the `@theme` block of `src/styles/global.css`: `ink` (near-black), `paper` (white), `surface` (alt sections), `sand` (hairline borders), `muted`, `accent` (deep emerald), `accent-bright` (on dark), plus `leaf`/`clay` for status. Type is Inter Variable with tight-tracked headings. Shared component classes: `.btn` (`btn-primary` / `btn-ghost` / `btn-accent` / `btn-light` / `btn-on-dark`), `.field`, `.eyebrow`, `.panel`, `.link-accent`, and `.prose-kora` for long-form content. Cards are white with hairline borders and a 16px radius; alternate sections use `bg-surface`, dark bands use `bg-ink`.

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

Forms keep a `localStorage` copy and hand off to WhatsApp or email compose, so the static site takes real enquiries without a backend.
