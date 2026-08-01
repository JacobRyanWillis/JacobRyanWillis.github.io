<script setup lang="ts">
const { enabled, toggle } = useXray()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="enabled"
      class="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div class="flex max-w-xl items-center gap-3 rounded-full border border-accent-300 bg-default/90 py-2 pr-2 pl-4 shadow-lg backdrop-blur-md dark:border-accent-700">
        <UIcon name="i-lucide-scan-eye" class="size-4 shrink-0 text-primary" />
        <p class="text-xs text-toned sm:text-sm">
          <span class="font-semibold text-highlighted">X-ray on.</span>
          Every section is a content block from a headless CMS —
          <NuxtLink to="/projects/page-blocks" class="font-medium text-primary hover:underline" @click="toggle()">
            here's how it works
          </NuxtLink>
        </p>
        <UButton
          icon="i-lucide-x"
          size="xs"
          variant="soft"
          color="neutral"
          aria-label="Turn off X-ray"
          class="rounded-full"
          @click="toggle()"
        />
      </div>
    </div>
  </Transition>
</template>
