# Office SDK website

The public Office SDK marketing site is an Astro static site with React islands for the interactions that need client state. It is an orientation and evaluation layer for Office file workflows.

## What Office SDK is

Office SDK is an online Office document surface for web products. It helps a product add Word, Excel, and PowerPoint preview, editing, collaboration, import, export, and content workflows while the product keeps ownership of users, files, permissions, and business data.

The site deliberately separates four questions that are often mixed together:

- **Preview**: inspect a file in the surrounding product workflow.
- **Edit and review**: provide an Office surface for the user action that has been verified for the target format.
- **Import and export**: move existing Office files into the product workflow, then apply the documented result path to the system that owns the business record.
- **Integration**: use the documented callback and JavaScript SDK surfaces to exchange product context and results.

No page should add unverified AI APIs, customer stories, performance numbers, SLA promises, certifications, or pricing claims. Confirm exact parameters and format behavior during technical evaluation.

## Common evaluation scenarios

Office SDK is positioned for products where an Office file is part of a larger workflow, including:

- document management and knowledge products;
- review, approval, and records workflows;
- CRM, ERP, and operational systems;
- education and collaboration products.

The first evaluation should name one user action, one file family, and the system that owns storage, permissions, and business data.

## Site structure

The homepage is the product entry point. The independent SEO pages are:

- `/product` - capability and responsibility boundary.
- `/formats` - preview, import, edit, and export format fit.
- `/solutions` - document management, review, knowledge, CRM/ERP, and collaboration workflows.
- `/deployment` - proof of concept, web delivery, platform baseline, and ownership.
- `/contact` - real workflow intake and `support@officesdk.com` fallback.
- `/blog` - searchable article library with topic filters and pagination.
- `/blog/:slug` - statically generated article pages with contents, references, related reading, and distinct editorial layouts.

Each route receives a built HTML entry with its own title, description, canonical URL, H1, and introductory copy. Astro writes known routes to `dist/<route>/index.html`, including the complete blog index and article pages, and generates `dist/sitemap.xml` from the same route and article data. Nginx serves the route entry first and uses the generated `404.html` for unknown paths.

## Framework and rendering

Astro owns the site layout, route generation, metadata, and static HTML output. The build does not require a server-side JavaScript runtime after deployment. React islands provide mobile navigation, the workflow format/mode demo, contact form submission, and blog search, filters, and pagination. Static JSX sections render only during the Astro build. Article bodies and figures use Astro components, with a small bundled script for contents and copy-link controls. Page copy, structured data, and image references are present in the generated HTML without client rendering or article-data requests.

## Contact intake

The contact form is wired to the configured Teable share form for the `Sales Leads` table. It posts field IDs and requires an HTTP `201` response; it records the page URL, referrer, and UTM parameters in the need description. When a referrer is unavailable, it records `unknown` rather than assuming a direct visit. The form disables duplicate submission, uses a silent honeypot, and shows the direct support email when Teable is unavailable.

This is an integration configuration, not a completed production acceptance claim. Before publishing the site or sending live traffic, run a live `201` smoke test with a safe test submission, verify that the row arrives in `Sales Leads`, and remove the test row afterward. Keep the Teable endpoint and field IDs in the current contact-form island synchronized with the `Office SDK` Base and `Sales Leads` table. Do not submit column names in their place.

## Evaluate Office SDK

- [GitHub website repository](https://github.com/officesdk/website) - public site source and deployment configuration.
- [Evaluation intake](/contact) - describe the workflow, file types, and deployment questions.
- [Direct support](mailto:support@officesdk.com) - use `support@officesdk.com` when a form submission is not suitable.

There is no self-serve trial or pricing promise in this repository. Use the evaluation intake to arrange a workflow review or proof of concept.

## Operations and analytics

The site records accepted contact inquiries, contact/GitHub clicks, and 75% article reading depth. Local and preview hosts do not load the production Google tag. Event definitions, GA4 key-event setup, internal-traffic filtering, ownership verification, and cache rollout are described in [the conversion checklist](docs/ANALYTICS-AND-CONVERSION.md).

The internal operating record lives in the Feishu knowledge base under `Overseas Operations / officesdk`, with a `Daily Collection Status` table. The enabled daily workflow currently writes a `pending collection` status row; it does not yet read Google Search Console data through the GSC API.

Google Search Console property access and API credentials must be confirmed before metric ingestion is added. Until then, missing clicks, impressions, indexing, or query values must remain unreported rather than being recorded as zero. The current automation is status logging, not a complete SEO analytics pipeline.

## Office workflows and deployment

The site focuses on the product surface, workflow evaluation, and contact options. The deployment copy is a planning baseline, not a capacity or availability guarantee. Confirm the exact platform, resource, topology, and version requirements with engineering before production rollout.

## Local development

```bash
npm ci
npm run dev       # Astro development server (http://localhost:4173)
```

Build the production assets with:

```bash
npm run build     # Astro static build written to dist/
npm run preview   # preview the built Astro output locally
```

## Blog content

The local editorial collection contains 108 independently written English articles: 37 integration guides and 71 topic articles referencing the supplied ShimoDocs, OfficeDex, and OfficeAPI article inventory. Titles, links, and categories are recorded in `src/blog/sources.json`; these references do not imply source authorship or full-text republication.

Each article has a complete local JSON body, three to five controlled keyword tags, a search-intent editorial format, and a unique combination of twelve heading arrangements and nine reading layouts. Every article also includes at least two topic-specific body illustrations with accessible alt text, captions, and separate mobile compositions. The build generates complete article HTML, canonical metadata, keyword and citation aware BlogPosting data, social previews, and sitemap entries. Neither article reading nor illustration loading requires a source website at runtime.

To regenerate the original collection and its illustrations:

```bash
npm run blog:originals
npm run blog:illustrate
npm run build
npm run blog:verify:originals
```

`npm test` checks the content pipeline. Browser QA uses the repository script `scripts/blog/browser-check.mjs` with an installed Playwright runtime; set `OFFICESDK_PLAYWRIGHT_MODULE` to its absolute module path if it is not installed in this project. Screenshots are written to the system temporary folder.

Full-text source import is still conditional on confirmed republication rights. The explicit `--authorized` importer option materializes 71 source articles plus the 37 original guides and replaces original source illustrations with newly generated images. `npm run blog:verify` audits that full request and must fail when those source articles have not been imported. `blog:verify:originals` is a separate audit of the original collection, not evidence that source full text was republished.

## Deployment

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow builds the site on GitHub-hosted runners and deploys a versioned release to `ubuntu@43.172.115.22`, then verifies the site through the IP with `Host: officesdk.com`.

Deployment paths, required Actions secrets, Nginx setup, and DNS handoff are documented in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
