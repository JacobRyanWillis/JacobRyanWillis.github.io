<script setup lang="ts">
import { site } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 py-8 dark:border-slate-800">
    <div
      class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400"
    >
      <p>© {{ year }} {{ site.name }} · {{ site.location }}</p>
      <div class="flex items-center gap-4">
        <a :href="site.github" target="_blank" rel="noopener" class="transition hover:text-slate-900 dark:hover:text-white">GitHub</a>
        <a :href="site.linkedin" target="_blank" rel="noopener" class="transition hover:text-slate-900 dark:hover:text-white">LinkedIn</a>
        <a :href="`mailto:${site.email}`" class="transition hover:text-slate-900 dark:hover:text-white">Email</a>
        <a :href="site.resume" class="transition hover:text-slate-900 dark:hover:text-white">Resume</a>
      </div>
    </div>
  </footer>
</template>
