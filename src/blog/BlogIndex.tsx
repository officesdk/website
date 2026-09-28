import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import { blogCategories, blogEntries, blogTags, filterArticles, formatDate, formatNames, tagCounts } from './data'
import type { BlogEntry } from './types'

const PAGE_SIZE = 12

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
    <a className="blog-card-image" href={`/blog/${entry.slug}`} tabIndex={-1} aria-hidden="true"><img src={entry.cover} alt="" loading="lazy" width="1200" height="760" /></a>
    <EntryMeta entry={entry} />
    <h2><a href={`/blog/${entry.slug}`}>{entry.title}</a></h2>
    <p>{entry.description}</p>
    <TopicTags tags={entry.tags} limit={3} />
    <a className="blog-read-link" href={`/blog/${entry.slug}`} aria-label={`Read ${entry.title}`}>Read story <ArrowUpRight size={16} /></a>
  </article>
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

  return <div className="blog-index">
    <header className="journal-masthead container"><div><h1>Office SDK <em>Journal.</em></h1><p>Documents, systems, and the work between.</p></div><div className="journal-edition"><span>{blogEntries.length} articles</span><span>Ideas for building with Office</span></div></header>
    {featured && <section className="journal-feature container" aria-label="Featured article"><a className="journal-feature-art" href={`/blog/${featured.slug}`} tabIndex={-1} aria-hidden="true"><img src={featured.cover} alt="" width="1200" height="760" fetchPriority="high" /></a><div className="journal-feature-copy"><EntryMeta entry={featured} /><h2><a href={`/blog/${featured.slug}`}>{featured.title}</a></h2><p>{featured.description}</p><TopicTags tags={featured.tags} limit={3} /><a className="blog-read-link" href={`/blog/${featured.slug}`}>Read the story <ArrowUpRight size={17} /></a></div></section>}
    <section className="journal-library container" id="articles" aria-label="Article library">
      <div className="journal-tools"><h2>All stories<span>{results.length}</span></h2><div className="journal-filters"><div className="journal-keyword-filter"><label htmlFor="journal-keyword">Keyword</label><select id="journal-keyword" aria-label="Filter by keyword" value={state.tag} onChange={event => update({ tag: event.target.value, page: 1 })}><option value="All">All keywords</option>{blogTags.map(tag => <option value={tag} key={tag}>{tag} ({tagCounts.get(tag)})</option>)}</select></div><div className="journal-search"><Search size={18} aria-hidden="true" /><input aria-label="Search articles" placeholder="Search stories, topics, and ideas" value={state.query} onChange={event => update({ query: event.target.value, page: 1 }, true)} />{state.query && <button type="button" title="Clear search" aria-label="Clear search" onClick={() => update({ query: '', page: 1 })}><X size={16} /></button>}</div></div></div>
      <div className="journal-categories" role="group" aria-label="Filter by topic">{['All', ...blogCategories].map(category => <button key={category} type="button" aria-pressed={state.category === category} onClick={() => update({ category, page: 1 })}>{category === 'All' ? 'All topics' : category}</button>)}</div>
      {entries.length ? <div className="journal-grid">{entries.map(entry => <BlogCard key={entry.slug} entry={entry} />)}</div> : <div className="journal-empty"><Search size={32} /><h3>No matching stories.</h3><p>Try another topic or a shorter search.</p><button className="button button-primary" type="button" onClick={() => update({ query: '', category: 'All', tag: 'All', page: 1 })}>Reset filters <ArrowRight size={16} /></button></div>}
      {pageCount > 1 && <nav className="journal-pagination" aria-label="Blog pagination"><button type="button" aria-label="Previous page" title="Previous page" disabled={page === 1} onClick={() => { update({ page: page - 1 }); document.getElementById('articles')?.scrollIntoView() }}><ArrowLeft size={19} /></button><div>{Array.from({ length: pageCount }, (_, index) => index + 1).filter(number => number === 1 || number === pageCount || Math.abs(number - page) <= 1).map((number, index, pages) => <span key={number}>{index > 0 && number - pages[index - 1] > 1 && <span className="pagination-gap">...</span>}<button type="button" aria-label={`Page ${number}`} aria-current={number === page ? 'page' : undefined} onClick={() => { update({ page: number }); document.getElementById('articles')?.scrollIntoView() }}>{number}</button></span>)}</div><button type="button" aria-label="Next page" title="Next page" disabled={page === pageCount} onClick={() => { update({ page: page + 1 }); document.getElementById('articles')?.scrollIntoView() }}><ArrowRight size={19} /></button></nav>}
    </section>
    <section className="journal-closing"><div className="container"><h2>Bring the ideas into <em>your product.</em></h2><a href="/contact" className="button button-primary">Talk to Office SDK <ArrowRight size={17} /></a></div></section>
  </div>
}
