# Domain Glossary

- **Movie**: Main catalog item containing metadata, poster, and associated video renditions.
- **Rendition**: Specific video resolution and bitrate encoding (e.g. 720p at ~1800kbps, 480p at ~800kbps).
- **HLS (HTTP Live Streaming)**: Adaptive bitrate streaming protocol chopping media into short `.ts` segment chunks served via `.m3u8` playlist files.
- **Master Playlist (`master.m3u8`)**: Root manifest pointing to resolution-specific playlists.
- **Watch Progress**: User-specific playback tracking with bookmark timestamp in seconds.
- **Role**: Permission classification (`USER` for general consumers, `ADMIN` for catalog managers).
