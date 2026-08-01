<script setup lang="ts">
const props = defineProps<{ url: string; title?: string }>()

// Accepts watch, share (youtu.be), shorts, and embed URL shapes.
const videoId = computed(() => {
  const match = props.url?.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,20})/,
  )
  return match?.[1] ?? null
})
</script>

<template>
  <div
    v-if="videoId"
    class="relative aspect-video w-full overflow-hidden rounded-xl border border-default bg-slate-950"
  >
    <iframe
      :src="`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&iv_load_policy=3`"
      :title="title ?? 'YouTube video'"
      class="absolute inset-0 h-full w-full"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </div>
</template>
