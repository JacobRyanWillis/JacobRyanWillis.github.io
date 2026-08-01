<script setup lang="ts">
const { data: content } = await usePortfolioContent()
const { enable } = useVisualEditing()

const page = computed(() => content.value?.pages.find((p) => p.slug === 'home'))

useSeoMeta({
  description: () => page.value?.description ?? undefined,
  ogTitle: 'Jacob Willis · Full-Stack Developer',
  ogDescription: () => page.value?.description ?? undefined,
})

useHead({
  link: [{ rel: 'canonical', href: `${content.value?.settings.url}/` }],
})

enable()
</script>

<template>
  <PageBlocks v-if="page" :page="page" />
</template>
