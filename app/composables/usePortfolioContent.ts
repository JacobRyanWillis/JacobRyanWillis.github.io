import type { Snapshot } from '~/types/content'
import snapshot from '~~/content/snapshot.json'

/**
 * Single content source for the whole site.
 *
 * - Default: the committed content snapshot (`content/snapshot.json`),
 *   exactly what production builds from — no server required.
 * - Live mode: when NUXT_PUBLIC_DIRECTUS_URL is set, everything is fetched
 *   from Directus instead, which also enables the visual editor.
 */
export function usePortfolioContent() {
  const { directusUrl } = useRuntimeConfig().public

  return useAsyncData<Snapshot>('portfolio-content', async () => {
    if (!directusUrl) return snapshot as Snapshot

    const items = <T>(path: string) =>
      $fetch<{ data: T }>(`/items/${path}`, { baseURL: directusUrl }).then((r) => r.data)

    const [rawSettings, metrics, skill_groups, rawProjects, pages] = await Promise.all([
      items<Record<string, any>>('site_settings'),
      items<Snapshot['metrics']>('metrics?sort=sort'),
      items<Snapshot['skill_groups']>('skill_groups?sort=sort'),
      items<Record<string, any>[]>('projects?sort=sort'),
      items<Snapshot['pages']>(
        'pages?fields=id,slug,title,description,blocks.id,blocks.collection,blocks.sort,blocks.item.*&deep[blocks][_sort]=sort',
      ),
    ])

    // Live mode returns Directus file ids; the snapshot stores local paths
    // (written by cms:sync). Map ids to asset URLs so both modes match.
    const asset = (fileId?: string | null, download = false) =>
      fileId ? `${directusUrl}/assets/${fileId}${download ? '?download' : ''}` : null

    const settings = {
      ...rawSettings,
      resume: asset(rawSettings.resume_file, true),
      headshot: asset(rawSettings.headshot),
    } as Snapshot['settings']

    const projects = rawProjects.map((p) => ({ ...p, image: asset(p.image) })) as Snapshot['projects']

    // Block items may carry image files too (content and background) — same mapping.
    for (const page of pages) {
      for (const block of page.blocks) {
        for (const key of ['image', 'bg_image']) {
          if (block.item?.[key]) block.item[key] = asset(block.item[key])
        }
      }
    }

    return { settings, metrics, skill_groups, projects, pages }
  })
}
