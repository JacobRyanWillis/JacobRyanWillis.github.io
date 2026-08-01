/**
 * Block X-ray: reveals the Directus anatomy of the page — every block gets
 * a dashed outline and a chip naming its collection and sort order.
 * The point of the whole site, made visible in one click.
 */
export function useXray() {
  const enabled = useState('xray', () => false)

  function toggle() {
    enabled.value = !enabled.value
  }

  // The class lives on <html> so the CSS can target blocks anywhere.
  if (import.meta.client) {
    watch(enabled, (on) => document.documentElement.classList.toggle('xray', on), {
      immediate: true,
    })
  }

  return { enabled, toggle }
}
