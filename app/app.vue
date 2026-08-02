<script setup lang="ts">
useHead({
  titleTemplate: (title?: string | null) =>
    title ? `${title} · Jacob Willis` : 'Jacob Willis · Full-Stack Developer',
})

useSeoMeta({
  ogSiteName: 'Jacob Willis',
  ogType: 'website',
  // public/og.png — regenerate via the OG card recipe in the session notes
  // (site fonts + the About schematic, screenshotted at 1200x630).
  ogImage: 'https://jacobryanwillis.github.io/og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
