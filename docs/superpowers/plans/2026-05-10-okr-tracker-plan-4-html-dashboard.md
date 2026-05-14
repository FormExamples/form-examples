# OKR Tracker — Plan 4: HTML dashboard (vanilla)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build a static HTML dashboard listing OKR objectives in a sortable, filterable table. One `index.html`, vanilla JS, no build step. Reads sample data from a co-located `objectives.json`. Click a row to expand a panel showing KRs, flags, and the latest check-in.

**Architecture:** One HTML file with a `<table>` body populated by JS reading `objectives.json`. Filter controls above the table (level, status, RAG, owner). Sort by clicking column headers. Row expansion uses `<details>`/`<summary>` semantics or a sibling `<tr>`. CSV export via `Blob` + `URL.createObjectURL`.

**Tech Stack:** HTML5, CSS3, ES2022 modules, no dependencies.

**Reference Plan 1:** the dashboard renders the same shape of data the wizard (Plans 2-3) produces. The seven scores + computed RAG + flags + KR list are the columns; the engine itself is not invoked by the dashboard (each objective row already has its scored result baked in by the wizard that produced it). For Plan 4, sample objectives are hand-written and **include the engine output** to keep this plan dependency-free; in Plan 6 the dashboard will fetch live data from a Loco backend.

**Plan-4 acceptance gate:**
1. Opening `forms/objective-and-key-result-tracker/front-end-dashboard-with-html/index.html` shows a table with five sample objectives.
2. Each filter (level, status, RAG, owner) narrows the displayed rows.
3. Clicking a column header sorts ascending; clicking again descending.
4. Clicking a row expands a panel showing every KR, every flag, and the latest check-in narrative.
5. Clicking "Export CSV" downloads a CSV containing every visible row's columns.
6. A Playwright smoke test asserts the row count after each filter combination.

---

## File structure

```
forms/objective-and-key-result-tracker/front-end-dashboard-with-html/
  index.html
  style.css
  app.js
  objectives.json          # 5 hand-written sample objectives
  smoke.spec.mjs
  package.json             # playwright devDep only
  .gitignore
```

---

## Task 1: HTML shell + CSS

- [ ] **Step 1: Write `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>OKR Dashboard</title>
  <link rel="stylesheet" href="style.css" />
  <script type="module" defer src="app.js"></script>
</head>
<body>
  <header><h1>OKR Dashboard</h1></header>
  <section id="filters">
    <label>Level <select id="f-level"><option value="">all</option><option>individual</option><option>team</option><option>department</option><option>company</option></select></label>
    <label>Status <select id="f-status"><option value="">all</option><option>draft</option><option>active</option><option>at-risk</option><option>achieved</option><option>missed</option><option>retired</option><option>cancelled</option></select></label>
    <label>RAG <select id="f-rag"><option value="">all</option><option>green</option><option>amber</option><option>red</option></select></label>
    <label>Owner <input id="f-owner" placeholder="search…"/></label>
    <button id="btn-csv">Export CSV</button>
  </section>
  <table id="grid">
    <thead><tr>
      <th data-sort="obj_title">Title</th>
      <th data-sort="level">Level</th>
      <th data-sort="dri">DRI</th>
      <th data-sort="cycle">Cycle</th>
      <th data-sort="rag">RAG</th>
      <th data-sort="progress">Progress</th>
      <th data-sort="confidence">Conf</th>
      <th data-sort="krs"># KRs</th>
      <th data-sort="flags"># flags</th>
      <th data-sort="last_check_in_at">Last check-in</th>
    </tr></thead>
    <tbody></tbody>
  </table>
</body>
</html>
```

- [ ] **Step 2: Write `style.css`**

```css
body { font-family: system-ui, sans-serif; margin: 1rem; }
#filters { display: flex; gap: 1rem; flex-wrap: wrap; align-items: end; margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.4rem 0.6rem; border-bottom: 1px solid #ddd; text-align: left; }
th { cursor: pointer; background: #f3f3f3; }
th[data-sort-dir="asc"]::after { content: ' ▲'; }
th[data-sort-dir="desc"]::after { content: ' ▼'; }
.rag { display: inline-block; padding: 0 0.4rem; border-radius: 3px; color: white; font-weight: 700; font-size: 0.85em; }
.rag.green { background: #2c8a3a; } .rag.amber { background: #c47a00; } .rag.red { background: #c0392b; }
tr.detail td { background: #fafafa; padding: 1rem; }
.flag-list li, .kr-list li { margin: 0.2rem 0; }
```

