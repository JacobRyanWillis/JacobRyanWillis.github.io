<script setup lang="ts">
import { site } from '~/data/site'
import { projects } from '~/data/projects'

const route = useRoute()
const project = projects.find((p) => p.slug === route.params.slug)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const index = projects.indexOf(project)
const prev = projects[index - 1]
const next = projects[index + 1]

useSeoMeta({
  title: project.title,
  description: project.summary,
  ogTitle: `${project.title} · Jacob Willis`,
  ogDescription: project.summary,
})

useHead({
  link: [{ rel: 'canonical', href: `${site.url}/projects/${project.slug}` }],
})
</script>

<template>
  <article v-if="project" class="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
    <NuxtLink
      to="/#projects"
      class="text-sm font-medium text-accent-700 transition hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
    >
      ← All projects
    </NuxtLink>

    <header class="mt-6">
      <p v-if="project.featured" class="font-mono text-sm text-accent-700 dark:text-accent-400">
        {{ project.featured }}
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {{ project.title }}
      </h1>
      <p class="mt-3 text-lg text-slate-600 dark:text-slate-300">{{ project.subtitle }}</p>
    </header>

    <div class="mt-8 flex flex-wrap gap-1.5">
      <span
        v-for="tech in project.stack"
        :key="tech"
        class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        {{ tech }}
      </span>
    </div>

    <section class="mt-10">
      <h2 class="text-sm font-semibold tracking-widest text-accent-600 uppercase dark:text-accent-400">
        The problem
      </h2>
      <p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{{ project.problem }}</p>
    </section>

    <section class="mt-10">
      <h2 class="text-sm font-semibold tracking-widest text-accent-600 uppercase dark:text-accent-400">
        Architecture
      </h2>
      <ul class="mt-3 space-y-3">
        <li
          v-for="(point, i) in project.architecture"
          :key="i"
          class="flex gap-3 leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
          <span>{{ point }}</span>
        </li>
      </ul>
    </section>

    <section class="mt-10">
      <h2 class="text-sm font-semibold tracking-widest text-accent-600 uppercase dark:text-accent-400">
        Outcome
      </h2>
      <ul class="mt-3 space-y-3">
        <li
          v-for="(point, i) in project.outcomes"
          :key="i"
          class="flex gap-3 leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
          <span>{{ point }}</span>
        </li>
      </ul>
    </section>

    <nav class="mt-14 flex justify-between gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
      <NuxtLink
        v-if="prev"
        :to="`/projects/${prev.slug}`"
        class="font-medium text-accent-700 transition hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
      >
        ← {{ prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="next"
        :to="`/projects/${next.slug}`"
        class="text-right font-medium text-accent-700 transition hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
      >
        {{ next.title }} →
      </NuxtLink>
    </nav>
  </article>
</template>
