---
name: movie-domain
description: >-
  Explains the core domain models and lifecycles of the Zero-Cost Movie Streaming Platform:
  Movie, Genre, User, Favorite, WatchHistory, Admin, and Media lifecycle states.
---

# Movie Platform Domain Models

## Core Entities
- **Movie**: Title, slug, description, release year, duration, poster URL, status (`DRAFT`, `SOURCE_READY`, `PROCESSING`, `READY`, `PUBLISHED`, `FAILED`).
- **Genre**: ID, name, slug.
- **MovieGenre**: Many-to-many relationship connecting movies to genres.
- **Profile / User**: Supabase Auth user extension with `role` (`USER` or `ADMIN`).
- **Favorite**: Per-user bookmarked movies.
- **WatchHistory**: Per-user watch progress with `last_position_seconds`, `completed` flag, and `updated_at`.

## Media Lifecycle State Machine
```text
[DRAFT] -> [SOURCE_READY] -> [PROCESSING] -> [READY] -> [PUBLISHED]
                                   │
                                   v
                                [FAILED]
```
- Only movies with status `PUBLISHED` appear on the public catalog.
- Only users with `ADMIN` role can transition media states or publish movies.
