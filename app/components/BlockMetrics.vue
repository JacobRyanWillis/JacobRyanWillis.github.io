<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()
</script>

<template>
  <section class="border-y border-default bg-elevated/50">
    <UContainer>
      <div
        v-if="item.eyebrow || item.heading"
        class="pt-12"
        :data-directus="attr({ collection: 'block_metrics', item: item.id, fields: 'eyebrow,heading' })"
      >
        <p v-if="item.eyebrow" class="text-sm font-semibold tracking-widest text-primary uppercase">
          {{ item.eyebrow }}
        </p>
        <h2 v-if="item.heading" class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
          {{ item.heading }}
        </h2>
      </div>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-8 py-12 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="metric in content?.metrics"
          :key="metric.id"
          :data-directus="attr({ collection: 'metrics', item: metric.id, fields: 'value,label' })"
        >
          <dd class="bg-linear-to-br from-accent-600 to-accent-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent tabular-nums dark:from-accent-300 dark:to-accent-500">
            {{ metric.value }}
          </dd>
          <dt class="mt-1.5 text-xs leading-snug text-muted">{{ metric.label }}</dt>
        </div>
      </dl>
    </UContainer>
  </section>
</template>
