<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { attr } = useVisualEditing()
</script>

<template>
  <SectionShell :item="item" class="border-t border-default">
    <UContainer class="py-20 sm:py-24">
      <div
        id="contact"
        class="relative scroll-mt-24 overflow-hidden rounded-2xl border border-accent-200 bg-default p-8 sm:p-12 dark:border-accent-900"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-accent-100),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,var(--color-accent-950),transparent_60%)]"
          aria-hidden="true"
        />
        <div class="relative">
          <p
            class="eyebrow"
            :data-directus="attr({ collection: 'block_cta', item: item.id, fields: 'eyebrow' })"
          >
            {{ item.eyebrow }}
          </p>
          <h2
            class="mt-2 font-display text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
            :data-directus="attr({ collection: 'block_cta', item: item.id, fields: 'heading' })"
          >
            {{ item.heading }}
          </h2>
          <p
            class="mt-4 max-w-2xl text-toned"
            :data-directus="attr({ collection: 'block_cta', item: item.id, fields: 'body' })"
          >
            {{ item.body }}
          </p>
          <div
            class="mt-8 flex flex-wrap gap-3"
            :data-directus="attr({ collection: 'block_cta', item: item.id, fields: 'links' })"
          >
            <BlockLinks :links="item.links" />
          </div>
        </div>
      </div>
    </UContainer>
  </SectionShell>
</template>
