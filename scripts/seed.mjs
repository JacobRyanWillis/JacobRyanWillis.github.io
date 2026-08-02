// Creates the portfolio schema in the local Directus instance and seeds it
// from content/snapshot.json. Idempotent: re-running updates collection and
// field metadata (organization, icons, editor layout) and upserts content —
// safe to run on a fresh or existing instance.
//
//   docker compose up -d && pnpm cms:seed
//
// Organization mirrors the WARP conventions: block collections live nested
// and hidden under `pages`, the page editor uses Contents/Metadata tabs,
// and setup collections sit in a Setup folder.

import { readFile } from 'node:fs/promises'
import { login, api, apiUpload } from './directus.mjs'

const snapshot = JSON.parse(await readFile(new URL('../content/snapshot.json', import.meta.url), 'utf8'))

const BLOCK_COLLECTIONS = ['block_hero', 'block_metrics', 'block_about', 'block_projects', 'block_skills', 'block_cta', 'block_section', 'block_embed', 'block_testimonials']
const BLUE = '#3399FF'

const uuidPk = { field: 'id', type: 'uuid', meta: { special: ['uuid'], readonly: true, hidden: true }, schema: { is_primary_key: true } }
const str = (field, meta = {}) => ({ field, type: 'string', meta: { interface: 'input', options: { trim: true }, ...meta }, schema: {} })
const text = (field, meta = {}) => ({ field, type: 'text', meta: { interface: 'input-multiline', ...meta }, schema: {} })
// String arrays shown as chips (tech stacks, skill lists)
const tags = (field, meta = {}) => ({ field, type: 'json', meta: { special: ['cast-json'], interface: 'tags', display: 'labels', ...meta }, schema: {} })
// Repeater of { text } rows — for lists of sentences (architecture, outcomes)
const textList = (field, meta = {}) => ({
  field,
  type: 'json',
  meta: {
    special: ['cast-json'],
    interface: 'list',
    options: {
      template: '{{ text }}',
      fields: [{ field: 'text', name: 'text', type: 'text', meta: { field: 'text', type: 'text', interface: 'input-multiline', width: 'full', required: true } }],
    },
    ...meta,
  },
  schema: {},
})
const int = (field, meta = { hidden: true }) => ({ field, type: 'integer', meta, schema: {} })
const tabGroup = (field, sort) => ({ field, type: 'alias', meta: { special: ['alias', 'group', 'no-data'], interface: 'group-raw', group: 'tabs', sort }, schema: null })

// Collapsible sections inside a block editor (WARP convention: content / actions)
const detailGroup = (field, sort, headerIcon, note) => ({
  field,
  type: 'alias',
  meta: { special: ['alias', 'group', 'no-data'], interface: 'group-detail', options: { headerIcon, start: 'open' }, sort, note },
  schema: null,
})

const choices = (...values) => values.map(([text, value]) => ({ text, value }))
const linkSubfield = (field, meta) => ({ field, name: field, type: meta.type ?? 'string', meta: { field, type: meta.type ?? 'string', width: 'half', ...meta } })

// Call-to-action buttons repeater — mirrors WARP's block `links` field,
// which maps 1:1 onto Nuxt UI button props.
const linksField = (group) => ({
  field: 'links',
  type: 'json',
  meta: {
    special: ['cast-json'],
    interface: 'list',
    group,
    sort: 1,
    note: 'Call-to-action buttons (maps to Nuxt UI UButton props)',
    options: {
      template: '{{ label }}',
      fields: [
        linkSubfield('label', { interface: 'input', options: { trim: true }, required: true }),
        linkSubfield('to', { interface: 'input', options: { trim: true }, note: 'Internal path or external URL' }),
        linkSubfield('icon', { interface: 'input', options: { trim: true }, note: 'Lucide icon name, e.g. i-lucide-arrow-right' }),
        linkSubfield('color', { interface: 'select-dropdown', options: { choices: choices(['Primary', 'primary'], ['Neutral', 'neutral'], ['Success', 'success'], ['Warning', 'warning'], ['Error', 'error'], ['Info', 'info']) } }),
        linkSubfield('variant', { interface: 'select-dropdown', options: { choices: choices(['Solid', 'solid'], ['Outline', 'outline'], ['Soft', 'soft'], ['Subtle', 'subtle'], ['Ghost', 'ghost'], ['Link', 'link']) } }),
        linkSubfield('size', { interface: 'select-dropdown', options: { choices: choices(['XS', 'xs'], ['SM', 'sm'], ['MD', 'md'], ['LG', 'lg'], ['XL', 'xl']) } }),
        linkSubfield('target', { interface: 'select-dropdown', options: { choices: choices(['Same tab', '_self'], ['New tab', '_blank']) }, note: 'Where to open the link (defaults to same tab)' }),
      ],
    },
  },
  schema: {},
})

