# OpenCode Agent Skill: Hero Section Engineering
# Metadata
---
name: hero-sections
description: A generative system for inventing original website hero sections — combinatorial idea space, divergence methods, concept scoring, plus conversion copy, motion, accessibility, and Astro/Tailwind build specs.
version: 2.0.0
author: OpenCode UI Team
tags: [frontend, hero, landing-page, copywriting, conversion, creativity, tailwind]
---

## Core Intent
When this skill is activated, you are an inventor, not a librarian. You never pick a hero from a fixed list of styles — you generate fresh concepts from a combinatorial idea space, then score and refine them. Every hero you ship still answers three questions in under three seconds (what, who-for, what-next), shows the product in use, carries exactly one primary action, and proves its claims above the fold.

---

## 1. The Idea Space (six axes — combine, never shop)
A hero concept is one choice per axis. With 4–6 options each, the space holds thousands of concepts; most have never been built.

*   **SUBJECT — what the hero is about:** the product in action · the user's before-state · the after-state · the proof itself · the process · the objection being answered.
*   **STRUCTURE — how it fills the viewport:** split · centered · full-bleed · bento grid · immersive background · overlapping layers · sequential scroll acts.
*   **MOTION — what moves:** ambient loop · scroll-driven reveal · visitor-triggered playback · marquee/ticker · parallax depth · physics/playful response · none (stillness as contrast).
*   **PROOF — what makes it believable:** live product behavior · real artifacts (messages, receipts, alerts) · process transparency (pilot, humans, method) · numbers measured in-house · third-party voices · explicit absence of proof, stated honestly ("too early for stats — here's our method instead").
*   **ACTION — what the visitor does:** single CTA · forced choice between two segments · typed input that changes the hero · a micro-task inside the hero (tap, approve, play) · nothing (pure statement, action deferred below).
*   **TONE — how it feels:** bold · playful · editorial · dramatic · clinical · warm · defiant.

**Method:** roll one option per axis (deliberately include one uncomfortable pick), write the 2-sentence concept, repeat until you hold 6–8 candidates. Ten minutes, no judging yet.

---

## 2. Divergence Engines (run at least two per brief)
*   **SCAMPER the default:** Take the obvious hero (split layout, headline left, screenshot right) and force each move — Substitute the visual for live behavior; Combine hero with proof section; Adapt a pattern from another industry (election-night results boards, sports tickers, market stalls); Magnify one element 10× (a headline that fills the screen, a single giant button); Put the demo to another use (let visitors break it, not just watch it); Eliminate the headline entirely; Reverse the arc (show the resolution first, the chaos on scroll).
*   **Invert:** Design the worst possible hero (three CTAs, stock photo, lorem stats), then flip every property. The inverse of generic is usually specific — and specific converts.
*   **Time-slice:** Freeze one moment of user life (9pm chaos, 6am calm, payday, stock day) and build the hero inside that timestamp. Temporal specificity beats abstract benefit claims.
*   **Make the visitor act:** Replace passive viewing with a first-viewport verb — tap, choose, approve, play, type. Comprehension through doing beats comprehension through reading.
*   **Steal sideways:** Borrow mechanics from games (scores, streaks), markets (haggling, weighing), messaging (threads, ticks, typing), or broadcast (tickers, results graphics) — then re-skin in the product's own tokens.
*   **Subtract to amplify:** Remove headline, or visual, or CTA, or color. Whatever remains must work harder; what you add back earns its place.

---

## 3. Convergence (score, then commit)
Score each candidate 1–5 on four axes. Build the highest total; kill anything scoring 1 on Comprehension or Credibility regardless of total.

*   **Comprehension:** Can a stranger state product, audience, and action after 3 seconds? Test with the blur test — squint at the layout; the hierarchy must survive.
*   **Credibility:** Is every claim measured, shown live, or honestly framed as process? Invented testimonials, names, or statistics score 0 and disqualify.
*   **Conversion clarity:** One primary action, zero competitors. Secondary links, competing buttons, and "learn more" escape hatches each cost a point.
*   **Craft feasibility:** Buildable in the current stack (Astro + Tailwind + tokens) within the budget, under ~120 hero DOM nodes, with zero web requests in the visual.

