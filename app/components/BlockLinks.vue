<script setup lang="ts">
interface LinkAction {
  label: string
  to?: string
  icon?: string
  color?: string
  variant?: string
  size?: string
  target?: string | null
}

defineProps<{ links?: LinkAction[] | null }>()
</script>

<template>
  <template v-for="link in links ?? []" :key="link.label">
    <UButton
      :to="link.to"
      :icon="link.icon"
      :color="(link.color as any) ?? 'primary'"
      :variant="(link.variant as any) ?? 'solid'"
      :size="(link.size as any) ?? 'lg'"
      :target="link.target ?? undefined"
    >
      {{ link.label }}
    </UButton>
  </template>
</template>
