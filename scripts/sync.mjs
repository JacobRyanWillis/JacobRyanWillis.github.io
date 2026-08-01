// Snapshots the local Directus instance into the repo:
//   - content/snapshot.json  (all site content, in render order)
//   - public/images/         (any Directus files referenced by content)
//
// Production builds read only the snapshot, so GitHub Pages never depends
// on a running Directus instance.
//
//   pnpm cms:sync   (then review the diff and commit)

import { writeFile, mkdir } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { login, api, DIRECTUS_URL } from './directus.mjs'

await login()

const [settings, metrics, skillGroups, projects, pages] = await Promise.all([
  api('/items/site_settings'),
  api('/items/metrics?sort=sort&limit=-1'),
  api('/items/skill_groups?sort=sort&limit=-1'),
  api('/items/projects?sort=sort&limit=-1'),
  api('/items/pages?fields=id,slug,title,description,blocks.id,blocks.collection,blocks.sort,blocks.item.*&deep[blocks][_sort]=sort&limit=-1'),
])

// Download referenced Directus files into public/ and rewrite references
// to local paths, so the static site is fully self-contained.
// dir: subfolder of public/. originalName: keep the human-readable filename
// (used for the resume so the URL stays presentable).
async function localizeFile(fileId, { dir = 'images', originalName = false } = {}) {
  if (!fileId) return null
  const targetDir = new URL(`../public/${dir}/`, import.meta.url)
  await mkdir(targetDir, { recursive: true })
  const file = await api(`/files/${fileId}`)
  const ext = (file.filename_download.match(/\.[a-z0-9]+$/i) ?? [''])[0]
  const filename = originalName ? file.filename_download : `${fileId}${ext}`
  const res = await fetch(`${DIRECTUS_URL}/assets/${fileId}`)
  if (!res.ok) throw new Error(`Asset download failed for ${fileId} (${res.status})`)
  await pipeline(Readable.fromWeb(res.body), createWriteStream(new URL(filename, targetDir)))
  console.log(`  downloaded ${dir}/${filename}`)
  return `/${dir}/${filename}`
}

const snapshot = {
  settings: {
    id: settings.id,
    name: settings.name,
    role: settings.role,
    tagline: settings.tagline,
    location: settings.location,
    email: settings.email,
    github: settings.github,
    linkedin: settings.linkedin,
    resume: await localizeFile(settings.resume_file, { dir: 'files', originalName: true }),
    headshot: await localizeFile(settings.headshot, { dir: 'images' }),
    url: settings.url,
    summary: settings.summary,
    private_work_note: settings.private_work_note,
    status: settings.status ?? null,
  },
  metrics: metrics.map((m) => ({ id: m.id, value: m.value, label: m.label, sort: m.sort })),
  skill_groups: skillGroups.map((g) => ({ id: g.id, title: g.title, items: g.items, sort: g.sort })),
  projects: await Promise.all(
    projects.map(async (p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      summary: p.summary,
      featured: p.featured,
      problem: p.problem,
      architecture: p.architecture,
      stack: p.stack,
      outcomes: p.outcomes,
      callout: p.callout,
      image: await localizeFile(p.image),
      demo_video: p.demo_video ?? null,
      site_url: p.site_url ?? null,
      sort: p.sort,
    })),
  ),
  pages: await Promise.all(
    pages.map(async (page) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description,
      blocks: await Promise.all(
        page.blocks.map(async (block) => {
          // Blocks may carry image files (content image, background image) —
          // localize them the same way project images are.
          const item = { ...block.item }
          for (const key of ['image', 'bg_image']) {
            if (item[key]) item[key] = await localizeFile(item[key])
          }
          return { id: block.id, collection: block.collection, sort: block.sort, item }
        }),
      ),
    })),
  ),
}

const target = new URL('../content/snapshot.json', import.meta.url)
await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`Snapshot written to content/snapshot.json (${snapshot.projects.length} projects, ${snapshot.pages.length} pages).`)
console.log('Review the diff, then commit to publish.')
