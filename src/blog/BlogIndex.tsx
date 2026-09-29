import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Search, Tag, X } from 'lucide-react'
import { blogCategories, blogEntries, blogTags, filterArticles, formatDate, formatNames, tagCounts } from './data'
import type { BlogEntry } from './types'

const PAGE_SIZE = 12
const HERO_TOPICS: Array<{ label: string; category: BlogEntry['category'] }> = [
  { label: 'Integration', category: 'Integration' },
  { label: 'Security', category: 'Security' },
  { label: 'AI documents', category: 'AI & documents' },
  { label: 'Migration', category: 'Migration' },
]

function initialSearch() {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  return { query: params.get('q') ?? '', category: blogCategories.includes(params.get('category') as BlogEntry['category']) ? params.get('category')! : 'All', tag: blogTags.includes(params.get('tag') ?? '') ? params.get('tag')! : 'All', page: Math.max(1, Math.floor(Number(params.get('page')) || 1)) }
}

export function EntryMeta({ entry }: { entry: BlogEntry }) {
  return <div className="entry-meta"><span>{entry.category}</span><span>{formatNames[entry.format]}</span><span>{entry.readMinutes} min read</span>{entry.publishedAt && <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>}</div>
}

export function TopicTags({ tags, limit }: { tags: string[]; limit?: number }) {
  return <nav className="blog-tags" aria-label="Article keywords">{tags.slice(0, limit).map(tag => <a key={tag} href={`/blog?tag=${encodeURIComponent(tag)}#articles`}>{tag}</a>)}</nav>
}

export function BlogCard({ entry }: { entry: BlogEntry }) {
  return <article className="blog-card" style={{ '--article-accent': entry.recipe.accent } as CSSProperties}>
    <a className="blog-card-image" href={`/blog/${entry.slug}`} tabIndex={-1}><img src={entry.cover} alt={entry.coverAlt} loading="lazy" width="1200" height="760" /></a>
    <EntryMeta entry={entry} />
    <h2><a href={`/blog/${entry.slug}`}>{entry.title}</a></h2>
    <p>{entry.description}</p>
    <TopicTags tags={entry.tags} limit={3} />
    <a className="blog-read-link" href={`/blog/${entry.slug}`} aria-label={`Read ${entry.title}`}>Read story <ArrowUpRight size={16} /></a>
  </article>
}

