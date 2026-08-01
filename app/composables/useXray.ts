/**
 * Block X-ray: reveals the Directus anatomy of the page — every block gets
 * a dashed outline and a chip naming its collection and sort order, and
 * every editable element gets a label listing its fields.
 * The point of the whole site, made visible in one click.
 *
 * Field labels are parsed from the same `data-directus` attributes the
 * visual editor uses (`collection:…;item:…;fields:a,b;mode:…`), so the
 * X-ray always matches exactly what the editor exposes.
 */

// Wire the DOM effects once, no matter how many components call useXray().
let wired = false

function stampFieldLabels() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-directus]')) {
    const meta: Record<string, string> = {}
    for (const part of (el.dataset.directus ?? '').split(';')) {
      const i = part.indexOf(':')
      if (i > 0) meta[part.slice(0, i)] = part.slice(i + 1)
    }
    // Elements without a fields list are whole-block wrappers — they carry
    // their own data-xray chip already.
    if (!meta.fields || !meta.collection) continue

    // Prefix the collection only when it differs from the enclosing block's
    // (e.g. site_settings fields rendered inside the hero).
    const blockCollection = el.closest<HTMLElement>('[data-xray]')?.dataset.xray?.split(' ')[0]
    const fields = meta.fields.split(',').join(' · ')
    el.dataset.xrayField =
      meta.collection === blockCollection ? fields : `${meta.collection}: ${fields}`
  }
}

export function useXray() {
  const enabled = useState('xray', () => false)

  function toggle() {
    enabled.value = !enabled.value
  }

  if (import.meta.client && !wired) {
    wired = true
    const router = useRouter()

    // The class lives on <html> so the CSS can target blocks anywhere.
    watch(
      enabled,
      (on) => {
        document.documentElement.classList.toggle('xray', on)
        if (on) nextTick(stampFieldLabels)
      },
      { immediate: true },
    )

    // Page navigations mount fresh elements — restamp once they exist.
    router.afterEach(() => {
      if (enabled.value) nextTick(() => setTimeout(stampFieldLabels, 100))
    })
  }

  return { enabled, toggle }
}
