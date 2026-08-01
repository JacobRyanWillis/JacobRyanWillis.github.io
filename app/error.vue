<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-slate-950">
    <p class="font-mono text-sm text-accent-700 dark:text-accent-400">{{ error.statusCode }}</p>
    <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
      {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
    </h1>
    <p class="mt-3 text-slate-600 dark:text-slate-300">
      {{ error.statusCode === 404 ? "The page you're looking for doesn't exist." : error.statusMessage }}
    </p>
    <NuxtLink
      to="/"
      class="mt-8 rounded-lg bg-accent-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
      @click="clearError()"
    >
      Back home
    </NuxtLink>
  </div>
</template>
