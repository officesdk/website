import type { BlogArticleData } from './types'

const origin = 'https://officesdk.com'

export function articleSchema(article: BlogArticleData) {
  return {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.description,
    abstract: article.intro, inLanguage: 'en', articleSection: article.category, keywords: article.tags,
    about: article.tags.map(name => ({ '@type': 'Thing', name })),
    image: [
      { '@type': 'ImageObject', url: `${origin}${article.cover}`, width: 1200, height: 760, caption: article.coverAlt },
      ...article.sections.flatMap(section => section.figure ? [{ '@type': 'ImageObject', url: `${origin}${section.figure.src}`, width: section.figure.width, height: section.figure.height, caption: section.figure.caption }] : []),
    ],
    author: { '@type': 'Organization', name: article.author }, publisher: { '@type': 'Organization', name: 'Office SDK', url: origin },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    wordCount: article.wordCount, isAccessibleForFree: true,
    citation: article.references.map(reference => reference.url),
    mainEntityOfPage: `${origin}/blog/${article.slug}`,
  }
}
