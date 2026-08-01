<script setup lang="ts">
import { SectionDefault, SectionCenterCard, SectionTwoColumn } from '#components'

const props = defineProps<{ item: Record<string, any> }>()

// WARP's display-field pattern: the block's `display` value names the
// component that renders it. Known variants resolve from the map; anything
// else is treated as a custom globally-registered component (that's why the
// variants live in components/global/), falling back to the default section.
const variants: Record<string, unknown> = {
  SectionDefault,
  SectionCenterCard,
  SectionTwoColumn,
}

const instance = getCurrentInstance()
const component = computed(() => {
  const display = props.item.display || 'SectionDefault'
  if (variants[display]) return variants[display]
  const custom = instance?.appContext.app.component(display)
  return custom ?? SectionDefault
})
</script>

<template>
  <component :is="component" :item="item" />
</template>
