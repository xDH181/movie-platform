# Zero-Cost Limits & Operational Guardrails

## Provider Free-Tier Limits
| Service | Free Tier Allocation | Project Usage Target | Safety Margin Threshold |
|:---|:---|:---|:---|
| **Cloudflare R2** | 10 GB Storage / mo<br/>1M Class A ops / mo<br/>10M Class B ops / mo | <= 8 GB Total Media | Warning: >= 7 GB<br/>Block: >= 8 GB |
| **Cloudflare Workers** | 100,000 requests / day | < 30,000 requests / day | Cache API responses & static assets |
| **Cloudflare Pages** | Unlimited bandwidth & requests | Production Web Hosting | Zero bandwidth cost |
| **Supabase Free** | 500 MB Database<br/>50,000 Monthly Active Users | < 50 MB Metadata | Indexed queries, small payloads |

## Guardrail Implementation Rules
1. **Upload Blocker**: The upload tool in `tools/media/` MUST calculate existing R2 storage footprint + pending upload size. If projected size exceeds 8 GB, automatic upload is aborted.
2. **Billing Guard**: Under NO circumstances will automated tools enable paid add-ons, higher tiers, or auto-recharge.
