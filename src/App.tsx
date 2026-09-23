import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronDown,
  Code2,
  Eye,
  Globe2,
  Layers3,
  LockKeyhole,
  Menu,
  MousePointer2,
  PenLine,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { codeSamples, faqs, features, formatOptions, type FormatKey, useCases } from './content'

type DemoMode = 'preview' | 'edit'
type CodeLanguage = keyof typeof codeSamples

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Platform', href: '#platform' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Resources', href: '#resources' },
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Office SDK home">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>Office SDK</span>
    </a>
  )
}

function Header({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="mobile-nav-cta" href="#demo" onClick={() => setMenuOpen(false)}>See the demo <ArrowUpRight size={15} /></a>
        </nav>
        <div className="header-actions">
          <a className="text-link header-docs" href="#resources">Docs <ArrowUpRight size={15} /></a>
          <button className="button button-small button-primary" type="button" onClick={onStart}>
            Start building <ArrowUpRight size={15} />
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function DocumentPreview({ format, mode, compact = false }: { format: FormatKey; mode: DemoMode; compact?: boolean }) {
  const selected = formatOptions.find((item) => item.key === format) ?? formatOptions[0]
  const Icon = selected.icon

  return (
    <div className={`document-shell ${compact ? 'document-shell-compact' : ''}`} style={{ '--format-accent': selected.accent } as React.CSSProperties}>
      <div className="document-toolbar">
        <div className="document-file">
          <span className="file-icon"><Icon size={16} strokeWidth={1.8} /></span>
          <div>
            <strong>{selected.title}</strong>
            <span>{mode === 'edit' ? 'Editing enabled' : 'Read-only preview'}</span>
          </div>
        </div>
        <div className="toolbar-state"><span className="state-dot" /> {mode === 'edit' ? 'Editing' : 'Preview'}</div>
      </div>
      <div className="document-workspace">
        <div className="document-ruler"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
        <div className="document-page">
          {format === 'docx' && (
            <div className="docx-page">
              <div className="page-kicker">OFFICE SDK / PRODUCT BRIEF</div>
              <h3>Make every document<br /><em>part of the workflow.</em></h3>
              <p className="page-lede">A dependable document layer for teams that need to review, edit, and move work forward without leaving the product.</p>
              <div className="page-rule" />
              <div className="page-columns"><span /><span /><span /></div>
              <div className="page-lines"><span /><span /><span /><span /><span /><span /></div>
              <div className="page-signature"><span /> <small>Office SDK team</small></div>
            </div>
          )}
          {format === 'xlsx' && (
            <div className="xlsx-page">
              <div className="sheet-title">Q3 revenue planning</div>
              <div className="sheet-grid">
                {['Region', 'Pipeline', 'Renewal', 'Forecast'].map((heading) => <strong key={heading}>{heading}</strong>)}
                {['North America', '$1.28M', '94%', '$1.17M', 'EMEA', '$820K', '91%', '$742K', 'APAC', '$610K', '88%', '$538K', 'Expansion', '$2.71M', '92%', '$2.45M'].map((value, index) => <span className={index % 4 === 0 ? 'row-label' : ''} key={`${value}-${index}`}>{value}</span>)}
              </div>
              <div className="sheet-bars"><span style={{ height: '44%' }} /><span style={{ height: '72%' }} /><span style={{ height: '56%' }} /><span style={{ height: '86%' }} /><span style={{ height: '66%' }} /><span style={{ height: '94%' }} /></div>
            </div>
          )}
          {format === 'pptx' && (
            <div className="pptx-page">
              <div className="slide-kicker">OFFICE SDK / 2025</div>
              <h3>The new standard<br />for <em>document work.</em></h3>
              <div className="slide-shape shape-one" /><div className="slide-shape shape-two" /><div className="slide-caption">A product narrative<br />for modern teams</div>
            </div>
          )}
        </div>
        <div className="document-side-tools">
          <button type="button" aria-label="Select tool"><MousePointer2 size={15} /></button>
          <button type="button" aria-label="Edit tool" className={mode === 'edit' ? 'active' : ''}><PenLine size={15} /></button>
          <button type="button" aria-label="Preview tool"><Eye size={15} /></button>
        </div>
      </div>
      <div className="document-footer"><span>Page 1 of 8</span><span>100%</span><span>Saved just now</span></div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> Document infrastructure for modern products</div>
          <h1>Documents should feel <em>native</em> to your product.</h1>
          <p>Embed reliable viewing, editing, annotation, and conversion for Office files — with an integration surface your team can actually shape.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => scrollTo('demo')}>Start building <ArrowRight size={17} /></button>
            <a className="button button-ghost" href="#resources">Read the docs <ArrowUpRight size={16} /></a>
          </div>
          <div className="hero-note"><span className="note-check"><Check size={13} /></span> One document layer for the workflows you already own</div>
        </div>
        <div className="hero-visual" data-reveal="right">
          <div className="visual-label label-top"><span className="pulse-dot" /> LIVE EMBEDDED SURFACE</div>
          <DocumentPreview format="docx" mode="edit" compact />
          <div className="visual-float float-api"><Braces size={14} /><span><strong>JavaScript API</strong><small>ready to customize</small></span></div>
          <div className="visual-float float-format"><Layers3 size={14} /><span><strong>DOCX · XLSX · PPTX</strong><small>one workflow</small></span></div>
        </div>
      </div>
      <div className="hero-bottom container">
        <span>Built for teams shipping</span>
        <div className="format-rail"><span>DOCX</span><i /><span>XLSX</span><i /><span>PPTX</span><i /><span>+ more business formats</span></div>
      </div>
    </section>
  )
}

function DemoSection() {
  const [format, setFormat] = useState<FormatKey>('docx')
  const [mode, setMode] = useState<DemoMode>('preview')
  const [language, setLanguage] = useState<CodeLanguage>('javascript')
  const selected = useMemo(() => formatOptions.find((item) => item.key === format) ?? formatOptions[0], [format])

  return (
    <section className="section demo-section" id="demo">
      <div className="container">
        <div className="section-heading split-heading" data-reveal>
          <div><span className="section-index">01 / SEE IT IN CONTEXT</span><h2>Build the workflow.<br /><em>Keep the document.</em></h2></div>
          <p>Give your users the document surface they need without sending them across a product boundary. Explore the same integration from three angles.</p>
        </div>
        <div className="demo-panel" data-reveal>
          <div className="demo-controls">
            <div className="control-group">
              <span className="control-label">FILE FORMAT</span>
              <div className="format-buttons" role="group" aria-label="File format">
                {formatOptions.map((item) => {
                  const Icon = item.icon
                  return <button className={`format-button ${format === item.key ? 'active' : ''}`} key={item.key} type="button" aria-pressed={format === item.key} onClick={() => setFormat(item.key)}><Icon size={15} /> <span>{item.label}</span></button>
                })}
              </div>
            </div>
            <div className="control-group control-group-mode">
              <span className="control-label">SURFACE MODE</span>
              <div className="mode-toggle" role="group" aria-label="Surface mode">
                <button type="button" className={mode === 'preview' ? 'active' : ''} aria-pressed={mode === 'preview'} onClick={() => setMode('preview')}><Eye size={14} /> Preview</button>
                <button type="button" className={mode === 'edit' ? 'active' : ''} aria-pressed={mode === 'edit'} onClick={() => setMode('edit')}><PenLine size={14} /> Edit</button>
              </div>
            </div>
          </div>
          <div className="demo-body">
            <div className="demo-preview-wrap">
              <div className="demo-preview-meta"><span className="preview-status"><span className="state-dot" /> {mode === 'edit' ? 'Editing session' : 'Preview session'}</span><span>{selected.description}</span></div>
              <DocumentPreview format={format} mode={mode} />
            </div>
            <div className="code-panel">
              <div className="code-panel-head"><span className="control-label">INTEGRATION SURFACE</span><span className="code-live"><span className="state-dot" /> Live example</span></div>
              <div className="code-tabs" role="tablist" aria-label="Code language">
                {(Object.keys(codeSamples) as CodeLanguage[]).map((item) => <button key={item} type="button" role="tab" aria-selected={language === item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item === 'javascript' ? 'JavaScript' : item[0].toUpperCase() + item.slice(1)}</button>)}
              </div>
              <pre><code>{codeSamples[language]}</code></pre>
              <div className="code-note"><Check size={13} /> The document surface follows your product state</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductSection() {
  return (
    <section className="section product-section" id="product">
      <div className="container">
        <div className="section-heading" data-reveal><span className="section-index">02 / WHAT YOU CAN SHIP</span><h2>Less glue code.<br /><em>More product surface.</em></h2><p>Office SDK gives teams a document layer they can embed, theme, and connect to the rules that already exist in their product.</p></div>
        <div className="feature-list">
          {features.map((feature) => <article className="feature-row" key={feature.number} data-reveal><span className="feature-number">{feature.number}</span><div className="feature-copy"><span className="feature-label">{feature.label}</span><h3>{feature.title}</h3><p>{feature.body}</p></div><ArrowUpRight className="feature-arrow" size={20} /></article>)}
        </div>
      </div>
    </section>
  )
}

function PlatformSection() {
  return (
    <section className="section platform-section" id="platform">
      <div className="container platform-grid">
        <div className="platform-copy" data-reveal><span className="section-index">03 / PLATFORM THINKING</span><h2>Integrate once.<br /><em>Make it yours.</em></h2><p>Document workflows sit at the intersection of content, permissions, and trust. Your SDK should respect all three.</p><a className="inline-link" href="#resources">Explore developer resources <ArrowRight size={16} /></a></div>
        <div className="platform-diagram" data-reveal="right">
          <div className="diagram-line line-one" /><div className="diagram-line line-two" />
          <div className="diagram-node node-app"><span className="node-icon"><Sparkles size={17} /></span><strong>Your product</strong><small>permissions · brand · workflow</small></div>
          <div className="diagram-node node-sdk"><span className="node-icon accent"><Braces size={17} /></span><strong>Office SDK</strong><small>view · edit · annotate · convert</small></div>
          <div className="diagram-node node-data"><span className="node-icon green"><LockKeyhole size={17} /></span><strong>Your data model</strong><small>storage · access · audit</small></div>
          <div className="diagram-caption"><span /> A document surface that respects your architecture</div>
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section className="section usecase-section" id="use-cases">
      <div className="container">
        <div className="section-heading split-heading" data-reveal><div><span className="section-index">04 / WHERE IT FITS</span><h2>Useful wherever<br /><em>documents move.</em></h2></div><p>From the first upload to the final approval, keep the content and the context in the same place.</p></div>
        <div className="usecase-grid">
          {useCases.map((item, index) => <article className="usecase-card" key={item.title} data-reveal style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}><span className="usecase-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.body}</p><a href="#demo" aria-label={`Explore ${item.title}`}><ArrowUpRight size={17} /></a></article>)}
        </div>
      </div>
    </section>
  )
}

function Resources() {
  const resources = [
    { icon: Code2, title: 'JavaScript API', body: 'Learn the integration surface and shape the editor around your app.' },
    { icon: Globe2, title: 'Format coverage', body: 'Map the files your users work with before you commit to a workflow.' },
    { icon: ShieldCheck, title: 'Deployment & security', body: 'Start the right conversation about data, access, and support.' },
  ]
  return (
    <section className="section resources-section" id="resources">
      <div className="container">
        <div className="resource-intro" data-reveal><span className="section-index">05 / START HERE</span><h2>Good integrations<br /><em>start with context.</em></h2><p>Use the docs, examples, and format guidance to make a confident technical decision before you write the first line of integration code.</p></div>
        <div className="resource-list">
          {resources.map(({ icon: Icon, title, body }) => <a className="resource-row" href="#demo" key={title} data-reveal><span className="resource-icon"><Icon size={18} /></span><span><strong>{title}</strong><small>{body}</small></span><ArrowUpRight size={18} /></a>)}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid"><div data-reveal><span className="section-index">06 / QUESTIONS, ANSWERED</span><h2>Make the next<br /><em>decision easier.</em></h2><p>Short answers for the questions teams ask before embedding a document layer.</p></div><div className="faq-list" data-reveal="right">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<ChevronDown size={17} /></summary><p>{faq.answer}</p></details>)}</div></div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer"><div className="container"><div className="footer-main"><div><Logo /><p>Document infrastructure for products that keep people moving.</p></div><div className="footer-links"><div><span>Explore</span><a href="#product">Product</a><a href="#platform">Platform</a><a href="#use-cases">Use cases</a></div><div><span>Developers</span><a href="#demo">Live demo</a><a href="#resources">API surface</a><a href="#faq">FAQ</a></div><div><span>Connect</span><a href="https://github.com/officesdk" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href="#resources">Documentation <ArrowUpRight size={13} /></a><a href="mailto:hello@officesdk.com">Contact <ArrowUpRight size={13} /></a></div></div></div><div className="footer-bottom"><span>© 2026 Office SDK. Built for document-heavy products.</span><span>Commercial SDK · Verify current terms before launch</span></div></div></footer>
  )
}

export default function App() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: 0.14 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return <div className="app-shell"><Header onStart={() => scrollTo('demo')} /><main><Hero /><DemoSection /><ProductSection /><PlatformSection /><UseCases /><Resources /><FAQ /><section className="final-cta"><div className="container final-cta-inner" data-reveal><div><span className="section-index">READY WHEN YOUR PRODUCT IS</span><h2>Give documents<br /><em>a better place to live.</em></h2></div><button className="button button-primary" type="button" onClick={() => scrollTo('demo')}>Explore the integration <ArrowRight size={17} /></button></div></section></main><Footer /></div>
}
