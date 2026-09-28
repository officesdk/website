const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const rect = (x, y, width, height, fill, stroke = 'none', radius = 0) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" rx="${radius}"/>`
const line = (x1, y1, x2, y2, color, width = 2) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`
const text = (x, y, value, size = 28, color = '#27343b', weight = 400) => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escape(value)}</text>`

function wrap(value, max) {
  const rows = ['']
  for (const word of value.split(/\s+/)) {
    if (rows.at(-1).length + word.length + 1 > max && rows.at(-1)) rows.push('')
    rows[rows.length - 1] += `${rows.at(-1) ? ' ' : ''}${word}`
  }
  return rows
}

function label(x, y, value, size, max, color = '#27343b', weight = 400) {
  const longestWord = Math.max(...value.split(/\s+/).map(word => word.length))
  const fontSize = Math.min(size, size * max / longestWord)
  return wrap(value, max).map((row, index) => text(x, y + index * (size + 10), row, fontSize, color, weight)).join('')
}

function arrow(x1, y1, x2, y2, color) {
  const direction = Math.atan2(y2 - y1, x2 - x1)
  const points = [-0.6, 0.6].map(angle => `${x2 - 13 * Math.cos(direction + angle)} ${y2 - 13 * Math.sin(direction + angle)}`)
  return line(x1, y1, x2, y2, color, 3) + `<path d="M${points[0]} L${x2} ${y2} L${points[1]}" stroke="${color}" stroke-width="3" fill="none"/>`
}

function verticalFigure(figure, accent, soft, height) {
  let art = rect(0, 0, 600, height, '#f8faf9') + rect(0, 0, 600, 8, accent)
  art += label(36, 68, figure.title, 36, 27, '#202b31', 600)
  const document = figure.kind === 'document'
  if (document) art += rect(26, 205, 548, height - 270, '#fff', '#d5dfdf', 3)
  figure.items.forEach((item, index) => {
    const y = 230 + index * 210
    const numeric = ['flow', 'sequence'].includes(figure.kind)
    const marker = numeric ? String(index + 1).padStart(2, '0') : figure.kind === 'decision' ? String.fromCharCode(65 + index) : null
    const x = marker ? 98 : 48
    if (marker) {
      art += text(32, y + 27, marker, 27, accent, 700)
      if (index < figure.items.length - 1) art += arrow(52, y + 69, 52, y + 178, '#93afa4')
    } else if (!document) art += rect(30, y - 8, 540, 176, index % 2 ? '#fff' : soft, '#d6e0df', 2)
    art += label(x, y + 30, item.label, 30, marker ? 27 : 30, accent, 600)
    const lines = wrap(item.label, marker ? 27 : 30).length
    art += label(x, y + 40 + lines * 40, item.detail, 26, marker ? 31 : 35, '#43545a')
    if (document && index < figure.items.length - 1) art += line(48, y + 177, 552, y + 177, '#dce4e3', 1)
  })
  return art + text(36, height - 25, 'OFFICE SDK JOURNAL', 16, '#6f7e82', 600)
}

