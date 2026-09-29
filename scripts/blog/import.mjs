import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'
import sanitizeHtml from 'sanitize-html'
import { articleActionGuides, articleComparisonSections, articleMeasurementNotes, articleReferenceAdditions } from '../../src/blog/articleAdditions.mjs'
import { articleFormats, categorize, editorialRecipe, figureKinds, keywordTags, sectionKinds } from './editorial.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const cache = path.join(os.tmpdir(), 'officesdk-blog-source-cache')
const sources = [
  { name: 'ShimoDocs', sitemap: 'https://shimodocs.com/sitemap-blog.xml' },
  { name: 'OfficeDex', sitemap: 'https://officedex.ai/sitemap.xml' },
  { name: 'OfficeAPI', sitemap: 'https://officeapi.ai/sitemap.xml' },
]
const allowedTags = ['p', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'pre', 'a', 'br', 'hr', 'figure', 'figcaption', 'img', 'div', 'span', 'dl', 'dt', 'dd', 'sup', 'sub']
export const cleanHtml = (html, anchorIds = new Set()) => sanitizeHtml(html, {
  allowedTags,
  allowedAttributes: { '*': ['id'], a: ['href', 'title'], img: ['src', 'alt', 'width', 'height', 'loading'], th: ['scope', 'colspan', 'rowspan'], td: ['colspan', 'rowspan'], ol: ['start'] },
  allowedSchemes: ['https', 'http', 'mailto'],
  allowProtocolRelative: false,
  nonTextTags: ['script', 'style', 'textarea', 'option', 'iframe'],
  transformTags: { '*': (tagName, attribs) => {
    if (!anchorIds.has(attribs.id)) delete attribs.id
    if (tagName === 'img') attribs.loading = 'lazy'
    return { tagName, attribs }
  } },
})

const escapeText = (value) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

const comparisonHtml = (comparison) => [
  '<table><thead><tr>',
  ...comparison.headers.map(header => `<th>${escapeText(header)}</th>`),
  '</tr></thead><tbody>',
  ...comparison.rows.map(row => `<tr>${row.map(cell => `<td>${escapeText(cell)}</td>`).join('')}</tr>`),
  '</tbody></table>',
].join('')

const withArticleAdditions = (article) => {
  const guide = articleActionGuides[article.slug]
  const comparison = articleComparisonSections[article.slug]
  const measurement = articleMeasurementNotes[article.slug]
  return [
    ...article.sections,
    ...(comparison ? [{ title: comparison.title, kind: 'comparison', html: comparisonHtml(comparison) }] : []),
    ...(guide ? [{
      title: guide.title,
      kind: 'steps',
      html: `${measurement ? `<p>${escapeText(measurement)}</p>` : ''}<ol>${guide.steps.map(step => `<li>${escapeText(step)}</li>`).join('')}</ol>`,
    }] : measurement ? [{
      title: 'Bound the first-open test fixture',
      kind: 'note',
      html: `<p>${escapeText(measurement)}</p>`,
    }] : []),
  ]
}

export function discoverPostUrls(xml) {
  const $ = cheerio.load(xml, { xmlMode: true })
  return [...new Set($('loc').map((_, element) => $(element).text().trim()).get())].filter(url => {
    try { return /^\/blog\/[^/]+\/?$/.test(new URL(url).pathname) && !/\/(?:category|tag|feed\.xml)\/?$/.test(new URL(url).pathname) } catch { return false }
  })
}

const slugify = text => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const plainText = html => {
  const $ = cheerio.load(html)
  return $('body').find('*').addBack().contents().filter((_, node) => node.type === 'text').map((_, node) => $(node).text()).get().join(' ').replace(/\s+/g, ' ').trim()
}
const digest = content => createHash('sha256').update(content).digest('hex')

function structuredArticle($) {
  for (const element of $('script[type="application/ld+json"]').toArray()) {
    try {
      const data = JSON.parse($(element).text())
      const entries = Array.isArray(data) ? data : data['@graph'] ?? [data]
      const article = entries.find(entry => ['BlogPosting', 'Article'].includes(entry['@type']))
      if (article) return article
    } catch { /* Invalid source metadata does not override visible article content. */ }
  }
  return {}
}

