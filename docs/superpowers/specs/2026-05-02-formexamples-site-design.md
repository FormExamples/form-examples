# FormExamples.com — Site Design

**Date:** 2026-05-02
**Repo path:** `formexamples.github.io/`
**Custom domain:** `formexamples.com`
**Status:** Approved for implementation planning

## Purpose

Build a public-facing, multi-page website at `formexamples.com` that explains
the `medical-forms` parent monorepo: what it contains, how forms are
structured, what tech stacks are used, what compliance frameworks it
references, and how a developer can get started. Audience: prospective
contributors, healthcare-tech engineers, and anyone evaluating the project.

The site is informational only. No interactive forms, no scoring engine, no
authentication, no per-form detail pages.

## Scope

**In scope:**

- Six static pages: Home, Forms, Architecture, Tech stacks, Compliance, Get started
- Documentation-style layout (sticky header, left sidebar, max-width prose)
- Build-time generation of the form-slug list from the monorepo's `forms/` directory
- GitHub Actions deploy on push to `main` (path-filtered to `formexamples.github.io/**`)
- Custom domain via `CNAME` file
- Light + dark mode

**Out of scope:**

- Per-form pages (one page per slug)
- Search, filtering, or any client-side interactivity beyond dark-mode toggle and mobile sidebar
- Automated tests (unit, integration, visual)
- Analytics
- Internationalization
- A CMS or admin interface
- Hand-maintained changelog or news feed

## Architecture

### Stack

- **Framework:** SvelteKit
- **Adapter:** `@sveltejs/adapter-static` with full prerendering
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Inter (UI) + JetBrains Mono (code), self-hosted via `@fontsource`
- **Build tool:** Vite (via SvelteKit)
- **Node:** v20+

Every route is prerendered to static HTML at build time. There is no runtime
JavaScript framework requirement on the deployed site beyond what SvelteKit's
hydrated bundle provides for the dark-mode toggle and mobile drawer.

### Repo layout

```
formexamples.github.io/
  package.json
  svelte.config.js              # adapter-static, prerender = true
  vite.config.ts
  tsconfig.json
  tailwind.config.js
  .gitignore                    # includes src/lib/data/forms.generated.ts
  .github/workflows/
    deploy.yml                  # build + publish on push to main
  scripts/
    generate-forms-data.ts      # reads ../forms/, writes forms.generated.ts
  src/
    app.html
    app.css                     # Tailwind entry
    lib/
      components/
        Header.svelte
        Sidebar.svelte
        Footer.svelte
        CategoryTable.svelte
        CodeBlock.svelte
        ReferenceCard.svelte
        OnThisPage.svelte
      data/
        categories.ts           # hand-maintained 12-row category table
        forms.generated.ts      # gitignored; regenerated each build
    routes/
      +layout.svelte            # shell: header + sidebar + main + footer
      +layout.ts                # export const prerender = true
      +page.svelte              # Home
      forms/+page.svelte
      architecture/+page.svelte
      tech-stacks/+page.svelte
      compliance/+page.svelte
      get-started/+page.svelte
  static/
    CNAME                       # contents: formexamples.com
    .nojekyll                   # bypasses Jekyll on GitHub Pages
    favicon.svg
```

### Why SvelteKit static

- Matches the monorepo's existing front-end stack — contributors already know Svelte
- Component reuse across the six pages (Header, Sidebar, CategoryTable, CodeBlock)
- Full prerender means GitHub Pages serves plain HTML — no SSR, no API runtime
- Modern, well-maintained tooling (Vite, Tailwind v4)

### No `paths.base`

`formexamples.github.io` is a user/org-style GitHub Pages repo served at the
domain root, plus a custom domain. There is no repo-name subpath to account
for, so `kit.paths.base` stays at the empty default. All internal links can
be plain absolute paths (`/forms/`, `/architecture/`).

## Content sections

Content sourcing rule: prose is copied verbatim from the monorepo's
`index.md`, `AGENTS.md`, and `AGENTS/*.md` whenever possible, so the site
remains consistent with the canonical documentation. Updates to those source
docs require a manual sync to the site.

### Home (`/`)

