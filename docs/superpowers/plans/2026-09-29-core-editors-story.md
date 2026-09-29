# Core Editors Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a prominent, evidence-led product story for the four core editors and verify it locally.

**Architecture:** A standalone Astro route renders a focused React story component with static story data and local product screenshots. The home page gets a compact teaser band that links to the route; existing product, workflow, and Blog sections remain intact.

**Tech Stack:** Astro 7, React, TypeScript, lucide-react, existing `src/styles.css`, Playwright fallback, npm build.

**Spec:** `docs/superpowers/specs/2026-09-29-core-editors-story-design.md`

## Global Constraints

- Keep Northstar data explicitly illustrative.
- Do not expose authenticated Shimo URLs or document IDs.
- Do not claim runtime collaboration, AI, SDK/API save, or permission behavior without evidence.
- Preserve unrelated dirty worktree changes.
- Do not place the story under Blog.

---

### Task 1: Prepare local visual evidence

**Files:**
- Create: `public/product/core-editors/markdown-editor.png`
- Create: `public/product/core-editors/word-editor.png`
- Create: `public/product/core-editors/excel-editor.png`
- Create: `public/product/core-editors/powerpoint-editor.png`

**Interfaces:**
- Produces four local, sanitized PNGs referenced by the story component.

- [ ] Capture each authenticated editor tab at a useful desktop scale.
- [ ] Crop out browser chrome, URL, account identity, and document IDs.
- [ ] Inspect each image and record dimensions; reject any image that retains session-specific text.

### Task 2: Add the story component

**Files:**
- Create: `src/components/CoreEditorsStory.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Exports `CoreEditorsStory` for the standalone route and `CoreEditorsBand` for the home page.
- Uses a typed `EditorChapter` list with `id`, `eyebrow`, `title`, `body`, `image`, `accent`, `proof`, and `facts` fields.

- [ ] Define the four chapter records and integration boundary copy with explicit evidence labels.
- [ ] Render a responsive chapter rail, chapter sections, screenshot captions, illustrative metric strip, and CTA.
- [ ] Render the home band as a compact four-step preview with a link to `/product/core-editors`.
- [ ] Add accessible alt text and keyboard-visible links; keep decorative imagery out of the accessibility tree.
- [ ] Add scoped class names and responsive rules to the existing stylesheet.

### Task 3: Wire the route and prominent entry

**Files:**
- Create: `src/pages/product/core-editors.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/seo.ts`

**Interfaces:**
- Route renders `CoreEditorsStory` inside `SiteLayout` with canonical `/product/core-editors`.
- `siteRoutes` includes `/product/core-editors` for sitemap generation.

- [ ] Add metadata, canonical URL, and a `Product` breadcrumb-style eyebrow without Blog schema.
- [ ] Insert `CoreEditorsBand` after `WorkflowDemo` on the home page.
- [ ] Add a Product-page link in the story CTA and existing product exploration rail where appropriate.

### Task 4: Verify locally

**Files:**
- Test: generated local screenshots and route responses; no new test file required for static presentation.

- [ ] Start Astro on an available local port and request `/` and `/product/core-editors`.
- [ ] Run Playwright fallback at desktop and mobile widths; verify all four images load, CTA links resolve, and no horizontal overflow exists.
- [ ] Check the generated sitemap contains `/product/core-editors`.
- [ ] Run `npm run build` and record the exit code and generated route output.
- [ ] Review the final diff and ensure unrelated dirty files are unchanged.
