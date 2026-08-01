<script setup lang="ts">
import type { Page } from '~/types/content'
import { BlockHero, BlockMetrics, BlockAbout, BlockProjects, BlockSkills, BlockCta, BlockSection, BlockEmbed, BlockTestimonials } from '#components'

const props = defineProps<{ page: Page }>()

const { attr } = useVisualEditing()

// The block renderer: each Directus block collection maps to one Vue
// component — the same pattern that powers Creation.com's pages.
const blockMap: Record<string, unknown> = {
  block_hero: BlockHero,
  block_metrics: BlockMetrics,
  block_about: BlockAbout,
  block_projects: BlockProjects,
  block_skills: BlockSkills,
  block_cta: BlockCta,
  block_section: BlockSection,
  block_embed: BlockEmbed,
  block_testimonials: BlockTestimonials,
}

const blocks = computed(() =>
  [...props.page.blocks]
    .sort((a, b) => a.sort - b.sort)
    .filter((block) => blockMap[block.collection]),
)
</script>

<template>
  <div>
    <!-- The block-level wrapper gives every section its own edit affordance in
         the visual editor (whole-block drawer), alongside the field-level ones
         inside each component — same layering WARP's blocks use. -->
    <div
      v-for="block in blocks"
      :key="block.id"
      v-reveal
      :data-directus="attr({ collection: block.collection, item: block.item.id })"
      :data-xray="`${block.collection} · sort ${block.sort}`"
    >
      <component :is="blockMap[block.collection]" :item="block.item" />
    </div>
    <XrayBanner />
  </div>
</template>
