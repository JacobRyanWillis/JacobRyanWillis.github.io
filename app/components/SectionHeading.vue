<script setup lang="ts">
defineProps<{
  id?: string
  eyebrow: string
  title: string
}>()
</script>

<template>
  <div :id="id" class="scroll-mt-20">
    <p class="text-sm font-semibold tracking-widest text-accent-600 uppercase dark:text-accent-400">
      {{ eyebrow }}
    </p>
    <h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
      {{ title }}
    </h2>
  </div>
</template>
