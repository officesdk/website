import type { APIRoute } from 'astro'
import { blogEntries } from '../blog/data'
import { siteRoutes } from '../seo'

export const prerender = true

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const staticEntries = [...siteRoutes, '/blog'].map((path) => ({
  path,
  changefreq: 'weekly',
  priority: path === '/' ? '1.0' : path === '/blog' ? '0.9' : '0.8',
}))

const articleEntries = blogEntries.map((entry) => ({
  path: `/blog/${entry.slug}`,
  lastmod: entry.publishedAt,
  changefreq: 'monthly',
  priority: '0.7',
}))

export const GET: APIRoute = () => {
  const urls = [...staticEntries, ...articleEntries]
    .map((entry) => {
      const lastmod = 'lastmod' in entry && typeof entry.lastmod === 'string' ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''
      return `<url><loc>https://officesdk.com${escapeXml(entry.path)}</loc>${lastmod}<changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
    })
    .join('\n  ')

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
