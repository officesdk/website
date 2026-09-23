# Office SDK Overseas Website Design

## Goal

Create a polished English-language product website for Office SDK that makes the product legible to developers and enterprise buyers, earns long-tail search visibility, and gives visitors a tangible document-rendering experience without claiming unverified performance numbers.

## Audience and Positioning

- Primary: engineers evaluating an embeddable document viewer/editor for web products.
- Secondary: product and platform owners comparing deployment, security, and format coverage.
- Positioning: developer-first document infrastructure for viewing, editing, annotating, and converting business files.
- Verified public product scope used in copy: Word, Excel, PowerPoint, format conversion, annotations, customizable UI, JavaScript API, commercial licensing. Performance figures from the upstream README are excluded from proof claims until independently verified.

## Information Architecture

1. Header: Office SDK mark, product links, language hint, primary `Start building` action.
2. Hero: concise H1, supporting copy, two CTAs, live document preview/editor mockup.
3. Capability proof: a short format strip and integration statement.
4. Interactive demo: format selector, preview/edit mode toggle, code sample language toggle, and a visible document surface that responds to state.
5. Feature sections: rendering and editing, format fidelity, deployment control, and API customization.
6. Use cases: document management, legal/compliance review, education, and finance operations.
7. Developer resources: docs, API reference, examples, and deployment notes with crawlable text.
8. FAQ: concise answer blocks for SEO/GEO extraction.
9. Final CTA and footer: docs, GitHub, contact, licensing, and product entity information.

## Visual System

- Background: near-black navy (`#070b16`) with restrained blue-violet light fields; no noisy starfield or decorative blobs.
- Surfaces: blue-black panels with thin cool borders and a small radius (10-14px).
- Accent: electric indigo for primary actions, cyan for technical highlights, green only for positive status.
- Typography: Inter/system sans for UI and body; tight display scale with readable line height and no viewport-scaled font sizes.
- Motion: reveal-on-scroll, subtle panel lift, document page shimmer, and active-state transitions. All motion is disabled or reduced under `prefers-reduced-motion`.
- Layout: constrained 1180px content column, alternating open sections, one purposeful product mockup rather than repetitive card grids.

## SEO and GEO

- Unique title and meta description in `index.html`.
- Canonical URL placeholder for `https://officesdk.com/`.
- Open Graph and Twitter metadata.
- `Organization`, `SoftwareApplication`, and `FAQPage` JSON-LD with factual product wording.
- `public/robots.txt` and `public/sitemap.xml`.
- Semantic `header`, `nav`, `main`, `section`, `article`, `footer`, one H1, ordered H2/H3 hierarchy, descriptive links, and crawlable FAQ text.
- Copy blocks use definition, use case, limitation, and integration guidance so search engines and answer engines can quote them accurately.

## Interaction Contract

- Format buttons change the document preview title, type label, and accent color.
- Preview/Edit toggle changes the toolbar label, page state, and explanatory copy.
- Code language tabs switch the visible snippet between JavaScript, React, and Vue.
- Header and section CTAs scroll to the demo or developer resources; no fake auth or external submission is introduced.
- Keyboard focus, visible active states, and reduced-motion behavior are required.

## Non-Goals

- No real SDK network calls, login, billing, contact submission, or invented customer logos.
- No unverified SLA, latency, file-size, or certification claims.
- No locale routing or CMS in the first iteration; the first version is English and statically crawlable.

## Acceptance Criteria

- `npm run dev` serves a complete responsive homepage.
- First viewport clearly communicates product, audience, and next action on desktop and mobile.
- Demo controls visibly update the rendered UI without console errors.
- Page contains SEO metadata, JSON-LD, robots, and sitemap assets.
- Desktop and mobile browser screenshots show no clipping, overlap, or horizontal overflow.
- Primary CTA, format switching, mode switching, code tabs, FAQ details, and resource links are usable with keyboard and pointer.
