import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Renders the default Open Graph card (1200x630) used by pages that do not
// provide a per-article cover. Re-runnable: node scripts/brand/generate-og.mjs
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const escape = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const ink = '#16202a'
const navy = '#122334'
const lime = '#d5e775'
const paper = '#f8fbfa'
const muted = '#5c6f7c'
const line = '#d8e3e4'

function chip(x, y, width, label) {
  return `<rect x="${x}" y="${y}" width="${width}" height="44" rx="22" fill="#fff" stroke="${line}"/><text x="${x + width / 2}" y="${y + 29}" fill="${navy}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="600" text-anchor="middle">${escape(label)}</text>`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${paper}"/>
  <rect width="1200" height="10" fill="${lime}"/>
  <g>
    <rect x="58" y="58" width="64" height="64" rx="14" fill="${navy}"/>
    <rect x="74" y="84" width="32" height="7" rx="3.5" fill="${lime}"/>
    <rect x="74" y="98" width="22" height="7" rx="3.5" fill="#5b7fa6"/>
    <text x="142" y="101" fill="${ink}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">Office SDK</text>
  </g>
  <text x="58" y="248" fill="${ink}" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700">Embed Word, Excel &amp; PowerPoint</text>
  <text x="58" y="322" fill="${ink}" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700">in your app<tspan fill="#7a8c1f">.</tspan></text>
  <rect x="58" y="356" width="206" height="8" rx="4" fill="${lime}"/>
  <text x="58" y="424" fill="${muted}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="500">Preview, edit, and convert documents beside the workflow</text>
  <text x="58" y="462" fill="${muted}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="500">that already owns users, files, and permissions.</text>
  ${chip(58, 522, 214, 'Self-hosted')}
  ${chip(290, 522, 148, 'Web-based')}
  ${chip(456, 522, 122, 'API-first')}
  <line x1="58" y1="572" x2="1142" y2="572" stroke="${line}" stroke-width="1"/>
  <text x="1142" y="600" fill="${navy}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" text-anchor="end">officesdk.com</text>
</svg>`

const outPath = path.join(root, 'public/brand/og-default.png')
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath)
const meta = await sharp(outPath).metadata()
console.log(`og-default.png ${meta.width}x${meta.height} written`)
