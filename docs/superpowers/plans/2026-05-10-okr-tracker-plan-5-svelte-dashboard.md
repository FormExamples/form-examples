# OKR Tracker — Plan 5: SvelteKit dashboard with SVAR Grid

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the SvelteKit + Tailwind + SVAR Grid dashboard for the OKR tracker. Reuses Plan 4's `objectives.json` for sample data. Adds filter sidebar, RAG-band cell renderer, flag-count cell renderer with hover tooltip, KR-expanding detail panel.

**Architecture:** SvelteKit (`@sveltejs/adapter-static`). SVAR Svelte Grid (`wx-svelte-grid`) for the table. Tailwind 4 for the page layout and sidebar. Sample data loaded statically — in Plan 6 the dashboard becomes a Loco endpoint instead.

**Tech Stack:** SvelteKit 2, Svelte 5, Tailwind 4, [`wx-svelte-grid`](https://docs.svar.dev/svelte/grid/) (SVAR Grid for Svelte), Playwright.

**Plan-5 acceptance gate:**
1. `pnpm dev` serves the dashboard at `http://localhost:5173`.
2. The grid shows 5 sample objectives with sortable columns and a RAG-coloured chip per row.
3. The filter sidebar (level, status, RAG, owner) narrows the grid rows live.
4. Clicking a row opens a side-panel showing every KR with progress bar, every flag, and the latest check-in.
5. `pnpm test:e2e` (Playwright) asserts each filter and the row-expansion.
6. `pnpm build` produces a static `build/`.

---

## File structure

```
forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/
  package.json            # SvelteKit + Tailwind + wx-svelte-grid + Playwright
  svelte.config.js
  vite.config.ts
  tailwind.config.ts
  src/
    app.html
    app.css
    routes/+layout.svelte
    routes/+page.svelte               # filter sidebar + Grid + detail panel
    lib/
      data/sample.ts                  # imports objectives.json as typed data
      components/
        Sidebar.svelte                # filter controls
        Grid.svelte                   # wx-svelte-grid wrapper with column defs
        DetailPanel.svelte            # right-side KR + flags + check-in
        RagChip.svelte                # cell renderer for the RAG column
  static/
    objectives.json                   # symlinked or copied from Plan 4
  e2e/
    dashboard.spec.ts
  playwright.config.ts
```

---

## Task 1: Bootstrap SvelteKit + Tailwind + SVAR Grid

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "objective-and-key-result-tracker-front-end-dashboard-with-svelte",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "wx-svelte-grid": "^2.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.15.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "svelte": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Add `svelte.config.js`, `vite.config.ts`, `tailwind.config.ts`, `src/app.html`, `src/app.css`** — same shape as Plan 3 Task 2 with `$data` alias for `src/lib/data` and `$components` for `src/lib/components`.

- [ ] **Step 3: Install**

```sh
cd forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte
pnpm install
```

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/{package.json,pnpm-lock.yaml,svelte.config.js,vite.config.ts,tailwind.config.ts,src/app.html,src/app.css}
git commit -m "OKR tracker: Svelte dashboard bootstrap"
```

---

## Task 2: Sample data module

- [ ] **Step 1: Copy `objectives.json` from `front-end-dashboard-with-html/`** to this sub-project's `static/`:

```sh
cp forms/objective-and-key-result-tracker/front-end-dashboard-with-html/objectives.json \
   forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/static/objectives.json
```

- [ ] **Step 2: Write `src/lib/data/sample.ts`** — typed loader:

```ts
export interface Objective {
  id: string; obj_title: string; level: 'individual' | 'team' | 'department' | 'company';
  dri: string; cycle: string; cycle_start_date: string; cycle_end_date: string;
  rag: 'green' | 'amber' | 'red'; progress_percent: number; confidence_decile: number;
  keyResults: KeyResult[]; flags: Flag[]; latestCheckIn?: { checked_in_at: string; narrative: string };
}
export interface KeyResult { position: number; title: string; kr_type: string; current: number | null; target: number | null; unit: string; progress_fraction: number; }
export interface Flag { code: string; priority: 'high' | 'medium' | 'low'; description: string; }

export async function loadObjectives(fetcher: typeof fetch = fetch): Promise<Objective[]> {
  const r = await fetcher('/objectives.json');
  return await r.json();
}
```

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/{static/objectives.json,src/lib/data/sample.ts}
git commit -m "OKR tracker: Svelte dashboard sample data"
```

---

## Task 3: RAG chip cell renderer

- [ ] **Step 1: Write `src/lib/components/RagChip.svelte`**

```svelte
<script lang="ts">
  let { value }: { value: 'green' | 'amber' | 'red' } = $props();
  const cls = { green: 'bg-green-700', amber: 'bg-amber-600', red: 'bg-red-700' };
</script>
<span class="inline-block text-white font-bold px-2 py-0.5 rounded text-xs {cls[value]}">{value.toUpperCase()}</span>
```

- [ ] **Step 2: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/src/lib/components/RagChip.svelte
git commit -m "OKR tracker: Svelte dashboard RAG chip"
```

---

## Task 4: Grid wrapper

- [ ] **Step 1: Write `src/lib/components/Grid.svelte`** — `wx-svelte-grid` wrapper with column definitions:

```svelte
<script lang="ts">
  import { Grid as WxGrid } from 'wx-svelte-grid';
  import RagChip from './RagChip.svelte';
  import type { Objective } from '$data/sample';

  let { data, onSelect }: { data: Objective[]; onSelect: (id: string) => void } = $props();

  const columns = [
    { id: 'obj_title', header: 'Title', flexgrow: 2, sort: true },
    { id: 'level', header: 'Level', width: 100, sort: true },
    { id: 'dri', header: 'DRI', width: 140, sort: true },
    { id: 'cycle', header: 'Cycle', width: 100, sort: true },
    { id: 'rag', header: 'RAG', width: 80, sort: true, template: (row: Objective) => ({ component: RagChip, props: { value: row.rag } }) },
    { id: 'progress_percent', header: 'Progress', width: 90, sort: true, template: (row: Objective) => `${row.progress_percent}%` },
    { id: 'confidence_decile', header: 'Conf', width: 70, sort: true, template: (row: Objective) => `${row.confidence_decile}/10` },
    { id: 'kr_count', header: '# KRs', width: 70, sort: true, template: (row: Objective) => row.keyResults.length },
    { id: 'flag_count', header: '# flags', width: 80, sort: true, template: (row: Objective) => row.flags.length },
    { id: 'last_check_in', header: 'Last check-in', width: 120, sort: true, template: (row: Objective) => row.latestCheckIn?.checked_in_at?.slice(0, 10) ?? '' },
  ];
</script>

<WxGrid {data} {columns} select="row" onselect={(e) => onSelect(e.id as string)} />
```

(Refer to SVAR Grid docs for exact prop names; the snippet above is illustrative.)

- [ ] **Step 2: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/src/lib/components/Grid.svelte
git commit -m "OKR tracker: Svelte dashboard Grid wrapper"
```

---

## Task 5: Filter sidebar

- [ ] **Step 1: Write `src/lib/components/Sidebar.svelte`**

```svelte
<script lang="ts">
  let { filters = $bindable() }: { filters: { level: string; rag: string; owner: string } } = $props();
</script>

<aside class="w-56 p-4 border-r space-y-3 bg-gray-50">
  <h2 class="font-semibold mb-2">Filters</h2>
  <label class="block">Level
    <select class="w-full border p-1 mt-1" bind:value={filters.level}>
      <option value="">all</option><option>individual</option><option>team</option>
      <option>department</option><option>company</option>
    </select>
  </label>
  <label class="block">RAG
    <select class="w-full border p-1 mt-1" bind:value={filters.rag}>
      <option value="">all</option><option>green</option><option>amber</option><option>red</option>
    </select>
  </label>
  <label class="block">Owner
    <input class="w-full border p-1 mt-1" placeholder="search…" bind:value={filters.owner} />
  </label>
</aside>
```

- [ ] **Step 2: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/src/lib/components/Sidebar.svelte
git commit -m "OKR tracker: Svelte dashboard filter sidebar"
```

---

## Task 6: Detail panel

- [ ] **Step 1: Write `src/lib/components/DetailPanel.svelte`**

```svelte
<script lang="ts">
  import type { Objective } from '$data/sample';
  let { obj, onClose }: { obj: Objective | null; onClose: () => void } = $props();
</script>

{#if obj}
  <aside class="w-96 p-4 border-l bg-white overflow-y-auto">
    <header class="flex justify-between items-start mb-3">
      <h2 class="font-bold text-lg">{obj.obj_title}</h2>
      <button class="text-gray-500" onclick={onClose}>×</button>
    </header>
    <p class="text-sm text-gray-600 mb-3">{obj.level} • {obj.cycle} • DRI: {obj.dri || '(none)'}</p>

    <h3 class="font-semibold mt-3">Key Results</h3>
    <ul class="space-y-2">
      {#each obj.keyResults as k}
        <li class="border rounded p-2">
          <div class="text-sm font-medium">{k.position}. {k.title}</div>
          <div class="text-xs text-gray-600">{k.current ?? '–'}/{k.target ?? '–'} {k.unit}</div>
          <div class="h-1.5 mt-1 bg-gray-200 rounded">
            <div class="h-1.5 bg-blue-600 rounded" style="width: {Math.round((k.progress_fraction ?? 0) * 100)}%"></div>
          </div>
        </li>
      {/each}
    </ul>

    <h3 class="font-semibold mt-3">Flags ({obj.flags.length})</h3>
    {#if obj.flags.length === 0}<p class="text-sm text-gray-500">none</p>{/if}
    <ul class="space-y-1">
      {#each obj.flags as f}<li class="text-sm"><b>{f.code}</b> [{f.priority}]: {f.description}</li>{/each}
    </ul>

    {#if obj.latestCheckIn}
      <h3 class="font-semibold mt-3">Latest check-in</h3>
      <p class="text-xs text-gray-600">{obj.latestCheckIn.checked_in_at.slice(0, 10)}</p>
      <p class="text-sm">{obj.latestCheckIn.narrative}</p>
    {/if}
  </aside>
{/if}
```

- [ ] **Step 2: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/src/lib/components/DetailPanel.svelte
git commit -m "OKR tracker: Svelte dashboard detail panel"
```

---

## Task 7: Page composition

- [ ] **Step 1: Write `src/routes/+page.svelte`**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { loadObjectives, type Objective } from '$data/sample';
  import Sidebar from '$components/Sidebar.svelte';
  import Grid from '$components/Grid.svelte';
  import DetailPanel from '$components/DetailPanel.svelte';

  let all: Objective[] = $state([]);
  let filters = $state({ level: '', rag: '', owner: '' });
  let selectedId: string | null = $state(null);

  onMount(async () => { all = await loadObjectives(); });

  const filtered = $derived(all.filter((o) =>
    (!filters.level || o.level === filters.level) &&
    (!filters.rag || o.rag === filters.rag) &&
    (!filters.owner || o.dri.toLowerCase().includes(filters.owner.toLowerCase()))
  ));
  const selected = $derived(all.find((o) => o.id === selectedId) ?? null);
</script>

<div class="flex h-screen">
  <Sidebar bind:filters />
  <main class="flex-1 overflow-auto p-4">
    <h1 class="text-2xl font-bold mb-3">OKR Dashboard</h1>
    <Grid data={filtered} onSelect={(id) => selectedId = id} />
  </main>
  <DetailPanel obj={selected} onClose={() => selectedId = null} />
</div>
```

- [ ] **Step 2: Run `pnpm dev` and exercise the page manually.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/src/routes/+page.svelte
git commit -m "OKR tracker: Svelte dashboard page composition"
```

---

## Task 8: Playwright smoke test

**Files:**
- Create: `playwright.config.ts`, `e2e/dashboard.spec.ts`

- [ ] **Step 1: `playwright.config.ts`** (same as Plan 3 Task 8).

- [ ] **Step 2: `e2e/dashboard.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('initial grid shows 5 rows', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.wx-grid-row, [data-grid-row]')).toHaveCount(5);
});

test('filter RAG=red narrows to one row', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('RAG').selectOption('red');
  await expect(page.locator('.wx-grid-row, [data-grid-row]')).toHaveCount(1);
});

test('selecting a row opens detail panel with KRs', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wx-grid-row, [data-grid-row]').first().click();
  await expect(page.locator('aside').nth(1)).toContainText('Key Results');
});
```

(Row selector class may vary by SVAR Grid version — adapt to the actual rendered DOM.)

- [ ] **Step 3: Install Playwright and run**

```sh
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-svelte/{playwright.config.ts,e2e/dashboard.spec.ts}
git commit -m "OKR tracker: Svelte dashboard Playwright tests"
```

---

## Task 9: Sub-project docs

Following Plan 2 Task 11 pattern.

- [ ] Commit: `OKR tracker: Svelte dashboard sub-project docs`

---

## Task 10: Acceptance gate

- [ ] `pnpm dev`, exercise filters + detail panel + sort.
- [ ] `pnpm test:e2e` → all passing.
- [ ] `pnpm build` succeeds.
- [ ] Tag:

```sh
git tag okr-tracker-plan-5-svelte-dashboard
```

Plan 5 done.
