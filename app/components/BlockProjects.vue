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
      </div>
    </UContainer>
  </section>
</template>
