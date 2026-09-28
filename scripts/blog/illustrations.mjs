import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { bodyIllustrationSvg } from './body-illustrations.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const rect = (x, y, w, h, fill, stroke = 'none', radius = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`
const line = (x1, y1, x2, y2, color, width = 2) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`
const text = (x, y, label, size = 18, color = '#293c47', weight = 500) => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}">${escape(label)}</text>`

function words(label, max = 26) {
  const parts = label.replace(/[.:?]/g, '').split(/\s+/)
  const lines = ['']
  for (const part of parts) {
    if (lines.at(-1).length + part.length > max && lines.at(-1)) lines.push('')
    lines[lines.length - 1] += `${lines.at(-1) ? ' ' : ''}${part}`
  }
  return lines.slice(0, 3)
}

function label(x, y, value, size = 18, color = '#293c47', max = 24) {
  return words(value, max).map((row, index) => text(x, y + index * (size + 8), row, size, color)).join('')
}

function document(x, y, width, height, accent, heading) {
  let result = rect(x + 9, y + 10, width, height, '#dfe6e7') + rect(x, y, width, height, '#fff', '#cbd7dc')
  result += rect(x + 25, y + 26, 37, 5, accent) + label(x + 25, y + 67, heading, 17, '#273c48', Math.floor((width - 50) / 10))
  for (let index = 0; index < 6; index++) result += rect(x + 25, y + 145 + index * 19, width - 50 - (index % 3) * 25, 5, '#d6e0e4')
  result += line(x + 25, y + height - 55, x + width - 25, y + height - 55, accent, 2)
  return result
}

