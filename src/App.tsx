import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Eye,
  FileCheck2,
  FileOutput,
  Layers3,
  Menu,
  MessageSquare,
  PenLine,
  Search,
  ShieldCheck,
  Upload,
  Workflow,
  X,
} from 'lucide-react'
import {
  capabilityRows,
  faqs,
  fileFamilies,
  formatOptions,
  modeOptions,
  solutionCards,
  type DemoMode,
  type FormatKey,
  workflowThemes,
} from './content'

const API_REFERENCE = 'https://officesdk.apifox.cn/'

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Workflows', href: '#workflows' },
  { label: 'Formats', href: '#formats' },
  { label: 'Solutions', href: '#solutions' },
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Office SDK home">
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span>Office SDK</span>
    </a>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a className="mobile-nav-cta" href="#demo" onClick={() => setMenuOpen(false)}>See the workflow <ArrowUpRight size={15} /></a>
        </nav>
        <div className="header-actions">
          <a className="text-link header-reference" href={API_REFERENCE} target="_blank" rel="noreferrer">API reference <ArrowUpRight size={15} /></a>
          <a className="button button-small button-primary" href="#demo">See the demo <ArrowRight size={15} /></a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
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
  const modeLabel = modeOptions.find((item) => item.key === mode)?.label ?? 'Preview'

  return (
    <div className={`document-shell ${compact ? 'document-shell-compact' : ''}`} style={{ '--format-accent': selected.accent } as CSSProperties}>
      <div className="document-toolbar">
        <div className="document-file">
          <span className="file-icon"><Icon size={16} strokeWidth={1.8} /></span>
          <div><strong>{selected.title}</strong><span>{selected.extension} · {modeLabel.toLowerCase()} surface</span></div>
        </div>
        <div className="toolbar-state"><span className="state-dot" /> {modeLabel}</div>
      </div>
      <div className="document-workspace">
        <div className="document-ruler"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
        <div className="document-page">
          {format === 'docx' && <div className="docx-page">
            <div className="page-kicker">OFFICE SDK / WORKFLOW BRIEF</div>
            <h3>Keep the file<br /><em>with the work.</em></h3>
            <p className="page-lede">A familiar Office surface for products that need to move a document from upload to decision.</p>
            <div className="page-rule" />
            <div className="page-columns"><span /><span /><span /></div>
            <div className="page-lines"><span /><span /><span /><span /><span /><span /></div>
            <div className="page-signature"><span /> <small>Office SDK workflow</small></div>
          </div>}
          {format === 'xlsx' && <div className="xlsx-page">
            <div className="sheet-title">Q3 revenue planning</div>
            <div className="sheet-grid">
              {['Region', 'Pipeline', 'Renewal', 'Forecast'].map((heading) => <strong key={heading}>{heading}</strong>)}
              {['North America', '$1.28M', '94%', '$1.17M', 'EMEA', '$820K', '91%', '$742K', 'APAC', '$610K', '88%', '$538K', 'Expansion', '$2.71M', '92%', '$2.45M'].map((value, index) => <span className={index % 4 === 0 ? 'row-label' : ''} key={`${value}-${index}`}>{value}</span>)}
            </div>
            <div className="sheet-bars"><span style={{ height: '44%' }} /><span style={{ height: '72%' }} /><span style={{ height: '56%' }} /><span style={{ height: '86%' }} /><span style={{ height: '66%' }} /><span style={{ height: '94%' }} /></div>
          </div>}
          {format === 'pptx' && <div className="pptx-page">
            <div className="slide-kicker">OFFICE SDK / PRESENTATION</div>
            <h3>One place<br />for <em>the next step.</em></h3>
            <div className="slide-shape shape-one" /><div className="slide-shape shape-two" /><div className="slide-caption">A product narrative<br />for modern teams</div>
          </div>}
        </div>
        <div className="document-side-tools">
          <button type="button" aria-label="Preview tool" className={mode === 'preview' ? 'active' : ''}><Eye size={15} /></button>
          <button type="button" aria-label="Edit tool" className={mode === 'edit' ? 'active' : ''}><PenLine size={15} /></button>
          <button type="button" aria-label="Review tool" className={mode === 'review' ? 'active' : ''}><MessageSquare size={15} /></button>
        </div>
        {mode === 'review' && <div className="review-pin"><MessageSquare size={12} /> 3 workflow notes</div>}
      </div>
      <div className="document-footer"><span>Document surface</span><span>{modeLabel}</span><span>{selected.extension}</span></div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> Office file workflows</div>
          <h1>Build Office workflows into the products people <em>already use.</em></h1>
          <p>Office SDK gives your product a practical document surface for previewing and editing Word, Excel, and PowerPoint files while your system keeps control of storage, permissions, and the workflow around them.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#demo">Explore the workflow <ArrowRight size={17} /></a>
            <a className="button button-ghost" href={API_REFERENCE} target="_blank" rel="noreferrer">Check the API reference <ArrowUpRight size={16} /></a>
          </div>
          <div className="hero-note"><span className="note-check"><Check size={13} /></span> Start with the Office task. Confirm the exact integration when you are ready.</div>
        </div>
        <div className="hero-visual" data-reveal="right">
          <div className="visual-label label-top"><span className="pulse-dot" /> OFFICE WORKFLOW</div>
          <DocumentPreview format="docx" mode="edit" compact />
          <div className="visual-float float-api"><Workflow size={14} /><span><strong>Preview · edit · connect</strong><small>one product surface</small></span></div>
          <div className="visual-float float-format"><Layers3 size={14} /><span><strong>DOCX · XLSX · PPTX</strong><small>start with your files</small></span></div>
        </div>
      </div>
      <div className="hero-bottom container"><span>Office SDK / overseas product entry</span><div className="format-rail"><span>VIEW</span><i className="format-dot format-dot-word" /><span>EDIT</span><i className="format-dot format-dot-excel" /><span>CONNECT</span><i className="format-dot format-dot-powerpoint" /><span>WORKFLOW</span></div></div>
    </section>
  )
}

