# STREAMZERO — CINEMATIC DESIGN SYSTEM & VISUAL LANGUAGE (DESIGN.MD)

> **Role:** Lead Product Designer, Creative Frontend Engineer, Motion Designer  
> **Target Aesthetic:** Cinematic, Premium, Immersive, Refined, High-Contrast Dark Theater  
> **Core Anti-Patterns Avoided:** Generic SaaS templates, purple gradient soup, random floating blobs, indiscriminate glassmorphism, heavy border glow overload, identical card monotony, non-functional animation clutter.

---

## 1. Visual Philosophy: The Living Theater

StreamZero is engineered as an **intimate, high-contrast digital theater**.  
Rather than imposing artificial neon gradients or detached decorative blobs onto the screen, the interface draws its light, atmosphere, and emotional tone directly from the **cinematic content itself** — the photography, the letterboxing, the film stills, and the lighting of the films.

The UI acts as a refined, architectural frame: whisper-quiet when the user is watching, effortlessly responsive when browsing, and richly authoritative when highlighting curated cinema.

---

## 2. Color System: Obsidian & Film Gold

### Base Canvas & Surfaces (True Dark Theater)
| Token | Hex / Value | Purpose |
|:---|:---|:---|
| `--bg-base` | `#07080b` | True deep obsidian ground (avoids muddy grey, preserves OLED contrast) |
| `--bg-surface` | `#0d1017` | Structural page sections and content rails |
| `--bg-elevated` | `#131722` | Floating headers, filter toolbars, dialog surfaces |
| `--bg-card` | `#11141c` | Movie poster frames and preview cards |
| `--bg-card-hover` | `#181d2a` | Card hover state elevation |

### Text Hierarchy (High Legibility & Tone)
| Token | Hex / Value | Opacity / Role |
|:---|:---|:---|
| `--text-primary` | `#f8fafc` | 100% white — Film titles, primary actions, active tabs |
| `--text-secondary` | `#94a3b8` | 65% cool slate — Loglines, synopses, active metadata |
| `--text-tertiary` | `#64748b` | 40% deep slate — Timestamps, codecs, footnotes, borders |

### Deliberate Accent Palette (Content-Rooted)
*No rainbow soup. Accents are reserved exclusively for functional semantic cues:*
| Semantic Cue | Token | Hex | Usage Rule |
|:---|:---|:---|:---|
| **Film Gold** | `--accent-gold` | `#e5a93c` | Star ratings, awards, top 10 spotlights, critical acclaim |
| **Cinema Blue** | `--accent-brand` | `#38bdf8` | Primary watch CTAs, scrubber progress, key interactive focus |
| **Stream Emerald** | `--accent-stream` | `#10b981` | 0$ R2 Free Tier status, verified healthy HLS bitrate, published badges |
| **Film Crimson** | `--accent-crimson` | `#ef4444` | Heart favorite state, delete actions, warnings |

### Borders & Hairlines
| Token | Value | Note |
|:---|:---|:---|
| `--border-hairline` | `rgba(255, 255, 255, 0.07)` | Ultra-crisp razor hairline for separation without visual noise |
| `--border-focus` | `rgba(56, 189, 248, 0.45)` | Keyboard focus ring and subtle active outline |

---

## 3. Typography Architecture

### Font Pairing
- **Display & Headings:** `Outfit` (Geometric, wide proportion, high-impact cinema presence)
- **Body & Microcopy:** `Plus Jakarta Sans` (Clean, warm, ultra-readable at 13–15px)
- **Technical & Timecodes:** `ui-monospace, SFMono-Regular, "JetBrains Mono", monospace` (Tabular timecode, bitrates, resolutions, R2 metrics)

