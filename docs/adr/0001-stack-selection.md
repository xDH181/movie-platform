# ADR-0001: Technology Stack Selection for Zero-Cost Platform

## Status
Accepted

## Context
We need to build a modern, production-grade movie streaming platform MVP with authentication, catalog, HLS streaming, and admin controls that operates reliably at zero monthly hosting cost under free tiers.

## Decision
1. **Frontend**: React + Vite + TypeScript hosted on Cloudflare Pages (unlimited bandwidth free tier).
2. **Backend**: Cloudflare Workers + Hono + Zod for lightweight, edge-native microsecond latency and 100k daily free requests.
3. **Database & Auth**: Supabase PostgreSQL and Supabase Auth (500MB DB, 50k MAU free tier).
4. **Media Storage**: Cloudflare R2 Standard (10GB free tier, zero egress fees).
5. **Transcoding**: Local FFmpeg pipeline (avoids expensive cloud compute).

## Consequences
- High performance and near-zero latency worldwide via Cloudflare CDN.
- Absolute cost immunity: no egress fees (R2 has 0$ egress).
- Storage ceiling of 8 GB safe margin requires careful rendition control (720p/480p).
