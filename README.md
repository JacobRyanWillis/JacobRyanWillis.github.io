# jacobryanwillis.github.io

My portfolio site — and my public code sample. Most of my production work lives in my
employer's private org repos, so this repo is intentionally built the way I build at work:
same stack, same conventions, same attention to SEO and performance.

**Live site:** [jacobryanwillis.github.io](https://jacobryanwillis.github.io)

## Stack

- **[Nuxt 4](https://nuxt.com)** + **Vue 3** + **TypeScript** — statically generated (`nuxt generate`)
- **[Tailwind CSS v4](https://tailwindcss.com)** — CSS-first config, custom accent palette, class-based dark mode
- **GitHub Pages** — deployed via GitHub Actions on every push to `main`

## Architecture notes

- **Content as typed data.** Case studies, skills, and site copy live in typed modules under
  [`app/data/`](app/data/). Pages render from data, so content edits never touch markup.
- **Fully prerendered.** Every route (including each `/projects/[slug]` page and `sitemap.xml`)
  is crawled and prerendered at build time — plain HTML on GitHub Pages, hydrated into a SPA.
- **SEO.** Per-page titles/descriptions and Open Graph tags via `useSeoMeta`, canonical URLs,
  `robots.txt`, and a sitemap generated from the same project data that builds the pages.
- **Theming.** Class-based dark mode with an inline head script that applies the stored (or
  OS-preferred) theme before first paint — no flash of the wrong theme.

## Development

```bash
npm install
npm run dev        # dev server at localhost:3000
npm run generate   # static build to .output/public
npx serve .output/public
```

## Deploying

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which runs `nuxt generate` and publishes `.output/public` to GitHub Pages.
