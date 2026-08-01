<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-100/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-700 dark:hover:shadow-accent-950/60"
  >
    <p
      v-if="project.featured"
      class="mb-3 font-mono text-xs text-accent-700 dark:text-accent-400"
    >
      {{ project.featured }}
    </p>
    <h3 class="text-lg font-semibold text-slate-900 group-hover:text-accent-700 dark:text-white dark:group-hover:text-accent-300">
      {{ project.title }}
    </h3>
    <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
      {{ project.subtitle }}
    </p>
    <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
      {{ project.summary }}
    </p>
    <div class="mt-4 flex flex-wrap gap-1.5">
      <span
        v-for="tech in project.stack.slice(0, 4)"
        :key="tech"
        class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      >
        {{ tech }}
      </span>
      <span
        v-if="project.stack.length > 4"
        class="rounded-full px-2 py-0.5 text-xs text-slate-400 dark:text-slate-500"
      >
        +{{ project.stack.length - 4 }} more
      </span>
    </div>
    <p class="mt-4 text-sm font-medium text-accent-700 dark:text-accent-400">
      Read the case study
      <span class="inline-block transition-transform group-hover:translate-x-0.5">→</span>
    </p>
  </NuxtLink>
</template>