// The background styling trio shared by every section-level block — same
// options as block_section's Styling group, so the whole page has one system.
const BG_CHOICES = choices(
  ['Default', ''],
  ['Muted', 'bg-elevated/50'],
  ['Accent tint', 'bg-accent-100/60 dark:bg-accent-950/40'],
  ['Deep dark', 'dark bg-slate-950'],
  ['Accent gradient', 'dark bg-linear-to-br from-accent-950 to-slate-950'],
)
const stylingFields = (groupSort) => [
  detailGroup('styling', groupSort, 'palette', 'Background image and color options'),
  { field: 'bg_image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], group: 'styling', sort: 1, note: 'Background image for this section — synced by cms:sync.' }, schema: {} },
  {
    field: 'bg_color',
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      group: 'styling',
      sort: 2,
      width: 'half',
      note: 'Section background. "Deep dark" and "Accent gradient" flip the text to light automatically.',
      options: { choices: BG_CHOICES },
    },
    schema: { default_value: '' },
  },
  { field: 'bg_opacity', type: 'integer', meta: { interface: 'slider', group: 'styling', sort: 3, width: 'half', options: { minValue: 0, maxValue: 100, stepInterval: 5, alwaysShowValue: true }, note: 'Background image opacity (%).' }, schema: { default_value: 25 } },
]

