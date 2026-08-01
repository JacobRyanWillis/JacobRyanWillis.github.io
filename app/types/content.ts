export interface SiteSettings {
  id: string
  name: string
  role: string
  tagline: string
  location: string
  email: string
  github: string
  linkedin: string
  resume: string | null
  headshot: string | null
  url: string
  summary: string
  private_work_note: string
  status: string | null
}

export interface Metric {
  id: string
  value: string
  label: string
  sort: number
}

export interface SkillGroup {
  id: string
  title: string
  items: string[]
  sort: number
}

export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string
  summary: string
  featured: string | null
  problem: string
  architecture: { text: string }[]
  stack: string[]
  outcomes: { text: string }[]
  callout: string | null
  image: string | null
  demo_video: string | null
  site_url: string | null
  sort: number
}

export interface PageBlock {
  id: string
  collection: string
  sort: number
  item: Record<string, any>
}

export interface Page {
  id: string
  slug: string
  title: string | null
  description: string | null
  blocks: PageBlock[]
}

export interface Snapshot {
  settings: SiteSettings
  metrics: Metric[]
  skill_groups: SkillGroup[]
  projects: Project[]
  pages: Page[]
}
