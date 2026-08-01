export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/fonts'],

  fonts: {
    // Self-hosted at build time — GitHub Pages serves the font files, no
    // runtime requests to Google.
    families: [
      { name: 'Bricolage Grotesque', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // When set (NUXT_PUBLIC_DIRECTUS_URL), pages render live from Directus
      // and the visual editor is enabled. Unset = committed content snapshot.
      directusUrl: '',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
    },
  },
})