const collections = [
  // ── Folders ────────────────────────────────────────────────────────────
  { collection: 'Setup', meta: { icon: 'settings', color: '#A2B5CD', sort: 5, collapse: 'open' }, schema: null },

  // ── Pages (block collections nest under this, like WARP's `page`) ─────
  {
    collection: 'pages',
    meta: { icon: 'edit_square', color: BLUE, sort: 1, note: 'Pages composed from ordered blocks', display_template: '{{slug}}' },
    fields: [
      uuidPk,
      { field: 'tabs', type: 'alias', meta: { special: ['alias', 'group', 'no-data'], interface: 'group-tabs', options: { align: 'stretch' }, sort: 2 }, schema: null },
      tabGroup('Contents', 1),
      tabGroup('Metadata', 2),
      str('title', { group: 'Contents', sort: 1, width: 'half', note: 'Optional page heading — also used in metadata.' }),
      str('slug', { group: 'Contents', sort: 2, width: 'half', note: 'The URL segment for this page.', required: true }),
      { field: 'blocks', type: 'alias', meta: { special: ['m2a'], interface: 'list-m2a', group: 'Contents', sort: 3, note: 'The ordered blocks that compose this page.' }, schema: null },
      text('description', { group: 'Metadata', sort: 1, options: { softLength: 160, trim: true }, note: 'A < 160 character description — used in page metadata and search engine results.' }),
    ],
  },
  {
    collection: 'pages_blocks',
    meta: { hidden: true, group: 'pages', sort: 1, icon: 'import_export', note: 'M2A junction: which blocks compose which page, in order' },
    fields: [uuidPk, { field: 'pages_id', type: 'uuid', meta: { hidden: true }, schema: {} }, str('collection', { hidden: true }), str('item', { hidden: true }), int('sort')],
  },
  {
    collection: 'block_hero',
    meta: { hidden: true, group: 'pages', sort: 2, icon: 'star', note: 'Hero block', display_template: '{{heading}}' },
    fields: [
      uuidPk,
      detailGroup('content', 2, 'article', 'Main content fields for this block'),
      detailGroup('actions', 3, 'link', 'Call-to-action links'),
      detailGroup('styling', 4, 'palette', 'Background image and visual options'),
      str('badge', { group: 'content', sort: 1, width: 'half', note: 'Small badge shown above the heading.' }),
      str('heading', { group: 'content', sort: 2, width: 'half', required: true }),
      str('subheading', { group: 'content', sort: 3 }),
      text('body', { group: 'content', sort: 4 }),
      linksField('actions'),
      { field: 'bg_image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], group: 'styling', sort: 1, width: 'half', note: 'Background image behind the hero gradient — synced by cms:sync.' }, schema: {} },
      { field: 'bg_opacity', type: 'integer', meta: { interface: 'slider', group: 'styling', sort: 2, width: 'half', options: { minValue: 0, maxValue: 100, stepInterval: 5, alwaysShowValue: true }, note: 'Background image opacity (%).' }, schema: { default_value: 30 } },
    ],
  },
  {
    collection: 'block_metrics',
    meta: { hidden: true, group: 'pages', sort: 3, icon: 'monitoring', note: 'Metrics band block — renders the Metrics collection', display_template: 'Metrics band' },
    fields: [
      uuidPk,
      str('eyebrow', { width: 'half', note: 'Optional — the band renders without a header when empty.' }),
      str('heading', { width: 'half', note: 'Optional heading shown above the metrics band.' }),
    ],
  },
  {
    collection: 'block_about',
    meta: { hidden: true, group: 'pages', sort: 4, icon: 'person', note: 'About block', display_template: '{{heading}}' },
    fields: [
      uuidPk,
      str('eyebrow', { width: 'half' }),
      str('heading', { width: 'half', required: true }),
      text('body', { note: 'Separate paragraphs with a blank line.' }),
      { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], note: 'Optional — switches the section to two columns with the image on the right. Synced by cms:sync.' }, schema: {} },
      ...stylingFields(9),
    ],
  },
  {
    collection: 'block_projects',
    meta: { hidden: true, group: 'pages', sort: 5, icon: 'work', note: 'Projects grid block — renders the Projects collection', display_template: '{{heading}}' },
    fields: [
      uuidPk,
      str('eyebrow', { width: 'half' }),
      str('heading', { width: 'half', required: true }),
      text('intro'),
      str('more_heading', { width: 'half', note: 'Optional trailing card heading (e.g. "…and more") — card hidden when empty.' }),
      text('more_text', { note: 'Body of the trailing "…and more" card.' }),
      ...stylingFields(9),
    ],
  },
  {
    collection: 'block_skills',
    meta: { hidden: true, group: 'pages', sort: 6, icon: 'category', note: 'Skills block — renders the Skill Groups collection', display_template: '{{heading}}' },
    fields: [uuidPk, str('eyebrow', { width: 'half' }), str('heading', { width: 'half', required: true }), ...stylingFields(9)],
  },
  {
    collection: 'block_cta',
    meta: { hidden: true, group: 'pages', sort: 7, icon: 'mail', note: 'Contact CTA block', display_template: '{{heading}}' },
    fields: [
      uuidPk,
      detailGroup('content', 2, 'article', 'Main content fields for this block'),
      detailGroup('actions', 3, 'link', 'Call-to-action links'),
      str('eyebrow', { group: 'content', sort: 1, width: 'half' }),
      str('heading', { group: 'content', sort: 2, width: 'half', required: true }),
      text('body', { group: 'content', sort: 3 }),
      linksField('actions'),
      ...stylingFields(4),
    ],
  },

  {
    // The "global component" block, mirroring WARP's block_section: a named,
    // reusable section whose `display` field selects the rendering component.
    collection: 'block_section',
    meta: { hidden: true, group: 'pages', sort: 8, icon: 'rectangle', note: 'Reusable section — display picks the component', display_template: '{{name}}' },
    fields: [
      uuidPk,
      detailGroup('content', 2, 'article', 'Main content fields for this block'),
      detailGroup('layout', 3, 'view_compact', 'Layout and display options'),
      detailGroup('styling', 4, 'palette', 'Background image and color options'),
      detailGroup('actions', 5, 'link', 'Call-to-action links'),
      str('name', { sort: 1, required: true, note: 'Name your block (must be unique) — this is how you find it to reuse it on other pages.' }),
      str('headline', { group: 'content', sort: 1, width: 'half', note: 'Small text displayed above the title' }),
      str('title', { group: 'content', sort: 2, width: 'half' }),
      text('body', { group: 'content', sort: 3, note: 'Separate paragraphs with a blank line.' }),
      { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], group: 'content', sort: 4, note: 'Optional image — synced into the repo by cms:sync.' }, schema: {} },
      {
        field: 'display',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          group: 'layout',
          sort: 1,
          note: 'Select the section component, or type a custom global component name',
          options: {
            allowOther: true,
            choices: choices(['Default', 'SectionDefault'], ['Center Card', 'SectionCenterCard'], ['Two Column', 'SectionTwoColumn']),
          },
        },
        schema: { default_value: 'SectionDefault' },
      },
      { field: 'bg_image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], group: 'styling', sort: 1, note: 'Background image for this section — synced by cms:sync.' }, schema: {} },
      {
        field: 'bg_color',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          group: 'styling',
          sort: 2,
          width: 'half',
          note: 'Section background. "Deep dark" and "Accent gradient" flip the text to light automatically.',
          options: { choices: BG_CHOICES },
        },
        schema: { default_value: '' },
      },
      { field: 'bg_opacity', type: 'integer', meta: { interface: 'slider', group: 'styling', sort: 3, width: 'half', options: { minValue: 0, maxValue: 100, stepInterval: 5, alwaysShowValue: true }, note: 'Background image opacity (%).' }, schema: { default_value: 25 } },
      linksField('actions'),
    ],
  },
  {
    collection: 'block_embed',
    meta: { hidden: true, group: 'pages', sort: 9, icon: 'smart_display', note: 'Embedded media (YouTube)', display_template: '{{heading}}' },
    fields: [
      uuidPk,
      str('heading', { sort: 1, width: 'half' }),
      str('url', { sort: 2, note: 'YouTube URL (watch, share, or shorts link)', required: true }),
      str('caption', { sort: 3 }),
    ],
  },
  {
    collection: 'block_testimonials',
    meta: { hidden: true, group: 'pages', sort: 10, icon: 'format_quote', note: 'Quote carousel — what colleagues say', display_template: '{{heading}}' },
    fields: [
      uuidPk,
      str('eyebrow', { sort: 1, width: 'half' }),
      str('heading', { sort: 2, width: 'half', required: true }),
      {
        field: 'quotes',
        type: 'json',
        meta: {
          special: ['cast-json'],
          interface: 'list',
          sort: 3,
          options: {
            template: '{{ name }} — {{ quote }}',
            fields: [
              { field: 'quote', name: 'quote', type: 'text', meta: { field: 'quote', type: 'text', interface: 'input-multiline', width: 'full', required: true } },
              { field: 'name', name: 'name', type: 'string', meta: { field: 'name', type: 'string', interface: 'input', width: 'half', required: true } },
              { field: 'role', name: 'role', type: 'string', meta: { field: 'role', type: 'string', interface: 'input', width: 'half', note: 'Team or role — shown under the name.' } },
            ],
          },
          note: 'The quotes in the carousel.',
        },
        schema: {},
      },
      ...stylingFields(9),
    ],
  },

  // ── Content collections ────────────────────────────────────────────────
  {
    collection: 'projects',
    meta: { icon: 'work', color: BLUE, sort: 2, note: 'Case studies', sort_field: 'sort', display_template: '{{title}}' },
    fields: [
      uuidPk,
      str('title', { sort: 1, required: true }),
      str('slug', { sort: 2, width: 'half', note: 'URL segment: /projects/<slug>', required: true }),
      str('featured', { sort: 3, width: 'half', note: 'Short mono-font stat line shown above the title.' }),
      str('subtitle', { sort: 4 }),
      text('summary', { sort: 5, note: 'Card summary shown in the projects grid.' }),
      text('problem', { sort: 6 }),
      textList('architecture', { sort: 7, note: 'Bullet points for the Architecture section.' }),
      textList('outcomes', { sort: 8, note: 'Bullet points for the Outcome section.' }),
      tags('stack', { sort: 9, note: 'Tech shown as badges — press Enter after each entry.' }),
      text('callout', { sort: 10, note: 'Optional highlight box on the case study page.' }),
      { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], sort: 11, note: 'Optional screenshot — synced into the repo by cms:sync.' }, schema: {} },
      str('demo_video', { sort: 12, note: 'YouTube URL — renders the Demo section on the case study page.' }),
      str('site_url', { sort: 13, note: 'Public URL of the live system — shown as a visit link on the case study page.' }),
      int('sort'),
    ],
  },
  {
    collection: 'metrics',
    meta: { icon: 'monitoring', color: BLUE, sort: 3, note: 'Headline stats shown in the metrics band', sort_field: 'sort', display_template: '{{value}} {{label}}' },
    fields: [uuidPk, str('value', { width: 'half', required: true }), str('label', { width: 'half', required: true }), int('sort')],
  },
  {
    collection: 'skill_groups',
    meta: { icon: 'category', color: BLUE, sort: 4, note: 'Grouped skills for the skills section', sort_field: 'sort', display_template: '{{title}}' },
    fields: [uuidPk, str('title', { required: true }), tags('items', { note: 'Skills shown as badges — press Enter after each entry.' }), int('sort')],
  },

  // ── Setup ──────────────────────────────────────────────────────────────
  {
    collection: 'site_settings',
    meta: { singleton: true, group: 'Setup', sort: 1, icon: 'tune', note: 'Global site copy, links, and files' },
    // `resume` (string path) was replaced by the `resume_file` Directus file
    removedFields: ['resume'],
    fields: [
      uuidPk,
      str('name', { sort: 1, width: 'half' }), str('role', { sort: 2, width: 'half' }),
      str('tagline', { sort: 3, width: 'half' }), str('location', { sort: 4, width: 'half' }),
      str('email', { sort: 5, width: 'half' }), str('github', { sort: 6, width: 'half' }),
      str('linkedin', { sort: 7, width: 'half' }),
      { field: 'resume_file', type: 'uuid', meta: { interface: 'file', special: ['file'], sort: 8, width: 'half', note: 'Resume PDF — synced into the repo by cms:sync.' }, schema: {} },
      { field: 'headshot', type: 'uuid', meta: { interface: 'file-image', special: ['file'], sort: 9, note: 'Avatar photo shown in the site header — synced by cms:sync.' }, schema: {} },
      str('url', { sort: 10, note: 'Canonical site URL (no trailing slash).' }),
      text('summary', { sort: 11 }),
      text('private_work_note', { sort: 12, note: 'Shown as the callout in the About section.' }),
      str('status', { sort: 13, note: 'The "currently" line in the hero (amber pulse) — hidden when empty.' }),
    ],
  },
]

