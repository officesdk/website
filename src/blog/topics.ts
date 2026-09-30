import catalog from './catalog.json'
import type { BlogEntry } from './types'

// Topic hubs are the crawlable landing pages for the journal's strongest
// themes. Each hub aggregates every article that carries one of its tags, so
// the counts below come straight from catalog.json.
export type BlogTopic = {
  slug: string
  title: string
  h1: string
  description: string
  intro: string
  tags: string[]
}

export const blogTopics: BlogTopic[] = [
  {
    slug: 'document-preview',
    title: 'Document preview',
    h1: 'Preview Office files where the work happens.',
    description: 'Articles on previewing Word, Excel, PowerPoint, PDF, and other files inside your product without sending users to a separate tool.',
    intro: 'Preview is the first document surface most products ship: let users inspect the file beside the record that gives it meaning. These field notes cover first-open latency, access checks, and the boundary between viewing and editing.',
    tags: ['Document preview'],
  },
  {
    slug: 'embedded-editing',
    title: 'Embedded editing',
    h1: 'Edit documents inside your own product.',
    description: 'Articles on embedding collaborative Word, Excel, and PowerPoint editing in web apps, with save paths and version ownership kept in your system.',
    intro: 'Embedded editing only works when the surrounding product stays in charge: identity, permissions, and the save destination. These notes cover the editor surface, collaboration behavior, and the handoff back to your backend.',
    tags: ['Embedded editing', 'Collaboration'],
  },
  {
    slug: 'document-conversion',
    title: 'Document conversion',
    h1: 'Convert Office files without losing fidelity.',
    description: 'Articles on converting between Office formats and beyond: import and export paths, fidelity checks, and where conversion belongs in a workflow.',
    intro: 'Conversion is where format claims get tested. Every article here treats import, export, and transformation as separate operations to validate with representative files before production.',
    tags: ['Document conversion'],
  },
  {
    slug: 'self-hosting',
    title: 'Self-hosting',
    h1: 'Run the document surface on your infrastructure.',
    description: 'Articles on self-hosting Office SDK: single-server proofs of concept, production baselines, upgrades, and the operating checks worth recording.',
    intro: 'Self-hosting keeps files, access decisions, and audit history inside the infrastructure you already operate. These notes cover the deployment path from first proof of concept to a maintained production service.',
    tags: ['Self-hosting'],
  },
  {
    slug: 'document-security',
    title: 'Security and access control',
    h1: 'Keep document access a decision your system makes.',
    description: 'Articles on document security: access control, data privacy, audit trails, and the review evidence security teams ask for before sign-off.',
    intro: 'A document surface must never become a second authorization system. These field notes cover permission-preserving integration, privacy reviews, and the evidence that satisfies a security review.',
    tags: ['Security', 'Access control', 'Data privacy'],
  },
  {
    slug: 'version-control',
    title: 'Version control',
    h1: 'Give every document version an owner.',
    description: 'Articles on document versioning: save paths, version identity, conflict handling, and reconciling editor state with your system of record.',
    intro: 'Version questions decide whether an embedded editor can be trusted in production: which save produced which version, and which record points to it. These notes treat version identity as a first-class integration concern.',
    tags: ['Version control'],
  },
  {
    slug: 'document-storage',
    title: 'Document storage',
    h1: 'Keep storage where your records live.',
    description: 'Articles on document storage boundaries: storage keys, object ownership, retention, and keeping the editor out of the storage business.',
    intro: 'The editor surface should receive context, not own the archive. These articles map the storage boundary: where files live, who issues access, and how results return to the system of record.',
    tags: ['Document storage'],
  },
  {
    slug: 'ai-documents',
    title: 'AI documents',
    h1: 'Connect AI workflows to real Office files.',
    description: 'Articles on AI document workflows: task briefs, agent-produced Office files, review surfaces, and keeping humans accountable for the result.',
    intro: 'AI-generated drafts still land as Office files on someone\u2019s desk. These field notes cover the contracts between agents, editors, and reviewers so the file that reaches a person is inspectable and owned.',
    tags: ['AI documents'],
  },
]

export function topicEntries(topic: BlogTopic): BlogEntry[] {
  return (catalog as BlogEntry[])
    .filter(entry => entry.tags.some(tag => topic.tags.includes(tag)))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

// Topic hubs that cover an article, strongest match first. Used for the
// per-article topic rail so every article links into the hub system.
export function topicsForEntry(entry: { tags: string[] }): BlogTopic[] {
  return blogTopics
    .map(topic => ({ topic, matches: entry.tags.filter(tag => topic.tags.includes(tag)).length }))
    .filter(item => item.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 3)
    .map(item => item.topic)
}
