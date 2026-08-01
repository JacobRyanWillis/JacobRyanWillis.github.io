interface EditAttrOptions {
  collection: string
  item: string | number
  fields?: string
  mode?: 'drawer' | 'modal' | 'popover'
}

/**
 * Directus Visual Editing integration. Active only in live mode
 * (NUXT_PUBLIC_DIRECTUS_URL set): `attr()` stamps elements with the
 * `data-directus` attributes the overlay looks for, and `enable()`
 * loads the client library and applies the click-to-edit overlay.
 */
export function useVisualEditing() {
  const { directusUrl } = useRuntimeConfig().public
  const enabled = Boolean(directusUrl)

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

  function enable() {
    onMounted(async () => {
      if (!enabled) return
      const { apply } = await import('@directus/visual-editing')
      await apply({ directusUrl })
    })
  }

  return { enabled, attr, enable }
}