// File library folders (name → note for future uploads)
const FOLDERS = ['Documents', 'Photos', 'Projects']

const relations = [
  {
    collection: 'pages_blocks',
    field: 'pages_id',
    related_collection: 'pages',
    meta: { one_field: 'blocks', sort_field: 'sort', one_deselect_action: 'delete', junction_field: 'item' },
    schema: { on_delete: 'CASCADE' },
  },
  {
    collection: 'pages_blocks',
    field: 'item',
    related_collection: null,
    meta: {
      one_allowed_collections: BLOCK_COLLECTIONS,
      one_collection_field: 'collection',
      one_deselect_action: 'nullify',
      junction_field: 'pages_id',
    },
    schema: null,
  },
]

async function syncCollection(def) {
  const existing = await api(`/collections/${def.collection}`, { ok404: true })
  if (!existing) {
    await api('/collections', {
      method: 'POST',
      body: { collection: def.collection, meta: def.meta, schema: def.schema === null ? null : {}, fields: def.fields },
    })
    console.log(`  created collection ${def.collection}`)
    return
  }

  await api(`/collections/${def.collection}`, { method: 'PATCH', body: { meta: def.meta } })
  for (const field of def.fields ?? []) {
    const current = await api(`/fields/${def.collection}/${field.field}`, { ok404: true })
    if (!current) {
      await api(`/fields/${def.collection}`, { method: 'POST', body: field })
      console.log(`  added field ${def.collection}.${field.field}`)
    } else {
      await api(`/fields/${def.collection}/${field.field}`, { method: 'PATCH', body: { meta: field.meta } })
    }
  }
  for (const field of def.removedFields ?? []) {
    const current = await api(`/fields/${def.collection}/${field}`, { ok404: true })
    if (current) {
      await api(`/fields/${def.collection}/${field}`, { method: 'DELETE' })
      console.log(`  removed field ${def.collection}.${field}`)
    }
  }
  console.log(`  synced collection ${def.collection}`)
}

