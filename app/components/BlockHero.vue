<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-100),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-950),transparent_55%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      aria-hidden="true"
    />
    <UContainer class="relative pt-24 pb-20 sm:pt-32 sm:pb-28">
      <UBadge
        v-if="item.badge"
        :label="item.badge"
        color="primary"
        variant="subtle"
        size="lg"
        icon="i-lucide-sparkles"
        :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'badge' })"
      />
      <h1
        class="mt-6 text-4xl font-bold tracking-tight text-highlighted sm:text-6xl"
        :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'heading,subheading' })"
      >
        {{ item.heading }}
      </h1>
      <p class="mt-4 bg-linear-to-r from-accent-700 to-accent-400 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl dark:from-accent-300 dark:to-accent-500">
        {{ item.subheading }}
      </p>
      <p
        class="mt-6 max-w-2xl text-base leading-relaxed text-toned"
        :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'body' })"
      >
        {{ item.body }}
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <UButton :to="content?.settings.resume" icon="i-lucide-file-down" size="lg">
          Download Resume
        </UButton>
        <UButton
          :to="content?.settings.github"
          target="_blank"
          icon="i-lucide-github"
          size="lg"
          color="neutral"
          variant="outline"
        >
          GitHub
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
        <span class="ml-1 inline-flex items-center gap-1.5 text-sm text-muted">
          <UIcon name="i-lucide-map-pin" class="size-4" />
          {{ content?.settings.location }}
        </span>
      </div>
    </UContainer>
  </section>
</template>
