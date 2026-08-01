# jacobryanwillis.github.io

My portfolio site — and my public code sample. Most of my production work lives in my
employer's private org repos, so this repo is intentionally built the way I build at work:
the same stack, the same page-block architecture, the same attention to SEO and performance.

**Live site:** [jacobryanwillis.github.io](https://jacobryanwillis.github.io)

## Stack

- **[Nuxt 4](https://nuxt.com)** + **Vue 3** + **TypeScript** — statically generated (`nuxt generate`)
- **[Nuxt UI v4](https://ui.nuxt.com)** + **Tailwind CSS v4** — custom accent palette, dark mode
- **[Directus 11](https://directus.io)** (Docker) — local authoring environment with visual editing
- **GitHub Pages** — deployed via GitHub Actions on every push to `main`

## Architecture

The homepage is not hardcoded markup — it's a Directus `pages` row composed of ordered
`pages_blocks` (a many-to-any junction: `collection` / `item` / `sort`), where each block
type is its own collection (`block_hero`, `block_metrics`, `block_about`, …). A dynamic
renderer ([`PageBlocks.vue`](app/components/PageBlocks.vue)) maps block types to Vue
components. This is a miniature of the page-block content engine I designed for
Creation.com — [read the case study](https://jacobryanwillis.github.io/projects/page-blocks).

### Content flow

```
Directus (Docker, local)  ──pnpm cms:sync──▶  content/snapshot.json + public/images/
     ▲        ▲                                        │
 author in    │ visual editing                          │ committed to git
 the app      │ (pnpm dev:live)                        ▼
              └── Nuxt renders live ◀─?─ Nuxt renders snapshot ──▶ GitHub Pages (static)
```

- **Snapshot mode (default & production):** the site builds entirely from
  [`content/snapshot.json`](content/snapshot.json) — no server, no external calls,
  GitHub Pages stays free and CI can never be broken by a down CMS.
- **Live mode (`pnpm dev:live`):** everything is fetched from the local Directus instead,
  and [Directus Visual Editing](https://directus.io/docs/guides/content/visual-editor)
  overlays click-to-edit controls on the running site.
- **Publishing an edit** = edit in Directus → `pnpm cms:sync` → review the diff → commit.
  Content changes are code-reviewed like everything else.

Other notes:

- **Fully prerendered.** Every route (each `/projects/[slug]` page and `sitemap.xml`
  included) is crawled and prerendered at build time — plain HTML, hydrated into a SPA.
- **SEO.** Per-page titles/descriptions and Open Graph tags via `useSeoMeta`, canonical
  URLs, `robots.txt`, and a sitemap generated from the same content that builds the pages.
- **Typed content.** One [`Snapshot`](app/types/content.ts) shape serves both modes, so
  components never care where content came from.

## Development

```bash
pnpm install
pnpm dev              # snapshot mode at localhost:3000

# Authoring environment
pnpm cms              # start Directus at localhost:8055 (docker compose)
pnpm cms:seed         # create schema + seed content (idempotent)
pnpm dev:live         # dev server rendering live from Directus + visual editing
pnpm cms:sync         # snapshot Directus content/assets back into the repo

pnpm generate         # static build to .output/public
```

Directus admin: `admin@example.com` / `portfolio` (local defaults, see `.env.example`).

## Deploying

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which runs `nuxt generate` (snapshot mode) and publishes `.output/public` to GitHub Pages.