async function ensureFolders() {
  const existing = await api('/folders?limit=-1&fields=id,name')
  const folders = {}
  for (const name of FOLDERS) {
    let folder = existing.find((f) => f.name === name)
    if (!folder) {
      folder = await api('/folders', { method: 'POST', body: { name } })
      console.log(`  created file folder ${name}`)
    }
    folders[name] = folder.id
  }
  return folders
}

async function ensureResumeFile(folders) {
  const RESUME = 'Jacob_Willis_Resume_2026.pdf'
  const existing = await api(`/files?filter[filename_download][_eq]=${RESUME}&fields=id&limit=1`)
  let fileId = existing[0]?.id
  if (!fileId) {
    const buffer = await readFile(new URL(`../public/files/${RESUME}`, import.meta.url))
      .catch(() => readFile(new URL(`../public/${RESUME}`, import.meta.url)))
    const form = new FormData()
    form.append('folder', folders.Documents)
    form.append('file', new Blob([buffer], { type: 'application/pdf' }), RESUME)
    const file = await apiUpload(form)
    fileId = file.id
    console.log(`  uploaded ${RESUME} to Documents`)
  }
  await api('/items/site_settings', { method: 'PATCH', body: { resume_file: fileId } })
  console.log('  site_settings.resume_file linked')
}