### Scale & Hierarchy
```text
Display 1 (Featured Hero Title):   clamp(2.5rem, 5vw, 4.2rem)  | Weight: 800 | Letter-spacing: -0.035em
Heading 1 (Page Title):            clamp(1.8rem, 3.5vw, 2.5rem)| Weight: 800 | Letter-spacing: -0.025em
Heading 2 (Rail / Section Title):  1.35rem — 1.5rem            | Weight: 700 | Letter-spacing: -0.02em
Heading 3 (Card / Modal Title):    1.05rem — 1.15rem           | Weight: 600 | Letter-spacing: -0.015em
Body (Synopses, Descriptions):     0.95rem — 1.05rem           | Line-height: 1.6
Metadata & Badges:                 0.75rem — 0.85rem           | Weight: 600 | Letter-spacing: 0.04em uppercase
Timecodes & Metrics:               0.80rem                     | Monospace tabular nums
```

---

## 4. Spacing, Geometry & Surface System

### Spacing Scale
- Base unit: `4px`
- Gaps: `8px (2xs)`, `12px (xs)`, `16px (sm)`, `24px (md)`, `32px (lg)`, `48px (xl)`, `64px (2xl)`
- Container max-width: `1320px` with responsive padding `1.5rem` (desktop) to `1rem` (mobile).

### Radii Hierarchy
- Posters & Media Frames: `10px` (crisp, filmic geometry)
- Dialogs & Surface Panels: `14px`
- Action Buttons & Chips: `8px` — `9999px` (pills for genre filters & technical tags)

### Layering & Depth (Selective & Functional)
1. **Background Layer (Z: 0):** Deep obsidian ground with natural subtle radial falloff derived from the active film backdrop.
2. **Content Layer (Z: 10):** Structured movie rails, detail views, search grid.
3. **Floating Navigation & HUD (Z: 50):** Sticky frosted glass header (`backdrop-filter: blur(20px)`, dark translucent wash).
4. **Modals & Overlays (Z: 100):** Widescreen preview player dialogs with deep dark veil (`rgba(0, 0, 0, 0.88)`).

---

## 5. Motion Design System (Purposeful & Fast)

### Standard Timings & Curves
- **Micro-interactions (Buttons, Toggles, Tags):** `140ms — 180ms` | `cubic-bezier(0.16, 1, 0.3, 1)`
- **Card Hover & Focus Elevation:** `220ms` | `cubic-bezier(0.2, 0.8, 0.2, 1)`
- **Section & Modal Transitions:** `320ms — 400ms` | `cubic-bezier(0.16, 1, 0.3, 1)`
- **Hero Spotlight Film Transitions:** `650ms` choreographed GSAP crossfade with text stagger.

### Accessibility Requirement
- Every animation respects `@media (prefers-reduced-motion: reduce)`.
- When reduced motion is active, all layout shifts, scale transforms, and slides collapse into clean instant cuts or pure opacity crossfades.

---

## 6. Page-Specific Design Guidelines

1. **Home Page (Priority ★★★★★):**
   - Widescreen 2.39:1 Cinemascope hero showcase with subtle pointer-aware backdrop perspective.
   - Elegant horizontal rails for "Continue Watching" (16:9 thumbnails with resume timecode) and "Curated Blockbusters" (2:3 vertical posters).
   - Precision Zero-Cost Telemetry Bar: Compact, informative status ribbon confirming R2 0$ egress & edge latency.

2. **Movie Cards:**
   - Subtle hover elevation (`translateY(-6px)`), crisp hairline border brightening, pointer-responsive soft illumination.
   - Quick preview action (instant Play, bookmark toggle, format tag `720p HLS`).

3. **Movie Detail Page (Priority ★★★★☆):**
   - High-contrast cinematic banner with gradient light-falloff masking.
   - Clear typographic hierarchy: Title -> Year / Duration / Rating -> Synopsis -> Cast & Technical specs.

4. **Watch Page (Priority ★★☆☆☆):**
   - The video is 100% the hero. Zero noisy background canvas or distracting particles.
   - Clean custom HLS player shell with precision scrub timeline, keyboard shortcuts (Space, Arrow keys, M, F, H for HUD), and optional stats HUD overlay.

5. **Search & Browse (Priority ★★★☆☆):**
   - Instant live filter chips, keyboard-ready search input (`⌘K`), clean count indicator.

6. **Admin Hub (Priority ★★☆☆☆):**
   - Clean data density, dark precision table, R2 storage gauge, publish/unpublish toggles. Zero extraneous consumer flash.
