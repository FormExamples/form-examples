# FormExamples.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a six-page static documentation site at `formexamples.com` that explains the `form-examples` parent monorepo, deployed to GitHub Pages from the `formexamples.github.io/` subdirectory of this repo.

**Architecture:** SvelteKit + `@sveltejs/adapter-static` (full prerender) + Tailwind CSS v4. Documentation-style layout (sticky header, left sidebar, max-width prose). Form-slug list is generated at build time from `../forms/`. Deploy via GitHub Actions on push to `main`.

**Tech Stack:** SvelteKit 2.x, `@sveltejs/adapter-static` 3.x, TypeScript, Tailwind CSS v4 (CSS-based config via `@tailwindcss/vite`), `@fontsource/inter` + `@fontsource/jetbrains-mono`, Node 20+.

**Spec:** `docs/superpowers/specs/2026-05-02-formexamples-site-design.md`

**Note on tests:** The spec explicitly excludes automated tests (Vitest / Playwright). Per-task verification uses `npm run check` (svelte-check) + `npm run build` (proves prerender) and manual browser smoke for UI work. Do not add Vitest or Playwright; this overrides the writing-plans skill default.

---

## File structure

Files created across all tasks:

```
formexamples.github.io/
  .gitignore                                # Task 1
  package.json                              # Task 1
  package-lock.json                         # Task 1 (generated)
  tsconfig.json                             # Task 1
  svelte.config.js                          # Task 1
  vite.config.ts                            # Task 1
  README.md                                 # Task 1
  src/
    app.html                                # Task 1
    app.css                                 # Task 1
    lib/
      components/
        Header.svelte                       # Task 4
        Sidebar.svelte                      # Task 4
        Footer.svelte                       # Task 4
        DarkModeToggle.svelte               # Task 4
        CategoryTable.svelte                # Task 5
        CodeBlock.svelte                    # Task 5
        ReferenceCard.svelte                # Task 5
        OnThisPage.svelte                   # Task 5
      data/
        categories.ts                       # Task 3
        forms.generated.ts                  # Task 3 (gitignored, generated)
      site.ts                               # Task 4 (sidebar nav config)
    routes/
      +layout.svelte                        # Task 4
      +layout.ts                            # Task 4
      +page.svelte                          # Task 6
      forms/+page.svelte                    # Task 7
      architecture/+page.svelte             # Task 8
      tech-stacks/+page.svelte              # Task 9
      compliance/+page.svelte               # Task 10
      get-started/+page.svelte              # Task 11
  scripts/
    generate-forms-data.ts                  # Task 3
  static/
    CNAME                                   # Task 2
    .nojekyll                               # Task 2
    favicon.svg                             # Task 2
  .github/workflows/
    deploy.yml                              # Task 12
```

All work happens in `formexamples.github.io/` unless noted. The repo is the parent `form-examples` git repo — there is no separate git repo for the site.

---

## Task 1: Initialize SvelteKit project with adapter-static and Tailwind v4

**Files:**
- Create: `formexamples.github.io/package.json`
- Create: `formexamples.github.io/tsconfig.json`
- Create: `formexamples.github.io/svelte.config.js`
- Create: `formexamples.github.io/vite.config.ts`
- Create: `formexamples.github.io/src/app.html`
- Create: `formexamples.github.io/src/app.css`
- Create: `formexamples.github.io/.gitignore`
- Create: `formexamples.github.io/README.md`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "formexamples-site",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "prebuild": "tsx scripts/generate-forms-data.ts",
    "build": "vite build",
    "predev": "tsx scripts/generate-forms-data.ts",
    "dev": "vite dev",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@fontsource/inter": "^5.0.0",
    "@fontsource/jetbrains-mono": "^5.0.0",
    "@sveltejs/adapter-static": "^3.0.5",
    "@sveltejs/kit": "^2.5.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "^20.0.0",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 3: Create `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    })
  }
};

export default config;
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

- [ ] **Step 5: Create `src/app.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" type="image/svg+xml" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="116 medical-form reference implementations: clinical assessments, scoring engines, SQL, FHIR R5, SvelteKit and Rust." />
    <script>
      // Apply theme synchronously to prevent flash of wrong theme.
      (function () {
        try {
          var stored = localStorage.getItem('theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var dark = stored === 'dark' || (!stored && prefersDark);
          if (dark) document.documentElement.classList.add('dark');
        } catch (_) {}
      })();
    </script>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

The inline script applies the `dark` class to `<html>` synchronously before render, preventing a flash of the wrong theme.

- [ ] **Step 6: Create `src/app.css`**

```css
@import 'tailwindcss';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/jetbrains-mono/400.css';

@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --color-accent: #0d9488;
  --color-accent-hover: #0f766e;
}

html {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: #ffffff;
  color: #0f172a;
}

.dark body {
  background-color: #0b0f14;
  color: #e2e8f0;
}

a {
  color: var(--color-accent);
}

a:hover {
  color: var(--color-accent-hover);
}
```

- [ ] **Step 7: Create `.gitignore`**

```
node_modules/
.svelte-kit/
build/
.env
.env.*
!.env.example
src/lib/data/forms.generated.ts
.DS_Store
```

- [ ] **Step 8: Create `README.md`**

```markdown
# formexamples.com

