# Office SDK Overseas Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an English, SEO/GEO-ready Office SDK product website with a responsive live document demo and polished motion.

**Architecture:** Use a small React + Vite single-page application. Keep product content and demo state in `src/App.tsx`, visual tokens and responsive behavior in `src/styles.css`, and static crawler assets in `public/`. The page uses semantic sections and local state, with no external product backend.

**Tech Stack:** React 18, TypeScript, Vite, lucide-react icons, CSS animations, JSON-LD.

**Spec:** `docs/superpowers/specs/2026-09-23-officesdk-overseas-site-design.md`

## Global Constraints

- English copy is the only first-release locale.
- Do not state unverified performance, SLA, certification, customer, or pricing claims.
- Keep all primary interactions code-native and keyboard accessible.
- Respect `prefers-reduced-motion` and avoid horizontal overflow at mobile widths.
- Keep the hero free of decorative eyebrow badges unless they explain product context.

### Task 1: Scaffold the Vite application

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Create: `vite.config.ts`

- [ ] **Step 1: Create package metadata and scripts**

Use React, Vite, TypeScript, and `lucide-react`; expose `dev`, `build`, and `preview` scripts.

- [ ] **Step 2: Add the semantic HTML shell and metadata**

Set the title, description, canonical, Open Graph, Twitter, and JSON-LD tags in `index.html`; mount React at `#root`.

- [ ] **Step 3: Verify the scaffold builds**

Run `npm install` then `npm run build`. Expected: a production `dist/` directory with no TypeScript errors.

### Task 2: Implement the page composition and demo state

**Files:**
- Create: `src/App.tsx`
- Create: `src/content.ts`

- [ ] **Step 1: Define factual navigation, feature, use-case, resource, and FAQ content**

Keep all public claims within the design spec and make the FAQ text visible in the DOM.

- [ ] **Step 2: Add live demo state**

Implement `format`, `mode`, and `language` state with `useState`; connect buttons to update preview labels, toolbar state, and code snippet text.

- [ ] **Step 3: Compose semantic sections**

Build the header, hero, format strip, live demo, feature sections, use cases, resources, FAQ, CTA, and footer as focused React functions in one composition module.

### Task 3: Style the visual system and motion

**Files:**
- Create: `src/styles.css`

- [ ] **Step 1: Add design tokens and typography**

Define color, spacing, radius, shadow, and motion variables; set readable type hierarchy and focus styles.

- [ ] **Step 2: Style the hero and document preview**

Create the dark product-led first viewport, stable document mockup dimensions, responsive layout, and clear CTA hierarchy.

- [ ] **Step 3: Add section rhythm, hover states, and reduced-motion rules**

Use reveal classes, active state transitions, and a mobile breakpoint without adding card-grid repetition.

### Task 4: Add crawler assets and verify runtime behavior

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Add robots and sitemap**

Point crawlers at the canonical homepage and sitemap URL.

- [ ] **Step 2: Run the local browser flow**

Start `npm run dev -- --host 0.0.0.0`, inspect desktop and mobile, switch format/mode/language, open FAQ details, and confirm no console errors.

- [ ] **Step 3: Run the production build**

Run `npm run build` and inspect generated assets. Expected: successful build and no missing public files.
