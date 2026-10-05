---
name: playback
description: >-
  Rules for secure HLS playback: authorization before playback, token validation, HLS.js configuration,
  throttled watch progress reporting, and credential shielding.
---

# Secure HLS Playback Guidelines

## Playback Protocol
1. **Frontend never receives direct storage credentials** (R2 keys, access tokens, or admin secrets).
2. **Playback authorization** must happen before streaming access is granted:
   ```text
   User -> GET /playback/:movieId -> Worker validates user session -> Issues signed playback access / manifests
   ```
3. **Player Stack**: `HLS.js` for browsers supporting MSE; native HLS for iOS/Safari.
4. **Progress Throttling**: Watch position reporting must NOT execute every frame or second. Use throttled intervals (e.g. every 10–15s), and on `pause`, `seeked`, `ended`, and `beforeunload`.