- Project name and tagline ("116 medical-form reference implementations")
- Two-sentence intro from `index.md`
- "What's in the repo" — bulleted: 116 forms, SQL migrations, XML+DTD, FHIR R5, four front-end implementations, Rust full stack
- Compact category list (12 categories with one-line examples)
- "How a form is structured" — short code block of the per-form directory layout
- CTA: "Browse on GitHub →" linking to `https://github.com/joelparkerhenderson/medical-forms`

### Forms (`/forms/`)

- Full 12-row category table from `index.md`
- Alphabetical list of all form slugs from `src/lib/data/forms.generated.ts`
- Each slug links to `https://github.com/joelparkerhenderson/medical-forms/tree/main/forms/<slug>`

### Architecture (`/architecture/`)

- Per-form directory layout (the tree from `index.md`)
- Three design-pattern subsections — Form, Dashboard, Backend (bullets from `index.md`)
- Conventions list (camelCase / snake_case, UUIDv4, timestamps, etc.)

### Tech stacks (`/tech-stacks/`)

Five subsections, one per stack doc in `AGENTS/`:

1. Front-end with SvelteKit / Tailwind / SVAR
2. Full-stack with Rust / axum / Loco / Tera / HTMX / Alpine.js
3. SQL migrations
4. XML representations
5. FHIR HL7 R5 representations

Each subsection: 2–3 paragraph summary plus a link to the corresponding `AGENTS/*.md` on GitHub.

### Compliance (`/compliance/`)

Four reference cards (using the `ReferenceCard` component):

- MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification
- UK Medical Devices Regulations 2002
- ISO/IEC/IEEE 26514:2022
- UK MHRA — Software and AI as a Medical Device

Each card: short description plus outbound link (URLs from `index.md`).

### Get started (`/get-started/`)

- Clone the repo
- Install Loco (`cargo install loco`) and `sea-orm-cli`
- Postgres role + database setup snippets (from `index.md`)
- `bin/create-form <slug>` to scaffold a new form
- `bin/test` to verify

## Visual design

### Layout

- **Top header** (sticky, ~56px): project name on the left; GitHub link + dark-mode toggle on the right
- **Left sidebar** (~240px on desktop): six section links, current page highlighted; collapses to a hamburger drawer below 768px
- **Main content** (max-width ~768px): page heading, then prose with generous line-height
- **Right-rail TOC** (`OnThisPage`): only on pages with 3+ H2s (Architecture, Tech stacks); hides below 1280px
- **Footer**: short, with copyright and a GitHub link

### Type & color

- **UI font:** Inter
- **Code font:** JetBrains Mono
- **Background:** `#ffffff` (light) / `#0b0f14` (dark)
- **Body text:** `#0f172a` (light) / `#e2e8f0` (dark) — slate-900 / slate-200
- **Accent:** `#0d9488` (teal-600) — links, current-page indicator, code-block borders
- **Muted:** `#64748b` (slate-500) — secondary text
- **Code block bg:** `#f8fafc` (light) / `#0f172a` (dark)
- **Headings:** weight 600, slightly tighter tracking — H1 ~30px, H2 ~22px, H3 ~17px
- **Body:** 16px / 1.65 line-height

### Components

- `Header`, `Sidebar`, `Footer` — layout shell, used in `+layout.svelte`
- `CategoryTable` — renders the 12-row category table on Home and Forms
- `CodeBlock` — wraps `<pre><code>` with the Tailwind palette above; no syntax highlighting
- `ReferenceCard` — outbound-link card for the Compliance page
- `OnThisPage` — right-rail TOC

### Dark mode

Tailwind `dark:` variants. Toggle in the header. Persists via `localStorage`.
Defaults to system preference (`prefers-color-scheme`).

### Responsive

- Sidebar collapses below 768px to a hamburger drawer
- Tables become horizontally scrollable
- Right-rail TOC hides below 1280px

### Accessibility

- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- Skip-to-content link as the first focusable element
- Focus rings via Tailwind defaults
- Color contrast ≥ WCAG AA in both themes

## Data sourcing & build pipeline

### Two kinds of content

