<script setup lang="ts">
const props = defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

// Autoplay the background loop only for users who haven't asked for reduced
// motion — everyone else gets the bg_image (or nothing) as a still fallback.
const allowMotion = ref(false)
onMounted(() => {
  allowMotion.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
const showVideo = computed(() => Boolean(props.item.bg_video) && allowMotion.value)
</script>

<template>
  <section class="relative overflow-hidden">
    <div v-if="showVideo || item.bg_image" class="pointer-events-none absolute inset-0" aria-hidden="true">
      <video
        v-if="showVideo"
        :src="item.bg_video"
        :poster="item.bg_image ?? undefined"
        autoplay
        muted
        loop
        playsinline
        disablepictureinpicture
        class="h-full w-full object-cover"
        :style="{ opacity: String((item.bg_opacity ?? 30) / 100) }"
      />
      <img
        v-else-if="item.bg_image"
        :src="item.bg_image"
        alt=""
        class="h-full w-full object-cover"
        :style="{ opacity: String((item.bg_opacity ?? 30) / 100) }"
      >
      <!-- Fade the layer toward the text edge so the hero copy stays readable -->
      <div class="absolute inset-0 bg-linear-to-r from-default via-default/70 to-transparent" />
    </div>
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-100),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-950),transparent_55%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
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
        class="mt-6 font-display text-4xl font-extrabold tracking-tight text-highlighted sm:text-6xl"
        :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'heading' })"
      >
        {{ item.heading }}
      </h1>
      <p
        class="mt-4 bg-linear-to-r from-accent-700 to-accent-400 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl dark:from-accent-300 dark:to-accent-500"
        :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'subheading' })"
      >
        {{ item.subheading }}
      </p>
      <p
        class="mt-6 max-w-2xl text-base leading-relaxed text-toned"
        :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'body' })"
      >
        {{ item.body }}
      </p>
      <p
        v-if="content?.settings.status"
        class="mt-6 inline-flex items-center gap-2.5 rounded-full border border-default bg-default/60 py-1.5 pr-4 pl-3 font-mono text-sm text-toned backdrop-blur-sm"
        :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'status' })"
      >
        <span class="relative flex size-2" aria-hidden="true">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-warm-400 opacity-75" />
          <span class="relative inline-flex size-2 rounded-full bg-warm-500" />
        </span>
        {{ content?.settings.status }}
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <span
          class="contents"
          :data-directus="attr({ collection: 'block_hero', item: item.id, fields: 'links' })"
        >
          <BlockLinks :links="item.links" />
        </span>
        <span
          class="ml-1 inline-flex items-center gap-1.5 text-sm text-muted"
          :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'location' })"
        >
          <UIcon name="i-lucide-map-pin" class="size-4" />
          {{ content?.settings.location }}
        </span>
      </div>
    </UContainer>
  </section>
</template>
