import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, FileSpreadsheet, FileText, PenLine, Presentation } from 'lucide-react'

type EditorAnnotation = {
  label: string
  shortLabel: string
  labelX: number
  route: 'top' | 'left' | 'right' | 'left-below'
  // Bounds include whitespace around the UI, in percent of the source image.
  region: { x: number; y: number; width: number; height: number }
}

const frame = { width: 1600, height: 828, imageX: 32, imageY: 96, imageWidth: 1536 }

const editors = [
  {
    id: 'document',
    name: 'Document',
    tags: ['Markdown', 'Notes'],
    icon: FileText,
    image: '/product/core-editors/hero-document.webp?v=a7e6bbc73b',
    alt: 'Document editor with the Northstar Atlas workspace, document outline, and rich content.',
    accent: '#51dce7',
    glow: '#267f98',
    surface: '#102a32',
    imageWidth: 3840,
    imageHeight: 1752,
    annotations: [
      { label: 'Document outline', shortLabel: 'Outline', labelX: 12, route: 'left', region: { x: 12.6, y: 7.2, width: 14.9, height: 85.8 } },
      { label: 'Text formatting', shortLabel: 'Formatting', labelX: 38, route: 'top', region: { x: 29.7, y: 1.1, width: 22, height: 3.4 } },
      { label: 'Lists & checklists', shortLabel: 'Checklists', labelX: 62, route: 'top', region: { x: 52.4, y: 1.1, width: 12.3, height: 3.4 } },
      { label: 'Comments', shortLabel: 'Comments', labelX: 88, route: 'right', region: { x: 68.5, y: 26.6, width: 14, height: 7.3 } },
    ] satisfies EditorAnnotation[],
  },
  {
    id: 'writer',
    name: 'Writer',
    tags: ['Word', 'Office'],
    icon: PenLine,
    image: '/product/core-editors/hero-writer.webp?v=1dc33037ed',
    alt: 'Writer editor with the Northstar proposal, page layout, and document formatting tools.',
    accent: '#79acff',
    glow: '#6056b5',
    surface: '#182844',
    imageWidth: 3810,
    imageHeight: 1752,
    annotations: [
      { label: 'Document outline', shortLabel: 'Outline', labelX: 12, route: 'left', region: { x: .5, y: 9.7, width: 12.6, height: 82.6 } },
      { label: 'Text formatting', shortLabel: 'Formatting', labelX: 38, route: 'top', region: { x: 11.8, y: 4.3, width: 28.2, height: 3.9 } },
      { label: 'Images & tables', shortLabel: 'Images & tables', labelX: 62, route: 'top', region: { x: 62.9, y: 4.3, width: 4.1, height: 3.9 } },
      { label: 'Comments', shortLabel: 'Comments', labelX: 88, route: 'right', region: { x: 72.2, y: 29.3, width: 14, height: 7.2 } },
    ] satisfies EditorAnnotation[],
  },
  {
    id: 'sheet',
    name: 'Sheet',
    tags: ['Excel', 'Office'],
    icon: FileSpreadsheet,
    image: '/product/core-editors/hero-sheet.webp?v=cb610a8114',
    alt: 'Sheet editor with the Northstar operations workbook, tables, and charts.',
    accent: '#79d8ac',
    glow: '#268979',
    surface: '#13342a',
    imageWidth: 3840,
    imageHeight: 1754,
    annotations: [
      { label: 'Live formulas', shortLabel: 'Formulas', labelX: 12, route: 'left-below', region: { x: 33.7, y: 86.1, width: 10.2, height: 3.4 } },
      { label: 'Cell formatting', shortLabel: 'Formatting', labelX: 38, route: 'top', region: { x: 24.6, y: 3.4, width: 21.3, height: 3.4 } },
      { label: 'Sort & filter', shortLabel: 'Sort & filter', labelX: 62, route: 'top', region: { x: 63.7, y: 3.4, width: 5.5, height: 3.4 } },
      { label: 'Charts', shortLabel: 'Charts', labelX: 88, route: 'right', region: { x: 65.1, y: 31.4, width: 27, height: 56 } },
    ] satisfies EditorAnnotation[],
  },
  {
    id: 'presentation',
    name: 'Presentation',
    tags: ['PPT', 'Office'],
    icon: Presentation,
    image: '/product/core-editors/hero-presentation.webp?v=5a10162e2f',
    alt: 'Presentation editor with the Northstar quarterly review, slide thumbnails, and presentation tools.',
    accent: '#f1af8d',
    glow: '#b47940',
    surface: '#39241f',
    imageWidth: 3838,
    imageHeight: 1750,
    annotations: [
      { label: 'Slide navigation', shortLabel: 'Slides', labelX: 12, route: 'left', region: { x: .6, y: 8.9, width: 9, height: 82.9 } },
      { label: 'Images & shapes', shortLabel: 'Images & shapes', labelX: 34, route: 'top', region: { x: 15.1, y: 3.7, width: 9, height: 3.7 } },
      { label: 'Text & typography', shortLabel: 'Typography', labelX: 62, route: 'top', region: { x: 49.7, y: 3.7, width: 22.2, height: 3.7 } },
      { label: 'Object formatting', shortLabel: 'Formatting', labelX: 88, route: 'right', region: { x: 86.9, y: 8.8, width: 12.6, height: 77.6 } },
    ] satisfies EditorAnnotation[],
  },
]