function KeywordFilter({ value, onChange }: { value: string; onChange: (tag: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [placement, setPlacement] = useState<'above' | 'below'>('below')
  const [optionsHeight, setOptionsHeight] = useState(294)
  const filterRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedLabel = value === 'All' ? 'All keywords' : value
  const options = useMemo(() => {
    const needle = query.toLocaleLowerCase().trim()
    return [{ value: 'All', label: 'All keywords', count: blogEntries.length }, ...blogTags.map(tag => ({ value: tag, label: tag, count: tagCounts.get(tag) ?? 0 }))]
      .filter(option => !needle || option.label.toLocaleLowerCase().includes(needle))
  }, [query])

  const measureDialog = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const bounds = trigger.getBoundingClientRect()
    const edgeInset = 16
    const dialogGap = 8
    const dialogChrome = 116
    const spaceAbove = Math.max(0, bounds.top - edgeInset - dialogGap)
    const spaceBelow = Math.max(0, window.innerHeight - bounds.bottom - edgeInset - dialogGap)
    const nextPlacement = spaceBelow < 410 && spaceAbove > spaceBelow ? 'above' : 'below'
    const availableSpace = nextPlacement === 'above' ? spaceAbove : spaceBelow
    setPlacement(nextPlacement)
    setOptionsHeight(Math.max(72, Math.min(294, availableSpace - dialogChrome)))
  }, [])

  useEffect(() => {
    if (!open) return
    measureDialog()
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      setQuery('')
      window.requestAnimationFrame(() => triggerRef.current?.focus())
    }
    document.addEventListener('pointerdown', closeOnPointerDown)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', measureDialog)
    window.addEventListener('scroll', measureDialog, { capture: true, passive: true })
    window.requestAnimationFrame(() => searchRef.current?.focus())
    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', measureDialog)
      window.removeEventListener('scroll', measureDialog, true)
    }
  }, [open, measureDialog])

  const selectKeyword = (tag: string) => {
    onChange(tag)
    setOpen(false)
    setQuery('')
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const moveOptionFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === 'ArrowDown') next = (index + 1) % options.length
    else if (event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = options.length - 1
    else return
    event.preventDefault()
    optionRefs.current[next]?.focus()
  }

  return <div className="journal-keyword-filter" ref={filterRef} onBlur={event => {
    if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false)
      setQuery('')
    }
  }}>
    <button ref={triggerRef} className="journal-keyword-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? 'journal-keyword-dialog' : undefined} aria-label={`Filter by keyword, ${selectedLabel}`} onClick={() => {
      setQuery('')
      if (!open) measureDialog()
      setOpen(current => !current)
    }}>
      <Tag size={16} aria-hidden="true" />
      <span>{selectedLabel}</span>
      {value !== 'All' && <span className="journal-keyword-current-count">{tagCounts.get(value)}</span>}
      <ChevronDown className={open ? 'is-open' : undefined} size={16} aria-hidden="true" />
    </button>
    {open && <div className={`journal-keyword-dialog is-${placement}`} id="journal-keyword-dialog" role="dialog" aria-label="Filter by keyword" style={{ '--keyword-options-height': `${optionsHeight}px` } as CSSProperties}>
      <div className="journal-keyword-heading"><div><strong>Keywords</strong><span>{blogTags.length} available</span></div><button type="button" aria-label="Close keyword filter" title="Close keyword filter" onClick={() => {
        setOpen(false)
        setQuery('')
        window.requestAnimationFrame(() => triggerRef.current?.focus())
      }}><X size={16} /></button></div>
      <div className="journal-keyword-search"><Search size={16} aria-hidden="true" /><input ref={searchRef} aria-label="Search keywords" placeholder="Find a keyword" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => {
        if (event.key === 'ArrowDown' && options.length) {
          event.preventDefault()
          optionRefs.current[0]?.focus()
        }
      }} />{query && <button type="button" aria-label="Clear keyword search" title="Clear keyword search" onClick={() => {
        setQuery('')
        searchRef.current?.focus()
      }}><X size={14} /></button>}</div>
      <div className="journal-keyword-options" aria-label="Keyword options">
        {options.map((option, index) => <button ref={element => { optionRefs.current[index] = element }} key={option.value} type="button" aria-pressed={value === option.value} aria-label={`${option.label}, ${option.count} articles`} onClick={() => selectKeyword(option.value)} onKeyDown={event => moveOptionFocus(event, index)}><Check size={15} aria-hidden="true" /><span>{option.label}</span><span>{option.count}</span></button>)}
        {!options.length && <p role="status">No matching keywords.</p>}
      </div>
    </div>}
  </div>
}

