# Conversion tracking and release checklist

## Implemented in the site

The Google tag uses measurement ID `G-9SF2PEB5YX`. It loads only on `officesdk.com`; local development and preview hosts keep the event queue available for testing without sending production traffic.

| Event | Trigger | Meaning |
| --- | --- | --- |
| `contact_form_submit` | Teable returns HTTP 201 | An inquiry was accepted by the form backend. Invalid email, failed requests, and the silent honeypot do not count. |
| `cta_contact_click` | A contact-page or mailto link is clicked | Contact intent, not a received inquiry. |
| `github_outbound_click` | An actual `github.com/officesdk` organization or repository link is clicked | Developer interest. |
| `article_scroll_75` | The viewport reaches 75% of the article element | Reading depth, emitted once per page load. |

Custom event parameters contain only the page path, link placement, article slug, or fixed form ID. They do not contain form values, email addresses, or query strings. GA4's ordinary automatic page/session collection is separate from these custom parameters.

The delegated click handler supports `data-analytics-event="pricing_cta_click"`, `docs_outbound_click`, and `demo_launch`. Add those markers to verified destinations when those pages are ready; no events are generated merely because a destination is planned.

## GA4 configuration still required

Use the **officesdk** property and verify the web stream measurement ID is `G-9SF2PEB5YX` before editing anything. Do not use a different ShimoDocs property.

1. In Admin → Data display → Events, create/mark `contact_form_submit` as a key event. Select once per event if each accepted inquiry should count. This is a key-event definition for the event sent by the site; do not create a derived event that duplicates it or use automatic `form_submit` as the conversion.
2. In the web stream → Configure tag settings → Define internal traffic, enter the confirmed office public IPs/CIDRs. Use `traffic_type=internal`. A workstation/VPN egress address is not evidence of the office network.
3. In Data filters, test the internal-traffic exclusion first. Verify office and external traffic are classified correctly before activating permanent filtering; filtered historical data cannot be recovered.
4. After release, verify the event in DebugView/Realtime using an agreed test inquiry and check the matching backend record. The local browser test intercepts the form request and does **not** prove live lead delivery or GA4 ingestion.

Cloudflare Web Analytics requires access to the domain's Cloudflare account. Enable the site through its dashboard and confirm beacon injection before adding any manual snippet, to avoid duplicate collection. No Cloudflare beacon or account setting has been changed by this code update.

## Search Console ownership

The account that will become a verified owner should generate its **own** DNS verification token for `sc-domain:officesdk.com`. Preserve existing verification records and owners. Add the exact TXT value at the DNS provider, wait for public DNS resolution, then verify in that same account. Copying another owner's token does not verify the intended account.

This is an ownership change and must be completed with the intended account and DNS access confirmed. After deployment, inspect `https://officesdk.com/` and request indexing; validate the current sitemap before resubmission. Neither DNS verification nor recrawling has been performed by this repository change.

## Content required for the three destination pages

The repository currently promises neither public prices nor a self-serve trial. Obtain approved pricing, license download URL, supported hosting options, English API reference, and a working public demo before adding `/pricing`, `/docs`, and `/demo` or advertising “free to evaluate” / “try the live demo.” The existing editor story is a screenshot-based product walkthrough, not an interactive SDK demo.

The homepage now routes to the real contact form and editor story. The old public GitHub README still links to `/#/developer` and `/#/pricing`; update that separate repository once real destinations are available. Fragments never reach Nginx and cannot be repaired by server-side redirects alone. No placeholder Status link has been added without a verified status-page URL.

## Cache scope, rollout and rollback

The Nginx configuration changes only the Office SDK virtual host:

- HTML: browser revalidation on every visit, shared-cache TTL 3600 seconds.
- `/_astro/`: content-hashed bundles and responsive images, one-year immutable cache.
- Stable font/image paths: four-hour cache with revalidation, because their contents can change without a new filename.
- 404 responses: `no-store`.

The matching `public/_headers` file supplies asset headers for the repository's optional Cloudflare Pages deployment. It does not create Cloudflare zone Cache Rules or alter the Nginx production deployment.

For the Nginx origin, create a Cloudflare Cache Rule scoped to host `officesdk.com`, methods GET/HEAD, and the current public HTML routes only (`/`, `/product`, `/product/core-editors`, `/formats`, `/solutions`, `/deployment`, `/contact`, `/blog`, and `/blog/*`). Exclude authenticated requests and requests with session cookies. Set cache eligibility to eligible and respect origin Cache-Control; the origin supplies the one-hour shared TTL. Do not apply Cache Everything to a wildcard that could later include APIs or authenticated content. Preserve `no-store` for error responses.

Before applying that rule, export the current rules and record its ID/order. Keep the preceding release and Nginx backup using the existing deployment workflow. After release, check successful pages, missing pages/assets, canonical redirects, image loading, and the form. Repeated requests should show HIT or increasing Age for eligible HTML; a local header test alone does not prove edge caching. Purge changed HTML URLs on a release or rollback. If validation fails, disable the new rule, restore the previous Nginx configuration/release, validate Nginx, reload it, and purge the affected HTML URLs.

## Repeatable local checks

```bash
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
# Use an installed Playwright runtime; this script refuses non-local URLs.
OFFICESDK_PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/analytics/browser-check.mjs
# Executes an isolated temporary listener; does not reload production Nginx.
bash scripts/deploy/test-nginx-routing.sh --ssh ubuntu@43.172.115.22
```

The browser check covers invalid/failed/successful submissions, honeypots, unavailable analytics, contact/mail/GitHub clicks, one-time reading depth, desktop/mobile layout, carousel controls, and the real homepage-to-contact route. Screenshots are written to the system temporary directory.
