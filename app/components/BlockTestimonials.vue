<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { attr } = useVisualEditing()
</script>

<template>
  <SectionShell :item="item" class="border-t border-default">
    <UContainer class="py-20 sm:py-24">
      <p
        class="eyebrow text-center"
        :data-directus="attr({ collection: 'block_testimonials', item: item.id, fields: 'eyebrow' })"
      >
        {{ item.eyebrow }}
      </p>
      <h2
        class="mt-2 text-center font-display text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
        :data-directus="attr({ collection: 'block_testimonials', item: item.id, fields: 'heading' })"
      >
        {{ item.heading }}
      </h2>

      <UCarousel
        v-slot="{ item: quote }"
        :items="item.quotes ?? []"
        loop
        dots
        :autoplay="{ delay: 6000 }"
        class="mx-auto mt-8 max-w-2xl"
        :ui="{ dot: 'w-6 h-1' }"
        :data-directus="attr({ collection: 'block_testimonials', item: item.id, fields: 'quotes' })"
      >
        <figure class="px-2 pb-4 text-center sm:px-10">
          <span class="font-display text-5xl leading-none text-warm-500" aria-hidden="true">&ldquo;</span>
          <blockquote class="mt-1 text-lg leading-relaxed text-toned sm:text-xl">
            {{ quote.quote }}
          </blockquote>
          <figcaption class="mt-6">
            <span class="font-semibold text-highlighted">{{ quote.name }}</span>
            <span v-if="quote.role" class="text-muted"> · {{ quote.role }}</span>
          </figcaption>
        </figure>
      </UCarousel>
    </UContainer>
  </SectionShell>
</template>
