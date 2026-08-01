interface EditAttrOptions {
  collection: string
  item: string | number
  fields?: string
  mode?: 'drawer' | 'modal' | 'popover'
}

// Client-side handle to the applied overlay (module scope: one per tab).
let removeHandle: { remove: () => void } | null = null

/**
 * Directus Visual Editing integration. Active only in live mode
 * (NUXT_PUBLIC_DIRECTUS_URL set): `attr()` stamps elements with the
 * `data-directus` attributes the overlay looks for, `enable()` applies
 * the click-to-edit overlay on mount, and the staff toolbar toggles it
 * with `applyNow()` / `removeNow()`.
 */
export function useVisualEditing() {
  const { directusUrl } = useRuntimeConfig().public
  const enabled = Boolean(directusUrl)
  const active = useState('visual-editing-active', () => false)

  function attr(options: EditAttrOptions): string | undefined {
    if (!enabled) return undefined
    const parts = [
      `collection:${options.collection}`,
      `item:${options.item}`,
      options.fields ? `fields:${options.fields}` : null,
      `mode:${options.mode ?? 'drawer'}`,
    ]
    return parts.filter(Boolean).join(';')
  }

  async function applyNow() {
    if (!enabled || removeHandle) return
    const { apply } = await import('@directus/visual-editing')
    removeHandle = await apply({ directusUrl })
    active.value = true
  }

  function removeNow() {
    removeHandle?.remove()
    removeHandle = null
    active.value = false
  }

  function enable() {
    onMounted(applyNow)
    onUnmounted(() => {
      // Route changes remount pages; drop the stale overlay so applyNow can re-apply.
      removeNow()
    })
  }

  return { enabled, attr, enable, active, applyNow, removeNow }
}
