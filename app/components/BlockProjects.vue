<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

const sortedProjects = computed(() =>
  [...(content.value?.projects ?? [])].sort((a, b) => a.sort - b.sort),
)
</script>

<template>
  <SectionShell :item="item" class="border-t border-default">
    <UContainer class="py-20 sm:py-24">
      <div id="projects" class="scroll-mt-24">
        <p
          class="eyebrow"
          :data-directus="attr({ collection: 'block_projects', item: item.id, fields: 'eyebrow' })"
        >
          {{ item.eyebrow }}
        </p>
        <h2
          class="mt-2 font-display text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
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
        <ProjectCard
          v-for="(project, i) in sortedProjects"
          :key="project.id"
          v-reveal="i % 2"
          :project="project"
        />
        <a
          v-if="item.more_heading"
          v-reveal="sortedProjects.length % 2"
          href="#contact"
          class="group flex h-full flex-col justify-center rounded-xl border border-dashed border-accent-300 p-6 transition hover:border-accent-500 hover:bg-elevated/50 dark:border-accent-800 dark:hover:border-accent-600"
          :data-directus="attr({ collection: 'block_projects', item: item.id, fields: 'more_heading,more_text' })"
        >
          <h3 class="flex items-center gap-2 font-display text-lg font-bold text-highlighted">
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
  </SectionShell>
</template>
