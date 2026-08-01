<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p class="font-mono text-sm text-primary">{{ error.statusCode }}</p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-highlighted">
        {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="mt-3 text-toned">
        {{ error.statusCode === 404 ? "The page you're looking for doesn't exist." : error.statusMessage }}
      </p>
      <UButton to="/" icon="i-lucide-home" class="mt-8" @click="clearError()">Back home</UButton>
    </div>
  </UApp>
</template>