async function ensureRelation(rel) {
  const existing = await api(`/relations/${rel.collection}/${rel.field}`, { ok404: true })
  if (existing) {
    // Keep relation meta in sync — new block collections must be added to
    // the M2A's one_allowed_collections or they can't be picked in the editor.
    await api(`/relations/${rel.collection}/${rel.field}`, { method: 'PATCH', body: { meta: rel.meta } })
    console.log(`  synced relation ${rel.collection}.${rel.field}`)
    return
  }
  await api('/relations', { method: 'POST', body: rel })
  console.log(`  created relation ${rel.collection}.${rel.field}`)
}

async function upsert(collection, item) {
  const existing = await api(`/items/${collection}/${item.id}`, { ok404: true })
  if (existing) await api(`/items/${collection}/${item.id}`, { method: 'PATCH', body: item })
  else await api(`/items/${collection}`, { method: 'POST', body: item })
}

async function ensurePublicReadAccess() {
  // The Nuxt app reads Directus anonymously in live mode, so the public
  // policy needs read permissions on every content collection.
  const policies = await api('/policies?limit=-1&fields=id,name,admin_access')
  const publicPolicy = policies.find((p) => /public/i.test(p.name) && !p.admin_access)
  if (!publicPolicy) {
    console.warn('  ! no public policy found — skipping public read permissions')
    return
  }
  const readable = ['site_settings', 'metrics', 'skill_groups', 'projects', 'pages', 'pages_blocks', ...BLOCK_COLLECTIONS, 'directus_files']
  const existing = await api(`/permissions?limit=-1&filter[policy][_eq]=${publicPolicy.id}&fields=collection,action`)
  for (const collection of readable) {
    if (existing.some((p) => p.collection === collection && p.action === 'read')) continue
    await api('/permissions', {
      method: 'POST',
      body: { policy: publicPolicy.id, collection, action: 'read', fields: ['*'], permissions: {}, validation: {} },
    })
    console.log(`  granted public read on ${collection}`)
  }
}

async function configureVisualEditor() {
  try {
    await api('/settings', { method: 'PATCH', body: { visual_editor_urls: [{ url: 'http://localhost:3000' }] } })
    console.log('  visual editor URL set to http://localhost:3000')
  } catch (error) {
    console.warn(`  ! could not set visual editor URL: ${error.message}`)
  }
}

await login()

console.log('Schema:')
for (const def of collections) await syncCollection(def)
for (const rel of relations) await ensureRelation(rel)

console.log('Files:')
const folders = await ensureFolders()

console.log('Content:')
// resume + headshot in the snapshot are local paths written by cms:sync —
// the actual files live in Directus (resume_file / headshot), never re-seeded.
const { resume, headshot, ...settingsSeed } = snapshot.settings
await api('/items/site_settings', { method: 'PATCH', body: settingsSeed })
console.log('  site_settings upserted')
await ensureResumeFile(folders)

for (const [collection, items] of [
  ['metrics', snapshot.metrics],
  ['skill_groups', snapshot.skill_groups],
  // The snapshot stores images as local /images/ paths (written by cms:sync),
  // not Directus file ids — so image is managed in Directus, never re-seeded.
  ['projects', snapshot.projects.map(({ image, ...rest }) => rest)],
]) {
  for (const item of items) await upsert(collection, item)
  console.log(`  ${items.length} ${collection} upserted`)
}

for (const page of snapshot.pages) {
  const { blocks, ...pageFields } = page
  await upsert('pages', pageFields)
  for (const block of blocks) {
    // Snapshot stores block images as local paths written by cms:sync — file
    // fields are managed in Directus, never re-seeded (same rule as projects).
    const { image, bg_image, ...itemSeed } = block.item
    await upsert(block.collection, itemSeed)
    await upsert('pages_blocks', {
      id: block.id,
      pages_id: page.id,
      collection: block.collection,
      item: block.item.id,
      sort: block.sort,
    })
  }
  console.log(`  page "${page.slug}" upserted with ${blocks.length} blocks`)
}

console.log('Access:')
await ensurePublicReadAccess()
await configureVisualEditor()

console.log('\nSeed complete. Open http://localhost:8055 (admin@example.com / portfolio).')
