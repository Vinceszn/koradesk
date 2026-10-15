# Kora commerce MVP — working proposal

Status: proposed architecture, not an implemented commerce backend. The ecosystem-preview route is a marketing simulation.

## First customer and business experiment

Recruit 3–5 merchants selling countable physical products, each with one stock location. Start with one retail category and one payment provider. Onboard products from CSV and perform an opening physical count. Test a founding pilot price of NGN 5,000/month with explicit order and support limits. Measure weekly active merchants, completed orders, time to issue receipts, stock discrepancies, exceptions and support minutes. Revisit price after actual onboarding and running costs are known.

## Initial release

Merchant accounts and staff roles; products and size/colour variants; one stock location per merchant; stock receiving, adjustments and movement history; order reservation and expiry; walk-in sales; Paystack sandbox and then approved live integration; merchant-branded PDF receipts; manual WhatsApp sharing. Stock always belongs to a merchant and a location. Prepare the data model for more locations without building warehouse transfers yet.

Next: simple hosted storefront, then official WhatsApp automation using the same order functions. Existing-store integrations, supplier purchase orders, bundles, batches/expiry, serial numbers and voice require separate increments. Basic supplier records and manual stock receiving can ship in the initial release. Basic cost tracking is distinct from audited accounting or tax reporting.

## Stack

Retain Astro for the marketing site. A separate merchant application can use Next.js/TypeScript with Supabase Auth and PostgreSQL; choose hosting after the runtime requirements are fixed. Backend functions own inventory mutations and payment-provider access. A queue/worker handles receipts and messaging, with durable database outbox entries and retries. Keep the operational API shared by the merchant app, storefront and later WhatsApp tools.

## Main tables

- merchants, memberships: merchant ownership and staff permissions.
- products, variants: merchandising and unique per-merchant SKU; each variant is separately stocked.
- locations, inventory_balances: one row per merchant/location/variant with on_hand and reserved.
- stock_movements: append-only physical deltas with reason, actor, origin, quantity, unit cost and idempotency key. Correct mistakes through compensating entries.
- reservations: per-order/variant quantity, state and expiry; reservation history is separate from physical stock movement.
- orders, order_items: source channel, customer, independent order/payment/fulfilment state and snapshots of agreed price/product description.
- payment_attempts, payments, webhook_events: provider account binding, expected amount/reference, verified receipts of funds, event processing and deduplication.
- receipts, outbox_jobs: immutable receipt snapshots, private file keys, delivery status and retry state.

Use integer kobo for money. Start with integer units; fractional or weight-based stock requires defined units and exact decimal arithmetic. Include merchant_id on tenant-owned records and enforce tenant consistency on relationships, not merely UI filtering. Users may belong to several businesses via memberships. RLS restricts reads and writes to permitted merchant members; public storefront APIs expose only published products and safe availability, never customer/payment/cost data. Service keys remain server-side. Privileged functions must explicitly check membership/role; bypassing RLS is not authorization.

## Stock rules

available = on_hand - reserved. Default: no negative stock and no backorders.

| Event | On hand | Reserved |
|---|---:|---:|
| Receive 10 units | +10 | unchanged |
| Confirm order for 2 | unchanged | +2 |
| Verify full payment | unchanged | unchanged |
| Dispatch/pick up 2 | -2 | -2 |
| Cancel unpaid order/expire hold | unchanged | release remaining hold |
| Accept a resellable return | +accepted quantity | unchanged |
| Refund without physical return | unchanged | unchanged |

Paid orders retain their hold; the unpaid expiry worker must not release them. Partial fulfilment consumes only the dispatched quantity. Partial payments follow an explicit merchant policy; initially route them for review without automatically completing the order. Refund and restock are separate actions. Cash received is a merchant declaration with actor/audit trail, never labelled provider-verified.

## Atomic reservation

Inside ONE PostgreSQL transaction: authenticate and authorize; claim an idempotency key; lock balance rows in deterministic variant/location order; validate order state; check all requested quantities; insert reservations; increment reserved; update the order; commit. A multi-item order succeeds completely or rolls back completely. Never call a payment provider while holding database locks. An atomic conditional UPDATE is another viable strategy if every related write shares the same transaction.

For the last item, concurrent checkout B waits for A, then observes A's committed reservation and returns out of stock. Live browser counters are informative; the database decision at checkout is authoritative. Lock the order and related inventory consistently for payment/expiry/dispatch races, with deadlock retry handling.

## Payment and asynchronous work

Save an order/reservation before creating a provider payment attempt. Initialise payment outside inventory locks; persist provider reference with a unique constraint and recover ambiguous API timeouts by lookup before retry. Webhook endpoint validates raw-body signature, stores the event durably and acknowledges quickly. A worker verifies provider status, gross amount in kobo, currency, reference and merchant/provider-account binding. Transactionally mark the payment/order and add a receipt job; a unique provider transaction key prevents double credit.

If confirmation arrives after an expired hold: try to reserve stock atomically again. If unavailable, mark payment received/order requiring review and arrange a merchant-approved refund or alternative. Never ignore the payment or promise stock already sold. Reconcile pending payments periodically in case webhooks are delayed or missed. PDF/message failures do not reverse payment; retry the job. Deduplicate internal jobs, track external delivery attempts and do not promise mathematically exact-once delivery across external services.

## Build order and release gates

1. Merchant identity, roles, RLS and tenant-isolation tests.
2. Catalogue, variants, CSV import and opening stock/counts.
3. Movement ledger, balances, adjustments and reconciliation.
4. Orders, atomic reservations, expiry and walk-in fulfilment.
5. Provider verification, receipts, sharing and exception handling.
6. Deploy privately, rehearse backup restore, onboard pilots and monitor.
7. Storefront and WhatsApp automation on the same tested API.

Required tests: two orders racing for the last unit; failed multi-item reservation rolls back; retries don't reserve twice; duplicate webhooks don't credit/deduct twice; payment-versus-expiry race; late payment after sellout; duplicate dispatch; partial dispatch/cancellation; refunds without restock; damaged returns; cross-merchant reads and mutation attempts; payment totals and prices validated server-side; stock ledger reconciles with balances.

Sources: https://www.postgresql.org/docs/current/explicit-locking.html ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://supabase.com/docs/guides/database/functions ; https://paystack.com/docs/payments/verify-payments/ ; https://paystack.com/docs/payments/webhooks/
