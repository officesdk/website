import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'
import { articleFormats, editorialRecipe, figureKinds, keywordTags, sectionKinds } from './editorial.mjs'
import { normalizeArticle, discoverPostUrls } from './import.mjs'
import { matchesSearchText } from '../../src/blog/search.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

test('the corpus can use 108 structurally distinct article compositions', () => {
  const recipes = Array.from({ length: 108 }, (_, index) => editorialRecipe(index))
  assert.equal(new Set(recipes.map(recipe => recipe.signature)).size, 108)
  assert.ok(new Set(recipes.map(recipe => recipe.hero)).size >= 12)
  assert.ok(new Set(recipes.map(recipe => recipe.body)).size >= 9)
})

test('editorial sources carry SEO tags, varied formats, and non-adjacent figure briefs', () => {
  const files = ['originals.json', 'source-topics-a.json', 'source-topics-b.json']
  const articles = files.flatMap(file => JSON.parse(fs.readFileSync(path.join(root, 'src/blog', file), 'utf8')))
  assert.equal(articles.length, 108)
  const structures = new Set()
  for (const article of articles) {
    assert.ok(articleFormats.includes(article.format), article.slug)
    assert.ok(article.tags.length >= 3 && article.tags.length <= 5, article.slug)
    assert.ok(article.tags.every(tag => keywordTags.includes(tag)), article.slug)
    assert.ok(article.sections.every(section => sectionKinds.includes(section.kind)), article.slug)
    const figureIndexes = article.sections.map((section, index) => section.figure ? index : -1).filter(index => index >= 0)
    assert.ok(figureIndexes.length >= 2, article.slug)
    assert.ok(figureIndexes.every((index, position) => position === 0 || index - figureIndexes[position - 1] > 1), article.slug)
    for (const index of figureIndexes) {
      const figure = article.sections[index].figure
      assert.ok(figureKinds.includes(figure.kind) && figure.items.length >= 2 && figure.items.length <= 5, article.slug)
      assert.ok(figure.alt && figure.caption, article.slug)
    }
    structures.add(article.sections.map(section => `${section.kind}${section.figure ? `+${section.figure.kind}` : ''}`).join(':'))
  }
  assert.ok(structures.size >= 90, `Only ${structures.size} editorial structures found`)
})

test('the generated search index covers article titles, tags, and body text', () => {
  const searchIndexPath = path.join(root, 'src/blog/search-index.json')
  assert.ok(fs.existsSync(searchIndexPath), 'Full-text search index is missing')
  const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'))
  const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/blog/catalog.json'), 'utf8'))
  assert.deepEqual(Object.keys(searchIndex).sort(), catalogue.map(entry => entry.slug).sort())
  for (const entry of catalogue) {
    const article = JSON.parse(fs.readFileSync(path.join(root, 'public/blog/articles', `${entry.slug}.json`), 'utf8'))
    const htmlText = value => cheerio.load(value.replace(/<[^>]+>/g, ' ')).text()
    const searchableText = [entry.title, entry.category, ...entry.tags, ...entry.concepts, htmlText(article.intro), ...article.sections.flatMap(section => [section.title, htmlText(section.html), section.figure?.caption ?? ''])].join(' ').toLocaleLowerCase()
    const expectedTokens = new Set(searchableText.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [])
    const indexedTokens = new Set(searchIndex[entry.slug].split(' '))
    assert.ok([...expectedTokens].every(token => indexedTokens.has(token)), `Search text is incomplete: ${entry.slug}`)
  }
  const articleText = searchIndex['document-identifiers-and-ownership']
  assert.equal(typeof articleText, 'string')
  assert.match(articleText, /document ids/)
  assert.match(articleText, /multi-tenancy/)
  assert.match(articleText, /concatenating/)
})

test('short search terms match complete words instead of unrelated substrings', () => {
  assert.equal(matchesSearchText('ai document workflows', 'AI'), true)
  assert.equal(matchesSearchText('failed document workflows', 'ai'), false)
  assert.equal(matchesSearchText('document capability matrix', 'api'), false)
})

test('article discovery excludes indexes, tags and category navigation', () => {
  const xml = '<urlset><url><loc>https://example.com/blog/</loc></url><url><loc>https://example.com/blog/topic/</loc></url><url><loc>https://example.com/blog/tag/ai/</loc></url><url><loc>https://example.com/help/topic/</loc></url></urlset>'
  assert.deepEqual(discoverPostUrls(xml), ['https://example.com/blog/topic/'])
})

test('normalization keeps content and tables while removing active content and unrelated navigation', () => {
  const html = '<html><head><meta name="description" content="A fixture about file ownership."></head><body><main><h1>File ownership</h1><p class="lead">Start with a stable file identifier.</p><article class="prose"><p>Keep storage responsibility explicit.</p><h2>A retrieval boundary</h2><p onclick="alert(1)">Use <a href="/guide">a retrieval contract</a> and <a href="javascript:alert(1)">safe links</a>.</p><script>alert(1)</script><iframe src="https://evil.example"></iframe><table><tr><th>Owner</th><th>Action</th></tr><tr><td>Host</td><td>Store</td></tr></table><h2>Apply a result</h2><p>Receive the result and record its version.</p></article><section class="closing">Buy an unrelated product</section></main></body></html>'
  const result = normalizeArticle(html, 'https://example.com/blog/file-ownership/', 'Example')
  const content = result.sections.map(section => section.html).join('')
  assert.equal(result.title, 'File ownership')
  assert.equal(result.sections.length, 3)
  assert.match(content, /<table>/)
  assert.match(content, /https:\/\/example.com\/guide/)
  assert.doesNotMatch(content, /onclick|script|iframe|javascript:|unrelated product/)
})