export function bodyIllustrationSvg(figure, recipe, mobile = false) {
  const { accent, soft } = recipe
  if (mobile) return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${figure.mobileHeight}" viewBox="0 0 600 ${figure.mobileHeight}">${verticalFigure(figure, accent, soft, figure.mobileHeight)}</svg>`
  const count = figure.items.length
  let art = rect(0, 0, 1200, 900, '#f8faf9') + rect(0, 0, 1200, 10, accent)
  art += label(52, 85, figure.title, 40, 48, '#202b31', 600) + line(52, 195, 1148, 195, '#d7e1df', 1)

  if (figure.kind === 'flow') {
    const gap = 26
    const width = (1096 - (count - 1) * gap) / count
    figure.items.forEach((item, index) => {
      const x = 52 + index * (width + gap)
      art += rect(x, 286, width, 438, index % 2 ? '#fff' : soft, '#ceddda', 3)
      art += text(x + 18, 331, String(index + 1).padStart(2, '0'), 28, accent, 600)
      const max = Math.max(10, Math.floor((width - 36) / 16))
      const rows = wrap(item.label, max)
      art += label(x + 18, 390, item.label, 30, max, accent, 600)
      art += label(x + 18, 420 + rows.length * 40, item.detail, 24, Math.max(13, Math.floor((width - 36) / 12.5)), '#43545a')
      if (index < count - 1) art += arrow(x + width + 3, 507, x + width + gap - 4, 507, accent)
    })
  } else if (figure.kind === 'sequence') {
    figure.items.forEach((item, index) => {
      const y = 245 + index * 111
      art += rect(117, y - 18, 1031, 101, index % 2 ? '#fff' : soft, '#d7e2df', 2)
      art += text(53, y + 34, String(index + 1).padStart(2, '0'), 29, accent, 600)
      art += label(141, y + 22, item.label, 29, 20, accent, 600)
      art += label(490, y + 20, item.detail, 27, 43, '#43545a')
      if (index < count - 1) art += arrow(72, y + 52, 72, y + 91, '#92aca3')
    })
  } else if (figure.kind === 'comparison' || figure.kind === 'decision') {
    const gap = 26
    const width = (1096 - (count - 1) * gap) / count
    const top = figure.kind === 'decision' ? 344 : 275
    if (figure.kind === 'decision') {
      art += rect(416, 225, 368, 62, accent, 'none', 3) + text(444, 265, 'CHOOSE BY REQUIREMENT', 23, '#fff', 600)
      art += line(600, 287, 600, 309, accent) + line(52 + width / 2, 309, 1148 - width / 2, 309, accent)
    }
    figure.items.forEach((item, index) => {
      const x = 52 + index * (width + gap)
      if (figure.kind === 'decision') art += arrow(x + width / 2, 309, x + width / 2, top - 7, accent)
      art += rect(x, top, width, 420, '#fff', '#d1deda', 3) + rect(x, top, width, 128, index % 2 ? '#e7edf2' : soft)
      art += label(x + 25, top + 50, item.label, 32, Math.floor((width - 50) / 17), accent, 600)
      art += label(x + 25, top + 181, item.detail, 29, Math.floor((width - 50) / 15), '#43545a')
    })
  } else if (figure.kind === 'layers') {
    figure.items.forEach((item, index) => {
      const y = 232 + index * 113
      art += rect(52, y, 1096, 101, index === 0 ? soft : index % 2 ? '#fff' : '#edf1f2', '#d3dfdb', 3)
      art += rect(52, y, 8, 101, index === 0 ? accent : '#a1b7af')
      art += label(85, y + 39, item.label, 30, 21, accent, 600)
      art += label(486, y + 37, item.detail, 27, 44, '#43545a')
    })
  } else if (figure.kind === 'document') {
    art += rect(129, 226, 953, 569, '#e1e8e5') + rect(117, 214, 953, 569, '#fff', '#cad8d1', 3)
    art += rect(146, 239, 57, 6, accent) + text(235, 255, 'DOCUMENT RECORD', 19, '#75847f', 600)
    figure.items.forEach((item, index) => {
      const y = 310 + index * 91
      art += label(146, y, item.label, 27, 23, accent, 600) + label(520, y, item.detail, 25, 36, '#43545a')
      if (index < count - 1) art += line(146, y + 61, 1040, y + 61, '#dce5e0', 1)
    })
  } else {
    art += rect(52, 224, 1096, 55, accent) + text(78, 260, 'CHECK / FIELD', 22, '#fff', 600) + text(494, 260, 'WHAT TO RECORD', 22, '#fff', 600)
    figure.items.forEach((item, index) => {
      const y = 279 + index * 104
      art += rect(52, y, 1096, 104, index % 2 ? '#fff' : soft, '#d7e0dc')
      art += label(78, y + 37, item.label, 29, 25, accent, 600) + label(494, y + 35, item.detail, 27, 43, '#43545a')
    })
  }
  art += line(52, 838, 1148, 838, '#d8e0dd', 1) + text(52, 872, 'OFFICE SDK JOURNAL', 18, '#6f7e82', 600)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">${art}</svg>`
}
