<script setup lang="ts">
const props = defineProps<{ item: Record<string, any> }>()

const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

const paragraphs = computed<string[]>(() =>
  String(props.item.body ?? '')
    .split(/\n\n+/)
    .filter(Boolean),
)
</script>

<template>
  <SectionShell :item="item">
    <UContainer class="py-20 sm:py-24">
      <!-- With an image set in Directus the section goes two-column: text
           left, image right (same treatment as SectionTwoColumn). -->
      <div :class="item.image ? 'grid gap-10 lg:grid-cols-2 lg:items-center' : ''">
        <div>
          <div id="about" class="scroll-mt-24">
            <p
              class="eyebrow"
              :data-directus="attr({ collection: 'block_about', item: item.id, fields: 'eyebrow' })"
            >
              {{ item.eyebrow }}
            </p>
            <h2
              class="mt-2 font-display text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
              :data-directus="attr({ collection: 'block_about', item: item.id, fields: 'heading' })"
            >
              {{ item.heading }}
            </h2>
          </div>
          <div class="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-toned">
            <p :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'summary' })">
              {{ content?.settings.summary }}
            </p>
            <p
              v-for="(paragraph, i) in paragraphs"
              :key="i"
              :data-directus="attr({ collection: 'block_about', item: item.id, fields: 'body' })"
            >
              {{ paragraph }}
            </p>
            <UAlert
              icon="i-lucide-lock"
              color="primary"
              variant="subtle"
              :description="content?.settings.private_work_note"
              :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'private_work_note' })"
            />
          </div>
        </div>
        <img
          v-if="item.image"
          :src="item.image"
          alt=""
          class="w-full rounded-xl border border-default"
          :data-directus="attr({ collection: 'block_about', item: item.id, fields: 'image' })"
        >
      </div>
    </UContainer>
  </SectionShell>
</template>
