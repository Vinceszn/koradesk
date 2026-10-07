# Kora Desk — Backend Architecture (locked v1)

Status: locked 7 Oct 2026. Changes require re-running the pricing model in `pricing-model.md`.

## Design constraints
1. WhatsApp is the entire UI. No customer-facing app is ever built.
2. No money moves without a human tap. Approvals are load-bearing, not decorative.
3. Every inbound message, extraction, approval, and send is logged. Audit trail first, features second.
4. Unit economics are a design input: catalogued message budgets per flow (see pricing model). No flow may send unbounded business-initiated messages.

## Phase 0 — Concierge (weeks 1–4, no code)
Run pilots manually from the WhatsApp Business App following the agent playbook in `src/content/help/`. Goals: validate willingness to pay, harvest real voice notes and bank alerts as the eval dataset for Phase 1, and measure true messages-per-conversation before pricing is final.

## Phase 1 — Service topology (single VPS to start)

```
Customer WhatsApp
  → Meta WhatsApp Cloud API (direct, no BSP margin)
  → Webhook service (FastAPI, Python — best ASR/ML ecosystem)
  → Postgres (shops, price lists, orders, invoices, payments, stock ledger, approvals, message log)
  → Per-type pipeline → approval queue → Cloud API reply (interactive Approve/Reject buttons)
```

Why direct Cloud API, not a BSP (Twilio etc.): BSPs add ~$0.005/message on top of Meta's fee. At our volumes that margin matters; Cloud API has no platform fee.

## Pipelines
- **Voice notes:** download media → faster-whisper self-hosted with a Naija fine-tune (NaijaVox-2.0 class: Pidgin ~15% WER, Yoruba ~22%, Hausa ~26%) on the same VPS (CPU real-time per published setups) → OpenAI Whisper API as fallback only. Residual transcription error is absorbed by the order-draft confirmation loop, which already exists in the product.
- **Text/photos/screenshots:** vision-capable mini LLM extracts structured JSON (items, quantities, amounts, sender hints). Photos of handwritten lists and transfer screenshots go through the same extractor.
- **Matching:** price-list lookup in Postgres; payment matching is fuzzy (amount + sender + date window). Screenshot-only claims NEVER auto-clear an invoice — they queue for approval.
- **Payments (robust path):** per-invoice virtual accounts via Paystack/Moniepoint; their webhooks are the primary match signal. Bank alerts and screenshots are the fallback signal, always human-approved. This ordering exists because fake transfer alerts/screenshots are an active fraud vector in Nigeria.
- **Jobs:** payment reminders, 6pm summaries (scheduler on the same box to start; graduate to a worker queue with revenue).
- **Retention:** message content 18 months, backups 30 days, export-and-delete per request — as stated on /trust. Enforce with a scheduled purge job, not good intentions.

## Approvals
WhatsApp interactive reply buttons (Approve / Reject / Edit) on every money-touching action: orders above the shop's limit, all refunds and write-offs, all reorder drafts, all screenshot-matched payments. Every decision writes to the approvals audit table with actor, timestamp, and the exact payload approved. Most actions reversible 24h.

## Hosting (honest version)
- Start: one 4vCPU/8GB VPS (~$20–30/mo) + Postgres on the same box, nightly off-box backups. Graduate to managed Postgres with first revenue.
- Region honesty: no major cloud runs a Lagos region (AWS Africa is Cape Town). Start in Cape Town or EU, **disclose it**, and move to a Nigerian host when scale justifies it. The /trust page must not claim Lagos-region hosting until that is true.
- Reliability minimums from day one of automation: webhook signature verification, idempotent message ingestion (Meta retries webhooks), media download retry, dead-letter queue for failed sends, delivery-receipt tracking.

## Cost instrumentation (non-negotiable)
A daily per-shop cost dashboard from the first automated message: Meta spend (by category), AI spend (transcription + LLM), messages per conversation per flow. Pricing review triggers in `pricing-model.md` depend on this data existing. If it is not measured, margins are fiction.
