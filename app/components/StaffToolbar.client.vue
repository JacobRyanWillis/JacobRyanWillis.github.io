<script setup lang="ts">
// Simplified version of WARP's Staffbar: appears only in live authoring mode
// (NUXT_PUBLIC_DIRECTUS_URL set), with route-aware deep links into Directus
// and a visual-editing toggle.
const { directusUrl } = useRuntimeConfig().public
const { enabled, active, applyNow, removeNow } = useVisualEditing()

const route = useRoute()
const { data: content } = await usePortfolioContent()

const editTarget = computed(() => {
  const slug = route.params.slug as string | undefined
  if (route.path.startsWith('/projects/') && slug) {
    const project = content.value?.projects.find((p) => p.slug === slug)
    if (project) return { label: 'Edit project', url: `${directusUrl}/admin/content/projects/${project.id}` }
  }
  const page = content.value?.pages.find((p) => p.slug === 'home')
  if (route.path === '/' && page) {
    return { label: 'Edit page', url: `${directusUrl}/admin/content/pages/${page.id}` }
  }
  return null
})
</script>

<template>
  <div
    v-if="enabled"
    class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-accent-300 bg-default/95 py-1 pr-1 pl-3 shadow-lg backdrop-blur dark:border-accent-800"
  >
    <span class="mr-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
      <UIcon name="i-lucide-shield-check" class="size-3.5" />
      Staff
    </span>
    <UButton
      v-if="editTarget"
      :to="editTarget.url"
      target="_blank"
      icon="i-lucide-pencil"
      size="xs"
      variant="ghost"
      color="neutral"
    >
      {{ editTarget.label }}
    </UButton>
    <UButton
      :to="`${directusUrl}/admin/`"
      target="_blank"
      icon="i-lucide-database"
      size="xs"
      variant="ghost"
      color="neutral"
    >
      Directus
    </UButton>
    <UButton
      :icon="active ? 'i-lucide-eye-off' : 'i-lucide-eye'"
      size="xs"
      :variant="active ? 'soft' : 'ghost'"
      :color="active ? 'primary' : 'neutral'"
      @click="active ? removeNow() : applyNow()"
    >
      {{ active ? 'Editing on' : 'Editing off' }}
    </UButton>
  </div>
</template>
