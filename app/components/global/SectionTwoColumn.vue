<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { attr } = useVisualEditing()
</script>

<template>
  <section class="border-t border-default bg-elevated/50">
    <UContainer class="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
      <div :data-directus="attr({ collection: 'block_section', item: item.id, fields: 'headline,title,body,links' })">
        <p v-if="item.headline" class="text-sm font-semibold tracking-widest text-primary uppercase">
          {{ item.headline }}
        </p>
        <h2 v-if="item.title" class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
          {{ item.title }}
        </h2>
        <div class="mt-4 space-y-4 leading-relaxed text-toned">
          <p v-for="(paragraph, i) in String(item.body ?? '').split(/\n\n+/).filter(Boolean)" :key="i">
            {{ paragraph }}
          </p>
        </div>
        <div v-if="item.links?.length" class="mt-8 flex flex-wrap gap-3">
          <BlockLinks :links="item.links" />
        </div>
      </div>
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title ?? ''"
        class="w-full rounded-xl border border-default"
      >
      <div
        v-else
        class="hidden aspect-video items-center justify-center rounded-xl border border-dashed border-default text-sm text-dimmed lg:flex"
      >
        Add an image in Directus
      </div>
    </UContainer>
  </section>
</template>
