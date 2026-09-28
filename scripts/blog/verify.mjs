import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import * as cheerio from 'cheerio'
import sharp from 'sharp'
import { articleFormats, figureKinds, keywordTags, sectionKinds } from './editorial.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const catalog = JSON.parse(await fs.readFile(path.join(root, 'src/blog/catalog.json'), 'utf8'))
const originalMode = process.argv.includes('--originals')
const inventory = JSON.parse(await fs.readFile(path.join(root, 'src/blog/sources.json'), 'utf8'))
const errors = []
const hashes = new Set()
const check = (condition, message) => { if (!condition) errors.push(message) }
check(catalog.length >= 101, `100+ requirement is incomplete: ${catalog.length} articles exist, at least 101 required`)
check(new Set(catalog.map(entry => entry.slug)).size === catalog.length, 'Article slugs are not unique')
check(new Set(catalog.map(entry => entry.recipe.signature)).size === catalog.length, 'Editorial compositions are not unique')
check(new Set(catalog.map(entry => entry.contentHash)).size === catalog.length, 'Article bodies are duplicated')

const sources = {}
const referencedTopics = new Set(catalog.flatMap(entry => entry.references.map(reference => reference.url)))
const topicCoverage = {}
for (const post of inventory) if (referencedTopics.has(post.url)) topicCoverage[post.source] = (topicCoverage[post.source] ?? 0) + 1
for (const entry of catalog) {
  try {
    const article = JSON.parse(await fs.readFile(path.join(root, 'public/blog/articles', `${entry.slug}.json`), 'utf8'))
    check(article.slug === entry.slug && article.title === entry.title, `Catalogue/content mismatch: ${entry.slug}`)
    check(articleFormats.includes(entry.format) && article.format === entry.format, `Invalid article format: ${entry.slug}`)
    check(Array.isArray(entry.tags) && entry.tags.length >= 3 && entry.tags.length <= 5 && entry.tags.every(tag => keywordTags.includes(tag)), `Invalid keyword tags: ${entry.slug}`)
    check(article.structure === entry.structure, `Article structure mismatch: ${entry.slug}`)
    check(article.sections.length >= 2, `Too few article sections: ${entry.slug}`)
    check(new Set(article.sections.map(section => section.id)).size === article.sections.length, `Duplicate contents anchors: ${entry.slug}`)
    const html = article.sections.map(section => section.html).join(' ')
    const $ = cheerio.load(html)
    check($('script, iframe, object, embed, style, form, input').length === 0, `Active markup in ${entry.slug}`)
    for (const element of $('*').toArray()) for (const [key, value] of Object.entries(element.attribs || {})) check(!/^on/i.test(key) && !/^(?:javascript|data|vbscript):/i.test(value), `Unsafe attribute ${key} in ${entry.slug}`)
    const bodyText = $('body').find('*').addBack().contents().filter((_, node) => node.type === 'text').map((_, node) => $(node).text()).get().join(' ')
    const wordCount = `${article.intro} ${bodyText}`.split(/\s+/).filter(Boolean).length
    check(wordCount >= (entry.source ? 200 : 500), `Insufficient substantive body: ${entry.slug} (${wordCount} words)`)
    const figures = article.sections.filter(section => section.figure).map(section => section.figure)
    check(figures.length >= 2, `Too few body illustrations: ${entry.slug}`)
    check(figures.every(figure => figureKinds.includes(figure.kind) && figure.items.length >= 2 && figure.items.length <= 5 && figure.title.length <= 68 && figure.alt && figure.caption), `Invalid body illustration brief: ${entry.slug}`)
    check(article.sections.every(section => sectionKinds.includes(section.kind)), `Invalid section kind: ${entry.slug}`)
    for (const figure of figures) {
      const imagePath = path.join(root, 'public', figure.src)
      const mobilePath = path.join(root, 'public', figure.mobileSrc)
      for (const file of [imagePath, mobilePath]) {
        try {
          const metadata = await sharp(await fs.readFile(file)).metadata()
          check(metadata.width >= 600 && metadata.height >= 300, `Body illustration too small: ${entry.slug}/${figure.src}`)
        } catch (error) { errors.push(`Body illustration missing: ${entry.slug}/${file}: ${error.message}`) }
      }
    }
    if (entry.source) sources[entry.source.name] = (sources[entry.source.name] ?? 0) + 1
    const imagePath = path.join(root, 'public', entry.cover)
    const image = await fs.readFile(imagePath)
    const hash = createHash('sha256').update(image).digest('hex')
    check(!hashes.has(hash), `Identical article image: ${entry.slug}`)
    hashes.add(hash)
    const metadata = await sharp(image).metadata()
    const stats = await sharp(image).stats()
    check(metadata.width >= 1000 && metadata.height >= 600, `Cover dimensions too small: ${entry.slug}`)
    check(stats.channels.some(channel => channel.stdev > 5), `Blank illustration: ${entry.slug}`)
    try {
      const staticHtml = await fs.readFile(path.join(root, 'dist/blog', entry.slug, 'index.html'), 'utf8')
      const page = cheerio.load(staticHtml)
      check(page('h1').text().trim() === entry.title, `Static page title mismatch: ${entry.slug}`)
      check(page('.article-section').length === article.sections.length, `Static page body is incomplete: ${entry.slug}`)
      check(page('.article-inline-figure').length === figures.length, `Static body illustration count mismatch: ${entry.slug}`)
      check(page('.article-inline-figure img[alt]').length === figures.length, `Body illustration alt text missing: ${entry.slug}`)
      check(page('link[rel="canonical"]').attr('href') === `https://officesdk.com/blog/${entry.slug}`, `Static canonical mismatch: ${entry.slug}`)
      const schema = JSON.parse(page('script[data-blog-schema]').text())
      check(schema['@type'] === 'BlogPosting' && schema.headline === entry.title, `Invalid article schema: ${entry.slug}`)
      check(JSON.stringify(schema.keywords) === JSON.stringify(entry.tags), `Schema keywords mismatch: ${entry.slug}`)
      check(Array.isArray(schema.image) && schema.image.length === figures.length + 1, `Schema image coverage mismatch: ${entry.slug}`)
    } catch (error) { errors.push(`Static page missing or invalid: ${entry.slug}: ${error.message}`) }
  } catch (error) { errors.push(`${entry.slug}: ${error.message}`) }
}
if (originalMode) {
  check(catalog.every(entry => entry.source === null), 'Original collection includes a republication')
  for (const post of inventory) check(referencedTopics.has(post.url), `Original topic article missing for ${post.url}`)
} else {
  check(sources.ShimoDocs === 60 && sources.OfficeDex === 7 && sources.OfficeAPI === 4, `Requested full-text import incomplete: ${JSON.stringify(sources)}; republication permission has not been confirmed`)
}
try {
  const sitemap = cheerio.load(await fs.readFile(path.join(root, 'dist/sitemap.xml'), 'utf8'), { xmlMode: true })
  const urls = new Set(sitemap('loc').map((_, element) => sitemap(element).text()).get())
  for (const entry of catalog) check(urls.has(`https://officesdk.com/blog/${entry.slug}`), `Article missing from sitemap: ${entry.slug}`)
} catch (error) { errors.push(`Sitemap unavailable: ${error.message}`) }

console.log(JSON.stringify({ mode: originalMode ? 'original-topic-collection' : 'full-request-including-authorized-imports', articles: catalog.length, distinctImages: hashes.size, sourceCoverage: sources, topicCoverage, errors }, null, 2))
if (errors.length) process.exitCode = 1
