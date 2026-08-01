<script setup lang="ts">
// Shared wrapper for section variants: owns the block's styling fields
// (bg_color class, bg_image with opacity) so every variant — including
// custom global components — gets backgrounds for free.
const props = defineProps<{ item: Record<string, any> }>()

const isDark = computed(() => String(props.item.bg_color ?? '').split(/\s+/).includes('dark'))

const sectionClass = computed(() => [
  'relative overflow-hidden',
  props.item.bg_color || '',
  // A dark section on a light page needs its own base surface for the
  // flipped tokens to sit on when the image doesn't cover everything.
  isDark.value ? 'text-toned' : '',
])

const imageStyle = computed(() => ({
  opacity: String((props.item.bg_opacity ?? 25) / 100),
}))
</script>

<template>
  <section :class="sectionClass">
    <div
      v-if="item.bg_image"
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <img :src="item.bg_image" alt="" class="h-full w-full object-cover" :style="imageStyle">
      <!-- Soft fade toward the content edges keeps text readable on busy images -->
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-default/60" />
    </div>
    <div class="relative">
      <slot />
    </div>
  </section>
</template>
