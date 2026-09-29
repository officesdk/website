# Core Editors Product Story Design

## Objective

Create a public product story that shows how four core editors keep one business workflow together. The story uses the fictional Northstar Atlas launch as an illustrative scenario and uses cropped screenshots from the authenticated product tabs where the imported templates are open.

## Audience and success criteria

- Overseas product, engineering, and solutions teams should understand the editor surfaces through one concrete workflow.
- Visitors should reach the story from a prominent product area, without entering Blog.
- Each editor must have one distinct, scannable moment and a downloadable or inspectable visual proof point.
- Claims about collaboration, AI, SDK, API, storage, permissions, and callbacks must be separated into verified product evidence, illustrative workflow context, or runtime validation required.
- The page must render without horizontal overflow at desktop and mobile widths and must build through the existing Astro pipeline.

## Information architecture

- Public route: `/product/core-editors`.
- Home entry: a product showcase band immediately after the existing workflow demo, linking to the full story.
- Story sequence: `Context` (Markdown/document) -> `Plan` (Word/document) -> `Operate` (Excel/table) -> `Align` (PowerPoint/slides) -> `Integration boundary` -> CTA.
- Product navigation keeps the existing top-level links; the new story is linked from the Product page and the home showcase band.
- Blog remains unchanged and is not used as the landing surface.

## Visual and content rules

- Use four local PNGs in `public/product/core-editors/`; remove browser chrome, document IDs, account names, and other session-specific data.
- Mark each screenshot `Verified in the imported template`; mark the scenario and figures `Illustrative Northstar scenario`.
- Use the existing white-first, editorial layout and restrained product accents: neutral teal for Markdown, blue for Word, green for Excel, and orange for PowerPoint.
- The story headline is `One launch. Four editors. A workflow that stays together.`
- The shared illustrative facts are Germany and Japan pilot, proposed `$240,000` budget, Q3 revenue `$1,260,000`, gross profit `$726,850`, and gross margin `57.7%`.

## Implementation boundaries

- Add a focused React component for story data and interactions; do not turn `SiteSections.tsx` into a second content system.
- Add a small Astro route that supplies metadata through `SiteLayout`.
- Add only the CSS needed for the story and home band to `src/styles.css`.
- Add the route to `siteRoutes` so the generated sitemap includes it.
- Do not modify existing Blog data, article content, or generated blog images.

## Verification

- Check all four local image files and confirm no address-bar or session text remains.
- Start the local dev server on an available port and verify `/product/core-editors` and `/` return 200.
- Use Playwright fallback because the CUA browser inventory currently rejects the configured auth method. Capture desktop and mobile screenshots, inspect five visual points (hero, image loading, chapter rail, integration boundary, CTA), and check `scrollWidth <= clientWidth`.
- Run `npm run build` and inspect the generated route and sitemap.