Static documentation site for the [form-examples](https://github.com/formexamples/form-examples) monorepo. Built with SvelteKit + adapter-static, deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy

Push to `main` — `.github/workflows/deploy.yml` builds and deploys to GitHub Pages automatically.

See `docs/superpowers/specs/2026-05-02-formexamples-site-design.md` (in the parent monorepo) for the design spec.
```

- [ ] **Step 9: Install dependencies**

Run from `formexamples.github.io/`:

```sh
cd formexamples.github.io && npm install
```

Expected: `package-lock.json` is created, `node_modules/` populated, no errors. (Some peer-dep warnings are acceptable.)

- [ ] **Step 10: Create a placeholder route so SvelteKit can sync**

Create `src/routes/+page.svelte` with one line:

```svelte
<h1>Hello</h1>
```

Create `src/routes/+layout.ts`:

```ts
export const prerender = true;
export const trailingSlash = 'always';
```

- [ ] **Step 11: Verify the project builds and previews**

Run from `formexamples.github.io/`:

```sh
npm run check
```

Expected: `0 errors and 0 warnings`. (Hints OK.)

```sh
npm run build
```

Expected: Vite build succeeds; `build/index.html` exists; `build/index.html` contains `<h1>Hello</h1>`.

```sh
npm run preview
```

Expected: serves on `http://localhost:4173/`. Visit it in a browser; "Hello" should render. Stop the server (Ctrl-C).

- [ ] **Step 12: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/
git commit -m "Initialize formexamples.github.io SvelteKit project with adapter-static + Tailwind v4"
```

---

## Task 2: Add static assets (CNAME, .nojekyll, favicon)

**Files:**
- Create: `formexamples.github.io/static/CNAME`
- Create: `formexamples.github.io/static/.nojekyll`
- Create: `formexamples.github.io/static/favicon.svg`

- [ ] **Step 1: Create `static/CNAME`**

Single line, no trailing newline matters but include one:

```
formexamples.com
```

- [ ] **Step 2: Create empty `static/.nojekyll`**

Create the file with zero bytes (empty content). This bypasses Jekyll on GitHub Pages.

- [ ] **Step 3: Create `static/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0d9488"/>
  <path d="M16 22h32M16 32h32M16 42h20" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 4: Verify static assets are copied to build**

```sh
cd formexamples.github.io && npm run build
```

Then verify:

```sh
ls -la build/CNAME build/.nojekyll build/favicon.svg
cat build/CNAME
```

Expected: all three files exist; `CNAME` contains `formexamples.com`.

- [ ] **Step 5: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/static/
git commit -m "Add CNAME, .nojekyll, and favicon for formexamples.com"
```

---

## Task 3: Form-list generator and category data

**Files:**
- Create: `formexamples.github.io/scripts/generate-forms-data.ts`
- Create: `formexamples.github.io/src/lib/data/categories.ts`

- [ ] **Step 1: Create `scripts/generate-forms-data.ts`**

```ts
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FORMS_DIR = resolve(__dirname, '..', '..', 'forms');
const OUT_PATH = resolve(__dirname, '..', 'src', 'lib', 'data', 'forms.generated.ts');

type Form = { slug: string; title: string };

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function readTitle(slug: string): string {
  const indexPath = join(FORMS_DIR, slug, 'index.md');
  try {
    const content = readFileSync(indexPath, 'utf-8');
    const match = content.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    // index.md missing or unreadable — fall through
  }
  return humanizeSlug(slug);
}

function main() {
  const entries = readdirSync(FORMS_DIR);
  const forms: Form[] = [];

  for (const entry of entries) {
    const fullPath = join(FORMS_DIR, entry);
    let isDir = false;
    try {
      isDir = statSync(fullPath).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;
    forms.push({ slug: entry, title: readTitle(entry) });
  }

  forms.sort((a, b) => a.slug.localeCompare(b.slug));

  const body = `// AUTO-GENERATED by scripts/generate-forms-data.ts. Do not edit by hand.\n\nexport type Form = { slug: string; title: string };\n\nexport const forms: Form[] = ${JSON.stringify(forms, null, 2)};\n`;

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, body, 'utf-8');
  console.log(`Generated ${forms.length} forms → ${OUT_PATH}`);
}

main();
```

- [ ] **Step 2: Create `src/lib/data/categories.ts`**

```ts
export type Category = {
  name: string;
  examples: string;
};

export const categories: Category[] = [
  { name: 'Risk scores & calculators', examples: 'Framingham, QRISK3-based heart health check, PREVENT, SCORE2-Diabetes' },
  { name: 'Specialty assessments', examples: 'Cardiology (NYHA/CCS), Oncology (ECOG), Pulmonology (GOLD), Renal (KDIGO)' },
  { name: 'Symptom scales', examples: 'PHQ-9, GAD-7, PCL-5, DLQI, PSQI, ESAS-r, SNOT-22, DHI' },
  { name: 'Pre-op / peri-op', examples: 'Pre-operative assessment (ASA), Anesthesiology, Post-operative report' },
  { name: 'Safety & safeguarding', examples: 'Fall risk, Casualty card (NEWS2), Medical error report, Consent' },
  { name: 'Administrative', examples: 'Patient intake, Medical records release, Hospital discharge, Transfer' },
  { name: 'Donation & eligibility', examples: 'Blood donation (JPAC), Organ donation, Bone marrow, Semaglutide' },
  { name: 'Occupational & workplace', examples: 'Workplace safety (HSE), Workplace stress, Workplace climate, Ergonomics' },
  { name: 'Training & certification', examples: 'CPR training, First aid, EMT psychomotor, Medical language speaking' },
  { name: 'Privacy & legal', examples: 'Care privacy notice, Code of conduct notice, Research privacy notice' },
  { name: 'WHO referral & emergency', examples: 'Acute referral, Counter-referral, Prehospital, Emergency unit forms' },
  { name: 'UK statutory', examples: 'DVLA B1/M1/V1, MAT B1 maternity certificate' }
];
```

- [ ] **Step 3: Verify the generator works**

```sh
cd formexamples.github.io && npx tsx scripts/generate-forms-data.ts
```

Expected: prints `Generated N forms → /.../src/lib/data/forms.generated.ts` where N is roughly 115–117. Then:

```sh
head -20 src/lib/data/forms.generated.ts
```

Expected: shows the AUTO-GENERATED header and the start of the array with real form slugs (e.g., `advance-decision-to-refuse-treatment`, `allergy-assessment`).

- [ ] **Step 4: Verify `prebuild` invokes the generator**

```sh
rm -f src/lib/data/forms.generated.ts
npm run build
ls -la src/lib/data/forms.generated.ts
```

Expected: `forms.generated.ts` is recreated by the `prebuild` script; `npm run build` succeeds.

- [ ] **Step 5: Confirm the generated file is gitignored**

```sh
cd /Users/jph/git/formexamples/form-examples && git status formexamples.github.io/src/lib/data/forms.generated.ts
```

Expected: file is not listed (it is ignored by `.gitignore`).

- [ ] **Step 6: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/scripts/ formexamples.github.io/src/lib/data/categories.ts
git commit -m "Add form-list generator and category data for formexamples site"
```

---

## Task 4: Layout shell — Header, Sidebar, Footer, dark-mode toggle

**Files:**
- Create: `formexamples.github.io/src/lib/site.ts`
- Create: `formexamples.github.io/src/lib/components/Header.svelte`
- Create: `formexamples.github.io/src/lib/components/Sidebar.svelte`
- Create: `formexamples.github.io/src/lib/components/Footer.svelte`
- Create: `formexamples.github.io/src/lib/components/DarkModeToggle.svelte`
- Modify: `formexamples.github.io/src/routes/+layout.svelte`
- Modify: `formexamples.github.io/src/routes/+layout.ts` (already created in Task 1)

- [ ] **Step 1: Create `src/lib/site.ts`** — single source of truth for nav

```ts
export type NavLink = { href: string; label: string };

export const SITE_NAME = 'FormExamples';
export const SITE_TAGLINE = '116 medical-form reference implementations';
export const REPO_URL = 'https://github.com/formexamples/form-examples';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/forms/', label: 'Forms' },
  { href: '/architecture/', label: 'Architecture' },
  { href: '/tech-stacks/', label: 'Tech stacks' },
  { href: '/compliance/', label: 'Compliance' },
  { href: '/get-started/', label: 'Get started' }
];
```

- [ ] **Step 2: Create `src/lib/components/DarkModeToggle.svelte`**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggle() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  class="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
>
  {#if isDark}
    <!-- Sun icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  {:else}
    <!-- Moon icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  {/if}
</button>
```

- [ ] **Step 3: Create `src/lib/components/Header.svelte`**

```svelte
<script lang="ts">
  import { SITE_NAME, REPO_URL } from '$lib/site';
  import DarkModeToggle from './DarkModeToggle.svelte';

  type Props = { onMenuToggle?: () => void };
  let { onMenuToggle }: Props = $props();
</script>

<header class="sticky top-0 z-30 h-14 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
  <div class="flex h-full items-center justify-between px-4 sm:px-6">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="Toggle navigation"
        onclick={() => onMenuToggle?.()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <a href="/" class="font-semibold text-slate-900 hover:no-underline dark:text-slate-100">{SITE_NAME}</a>
    </div>
    <div class="flex items-center gap-1">
      <a
        href={REPO_URL}
        rel="noopener noreferrer"
        class="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:no-underline dark:text-slate-300 dark:hover:bg-slate-800"
      >
        GitHub
      </a>
      <DarkModeToggle />
    </div>
  </div>
</header>
```

- [ ] **Step 4: Create `src/lib/components/Sidebar.svelte`**

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import { navLinks } from '$lib/site';

  type Props = { open?: boolean; onClose?: () => void };
  let { open = false, onClose }: Props = $props();

  function isActive(href: string): boolean {
    const current = page.url.pathname;
    if (href === '/') return current === '/' || current === '';
    return current.startsWith(href);
  }
</script>

<!-- Mobile backdrop -->
{#if open}
  <button
    type="button"
    class="fixed inset-0 top-14 z-20 bg-slate-900/40 md:hidden"
    aria-label="Close navigation"
    onclick={() => onClose?.()}
  ></button>
{/if}

<aside
  class="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-60 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 md:sticky md:translate-x-0
    {open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
  aria-label="Section navigation"
>
  <nav class="p-4">
    <ul class="space-y-1">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="block rounded-md px-3 py-2 text-sm hover:no-underline
              {isActive(link.href)
                ? 'bg-teal-50 font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}"
            onclick={() => onClose?.()}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>
```

- [ ] **Step 5: Create `src/lib/components/Footer.svelte`**

```svelte
<script lang="ts">
  import { REPO_URL } from '$lib/site';
  const year = new Date().getFullYear();
</script>

<footer class="mt-16 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
  <div class="px-4 sm:px-6">
    © {year} —
    <a href={REPO_URL} rel="noopener noreferrer">form-examples on GitHub</a>
  </div>
</footer>
```

- [ ] **Step 6: Replace `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
  let menuOpen = $state(false);
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow dark:focus:bg-slate-900 dark:focus:text-slate-100"
>
  Skip to content
</a>

<Header onMenuToggle={() => (menuOpen = !menuOpen)} />

<div class="md:grid md:grid-cols-[15rem_1fr]">
  <Sidebar open={menuOpen} onClose={() => (menuOpen = false)} />
  <main id="main-content" class="min-w-0">
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {@render children()}
    </div>
    <Footer />
  </main>
</div>
```

- [ ] **Step 7: Update `src/routes/+layout.ts` (already exists, confirm contents)**

```ts
export const prerender = true;
export const trailingSlash = 'always';
```

- [ ] **Step 8: Update placeholder `src/routes/+page.svelte` so the layout has something to render**

```svelte
<h1 class="text-3xl font-semibold">FormExamples</h1>
<p class="mt-4">Layout shell smoke test — replaced in Task 6.</p>
```

- [ ] **Step 9: Verify**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Expected:
- `check` reports 0 errors
- `build` succeeds; `build/index.html` exists
- `preview` serves at `http://localhost:4173/`

In the browser:
- Header is sticky with project name and GitHub + theme toggle
- Sidebar shows on desktop with all six links
- Resize narrower than 768px — sidebar disappears, hamburger appears, click opens drawer
- Click theme toggle — colors invert; reload — preference persists
- Tab from page top — "Skip to content" link appears, then focuses heading

Stop the server (Ctrl-C).

- [ ] **Step 10: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/
git commit -m "Add layout shell with Header, Sidebar, Footer, dark-mode toggle"
```

---

## Task 5: Reusable content components — CategoryTable, CodeBlock, ReferenceCard, OnThisPage

**Files:**
- Create: `formexamples.github.io/src/lib/components/CategoryTable.svelte`
- Create: `formexamples.github.io/src/lib/components/CodeBlock.svelte`
- Create: `formexamples.github.io/src/lib/components/ReferenceCard.svelte`
- Create: `formexamples.github.io/src/lib/components/OnThisPage.svelte`

- [ ] **Step 1: Create `src/lib/components/CategoryTable.svelte`**

```svelte
<script lang="ts">
  import { categories } from '$lib/data/categories';
</script>

<div class="my-6 overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-slate-200 dark:border-slate-700">
        <th class="px-3 py-2 text-left font-semibold">Category</th>
        <th class="px-3 py-2 text-left font-semibold">Examples</th>
      </tr>
    </thead>
    <tbody>
      {#each categories as cat}
        <tr class="border-b border-slate-100 dark:border-slate-800">
          <td class="px-3 py-2 font-medium">{cat.name}</td>
          <td class="px-3 py-2 text-slate-600 dark:text-slate-400">{cat.examples}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: Create `src/lib/components/CodeBlock.svelte`**

```svelte
<script lang="ts">
  type Props = { children: import('svelte').Snippet };
  let { children }: Props = $props();
</script>

<pre class="my-4 overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900"><code>{@render children()}</code></pre>
```

- [ ] **Step 3: Create `src/lib/components/ReferenceCard.svelte`**

```svelte
<script lang="ts">
  type Props = { title: string; href: string; description: string };
  let { title, href, description }: Props = $props();
</script>

<a
  {href}
  rel="noopener noreferrer"
  class="block rounded-lg border border-slate-200 p-5 no-underline transition hover:border-teal-500 hover:shadow-sm dark:border-slate-700 dark:hover:border-teal-500"
>
  <div class="font-semibold text-slate-900 dark:text-slate-100">{title}</div>
  <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
</a>
```

- [ ] **Step 4: Create `src/lib/components/OnThisPage.svelte`**

```svelte
<script lang="ts">
  type Section = { id: string; label: string };
  type Props = { sections: Section[] };
  let { sections }: Props = $props();
</script>

<aside class="hidden xl:fixed xl:right-8 xl:top-24 xl:block xl:w-56" aria-label="On this page">
  <div class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">On this page</div>
  <ul class="mt-3 space-y-2 text-sm">
    {#each sections as s}
      <li>
        <a href={`#${s.id}`} class="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300">{s.label}</a>
      </li>
    {/each}
  </ul>
</aside>
```

- [ ] **Step 5: Verify components type-check**

```sh
cd formexamples.github.io && npm run check
```

Expected: 0 errors.

- [ ] **Step 6: Verify build still passes**

```sh
npm run build
```

Expected: success.

- [ ] **Step 7: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/lib/components/
git commit -m "Add reusable components: CategoryTable, CodeBlock, ReferenceCard, OnThisPage"
```

---

## Task 6: Home page

**Files:**
- Modify: `formexamples.github.io/src/routes/+page.svelte`

- [ ] **Step 1: Replace `src/routes/+page.svelte`**

```svelte
<script lang="ts">
  import { SITE_NAME, SITE_TAGLINE, REPO_URL } from '$lib/site';
  import CategoryTable from '$lib/components/CategoryTable.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>{SITE_NAME} — {SITE_TAGLINE}</title>
</svelte:head>

<h1 class="text-3xl font-semibold tracking-tight">{SITE_NAME}</h1>
<p class="mt-2 text-lg text-slate-600 dark:text-slate-400">{SITE_TAGLINE}</p>

<p class="mt-6">
  Medical forms monorepo for structured clinical assessments, patient intake,
  cardiovascular risk calculators, administrative healthcare documents,
  privacy notices, and staff training checklists. Each project collects data
  via a single-page, step-by-step questionnaire, applies a validated scoring
  or grading engine, and generates a clinical report with flagged issues.
</p>

<h2 class="mt-10 text-xl font-semibold">What's in the repo</h2>
<ul class="mt-4 list-disc space-y-1 pl-6">
  <li>116 form projects, each in <code>forms/&lt;slug&gt;/</code></li>
  <li>PostgreSQL SQL migrations (Liquibase SQL format)</li>
  <li>XML + DTD representations per SQL entity</li>
  <li>FHIR HL7 R5 JSON resources per SQL entity</li>
  <li>Four front-end implementations per form (form and dashboard, each in HTML and SvelteKit)</li>
  <li>Full-stack Rust implementation (axum + Loco + Tera + HTMX + Alpine.js)</li>
</ul>

<h2 class="mt-10 text-xl font-semibold">Form categories</h2>
<CategoryTable />

<h2 class="mt-10 text-xl font-semibold">How a form is structured</h2>
<p class="mt-4">Each form lives in <code>forms/&lt;slug&gt;/</code> with a consistent layout:</p>
<CodeBlock>{`forms/<slug>/
  index.md                                  # Form description + scoring system
  AGENTS.md                                 # Agent instructions
  sql/                           # PostgreSQL Liquibase migrations
  xml-representations/                      # XML + DTD per SQL table entity
  fhir-r5/                                  # FHIR HL7 R5 JSON per SQL entity
  front-end-form-with-html/                 # Patient questionnaire (HTML)
  front-end-form-with-svelte/               # Patient questionnaire (SvelteKit)
  front-end-dashboard-with-html/            # Dashboard (HTML)
  front-end-dashboard-with-svelte/          # Dashboard (SvelteKit)
  full-stack-with-loco-tera-htmx-alpine/    # Full-stack Rust backend`}</CodeBlock>

<div class="mt-10">
  <a
    href={REPO_URL}
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 font-medium text-white no-underline hover:bg-teal-700 hover:text-white"
  >
    Browse on GitHub →
  </a>
</div>
```

- [ ] **Step 2: Verify build and preview**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/`. Confirm:
- Title and tagline render
- Bulleted list shows 6 items
- Category table shows all 12 rows
- Code block shows the per-form layout
- "Browse on GitHub →" button links to the correct URL

Stop the server.

- [ ] **Step 3: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/routes/+page.svelte
git commit -m "Add Home page for formexamples site"
```

---

## Task 7: Forms page

**Files:**
- Create: `formexamples.github.io/src/routes/forms/+page.svelte`

- [ ] **Step 1: Create `src/routes/forms/+page.svelte`**

```svelte
<script lang="ts">
  import CategoryTable from '$lib/components/CategoryTable.svelte';
  import { forms } from '$lib/data/forms.generated';
  import { REPO_URL } from '$lib/site';

  function formUrl(slug: string): string {
    return `${REPO_URL}/tree/main/forms/${slug}`;
  }
</script>

<svelte:head>
  <title>Forms — FormExamples</title>
</svelte:head>

<h1 class="text-3xl font-semibold tracking-tight">Forms</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">All {forms.length} medical-form projects in the monorepo, grouped by category.</p>

<h2 class="mt-10 text-xl font-semibold">Categories</h2>
<CategoryTable />

<h2 class="mt-10 text-xl font-semibold">All forms ({forms.length})</h2>
<ul class="mt-4 columns-1 gap-x-8 sm:columns-2">
  {#each forms as form}
    <li class="break-inside-avoid py-1">
      <a href={formUrl(form.slug)} rel="noopener noreferrer">{form.title}</a>
      <span class="ml-1 text-xs text-slate-500 dark:text-slate-400">{form.slug}</span>
    </li>
  {/each}
</ul>
```

- [ ] **Step 2: Verify**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/forms/`. Confirm:
- Heading shows correct count (e.g., "All forms (115)")
- Category table renders
- Form list is alphabetical, two columns on wide screens
- Clicking any slug opens the right GitHub URL in a new tab

Stop the server.

- [ ] **Step 3: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/routes/forms/
git commit -m "Add Forms page for formexamples site"
```

---

## Task 8: Architecture page

**Files:**
- Create: `formexamples.github.io/src/routes/architecture/+page.svelte`

- [ ] **Step 1: Create `src/routes/architecture/+page.svelte`**

```svelte
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import OnThisPage from '$lib/components/OnThisPage.svelte';

  const sections = [
    { id: 'directory-layout', label: 'Directory layout' },
    { id: 'design-patterns', label: 'Design patterns' },
    { id: 'conventions', label: 'Conventions' }
  ];
</script>

<svelte:head>
  <title>Architecture — FormExamples</title>
</svelte:head>

<OnThisPage {sections} />

<h1 class="text-3xl font-semibold tracking-tight">Architecture</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">How each form project is laid out and the design patterns shared across them.</p>

<h2 id="directory-layout" class="mt-10 text-xl font-semibold">Directory layout</h2>
<p class="mt-4">Each form lives in <code>forms/&lt;slug&gt;/</code> with a consistent layout:</p>
<CodeBlock>{`forms/<slug>/
  index.md                                  # Form description + scoring system
  README.md -> index.md                     # Symlink for GitHub rendering
  AGENTS.md                                 # Agent instructions for this form
  CLAUDE.md                                 # Claude Code project instructions
  plan.md                                   # Implementation plan and status
  tasks.md                                  # Task tracking
  doc/                                      # Documentation and references
  sql/                           # PostgreSQL Liquibase migrations
  xml-representations/                      # XML + DTD per SQL table entity
  fhir-r5/                                  # FHIR HL7 R5 JSON per SQL entity
  front-end-form-with-html/                 # Patient questionnaire (HTML)
  front-end-form-with-svelte/               # Patient questionnaire (SvelteKit)
  front-end-dashboard-with-html/            # Dashboard (HTML)
  front-end-dashboard-with-svelte/          # Dashboard (SvelteKit)
  full-stack-with-loco-tera-htmx-alpine/    # Full-stack Rust backend`}</CodeBlock>

<h2 id="design-patterns" class="mt-10 text-xl font-semibold">Design patterns</h2>

<h3 class="mt-6 text-lg font-semibold">Form</h3>
<ol class="mt-3 list-decimal space-y-1 pl-6">
  <li>Single-page, step-by-step wizard with <code>StepNavigation</code> and <code>ProgressBar</code></li>
  <li>Pure scoring engine: <code>types.ts</code> → <code>*-rules.ts</code> → <code>*-grader.ts</code> → <code>flagged-issues.ts</code></li>
  <li>Class-based Svelte 5 reactive store (<code>assessment.svelte.ts</code>) — no Svelte stores</li>
  <li>PDF report generation via SvelteKit server endpoint (<code>/report/pdf</code>)</li>
  <li>Vitest unit tests for grading logic</li>
</ol>

<h3 class="mt-6 text-lg font-semibold">Dashboard</h3>
<ul class="mt-3 list-disc space-y-1 pl-6">
  <li>SVAR DataGrid with sortable columns and dropdown filters</li>
  <li>Willow theme wrapper for consistent styling</li>
  <li>Backend API client with sample data fallback</li>
  <li>Row list with computed scores, severities, and safety flags</li>
</ul>

<h3 class="mt-6 text-lg font-semibold">Backend</h3>
<ul class="mt-3 list-disc space-y-1 pl-6">
  <li>Loco framework with axum routing (port 5150 in development)</li>
  <li>Rust scoring engine mirrors TypeScript types with <code>serde(rename_all = "camelCase")</code></li>
  <li>SeaORM entities against PostgreSQL 18</li>
  <li>Tera templates with <code>&lt;body hx-boost="true"&gt;</code> for HTMX-driven navigation</li>
</ul>

<h2 id="conventions" class="mt-10 text-xl font-semibold">Conventions</h2>
<ul class="mt-4 list-disc space-y-1 pl-6">
  <li>Empty string <code>''</code> for unanswered text fields; <code>null</code> for unanswered numeric fields</li>
  <li>camelCase property names in TypeScript; snake_case in SQL and Rust</li>
  <li>Step components named <code>StepNName.svelte</code> (1-indexed)</li>
  <li>UI components in <code>src/lib/components/ui/</code></li>
  <li><code>serde(rename_all = "camelCase")</code> on Rust structs shared with the front-end</li>
  <li>UUIDv4 primary keys; <code>created_at</code> + <code>updated_at</code> timestamps on every table</li>
</ul>
```

- [ ] **Step 2: Verify**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/architecture/`. Confirm:
- Three H2 sections render in order
- Code block shows the per-form layout
- Right-rail "On this page" appears at viewport ≥ 1280px (resize wider to test)
- All anchor links work (clicking "Conventions" jumps down)

Stop the server.

- [ ] **Step 3: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/routes/architecture/
git commit -m "Add Architecture page for formexamples site"
```

---

## Task 9: Tech stacks page

**Files:**
- Create: `formexamples.github.io/src/routes/tech-stacks/+page.svelte`

- [ ] **Step 1: Create `src/routes/tech-stacks/+page.svelte`**

```svelte
<script lang="ts">
  import OnThisPage from '$lib/components/OnThisPage.svelte';
  import { REPO_URL } from '$lib/site';

  const sections = [
    { id: 'sveltekit', label: 'SvelteKit / Tailwind / SVAR' },
    { id: 'rust', label: 'Rust / axum / Loco / HTMX' },
    { id: 'sql', label: 'SQL migrations' },
    { id: 'xml', label: 'XML representations' },
    { id: 'fhir', label: 'FHIR HL7 R5' }
  ];

  function agentDoc(filename: string): string {
    return `${REPO_URL}/blob/main/AGENTS/${filename}`;
  }
</script>

<svelte:head>
  <title>Tech stacks — FormExamples</title>
</svelte:head>

<OnThisPage {sections} />

<h1 class="text-3xl font-semibold tracking-tight">Tech stacks</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">Each form is implemented across several stacks. The links go to the per-stack agent docs in the monorepo.</p>

<h2 id="sveltekit" class="mt-10 text-xl font-semibold">Front-end with SvelteKit / Tailwind / SVAR</h2>
<p class="mt-4">
  Each form ships a SvelteKit app with a single-page, step-by-step wizard backed by a class-based
  Svelte 5 reactive store. Grading is a pure TypeScript pipeline (<code>types.ts</code> → <code>*-rules.ts</code> →
  <code>*-grader.ts</code> → <code>flagged-issues.ts</code>) with Vitest unit tests, and a PDF report is rendered by a
  SvelteKit server endpoint at <code>/report/pdf</code>.
</p>
<p class="mt-4">
  Each form also ships a SvelteKit dashboard built on the SVAR DataGrid (Willow theme), with sortable
  columns, dropdown filters, computed scores and severities, and a backend API client that falls back
  to sample data when the backend isn't running.
</p>
<p class="mt-4">
  <a href={agentDoc('front-end-with-sveltekit-tailwind-svar.md')} rel="noopener noreferrer">Read the SvelteKit stack doc →</a>
</p>

<h2 id="rust" class="mt-10 text-xl font-semibold">Full-stack with Rust / axum / Loco / Tera / HTMX / Alpine.js</h2>
<p class="mt-4">
  Each form has a full-stack Rust implementation built on the Loco framework with axum routing, SeaORM
  against PostgreSQL 18, and Tera templates rendered with <code>&lt;body hx-boost="true"&gt;</code> for HTMX-driven
  navigation. Alpine.js handles per-page interactivity.
</p>
<p class="mt-4">
  The Rust scoring engine mirrors the TypeScript types using <code>serde(rename_all = "camelCase")</code> so
  the two implementations stay aligned at their JSON boundary.
</p>
<p class="mt-4">
  <a href={agentDoc('full-stack-with-loco-tera-htmx-alpine.md')} rel="noopener noreferrer">Read the Rust stack doc →</a>
</p>

<h2 id="sql" class="mt-10 text-xl font-semibold">SQL migrations</h2>
<p class="mt-4">
  Each form has PostgreSQL migrations in Liquibase SQL format under <code>sql/</code>. Filenames
  follow <code>NN_create_table_&lt;name&gt;.sql</code>, with <code>COMMENT ON TABLE</code> and <code>COMMENT ON COLUMN</code>
  statements for every column. Primary keys are UUIDv4 and every table has <code>created_at</code> +
  <code>updated_at</code> timestamps.
</p>
<p class="mt-4">
  <a href={agentDoc('sql.md')} rel="noopener noreferrer">Read the SQL migrations doc →</a>
</p>

<h2 id="xml" class="mt-10 text-xl font-semibold">XML representations</h2>
<p class="mt-4">
  An XML + DTD pair is generated per SQL table entity. The XML schema matches the SQL schema
  one-to-one, providing an alternative wire format for systems that prefer XML over JSON.
</p>
<p class="mt-4">
  <a href={agentDoc('xml-representations.md')} rel="noopener noreferrer">Read the XML representations doc →</a>
</p>

<h2 id="fhir" class="mt-10 text-xl font-semibold">FHIR HL7 R5 representations</h2>
<p class="mt-4">
  Each SQL entity is also represented as a FHIR HL7 R5 JSON resource. This is the interoperability
  format expected by EHR systems and health-information exchanges that have standardized on FHIR R5.
</p>
<p class="mt-4">
  <a href={agentDoc('fhir-r5.md')} rel="noopener noreferrer">Read the FHIR R5 doc →</a>
</p>
```

- [ ] **Step 2: Verify**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/tech-stacks/`. Confirm:
- Five H2 sections render
- Right-rail TOC visible at ≥1280px wide
- Each "Read the … doc →" link points to a real `AGENTS/*.md` URL on GitHub

Stop the server.

- [ ] **Step 3: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/routes/tech-stacks/
git commit -m "Add Tech stacks page for formexamples site"
```

---

## Task 10: Compliance page

**Files:**
- Create: `formexamples.github.io/src/routes/compliance/+page.svelte`

- [ ] **Step 1: Create `src/routes/compliance/+page.svelte`**

```svelte
<script lang="ts">
  import ReferenceCard from '$lib/components/ReferenceCard.svelte';

  const refs = [
    {
      title: 'MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification',
      href: 'https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en',
      description: 'European Commission guidance on classifying software as a medical device under EU MDR and IVDR.'
    },
    {
      title: 'UK Medical Devices Regulations 2002',
      href: 'https://www.legislation.gov.uk/uksi/2002/618/contents',
      description: 'UK statutory instrument governing the placing of medical devices on the UK market.'
    },
    {
      title: 'ISO/IEC/IEEE 26514:2022',
      href: 'https://www.iso.org/standard/77451.html',
      description: 'International standard for the design and development of information for users of software.'
    },
    {
      title: 'UK MHRA — Software and AI as a Medical Device',
      href: 'https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device',
      description: 'UK regulator guidance on software and AI products that meet the definition of a medical device.'
    }
  ];
</script>

<svelte:head>
  <title>Compliance — FormExamples</title>
</svelte:head>

<h1 class="text-3xl font-semibold tracking-tight">Compliance</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">Reference standards and guidance the monorepo aligns to.</p>

<div class="mt-8 grid gap-4 sm:grid-cols-2">
  {#each refs as r}
    <ReferenceCard title={r.title} href={r.href} description={r.description} />
  {/each}
</div>

<p class="mt-8 text-sm text-slate-500 dark:text-slate-400">
  These references provide context for the implementation choices in the monorepo. None of the forms
  in this project have themselves been certified as medical devices.
</p>
```

- [ ] **Step 2: Verify**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/compliance/`. Confirm:
- Four cards render in a 2-column grid (single column on narrow viewport)
- Each card title and description is correct; clicking opens the right URL

Stop the server.

- [ ] **Step 3: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/routes/compliance/
git commit -m "Add Compliance page for formexamples site"
```

---

## Task 11: Get started page

**Files:**
- Create: `formexamples.github.io/src/routes/get-started/+page.svelte`

- [ ] **Step 1: Create `src/routes/get-started/+page.svelte`**

```svelte
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { REPO_URL } from '$lib/site';
</script>

<svelte:head>
  <title>Get started — FormExamples</title>
</svelte:head>

<h1 class="text-3xl font-semibold tracking-tight">Get started</h1>
<p class="mt-2 text-slate-600 dark:text-slate-400">Clone the monorepo and run a form locally.</p>

<h2 class="mt-10 text-xl font-semibold">Clone</h2>
<CodeBlock>{`git clone ${REPO_URL.replace('https://', '')}.git
cd form-examples`}</CodeBlock>

<h2 class="mt-10 text-xl font-semibold">Install Loco (Rust full stack)</h2>
<CodeBlock>{`cargo install loco
cargo install sea-orm-cli`}</CodeBlock>

<h2 class="mt-10 text-xl font-semibold">Set up PostgreSQL</h2>
<p class="mt-4">Create the role, then a database per form (example uses <code>pre_operative_assessment_by_clinician</code>):</p>
<CodeBlock>{`createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_production || :`}</CodeBlock>

<p class="mt-4">Or via psql:</p>
<CodeBlock>{`CREATE USER loco PASSWORD 'loco';
ALTER USER loco CREATEDB;
CREATE DATABASE pre_operative_assessment_by_clinician_development OWNER loco;
CREATE DATABASE pre_operative_assessment_by_clinician_test OWNER loco;`}</CodeBlock>

<h2 class="mt-10 text-xl font-semibold">Scaffold a new form</h2>
<CodeBlock>{`bin/create-form my-new-form`}</CodeBlock>
<p class="mt-4">This creates <code>forms/my-new-form/</code> with the standard directory layout (index.md, AGENTS.md, sql/, front-end-form-with-svelte/, etc.).</p>

<h2 class="mt-10 text-xl font-semibold">Verify</h2>
<CodeBlock>{`bin/test`}</CodeBlock>
<p class="mt-4">Runs structural validation across all forms.</p>

<p class="mt-10">
  Full setup details are in the
  <a href={`${REPO_URL}#install`} rel="noopener noreferrer">monorepo README</a>.
</p>
```

- [ ] **Step 2: Verify**

```sh
cd formexamples.github.io
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/get-started/`. Confirm:
- All five H2 sections render in order
- Code blocks render with monospace font, light background, scrollable on narrow viewports
- Final paragraph link points to `https://github.com/formexamples/form-examples#install`

Stop the server.

- [ ] **Step 3: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add formexamples.github.io/src/routes/get-started/
git commit -m "Add Get started page for formexamples site"
```

---

## Task 12: GitHub Actions deploy workflow

**Files:**
- Create: `formexamples.github.io/.github/workflows/deploy.yml`

Note: this workflow file lives **inside** the `formexamples.github.io/` subdirectory, but GitHub Actions only reads workflows from the **repo root** `.github/workflows/`. So the file must actually be placed at `/.github/workflows/deploy.yml` (root of `form-examples`), not inside the subdirectory.

**Corrected path:** Create `.github/workflows/deploy-formexamples.yml` at the **repo root**.

- [ ] **Step 1: Verify the repo root `.github/workflows/` directory state**

```sh
cd /Users/jph/git/formexamples/form-examples
ls -la .github/workflows/ 2>/dev/null || echo "directory does not exist"
```

If the directory does not exist, create it:

```sh
mkdir -p .github/workflows
```

- [ ] **Step 2: Create `.github/workflows/deploy-formexamples.yml` at the repo root**

```yaml
name: Deploy formexamples.com

on:
  push:
    branches: [main]
    paths:
      - 'formexamples.github.io/**'
      - 'forms/**'
      - '.github/workflows/deploy-formexamples.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: formexamples.github.io
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: formexamples.github.io/package-lock.json

      - run: npm ci

      - run: npm run check

      - run: npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: formexamples.github.io/build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Validate the YAML locally**

```sh
cd /Users/jph/git/formexamples/form-examples
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-formexamples.yml'))"
```

Expected: no output (means the YAML parses cleanly). Errors mean a syntax problem to fix.

- [ ] **Step 4: Commit**

```sh
cd /Users/jph/git/formexamples/form-examples
git add .github/workflows/deploy-formexamples.yml
git commit -m "Add GitHub Actions workflow to deploy formexamples.com on push to main"
```

- [ ] **Step 5: Note for the operator (do NOT do automatically)**

After the first push of this workflow, a human must:
1. Go to repo Settings → Pages → set Source to "GitHub Actions"
2. Add a custom domain `formexamples.com` (this writes the CNAME setting; our `static/CNAME` file backs it up)
3. Configure DNS at the domain registrar:
   - Apex record: `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or `CNAME` if subdomain → `joelparkerhenderson.github.io`
4. Wait for DNS propagation, then enable "Enforce HTTPS" in Pages settings

Do not run any of these steps from the implementation task — they require account-level access and DNS changes outside the repo.

---

## Task 13: Final smoke verification

**Files:** none (verification only)

- [ ] **Step 1: Clean build from scratch**

```sh
cd /Users/jph/git/formexamples/form-examples/formexamples.github.io
rm -rf node_modules build .svelte-kit src/lib/data/forms.generated.ts
npm ci
npm run check
npm run build
```

Expected: all three commands succeed; `build/` contains:
- `index.html`
- `forms/index.html`
- `architecture/index.html`
- `tech-stacks/index.html`
- `compliance/index.html`
- `get-started/index.html`
- `CNAME` (containing `formexamples.com`)
- `.nojekyll`
- `favicon.svg`

Verify:

```sh
ls build/ build/forms/ build/architecture/ build/tech-stacks/ build/compliance/ build/get-started/
cat build/CNAME
```

- [ ] **Step 2: Verify prerendered HTML contains real content**

```sh
grep -c "FormExamples" build/index.html
grep -c "All forms" build/forms/index.html
grep -c "Conventions" build/architecture/index.html
```

Expected: each command returns ≥1 (proving prerender embedded the content, not an empty SPA shell).

- [ ] **Step 3: Manual browser smoke (preview)**

```sh
npm run preview
```

In a browser at `http://localhost:4173/`, walk through the smoke checklist:
- [ ] Home renders; sidebar shows all six links; Home is the active item
- [ ] Click each sidebar link in order — Home, Forms, Architecture, Tech stacks, Compliance, Get started — each loads, no console errors, active state updates
- [ ] On Forms: form list shows 100+ entries, alphabetical, clicking a slug opens the right GitHub URL
- [ ] On Architecture and Tech stacks at viewport ≥1280px: right-rail "On this page" appears; clicking each entry jumps to the right H2
- [ ] On Compliance: 4 cards in a 2×2 grid; each card link opens the correct URL
- [ ] Toggle dark mode — colors invert; reload page — preference persists
- [ ] Resize to <768px — sidebar collapses to hamburger; click hamburger — drawer opens; click a link — drawer closes and navigates
- [ ] Tab from page top — "Skip to content" link appears, then jumps focus to the main heading
- [ ] View page source on `/forms/` — confirm the form list HTML is present (not lazy-loaded)

Stop the preview server.

- [ ] **Step 4: Confirm no uncommitted changes**

```sh
cd /Users/jph/git/formexamples/form-examples
git status formexamples.github.io/ .github/workflows/deploy-formexamples.yml
```

Expected: working tree clean for those paths (the generated `forms.generated.ts` is gitignored, so it won't appear).

- [ ] **Step 5: Done**

The site is ready. The GitHub Actions workflow will deploy on the next push to `main` that touches any of the watched paths. Post-deploy DNS / Pages settings are listed in Task 12 Step 5 — those are operator actions, not code actions.

---

## Self-review summary

**Spec coverage check:**

| Spec section | Implemented in task |
|---|---|
| Stack (SvelteKit, adapter-static, TS, Tailwind v4, fonts, Node 20) | Task 1 |
| Repo layout | Tasks 1–12 (each file mapped) |
| Six pages (Home, Forms, Architecture, Tech stacks, Compliance, Get started) | Tasks 6–11 |
| `paths.base` empty (custom domain) | Task 1 (svelte.config.js has no `paths`) |
| CNAME + `.nojekyll` + favicon | Task 2 |
| Form-list generation from `../forms/` | Task 3 |
| `categories.ts` hand-maintained | Task 3 |
| Layout shell (Header, Sidebar, Footer) | Task 4 |
| Dark-mode toggle, persists, system default, no flash | Task 1 (inline script) + Task 4 |
| Skip-to-content link | Task 4 |
| Mobile hamburger drawer | Task 4 |
| CategoryTable, CodeBlock, ReferenceCard, OnThisPage | Task 5 |
| Right-rail TOC on Architecture & Tech stacks | Tasks 8 + 9 |
| Type & color palette (Inter, JetBrains Mono, teal accent) | Task 1 (app.css) |
| `prebuild` script | Task 1 (package.json) |
| GitHub Actions deploy on push to `main` | Task 12 |
| Custom domain via `static/CNAME` | Task 2 |
| Verification (`check`, `build`, `preview`, manual smoke) | Task 13 |
| No automated tests (Vitest/Playwright excluded) | Honored — none added |

**Notable correction made during plan-writing:** GitHub Actions workflows must live at the repo root (`/.github/workflows/`), not inside the `formexamples.github.io/` subdirectory. Task 12 fixes the spec's repo-layout diagram by placing the workflow at `.github/workflows/deploy-formexamples.yml` instead. Path filter watches `formexamples.github.io/**`, `forms/**` (so form-list updates trigger a rebuild), and the workflow file itself.

**Type consistency check:** `Form` type defined in Task 3 (`{ slug, title }`) matches usage in Task 7. `Category` type defined in Task 3 matches usage in Task 5. `NavLink` type defined in Task 4 matches usage in `Sidebar.svelte`. Component prop types use Svelte 5 `$props()` consistently throughout.

**Placeholder scan:** None found. Every code step has complete code; every command step has the exact command and expected output.
