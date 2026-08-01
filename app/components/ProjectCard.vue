<script setup lang="ts">
import type { Project } from '~/types/content'

defineProps<{ project: Project }>()

const { attr } = useVisualEditing()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-default bg-default transition duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-100/50 dark:hover:border-accent-800 dark:hover:shadow-accent-950/50"
    :data-directus="attr({ collection: 'projects', item: project.id, fields: 'title,subtitle,summary,featured,stack,image' })"
  >
    <div
      class="absolute inset-x-0 top-0 z-10 h-0.5 bg-linear-to-r from-accent-600 to-accent-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      aria-hidden="true"
    />

    <!-- Cover: screenshot when set in Directus, terminal-path banner until then -->
    <div class="relative aspect-[2/1] overflow-hidden border-b border-default">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="`${project.title} screenshot`"
        class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      >
      <div
        v-else
        class="flex h-full w-full items-center bg-linear-to-br from-accent-100 via-default to-accent-50 px-6 dark:from-accent-950 dark:via-slate-950 dark:to-accent-950/40"
      >
        <p class="font-mono text-sm text-accent-700 dark:text-accent-300">
          <span class="text-warm-600 dark:text-warm-400">~/projects/</span>{{ project.slug }}
          <span class="animate-pulse">▍</span>
        </p>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <p v-if="project.featured" class="mb-3 font-mono text-xs text-primary">
        {{ project.featured }}
      </p>
      <h3 class="font-display text-lg font-bold text-highlighted transition-colors group-hover:text-primary">
        {{ project.title }}
      </h3>
      <p class="mt-1 text-sm font-medium text-muted">{{ project.subtitle }}</p>
      <p class="mt-3 flex-1 text-sm leading-relaxed text-toned">{{ project.summary }}</p>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <UBadge
          v-for="tech in project.stack.slice(0, 4)"
          :key="tech"
          :label="tech"
          color="neutral"
          variant="soft"
          size="sm"
        />
        <span v-if="project.stack.length > 4" class="self-center text-xs text-dimmed">
          +{{ project.stack.length - 4 }} more
        </span>
      </div>
      <p class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Read the case study
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </p>
    </div>
  </NuxtLink>
</template>
