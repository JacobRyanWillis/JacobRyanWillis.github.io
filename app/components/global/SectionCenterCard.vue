<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { attr } = useVisualEditing()
</script>

<template>
  <SectionShell :item="item">
    <UContainer class="py-16 sm:py-20">
      <div
        class="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-accent-200 bg-default p-8 text-center sm:p-12 dark:border-accent-900"
        :data-directus="attr({ collection: 'block_section', item: item.id, fields: 'headline,title,body,links' })"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent-100),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,var(--color-accent-950),transparent_60%)]"
          aria-hidden="true"
        />
        <div class="relative">
          <p v-if="item.headline" class="text-sm font-semibold tracking-widest text-primary uppercase">
            {{ item.headline }}
          </p>
          <h2 v-if="item.title" class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
            {{ item.title }}
          </h2>
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title ?? ''"
            class="mx-auto mt-6 w-full max-w-md rounded-xl border border-default"
          >
          <div class="mt-4 space-y-4 leading-relaxed text-toned">
            <p v-for="(paragraph, i) in String(item.body ?? '').split(/\n\n+/).filter(Boolean)" :key="i">
              {{ paragraph }}
            </p>
          </div>
          <div v-if="item.links?.length" class="mt-8 flex flex-wrap justify-center gap-3">
            <BlockLinks :links="item.links" />
          </div>
        </div>
      </div>
    </UContainer>
  </SectionShell>
</template>