export default function BlogIndex() {
  const [state, setState] = useState({ query: '', category: 'All', tag: 'All', page: 1 })
  const results = useMemo(() => filterArticles(state.query, state.category, state.tag), [state.query, state.category, state.tag])
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(state.page, pageCount)
  const entries = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const featured = !state.query && state.category === 'All' && state.tag === 'All' && page === 1 ? blogEntries[0] : null
  useEffect(() => {
    const restore = () => setState(initialSearch())
    restore()
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  const update = (next: Partial<typeof state>, replace = false) => {
    const value = { ...state, ...next }
    setState(value)
    const params = new URLSearchParams()
    if (value.query) params.set('q', value.query)
    if (value.category !== 'All') params.set('category', value.category)
    if (value.tag !== 'All') params.set('tag', value.tag)
    if (value.page > 1) params.set('page', String(value.page))
    const url = `/blog${params.size ? `?${params}` : ''}`
    if (url !== `${window.location.pathname}${window.location.search}`) {
      if (replace) window.history.replaceState(null, '', url)
      else window.history.pushState(null, '', url)
    }
  }

  const showTopic = (category: BlogEntry['category']) => {
    update({ query: '', category, tag: 'All', page: 1 })
    window.requestAnimationFrame(() => {
      document.getElementById('articles')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      document.getElementById('article-results-heading')?.focus({ preventScroll: true })
    })
  }

  return <div className="blog-index">
    <header className="journal-masthead">
      <img className="journal-masthead-image" src="/blog/images/journal-workflow-banner.png" alt="" width="1920" height="720" fetchPriority="high" aria-hidden="true" />
      <div className="journal-masthead-shade" aria-hidden="true" />
      <div className="journal-masthead-inner container">
        <div className="journal-masthead-copy">
          <h1>Office SDK <em>Journal.</em></h1>
          <p>Field notes for building, securing, and operating embedded Office workflows.</p>
          <nav className="journal-hero-topics" aria-label="Explore journal topics">
            {HERO_TOPICS.map(topic => <button key={topic.category} type="button" onClick={() => showTopic(topic.category)}>{topic.label}<ArrowRight size={14} /></button>)}
          </nav>
        </div>
        <div className="journal-edition"><strong>{blogEntries.length}</strong><span>articles</span><span>{blogCategories.length} topic groups</span><time dateTime="2026-09-29">Updated Sep 29, 2026</time></div>
      </div>
    </header>
    {featured && <section className="journal-feature container" aria-label="Featured article"><a className="journal-feature-art" href={`/blog/${featured.slug}`} tabIndex={-1}><img src={featured.cover} alt={featured.coverAlt} width="1200" height="760" fetchPriority="high" /></a><div className="journal-feature-copy"><EntryMeta entry={featured} /><h2><a href={`/blog/${featured.slug}`}>{featured.title}</a></h2><p>{featured.description}</p><TopicTags tags={featured.tags} limit={3} /><a className="blog-read-link" href={`/blog/${featured.slug}`}>Read the story <ArrowUpRight size={17} /></a></div></section>}
    <section className="journal-library container" id="articles" aria-label="Article library">
      <div className="journal-tools"><h2 id="article-results-heading" tabIndex={-1}>All stories<span role="status" aria-live="polite" aria-atomic="true">{results.length}<span className="journal-result-label"> matching articles</span></span></h2><div className="journal-filters"><KeywordFilter value={state.tag} onChange={tag => update({ tag, page: 1 })} /><div className="journal-search"><Search size={18} aria-hidden="true" /><input aria-label="Search articles" placeholder="Search titles, tags, and article text" value={state.query} onChange={event => update({ query: event.target.value, page: 1 }, true)} />{state.query && <button type="button" title="Clear search" aria-label="Clear search" onClick={() => update({ query: '', page: 1 })}><X size={16} /></button>}</div></div></div>
      <div className="journal-categories" role="group" aria-label="Filter by topic">{['All', ...blogCategories].map(category => <button key={category} type="button" aria-pressed={state.category === category} onClick={() => update({ category, page: 1 })}>{category === 'All' ? 'All topics' : category}</button>)}</div>
      {entries.length ? <div className="journal-grid">{entries.map(entry => <BlogCard key={entry.slug} entry={entry} />)}</div> : <div className="journal-empty"><Search size={32} /><h3>No matching stories.</h3><p>Try another topic or a shorter search.</p><button className="button button-primary" type="button" onClick={() => update({ query: '', category: 'All', tag: 'All', page: 1 })}>Reset filters <ArrowRight size={16} /></button></div>}
      {pageCount > 1 && <nav className="journal-pagination" aria-label="Blog pagination"><button type="button" aria-label="Previous page" title="Previous page" disabled={page === 1} onClick={() => { update({ page: page - 1 }); document.getElementById('articles')?.scrollIntoView() }}><ArrowLeft size={19} /></button><div>{Array.from({ length: pageCount }, (_, index) => index + 1).filter(number => number === 1 || number === pageCount || Math.abs(number - page) <= 1).map((number, index, pages) => <span key={number}>{index > 0 && number - pages[index - 1] > 1 && <span className="pagination-gap">...</span>}<button type="button" aria-label={`Page ${number}`} aria-current={number === page ? 'page' : undefined} onClick={() => { update({ page: number }); document.getElementById('articles')?.scrollIntoView() }}>{number}</button></span>)}</div><button type="button" aria-label="Next page" title="Next page" disabled={page === pageCount} onClick={() => { update({ page: page + 1 }); document.getElementById('articles')?.scrollIntoView() }}><ArrowRight size={19} /></button></nav>}
    </section>
    <section className="journal-closing"><div className="container"><h2>Bring the ideas into <em>your product.</em></h2><a href="/contact" className="button button-primary">Talk to Office SDK <ArrowRight size={17} /></a></div></section>
  </div>
}
