import rawCatalog from './catalog.json'
import rawSearchIndex from './search-index.json'
import { matchesSearchText } from './search'
import type { BlogEntry } from './types'

export const blogEntries = rawCatalog as BlogEntry[]
const searchIndex = rawSearchIndex as Record<string, string>
export const blogCategories = [...new Set(blogEntries.map(entry => entry.category))].sort()
export const blogTags = [...new Set(blogEntries.flatMap(entry => entry.tags ?? []))].sort()
export const tagCounts = new Map(blogTags.map(tag => [tag, blogEntries.filter(entry => entry.tags?.includes(tag)).length]))
export const formatNames = { explainer: 'Explainer', walkthrough: 'Guide', comparison: 'Comparison', 'decision-brief': 'Decision brief', troubleshooting: 'Troubleshooting', architecture: 'Architecture', 'field-notes': 'Field notes', playbook: 'Playbook' }
export function filterArticles(query: string, category: string, tag = 'All') {
  return blogEntries.filter(entry => (category === 'All' || entry.category === category) && (tag === 'All' || entry.tags.includes(tag)) && matchesSearchText(searchIndex[entry.slug], query))
}

export function relatedArticles(entry: BlogEntry) {
  const relevance = (item: BlogEntry) => item.tags.filter(tag => entry.tags.includes(tag)).length * 2 + Number(item.category === entry.category)
  const index = blogEntries.findIndex(item => item.slug === entry.slug)
  const next = index < 0 ? null : blogEntries[(index + 1) % blogEntries.length]
  const ranked = blogEntries.filter(item => item.slug !== entry.slug).sort((a, b) => relevance(b) - relevance(a))
  const relevant = ranked.filter(item => item.slug !== next?.slug).slice(0, 2)
  return next ? [...relevant, next] : ranked.slice(0, 3)
}

// Field-guide series cross-links: keeps the 70+ field-guide articles reachable
// from every article instead of relying on search alone.
export function relatedFieldGuides(entry: BlogEntry) {
  const guides = blogEntries.filter(item => item.slug.startsWith('field-guide-') && item.slug !== entry.slug)
  const relevance = (item: BlogEntry) => item.tags.filter(tag => entry.tags.includes(tag)).length * 2 + Number(item.category === entry.category)
  return guides.sort((a, b) => relevance(b) - relevance(a) || (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')).slice(0, 3)
}

export function formatDate(date: string | null) {
  return date ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : null
}
