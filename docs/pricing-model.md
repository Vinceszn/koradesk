# Kora Desk — Pricing Model (no-loss edition)

Status: locked 7 Oct 2026. Re-run on: FX above ₦1,600/$, any Meta rate-card change, or gross margin below 40% for two running months. Inputs feed from the per-shop cost dashboard required by `architecture.md`.

## Assumptions (base case)
| Input | Value | Source |
|---|---|---|
| FX | ₦1,400 / $1 | working assumption — re-check at launch |
| Meta outbound service/utility, Nigeria | $0.007 ≈ **₦10/msg** | Oct 2026 cards ($0.0067–0.0074); stress case ₦14 |
| Inbound customer messages | free | Meta does not charge inbound |
| Free tier | 1,000 service msgs / number / month | Meta, from Oct 2026 |
| AI blended per conversation | **₦8** | ~30s voice (~₦4 Whisper API) + mini-LLM extraction (~₦2–4); text-only flows cheaper |
| Self-hosted ASR later | −₦5/conversation | faster-whisper + NaijaVox-class LoRA on owned VPS |
| No BSP margin | $0 | direct Cloud API (locked in architecture) |

## Message budgets per conversation (business-sent, chargeable)
| Flow | Messages | Notes |
|---|---|---|
| Order | 3.5 | draft + invoice + receipt + occasional reminder |
| Payment | 2.5 | reminder + receipt |
| Stock / Books touch | 1.5 | flags, summaries (mostly owner-initiated) |
| **Blended average** | **3.0** | enforced ceiling: no flow may exceed its budget without approval-gated batching |

Variable cost per conversation (base): 3.0 × ₦10 + ₦8 = **₦38**. Stress case (₦14/msg, ₦10 AI): **₦52**.

## Verdict on the old pricing (why it had to change)
| Plan | Old cap | Cost at 100% use (base) | Price | Margin |
|---|---|---|---|---|
| Starter ₦15,000 | 500 convos | 500 × 38 = ₦19,000 | ₦15,000 | **−27% UNDERWATER** |
| Growth ₦45,000 | 3,000 convos | 3,000 × 38 = ₦114,000 | ₦45,000 | **−153% CATASTROPHIC** |
| Partner ₦8,000/client | uncapped | unbounded | ₦8,000 | **UNBOUNDED RISK** |

The free tier softens Starter (1 number → ~285 conversations covered) but cannot save Growth. Caps, not prices, were the bug — plus one uncapped plan.

## Locked pricing (≥50% margin at 100% utilization, base case)
| Plan | Price | Included conversations | Cost at cap | Margin |
|---|---|---|---|---|
| Starter | ₦15,000/mo | **300** (~900 msgs, inside free tier) | ~₦2,400 | ~84% |
| Growth | ₦45,000/mo | **1,200** (~3,600 msgs − 3,000 free = 600 × 10 + AI 9,600) | ~₦15,600 | ~65% |
| Partner | ₦8,000/client/mo | **150 per client** | ~₦1,200–5,700 | 29–85% |
| 14-day pilot | free | **≤100 conversations** (≈₦2,000–3,800 CAC) | bounded | n/a |

Stress case (₦14/msg): Starter ≈ 80% margin, Growth ≈ 55%. Structure survives.

## Rules that keep it safe
1. **Overage packs, not throttling mid-month:** ₦5,000 per 100 extra conversations (≈₦50/convo vs ₦38 cost). The site already promises extra packs — keep that copy.
2. **Marketing/bulk broadcasts are excluded** from all plans (~₦72/msg in Nigeria). Either bill per-send at cost-plus or block bulk sends until a broadcast product exists. Never let a promo blast eat a plan's margin.
3. **Annual = 10 months** (unchanged). It prepays margin, not just revenue.
4. **Pilot cap is a CAC control**, not generosity: 100 conversations max, then convert or stop.
5. **Per-number free-tier harvesting:** pool shops so each number's 1,000 free messages are used before billable ones. Growth's 3 numbers ≈ 3,000 free msgs/mo is load-bearing in the math above.
6. **Fixed-cost break-even:** ~₦50k/mo fixed (VPS, domains, backups; founder labor unpriced) needs ≈ ₦50k gross margin ≈ 8 Starters or 1 Growth + 1 Starter at expected mix.

## What changes on the site
- Pricing page caps: Starter 500 → **300**, Growth 3,000 → **1,200** conversations/month.
- Partner page: add "**150 conversations per client included**, then overage packs."
- Pilot copy: add "**up to 100 conversations**" to the 14-day terms.
- Keep: overage-pack promise, annual 10-month framing, naira figures.
