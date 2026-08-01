<script setup lang="ts">
/**
 * Footer easter egg: a fake shell prompt. Click it and it types
 * `sudo hire jacob` — then grants permission and points at the contact
 * section. Harmless, three lines of state.
 */
const typed = ref('')
const granted = ref(false)
const running = ref(false)
const COMMAND = 'sudo hire jacob'

async function run() {
  if (running.value || granted.value) return
  running.value = true
  for (const char of COMMAND) {
    typed.value += char
    await new Promise((r) => setTimeout(r, 55 + Math.random() * 60))
  }
  await new Promise((r) => setTimeout(r, 350))
  granted.value = true
  running.value = false
}
</script>

<template>
  <button
    type="button"
    class="mt-2 block cursor-pointer text-left font-mono text-xs text-dimmed transition-colors hover:text-muted"
    :aria-label="granted ? 'Permission granted — go to contact section' : 'Run a command'"
    @click="run"
  >
    <span class="text-accent-500 dark:text-accent-400">jacob@portfolio</span>:<span class="text-warm-600 dark:text-warm-400">~</span>$
    {{ typed }}<span class="animate-pulse">▍</span>
    <span v-if="granted" class="mt-0.5 block text-success">
      [sudo] permission granted ✓ —
      <NuxtLink to="/#contact" class="underline underline-offset-2">say hello</NuxtLink>
    </span>
  </button>
</template>
