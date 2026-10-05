---
name: media-pipeline
description: >-
  Rules and runbooks for local media transcoding via FFmpeg: source inspection, HLS generation (720p/480p),
  master playlist creation, output validation, and metadata generation.
---

# Local Media Processing Pipeline

## Processing Flow
```text
source.mp4 -> FFmpeg Inspection -> Transcode to 720p & 480p HLS -> Generate Master Playlist -> Validate -> Package
```

## Rules & Standards
1. **Renditions**: MVP defaults strictly to `720p` and `480p`. Do NOT generate `1080p` by default to preserve storage and CPU budget.
2. **HLS Output Structure**:
   ```text
   movie-id/
   ├── master.m3u8
   ├── 720p/
   │   ├── playlist.m3u8
   │   └── segments...
   └── 480p/
       ├── playlist.m3u8
       └── segments...
   ```
3. **Validation**: Check playlist structure, verify segment duration and file sizes, ensure master references all renditions.
4. **Metadata**: Output duration, rendition list, and total size in bytes before upload.
