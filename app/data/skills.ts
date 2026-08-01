export interface SkillGroup {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'C', 'PHP'],
  },
  {
    title: 'Frontend',
    items: ['Vue.js', 'Nuxt', 'React', 'React Native', 'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Bulma', 'NuxtUI', 'MJML', 'ApexCharts'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'SQLite', 'Supabase'],
  },
  {
    title: 'AI Tooling',
    items: ['AI OCR pipelines', 'LLM API integration', 'MCP servers & tooling', 'AI-assisted workflow automation'],
  },
  {
    title: 'Tools & Platforms',
    items: ['Git/GitHub', 'Directus CMS', 'Docker', 'Cloudflare', 'GetResponse', 'Meta Graph API', 'YouTube Data API', 'GraphQL', 'Apollo', 'PrestaShop', 'Figma', 'Insomnia', 'Google Apps Script'],
  },
  {
    title: 'Concepts',
    items: ['RESTful APIs', 'Headless CMS', 'MVC Architecture', 'State Management', 'OOP', 'Responsive Design'],
  },
]
