<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()
</script>

<template>
  <section class="border-y border-default bg-elevated/50">
    <UContainer>
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
