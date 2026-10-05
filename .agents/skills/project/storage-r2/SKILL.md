---
name: storage-r2
description: >-
  Rules for Cloudflare R2 object storage usage: path conventions, usage estimation, upload verification,
  and zero-cost boundary enforcement.
---

# Cloudflare R2 Storage Guidelines

## Storage Hierarchy
```text
movies/{movieId}/
├── master.m3u8
├── 720p/
│   ├── playlist.m3u8
│   └── *.ts
└── 480p/
    ├── playlist.m3u8
    └── *.ts
```

## Key Principles
1. **R2 stores only processed media** (HLS playlists and `.ts` chunks).
2. **Google Drive / Local Disk stores source and archive footage**, never R2.
3. **Database stores object paths and metadata keys**, never binary blobs.
4. **Pre-upload estimation**: Calculate total bytes before uploading to stay strictly under the project threshold.
