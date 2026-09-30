import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { chromium } = await import(process.env.OFFICESDK_PLAYWRIGHT_MODULE ? pathToFileURL(process.env.OFFICESDK_PLAYWRIGHT_MODULE).href : 'playwright')
const base = process.env.OFFICESDK_QA_URL || 'http://127.0.0.1:4174'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Use a local server; this test must never send live leads or analytics')
const output = path.join(os.tmpdir(), 'officesdk-conversion-qa')
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
let analyticsRequests = 0, leadRequests = 0, responseStatus = 500
await page.route(/googletagmanager|google-analytics/, route => { analyticsRequests++; return route.abort() })
await page.route('https://app.teable.ai/**', async route => {
  leadRequests++
  await route.fulfill({ status: responseStatus, contentType: 'application/json', body: '{}' })
})
const events = name => page.evaluate(name => [...(window.dataLayer || [])].filter(event => event[0] === 'event' && event[1] === name).map(event => event[2]), name)
const loadContact = async () => {
  await page.goto(`${base}/contact`)
  await page.locator('astro-island[component-export="ContactForm"]:not([ssr])').waitFor()
}
try {
  await loadContact()
  await page.getByRole('button', { name: 'Send inquiry' }).click()
  assert.equal(leadRequests, 0)
  assert.equal((await events('contact_form_submit')).length, 0)
  await page.getByLabel('Work email', { exact: true }).fill('qa@example.com')
  await page.getByRole('button', { name: 'Send inquiry' }).click()
  await page.getByRole('alert').waitFor()
  assert.equal((await events('contact_form_submit')).length, 0, 'A server failure is not a conversion')
  responseStatus = 201
  await page.getByRole('button', { name: 'Send inquiry' }).click()
  await page.getByRole('heading', { name: 'Thanks for reaching out.' }).waitFor()
  assert.deepEqual(await events('contact_form_submit'), [{ page_path: '/contact', form_id: 'contact' }], 'Exactly one event, without name/email/message data')
  assert.equal(leadRequests, 2)
  console.log('PASS invalid email / server failure excluded; accepted lead counted once without form data')

  await loadContact()
  const beforeHoneypot = leadRequests
  await page.locator('.honeypot input').evaluate(element => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, 'bot.example')
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await page.getByRole('button', { name: 'Send inquiry' }).click()
  await page.getByRole('heading', { name: 'Thanks for reaching out.' }).waitFor()
  assert.equal(leadRequests, beforeHoneypot)
  assert.equal((await events('contact_form_submit')).length, 0, 'Honeypot success UI is not a lead')
  console.log('PASS honeypot excluded')

  await loadContact()
  await page.evaluate(() => { window.gtag = () => { throw new Error('Analytics unavailable') } })
  await page.getByLabel('Work email', { exact: true }).fill('qa@example.com')
  await page.getByRole('button', { name: 'Send inquiry' }).click()
  await page.getByRole('heading', { name: 'Thanks for reaching out.' }).waitFor()
  console.log('PASS analytics failure does not break accepted inquiry')

  await page.goto(base)
  await page.locator('astro-island[component-export="Header"]:not([ssr])').waitFor()
  // Exercise actual DOM links but keep the page/dataLayer available for assertions.
  await page.evaluate(() => document.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault() }))
  await page.getByRole('link', { name: 'Talk to our team', exact: true }).click()
  assert.equal((await events('cta_contact_click')).length, 1)
  await page.getByRole('link', { name: 'Office SDK on GitHub', exact: true }).first().click()
  assert.equal((await events('github_outbound_click')).length, 1)
  await page.getByRole('link', { name: 'Email Office SDK', exact: true }).click()
  assert.equal((await events('cta_contact_click')).length, 2)
  assert.ok(!JSON.stringify(await events('cta_contact_click')).includes('@'), 'No email address in click parameters')
  console.log('PASS contact/mail/GitHub links each emit one intent event')

  await page.goto(`${base}/blog/first-open-source-retrieval`)
  assert.equal((await events('article_scroll_75')).length, 0)
  await page.locator('article[data-slug]').evaluate(element => window.scrollTo(0, element.offsetTop + element.offsetHeight * 0.8))
  await page.waitForFunction(() => [...window.dataLayer].some(event => event[1] === 'article_scroll_75'))
  await page.evaluate(() => { window.scrollTo(0, 0); window.dispatchEvent(new Event('resize')) })
  await page.locator('article[data-slug]').evaluate(element => window.scrollTo(0, element.offsetTop + element.offsetHeight))
  assert.equal((await events('article_scroll_75')).length, 1)
  console.log('PASS article 75% threshold emits once per page load')

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto(base)
    assert.match(await page.title(), /Office SDK.*Self-Hosted/)
    await page.locator('astro-island[component-export="Hero"]:not([ssr])').waitFor()
    await page.locator('.editor-slide.is-active img').evaluate(image => image.decode())
    assert.equal(await page.locator('vite-error-overlay, astro-error-overlay').count(), 0)
    assert.ok(await page.getByRole('link', { name: 'Talk to our team', exact: true }).isVisible())
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow')
    assert.ok(await page.locator('.editor-interface-image').evaluateAll(images => images.every(image => image.srcset.includes('640w') && image.srcset.includes('1600w'))))
    await page.screenshot({ path: path.join(output, `home-${viewport.width}.png`) })
    await page.getByRole('button', { name: 'Next editor', exact: true }).click()
    await page.locator('.editor-slide.is-active').filter({ hasText: 'Writer' }).waitFor()
    await page.locator('.editor-slide.is-active img').evaluate(image => image.decode())
    await page.getByRole('link', { name: 'Talk to our team', exact: true }).click()
    await page.waitForURL('**/contact')
    assert.equal((await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim(), 'Talk to our team.')
    await page.screenshot({ path: path.join(output, `contact-${viewport.width}.png`) })
  }
  assert.equal(analyticsRequests, 0, 'Local QA must not load a production Google tag')
  assert.deepEqual(errors, [])
  console.log(`PASS desktop/mobile titles, CTA navigation, carousel, responsive images, no overflow/overlays/runtime errors; screenshots: ${output}`)
} finally { await browser.close() }
