# AGENTS.md - Zero-Cost Movie Streaming Platform

Welcome to the **Zero-Cost Movie Streaming Platform** repository.

This project operates within **Không Gian Riêng** (`projects/movie-platform/`) and inherits all shared skills, agent roles, and workspace safety rules from the root workspace (`DH181_worksapce`).

---

## 1. Governance & Instruction Hierarchy
All agents operating in this project must strictly comply with the **40 Workspace Rules** ([`.agents/rules/gate-control-and-safety.md`](../../.agents/rules/gate-control-and-safety.md)) and the **14 Orchestration Principles** ([`.agents/rules/automatic-agent-and-skill-orchestration.md`](../../.agents/rules/automatic-agent-and-skill-orchestration.md)).

Priority:
```text
1. Explicit current user instruction
2. Current Gate requirements
3. Project AGENTS.md
4. Project-specific rules / skills (.agents/skills/project/)
5. Workspace rules (.agents/rules/)
6. Global / shared skills (shared/skills/)
7. Agent default behavior
```

---

## 2. Gate Control & Gate Sequence
This project is structured into 15 sequential gates (Gate 0 through Gate 14).
Current Gate progress is tracked in [`docs/agents/GATE_STATE.md`](docs/agents/GATE_STATE.md).

- **Current Gate**: Gate 0 — Project Bootstrap & Governance
- **Rule**: No Gate may self-approve. Only the user can issue `PASS GATE N`.
- **Backup Rule**: Automatic 3-slot rotating backup (`backup/auto-1`, `backup/auto-2`, `backup/auto-3`) is triggered **only after** user approval.

---

## 3. Technology Stack & Boundaries
- **Frontend**: React + Vite + TypeScript + React Router + HLS.js (Cloudflare Pages)
- **Backend**: Cloudflare Workers + TypeScript + Hono + Zod
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Video Storage**: Cloudflare R2 (720p/480p HLS chunks)
- **Source / Archive**: Google Drive / Local disk
- **Transcoding**: Local FFmpeg pipeline (`tools/media/`)

**Crucial Constraints**:
- Backend does NOT transcode video and does NOT proxy raw media files in normal playback.
- Database stores only metadata and storage keys, NEVER binary video files.
- MVP renditions are strictly limited to `720p` and `480p`.

---

## 4. Available Skills
- **Project Skills**:
  - [`movie-domain`](.agents/skills/project/movie-domain/SKILL.md)
  - [`media-pipeline`](.agents/skills/project/media-pipeline/SKILL.md)
  - [`playback`](.agents/skills/project/playback/SKILL.md)
  - [`storage-r2`](.agents/skills/project/storage-r2/SKILL.md)
  - [`zero-cost-guard`](.agents/skills/project/zero-cost-guard/SKILL.md)
- **Shared Workspace Skills**:
  - `to-spec`, `to-tickets`, `implement`, `tdd`, `code-review`, `diagnosing-bugs`
  - `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`
