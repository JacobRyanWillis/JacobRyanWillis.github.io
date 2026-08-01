<script setup lang="ts">
const { data: content } = await usePortfolioContent()

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
        <span
          class="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-inverted shadow-sm"
        >
          JW
        </span>
        <span class="font-semibold tracking-tight text-highlighted">
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
