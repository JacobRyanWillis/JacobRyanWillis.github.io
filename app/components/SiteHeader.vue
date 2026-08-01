<script setup lang="ts">
import { site } from '~/data/site'

const links = [
  { label: 'About', to: '/#about' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Contact', to: '/#contact' },
]
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
  >
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="font-semibold tracking-tight text-slate-900 dark:text-white">
        {{ site.name }}
        <span class="ml-2 hidden text-sm font-normal text-slate-500 sm:inline dark:text-slate-400">
          {{ site.role }}
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-1 sm:gap-2">
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {{ link.label }}
        </NuxtLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
