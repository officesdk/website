import type { CSSProperties, ComponentType } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Gauge,
  GitBranch,
  MessageSquare,
  Presentation,
  ShieldCheck,
  Workflow,
} from 'lucide-react'

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>

type EditorChapter = {
  id: string
  number: string
  eyebrow: string
  title: string
  body: string
  image: string
  imageAlt: string
  accent: string
  icon: Icon
  proof: string
  facts: Array<{ value: string; label: string }>
}

const chapters: EditorChapter[] = [
  {
    id: 'context',
    number: '01',
    eyebrow: 'CONTEXT / NOTES + MARKDOWN',
    title: 'Turn research into a shared working context.',
    body: 'The workspace holds the launch brief, interviews, requirements, Mermaid flows, API responsibility notes, meeting decisions, and the operations runbook in one editable record. The team can move from an observation to a decision without losing the thread.',
    image: '/product/core-editors/markdown-editor.png',
    imageAlt: 'Northstar Atlas workspace open in the Markdown and notes editor, with the table of contents and launch planning content visible.',
    accent: '#2e7775',
    icon: FileText,
    proof: 'Template evidence: linked sections, tables, code, equations, checklists, and seven Mermaid definitions.',
    facts: [
      { value: 'Research', label: 'observations to requirements' },
      { value: 'Mermaid', label: 'flows beside the decision' },
      { value: 'Runbook', label: 'operating detail stays close' },
    ],
  },
  {
    id: 'plan',
    number: '02',
    eyebrow: 'PLAN / WORD DOCUMENT',
    title: 'Turn an approved direction into a formal proposal.',
    body: 'The Word proposal turns the same evidence into a decision document for the Germany and Japan pilot. Comments, revisions, footnotes, tables, commercial terms, and release gates give reviewers a precise version to approve.',
    image: '/product/core-editors/word-editor.png',
    imageAlt: 'Northstar Market Expansion Proposal open in the Word editor with the document outline and editing toolbar visible.',
    accent: '#356ea8',
    icon: FileText,
    proof: 'Template evidence: 10 pages, 10 tables, one chart, four comments, one tracked revision, three footnotes, and 14 content controls.',
    facts: [
      { value: '$240k', label: 'proposed pilot budget' },
      { value: 'DE + JP', label: 'controlled first markets' },
      { value: 'Gated', label: 'release evidence before scale' },
    ],
  },
  {
    id: 'operate',
    number: '03',
    eyebrow: 'OPERATE / EXCEL WORKBOOK',
    title: 'Turn a plan into numbers people can operate.',
    body: 'The workbook connects monthly records to a regional review, channel matrix, forecast, launch tracker, operations build, and intake queue. It gives the team a shared place to test assumptions and keep the next action visible.',
    image: '/product/core-editors/excel-editor.png',
    imageAlt: 'Northstar Operations workbook open in the spreadsheet editor with Q3 metrics, charts, and operating tables visible.',
    accent: '#25845b',
    icon: FileSpreadsheet,
    proof: 'Template evidence: seven sheets, 834 formulas, five charts, two tables, one PivotTable, 13 validation rules, and grouped rows.',
    facts: [
      { value: '$1.26m', label: 'illustrative Q3 revenue' },
      { value: '57.7%', label: 'illustrative gross margin' },
      { value: '36', label: 'monthly source records' },
    ],
  },
  {
    id: 'align',
    number: '04',
    eyebrow: 'ALIGN / POWERPOINT REVIEW',
    title: 'Turn operating detail into a decision-ready review.',
    body: 'The quarterly review condenses the same story into a leadership conversation: performance, launch readiness, risks, release gates, and a clear decision request. Charts and tables carry the numbers forward while speaker notes preserve the narrative.',
    image: '/product/core-editors/powerpoint-editor.png',
    imageAlt: 'Northstar quarterly business review open in the presentation editor with slide thumbnails, editing controls, and the 11-slide count visible.',
    accent: '#a94d2d',
    icon: Presentation,
    proof: 'Template evidence: 11 slides, two charts, three tables, and speaker notes on every slide.',
    facts: [
      { value: '11', label: 'slides in the review' },
      { value: '2 + 3', label: 'charts and tables in the deck' },
      { value: '1', label: 'decision request for the room' },
    ],
  },
]

const storyMetrics = [
  { value: '1', label: 'shared launch story' },
  { value: '4', label: 'editor surfaces' },
  { value: '2', label: 'pilot markets' },
  { value: '$240k', label: 'proposed staged budget' },
]

