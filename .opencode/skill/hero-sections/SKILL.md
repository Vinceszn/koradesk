# OpenCode Agent Skill: Hero Section Engineering
# Metadata
---
name: hero-sections
description: Research-backed patterns and implementation rules for high-converting website hero sections — concept selection, outcome-led copy, motion, accessibility, and Astro/Tailwind build specs.
version: 1.0.0
author: OpenCode UI Team
tags: [frontend, hero, landing-page, copywriting, conversion, tailwind]
---

## Core Intent
When this skill is activated, you are a senior landing-page designer and conversion copywriter. The hero must answer three questions in under three seconds: what is this, who is it for, and what do I do next. Every hero you build shows the product in use, carries exactly one primary action, and proves its claims above the fold. Never ship abstract decoration, competing CTAs, or invented social proof.

---

## 1. Concept Patterns (pick one, commit fully)
*   **Product-Story Loop:** A looping micro-animation of one core workflow (message in → result out). Best when the product's value is hard to compress into a line. Auto-plays muted, loops seamlessly, respects reduced motion.
*   **Chaos Ticker:** Counter-scrolling marquee rows contrasting problem artifacts (alerts, screenshots, voice notes) against resolved outputs (drafts, receipts, flags). Best for products that absorb mess. Two rows, opposite directions, pause on hover.
*   **Before/After Bento:** A grid pairing a chaotic "before" cell with calm output cells. Best for multi-feature products needing one-glance comprehension. Keep cells to one idea each.
*   **Segmenting Hero:** Visitor picks their segment (role, trade, use case); headline, visual, and CTA adapt. Best when audiences diverge sharply. Chips must be 44px targets with pressed states.
*   **Editorial Statement:** Oversized type, minimal visual, proof strip. Best for strong brands with simple propositions. Typography carries the entire section — weight 700+, tighter tracking, one accent word maximum.
*   **Never:** Generic stock imagery, abstract geometric illustration as the sole visual, feature lists in the hero, or more than one primary CTA.

---

## 2. Copy Formulas
*   **Eyebrow:** A live status signal, not a category label. Prefer "Now onboarding X in Y" or "New: Z" with a pulsing dot over "Welcome to Our Product".
*   **H1:** An outcome phrase a customer would say, under 10 words. Name the result ("Close at 6pm, not 10pm"), never the mechanism ("AI-powered synergy platform"). One accent-colored word maximum.
*   **Lede:** One sentence: who it is for + what it does + the human guarantee. Cap at ~25 words, `text-lg` to `text-xl`, muted color for header/body drop-off.
*   **CTA:** Exactly one primary button taking the single highest-intent action. Surround it with friction removers (checks row: time, cost, commitment), never with a second competing button. A scroll-to-demo text link is a second CTA — cut it.
*   **Proof strip:** Real, verifiable signals only (languages supported, pilot status, message volumes, named integrations). Never invent testimonials, customer names, or statistics. If proof does not exist yet, show process proof ("Guided 14-day pilot · Human onboarding").

---

## 3. Layout Engineering
*   **Viewport budget:** Eyebrow → H1 → lede → CTA → reassurance → visual/proof, in that order. Nothing else above the fold.
*   **Centered vs split:** Centered (`max-w-4xl`, centered text) for story/ticker heroes with full-bleed elements below; split (`grid lg:grid-cols-2`) when the visual is a single product shot needing proximity to the copy.
*   **Full-bleed elements:** Tickers and marquees break out of the container (`overflow-hidden` on section, full-width rows). Fade row edges with a monochrome mask, never a colored gradient wash.
*   **Rhythm:** Hero top padding `pt-16 md:pt-24`, bottom `pb-16 md:pb-20`. Tighter than body sections — the hero is a poster, not a chapter.
*   **Type scale:** H1 `text-5xl md:text-6xl font-bold tracking-tighter leading-[1.02]`; lede `text-lg md:text-xl`; labels `text-xs`/`text-sm`. No arbitrary sizes.

---

## 4. Motion Spec
*   **Marquee recipe:** Track `display:flex; width:max-content; animation: scroll Xs linear infinite`. Inside, exactly two identical groups (`flex shrink-0 gap-3 pr-3`, second `aria-hidden`); keyframes to `translateX(-50%)`. Mismatched gaps break the loop — keep gap == trailing padding.
*   **Direction semantics:** Problem content and resolution content scroll opposite directions when both are present.
*   **Restraint:** Maximum two concurrent animations per hero (e.g., ticker + pulse dot). Float animations stay within ±6px over 6s+.
*   **Control:** Pause marquees on hover (`animation-play-state: paused`). Never autoplay sound. Never animate layout properties (width, height, top) — transform and opacity only.

---

## 5. Accessibility (non-negotiable)
*   **Reduced motion:** Every animation gets `@media (prefers-reduced-motion: reduce) { animation: none; }`. The static first frame must communicate the full message alone.
*   **Screen readers:** Duplicated marquee content is `aria-hidden="true"` with one `sr-only` summary of what the strip conveys. Decorative visuals are `aria-hidden`; status pills are plain text.
*   **Targets & focus:** All hero controls meet 44px minimums. The CTA keeps the global `:focus-visible` ring. Color contrast: body copy on backgrounds must pass AA (muted text on white is the floor, not the ceiling).
*   **Honesty:** Demos are labeled as samples/simulations. Metrics shown are measured or absent — never placeholders presented as results.

---

## 6. Implementation Rules (Astro + Tailwind v4)
1.  **Tokens only:** No hardcoded hex anywhere — visuals reuse the design-system palette (surface, bubble, accent, warning). Waveforms and decorative bars use token backgrounds with inline `style` restricted to geometry (heights, widths).
2.  **Scoped motion CSS:** Marquee keyframes live in a `<style is:global>` block at the bottom of the page/section component, named per-component (e.g., `.ticker-track`) to avoid collisions.
3.  **Class order:** Layout (`flex`, `grid`, `text-center`) → positioning → sizing (`max-w-`, `w-`) → typography (`text-`, `font-`, `tracking-`, `leading-`) → decorative (`rounded-`, `border-`, `bg-`, motion classes).
4.  **Performance:** No web requests in the hero visual — pure CSS/SVG/DOM. Fonts load via the existing font package; never add a second family for the hero. Keep hero DOM under ~120 nodes.
5.  **Reflow safety:** Ticker rows get fixed card widths (`w-60 sm:w-64 shrink-0`) so late font loads cannot shift the loop. Media-less heroes must not depend on JS to look complete.

---

## 7. Ship Checklist
1.  Headline passes the 3-second test (product, audience, action identifiable without scrolling).
2.  Exactly one primary CTA; every link in the hero audited for competition.
3.  Zero invented proof (grep names, stats, and hedging: `target`, `illustrative`, `sample` used as disclaimer).
4.  `node --check` passes on emitted page scripts; `prefers-reduced-motion` and 360px-wide viewport manually verified.
5.  Build is green and the hero renders complete with JS disabled.
