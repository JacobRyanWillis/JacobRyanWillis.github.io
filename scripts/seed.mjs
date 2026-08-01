// Creates the portfolio schema in the local Directus instance and seeds it
// from content/snapshot.json. Idempotent: collections are only created when
// missing and items are upserted by id.
//
//   docker compose up -d && pnpm cms:seed

import { readFile } from 'node:fs/promises'
import { login, api } from './directus.mjs'

const snapshot = JSON.parse(await readFile(new URL('../content/snapshot.json', import.meta.url), 'utf8'))

const BLOCK_COLLECTIONS = ['block_hero', 'block_metrics', 'block_about', 'block_projects', 'block_skills', 'block_cta']

const uuidPk = { field: 'id', type: 'uuid', meta: { special: ['uuid'], readonly: true, hidden: true }, schema: { is_primary_key: true } }
const str = (field, opts = {}) => ({ field, type: 'string', meta: opts.meta ?? {}, schema: {} })
const text = (field) => ({ field, type: 'text', meta: { interface: 'input-multiline' }, schema: {} })
const json = (field) => ({ field, type: 'json', meta: { special: ['cast-json'], interface: 'list' }, schema: {} })
const int = (field, hidden = true) => ({ field, type: 'integer', meta: { hidden }, schema: {} })

const collections = [
  {
    collection: 'site_settings',
    meta: { singleton: true, icon: 'settings', note: 'Global site copy and links' },
    fields: [uuidPk, str('name'), str('role'), str('tagline'), str('location'), str('email'), str('github'), str('linkedin'), str('resume'), str('url'), text('summary'), text('private_work_note')],
  },
  {
    collection: 'metrics',
    meta: { icon: 'monitoring', note: 'Headline stats shown in the metrics band', sort_field: 'sort', display_template: '{{value}} {{label}}' },
    fields: [uuidPk, str('value'), str('label'), int('sort')],
  },
  {
    collection: 'skill_groups',
    meta: { icon: 'category', note: 'Grouped skills for the skills section', sort_field: 'sort', display_template: '{{title}}' },
    fields: [uuidPk, str('title'), json('items'), int('sort')],
  },
  {
    collection: 'projects',
    meta: { icon: 'work', note: 'Case studies', sort_field: 'sort', display_template: '{{title}}' },
    fields: [
      uuidPk, str('slug'), str('title'), str('subtitle'), text('summary'), str('featured'),
      text('problem'), json('architecture'), json('stack'), json('outcomes'), text('callout'),
      { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'] }, schema: {} },
      int('sort'),
    ],
  },
  {
    collection: 'pages',
    meta: { icon: 'article', note: 'Pages composed from blocks', display_template: '{{slug}}' },
    fields: [
      uuidPk, str('slug'), str('title'), text('description'),
      { field: 'blocks', type: 'alias', meta: { special: ['m2a'], interface: 'list-m2a' }, schema: null },
    ],
  },
  {
    // Mirrors the production WARP junction: page_blocks { id, page_id, collection, item, sort }
    collection: 'pages_blocks',
    meta: { hidden: true },
    fields: [uuidPk, { field: 'pages_id', type: 'uuid', meta: { hidden: true }, schema: {} }, str('collection', { meta: { hidden: true } }), str('item', { meta: { hidden: true } }), int('sort')],
  },
  { collection: 'block_hero', meta: { icon: 'star', note: 'Hero block', display_template: '{{heading}}' }, fields: [uuidPk, str('badge'), str('heading'), str('subheading'), text('body')] },
  { collection: 'block_metrics', meta: { icon: 'monitoring', note: 'Metrics band block', display_template: 'Metrics band' }, fields: [uuidPk, str('eyebrow'), str('heading')] },
  { collection: 'block_about', meta: { icon: 'person', note: 'About block', display_template: '{{heading}}' }, fields: [uuidPk, str('eyebrow'), str('heading'), text('body')] },
  { collection: 'block_projects', meta: { icon: 'work', note: 'Projects grid block', display_template: '{{heading}}' }, fields: [uuidPk, str('eyebrow'), str('heading'), text('intro')] },
  { collection: 'block_skills', meta: { icon: 'category', note: 'Skills block', display_template: '{{heading}}' }, fields: [uuidPk, str('eyebrow'), str('heading')] },
  { collection: 'block_cta', meta: { icon: 'mail', note: 'Contact CTA block', display_template: '{{heading}}' }, fields: [uuidPk, str('eyebrow'), str('heading'), text('body')] },
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

async function ensureCollection(def) {
  const existing = await api(`/collections/${def.collection}`, { ok404: true })
  if (existing) {
    console.log(`  collection ${def.collection} exists`)
    return
  }
  await api('/collections', { method: 'POST', body: { collection: def.collection, meta: def.meta, schema: {}, fields: def.fields } })
  console.log(`  created collection ${def.collection}`)
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
for (const def of collections) await ensureCollection(def)
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