const rotationMs = 5000

type Point = { x: number; y: number }

// Round only the bends; each route has its own lane outside the editor UI.
function roundedPath(points: Point[]) {
  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length - 1; index++) {
    const before = points[index - 1]
    const corner = points[index]
    const after = points[index + 1]
    const incoming = Math.hypot(corner.x - before.x, corner.y - before.y)
    const outgoing = Math.hypot(after.x - corner.x, after.y - corner.y)
    const radius = Math.min(8, incoming / 2, outgoing / 2)
    if (!incoming || !outgoing) continue
    const start = { x: corner.x + (before.x - corner.x) * radius / incoming, y: corner.y + (before.y - corner.y) * radius / incoming }
    const end = { x: corner.x + (after.x - corner.x) * radius / outgoing, y: corner.y + (after.y - corner.y) * radius / outgoing }
    path += ` L ${start.x} ${start.y} Q ${corner.x} ${corner.y} ${end.x} ${end.y}`
  }
  return `${path} L ${points.at(-1)!.x} ${points.at(-1)!.y}`
}

function annotationGeometry(annotation: EditorAnnotation, imageWidth: number, imageHeight: number) {
  const imageFrameHeight = frame.imageWidth * imageHeight / imageWidth
  const box = {
    x: frame.imageX + frame.imageWidth * annotation.region.x / 100,
    y: frame.imageY + imageFrameHeight * annotation.region.y / 100,
    width: frame.imageWidth * annotation.region.width / 100,
    height: imageFrameHeight * annotation.region.height / 100,
  }
  const label = { x: annotation.labelX / 100 * frame.width, y: 62 }
  const railY = 78
  const leftRail = 12
  const rightRail = frame.width - 12
  const gap = 10
  let target: Point
  let points: Point[]
  if (annotation.route === 'left') {
    target = { x: Math.max(frame.imageX - 4, box.x - gap), y: box.y + box.height * .38 }
    points = [target, { x: leftRail, y: target.y }, { x: leftRail, y: railY }, { x: label.x, y: railY }, label]
  } else if (annotation.route === 'right') {
    target = { x: Math.min(frame.imageX + frame.imageWidth + 4, box.x + box.width + gap), y: box.y + box.height * .4 }
    points = [target, { x: rightRail, y: target.y }, { x: rightRail, y: railY }, { x: label.x, y: railY }, label]
  } else if (annotation.route === 'left-below') {
    target = { x: box.x + box.width / 2, y: box.y + box.height + gap }
    // The selected formula cell sits above an empty row, keeping this leg off data.
    const laneY = target.y + 10
    points = [target, { x: target.x, y: laneY }, { x: leftRail, y: laneY }, { x: leftRail, y: railY }, { x: label.x, y: railY }, label]
  } else {
    target = { x: box.x + box.width / 2, y: box.y - gap }
    points = [target, { x: target.x, y: railY }, { x: label.x, y: railY }, label]
  }
  const right = box.x + box.width
  const bottom = box.y + box.height
  const arm = Math.min(12, box.width / 4, box.height / 4)
  const corners = `M ${box.x} ${box.y + arm} V ${box.y} H ${box.x + arm} M ${right - arm} ${box.y} H ${right} V ${box.y + arm} M ${right} ${bottom - arm} V ${bottom} H ${right - arm} M ${box.x + arm} ${bottom} H ${box.x} V ${bottom - arm}`
  return { label, target, path: roundedPath(points), corners }
}