export function normalizeArticle(html, url, sourceName) {
  const $ = cheerio.load(html)
  const structured = structuredArticle($)
  const title = $('main h1').first().text().replace(/\s+/g, ' ').trim() || $('h1').first().text().trim()
  const description = $('meta[name="description"]').attr('content')?.trim() || title
  const bodies = $('.post-body').toArray().filter(element => $(element).parents('.post-body').length === 0)
  const body = bodies.length ? $('<div></div>') : $('article.prose').first().length ? $('article.prose').first().clone() : $('article.blog-post').first().length ? $('article.blog-post').first().clone() : $('main article').first().clone()
  for (const element of bodies) {
    const section = $(element).closest('section')
    if (section.attr('id')) body.append($('<span></span>').attr('id', section.attr('id')))
    if (!$(element).find('h2').length && section.length) body.append(section.find('h2').first().clone())
    body.append($(element).clone())
  }
  if (!title || !body.length) throw new Error(`Article content not found: ${url}`)
  body.find('script, style, iframe, header, .post-tags, .post-cta, .resource-cta, .related-list, .related, .pager-stack, .breadcrumbs, .blog-back-link, .article-toc, h1').remove()
  body.find('a').each((_, element) => {
    const anchor = $(element)
    const href = anchor.attr('href')
    if (!href || href.startsWith('#')) return
    try { anchor.attr('href', new URL(href, url).href) } catch { anchor.removeAttr('href') }
  })
  body.find('img, picture').remove()
  body.find('svg').each((_, element) => {
    const figure = $(element).closest('figure')
    const caption = figure.find('figcaption').text().trim()
    $(element).replaceWith(caption ? `<p>${sanitizeHtml(caption, { allowedTags: [] })}</p>` : '')
  })
  // Give retained source targets their own namespace before wrappers and h2s
  // disappear. The first occurrence wins when a source contains duplicate IDs.
  const anchors = new Map()
  const anchorIds = new Set()
  const headingAnchors = new Map()
  const prefix = `article-anchor-${digest(url).slice(0, 8)}`
  for (const element of body.find('a[name]').toArray()) {
    const anchor = $(element)
    const name = anchor.attr('name')
    if (name && name !== anchor.attr('id')) {
      if (anchor.attr('id')) anchor.before($('<span></span>').attr('id', name))
      else anchor.attr('id', name)
    }
    anchor.removeAttr('name')
  }
  for (const element of [...body.filter('[id]').toArray(), ...body.find('[id]').toArray()]) {
    if (!allowedTags.includes(element.tagName) && !['h2', 'section', 'article'].includes(element.tagName)) continue
    const originalId = $(element).attr('id')
    const id = `${prefix}-${anchorIds.size + 1}`
    $(element).attr('id', id)
    anchorIds.add(id)
    if (!anchors.has(originalId)) anchors.set(originalId, id)
  }
  const sections = []
  const usedIds = new Set(['overview', ...anchorIds])
  const marker = id => $.html($('<span></span>').attr('id', id))
  let current = { id: 'overview', title: 'Overview', html: body.attr('id') ? marker(body.attr('id')) : '' }
  let hasHeading = false
  const flush = () => {
    if (hasHeading || plainText(current.html) || current.html.includes('<img')) {
      sections.push({ ...current })
      return true
    }
    return false
  }
  const walk = nodes => {
    for (const element of nodes) {
      if (element.type === 'text') {
        if ($(element).text().trim()) current.html += `<p>${sanitizeHtml($(element).text(), { allowedTags: [] })}</p>`
      } else if (element.tagName === 'h2') {
        const prefixHtml = flush() ? '' : current.html
        const heading = $(element).text().replace(/\s+/g, ' ').trim()
        const baseId = `${slugify(heading) || 'section'}-${sections.length + 1}`
        let id = baseId
        for (let suffix = 2; usedIds.has(id); suffix++) id = `${baseId}-${suffix}`
        usedIds.add(id)
        current = { id, title: heading, html: prefixHtml }
        if ($(element).attr('id')) headingAnchors.set($(element).attr('id'), current.id)
        hasHeading = true
      } else if (['div', 'section', 'article'].includes(element.tagName)) {
        if ($(element).attr('id')) current.html += marker($(element).attr('id'))
        walk($(element).contents().toArray())
      } else {
        current.html += $.html(element)
      }
    }
  }
  walk(body.contents().toArray())
  flush()
  const sourceUrl = new URL(url)
  sourceUrl.hash = ''
  for (const section of sections) {
    const content = cheerio.load(section.html, {}, false)
    // h2s inside semantic blocks stay within that block rather than becoming
    // top-level sections, but their content and fragment targets must survive.
    content('h2').each((_, element) => {
      const heading = content(element)
      const replacement = content('<h3></h3>').html(heading.html())
      if (heading.attr('id')) replacement.attr('id', heading.attr('id'))
      heading.replaceWith(replacement)
    })
    content('a[href]').each((_, element) => {
      const anchor = content(element)
      try {
        const destination = new URL(anchor.attr('href'), url)
        const target = decodeURIComponent(destination.hash.slice(1))
        destination.hash = ''
        if (destination.href !== sourceUrl.href || !anchors.has(target)) return
        const id = anchors.get(target)
        anchor.attr('href', `#${headingAnchors.get(id) ?? id}`)
      } catch { /* Preserve safe malformed fragments instead of aborting import. */ }
    })
    section.html = cleanHtml(content.html(), anchorIds)
  }
  const intro = $('.post-lede, .post-deck, .article-lead, .lead, .blog-post-excerpt, .article-hero p').first().text().replace(/\s+/g, ' ').trim() || description
  const date = structured.datePublished || $('meta[property="article:published_time"]').attr('content') || $('time[datetime]').attr('datetime') || null
  const author = typeof structured.author === 'string' ? structured.author : structured.author?.name || sourceName
  return { slug: new URL(url).pathname.split('/').filter(Boolean).at(-1), title, description, category: categorize(new URL(url).pathname), author, publishedAt: date?.slice(0, 10) || null, source: { name: sourceName, url }, references: [], intro, sections }
}