- [ ] **Step 3: Write `.gitignore`**

```gitignore
node_modules/
test-results/
playwright-report/
```

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-html/{index.html,style.css,.gitignore}
git commit -m "OKR tracker: HTML dashboard shell"
```

---

## Task 2: Sample objectives JSON

- [ ] **Step 1: Write `objectives.json`** — five hand-written objectives, each with the dashboard-relevant columns and a nested `keyResults` array, `flags`, and `latestCheckIn`. Use real data drawn from the 14 fixtures in `test-fixtures/scoring/` so the dashboard reflects realistic state.

```json
[
  {
    "id": "obj-1", "obj_title": "Reduce customer churn by 30%", "level": "department",
    "dri": "Alice Chen", "cycle": "2026 Q2", "cycle_start_date": "2026-04-01", "cycle_end_date": "2026-06-30",
    "rag": "amber", "progress_percent": 47, "confidence_decile": 6,
    "keyResults": [
      { "position": 1, "title": "Lift NPS from 32 to 50", "kr_type": "numeric", "current": 43, "target": 50, "unit": "points", "progress_fraction": 0.6111 },
      { "position": 2, "title": "Reduce support ticket volume by 25%", "kr_type": "numeric", "current": -10, "target": -25, "unit": "%", "progress_fraction": 0.4 },
      { "position": 3, "title": "Roll out customer-success programme to top-50 accounts", "kr_type": "milestone", "current": 12, "target": 30, "unit": "accounts", "progress_fraction": 0.4 }
    ],
    "flags": [{ "code": "pace-collapse", "priority": "high", "description": "Pace deviation -55%." }],
    "latestCheckIn": { "checked_in_at": "2026-05-08T12:00:00Z", "narrative": "Pilot results positive in cohort A; cohort B blocked on data access." }
  },
  {
    "id": "obj-2", "obj_title": "Ship 10x ARR product line", "level": "company",
    "dri": "Bob Singh", "cycle": "2026 H1", "cycle_start_date": "2026-01-01", "cycle_end_date": "2026-06-30",
    "rag": "green", "progress_percent": 75, "confidence_decile": 7,
    "keyResults": [
      { "position": 1, "title": "$10M ARR booked", "kr_type": "numeric", "current": 7500000, "target": 10000000, "unit": "USD", "progress_fraction": 0.75 }
    ],
    "flags": [{ "code": "moonshot-progress", "priority": "low", "description": "Moonshot at 75%." }],
    "latestCheckIn": { "checked_in_at": "2026-05-09T18:00:00Z", "narrative": "Three enterprise deals closing this week." }
  },
  {
    "id": "obj-3", "obj_title": "Hire 8 engineers", "level": "team",
    "dri": "", "cycle": "2026 Q2", "cycle_start_date": "2026-04-01", "cycle_end_date": "2026-06-30",
    "rag": "green", "progress_percent": 70, "confidence_decile": 8,
    "keyResults": [{ "position": 1, "title": "Engineers hired", "kr_type": "numeric", "current": 6, "target": 8, "unit": "people", "progress_fraction": 0.75 }],
    "flags": [{ "code": "no-dri", "priority": "high", "description": "No DRI assigned." }],
    "latestCheckIn": { "checked_in_at": "2026-05-08T12:00:00Z", "narrative": "Two offers out, three onsites scheduled." }
  },
  {
    "id": "obj-4", "obj_title": "Reduce p99 latency by 50%", "level": "team",
    "dri": "Carla Diaz", "cycle": "2026 Q2", "cycle_start_date": "2026-04-01", "cycle_end_date": "2026-06-30",
    "rag": "red", "progress_percent": 30, "confidence_decile": 5,
    "keyResults": [{ "position": 1, "title": "p99 from 400ms to 200ms", "kr_type": "numeric", "current": 350, "target": 200, "unit": "ms", "progress_fraction": 0.25 }],
    "flags": [{ "code": "committed-at-risk", "priority": "high", "description": "Committed objective behind ≥50% of cycle elapsed and progress <50%." }],
    "latestCheckIn": { "checked_in_at": "2026-06-15T12:00:00Z", "narrative": "Caching layer blocked on infra team." }
  },
  {
    "id": "obj-5", "obj_title": "Launch DEI training programme", "level": "department",
    "dri": "Dani Park", "cycle": "2026 H1", "cycle_start_date": "2026-01-01", "cycle_end_date": "2026-06-30",
    "rag": "amber", "progress_percent": 55, "confidence_decile": 5,
    "keyResults": [
      { "position": 1, "title": "Programme designed and approved", "kr_type": "binary", "current": null, "target": null, "unit": "", "progress_fraction": 1.0 },
      { "position": 2, "title": "Rolled out to 80% of staff", "kr_type": "numeric", "current": 50, "target": 80, "unit": "%", "progress_fraction": 0.625 }
    ],
    "flags": [],
    "latestCheckIn": { "checked_in_at": "2026-05-01T09:00:00Z", "narrative": "Pilot cohort completed, rollout to next two business units underway." }
  }
]
```

- [ ] **Step 2: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-html/objectives.json
git commit -m "OKR tracker: HTML dashboard sample data"
```