test('source briefings with separate content blocks retain every article section', () => {
  const fixture = '<main><h1>Restore a document system</h1><div class="post-body"><p>Recovery has several owners.</p></div><section><h2>Preserve metadata</h2><div class="post-body"><p>Back up the application database consistently.</p></div></section><section><h2>Verify source objects</h2><div class="post-body"><p>Check the files against the restored catalogue.</p></div></section></main>'
  const result = normalizeArticle(fixture, 'https://example.com/blog/restore/', 'Example')
  assert.equal(result.sections.length, 3)
  assert.deepEqual(result.sections.map(section => section.title), ['Overview', 'Preserve metadata', 'Verify source objects'])
  assert.match(result.sections[2].html, /restored catalogue/)
})

test('normalization remaps same-page heading, inline, and wrapper targets safely', () => {
  const url = 'https://example.com/blog/anchor-fixture/'
  const fixture = `<main><h1>Anchor fixture</h1><article class="prose" id="article-start">
    <p><a href="#save-flow">Heading</a> <a href="/blog/anchor-fixture/#detail%20step">Detail</a>
    <a href="https://example.com/blog/anchor-fixture/#group">Wrapper</a> <a href="#article-start">Start</a>
    <a href="#named-target">Named target</a> <a href="?view=other#save-flow">Other query</a>
    <a href="/blog/another/#save-flow">Other page</a> <a href="#%ZZ">Malformed</a></p>
    <h2 id="save-flow">Save flow</h2><div id="group"><h3 id="detail step">Details</h3>
    <p id="location"><a name="named-target"></a>Keep this target.</p><span id="location">Duplicate source ID.</span></div>
    <h2 id="later">Save flow</h2><p>Another section.</p><img src="https://example.com/copied.png">
  </article></main>`
  const result = normalizeArticle(fixture, url, 'Example')
  assert.deepEqual(result.sections.map(section => section.id), ['overview', 'save-flow-2', 'save-flow-3'])
  const $ = cheerio.load(result.sections.map(section => `<section id="${section.id}">${section.html}</section>`).join(''))
  const ids = $('[id]').map((_, element) => $(element).attr('id')).get()
  assert.equal(new Set(ids).size, ids.length)
  const href = label => $('a').filter((_, element) => $(element).text() === label).attr('href')
  assert.equal(href('Heading'), '#save-flow-2')
  for (const label of ['Detail', 'Wrapper', 'Start', 'Named target']) {
    assert.match(href(label), /^#article-anchor-[a-f0-9]{8}-\d+$/)
    assert.equal(ids.filter(id => id === href(label).slice(1)).length, 1)
  }
  assert.equal(href('Other query'), `${url}?view=other#save-flow`)
  assert.equal(href('Other page'), 'https://example.com/blog/another/#save-flow')
  assert.equal(href('Malformed'), '#%ZZ')
  assert.equal($('img, picture, [name]').length, 0)
  assert.ok(ids.every(id => /^[a-z0-9-]+$/.test(id)))
})

test('flattened source sections retain wrapper anchors without changing heading IDs', () => {
  const fixture = '<main><h1>Source blocks</h1><section id="group"><h2 id="details">Details</h2><div class="post-body" id="body"><p><a href="#group">Group</a> <a href="#body">Body</a> <a href="#details">Details</a></p></div></section></main>'
  const result = normalizeArticle(fixture, 'https://example.com/blog/blocks', 'Example')
  assert.deepEqual(result.sections.map(section => section.id), ['details-1'])
  const $ = cheerio.load(result.sections[0].html)
  assert.equal($('a').last().attr('href'), '#details-1')
  for (const element of $('a').toArray().slice(0, 2)) {
    const id = $(element).attr('href').slice(1)
    assert.equal($('[id]').filter((_, target) => $(target).attr('id') === id).length, 1)
  }
})

test('nested heading targets survive and source targets cannot collide with section IDs', () => {
  const url = 'https://example.com/blog/collision'
  const prefix = `article-anchor-${createHash('sha256').update(url).digest('hex').slice(0, 8)}`
  const fixture = `<main><h1>Collision fixture</h1><article class="prose" id="root"><h2 id="heading">${prefix}</h2>
    <p><a href="#root">Root</a> <a href="#heading">Heading</a> <a href="#nested">Nested</a></p>
    <blockquote><h2 id="nested">Nested heading</h2><p>Quoted explanation.</p></blockquote></article></main>`
  const result = normalizeArticle(fixture, url, 'Example')
  const $ = cheerio.load(result.sections.map(section => `<section id="${section.id}">${section.html}</section>`).join(''))
  const ids = $('[id]').map((_, element) => $(element).attr('id')).get()
  assert.equal(ids.length, new Set(ids).size)
  for (const link of $('a[href]').toArray()) {
    assert.equal(ids.filter(id => id === $(link).attr('href').slice(1)).length, 1)
  }
  assert.equal($('blockquote h3').text(), 'Nested heading')
})
