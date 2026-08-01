<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { attr } = useVisualEditing()
</script>

<template>
  <section>
    <UContainer class="max-w-3xl py-16 sm:py-20">
      <h2
        v-if="item.heading"
        class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
        :data-directus="attr({ collection: 'block_embed', item: item.id, fields: 'heading' })"
      >
        {{ item.heading }}
      </h2>
      <div
        class="mt-6"
        :data-directus="attr({ collection: 'block_embed', item: item.id, fields: 'url,caption' })"
      >
        <EmbedYouTube :url="item.url" :title="item.heading ?? undefined" />
        <p v-if="item.caption" class="mt-3 text-sm text-muted">{{ item.caption }}</p>
      </div>
    </UContainer>
  </section>
</template>
