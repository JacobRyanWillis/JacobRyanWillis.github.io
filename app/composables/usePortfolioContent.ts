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

    const [settings, metrics, skill_groups, projects, pages] = await Promise.all([
      items<Snapshot['settings']>('site_settings'),
      items<Snapshot['metrics']>('metrics?sort=sort'),
      items<Snapshot['skill_groups']>('skill_groups?sort=sort'),
      items<Snapshot['projects']>('projects?sort=sort'),
      items<Snapshot['pages']>(
        'pages?fields=id,slug,title,description,blocks.id,blocks.collection,blocks.sort,blocks.item.*&deep[blocks][_sort]=sort',
      ),
    ])

    return { settings, metrics, skill_groups, projects, pages }
  })
}
