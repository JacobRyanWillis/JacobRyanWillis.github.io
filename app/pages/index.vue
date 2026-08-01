<script setup lang="ts">
import { site, metrics } from '~/data/site'
import { projects } from '~/data/projects'
import { skillGroups } from '~/data/skills'

useSeoMeta({
  description:
    'Jacob Willis — full-stack developer in Atlanta, GA specializing in Vue/Nuxt, Node.js, Directus headless CMS, and AI-powered internal tooling.',
  ogTitle: 'Jacob Willis · Full-Stack Developer',
  ogDescription:
    'Vue/Nuxt · Node.js · Directus · AI tooling. Production systems serving millions of monthly visitors and 100K+ daily email subscribers.',
})

useHead({
  link: [{ rel: 'canonical', href: `${site.url}/` }],
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-100),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-950),transparent_55%)]"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-5xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
        <p class="font-mono text-sm text-accent-700 dark:text-accent-400">{{ site.location }}</p>
        <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
          {{ site.name }}
        </h1>
        <p class="mt-4 text-xl font-medium text-slate-700 sm:text-2xl dark:text-slate-200">
          {{ site.role }} · <span class="text-accent-700 dark:text-accent-400">{{ site.tagline }}</span>
        </p>
        <p class="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          I design, ship, and own production systems end-to-end — a content platform serving
          millions of monthly visitors, an email system reaching 100K+ daily subscribers, and AI
          tools that eliminated manual data entry across teams.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            :href="site.resume"
            class="rounded-lg bg-accent-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            Download Resume
          </a>
          <a
            :href="site.github"
            target="_blank"
            rel="noopener"
            class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900"
          >
            GitHub
          </a>
          <a
            :href="site.linkedin"
            target="_blank"
            rel="noopener"
            class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>

    <!-- Metrics band -->
    <section class="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <dl class="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-6">
        <div v-for="m in metrics" :key="m.label">
          <dt class="order-last mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
            {{ m.label }}
          </dt>
          <dd class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ m.value }}
          </dd>
        </div>
      </dl>
    </section>

    <!-- About -->
    <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading id="about" eyebrow="About" title="Full-stack, end to end" />
      <div class="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
        <p>{{ site.summary }}</p>
        <p>
          For nearly three years I've been the full-stack developer behind Creation.com and its
          surrounding platform: a Directus-based CRM spanning 7 international offices, a
          cross-channel analytics hub, an email delivery platform, and a growing set of AI-powered
          internal tools.
        </p>
        <p class="rounded-lg border border-accent-200 bg-accent-50 p-4 text-sm dark:border-accent-900 dark:bg-accent-950/40">
          {{ site.privateWorkNote }}
        </p>
      </div>
    </section>

    <!-- Projects -->
    <section class="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading id="projects" eyebrow="Projects" title="Case studies from production" />
        <p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          Six systems I've built and shipped at CMI — each one covers the problem, the
          architecture, and what it changed.
        </p>
        <div class="mt-10 grid gap-6 sm:grid-cols-2">
          <ProjectCard v-for="project in projects" :key="project.slug" :project="project" />
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading id="skills" eyebrow="Skills" title="What I work with" />
      <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="group in skillGroups" :key="group.title">
          <h3 class="text-sm font-semibold tracking-wide text-slate-900 uppercase dark:text-white">
            {{ group.title }}
          </h3>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="item in group.items"
              :key="item"
              class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading id="contact" eyebrow="Contact" title="Let's talk" />
        <p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          I'm looking for my next full-stack role. If you'd like to walk through any of these
          systems — architecture decisions, code samples, or demos — reach out.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a
            :href="`mailto:${site.email}`"
            class="rounded-lg bg-accent-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            {{ site.email }}
          </a>
          <a
            :href="site.linkedin"
            target="_blank"
            rel="noopener"
            class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
