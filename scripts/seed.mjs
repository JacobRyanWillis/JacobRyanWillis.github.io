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
import { login, api } from './directus.mjs'

const snapshot = JSON.parse(await readFile(new URL('../content/snapshot.json', import.meta.url), 'utf8'))

const BLOCK_COLLECTIONS = ['block_hero', 'block_metrics', 'block_about', 'block_projects', 'block_skills', 'block_cta']
const BLUE = '#3399FF'

const uuidPk = { field: 'id', type: 'uuid', meta: { special: ['uuid'], readonly: true, hidden: true }, schema: { is_primary_key: true } }
const str = (field, meta = {}) => ({ field, type: 'string', meta: { interface: 'input', options: { trim: true }, ...meta }, schema: {} })
const text = (field, meta = {}) => ({ field, type: 'text', meta: { interface: 'input-multiline', ...meta }, schema: {} })
const json = (field, meta = {}) => ({ field, type: 'json', meta: { special: ['cast-json'], interface: 'list', ...meta }, schema: {} })
const int = (field, meta = { hidden: true }) => ({ field, type: 'integer', meta, schema: {} })
const tabGroup = (field, sort) => ({ field, type: 'alias', meta: { special: ['alias', 'group', 'no-data'], interface: 'group-raw', group: 'tabs', sort }, schema: null })

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
    fields: [uuidPk, str('badge', { width: 'half' }), str('heading', { width: 'half', required: true }), str('subheading'), text('body')],
  },
  {
    collection: 'block_metrics',
    meta: { hidden: true, group: 'pages', sort: 3, icon: 'monitoring', note: 'Metrics band block — renders the Metrics collection', display_template: 'Metrics band' },
    fields: [uuidPk, str('eyebrow', { width: 'half' }), str('heading', { width: 'half' })],
  },
  {
    collection: 'block_about',
    meta: { hidden: true, group: 'pages', sort: 4, icon: 'person', note: 'About block', display_template: '{{heading}}' },
    fields: [uuidPk, str('eyebrow', { width: 'half' }), str('heading', { width: 'half', required: true }), text('body', { note: 'Separate paragraphs with a blank line.' })],
  },
  {
    collection: 'block_projects',
    meta: { hidden: true, group: 'pages', sort: 5, icon: 'work', note: 'Projects grid block — renders the Projects collection', display_template: '{{heading}}' },
    fields: [uuidPk, str('eyebrow', { width: 'half' }), str('heading', { width: 'half', required: true }), text('intro')],
  },
  {
    collection: 'block_skills',
    meta: { hidden: true, group: 'pages', sort: 6, icon: 'category', note: 'Skills block — renders the Skill Groups collection', display_template: '{{heading}}' },
    fields: [uuidPk, str('eyebrow', { width: 'half' }), str('heading', { width: 'half', required: true })],
  },
  {
    collection: 'block_cta',
    meta: { hidden: true, group: 'pages', sort: 7, icon: 'mail', note: 'Contact CTA block', display_template: '{{heading}}' },
    fields: [uuidPk, str('eyebrow', { width: 'half' }), str('heading', { width: 'half', required: true }), text('body')],
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
      json('architecture', { sort: 7 }),
      json('outcomes', { sort: 8 }),
      json('stack', { sort: 9, note: 'Tech shown as badges.' }),
      text('callout', { sort: 10, note: 'Optional highlight box on the case study page.' }),
      { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], sort: 11, note: 'Optional screenshot — synced into the repo by cms:sync.' }, schema: {} },
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
    fields: [uuidPk, str('title', { required: true }), json('items'), int('sort')],
  },

  // ── Setup ──────────────────────────────────────────────────────────────
  {
    collection: 'site_settings',
    meta: { singleton: true, group: 'Setup', sort: 1, icon: 'tune', note: 'Global site copy and links' },
    fields: [
      uuidPk,
      str('name', { sort: 1, width: 'half' }), str('role', { sort: 2, width: 'half' }),
      str('tagline', { sort: 3, width: 'half' }), str('location', { sort: 4, width: 'half' }),
      str('email', { sort: 5, width: 'half' }), str('github', { sort: 6, width: 'half' }),
      str('linkedin', { sort: 7, width: 'half' }), str('resume', { sort: 8, width: 'half', note: 'Path to the resume PDF in public/.' }),
      str('url', { sort: 9, note: 'Canonical site URL (no trailing slash).' }),
      text('summary', { sort: 10 }),
      text('private_work_note', { sort: 11, note: 'Shown as the callout in the About section.' }),
    ],
  },
]

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
  console.log(`  synced collection ${def.collection}`)
}

async function ensureRelation(rel) {
  const existing = await api(`/relations/${rel.collection}/${rel.field}`, { ok404: true })
  if (existing) {
    console.log(`  relation ${rel.collection}.${rel.field} exists`)
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
    await api('/settings', { method: 'PATCH', body: { visual_editor_urls: ['http://localhost:3000'] } })
    console.log('  visual editor URL set to http://localhost:3000')
  } catch (error) {
    console.warn(`  ! could not set visual editor URL: ${error.message}`)
  }
}

await login()

console.log('Schema:')
for (const def of collections) await syncCollection(def)
for (const rel of relations) await ensureRelation(rel)

console.log('Content:')
await api('/items/site_settings', { method: 'PATCH', body: snapshot.settings })
console.log('  site_settings upserted')

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
    await upsert(block.collection, block.item)
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
