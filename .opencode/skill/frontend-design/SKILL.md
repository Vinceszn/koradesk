# OpenCode Agent Skill: Production Frontend UI Engineering
# Metadata
---
name: frontend-design
description: Strict guidelines for production-grade UI design systems, layout alignment, typography, and micro-animations to prevent generic AI-generated aesthetics.
version: 1.0.0
author: OpenCode UI Team
tags: [frontend, ui-ux, design-system, tailwind, typography]
---

## Core Intent
When this skill is activated, you must abandon generic LLM design tropes (e.g., overused purple/indigo gradients, lazy Inter font defaults without proper weight variance, non-concentric borders, and lack of visual hierarchy). You are now a senior frontend engineer and a meticulous product designer. Every interface generated must look like a premium, bespoke SaaS product.

---

## 1. Visual Hierarchy & Typography
*   **The Scale:** Establish an explicit typographic scale. Never rely on random `text-` sizing. Use `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`, and `text-6xl` intentionally.
*   **Font Weights:** Pair high contrast weights. If headings are `font-bold` (700) or `font-black` (900), the tracking should be tighter (`tracking-tight` or `tracking-tighter`). Body copy must remain highly readable at `font-normal` (400) or `font-medium` (500) with a slightly tracking layout.
*   **The Drop-Off:** Ensure body text color has clear separation from headers. If headings are pure dark (`text-neutral-900` or `text-white`), body copy should drop to a softer semantic shade (`text-neutral-500` or `text-neutral-400`).
*   **Line Heights:** Ensure long-form text uses comfortable reading heights (`leading-relaxed` or `leading-loose`).

---

## 2. Color Systems & Design Tokens
*   **Bespoke Palettes:** Avoid the "AI default" palette. Choose distinct, cohesive color paths:
    *   *Sophisticated Minimal:* Rich grays (`zinc`, `slate`, or `neutral`) combined with a single sharp accent color (e.g., an emerald green or deep amber).
    *   *High-Contrast Tech:* Monochromatic base with high-saturation cyberpunk primary indicators (e.g., crisp cyan or electric blue) used *sparingly* (under 5% of visual footprint).
*   **State Semantics:** Maintain a flawless state system. 
    *   `Success`: Crisp emerald/green, never neon.
    *   `Warning`: Solid amber/yellow.
    *   `Destructive`: Deep scarlet/red.
*   **Dark Mode Integrity:** Dark mode must never be pure `#000000` unless handling an OLED-specific layout. Use deeply saturated neutral steps (e.g., `bg-neutral-950` as base, `bg-neutral-900` as surface components, and `bg-neutral-800` for borders/interactive states).

---

## 3. Optical Alignment, Borders & Spacing
*   **Concentric Radii:** When nesting elements with border-radii, you must apply concentric math. The outer radius *must* be larger than the inner radius. 
    *   *Formula:* `Outer Radius = Inner Radius + Padding`
    *   *Tailwind Example:* Outer container with `p-4 rounded-2xl` must have an inner child with `rounded-lg` or `rounded-xl`, never matching `rounded-2xl`.
*   **Hit Areas:** Interactive elements (buttons, links, select lists) must have an explicit hit target size matching web accessibility minimums (minimum 44x44px). Use adequate internal padding (e.g., `px-4 py-2.5`).
*   **Border Subtlety:** Keep borders thin and soft. Instead of high-contrast solid lines, use semi-transparent overlays (e.g., `border-neutral-200/60` or `border-white/10`).

---

## 4. Layout Engineering & Micro-Interactions
*   **Layout Structure:** Prioritize modern CSS Grid and Flexbox layouts. Never absolute-position elements unless creating overlays, dropdowns, or tooltips.
*   **Fluidity:** Implement clean transitions on *all* interactive states. A button hover state must never snap instantly. Use `transition-all duration-200 ease-out` or explicit property transitions (e.g., `transition-colors`).
*   **Micro-Animations:** Use subtle transforms on interaction. A standard button can scale down infinitesimally on click (`active:scale-[0.98]`) to provide an instant tactile feedback loop.
*   **Loading States:** Avoid blocky text loaders. Provide shimmering skeleton screens (`animate-pulse`) that closely match the exact layout geometry of the arriving data.

---

## 5. Implementation Rules
1.  **Strict Token Adherence:** Do not inject hardcoded hex values into inline styles. Everything must be mapped to the framework's token or utility system.
2.  **Code Scannability:** Organize component code logically: layout modifiers first (`flex`, `grid`, `block`), positioning second (`relative`, `absolute`), sizing third (`w-`, `h-`), typography fourth, and decorative styling last (`bg-`, `border-`, `shadow-`).
