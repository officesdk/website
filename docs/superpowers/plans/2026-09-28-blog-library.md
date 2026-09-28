# Blog Library Implementation Plan

**Goal:** Add a usable blog with at least 101 complete articles and a distinct composition and topical image for every article.

**Architecture:** Keep the existing Vite/React site and shared navigation. A build-time content pipeline records source provenance, normalizes authorized articles, validates content, assigns unique editorial recipes, and emits lazy-loaded article JSON plus independently indexable HTML. Blog views consume a compact catalogue, not the entire article corpus.

**Tech Stack:** React, TypeScript, Vite, Node.js, Cheerio, sanitize-html, Playwright, Sharp.

## Requirements And Decisions

- Sources: https://shimodocs.com/blog, https://officedex.ai/blog/, https://officeapi.ai/blog/.
- Live sitemap inventory: 60 + 7 + 4 = 71 source articles. Target 108 by adding 37 original extensions; never duplicate an article to reach the count. Until republication rights are confirmed, the local preview uses 71 independently authored articles on those topics plus the 37 extensions.
- Full source content may be imported only after ownership or republication rights are confirmed. Metadata inventory and independent module work can proceed while confirmation is pending.
- Preserve source product identities and distinctions. Do not turn another product's feature claims into Office SDK claims.
- Existing local changes, including removal of API reference entries, must survive.
- No publishing, pushing, or submitting external forms is included.
- The user requires newly generated illustrations, not source imagery. Image Gen is not exposed in this session; generate meaningful topical raster diagrams for all articles and exclude source-hosted images from imports.
- Article composition differs structurally: hero architecture, body width, column arrangement, contents position, pullout presentation, and section rhythm. Color changes alone do not establish uniqueness.
- Search, category filters, pagination, article contents, related posts, source links, error states, and narrow screens are required.
- Article bodies load individually from local files; no runtime dependency on source websites.
- All articles must have real complete content, unique slugs, source provenance where applicable, a unique existing image, and unique layout signatures.
- Maintain truthful author/date metadata; original additions identify Office SDK Editorial and source republications retain source attribution.

## Tasks

### 1. Content Inventory And Pipeline

Files: `scripts/blog/import.mjs`, `scripts/blog/editorial.mjs`, `src/blog/catalog.json`, `public/blog/articles/`, `src/blog/types.ts`.

- [x] Discover source posts from XML sitemaps using an XML/HTML parser and exact blog-path filtering.
- [x] Fetch with four bounded workers, timeouts, retry logging, and a cache outside the repository.
- [x] Normalize titles, description, dates, author, headings, tables, lists, code blocks, and source links; replace source illustrations.
- [x] Sanitize scripts, events, embeds, unsafe URL schemes, and source navigation/CTA cruft before storing any body HTML.
- [ ] Keep source URLs and content digests in the catalogue and import report. Fail on missing content, duplicated bodies, unsafe markup, or insufficient article count.

### 2. Original Extensions

File: `src/blog/originals.json`.

- [x] Write 37 substantive, distinct English articles related to source topics and embedded Office workflows.
- [x] Each article includes a useful introduction, at least four specific sections, an actionable checklist or comparison, and a conclusion. Avoid invented product promises and filler.
- [x] Keep original articles separate from republications and record reference links as references.
- [x] Write 71 independent topic articles for the preview without copying source bodies. Coverage: ShimoDocs 60, OfficeDex 7, OfficeAPI 4.

### 3. Editorial Recipes And Illustrations

Files: `scripts/blog/illustrations.mjs`, `src/blog/editorial.ts`, `src/blog/blog.css`, `public/blog/images/`.

- [x] Define twelve distinct hero compositions and nine body/contents arrangements.
- [x] Assign every article a unique structural recipe, derived from article index and content structure rather than title color.
- [x] Produce one distinct topical PNG per article. Diagrams must show article-specific concepts and correct labels.
- [x] Verify image count, file existence, dimensions, nonblank pixels, and uniqueness of SHA-256 digests.

### 4. Blog Views And Site Integration

Files: `src/blog/BlogIndex.tsx`, `src/blog/BlogArticle.tsx`, `src/blog/data.ts`, `src/App.tsx`, `src/seo.ts`, `vite.config.ts`, `public/sitemap.xml`.

- [x] Add `/blog` and `/blog/:slug`, plus Blog links to header and footer.
- [x] Implement search, mutually exclusive category filtering, pagination with URL state, browser Back/Forward, clear reset/no-results states, and accessible article links.
- [x] Implement lazy article loading, deep-link contents, related articles, reference attribution, and copy-link feedback.
- [x] Render article compositions through shared safe components and explicit recipe variants.
- [x] Generate complete static blog HTML with canonical, description, social image, and BlogPosting schema for every article.
- [x] Include all local blog URLs in the generated sitemap; unknown blog slugs show a meaningful not-found state.

### 5. Verification

Files: `scripts/blog/verify.mjs`, `scripts/blog/browser-check.mjs`.

- [ ] Run corpus assertions for count, complete bodies, source coverage, uniqueness, safety, assets, and structural recipes.
- [x] Run the original-collection corpus audit separately: 108 articles/images/layout signatures, complete local HTML, safety, 71 topic references, and sitemap entries.
- [x] Run `npm run build` and `git diff --check`.
- [x] Check every article in Chromium at desktop and mobile sizes for identity, body load, images, overflow, runtime errors, and absence of framework overlays.
- [x] Exercise search, filters, pagination, back navigation, contents anchors, mobile navigation, and related articles.
- [x] Capture and inspect contact sheets of all article first viewports and representative full pages, repairing any clipped titles or excessive gaps.
- [x] Confirm the local server survives command completion and give the user a working `/blog` URL.

## Progress

- Source sitemap inventory is complete: 71 articles. Full-text rights confirmation is pending.
- Implementation is on `codex/blog-library`; pre-existing local modifications are retained.
- Original preview corpus is complete: 108 unique articles, 51,993 substantive body words before final review. Full source republication remains a separate, unfulfilled requirement.
- The user requested all-new illustrations. The source importer now drops original inline images; generated covers are local.
- Final original-preview verification: `npm test` 7/7, production build, `blog:verify:originals`, and `git diff --check` pass. All 108 articles were checked at 1440x1000 and 390x844 (216 views); no runtime errors, overflow, cropped covers, or API-reference navigation entries. Browser Back/Forward and related-article navigation also passed.
- Inspected five desktop and four mobile contact sheets, nine representative full-page reading layouts, and both complete index screenshots. Lazy thumbnails are loaded before full-page capture.
- Final image-framing fix applies to main covers, featured media, and related/list thumbnails. Exact image aspect ratios and contained rendering retain the full generated image; hover scaling is removed. Refreshed mobile full pages 000 and 012 were independently re-reviewed and all six related thumbnails retain their complete framing. The final 216-view browser pass with explicit image-framing assertions passed.
- `blog:verify` still correctly fails the full-request source-republication check. The user has confirmed regenerating illustrations but has not confirmed source-body rights or accepted original rewriting as the final body mode.
- Preview: http://127.0.0.1:4173/blog; a fresh HTTP check returned 200 after all browser sessions closed.
