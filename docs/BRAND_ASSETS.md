# Kora logo-color refinement

The current preview snapshot includes a restrained emerald/yellow/pink/violet palette, tinted function cards and colored step/chapter numerals. Four transparent decorative enamel icons replace the function SVGs. See `references/kora-ui-preview/brand-colors.css` and `index.html` when porting to Astro.

Assets (built-in image generation, optimized to transparent 320px WebP):
- `references/kora-ui-preview/brand/commerce/orders-enamel-v1.webp`: emerald order clipboard and checkmark.
- `references/kora-ui-preview/brand/commerce/payments-enamel-v1.webp`: yellow receipt and payment coin.
- `references/kora-ui-preview/brand/commerce/inventory-enamel-v1.webp`: pink stock carton.
- `references/kora-ui-preview/brand/commerce/reporting-enamel-v1.webp`: violet ascending sales chart.

Shared generation prompt: Create one premium decorative Kora Desk feature icon, using the existing green hero button as the material reference and app icon as the palette reference. Glossy glazed enamel, dark forest-green sidewalls, delicate aged champagne-gold trim, soft studio highlights, softly rounded sculpted form, nearly front-on with a tiny 3D angle. Compact and readable at 80px. Isolated centered object, actual transparency, generous margins, no surrounding card, pedestal, background, text, numerals or mockup. Subject/color variants are listed above. Generated through the built-in image tool, not an API/CLI fallback.

HTML retains all headings, descriptions and link semantics. Artwork has empty alt text because the adjacent heading labels the function. Original SVG assets are retained. Four new images total 74,088 bytes. New accent foreground/background combinations passed 4.5:1 in light and dark themes. Visual browser QA remains unverified in this environment.

The private Sites publication source is commit `d1f2439ebe2c9eb46659897dc98ed472b8266cc7` (2026-10-15). This supersedes the earlier snapshot date mentioned in CODEX_HANDOFF.md.
