<script setup lang="ts">
const { data: content } = await usePortfolioContent()
const { attr } = useVisualEditing()
const { toggle: toggleXray } = useXray()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-default py-10">
    <UContainer class="flex flex-col items-center justify-between gap-6 sm:flex-row">
      <div class="text-center text-sm text-muted sm:text-left">
        <p :data-directus="attr({ collection: 'site_settings', item: content?.settings.id ?? '', fields: 'name,location' })">
          © {{ year }} {{ content?.settings.name }} · {{ content?.settings.location }}
        </p>
        <p class="mt-1">
          Built with Nuxt, Nuxt UI &amp; Directus —
          <button type="button" class="cursor-pointer text-primary hover:underline" @click="toggleXray()">
            X-ray the blocks behind this page
          </button>
          or
          <NuxtLink
            to="https://github.com/JacobRyanWillis/JacobRyanWillis.github.io"
            target="_blank"
            class="text-primary hover:underline"
          >
            read the source
          </NuxtLink>
        </p>
        <TerminalEgg />
      </div>
      <div class="flex items-center gap-1">
        <UButton
          :to="content?.settings.github"
          target="_blank"
          icon="i-lucide-github"
          variant="ghost"
          color="neutral"
          aria-label="GitHub"
        />
        <UButton
          :to="content?.settings.linkedin"
          target="_blank"
          icon="i-lucide-linkedin"
          variant="ghost"
          color="neutral"
          aria-label="LinkedIn"
        />
        <UButton
          :to="`mailto:${content?.settings.email}`"
          icon="i-lucide-mail"
          variant="ghost"
          color="neutral"
          aria-label="Email"
        />
        <UButton
          :to="content?.settings.resume"
          icon="i-lucide-file-down"
          variant="ghost"
          color="neutral"
          aria-label="Resume PDF"
        />
      </div>
    </UContainer>
  </footer>
</template>