export function illustrationSvg(entry) {
  const { accent, soft, number } = entry.recipe
  const concepts = entry.concepts.length ? entry.concepts : [entry.category, 'Document context', 'Workflow boundary', 'Validation']
  const headings = Array.from({ length: 6 }, (_, index) => concepts[index % concepts.length])
  const variant = (number - 1) % 12
  const offset = Math.floor((number - 1) / 12) * 3
  let art = rect(0, 0, 1200, 760, '#f8fbfa')
  art += rect(0, 0, 1200, 12, accent) + text(58, 60, entry.category.toUpperCase(), 15, accent, 700)
  art += text(1020, 60, `FIELD NOTE ${String(number).padStart(3, '0')}`, 12, '#72818a', 600)
  art += label(58, 111, entry.title, 29, '#223642', 64)
  art += line(58, 207, 1140, 207, '#d8e3e4', 1)
  if (variant === 0) {
    for (let index = 0; index < 4; index++) {
      const x = 74 + index * 280
      art += rect(x, 299 + (index % 2) * offset, 236, 212, index % 2 ? '#fff' : soft, '#cfddde', 4)
      art += text(x + 22, 343, `0${index + 1}`, 34, accent, 500) + label(x + 22, 404, headings[index], 20, '#273c48', 19)
      if (index < 3) art += line(x + 245, 405, x + 267, 405, accent, 3) + `<path d="M${x + 260} 399 L${x + 267} 405 L${x + 260} 411" fill="none" stroke="${accent}" stroke-width="3"/>`
    }
  } else if (variant === 1) {
    art += rect(76, 255, 1044, 363, '#fff', '#cad9db')
    for (let row = 0; row < 4; row++) {
      art += rect(76, 255 + row * 90, 1044, 90, row % 2 ? '#fff' : soft)
      art += text(104, 307 + row * 90, `0${row + 1}`, 21, accent, 700) + label(174, 295 + row * 90, headings[row], 19, '#293c47', 37)
      art += rect(700 + offset, 284 + row * 90, 95 + row * 16, 26, row % 2 ? accent : '#c7d5d8', 'none', 3)
      art += text(890, 308 + row * 90, ['Context', 'Boundary', 'Operation', 'Review'][row], 17, '#667982')
    }
  } else if (variant === 2) {
    art += document(450 - offset, 248, 370, 396, accent, headings[0])
    for (let index = 0; index < 3; index++) {
      const left = index % 2 === 0
      const y = 290 + index * 110
      art += label(left ? 78 : 872, y, headings[index + 1], 18, '#334b58', 23)
      art += line(left ? 333 : 830, y + 28, left ? 470 : 802, y + 28, accent, 2)
      art += rect(left ? 465 : 800, y + 23, 10, 10, accent)
    }
  } else if (variant === 3) {
    art += rect(454, 368, 292, 120, accent, 'none', 4) + label(484, 410, entry.category, 26, '#fff', 21)
    const positions = [[78, 263], [800, 263], [78, 500], [800, 500]]
    positions.forEach(([x, y], index) => {
      art += line(x < 450 ? x + 315 : x, y + 65, x < 450 ? 454 : 746, 428, '#aabfc2')
      art += rect(x, y, 315, 132, '#fff', '#c8d7da', 4) + text(x + 22, y + 35, `0${index + 1}`, 15, accent, 700) + label(x + 22, y + 71, headings[index], 19, '#293c47', 25)
    })
  } else if (variant === 4) {
    art += rect(133 + offset, 250, 935, 381, '#fff', '#cfddde')
    for (let index = 0; index < 4; index++) {
      const y = 289 + index * 81
      art += rect(177 + offset, y, 31, 31, soft, accent, 3)
      art += `<path d="M${183 + offset} ${y + 16} l7 7 l13 -17" fill="none" stroke="${accent}" stroke-width="3"/>`
      art += label(241 + offset, y + 24, headings[index], 22, '#293c47', 54)
      if (index < 3) art += line(240 + offset, y + 59, 1009, y + 59, '#e0e9e9', 1)
    }
  } else if (variant === 5) {
    for (let index = 0; index < 4; index++) {
      const x = 130 + index * 35 + offset
      const y = 250 + index * 86
      art += rect(x, y, 860 - index * 45, 72, index === 0 ? accent : index % 2 ? soft : '#fff', '#c8d8db', 3)
      art += text(x + 24, y + 43, `0${index + 1}`, 16, index === 0 ? '#fff' : accent, 700) + label(x + 90, y + 43, headings[index], 20, index === 0 ? '#fff' : '#293c47', 58)
    }
  } else if (variant === 6) {
    art += rect(388, 250, 420, 98, accent, 'none', 4) + label(416, 292, headings[0], 22, '#fff', 31)
    art += line(598, 348, 598, 400, accent) + line(282, 400, 913, 400, accent)
    for (let index = 0; index < 3; index++) {
      const x = 130 + index * 343
      art += line(x + 150, 400, x + 150, 439, accent)
      art += rect(x, 439, 300, 157, '#fff', '#cad9db', 4) + text(x + 23, 474, `PATH 0${index + 1}`, 13, accent, 700) + label(x + 23, 513, headings[index + 1], 20, '#293c47', 22)
    }
  } else if (variant === 7) {
    art += line(126, 360, 1074, 360, '#c8d8d9', 4)
    for (let index = 0; index < 5; index++) {
      const x = 126 + index * 237
      art += rect(x - 13, 347, 26, 26, accent, '#f8fbfa', 4)
      art += text(x - 13, 314, `0${index + 1}`, 27, accent, 600)
      art += label(Math.max(58, x - 50), 416 + (index % 2) * offset, headings[index], 19, '#293c47', 17)
      art += line(x, 384, x, 394, '#bdccd0')
    }
  } else if (variant === 8) {
    art += document(107, 252, 420, 380, accent, headings[0]) + document(672, 275 - offset, 420, 360, accent, headings[1])
    art += line(562, 429, 637, 429, accent, 3) + `<path d="M627 419 L638 429 L627 439" fill="none" stroke="${accent}" stroke-width="3"/>`
  } else if (variant === 9) {
    art += rect(90, 255, 1020, 365, '#fff', '#c7d7d9') + rect(90, 255, 1020, 60, accent)
    art += text(124, 295, 'CONTEXT', 17, '#fff', 700) + text(490, 295, 'DECISION', 17, '#fff', 700) + text(842, 295, 'BOUNDARY', 17, '#fff', 700)
    for (let index = 0; index < 4; index++) {
      const y = 340 + index * 69
      art += label(124, y, headings[index], 18, '#293c47', 24) + text(490, y, ['Identify', 'Validate', 'Apply', 'Review'][index], 18, accent)
      art += rect(843, y - 17, 120 + index * 10, 20, soft, '#d0dfe0', 2) + line(90, y + 41, 1110, y + 41, '#dbe5e6', 1)
    }
  } else if (variant === 10) {
    for (let index = 0; index < 3; index++) {
      const x = 77 + index * 365
      const y = 260 + index * 37
      art += rect(x + 7, y + 9, 325, 232, '#dce6e6') + rect(x, y, 325, 232, index === 1 ? accent : '#fff', '#c9d9db', 3)
      art += text(x + 26, y + 40, `0${index + 1} / WORKFLOW`, 13, index === 1 ? '#fff' : accent, 600)
      art += label(x + 26, y + 95, headings[index], 23, index === 1 ? '#fff' : '#293c47', 20)
      art += rect(x + 26, y + 195, 140 + offset, 4, index === 1 ? '#dae8e2' : '#d5e2e4')
    }
  } else {
    art += rect(80, 254, 1040, 374, '#fff', '#cbdadd')
    for (let index = 0; index < 4; index++) {
      const x = 115 + (index % 2) * 520
      const y = 285 + Math.floor(index / 2) * 174
      art += text(x, y + 22, `0${index + 1}`, 14, accent, 700) + label(x + 49, y + 22, headings[index], 19, '#293c47', 31)
      for (let row = 0; row < 3; row++) art += rect(x + 49, y + 81 + row * 17, 310 - row * 36 - offset, 5, row === 0 ? accent : '#dce6e8')
    }
  }
  art += line(58, 683, 1140, 683, '#d7e2e3', 1) + text(58, 717, 'OFFICE SDK JOURNAL', 13, '#536872', 700)
  art += text(895, 717, 'DOCUMENTS / SYSTEMS / WORKFLOWS', 11, '#7a8a91', 500)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">${art}</svg>`
}

export async function generateIllustrations() {
  const catalogue = JSON.parse(await fs.readFile(path.join(root, 'src/blog/catalog.json'), 'utf8'))
  await fs.mkdir(path.join(root, 'public/blog/images'), { recursive: true })
  let figures = 0
  for (const entry of catalogue) {
    await sharp(Buffer.from(illustrationSvg(entry))).png({ compressionLevel: 9 }).toFile(path.join(root, 'public', entry.cover))
    const article = JSON.parse(await fs.readFile(path.join(root, 'public/blog/articles', `${entry.slug}.json`), 'utf8'))
    for (const section of article.sections) {
      if (!section.figure) continue
      const figure = section.figure
      await sharp(Buffer.from(bodyIllustrationSvg(figure, entry.recipe))).png({ compressionLevel: 9 }).toFile(path.join(root, 'public', figure.src))
      await sharp(Buffer.from(bodyIllustrationSvg(figure, entry.recipe, true))).png({ compressionLevel: 9 }).toFile(path.join(root, 'public', figure.mobileSrc))
      figures++
    }
  }
  console.log(`Generated ${catalogue.length} covers and ${figures} body illustrations, each with a separate mobile composition`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateIllustrations()
