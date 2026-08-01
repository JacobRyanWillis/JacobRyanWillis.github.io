<script setup lang="ts">
import { site } from '~/data/site'

useHead({
  titleTemplate: (title?: string | null) =>
    title ? `${title} · Jacob Willis` : 'Jacob Willis · Full-Stack Developer',
})

useHead({
  titleTemplate: (title?: string | null) =>
    title ? `${title} · Jacob Willis` : 'Jacob Willis · Full-Stack Developer',
})

useSeoMeta({
  ogSiteName: site.name,
  ogType: 'website',
  ogImage: `${site.url}/og-banner.png`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