1. **Static prose** — hand-copied from monorepo `index.md`, `AGENTS.md`, and `AGENTS/*.md` into Svelte components. Updates require manual sync (acceptable given low frequency).
2. **Form list** — the 116 form slugs, generated at build time from the monorepo's `forms/` directory.

### Form-list generation

`scripts/generate-forms-data.ts`:

- Reads `../forms/` via the filesystem
- Filters to subdirectories (excludes `AGENTS.md`, `CLAUDE.md`)
- For each slug, reads the first `# H1` line from `forms/<slug>/index.md` to derive a human title; falls back to a humanized slug if missing
- Writes `src/lib/data/forms.generated.ts` exporting:

```ts
export type Form = { slug: string; title: string };
export const forms: Form[] = [ /* ... */ ];
```

The generated file is gitignored (`src/lib/data/forms.generated.ts` listed in
`.gitignore`). It is always regenerated from source and never committed.

The category table stays hand-maintained in `src/lib/data/categories.ts`,
since the categories are a curated grouping not derivable from filesystem
state.

### `package.json` scripts

```json
{
  "prebuild": "tsx scripts/generate-forms-data.ts",
  "build": "vite build",
  "dev": "tsx scripts/generate-forms-data.ts && vite dev",
  "preview": "vite preview",
  "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
}
```

### GitHub Actions deploy

`.github/workflows/deploy.yml`:

- **Trigger:** push to `main`, path-filtered to `formexamples.github.io/**`
- **Permissions:** `pages: write`, `id-token: write`
- **Concurrency:** `group: pages, cancel-in-progress: false`
- **Steps:**
  1. `actions/checkout@v4` — checks out the full repo (so `../forms/` is accessible during build)
  2. `actions/setup-node@v4` with Node 20
  3. `npm ci` (working-directory `formexamples.github.io`)
  4. `npm run check`
  5. `npm run build`
  6. `actions/configure-pages@v5`
  7. `actions/upload-pages-artifact@v3` — uploads `formexamples.github.io/build/`
  8. `actions/deploy-pages@v4`

This is the modern GitHub Pages deploy flow — no `gh-pages` branch, no
`peaceiris/actions-gh-pages`, no separate publishing step.

### Custom domain

`static/CNAME` contains a single line:

```
formexamples.com
```

SvelteKit's static-asset handling copies it into the build output. The
domain still requires DNS records pointing at GitHub Pages on the user's
registrar — that is a one-time manual setup outside this site's scope.

## Testing & verification

### Local (before commit)

- `npm run check` — `svelte-check` for type errors
- `npm run build` — must succeed; verifies all routes prerender
- `npm run preview` — manual smoke test at `http://localhost:4173/`

### Manual smoke checklist (after `npm run preview`)

- Home renders; all six sidebar links present; active state correct
- Click each of the six pages; all load; no broken links; no console errors
- Forms page lists all form slugs found by the generator
- All external GitHub links resolve to the right URLs
- Toggle dark mode — colors invert; persists on reload
- Resize to mobile width — sidebar collapses to hamburger; drawer opens
- Tab through the page — focus rings visible; skip-to-content link works
- View page source — `.html` files contain real content (proves prerender worked)

### CI (in GitHub Actions, before deploy step)

- `npm ci`
- `npm run check`
- `npm run build` — fails the workflow if any route can't prerender
- Deploy step only runs if all of the above pass

### No automated tests

The site is informational with no logic, no forms, no scoring. Vitest /
Playwright would be over-engineering. If interactive features are added
later (search, filters), tests can be added then.

### Post-deploy verification (one-time, after first deploy)

- `https://formexamples.com/` resolves and renders
- `dig formexamples.com` shows GitHub Pages IPs (`185.199.108.153` etc.) or a CNAME to `joelparkerhenderson.github.io`
- Repo Settings → Pages shows "Your site is live at formexamples.com" with HTTPS enforced

## Open questions

None at design time. Any future questions about content updates (when
monorepo docs change, who syncs them to the site) are operational, not
design-time.

## Success criteria

- All six pages render at `https://formexamples.com/`
- Build succeeds in CI on every push to `main` that touches `formexamples.github.io/**`
- Form list reflects the current contents of `../forms/` on every build
- Site passes the manual smoke checklist
- Site passes WCAG AA contrast in both light and dark modes
