<script setup lang="ts">
const route = useRoute()
const { data: content } = await usePortfolioContent()
const { attr, enable } = useVisualEditing()

const sorted = computed(() => [...(content.value?.projects ?? [])].sort((a, b) => a.sort - b.sort))
const project = computed(() => sorted.value.find((p) => p.slug === route.params.slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const index = computed(() => sorted.value.findIndex((p) => p.slug === route.params.slug))
const prev = computed(() => sorted.value[index.value - 1])
const next = computed(() => sorted.value[index.value + 1])

useSeoMeta({
  title: () => project.value?.title,
  description: () => project.value?.summary,
  ogTitle: () => `${project.value?.title} · Jacob Willis`,
  ogDescription: () => project.value?.summary,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${content.value?.settings.url}/projects/${project.value?.slug}`,
    },
  ],
})

enable()
</script>

<template>
  <article v-if="project">
    <UContainer class="max-w-3xl py-16 sm:py-20">
      <UButton
        to="/#projects"
        icon="i-lucide-arrow-left"
        variant="link"
        color="primary"
        class="px-0"
      >
        All projects
      </UButton>

      <header class="mt-6">
        <p
          v-if="project.featured"
          class="font-mono text-sm text-primary"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'featured' })"
        >
          {{ project.featured }}
        </p>
        <h1
          class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'title' })"
        >
          {{ project.title }}
        </h1>
        <p
          class="mt-3 text-lg text-toned"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'subtitle' })"
        >
          {{ project.subtitle }}
        </p>
      </header>

      <div
        class="mt-8 flex flex-wrap gap-1.5"
        :data-directus="attr({ collection: 'projects', item: project.id, fields: 'stack' })"
      >
        <UBadge
          v-for="tech in project.stack"
          :key="tech"
          :label="tech"
          color="neutral"
          variant="soft"
        />
      </div>

      <img
        v-if="project.image"
        :src="project.image"
        :alt="`${project.title} screenshot`"
        class="mt-8 w-full rounded-xl border border-default"
      >

      <UAlert
        v-if="project.callout"
        class="mt-8"
        icon="i-lucide-eye"
        color="primary"
        variant="subtle"
        :description="project.callout"
        :data-directus="attr({ collection: 'projects', item: project.id, fields: 'callout' })"
      />

      <section class="mt-12">
        <h2 class="flex items-center gap-2 text-sm font-semibold tracking-widest text-primary uppercase">
          <UIcon name="i-lucide-target" class="size-4" />
          The problem
        </h2>
        <p
          class="mt-3 leading-relaxed text-toned"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'problem' })"
        >
          {{ project.problem }}
        </p>
      </section>

      <section class="mt-12">
        <h2 class="flex items-center gap-2 text-sm font-semibold tracking-widest text-primary uppercase">
          <UIcon name="i-lucide-layers" class="size-4" />
          Architecture
        </h2>
        <ul
          class="mt-3 space-y-3"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'architecture' })"
        >
          <li
            v-for="(point, i) in project.architecture"
            :key="i"
            class="flex gap-3 leading-relaxed text-toned"
          >
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>{{ point.text }}</span>
          </li>
        </ul>
      </section>

      <section class="mt-12">
        <h2 class="flex items-center gap-2 text-sm font-semibold tracking-widest text-primary uppercase">
          <UIcon name="i-lucide-trending-up" class="size-4" />
          Outcome
        </h2>
        <ul
          class="mt-3 space-y-3"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'outcomes' })"
        >
          <li
            v-for="(point, i) in project.outcomes"
            :key="i"
            class="flex gap-3 leading-relaxed text-toned"
          >
            <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-primary" />
            <span>{{ point.text }}</span>
          </li>
        </ul>
      </section>

      <section v-if="project.demo_video" class="mt-12">
        <h2 class="flex items-center gap-2 text-sm font-semibold tracking-widest text-primary uppercase">
          <UIcon name="i-lucide-monitor-play" class="size-4" />
          Demo
        </h2>
        <div
          class="mt-4"
          :data-directus="attr({ collection: 'projects', item: project.id, fields: 'demo_video' })"
        >
          <EmbedYouTube :url="project.demo_video" :title="`${project.title} demo`" />
        </div>
      </section>

      <nav class="mt-16 grid gap-4 border-t border-default pt-8 sm:grid-cols-2">
        <NuxtLink
          v-if="prev"
          :to="`/projects/${prev.slug}`"
          class="group rounded-xl border border-default p-4 transition hover:border-accent-300 dark:hover:border-accent-800"
        >
          <p class="flex items-center gap-1 text-xs text-muted">
            <UIcon name="i-lucide-arrow-left" class="size-3.5" />
            Previous
          </p>
          <p class="mt-1 text-sm font-medium text-highlighted group-hover:text-primary">
            {{ prev.title }}
          </p>
        </NuxtLink>
        <span v-else class="hidden sm:block" />
        <NuxtLink
          v-if="next"
          :to="`/projects/${next.slug}`"
          class="group rounded-xl border border-default p-4 text-right transition hover:border-accent-300 dark:hover:border-accent-800"
        >
          <p class="flex items-center justify-end gap-1 text-xs text-muted">
            Next
            <UIcon name="i-lucide-arrow-right" class="size-3.5" />
          </p>
          <p class="mt-1 text-sm font-medium text-highlighted group-hover:text-primary">
            {{ next.title }}
          </p>
        </NuxtLink>
      </nav>
    </UContainer>
  </article>
</template>
