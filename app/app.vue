<script setup lang="ts">
useHead({
  titleTemplate: (title?: string | null) =>
    title ? `${title} · Jacob Willis` : 'Jacob Willis · Full-Stack Developer',
})

useSeoMeta({
  ogSiteName: 'Jacob Willis',
  ogType: 'website',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
