import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Eye,
  FileCheck2,
  FileOutput,
  GitBranch,
  Layers3,
  Mail,
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
  deploymentSignals,
  type DemoMode,
  type FormatKey,
  workflowThemes,
} from '../content'
import type { SeoPage } from '../seo'
import EditorCarousel from './EditorCarousel'

const GITHUB_ORGANIZATION = 'https://github.com/officesdk/'
const CONTACT_EMAIL = 'support@officesdk.com'
const TEABLE_FORM_ENDPOINT = 'https://app.teable.ai/api/share/shrCTDbeIDssy0polH9/view/form-submit'

const TEABLE_FIELD_IDS = {
  workEmail: 'fldcIso0zhxdNKe1aw6',
  name: 'fldubDYpgCYiPYy7kE9',
  needDescription: 'fldFprQw5ySKeLlmtcI',
} as const

const navItems = [
  { label: 'Product', href: '/' },
  { label: 'Formats', href: '/formats' },
  { label: 'Blog', href: '/blog' },
  { label: 'contact', href: '/contact' },
]

function Logo() {
  return (
    <a className="brand" href="/" aria-label="Office SDK home">
      <img className="brand-logo" src="/brand/office-sdk-logo.png" width="28" height="28" alt="" />
      <span>Office SDK</span>
    </a>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav id="primary-navigation" className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="header-icon-link" href={GITHUB_ORGANIZATION} target="_blank" rel="noopener noreferrer" aria-label="Office SDK on GitHub" aria-describedby="header-github-tooltip">
            <img className="header-github-icon" src="/brand/github.svg" width="19" height="19" alt="" />
            <span className="header-icon-tooltip" id="header-github-tooltip" role="tooltip">GitHub</span>
          </a>
          <a className="header-icon-link" href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Office SDK" aria-describedby="header-email-tooltip">
            <Mail size={19} strokeWidth={1.7} />
            <span className="header-icon-tooltip" id="header-email-tooltip" role="tooltip">{CONTACT_EMAIL}</span>
          </a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
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
            <div className="page-kicker">ILLUSTRATIVE SAMPLE / OFFICE WORKFLOW</div>
            <h3>Keep the file<br /><em>with the work.</em></h3>
            <p className="page-lede">A sample Office surface for products that keep a document beside the work around it.</p>
            <div className="page-rule" />
            <div className="page-columns"><span /><span /><span /></div>
            <div className="page-lines"><span /><span /><span /><span /><span /><span /></div>
            <div className="page-signature"><span /> <small>Illustrative sample</small></div>
          </div>}
          {format === 'xlsx' && <div className="xlsx-page">
            <div className="sheet-title">Illustrative workbook</div>
            <div className="sheet-grid">
              {['Region', 'Pipeline', 'Renewal', 'Forecast'].map((heading) => <strong key={heading}>{heading}</strong>)}
              {['North America', 'In review', '-', 'Confirm', 'EMEA', 'Draft', '-', 'Confirm', 'APAC', 'Ready', '-', 'Share', 'Expansion', 'Pending', '-', 'Review'].map((value, index) => <span className={index % 4 === 0 ? 'row-label' : ''} key={`${value}-${index}`}>{value}</span>)}
            </div>
            <div className="sheet-bars"><span style={{ height: '44%' }} /><span style={{ height: '72%' }} /><span style={{ height: '56%' }} /><span style={{ height: '86%' }} /><span style={{ height: '66%' }} /><span style={{ height: '94%' }} /></div>
          </div>}
          {format === 'pptx' && <div className="pptx-page">
            <div className="slide-kicker">ILLUSTRATIVE SAMPLE / PRESENTATION</div>
            <h3>One place<br />for <em>the next step.</em></h3>
            <div className="slide-shape shape-one" /><div className="slide-shape shape-two" /><div className="slide-caption">A sample workflow<br />for modern teams</div>
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

export function AudienceLine({ className = '' }: { className?: string }) {
  return (
    <p className={`hero-value-copy ${className}`}>
      <span className="hero-value-description">Collaborative web editors for AI agents, workflows, web apps and existing systems.</span>
      <span className="hero-value-visual" aria-hidden="true">
        <span className="hero-value-prefix">Collaborative web editors for</span>
        <span className="hero-audience-rotator">
          {['AI agents', 'workflows', 'web apps', 'existing systems'].map((audience, index) => (
            <span className="hero-audience-word" key={audience} style={{ '--audience-index': index } as CSSProperties}>{audience}</span>
          ))}
        </span>
      </span>
    </p>
  )
}

export function Hero() {
  return (
    <section className="hero editor-hero" id="top">
      <div className="container hero-content">
        <div className="hero-copy">
          <h1>Office SDK. <em>Built to connect.</em></h1>
          <div className="hero-summary">
            <AudienceLine />
            <p className="hero-deployment-note">
              <ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" />
              <span><strong>Self-hosted</strong> on your infrastructure.</span>
            </p>
          </div>
        </div>
        <EditorCarousel />
      </div>
    </section>
  )
}

export function HomeEvidence() {
  return (
    <section className="section seo-evidence home-evidence" aria-label="Office SDK workflow evidence">
      <div className="container">
        <div className="seo-definition"><span className="section-index">THE WORKING DEFINITION</span><p>Office SDK is an embedded web document surface for products that need Word, Excel, and PowerPoint work to stay beside the surrounding record, permissions, and business process.</p></div>
        <div className="seo-facts" aria-label="Office SDK scope facts">
          <div className="seo-fact"><strong>3 families:</strong><div><h2>Core Office families</h2><p>Start with Word, Excel, and PowerPoint files that users already bring to the workflow.</p></div></div>
          <div className="seo-fact"><strong>3 modes:</strong><div><h2>Common user actions</h2><p>Preview, edit, and review are separate experiences with separate acceptance checks.</p></div></div>
          <div className="seo-fact"><strong>4 stages:</strong><div><h2>Integration handoff</h2><p>Context, surface, callback, and result make ownership visible from open to save.</p></div></div>
        </div>
        <div className="seo-comparison"><span className="section-index">COMPARE THE WORKFLOW</span><h2>Choose the surface by the next action.</h2><div className="seo-table-wrap"><table><thead><tr><th>Next action</th><th>Document surface</th><th>Host product keeps</th></tr></thead><tbody><tr><td>Inspect a file</td><td>Preview</td><td>Identity, permission, and record context</td></tr><tr><td>Change content</td><td>Edit</td><td>Version owner and save destination</td></tr><tr><td>Move work forward</td><td>Review or import/export</td><td>Decision state and business result</td></tr></tbody></table></div></div>
        <div className="seo-evidence-bottom"><div className="seo-steps"><span className="section-index">START HERE</span><h2>Four checks before a build.</h2><ol><li>Name the user action and the business record around the file.</li><li>Map storage, permission, identity, and version ownership.</li><li>Run representative files through the browser and backend path.</li><li>Record the returned result and the owner of the next step.</li></ol></div><div className="seo-references"><span className="section-index">READ THE SCOPE</span><h2>Keep the boundary clear.</h2><ul><li><a href="/product">Product capability <ArrowUpRight size={14} /></a></li><li><a href="/product/core-editors">Core editor story <ArrowUpRight size={14} /></a></li><li><a href="/formats">Format coverage <ArrowUpRight size={14} /></a></li></ul></div></div>
      </div>
    </section>
  )
}

export function WorkflowThemes() {
  return (
    <section className="section themes-section" id="workflows">
      <div className="container">
        <div className="section-heading split-heading" data-reveal><div><span className="section-index">01 / START WITH THE JOB</span><h2>Search for the task.<br /><em>Find the product path.</em></h2></div><p>Office is a large category. Meet people at the problem they already describe, then give qualified teams a reason to evaluate the right document workflow.</p></div>
        <div className="theme-grid">{workflowThemes.map((theme, index) => <article className={`theme-card theme-${theme.accent}`} key={theme.title} data-reveal style={{ '--delay': `${index * 70}ms` } as CSSProperties}><div className="theme-top"><span className="theme-icon">{index === 0 ? <Eye size={17} /> : index === 1 ? <PenLine size={17} /> : index === 2 ? <FileOutput size={17} /> : <MessageSquare size={17} />}</span><span className="theme-eyebrow">{theme.eyebrow}</span></div><h3>{theme.title}</h3><p>{theme.body}</p><div className="theme-bottom"><span><Search size={13} /> {theme.query}</span><ArrowUpRight size={18} /></div></article>)}</div>
      </div>
    </section>
  )
}

export function ProductSection() {
  return (
    <section className="section product-section" id="product">
      <div className="container"><div className="section-heading" data-reveal><span className="section-index">02 / WHY OFFICE SDK</span><h2>Make the file part of the <em>product.</em></h2><p>When the document is where the work happens, your users should not have to leave the system that owns the workflow.</p></div><div className="feature-list">{capabilityRows.map((item) => <article className="feature-row" key={item.number} data-reveal><span className="feature-number">{item.number}</span><div className="feature-copy"><span className="feature-label">{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></div><ArrowUpRight className="feature-arrow" size={20} /></article>)}</div></div>
    </section>
  )
}

export function DeploymentSection() {
  return (
    <section className="section deployment-section" id="deployment">
      <div className="container deployment-layout">
        <div className="deployment-intro" data-reveal>
          <span className="section-index">05 / DEPLOYMENT FIT</span>
          <h2>Plan the rollout with a <em>known baseline.</em></h2>
          <p>Office SDK is designed to sit inside the web product that already owns users, files, permissions, and business data. Use the deployment baseline to frame the first technical conversation.</p>
          <a className="inline-link" href={`mailto:${CONTACT_EMAIL}?subject=Office%20SDK%20evaluation`}>
            Talk through your environment <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="deployment-list" data-reveal="right">
          {deploymentSignals.map((item) => <article className="deployment-row" key={item.label}><span className="deployment-label">{item.label}</span><strong>{item.value}</strong><p>{item.body}</p></article>)}
        </div>
      </div>
    </section>
  )
}

export function FormatsSection() {
  return (
    <section className="section formats-section" id="formats">
      <div className="container formats-layout"><div className="formats-intro" data-reveal><span className="section-index">03 / OFFICE FILE FORMATS</span><h2>Start with the files your users <em>already have.</em></h2><p>Use the format families below to frame the first conversation. Preview and editing support differ by format, so validate the exact behavior with your target files before committing to a production workflow.</p></div><div className="format-family-list" data-reveal="right">{fileFamilies.map((family) => <div className="format-family" key={family.name}><span className="format-family-dot" style={{ background: family.accent }} /><div><strong>{family.name}</strong><span>{family.formats}</span></div><ArrowUpRight size={16} /></div>)}<div className="format-note"><FileCheck2 size={16} /><span>Preview and editing coverage are stated separately so the product boundary stays clear.</span></div></div></div>
    </section>
  )
}

export function SolutionsSection() {
  return (
    <section className="section solutions-section" id="solutions">
      <div className="container"><div className="section-heading split-heading" data-reveal><div><span className="section-index">04 / WHERE IT FITS</span><h2>Useful wherever<br /><em>documents move.</em></h2></div><p>Use the first website to test high-intent Office workflows. The strongest ones become product pages, tools, and qualified conversations.</p></div><div className="solution-grid">{solutionCards.map((item, index) => <article className="solution-card" key={item.title} data-reveal style={{ '--delay': `${index * 70}ms` } as CSSProperties}><span className="solution-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.body}</p><a href="/solutions" aria-label={`Explore ${item.title}`}><ArrowUpRight size={17} /></a></article>)}</div></div>
    </section>
  )
}

export function ResourcesSection() {
  const resources = [
    { icon: GitBranch, title: 'Office SDK on GitHub', body: 'Explore Office SDK projects and repositories.', href: GITHUB_ORGANIZATION, external: true },
    { icon: BarChart3, title: 'Office format fit', body: 'Frame the preview and editing boundaries that matter to your users.', href: '#formats' },
    { icon: ShieldCheck, title: 'Evaluation conversation', body: 'Bring your workflow, data boundary, and deployment questions to the next discussion.', href: `mailto:${CONTACT_EMAIL}?subject=Office%20SDK%20evaluation` },
  ]
  return <section className="section resources-section" id="resources"><div className="container"><div className="resource-intro" data-reveal><span className="section-index">06 / NEXT STEP</span><h2>Start with a clear <em>product question.</em></h2><p>The first version of this site is an orientation layer. It helps the right visitor recognize a use case, see the Office surface, and choose the next proof point.</p></div><div className="resource-list">{resources.map(({ icon: Icon, title, body, href, external }) => <a className="resource-row" href={href} key={title} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} data-reveal><span className="resource-icon"><Icon size={18} /></span><span><strong>{title}</strong><small>{body}</small></span><ArrowUpRight size={18} /></a>)}</div></div></section>
}

export function FAQ() {
  return <section className="section faq-section" id="faq"><div className="container faq-grid"><div data-reveal><span className="section-index">07 / QUESTIONS, ANSWERED</span><h2>Make the next <em>decision easier.</em></h2><p>Short, honest answers for teams deciding whether an Office workflow belongs inside their product.</p></div><div className="faq-list" data-reveal="right">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<ChevronDown size={17} /></summary><p>{faq.answer}</p></details>)}</div></div></section>
}

type ContactValues = {
  workEmail: string
  name: string
  needDescription: string
  website: string
}

const emptyContactValues: ContactValues = {
  workEmail: '',
  name: '',
  needDescription: '',
  website: '',
}

const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

function contactEmailError(email: string) {
  if (!email.trim()) return 'Work email is required.'
  if (!CONTACT_EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address, such as you@company.com.'
  return ''
}

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(emptyContactValues)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [emailTouched, setEmailTouched] = useState(false)
  const emailError = emailTouched ? contactEmailError(values.workEmail) : ''

  const update = (field: keyof ContactValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (status === 'error') setStatus('idle')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    // The honeypot is intentionally silent: bots receive the same success UI,
    // but no lead is sent to the internal table.
    if (values.website.trim()) {
      setStatus('success')
      return
    }

    if (contactEmailError(values.workEmail)) {
      setEmailTouched(true)
      event.currentTarget.querySelector<HTMLInputElement>('#contact-email')?.focus()
      return
    }

    setStatus('submitting')
    const params = new URLSearchParams(window.location.search)
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      .map((key) => `${key}=${params.get(key) ?? ''}`)
      .filter((item) => !item.endsWith('='))
      .join('&')
    const attribution = [
      values.needDescription.trim(),
      `Page: ${window.location.href}`,
      `Referrer: ${document.referrer || 'unknown'}`,
      `UTM: ${utm || 'none'}`,
    ].join('\n\n')

    const rawFields: Record<string, string> = {
      [TEABLE_FIELD_IDS.workEmail]: values.workEmail.trim(),
      [TEABLE_FIELD_IDS.name]: values.name.trim(),
      [TEABLE_FIELD_IDS.needDescription]: attribution,
    }
    const fields = Object.fromEntries(Object.entries(rawFields).filter(([, value]) => value !== ''))

    try {
      const response = await fetch(TEABLE_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, typecast: true }),
      })
      if (response.status !== 201) throw new Error(`Teable returned ${response.status}`)
      setStatus('success')
      setValues(emptyContactValues)
      setEmailTouched(false)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <div className="contact-success" role="status"><span className="success-icon"><Check size={20} /></span><h2>Thanks for reaching out.</h2><p>We've received your inquiry and will reply by email.</p><button className="button button-ghost" type="button" onClick={() => { setStatus('idle'); setEmailTouched(false) }}>Send another inquiry <ArrowRight size={16} /></button></div>
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit} aria-labelledby="contact-form-heading" aria-busy={status === 'submitting'}>
      <div className="contact-form-heading"><h2 className="section-index" id="contact-form-heading">Let's talk</h2><p>Only your work email is required.</p></div>
      <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)} /></label>
      <fieldset className="form-grid" disabled={status === 'submitting'}>
        <label htmlFor="contact-name">Name (optional)<input id="contact-name" name="name" autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" /></label>
        <div className="contact-email-field">
          <label htmlFor="contact-email">Work email<input id="contact-email" name="email" type="email" autoComplete="email" required value={values.workEmail} onChange={(event) => update('workEmail', event.target.value)} onBlur={() => { if (values.workEmail.trim()) setEmailTouched(true) }} placeholder="you@company.com" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'contact-email-error' : undefined} /></label>
          {emailError && <p className="contact-email-error" id="contact-email-error" role="alert">{emailError}</p>}
        </div>
        <label htmlFor="contact-description">What are you working on? (optional)<textarea id="contact-description" name="description" rows={5} value={values.needDescription} onChange={(event) => update('needDescription', event.target.value)} placeholder="A sentence or two is enough." /></label>
      </fieldset>
      {status === 'error' && <p className="form-error" role="alert">We couldn't send your inquiry. Please try again or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}
      <div className="form-footer"><button className="button button-primary" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending...' : 'Send inquiry'} <ArrowUpRight size={16} /></button></div>
    </form>
  )
}