function EvidenceLabel({ children }: { children: string }) {
  return <span className="core-story-evidence"><Check size={13} strokeWidth={2.4} /> {children}</span>
}

function ChapterIcon({ icon: Icon, accent }: { icon: Icon; accent: string }) {
  return <span className="core-story-icon" style={{ '--chapter-accent': accent } as CSSProperties}><Icon size={18} strokeWidth={1.8} /></span>
}

export function CoreEditorsBand() {
  return (
    <section className="core-editors-band" id="core-editors-story">
      <div className="container">
        <div className="core-band-heading">
          <div>
            <span className="section-index">PRODUCT STORY / FOUR EDITORS</span>
            <h2>One launch.<br /><em>Four editors.</em></h2>
          </div>
          <div>
            <p>See how one illustrative launch moves from research to proposal, operating numbers, and an executive decision without leaving the document workflow.</p>
            <a className="inline-link" href="/product/core-editors">Open the full product story <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className="core-band-steps">
          {chapters.map((chapter) => {
            const Icon = chapter.icon
            return (
              <a className="core-band-step" href={`/product/core-editors#${chapter.id}`} key={chapter.id} style={{ '--chapter-accent': chapter.accent } as CSSProperties}>
                <div className="core-band-step-top"><span>{chapter.number}</span><Icon size={17} strokeWidth={1.8} /></div>
                <img className="core-band-step-preview" src={chapter.image} alt={chapter.imageAlt} width="1920" height="1080" loading="lazy" />
                <strong>{chapter.eyebrow.split(' / ')[1]}</strong>
                <span>{chapter.title}</span>
                <ArrowUpRight className="core-band-step-arrow" size={16} />
              </a>
            )
          })}
        </div>
        <div className="core-band-foot"><EvidenceLabel>Privacy-redacted product screenshots with the imported templates open</EvidenceLabel><span>Northstar data is illustrative.</span></div>
      </div>
    </section>
  )
}