---

## Task 3: Render the table

- [ ] **Step 1: Write `app.js`** — bootstrap that loads `objectives.json` and renders the table body:

```js
let data = [];
let view = [];
let sort = { key: null, dir: 'asc' };
const filters = { level: '', status: '', rag: '', owner: '' };

async function load() {
  const r = await fetch('./objectives.json');
  data = await r.json();
  refresh();
}

function applyFilters() {
  view = data.filter((d) =>
    (!filters.level || d.level === filters.level) &&
    (!filters.rag || d.rag === filters.rag) &&
    (!filters.owner || (d.dri || '').toLowerCase().includes(filters.owner.toLowerCase()))
  );
}

function applySort() {
  if (!sort.key) return;
  const get = {
    obj_title: (d) => d.obj_title, level: (d) => d.level, dri: (d) => d.dri,
    cycle: (d) => d.cycle_start_date, rag: (d) => d.rag, progress: (d) => d.progress_percent,
    confidence: (d) => d.confidence_decile, krs: (d) => (d.keyResults ?? []).length,
    flags: (d) => (d.flags ?? []).length, last_check_in_at: (d) => d.latestCheckIn?.checked_in_at ?? '',
  }[sort.key];
  view.sort((a, b) => {
    const av = get(a), bv = get(b);
    return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === 'asc' ? 1 : -1);
  });
}

function row(d) {
  return `<tr data-id="${d.id}" tabindex="0">
    <td>${d.obj_title}</td><td>${d.level}</td><td>${d.dri || '<i>none</i>'}</td>
    <td>${d.cycle}</td><td><span class="rag ${d.rag}">${d.rag.toUpperCase()}</span></td>
    <td>${d.progress_percent}%</td><td>${d.confidence_decile}/10</td>
    <td>${(d.keyResults ?? []).length}</td><td>${(d.flags ?? []).length}</td>
    <td>${d.latestCheckIn?.checked_in_at?.slice(0, 10) ?? ''}</td>
  </tr>`;
}

function refresh() {
  applyFilters(); applySort();
  document.querySelector('#grid tbody').innerHTML = view.map(row).join('');
}

['level', 'status', 'rag', 'owner'].forEach((k) => {
  const el = document.querySelector(`#f-${k}`);
  el.addEventListener('input', () => { filters[k] = el.value; refresh(); });
});

document.querySelectorAll('#grid th[data-sort]').forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    sort = { key, dir: sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc' };
    document.querySelectorAll('#grid th').forEach((t) => t.removeAttribute('data-sort-dir'));
    th.dataset.sortDir = sort.dir;
    refresh();
  });
});

load();
```

- [ ] **Step 2: Open `index.html` in a browser, confirm 5 rows appear, filters and sort work.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-html/app.js
git commit -m "OKR tracker: HTML dashboard table + filters + sort"
```

---

## Task 4: Row expansion (detail panel)

- [ ] **Step 1: Add to `app.js`:**

```js
document.querySelector('#grid tbody').addEventListener('click', (e) => {
  const tr = e.target.closest('tr[data-id]'); if (!tr) return;
  const id = tr.dataset.id;
  const next = tr.nextElementSibling;
  if (next?.classList.contains('detail') && next.dataset.id === id) { next.remove(); return; }
  document.querySelectorAll('tr.detail').forEach((d) => d.remove());
  const d = data.find((x) => x.id === id);
  const html = `<tr class="detail" data-id="${id}"><td colspan="10">
    <h3>Key Results</h3>
    <ul class="kr-list">${d.keyResults.map((k) => `<li>${k.position}. ${k.title} — ${k.current ?? '–'}/${k.target ?? '–'} ${k.unit} (${Math.round((k.progress_fraction ?? 0) * 100)}%)</li>`).join('')}</ul>
    <h3>Flags</h3>
    <ul class="flag-list">${d.flags.length ? d.flags.map((f) => `<li><b>${f.code}</b> [${f.priority}]: ${f.description}</li>`).join('') : '<li><i>none</i></li>'}</ul>
    <h3>Latest check-in</h3>
    <p>${d.latestCheckIn?.checked_in_at?.slice(0, 10) ?? ''}: ${d.latestCheckIn?.narrative ?? ''}</p>
  </td></tr>`;
  tr.insertAdjacentHTML('afterend', html);
});
```