async function fetchCached(url) {
  await fs.mkdir(cache, { recursive: true })
  const destination = path.join(cache, `${digest(url)}.html`)
  try { return await fs.readFile(destination, 'utf8') } catch { /* Fetch uncached source documents. */ }
  let lastError
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'OfficeSDK editorial import; source attribution retained' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      await fs.writeFile(destination, html)
      return html
    } catch (error) { lastError = error }
  }
  throw new Error(`${url}: ${lastError.message}`)
}

async function boundedMap(items, callback, concurrency = 4) {
  const results = Array(items.length)
  let next = 0
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await callback(items[index], index)
    }
  }))
  return results
}

export async function inventory() {
  const discovered = []
  for (const source of sources) {
    const urls = discoverPostUrls(await fetchCached(source.sitemap))
    console.log(`${source.name}: ${urls.length} source posts`)
    discovered.push(...urls.map(url => ({ ...source, url })))
  }
  return boundedMap(discovered, async (source, index) => {
    const html = await fetchCached(source.url)
    const $ = cheerio.load(html)
    const article = { slug: new URL(source.url).pathname.split('/').filter(Boolean).at(-1), title: $('main h1, h1').first().text().replace(/\s+/g, ' ').trim(), url: source.url, source: source.name, category: categorize(source.url), cacheFile: `${digest(source.url)}.html` }
    if (!article.title) throw new Error(`No title at ${source.url}`)
    console.log(`[${index + 1}/${discovered.length}] ${article.slug}`)
    return article
  })
}

