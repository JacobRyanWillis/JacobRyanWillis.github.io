<script setup lang="ts">
defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

const groupIcons: Record<string, string> = {
  'Languages': 'i-lucide-code',
  'Frontend': 'i-lucide-layout-template',
  'Backend': 'i-lucide-server',
  'AI Tooling': 'i-lucide-brain-circuit',
  'Tools & Platforms': 'i-lucide-wrench',
  'Concepts': 'i-lucide-lightbulb',
}
</script>

<template>
  <SectionShell :item="item">
    <UContainer class="py-20 sm:py-24">
      <div id="skills" class="scroll-mt-24">
        <p
          class="eyebrow"
          :data-directus="attr({ collection: 'block_skills', item: item.id, fields: 'eyebrow' })"
        >
          {{ item.eyebrow }}
        </p>
        <h2
          class="mt-2 font-display text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
          :data-directus="attr({ collection: 'block_skills', item: item.id, fields: 'heading' })"
        >
          {{ item.heading }}
        </h2>
      </div>
      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(group, i) in content?.skill_groups"
          :key="group.id"
          v-reveal="i % 3"
          class="rounded-xl border border-default bg-default p-5"
          :data-directus="attr({ collection: 'skill_groups', item: group.id, fields: 'title,items' })"
        >
          <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <UIcon :name="groupIcons[group.title] ?? 'i-lucide-badge-check'" class="size-4 text-primary" />
            {{ group.title }}
          </h3>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <UBadge
              v-for="skill in group.items"
              :key="skill"
              :label="skill"
              color="neutral"
              variant="soft"
              size="sm"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </SectionShell>
</template>