function WorkflowDemo() {
  const [format, setFormat] = useState<FormatKey>('docx')
  const [mode, setMode] = useState<DemoMode>('preview')
  const selectedFormat = useMemo(() => formatOptions.find((item) => item.key === format) ?? formatOptions[0], [format])
  const selectedMode = useMemo(() => modeOptions.find((item) => item.key === mode) ?? modeOptions[0], [mode])

  return (
    <section className="section demo-section" id="demo">
      <div className="container">
        <div className="section-heading split-heading" data-reveal>
          <div><span className="section-index">01 / SEE THE WORKFLOW</span><h2>One file.<br /><em>More ways forward.</em></h2></div>
          <p>Switch between real product moments: open a file, make a change, or keep a review moving. This is the experience to align before choosing an integration path.</p>
        </div>
        <div className="demo-panel" data-reveal>
          <div className="demo-controls">
            <div className="control-group"><span className="control-label">OFFICE FILE</span><div className="format-buttons" role="group" aria-label="Office file format">
              {formatOptions.map((item) => { const Icon = item.icon; return <button className={`format-button ${format === item.key ? 'active' : ''}`} key={item.key} type="button" aria-pressed={format === item.key} onClick={() => setFormat(item.key)}><Icon size={15} /><span>{item.label}</span></button> })}
            </div></div>
            <div className="control-group control-group-mode"><span className="control-label">WORKFLOW MOMENT</span><div className="mode-toggle" role="group" aria-label="Workflow moment">
              {modeOptions.map((item) => <button type="button" key={item.key} className={mode === item.key ? 'active' : ''} aria-pressed={mode === item.key} onClick={() => setMode(item.key)}>{item.key === 'preview' ? <Eye size={14} /> : item.key === 'edit' ? <PenLine size={14} /> : <MessageSquare size={14} />} {item.label}</button>)}
            </div></div>
          </div>
          <div className="demo-body">
            <div className="demo-preview-wrap"><div className="demo-preview-meta"><span className="preview-status"><span className="state-dot" /> {selectedMode.label} surface</span><span>{selectedFormat.description}</span></div><DocumentPreview format={format} mode={mode} /></div>
            <div className="workflow-summary"><span className="summary-kicker">WHAT THIS SURFACE IS FOR</span><h3>{selectedMode.label} {selectedFormat.label} files in context.</h3><p>{selectedMode.description}</p><div className="summary-list"><span><Check size={14} /> Product context stays nearby</span><span><Check size={14} /> File format is visible up front</span><span><Check size={14} /> Exact support can be confirmed before launch</span></div><a className="inline-link" href={API_REFERENCE} target="_blank" rel="noreferrer">Open the current API reference <ArrowUpRight size={16} /></a></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowThemes() {
  return (
    <section className="section themes-section" id="workflows">
      <div className="container">
        <div className="section-heading split-heading" data-reveal><div><span className="section-index">02 / START WITH THE JOB</span><h2>Search for the task.<br /><em>Find the product path.</em></h2></div><p>Office is a large category. Meet people at the problem they already describe, then give qualified teams a reason to evaluate the right document workflow.</p></div>
        <div className="theme-grid">{workflowThemes.map((theme, index) => <article className={`theme-card theme-${theme.accent}`} key={theme.title} data-reveal style={{ '--delay': `${index * 70}ms` } as CSSProperties}><div className="theme-top"><span className="theme-icon">{index === 0 ? <Eye size={17} /> : index === 1 ? <PenLine size={17} /> : index === 2 ? <FileOutput size={17} /> : <MessageSquare size={17} />}</span><span className="theme-eyebrow">{theme.eyebrow}</span></div><h3>{theme.title}</h3><p>{theme.body}</p><div className="theme-bottom"><span><Search size={13} /> {theme.query}</span><ArrowUpRight size={18} /></div></article>)}</div>
      </div>
    </section>
  )
}

function ProductSection() {
  return (
    <section className="section product-section" id="product">
      <div className="container"><div className="section-heading" data-reveal><span className="section-index">03 / WHY OFFICE SDK</span><h2>Make the file part of the <em>product.</em></h2><p>When the document is where the work happens, your users should not have to leave the system that owns the workflow.</p></div><div className="feature-list">{capabilityRows.map((item) => <article className="feature-row" key={item.number} data-reveal><span className="feature-number">{item.number}</span><div className="feature-copy"><span className="feature-label">{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></div><ArrowUpRight className="feature-arrow" size={20} /></article>)}</div></div>
    </section>
  )
}

function FormatsSection() {
  return (
    <section className="section formats-section" id="formats">
      <div className="container formats-layout"><div className="formats-intro" data-reveal><span className="section-index">04 / OFFICE FILE FORMATS</span><h2>Start with the files your users <em>already have.</em></h2><p>Use the format families below to frame the first conversation. Preview and editing support differ by format, so confirm the exact behavior in the current API reference before committing to a production workflow.</p><a className="inline-link" href={API_REFERENCE} target="_blank" rel="noreferrer">Review current format details <ArrowRight size={16} /></a></div><div className="format-family-list" data-reveal="right">{fileFamilies.map((family) => <div className="format-family" key={family.name}><span className="format-family-dot" style={{ background: family.accent }} /><div><strong>{family.name}</strong><span>{family.formats}</span></div><ArrowUpRight size={16} /></div>)}<div className="format-note"><FileCheck2 size={16} /><span>Preview and editing coverage are stated separately so the product boundary stays clear.</span></div></div></div>
    </section>
  )
}

function SolutionsSection() {
  return (
    <section className="section solutions-section" id="solutions">
      <div className="container"><div className="section-heading split-heading" data-reveal><div><span className="section-index">05 / WHERE IT FITS</span><h2>Useful wherever<br /><em>documents move.</em></h2></div><p>Use the first website to test high-intent Office workflows. The strongest ones become product pages, tools, and qualified conversations.</p></div><div className="solution-grid">{solutionCards.map((item, index) => <article className="solution-card" key={item.title} data-reveal style={{ '--delay': `${index * 70}ms` } as CSSProperties}><span className="solution-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.body}</p><a href="#demo" aria-label={`Explore ${item.title}`}><ArrowUpRight size={17} /></a></article>)}</div></div>
    </section>
  )
}

function ResourcesSection() {
  const resources = [
    { icon: BookOpen, title: 'Current API reference', body: 'Use the maintained reference when you need exact endpoints, fields, and parameters.', href: API_REFERENCE, external: true },
    { icon: BarChart3, title: 'Office format fit', body: 'Frame the preview and editing boundaries that matter to your users.', href: '#formats' },
    { icon: ShieldCheck, title: 'Evaluation conversation', body: 'Bring your workflow, data boundary, and deployment questions to the next discussion.', href: '#faq' },
  ]
  return <section className="section resources-section" id="resources"><div className="container"><div className="resource-intro" data-reveal><span className="section-index">06 / NEXT STEP</span><h2>Start with a clear <em>product question.</em></h2><p>The first version of this site is an orientation layer. It helps the right visitor recognize a use case, see the Office surface, and choose the next proof point.</p></div><div className="resource-list">{resources.map(({ icon: Icon, title, body, href, external }) => <a className="resource-row" href={href} key={title} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} data-reveal><span className="resource-icon"><Icon size={18} /></span><span><strong>{title}</strong><small>{body}</small></span><ArrowUpRight size={18} /></a>)}</div></div></section>
}

function FAQ() {
  return <section className="section faq-section" id="faq"><div className="container faq-grid"><div data-reveal><span className="section-index">07 / QUESTIONS, ANSWERED</span><h2>Make the next <em>decision easier.</em></h2><p>Short, honest answers for teams deciding whether an Office workflow belongs inside their product.</p></div><div className="faq-list" data-reveal="right">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<ChevronDown size={17} /></summary><p>{faq.answer}</p></details>)}</div></div></section>
}

function FinalCTA() {
  return <section className="final-cta"><div className="container final-cta-inner" data-reveal><div><span className="section-index">READY TO TEST THE FIT?</span><h2>Put the Office file<br /><em>where the work is.</em></h2><p>Choose a workflow, bring the files that matter, and use the current reference to plan the next technical step.</p></div><div className="final-cta-actions"><a className="button button-primary" href={API_REFERENCE} target="_blank" rel="noreferrer">Explore Office SDK <ArrowUpRight size={17} /></a><a className="button button-dark-ghost" href="#demo">See the workflow <ArrowRight size={17} /></a></div></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-main"><div><Logo /><p>Office file workflows for products that keep people moving.</p></div><div className="footer-links"><div><span>Explore</span><a href="#product">Product</a><a href="#workflows">Workflows</a><a href="#formats">Formats</a><a href="#solutions">Solutions</a></div><div><span>Evaluate</span><a href="#demo">Workflow demo</a><a href={API_REFERENCE} target="_blank" rel="noreferrer">API reference <ArrowUpRight size={13} /></a><a href="#faq">FAQ</a></div><div><span>Office SDK</span><a href="#top">Back to top <ArrowUpRight size={13} /></a><a href={API_REFERENCE} target="_blank" rel="noreferrer">Start an evaluation <ArrowUpRight size={13} /></a></div></div></div><div className="footer-bottom"><span>© 2026 Office SDK</span><span>Marketing site / verify current terms and availability before launch</span></div></div></footer>
}

export default function App() {
  return <div className="app-shell"><Header /><main><Hero /><WorkflowDemo /><WorkflowThemes /><ProductSection /><FormatsSection /><SolutionsSection /><ResourcesSection /><FAQ /><FinalCTA /></main><Footer /></div>
}
