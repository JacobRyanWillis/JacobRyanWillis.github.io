import { projects } from '../../app/data/projects'
import { site } from '../../app/data/site'

export default defineEventHandler((event) => {
  const urls = ['/', ...projects.map((p) => `/projects/${p.slug}`)]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${site.url}${path}</loc></url>`).join('\n')}
</urlset>
`

  setHeader(event, 'Content-Type', 'application/xml')
  return body
})
