type AnalyticsEvent = 'contact_form_submit' | 'cta_contact_click' | 'github_outbound_click' | 'article_scroll_75' | 'pricing_cta_click' | 'docs_outbound_click' | 'demo_launch'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: AnalyticsEvent, parameters: Record<string, string | number> = {}) {
  // Analytics must never interrupt navigation or change a successful lead into an error.
  try {
    window.gtag?.('event', name, { page_path: window.location.pathname, ...parameters })
  } catch { /* Analytics may be blocked by the browser. */ }
}

export function installAnalytics() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return
    const anchor = event.target.closest('a')
    if (!anchor) return
    const url = new URL(anchor.href, window.location.href)
    const location = anchor.closest('header') ? 'header' : anchor.closest('footer') ? 'footer' : 'content'
    const parameters = { link_location: location }
    if (url.protocol === 'mailto:' || (url.origin === window.location.origin && url.pathname.replace(/\/$/, '') === '/contact')) {
      trackEvent('cta_contact_click', parameters)
    } else if (url.hostname === 'github.com' && /^\/officesdk(?:\/|$)/i.test(url.pathname)) {
      trackEvent('github_outbound_click', parameters)
    }
    // Explicit markers belong on real destinations once they are available.
    const marker = anchor.dataset.analyticsEvent
    if (marker === 'pricing_cta_click' || marker === 'docs_outbound_click' || marker === 'demo_launch') {
      trackEvent(marker, parameters)
    }
  })

  const article = document.querySelector<HTMLElement>('article[data-slug]')
  if (!article) return
  let reached = false
  const checkDepth = () => {
    if (reached) return
    const bounds = article.getBoundingClientRect()
    if (bounds.height > 0 && bounds.top + bounds.height * 0.75 <= window.innerHeight) {
      reached = true
      trackEvent('article_scroll_75', { article_slug: article.dataset.slug || '' })
      window.removeEventListener('scroll', checkDepth)
      window.removeEventListener('resize', checkDepth)
    }
  }
  window.addEventListener('scroll', checkDepth, { passive: true })
  window.addEventListener('resize', checkDepth)
  checkDepth()
}