function StoryHero() {
  return (
    <section className="core-story-hero">
      <div className="core-story-grid" aria-hidden="true" />
      <div className="container core-story-hero-inner">
        <div className="core-story-hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> PRODUCT STORY / FOUR EDITORS</span>
          <h1>One launch.<br /><em>Four editors.</em><br />A workflow that stays together.</h1>
          <p>Northstar is a fictional outdoor brand preparing a controlled Germany and Japan pilot. Follow the same decision through notes and Markdown, Word, Excel, and PowerPoint to see where each editor creates leverage.</p>
          <div className="core-story-hero-actions">
            <a className="button button-primary" href="#editor-story">Follow the story <ArrowRight size={16} /></a>
            <a className="button button-dark-ghost" href="#integration-boundary">See the integration boundary <ArrowUpRight size={16} /></a>
          </div>
          <div className="core-story-hero-notes"><EvidenceLabel>Privacy-redacted product interface</EvidenceLabel><span>Illustrative business scenario</span></div>
        </div>
        <figure className="core-story-hero-figure">
          <div className="core-story-figure-label"><span className="pulse-dot" /> CONTEXT / MARKDOWN</div>
          <img src="/product/core-editors/markdown-editor.png" alt="The Northstar Atlas workspace in a privacy-redacted Markdown and notes editor interface." width="1920" height="1080" fetchPriority="high" />
          <figcaption>Research, requirements, diagrams, and runbook in one working context.</figcaption>
        </figure>
      </div>
      <div className="container core-story-metrics-note">ILLUSTRATIVE NORTHSTAR METRICS</div>
      <div className="container core-story-metrics" aria-label="Illustrative Northstar story metrics">
        {storyMetrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
      </div>
    </section>
  )
}

function ChapterRail() {
  return (
    <nav className="core-story-rail" aria-label="Core editor story chapters">
      <span className="core-story-rail-label">THE THREAD</span>
      {chapters.map((chapter) => <a href={`#${chapter.id}`} key={chapter.id}><span>{chapter.number}</span>{chapter.eyebrow.split(' / ')[0]}</a>)}
      <a href="#integration-boundary"><span>05</span>Boundary</a>
    </nav>
  )
}

function Chapter({ chapter }: { chapter: EditorChapter }) {
  const Icon = chapter.icon
  return (
    <article className="core-story-chapter" id={chapter.id} style={{ '--chapter-accent': chapter.accent } as CSSProperties}>
      <div className="core-story-chapter-heading">
        <div className="core-story-chapter-index"><span>{chapter.number}</span><ChapterIcon icon={Icon} accent={chapter.accent} /></div>
        <div><span className="section-index" style={{ color: chapter.accent }}>{chapter.eyebrow}</span><h2>{chapter.title}</h2><p>{chapter.body}</p></div>
      </div>
      <div className="core-story-chapter-proof"><EvidenceLabel>{chapter.proof}</EvidenceLabel><span>Illustrative Northstar scenario</span></div>
      <figure className="core-story-screenshot">
        <div className="core-story-screenshot-bar"><span className="core-story-window-dots"><i /><i /><i /></span><span>{chapter.eyebrow.split(' / ')[1]}</span><span className="core-story-screenshot-state">Imported template</span></div>
        <img src={chapter.image} alt={chapter.imageAlt} width="1920" height="1080" loading="lazy" />
        <figcaption><span>Privacy-redacted product interface</span><span>{chapter.proof}</span></figcaption>
      </figure>
      <div className="core-story-facts">
        {chapter.facts.map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}
      </div>
    </article>
  )
}

function IntegrationBoundary() {
  return (
    <section className="core-story-boundary" id="integration-boundary">
      <div className="container">
        <div className="core-story-boundary-heading"><span className="section-index">05 / INTEGRATION BOUNDARY</span><h2>The editor is powerful because the workflow around it stays clear.</h2><p>Use the story to frame an evaluation. Keep the business record and access decision in the host product, then validate the exact document action and result path with representative files.</p></div>
        <div className="core-story-boundary-grid">
          <article><span className="core-story-boundary-icon"><FolderKanban size={18} /></span><span className="section-index">HOST PRODUCT</span><h3>Own the surrounding record.</h3><p>Identity, organizations, file storage, permissions, version ownership, and business state remain with the system that gives the document its meaning.</p></article>
          <article><span className="core-story-boundary-icon"><Workflow size={18} /></span><span className="section-index">EDITOR SURFACE</span><h3>Keep document work in context.</h3><p>Preview, edit, review, format processing, and collaboration are evaluated as user actions inside the product workflow.</p></article>
          <article><span className="core-story-boundary-icon"><ShieldCheck size={18} /></span><span className="section-index">ACCEPTANCE RECORD</span><h3>Return a result someone can own.</h3><p>Record the file, user, operation, returned revision, and next business action. A screenshot demonstrates a surface; it does not prove a save or permission decision.</p></article>
        </div>
        <div className="core-story-boundary-note"><MessageSquare size={16} /><span>SDK/API and runtime collaboration claims require a target workflow test. This page shows the story and the evidence boundary.</span></div>
      </div>
    </section>
  )
}

function StoryCTA() {
  return (
    <section className="core-story-cta">
      <div className="container core-story-cta-inner">
        <div><span className="section-index">NEXT PROOF POINT</span><h2>Bring the workflow that matters.</h2><p>Start with one representative file, one user action, and one business result. The four editor story gives your product and engineering teams a shared starting point.</p></div>
        <div className="core-story-cta-actions"><a className="button button-primary" href="/product">Explore product capabilities <ArrowRight size={16} /></a><a className="button button-dark-ghost" href="/contact">Talk to engineering <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  )
}

export function CoreEditorsStory() {
  return (
    <>
      <StoryHero />
      <section className="core-story-intro">
        <div className="container core-story-intro-grid"><div><span className="section-index">THE NORTHSTAR THREAD</span><h2>One business question, four useful views.</h2></div><div><p>The Atlas launch starts as an open question: should Northstar run a controlled pilot in Germany and Japan? Each editor makes a different part of that question workable, while the underlying evidence stays connected.</p><div className="core-story-intro-list"><span><GitBranch size={15} /> Context becomes a plan</span><span><BarChart3 size={15} /> Plans become operating numbers</span><span><Gauge size={15} /> Numbers become a decision</span></div></div></div>
      </section>
      <section className="core-story-chapters-section" id="editor-story">
        <div className="container core-story-layout"><ChapterRail /><div className="core-story-chapters">{chapters.map((chapter) => <Chapter chapter={chapter} key={chapter.id} />)}</div></div>
      </section>
      <IntegrationBoundary />
      <StoryCTA />
    </>
  )
}
