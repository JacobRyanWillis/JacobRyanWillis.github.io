<script setup lang="ts">
const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()

const links = [
  { label: 'About', to: '/#about', icon: 'i-lucide-user' },
  { label: 'Projects', to: '/#projects', icon: 'i-lucide-folder-kanban' },
  { label: 'Skills', to: '/#skills', icon: 'i-lucide-badge-check' },
  { label: 'Contact', to: '/#contact', icon: 'i-lucide-mail' },
]

const mobileOpen = ref(false)
const { enabled: xray, toggle: toggleXray } = useXray()
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
          class="font-display font-semibold tracking-tight text-highlighted"
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
          class="hidden sm:inline-flex"
        />
        <UTooltip text="X-ray: see the CMS blocks behind this page">
          <UButton
            icon="i-lucide-scan-eye"
            :variant="xray ? 'soft' : 'ghost'"
            :color="xray ? 'primary' : 'neutral'"
            size="sm"
            aria-label="Toggle block X-ray"
            class="hidden sm:inline-flex"
            @click="toggleXray()"
          />
        </UTooltip>
        <UColorModeButton size="sm" />

        <!-- Mobile sidebar nav -->
        <USlideover v-model:open="mobileOpen" side="left" title="Navigation" description="Jump to a section">
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Open navigation menu"
            class="sm:hidden"
          />
          <template #body>
            <nav class="flex flex-col gap-1">
              <UButton
                v-for="link in links"
                :key="link.label"
                :to="link.to"
                :icon="link.icon"
                variant="ghost"
                color="neutral"
                size="lg"
                class="justify-start"
                @click="mobileOpen = false"
              >
                {{ link.label }}
              </UButton>
            </nav>
            <USeparator class="my-4" />
            <UButton
              icon="i-lucide-scan-eye"
              :variant="xray ? 'soft' : 'ghost'"
              :color="xray ? 'primary' : 'neutral'"
              size="lg"
              class="justify-start"
              @click="toggleXray(); mobileOpen = false"
            >
              Block X-ray
            </UButton>
            <div class="flex flex-col gap-1">
              <UButton
                :to="content?.settings.resume ?? undefined"
                target="_blank"
                icon="i-lucide-file-down"
                variant="ghost"
                color="neutral"
                size="lg"
                class="justify-start"
                @click="mobileOpen = false"
              >
                Resume
              </UButton>
              <UButton
                :to="content?.settings.github"
                target="_blank"
                icon="i-lucide-github"
                variant="ghost"
                color="neutral"
                size="lg"
                class="justify-start"
              >
                GitHub
              </UButton>
              <UButton
                :to="content?.settings.linkedin"
                target="_blank"
                icon="i-lucide-linkedin"
                variant="ghost"
                color="neutral"
                size="lg"
                class="justify-start"
              >
                LinkedIn
              </UButton>
            </div>
          </template>
        </USlideover>
      </nav>
    </UContainer>
  </header>
</template>