export default function EditorCarousel() {
  const instanceId = useId()
  const [active, setActive] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [inView, setInView] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const touchRef = useRef<{ x: number; y: number } | null>(null)
  const playing = !reducedMotion && !hovered && !focused && visible && inView

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    const updateVisibility = () => setVisible(!document.hidden)
    updatePreference()
    updateVisibility()
    preference.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    if (rootRef.current) observer.observe(rootRef.current)
    return () => {
      preference.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setActive(index => (index + 1) % editors.length), rotationMs)
    return () => window.clearTimeout(timer)
  }, [active, playing])

  const step = (direction: number) => setActive(index => (index + direction + editors.length) % editors.length)

  return (
    <div
      className="editor-carousel"
      style={{
        '--active-editor-accent': editors[active].accent,
        '--editor-frame-aspect': `${frame.width} / ${frame.height}`,
        '--editor-image-top': `${frame.imageY / frame.height * 100}%`,
        '--editor-image-left': `${frame.imageX / frame.width * 100}%`,
        '--editor-image-width': `${frame.imageWidth / frame.width * 100}%`,
      } as CSSProperties}
      data-animate={!reducedMotion && visible && inView}
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Core editors"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false) }}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    >
      <div className="editor-carousel-viewport">
        <div
          id={`${instanceId}-editor-stage`}
          className="editor-carousel-stage"
          aria-live={playing ? 'off' : 'polite'}
          onTouchStart={event => { touchRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
          onTouchEnd={event => {
            if (!touchRef.current) return
            const dx = event.changedTouches[0].clientX - touchRef.current.x
            const dy = event.changedTouches[0].clientY - touchRef.current.y
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
              event.preventDefault()
              step(dx < 0 ? 1 : -1)
            }
            touchRef.current = null
          }}
        >
          {editors.map((editor, index) => {
            const EditorIcon = editor.icon
            const distance = (index - active + editors.length) % editors.length
            const position = distance === 0 ? 'active' : distance === 1 ? 'next' : distance === editors.length - 1 ? 'previous' : 'away'
            const canSelect = position === 'previous' || position === 'next'
            return (
              <div
                key={editor.id}
                id={`hero-editor-${editor.id}`}
                className={`editor-slide is-${position}`}
                style={{ '--editor-accent': editor.accent, '--editor-glow': editor.glow, '--editor-surface': editor.surface } as CSSProperties}
                role={canSelect ? 'button' : 'group'}
                aria-roledescription={canSelect ? undefined : 'slide'}
                aria-label={canSelect ? `Show ${editor.name} editor` : `${editor.name} editor`}
                aria-describedby={`${instanceId}-${editor.id}-types`}
                aria-hidden={position === 'away'}
                tabIndex={canSelect ? 0 : -1}
                onClick={() => { if (canSelect) setActive(index) }}
                onKeyDown={event => {
                  if (canSelect && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    setActive(index)
                  }
                }}
              >
                <div className="editor-slide-heading">
                  <div className="editor-product-identity">
                    <span className="editor-product-mark"><EditorIcon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                    <h2 className="editor-product-name">{editor.name}</h2>
                  </div>
                  <ul className="editor-type-tags" id={`${instanceId}-${editor.id}-types`} aria-label="Editor type">
                    {editor.tags.map(tag => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <div className="editor-slide-preview">
                  <img className="editor-interface-image" src={editor.image} width={editor.imageWidth} height={editor.imageHeight} alt={editor.alt} fetchPriority={index === 0 ? 'high' : 'low'} decoding="async" draggable={false} />
                  <svg className="editor-annotation-lines" viewBox={`0 0 ${frame.width} ${frame.height}`} aria-hidden="true">
                    {editor.annotations.map((annotation, annotationIndex) => {
                      const { label, target, path, corners } = annotationGeometry(annotation, editor.imageWidth, editor.imageHeight)
                      const gradientId = `${instanceId}-${editor.id}-${annotationIndex}`
                      return <g key={annotation.label}>
                        <defs>
                          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={target.x} y1={target.y} x2={label.x} y2={label.y}>
                            <stop offset="0%" stopColor="var(--annotation-ink)" stopOpacity=".9" />
                            <stop offset="60%" stopColor={editor.accent} stopOpacity=".65" />
                            <stop offset="100%" stopColor={editor.accent} stopOpacity=".3" />
                          </linearGradient>
                        </defs>
                        <path className="annotation-line-underlay" d={path} />
                        <path className="annotation-line" d={path} stroke={`url(#${gradientId})`} />
                        <path className="annotation-flow" d={path} pathLength="100" style={{ animationDelay: `${annotationIndex * -1.4}s` }} />
                        <path className="annotation-region-corners" d={corners} />
                      </g>
                    })}
                  </svg>
                  <div className="editor-annotation-labels" aria-label="Editor features">
                    {editor.annotations.map(annotation => <span key={annotation.label} className="editor-annotation-label" style={{ left: `${annotation.labelX}%`, top: `${34 / frame.height * 100}%` }}><span className="annotation-full-label">{annotation.label}</span><span className="annotation-short-label">{annotation.shortLabel}</span></span>)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <button
          className="editor-carousel-arrow is-previous"
          type="button"
          aria-label="Previous editor"
          aria-controls={`${instanceId}-editor-stage`}
          onClick={() => step(-1)}
        >
          <ChevronLeft size={26} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button
          className="editor-carousel-arrow is-next"
          type="button"
          aria-label="Next editor"
          aria-controls={`${instanceId}-editor-stage`}
          onClick={() => step(1)}
        >
          <ChevronRight size={26} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
      <div className="editor-carousel-toolbar">
        <div className="editor-choices" role="group" aria-label="Choose editor">
          {editors.map((editor, index) => {
            const Icon = editor.icon
            return (
              <button
                key={editor.id}
                className={`editor-choice ${index === active ? 'is-active' : ''}`}
                type="button"
                aria-pressed={index === active}
                aria-controls={`hero-editor-${editor.id}`}
                onClick={() => setActive(index)}
                style={{ '--editor-accent': editor.accent } as CSSProperties}
              >
                <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                <span>{editor.name}</span>
                {index === active && <span key={`${active}-${playing}`} className={`editor-choice-progress ${playing ? 'is-running' : ''}`} aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
