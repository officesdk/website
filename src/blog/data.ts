import rawCatalog from './catalog.json'
import type { BlogEntry } from './types'

export const blogEntries = rawCatalog as BlogEntry[]
export const blogCategories = [...new Set(blogEntries.map(entry => entry.category))].sort()
export const blogTags = [...new Set(blogEntries.flatMap(entry => entry.tags ?? []))].sort()
export const tagCounts = new Map(blogTags.map(tag => [tag, blogEntries.filter(entry => entry.tags?.includes(tag)).length]))
export const formatNames = { explainer: 'Explainer', walkthrough: 'Guide', comparison: 'Comparison', 'decision-brief': 'Decision brief', troubleshooting: 'Troubleshooting', architecture: 'Architecture', 'field-notes': 'Field notes', playbook: 'Playbook' }
export function filterArticles(query: string, category: string, tag = 'All') {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  return blogEntries.filter(entry => (category === 'All' || entry.category === category) && (tag === 'All' || entry.tags.includes(tag)) && terms.every(term => `${entry.title} ${entry.description} ${entry.category} ${entry.tags.join(' ')} ${entry.concepts.join(' ')}`.toLocaleLowerCase().includes(term)))
}

export function relatedArticles(entry: BlogEntry) {
  const relevance = (item: BlogEntry) => item.tags.filter(tag => entry.tags.includes(tag)).length * 2 + Number(item.category === entry.category)
  return blogEntries.filter(item => item.slug !== entry.slug).sort((a, b) => relevance(b) - relevance(a)).slice(0, 3)
}

export function formatDate(date: string | null) {
  return date ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : null
}
