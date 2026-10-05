# Architecture System Overview

## 1. High-Level Data Flow

```text
                    USER BROWSER
                         │
                         ▼
               React Frontend (Vite)
                         │
                    REST API (JSON)
                         │
                         ▼
           Cloudflare Worker (Hono + Zod)
              │                     │
              ▼                     ▼
      Supabase PostgreSQL   Playback Auth Service
      (Metadata & Auth)             │
                                    ▼
                              Cloudflare R2
                           (HLS Manifest & Chunks)
                                    │
                                    ▼
                         HLS.js Video Stream
```

## 2. Media Pipeline Boundary
Video transcoding is performed completely out-of-band on the local machine:

```text
Google Drive / Local Disk
           │
           ▼
   Raw Source (MP4)
           │
           ▼
  Local FFmpeg Engine
     ┌─────┴─────┐
     ▼           ▼
   720p        480p
     └─────┬─────┘
           ▼
    HLS Chunks + Master
           │
           ▼
  Cloudflare R2 Storage
```

## 3. Core Architectural Invariants
1. **Zero Raw Video in Backend**: Cloudflare Workers never proxy or decode raw movie files.
2. **Zero Binary Blobs in Database**: PostgreSQL stores strictly entity records, status flags, and storage keys.
3. **No Direct Storage Credentials in Frontend**: The frontend client never has direct R2 credentials.
4. **Resolution Budget**: Default renditions are constrained to 720p and 480p.
