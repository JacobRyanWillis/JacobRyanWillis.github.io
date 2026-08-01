<script setup lang="ts">
import type { Project } from '~/types/content'

defineProps<{ project: Project }>()

const { attr } = useVisualEditing()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-default bg-default p-6 transition duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-100/50 dark:hover:border-accent-800 dark:hover:shadow-accent-950/50"
    :data-directus="attr({ collection: 'projects', item: project.id, fields: 'title,subtitle,summary,featured,stack' })"
  >
    <div
      class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent-600 to-accent-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      aria-hidden="true"
    />
    <p v-if="project.featured" class="mb-3 font-mono text-xs text-primary">
      {{ project.featured }}
    </p>
    <h3 class="text-lg font-semibold text-highlighted transition-colors group-hover:text-primary">
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
  </NuxtLink>
</template>
