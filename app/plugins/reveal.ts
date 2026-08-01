/**
 * v-reveal — fade-and-rise elements into view as they scroll in.
 *
 * Usage: `v-reveal` on any element, or `v-reveal="index"` to stagger
 * siblings (each index step adds 90ms, see --reveal-delay in main.css).
 *
 * Progressive enhancement: classes are only added once JS runs, so content
 * is fully visible without JavaScript, in crawlers, and in the prerendered
 * HTML. Users with prefers-reduced-motion never see any movement.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined

  nuxtApp.vueApp.directive('reveal', {
    // SSR: render no extra attributes — the markup stays clean and static.
    getSSRProps: () => ({}),

    mounted(el: HTMLElement, binding) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      observer ??= new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('reveal-in')
            observer!.unobserve(entry.target)
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
      )
      if (typeof binding.value === 'number') {
        el.style.setProperty('--reveal-delay', String(binding.value))
      }
      el.classList.add('reveal')
      observer.observe(el)
    },

    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
