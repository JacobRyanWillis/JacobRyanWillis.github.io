<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { attr } = useVisualEditing()
</script>

<template>
  <SectionShell :item="item">
    <UContainer class="py-16 sm:py-20">
      <div :data-directus="attr({ collection: 'block_section', item: item.id, fields: 'headline,title,body' })">
        <p v-if="item.headline" class="text-sm font-semibold tracking-widest text-primary uppercase">
          {{ item.headline }}
        </p>
        <h2 v-if="item.title" class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
          {{ item.title }}
        </h2>
        <div class="mt-4 max-w-3xl space-y-4 leading-relaxed text-toned">
          <p v-for="(paragraph, i) in String(item.body ?? '').split(/\n\n+/).filter(Boolean)" :key="i">
            {{ paragraph }}
          </p>
        </div>
      </div>
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title ?? ''"
        class="mt-8 w-full rounded-xl border border-default"
      >
      <div
        v-if="item.links?.length"
        class="mt-8 flex flex-wrap gap-3"
        :data-directus="attr({ collection: 'block_section', item: item.id, fields: 'links' })"
      >
        <BlockLinks :links="item.links" />
      </div>
    </UContainer>
  </SectionShell>
</template>
