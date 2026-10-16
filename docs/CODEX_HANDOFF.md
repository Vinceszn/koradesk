# Kora Desk — Codex handoff

## Start here

The editable Astro marketing site is in `src/`. The complete newer UI preview is in `references/kora-ui-preview/`, copied from Sites source commit `9e6c8548b6df5b82d3c7f7f1d2f352286bf988b8` on 2026-10-15. This snapshot is compiled HTML/CSS/JS, not editable Astro components or a working commerce backend. Original source files have been preserved.

Private visual preview: https://koradesk-ui-preview.cheeryeagle512.chatgpt.site
A separate Codex session may not have access to that private URL. Use the checked-in snapshot and assets as the reliable reference.

Preview the snapshot from the repository root:

```sh
python3 -m http.server 4322 --directory references/kora-ui-preview
```

Open http://localhost:4322. Serve this folder as the web root because its assets use root-relative paths. The snapshot is outside `public/` and is not included automatically in the Astro build. Do not edit generated snapshot files as the ongoing application source.

## Current backend plan

Read `docs/commerce-mvp.md` before planning or implementing the product. It now contains the inventory-first MVP scope and the complete proposed long-term backend architecture, updated 16 October 2026. The old `architecture.md` and `pricing-model.md` are superseded historical references. This is a blueprint, not an implemented backend or a production launch approval.

## Product direction

Kora is evolving into one commerce backend for inventory, orders, payments and receipts, shared across a merchant's online store, WhatsApp sales and physical counter. Advanced inventory belongs in the initial product scope. Older repository copy describes a WhatsApp AI back office; reconcile that copy with this direction before treating it as the product specification.

Confirmed design requirements:
- Preserve the existing visual character and uncluttered page.
- Use the newer preview copy and commerce demo as the current visual reference.
- Almost transparent floating Liquid Glass header, including dark and mobile states.
- Hero banner rows move in opposite directions, pause together during mouse hover or touch hold, and resume from the current position on release.
- Retain a manual pause control and reduced-motion support.
- Keep the green CTA free of an unwanted green rectangle behind its artwork.
- Use custom SVGs/images only where they clarify the product or improve the design.

Useful reference paths:
- `references/kora-ui-preview/index.html`: updated homepage, commerce demo, hero ticker logic.
- `references/kora-ui-preview/glass-header.css`: shared floating glass header.
- `references/kora-ui-preview/brand/commerce/`: artwork and editable SVG details.
- `references/kora-ui-preview/_astro/`: compiled styles, scripts and local fonts.
- All secondary routes are included in the snapshot.

## Recommended implementation sequence

1. Inspect the existing Astro project, scripts, design tokens, source components and docs. Keep the marketing site's working structure.
2. Port the newer preview into maintainable Astro components and shared styles. Make a clean build reproduce the approved preview. Avoid replacing source with compiled HTML.
3. Follow the proposed backend baseline in `docs/commerce-mvp.md`: retain Astro marketing, introduce a TypeScript/Next.js product/API layer, Supabase PostgreSQL/Auth/Storage, transactional stock commands, durable outbox/queues and a separate worker. Treat these as documented recommendations; resolve the listed merchant/provider/operational decisions at their milestone before live trading.
4. Implement the documented tenant-scoped model and release boundaries. The proposed MVP includes low-stock thresholds, basic supplier/cost records and one location per merchant. Supplier purchase orders, transfers and specialised warehouse features are later releases. Do not silently expand the initial scope.
5. Build a usable inventory-to-order flow with transactional stock reservations, cancellation/release, fulfilled stock deductions, and auditable adjustments. Prevent overselling under concurrent orders and prevent duplicate deductions on retries.
6. Connect verified payment-provider records to orders using references, amount and currency. Verify webhook signatures, apply idempotency, and support a transparent manual reconciliation flow. A screenshot alone does not prove payment.
7. Add storefront ordering and merchant-created WhatsApp/counter orders using the same inventory and order records.
8. Treat official WhatsApp API onboarding, templates and delivery as explicit integration work. Manual share links are a separate capability. Do not claim automated delivery is working before it is implemented.
9. Test tenant isolation, inventory concurrency, order cancellation, duplicate payment events and end-to-end checkout. Validate layout, navigation, touch/hover pause, dark mode and reduced motion on mobile and desktop.

These steps are a proposed build sequence, not a claim that the backend exists. The preview's animated sales, stock updates and payments are simulated. Preserve that distinction until real integrations are implemented. Do not add fake customer results or unsupported availability claims.

## Current verification

The source preview was privately deployed successfully. Script-level checks covered hover/touch release/cancel, manual pause, reduced motion, visibility and offscreen ticker states. Visual browser verification was unavailable in the original editing session; perform it when porting.

## Suggested first Codex task

Read docs/CODEX_HANDOFF.md. Inspect the existing Astro site and the complete UI snapshot in references/kora-ui-preview. Port the current preview into maintainable source components, preserving the design, copy, custom assets, Liquid Glass header and opposite-direction hero banners with hover/touch pause. Build and validate it. Then produce a concrete inventory-first product implementation plan and list the few remaining business decisions before building the backend.
