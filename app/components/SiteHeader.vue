<script setup lang="ts">
const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

const links = [
  { label: 'About', to: '/#about' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Contact', to: '/#contact' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default/75 backdrop-blur-md">
    <UContainer class="flex h-16 items-center justify-between">
      <NuxtLink to="/" class="group flex items-center gap-3">
        <UAvatar
          :src="content?.settings.headshot ?? undefined"
          :alt="content?.settings.name"
          text="JW"
          size="md"
          class="ring-2 ring-accent-200 dark:ring-accent-800"
          :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'headshot' })"
        />
        <span
          class="font-semibold tracking-tight text-highlighted"
          :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'name,role' })"
        >
          {{ content?.settings.name }}
          <span class="ml-2 hidden text-sm font-normal text-muted lg:inline">
            {{ content?.settings.role }}
          </span>
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <UButton
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          variant="ghost"
          color="neutral"
          size="sm"
          class="hidden sm:inline-flex"
        >
          {{ link.label }}
        </UButton>
        <UButton
          :to="content?.settings.github"
          target="_blank"
          icon="i-lucide-github"
          variant="ghost"
          color="neutral"
          size="sm"
          aria-label="GitHub profile"
        />
        <UColorModeButton size="sm" />
      </nav>
    </UContainer>
  </header>
</template>