export async function buildCorpus({ authorized = false } = {}) {
  let originals = []
  try { originals = JSON.parse(await fs.readFile(path.join(root, 'src/blog/originals.json'), 'utf8')) } catch (error) { throw new Error(`Original article collection is not ready: ${error.message}`) }
  if (!authorized) {
    for (const name of ['source-topics-a.json', 'source-topics-b.json']) {
      const topics = JSON.parse(await fs.readFile(path.join(root, 'src/blog', name), 'utf8'))
      originals.push(...topics)
    }
  }
  const articles = originals.map(article => ({ ...article, source: null, references: [...(article.references ?? []), ...(articleReferenceAdditions[article.slug] ?? [])], sections: withArticleAdditions(article).map((section, index) => ({
    id: `${slugify(section.title)}-${index + 1}`, title: section.title, html: cleanHtml(section.html),
    kind: section.kind ?? 'prose',
    ...(section.figure ? { figure: {
      ...section.figure, src: `/blog/images/${article.slug}-figure-${index + 1}.png`, width: 1200, height: 900,
      mobileSrc: `/blog/images/${article.slug}-figure-${index + 1}-mobile.png`, mobileWidth: 600, mobileHeight: 300 + section.figure.items.length * 210,
    } } : {}),
  })) }))
  if (authorized) {
    const posts = await inventory()
    const imported = await boundedMap(posts, async post => normalizeArticle(await fetchCached(post.url), post.url, post.source))
    articles.unshift(...imported)
  }
  if (new Set(articles.map(article => article.slug)).size !== articles.length) throw new Error('Duplicate article slugs')
  const catalogue = []
  const searchIndex = {}
  await fs.mkdir(path.join(root, 'public/blog/articles'), { recursive: true })
  for (let index = 0; index < articles.length; index++) {
    const article = articles[index]
    const text = plainText(article.intro + ' ' + article.sections.map(section => section.title + ' ' + section.html + ' ' + (section.figure?.caption ?? '')).join(' '))
    const wordCount = text.split(/\s+/).filter(Boolean).length
    if (wordCount < 200 || article.sections.length < 2) throw new Error(`Incomplete article: ${article.slug} (${wordCount} words)`)
    const recipe = editorialRecipe(index)
    const concepts = article.concepts?.length ? article.concepts.slice(0, 6) : article.sections.filter(section => section.title !== 'Overview').slice(0, 6).map(section => section.title)
    const format = article.format ?? 'explainer'
    const tags = [...new Set(article.tags ?? [article.category === 'AI & documents' ? 'AI documents' : keywordTags.includes(article.category) ? article.category : 'Office SDK', 'Integrations', 'Business workflows'])]
    if (!articleFormats.includes(format) || tags.length < 3 || tags.length > 5 || tags.some(tag => !keywordTags.includes(tag))) throw new Error(`Invalid editorial format or keyword tags: ${article.slug}`)
    for (const section of article.sections) {
      section.kind ??= 'prose'
      if (!sectionKinds.includes(section.kind)) throw new Error(`Invalid section kind: ${article.slug}/${section.id}`)
      if (section.figure && (!figureKinds.includes(section.figure.kind) || !section.figure.alt || !section.figure.caption || section.figure.items.length < 2 || section.figure.items.length > 5)) throw new Error(`Invalid figure brief: ${article.slug}/${section.id}`)
    }
    const structure = article.sections.map(section => `${section.kind}${section.figure ? `+${section.figure.kind}` : ''}`).join(':')
    const searchableText = `${article.title} ${article.description} ${article.category} ${tags.join(' ')} ${concepts.join(' ')} ${text}`.toLocaleLowerCase()
    searchIndex[article.slug] = [...new Set(searchableText.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [])].join(' ')
    const entry = {
      slug: article.slug, title: article.title, description: article.description.slice(0, 200), category: article.category,
      format, tags, structure,
      author: article.author, publishedAt: article.publishedAt, readMinutes: Math.max(2, Math.ceil(wordCount / 210)), wordCount,
      source: article.source, references: article.references ?? [],
      cover: `/blog/images/${article.slug}.png`, coverAlt: `${article.title}: ${concepts.slice(0, 4).join(', ')}.`,
      concepts, recipe, contentHash: digest(text),
    }
    catalogue.push(entry)
    await fs.writeFile(path.join(root, 'public/blog/articles', `${article.slug}.json`), JSON.stringify({ ...entry, intro: article.intro, sections: article.sections }, null, 2) + '\n')
  }
  if (new Set(catalogue.map(entry => entry.contentHash)).size !== catalogue.length) throw new Error('Duplicate article bodies')
  await fs.writeFile(path.join(root, 'src/blog/search-index.json'), JSON.stringify(searchIndex, null, 2) + '\n')
  await fs.writeFile(path.join(root, 'src/blog/catalog.json'), JSON.stringify(catalogue, null, 2) + '\n')
  console.log(`Materialized ${catalogue.length} complete articles (${authorized ? 'authorized source articles included' : 'original editorial collection only'})`)
  return catalogue
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--inventory')) {
    const posts = await inventory()
    await fs.writeFile(path.join(root, 'src/blog/sources.json'), JSON.stringify(posts, null, 2) + '\n')
    console.log(`Source inventory saved: ${posts.length} titles and URLs; no source bodies published`)
  } else {
    await buildCorpus({ authorized: process.argv.includes('--authorized') })
  }
}
