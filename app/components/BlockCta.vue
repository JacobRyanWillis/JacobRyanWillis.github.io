<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()
</script>

<template>
  <section class="border-t border-default bg-elevated/50">
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
          <p class="text-sm font-semibold tracking-widest text-primary uppercase">{{ item.eyebrow }}</p>
          <h2
            class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
            :data-directus="attr({ collection: 'block_cta', item: item.id, fields: 'heading,body' })"
          >
            {{ item.heading }}
          </h2>
          <p class="mt-4 max-w-2xl text-toned">{{ item.body }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <UButton :to="`mailto:${content?.settings.email}`" icon="i-lucide-mail" size="lg">
              {{ content?.settings.email }}
            </UButton>
            <UButton
              :to="content?.settings.linkedin"
              target="_blank"
              icon="i-lucide-linkedin"
              size="lg"
              color="neutral"
              variant="outline"
            >
              LinkedIn
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