**Novelty check (bonus point):** Name three live sites using this exact composition. If you can, run one more divergence pass — familiarity is the enemy.

---

## 4. Copy Formulas (apply to the winning concept)
*   **Eyebrow:** A live status signal, not a category label ("Now onboarding X in Y", "New: Z") with a pulsing dot — never "Welcome to Our Product".
*   **H1:** An outcome phrase a customer would say, under 10 words. Name the result, never the mechanism. One accent-colored word maximum.
*   **Lede:** One sentence: who it is for + what it does + the human guarantee. Cap ~25 words, `text-lg`–`text-xl`, muted for header/body drop-off.
*   **CTA + reassurance:** The single highest-intent action, ringed by friction removers (time, cost, commitment as a checks row) — never a rival button.
*   **Proof strip:** Real and verifiable only. No proof yet? Show process proof ("Guided pilot · Human onboarding") instead of inventing results.

---

## 5. Layout Engineering
*   **Viewport budget:** Eyebrow → H1 → lede → CTA → reassurance → visual/proof, in that order. Nothing else above the fold.
*   **Structure follows concept:** Let the winning combination dictate centered, split, or full-bleed — never default to split out of habit.
*   **Full-bleed elements:** Break tickers and marquees out of the container (`overflow-hidden` section, full-width rows). Fade edges with a monochrome mask, never a colored gradient wash.
*   **Rhythm:** Top `pt-16 md:pt-24`, bottom `pb-16 md:pb-20`. The hero is a poster, not a chapter.
*   **Type scale:** H1 `text-5xl md:text-6xl font-bold tracking-tighter leading-[1.02]`; lede `text-lg md:text-xl`; labels `text-xs`/`text-sm`. No arbitrary sizes.

---

## 6. Motion Spec
*   **Marquee recipe:** Track `display:flex; width:max-content; animation: scroll Xs linear infinite`; exactly two identical groups (`flex shrink-0 gap-3 pr-3`, second `aria-hidden`); keyframes to `translateX(-50%)`. Gap must equal trailing padding or the loop visibly jumps.
*   **Direction semantics:** Opposing flows for opposing ideas (problem one way, resolution the other).
*   **Restraint:** Max two concurrent animations (e.g., ticker + pulse). Floats stay within ±6px over 6s+. Transform and opacity only — never layout properties.
*   **Control:** Pause on hover; never autoplay sound; reduced-motion kills everything (see below).

---

## 7. Accessibility (non-negotiable)
*   **Reduced motion:** `@media (prefers-reduced-motion: reduce) { animation: none; }` on every animation. The static first frame must carry the full message alone.
*   **Screen readers:** Duplicated content `aria-hidden="true"` with one `sr-only` summary. Decorative visuals `aria-hidden`; status pills plain text.
*   **Targets & focus:** 44px minimums, global `:focus-visible` ring kept, AA contrast floor on body copy.
*   **Honesty:** Samples labeled as samples. Metrics measured or absent.

---

## 8. Implementation Rules (Astro + Tailwind v4)
1.  **Tokens only:** No hardcoded hex — visuals reuse the design-system palette. Inline `style` restricted to geometry (bar heights, widths).
2.  **Scoped motion CSS:** Keyframes in a `<style is:global>` block at the component bottom, named per-component.
3.  **Class order:** Layout → positioning → sizing → typography → decorative/motion.
4.  **Performance:** Pure CSS/SVG/DOM visuals, existing font package only, hero DOM under ~120 nodes, complete render with JS disabled.

---

## 9. Ship Checklist
1.  Concept documented as its six axis choices (enables deliberate iteration, not vibes).
2.  Headline passes the 3-second blur test.
3.  Exactly one primary CTA; novelty check run.
4.  Zero invented proof (grep names, stats, and hedging).
5.  `node --check` on emitted scripts; reduced-motion + 360px verified; build green.
