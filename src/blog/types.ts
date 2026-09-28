export type BlogCategory = 'Integration' | 'Self-hosting' | 'Security' | 'AI & documents' | 'Office workflows' | 'Comparisons' | 'Operations' | 'Migration'
export type ArticleFormat = 'explainer' | 'walkthrough' | 'comparison' | 'decision-brief' | 'troubleshooting' | 'architecture' | 'field-notes' | 'playbook'
export type SectionKind = 'prose' | 'steps' | 'comparison' | 'diagnostic' | 'example' | 'checklist' | 'note'

export type ArticleFigure = {
  kind: 'flow' | 'sequence' | 'comparison' | 'layers' | 'matrix' | 'document' | 'decision'
  title: string
  items: Array<{ label: string; detail: string }>
  src: string
  mobileSrc: string
  alt: string
  caption: string
  width: number
  height: number
  mobileWidth: number
  mobileHeight: number
}

export type EditorialRecipe = {
  hero: string
  body: string
  signature: string
  accent: string
  soft: string
  number: number
}

export type BlogEntry = {
  slug: string
  title: string
  description: string
  category: BlogCategory
  format: ArticleFormat
  tags: string[]
  structure: string
  author: string
  publishedAt: string | null
  readMinutes: number
  wordCount: number
  source: { name: string; url: string } | null
  references: Array<{ label: string; url: string }>
  cover: string
  coverAlt: string
  concepts: string[]
  recipe: EditorialRecipe
  contentHash: string
}

export type BlogSection = { id: string; title: string; html: string; kind: SectionKind; figure?: ArticleFigure }

export type BlogArticleData = BlogEntry & {
  intro: string
  sections: BlogSection[]
}
