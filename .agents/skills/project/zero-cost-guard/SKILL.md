---
name: zero-cost-guard
description: >-
  Strict zero-cost operational guardrails: preventing inadvertent paid service enablement, enforcing storage
  thresholds (< 7GB healthy, 7-8GB warning, >= 8GB block), and auditing provider pricing.
---

# Zero-Cost Guardrails & Thresholds

## Thresholds (Cloudflare R2 Free Tier Margin)
- `< 7 GB`: **HEALTHY** - Normal operation.
- `7 - 8 GB`: **WARNING** - Alert user, recommend archiving old movies.
- `>= 8 GB`: **BLOCK** - Automatically prevent new media uploads to avoid exceeding Cloudflare's 10GB free tier.

## Golden Rules
1. **Never enable paid tiers or resources** automatically. If an activation prompts for a credit card or auto-billing, STOP and alert the user immediately.
2. **Design within Free Tiers**:
   - Cloudflare Pages: Unlimited requests, free hosting.
   - Cloudflare Workers: 100k requests/day free tier.
   - Cloudflare R2: 10 GB storage, 1M Class A operations/month, 10M Class B operations/month.
   - Supabase: 500 MB database, 50,000 MAU free tier.
3. Treat zero-cost as a **hard architectural requirement**.
