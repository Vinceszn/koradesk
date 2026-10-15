# Kora Desk UI refresh

## Direction

A calm shop ledger: warm off-white, forest green, precise Inter typography,
editable agent symbols, and a message becoming an organised record. The live
sample is the signature interaction, next to the primary pilot action.

The original Astro/Tailwind static architecture, routes, contact configuration,
pricing amounts, and WhatsApp handoff remain in place. There is no new framework,
renderer, animation library, remote image requirement, or background animation.

## Changes

- Product sample moved into the hero; four scenarios can be completed, reversed,
  and reset. Static initial data remains visible without script execution.
- Scrolling marquees replaced with benefits, an agent directory, setup steps,
  owner-approval explanation, pricing, and FAQs.
- Shared light/dark tokens, button shape, forms, headings, and editable SVG
  symbols form one visual system. The second font family is no longer loaded.
- Annual prices disclose the total charged once yearly as well as the monthly
  equivalent. The time-value calculator follows the selected billing period.
  Unused inputs and the misleading recurring-cost "payback" output were removed.
- Pilot form labels/errors are explicitly associated; invalid submission focuses
  the first problem. Drafts use tab-scoped storage with visible failure feedback.
  Confirmation copy describes an unsent draft until the visitor sends WhatsApp.
- Mobile navigation is an inline disclosure, closes on Escape with focus return,
  and resets when moving to desktop. Cookie notice is a non-modal region.

## Motion

Only the sample reply enters on a user action (opacity and 7px translation,
280ms ease-out). It ends immediately, owns no timers or idle render loop, and is
static under reduced motion. Native button/link focus and touch interactions
use the same state changes. Hover arrows move 2px, with reduced-motion overrides.

## Validation

- `npm test`: builds 41 routes and runs nine integration checks against the
  actual built HTML/scripts in jsdom. No browser rendering is implied.
- Checked 32 text/control color pairs using the creative-ui `contrast.py`
  luminance functions: text >=4.5:1 and input borders >=3:1. This covers new
  palettes, both themes, placeholder/error colors, fixed demo and trust surfaces.
- Responsive arithmetic: 360px gives a 328px content container; sample tabs use
  four equal `minmax(0,1fr)` columns and receipt rows can wrap. The hero stacks
  below 900px; content/agent sections recompose below 640px. Pricing retains
  the existing 768px three-column breakpoint. No fixed-width canvas or imagery.
- Rendered desktop/mobile screenshots, actual text bounds, browser keyboard
  traversal, and performance profiling remain to be checked in a browser.
  The managed environment has no supported control-browser skill, so no preview
  server or substitute browser automation was started. A numeric creative-ui
  score is withheld until rendered QA can support it.

## Review before release

Review 360, 768, 900, 1280, and wide desktop widths, one pixel either side of
640/768/900/1024/1100/1440, and intermediate widths. Check both themes, keyboard
focus, all agent samples, annual billing reversal, pilot error correction, and
WhatsApp handoff. Existing contact details and product capability statements
come from the repository and need the product owner's factual verification.