- [ ] **Step 2: Reload, click a row, confirm the detail panel appears. Click again, confirm it collapses.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-html/app.js
git commit -m "OKR tracker: HTML dashboard row expansion"
```

---

## Task 5: CSV export

- [ ] **Step 1: Add the CSV button handler:**

```js
document.querySelector('#btn-csv').addEventListener('click', () => {
  const headers = ['id', 'obj_title', 'level', 'dri', 'cycle', 'rag', 'progress_percent', 'confidence_decile', 'kr_count', 'flag_count'];
  const rows = view.map((d) => [d.id, d.obj_title, d.level, d.dri, d.cycle, d.rag, d.progress_percent, d.confidence_decile, d.keyResults.length, d.flags.length]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'okr-dashboard.csv';
  a.click();
});
```

- [ ] **Step 2: Reload, click Export CSV, open the file in a spreadsheet app, confirm 5 rows + header.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-html/app.js
git commit -m "OKR tracker: HTML dashboard CSV export"
```

---

## Task 6: Playwright smoke test

**Files:**
- Create: `package.json`, `smoke.spec.mjs`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "objective-and-key-result-tracker-front-end-dashboard-with-html",
  "version": "0.1.0",
  "private": true,
  "scripts": { "test": "playwright test smoke.spec.mjs --reporter=line" },
  "devDependencies": { "@playwright/test": "^1.50.0" }
}
```

- [ ] **Step 2: Write `smoke.spec.mjs`**

```js
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(__dirname, 'index.html')).href;

test('initial render shows 5 rows', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('#grid tbody tr')).toHaveCount(5);
});

test('filter by RAG=red narrows to one row', async ({ page }) => {
  await page.goto(url);
  await page.locator('#f-rag').selectOption('red');
  await expect(page.locator('#grid tbody tr')).toHaveCount(1);
  await expect(page.locator('#grid tbody tr td').first()).toContainText('Reduce p99 latency');
});

test('filter by level=team narrows to two rows', async ({ page }) => {
  await page.goto(url);
  await page.locator('#f-level').selectOption('team');
  await expect(page.locator('#grid tbody tr')).toHaveCount(2);
});

test('clicking a row expands a detail panel with KRs and flags', async ({ page }) => {
  await page.goto(url);
  await page.locator('#grid tbody tr', { hasText: 'Reduce customer churn' }).click();
  await expect(page.locator('tr.detail')).toHaveCount(1);
  await expect(page.locator('tr.detail')).toContainText('Lift NPS from 32 to 50');
  await expect(page.locator('tr.detail')).toContainText('pace-collapse');
});

test('sort by progress_percent toggles direction', async ({ page }) => {
  await page.goto(url);
  await page.locator('th[data-sort="progress"]').click();
  const firstAsc = await page.locator('#grid tbody tr td').nth(5).innerText();
  await page.locator('th[data-sort="progress"]').click();
  const firstDesc = await page.locator('#grid tbody tr td').nth(5).innerText();
  expect(firstAsc).not.toEqual(firstDesc);
});
```

- [ ] **Step 3: Install Playwright and run.**

```sh
cd forms/objective-and-key-result-tracker/front-end-dashboard-with-html
pnpm install
pnpm exec playwright install --with-deps chromium
pnpm test
```

Expected: 5 tests pass.

- [ ] **Step 4: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objective-and-key-result-tracker/front-end-dashboard-with-html/{package.json,smoke.spec.mjs,pnpm-lock.yaml}
git commit -m "OKR tracker: HTML dashboard Playwright smoke test"
```

---

## Task 7: Form-level docs

Following Plan 2 Task 11 pattern, fill in `index.md`, `AGENTS.md`, `plan.md`, `tasks.md` for this sub-project.

- [ ] Commit: `OKR tracker: HTML dashboard sub-project docs`

---

## Task 8: Acceptance gate

- [ ] **Step 1:** Open the dashboard, exercise every filter + sort + row expansion + CSV export.
- [ ] **Step 2:** `pnpm test` → 5 / 5.
- [ ] **Step 3:** Tag

```sh
git tag okr-tracker-plan-4-html-dashboard
```

Plan 4 done.
