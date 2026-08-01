# CLAUDE.md

Personal portfolio (Nuxt 4 + Nuxt UI v4 + Tailwind v4 + Directus 11), statically
generated and deployed to GitHub Pages on every push to `main`. **pnpm only.**

## Commands

```bash
pnpm dev              # snapshot mode (renders content/snapshot.json)
pnpm cms              # local Directus at :8055 (admin@example.com / portfolio)
pnpm cms:seed         # idempotent schema + content seed (safe to re-run)
pnpm dev:live         # render live from Directus + visual editing overlay
pnpm cms:sync         # snapshot Directus content/assets back into the repo
pnpm generate         # static build to .output/public
```

## Content round-trip (the one rule that matters)

Production builds **only** from committed `content/snapshot.json` + `public/`.
Directus is a local authoring env, never a runtime dependency.

- Content edits: change in Directus (or edit snapshot.json + `cms:seed`), then
  `cms:sync` → review diff → commit.
- Schema changes: edit `scripts/seed.mjs` (idempotent upserts), run `cms:seed`,
  then `cms:sync`.
- **File fields (`image`, `bg_image`, `headshot`, `resume_file`) are owned by
  Directus and never re-seeded** — the snapshot stores local paths written by
  `cms:sync`; `seed.mjs` strips them before upserting. Keep it that way.

## Conventions

- Every section-level block supports `bg_color` / `bg_image` / `bg_opacity`,
  rendered by `SectionShell.vue`. Dark presets include `dark` in the class value
  so Nuxt UI tokens flip automatically — don't add per-field text colors.
- Project cover art: 1224×768 PNGs in the site palette (navy `#1F4E79` family /
  amber), uploaded to Directus Files → Projects as `cover-<slug>.png`. Gemini
  generations carry a sparkle watermark at the far right — crop to width 1224.
- New block types: create the collection in `seed.mjs`, add it to
  `BLOCK_COLLECTIONS`, map it in `PageBlocks.vue`.
- Headings use `font-display`, section eyebrows use the `.eyebrow` class,
  scroll animations use `v-reveal` (progressive enhancement — never hide
  content without JS).
- Verify visually before pushing: `pnpm generate`, serve `.output/public`, and
  screenshot with the Playwright headless shell cached in `~/.cache/ms-playwright`.

## Identity

Repo-local git identity uses the personal email (jacobwillis2012@gmail.com),
not the work one. This repo is public — it's the code sample for job
applications; write commit messages accordingly.
