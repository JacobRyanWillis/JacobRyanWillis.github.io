<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

const sortedProjects = computed(() =>
  [...(content.value?.projects ?? [])].sort((a, b) => a.sort - b.sort),
)
</script>

<template>
  <section class="border-t border-default bg-elevated/50">
    <UContainer class="py-20 sm:py-24">
      <div id="projects" class="scroll-mt-24">
        <p
          class="text-sm font-semibold tracking-widest text-primary uppercase"
          :data-directus="attr({ collection: 'block_projects', item: item.id, fields: 'eyebrow' })"
        >
          {{ item.eyebrow }}
        </p>
        <h2
          class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
          :data-directus="attr({ collection: 'block_projects', item: item.id, fields: 'heading' })"
        >
          {{ item.heading }}
        </h2>
        <p
          class="mt-4 max-w-2xl text-toned"
          :data-directus="attr({ collection: 'block_projects', item: item.id, fields: 'intro' })"
        >
          {{ item.intro }}
        </p>
      </div>
      <div class="mt-10 grid gap-6 sm:grid-cols-2">
        <ProjectCard v-for="project in sortedProjects" :key="project.id" :project="project" />
        <a
          v-if="item.more_heading"
          href="#contact"
          class="group flex h-full flex-col justify-center rounded-xl border border-dashed border-accent-300 p-6 transition hover:border-accent-500 hover:bg-elevated/50 dark:border-accent-800 dark:hover:border-accent-600"
          :data-directus="attr({ collection: 'block_projects', item: item.id, fields: 'more_heading,more_text' })"
        >
          <h3 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
            <UIcon name="i-lucide-layers" class="size-5 text-primary" />
            {{ item.more_heading }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-toned">{{ item.more_text }}</p>
          <p class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Get in touch
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </p>
        </a>
      </div>
    </UContainer>
  </section>
</template>
