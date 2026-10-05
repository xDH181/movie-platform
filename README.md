# Zero-Cost Movie Streaming Platform

A production-ready movie streaming web platform operating completely at **$0/month within provider free tiers**.

---

## 🌟 Key Architecture
- **Frontend**: React + Vite + TypeScript + React Router + HLS.js (Cloudflare Pages)
- **Backend API**: Cloudflare Workers + TypeScript + Hono + Zod
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth
- **Media Storage**: Cloudflare R2 (HLS adaptive streams)
- **Transcoding**: Local FFmpeg pipeline (720p / 480p)

---

## 🚦 Gate Progress
The project is strictly managed via **15 sequential Gates** under Antigravity Workspace Rules.
See [`docs/gates/GATE_PLAN.md`](docs/gates/GATE_PLAN.md) and [`docs/agents/GATE_STATE.md`](docs/agents/GATE_STATE.md).

- **Current Gate**: Gate 0 — Project Bootstrap & Governance (`WAITING_FOR_USER`)

---

## 🔒 Security & Secrets
- Never commit `.env` or production credentials.
- Copy `.env.example` to `.env` for local configuration.
