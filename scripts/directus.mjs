// Shared helpers for the local Directus authoring instance.

export const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055'
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD ?? 'portfolio'

let token

export async function apiUpload(formData) {
  const res = await fetch(`${DIRECTUS_URL}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) throw new Error(`POST /files failed (${res.status}): ${await res.text()}`)
  return (await res.json()).data
}

export async function login() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  token = (await res.json()).data.access_token
}

export async function api(path, { method = 'GET', body, ok404 = false } = {}) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  // Directus reports missing collections/items as 403 as well as 404
  if ((res.status === 404 || res.status === 403) && ok404) return null
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${await res.text()}`)
  if (res.status === 204) return null
  return (await res.json()).data
}
