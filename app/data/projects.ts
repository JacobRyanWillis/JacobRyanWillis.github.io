export interface Project {
  slug: string
  title: string
  subtitle: string
  summary: string
  problem: string
  architecture: string[]
  stack: string[]
  outcomes: string[]
  featured?: string
}

export const projects: Project[] = [
  {
    slug: 'analytics-hub',
    title: 'Cross-Channel Analytics Hub',
    subtitle: 'Unified sales, email, and social metrics for leadership across 7 offices',
    summary:
      'A pluggable adapter system that syncs metrics from 7 e-commerce stores and 5 marketing channels into unified, permission-scoped dashboards.',
    featured: '7 stores · 5 channels · nightly syncs',
    problem:
      'Leadership across 7 international offices had no single view of performance. Sales lived in 7 regional PrestaShop stores (each in its own currency), email metrics in GetResponse across 17 mailing lists, and social reach across YouTube, Facebook, and Instagram. Reporting meant manually pulling numbers from five different admin panels.',
    architecture: [
      'Designed a pluggable adapter system: each channel (PrestaShop, GetResponse, YouTube, Facebook, Instagram) implements a common sync interface, so adding a new source is a new adapter — not a rewrite.',
      'Nightly automated syncs plus on-demand backfills, with per-store currency handling for the 7 international PrestaShop instances.',
      'Normalized metrics into Directus collections that power dashboard queries.',
      'Vue 3 + ApexCharts dashboards with cross-channel KPIs, period-over-period deltas, and per-channel deep dives.',
      'Office-scoped row-level access policies so each office sees exactly its own data — leadership sees the whole picture.',
    ],
    stack: ['Vue 3', 'ApexCharts', 'Directus', 'Node.js', 'PrestaShop API', 'GetResponse API', 'YouTube Data API', 'Meta Graph API'],
    outcomes: [
      'One permission-scoped dashboard replaced five separate admin panels for reporting.',
      'Leadership across 7 offices reviews unified, always-current KPIs instead of hand-built spreadsheets.',
      'New channels can be onboarded by writing a single adapter against the sync interface.',
    ],
  },
  {
    slug: 'customer-crm',
    title: 'Customer Database (CRM)',
    subtitle: 'The organization-wide system of record on Directus',
    summary:
      'A 26-collection Directus CRM managing contacts, subscriber lists, and digital-content access across 7 international offices — replacing a legacy dual-write system.',
    featured: '26 collections · 7 offices · sole system of record',
    problem:
      'Customer data was split across a legacy system and newer tools, kept in sync by fragile dual writes. There was no single source of truth for who a contact was, what they subscribed to, or what digital content they could access.',
    architecture: [
      'Designed a 26-collection Directus schema covering contacts, subscriber lists, and digital-content access, built in collaboration with a senior developer.',
      'Modeled office-level data ownership with row-level access policies across 7 international offices.',
      'Migrated off the legacy dual-write system so the CRM became the sole system of record.',
      'Integrated with the email platform (GetResponse list sync, batch uploads, bulk unsubscribe) via custom Directus extensions.',
    ],
    stack: ['Directus', 'Node.js', 'MySQL', 'TypeScript', 'GetResponse API'],
    outcomes: [
      'Eliminated dual-write drift: one system of record for contacts, subscriptions, and content access.',
      'Non-technical staff in every office manage customer data through Directus with scoped permissions.',
      'Became the foundation the analytics hub and email platform are built on.',
    ],
  },
  {
    slug: 'warp-redesign',
    title: 'WARP — Creation.com Redesign',
    subtitle: 'Full redesign and migration of a site with millions of monthly visitors',
    summary:
      'Migrated a legacy site to Nuxt 3 + Directus with a modular page-block system — preserving SEO rankings and uptime throughout.',
    featured: 'Millions of monthly visitors · zero SEO regression',
    problem:
      'Creation.com ran on a legacy stack that made content changes slow and developer-dependent, and its architecture limited performance. The migration had to happen without losing search rankings or uptime for a site serving millions of monthly visitors.',
    architecture: [
      'Rebuilt the site on Nuxt 3 with Directus as a fully headless CMS.',
      'Created a modular page-block content rendering system: editors compose pages from reusable blocks and publish without developer involvement.',
      'Optimized page-load performance with SSR, asset optimization, and Cloudflare-backed delivery.',
      'Managed the migration with redirect mapping and metadata parity to preserve SEO rankings and uptime continuity.',
    ],
    stack: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Directus', 'Tailwind', 'Cloudflare'],
    outcomes: [
      'Improved page-load performance on a fully headless architecture.',
      'Editorial team builds and publishes landing pages independently — rapid page development with no developer bottleneck.',
      'SEO rankings and uptime held steady through the entire migration.',
    ],
  },
  {
    slug: 'email-platform',
    title: 'Email Delivery Platform',
    subtitle: 'End-to-end transactional and marketing email at 100K+ daily sends',
    summary:
      'A full-stack email system integrating Nuxt frontend forms, Directus backend workflows, GetResponse, and dynamic MJML + Liquid.js templating.',
    featured: '100K+ daily subscribers · 17 mailing lists',
    problem:
      'The organization needed to reliably reach 100K+ daily subscribers with both transactional and marketing email — with personalized content, manageable templates, and subscriber lists that stay in sync with the CRM.',
    architecture: [
      'Nuxt frontend forms feeding Directus backend workflows for signups, preferences, and unsubscribes.',
      'MJML templating compiled to responsive email HTML, with Liquid.js for dynamic per-recipient personalization.',
      'GetResponse integration managing 17 mailing lists, send schedules, and delivery logs.',
      'Directus workflows as the operational layer: staff manage lists, schedules, and content without touching code.',
    ],
    stack: ['Nuxt', 'Node.js', 'Directus', 'GetResponse', 'MJML', 'Liquid.js'],
    outcomes: [
      'Supports 100K+ daily sends across transactional and marketing email.',
      'Template changes are compiled MJML — consistent rendering across email clients.',
      'Subscriber lists stay consistent with the CRM system of record.',
    ],
  },
  {
    slug: 'ai-receipts',
    title: 'AI Receipt Processing Tool',
    subtitle: 'An AI OCR pipeline that eliminated manual travel-expense transcription',
    summary:
      'Speakers upload trip receipts, an AI OCR pipeline extracts line-item data, staff review in an editing UI, and one click exports to Excel or the CRM.',
    featured: 'AI OCR · human-in-the-loop review · one-click export',
    problem:
      'Returning speakers submitted stacks of paper travel receipts that staff transcribed into spreadsheets by hand — slow, error-prone, and entirely manual.',
    architecture: [
      'Upload flow where speakers submit trip receipts from any device.',
      'AI OCR pipeline extracts line-item data (vendor, date, amounts, categories) from receipt images.',
      'Human-in-the-loop review UI where staff verify and correct extracted data before it goes anywhere.',
      'One-click export to Excel or directly into the Directus customer database.',
      'The same AI-tooling pattern (extract → review → export) was reused to accelerate processes in other departments.',
    ],
    stack: ['Vue 3', 'Node.js', 'LLM APIs / AI OCR', 'Directus', 'Excel export'],
    outcomes: [
      'Replaced fully manual expense transcription with an automated, reviewable pipeline.',
      'Staff time shifted from data entry to quick verification.',
      'Established a reusable AI-tooling pattern adopted by other departments.',
    ],
  },
  {
    slug: 'internal-ops',
    title: 'Internal Operations Tooling',
    subtitle: 'Tour booking and conference registration systems',
    summary:
      'Two internal web applications that replaced manual spreadsheet-based workflows, cutting administrative overhead by 60%.',
    featured: '60% less administrative overhead',
    problem:
      'Tour bookings and conference registrations ran on spreadsheets and email threads. Every booking meant manual copying, cross-checking, and status-chasing across events and logistics teams.',
    architecture: [
      'Scoped, designed, and shipped two internal web apps end-to-end: a tour booking system and a conference registration platform.',
      'Structured workflows with validation, status tracking, and role-based access replacing free-form spreadsheets.',
      'Directus-backed data layer so operations staff manage records through a familiar admin UI.',
    ],
    stack: ['Vue 3', 'Nuxt', 'Node.js', 'Directus', 'MySQL'],
    outcomes: [
      'Reduced manual administrative processing by 60%.',
      'Freed significant staff time each week across events and logistics teams.',
      'Replaced error-prone spreadsheet workflows with validated, trackable systems.',
    ],
  },
]