export function SeoPageView({ page, children }: { page: SeoPage; children?: ReactNode }) {
  const isContact = page.path === '/contact'
  const reviewedAt = new Date(`${page.reviewedAt}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return (
    <>
      <section className="seo-page-hero">
        <div className="seo-grid" aria-hidden="true" />
        <div className="container seo-page-hero-inner">
          <div className="seo-page-copy"><span className="eyebrow"><span className="eyebrow-line" /> {page.eyebrow}</span><h1>{page.h1}</h1><p>{page.intro}</p><div className="hero-actions"><a className="button button-primary" href={isContact ? '#contact-form' : '/contact'}>{isContact ? 'Start the conversation' : 'Talk to engineering'} <ArrowRight size={16} /></a>{page.path === '/product' && <a className="button button-dark-ghost" href="/product/core-editors">See four editors in one story <ArrowUpRight size={16} /></a>}</div></div>
          <div className="seo-page-visual"><div className="visual-label"><span className="pulse-dot" /> OFFICE SDK / {page.eyebrow}</div><DocumentPreview format={page.path === '/formats' ? 'xlsx' : page.path === '/solutions' ? 'pptx' : 'docx'} mode={page.path === '/product' ? 'edit' : 'preview'} compact /><div className="seo-visual-note"><Workflow size={15} /><span>Product context <strong>→</strong> Office surface <strong>→</strong> business result</span></div></div>
        </div>
      </section>
      <section className="section seo-proof-section"><div className="container seo-proof-grid"><div><span className="section-index">A CLEAR BOUNDARY</span><h2>Useful detail for the next <em>technical question.</em></h2><p>Use these pages to decide which workflow, format, and ownership boundary should be validated first.</p></div><div className="seo-proof-list"><div><Check size={15} /><span>Your system keeps file storage and permissions.</span></div><div><Check size={15} /><span>Preview, edit, review, import, and export are separate decisions.</span></div><div><Check size={15} /><span>Callbacks and SDK surfaces connect the document to your product.</span></div></div></div></section>
      <section className="section seo-sections"><div className="container"><div className="seo-section-list">{page.sections.map((section, index) => <article className="seo-section-row" key={section.title}><span className="seo-section-number">{String(index + 1).padStart(2, '0')}</span><div><span className="section-index">{section.label}</span><h2>{section.title}</h2><p>{section.body}</p></div><ArrowUpRight size={19} /></article>)}</div></div></section>
      {page.evidence && <section className="section seo-evidence" aria-label="Evidence for evaluating this page">
        <div className="container">
          <div className="seo-definition"><div className="seo-definition-meta"><span className="section-index">IN ONE SENTENCE</span><time dateTime={page.reviewedAt}>Reviewed {reviewedAt}</time></div><p>{page.evidence.definition}</p></div>
          <div className="seo-facts" aria-label="Verified scope facts">
            {page.evidence.facts.map((fact) => <div className="seo-fact" key={`${fact.value}-${fact.label}`}><strong>{fact.value}:</strong><div><h2>{fact.label}</h2><p>{fact.detail}</p></div></div>)}
          </div>
          {page.evidence.comparison && <div className="seo-comparison">
            <span className="section-index">COMPARE THE BOUNDARY</span>
            <h2>{page.evidence.comparison.title}</h2>
            <div className="seo-table-wrap"><table><thead><tr>{page.evidence.comparison.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{page.evidence.comparison.rows.map((row) => <tr key={row.join('|')}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>
          </div>}
          {page.evidence.notes && <div className="seo-evidence-notes">{page.evidence.notes.map((note) => <article key={note.title}><h2>{note.title}</h2><p>{note.body}</p></article>)}</div>}
          <div className="seo-evidence-bottom">
            <div className="seo-steps"><span className="section-index">APPLY THE GUIDANCE</span><h2>Four checks before the next decision.</h2><ol>{page.evidence.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
            <div className="seo-references"><span className="section-index">RELATED STANDARDS AND CONTEXT</span><h2>Review the supporting material.</h2><ul>{page.evidence.references.map((reference) => <li key={reference.url}><a href={reference.url} target={reference.url.startsWith('http') ? '_blank' : undefined} rel={reference.url.startsWith('http') ? 'noreferrer' : undefined}>{reference.label}<ArrowUpRight size={14} /></a></li>)}</ul></div>
          </div>
        </div>
      </section>}
      {children}
      <section className="section seo-next-step"><div className="container"><span className="section-index">KEEP EXPLORING</span><h2>Choose the next proof point.</h2><div className="seo-link-rail"><a href="/product">Product capability <ArrowUpRight size={16} /></a><a href="/formats">Format boundary <ArrowUpRight size={16} /></a><a href="/solutions">Solution fit <ArrowUpRight size={16} /></a><a href="/deployment">Deployment fit <ArrowUpRight size={16} /></a></div></div></section>
    </>
  )
}

export function FinalCTA() {
  return <section className="final-cta"><div className="container final-cta-inner" data-reveal><div><span className="section-index">READY TO TEST THE FIT?</span><h2>Put the Office file<br /><em>where the work is.</em></h2><p>Choose a workflow, bring the files that matter, and plan a focused evaluation with the Office SDK team.</p></div><div className="final-cta-actions"><a className="button button-primary" href={`mailto:${CONTACT_EMAIL}?subject=Office%20SDK%20evaluation`}>Contact Office SDK <ArrowUpRight size={17} /></a><a className="button button-dark-ghost" href="/product/core-editors">See the editors <ArrowRight size={17} /></a></div></div></section>
}

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-main"><div><Logo /><p>Office file workflows for products that keep people moving.</p><a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div><div className="footer-links"><div><span>Explore</span><a href="/product">Product</a><a href="/product/core-editors">Core editor story</a><a href="/formats">Formats</a><a href="/solutions">Solutions</a><a href="/deployment">Deployment</a></div><div><span>Evaluate</span><a href="/blog">Blog</a><a href={GITHUB_ORGANIZATION} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href="/#faq">FAQ</a></div><div><span>Office SDK</span><a href="/">Back to home <ArrowUpRight size={13} /></a><a href="/contact">Start an evaluation <ArrowUpRight size={13} /></a></div></div></div><div className="footer-bottom"><span>© 2026 Office SDK</span><span>Office document workflows for web products</span></div></div></footer>
}
