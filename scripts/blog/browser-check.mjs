import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import assert from 'node:assert/strict'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const catalogue = JSON.parse(await fs.readFile(path.join(root, 'src/blog/catalog.json'), 'utf8'))
const modulePath = process.env.OFFICESDK_PLAYWRIGHT_MODULE
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright')
const base = process.env.OFFICESDK_QA_URL || 'http://127.0.0.1:4173'
const output = path.join(os.tmpdir(), 'officesdk-blog-qa')
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] })
const page = await context.newPage()
const errors = []
const results = []
const notFoundUrl = `${base}/blog/this-story-does-not-exist`
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => {
  if (!['error', 'warning'].includes(message.type())) return
  if (message.location().url === notFoundUrl && /server responded with a status of 404/.test(message.text())) return
  errors.push(message.text())
})

async function loadPageImages() {
  for (const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded()
    await image.evaluate(element => element.decode())
    assert.ok(await image.evaluate(element => getComputedStyle(element).objectFit === 'contain' && getComputedStyle(element).transform === 'none'), 'Generated illustrations retain their complete frame')
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    for (let index = 0; index < catalogue.length; index++) {
      const entry = catalogue[index]
      const articleData = JSON.parse(await fs.readFile(path.join(root, 'public/blog/articles', `${entry.slug}.json`), 'utf8'))
      await page.goto(`${base}/blog/${entry.slug}`, { waitUntil: 'networkidle' })
      await page.locator(`article[data-slug="${entry.slug}"]`).waitFor()
      const result = await page.evaluate(() => {
        const heading = document.querySelector('main h1')
        const cover = document.querySelector('.article-cover img')
        const box = heading.getBoundingClientRect()
        const coverBox = cover.getBoundingClientRect()
        const imageUncropped = getComputedStyle(cover).objectFit === 'contain' || Math.abs(coverBox.width / coverBox.height - cover.naturalWidth / cover.naturalHeight) < 0.02
        const bodyFits = [...document.querySelectorAll('.article-section, .article-section > h2, .article-introduction, .article-sources')].every(element => {
          const bounds = element.getBoundingClientRect()
          return bounds.left >= 0 && bounds.right <= innerWidth && element.scrollWidth <= element.clientWidth + 1
        })
        return { title: heading.textContent.trim(), sections: document.querySelectorAll('.article-section').length, figures: document.querySelectorAll('.article-inline-figure').length, tags: document.querySelectorAll('.article-heading .blog-tags a').length, layout: document.querySelector('.blog-article').dataset.layout, imageLoaded: cover.complete && cover.naturalWidth >= 1000, imageUncropped, overflow: document.documentElement.scrollWidth > innerWidth, overlay: !!document.querySelector('vite-error-overlay'), headingFits: box.left >= 0 && box.right <= innerWidth && box.width > 0, bodyFits, apiLinks: [...document.querySelectorAll('.site-header a, .site-footer a')].filter(anchor => /apifox|api reference/i.test(anchor.href + anchor.textContent)).length }
      })
      assert.equal(result.title, entry.title, entry.slug)
      assert.equal(result.sections, articleData.sections.length, `Body incomplete: ${entry.slug}`)
      assert.equal(result.layout, entry.recipe.signature)
      assert.equal(result.figures, articleData.sections.filter(section => section.figure).length, `Body illustrations: ${entry.slug}`)
      assert.equal(result.tags, entry.tags.length, `Article tags: ${entry.slug}`)
      assert.ok(result.imageLoaded && result.imageUncropped && result.headingFits && result.bodyFits && !result.overflow && !result.overlay && result.apiLinks === 0, JSON.stringify({ ...result, slug: entry.slug, viewport }))
      await page.screenshot({ path: path.join(output, `${viewport.name}-${String(index).padStart(3, '0')}.png`) })
      if (index % 12 === 0) {
        await loadPageImages()
        await page.screenshot({ path: path.join(output, `${viewport.name}-full-${String(index).padStart(3, '0')}.png`), fullPage: true })
      }
      results.push({ slug: entry.slug, viewport: viewport.name, ...result })
      if (index % 12 === 0) console.log(`${viewport.name}: ${index + 1}/${catalogue.length} article pages checked`)
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`${base}/blog`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Office SDK Journal.', exact: true }).waitFor()
  await loadPageImages()
  await page.screenshot({ path: path.join(output, 'index-desktop.png'), fullPage: true })
  await page.getByRole('textbox', { name: 'Search articles' }).fill('signed')
  await page.locator('.journal-feature').waitFor({ state: 'detached' })
  assert.ok((await page.locator('.blog-card').count()) > 0, 'Search returns expected stories')
  assert.ok(page.url().includes('q=signed'), 'Search is preserved in the URL')
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await page.getByRole('group', { name: 'Filter by topic' }).getByRole('button', { name: 'Security', exact: true }).click()
  const categories = await page.locator('.blog-card .entry-meta > span:first-child').allTextContents()
  assert.ok(categories.length > 0 && categories.every(value => value === 'Security'), 'Category filter')
  await page.getByRole('group', { name: 'Filter by topic' }).getByRole('button', { name: 'All topics', exact: true }).click()
  const keyword = catalogue[0].tags[0]
  await page.locator('#journal-keyword').selectOption(keyword)
  assert.equal(new URL(page.url()).searchParams.get('tag'), keyword, 'Keyword filter is preserved in the URL')
  assert.ok((await page.locator('.blog-card').count()) > 0, 'Keyword filter returns stories')
  await page.getByRole('textbox', { name: 'Search articles' }).fill('no-such-topic-0987654321')
  await page.getByRole('heading', { name: 'No matching stories.', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
  await page.getByRole('button', { name: 'Next page', exact: true }).click()
  assert.ok(page.url().includes('page=2'), 'Pagination URL')
  assert.equal(await page.locator('.blog-card').count(), Math.min(12, catalogue.length - 12), 'Pagination article count')
  await page.reload({ waitUntil: 'networkidle' })
  assert.ok(page.url().includes('page=2'), 'Pagination survives reload')
  await page.getByRole('button', { name: 'Next page', exact: true }).click()
  assert.ok(page.url().includes('page=3'), 'Next pagination transition')
  await page.goBack()
  await page.waitForFunction(() => document.querySelector('.journal-pagination button[aria-current="page"]')?.textContent === '2')
  assert.ok(page.url().includes('page=2'), 'Browser Back restores pagination')
  await page.goForward()
  await page.waitForFunction(() => document.querySelector('.journal-pagination button[aria-current="page"]')?.textContent === '3')
  assert.ok(page.url().includes('page=3'), 'Browser Forward restores pagination')

  const first = catalogue[0]
  await page.goto(`${base}/blog/${first.slug}`, { waitUntil: 'networkidle' })
  await page.locator('.article-contents nav a').nth(1).click()
  assert.ok(page.url().includes('#'), 'Contents link navigates to a section')
  await page.getByRole('button', { name: 'Copy article link', exact: true }).click()
  await page.getByRole('button', { name: 'Link copied', exact: true }).waitFor()
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), `${base}/blog/${first.slug}`)

  const missingResponse = await page.goto(notFoundUrl, { waitUntil: 'networkidle' })
  assert.equal(missingResponse.status(), 404, 'Unknown articles return a real HTTP 404')
  await page.getByRole('heading', { name: "That story isn't here.", exact: true }).waitFor()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/blog`, { waitUntil: 'networkidle' })
  await loadPageImages()
  await page.screenshot({ path: path.join(output, 'index-mobile.png'), fullPage: true })
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Blog', exact: true }).click()
  assert.equal(page.url(), `${base}/blog`)
  assert.deepEqual(errors, [], 'Browser console and runtime errors')
  await fs.writeFile(path.join(output, 'browser-results.json'), JSON.stringify({ articles: catalogue.length, views: results.length, errors, results }, null, 2))

  for (const kind of ['desktop', 'mobile']) {
    const thumbWidth = kind === 'desktop' ? 360 : 156
    const thumbHeight = kind === 'desktop' ? 250 : 338
    const columns = kind === 'desktop' ? 4 : 8
    const perSheet = kind === 'desktop' ? 24 : 32
    for (let start = 0; start < catalogue.length; start += perSheet) {
      const count = Math.min(perSheet, catalogue.length - start)
      const composites = []
      for (let offset = 0; offset < count; offset++) composites.push({ input: await sharp(path.join(output, `${kind}-${String(start + offset).padStart(3, '0')}.png`)).resize(thumbWidth, thumbHeight).png().toBuffer(), left: offset % columns * thumbWidth, top: Math.floor(offset / columns) * thumbHeight })
      await sharp({ create: { width: columns * thumbWidth, height: Math.ceil(count / columns) * thumbHeight, channels: 3, background: '#dde5e3' } }).composite(composites).png().toFile(path.join(output, `${kind}-contact-sheet-${String(start / perSheet + 1).padStart(2, '0')}.png`))
    }
  }
  console.log(JSON.stringify({ articles: catalogue.length, checkedViewports: results.length, interactions: 'search, filters, no-results/reset, pagination/reload/back/forward, contents, clipboard, not-found, mobile menu', errors, evidence: output }, null, 2))
} finally {
  await browser.close()
}
