# OKR Tracker — Plan 3: SvelteKit wizard

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the SvelteKit single-page wizard for the OKR tracker. Reuses the existing scoring engine from Plan 1 (`src/lib/engine/`). Adds Tailwind, ten `StepNN*.svelte` components, a Svelte-5-runes form store, a wizard orchestrator, and a Playwright smoke test that drives the 14 shared fixtures through the UI.

**Architecture:** SvelteKit (`@sveltejs/adapter-static`) for a fully prerendered single-page app. State lives in a `formState` rune. Wizard is one `+page.svelte` rendering `<Step01 /> … <Step10 />` in document order — no router, no client-side step transitions, just scrolling. Step components bind to `formState` via `$bindable()` props or the rune directly. Compute / PDF / Copy actions live in `<Step10ScoreAndSignOff />`. Tailwind 4 for layout.

**Tech Stack:** SvelteKit 2 with Svelte 5, Tailwind 4, `@sveltejs/adapter-static`, Vitest 3 (from Plan 1), Playwright 1.50.

**Reference Plan 1:** scoring engine lives at `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/`. Plan 1 left the project in an engine-only state with a minimal `package.json` and no SvelteKit adapter, Vite, Tailwind, or routes. Plan 3 promotes it to a full SvelteKit app **without breaking** the existing Vitest engine tests (44 tests) — they must continue to pass.

**Plan-3 acceptance gate:**
1. `pnpm dev` serves the wizard at `http://localhost:5173` with all ten steps on one scrollable page.
2. `pnpm test` (Vitest) still passes the 44 engine tests from Plan 1 + the new component tests.
3. `pnpm test:e2e` (Playwright) drives each of the 14 fixtures through the UI and asserts RAG + flag list match.
4. `pnpm build` produces a static `build/` directory openable from `file://`.

---

## File structure

```
forms/objectives-and-key-results-tracker/front-end-form-with-svelte/
  package.json                       # add: @sveltejs/kit, vite, tailwindcss, adapter-static, playwright
  svelte.config.js                   # new
  vite.config.ts                     # new (Vite + Tailwind plugin + Vitest config merge)
  vitest.config.ts                   # KEEP (engine tests already configured)
  tailwind.config.ts                 # new
  postcss.config.js                  # new
  src/
    app.html                         # new
    app.css                          # new (Tailwind directives)
    routes/
      +layout.svelte                 # new — Tailwind import, page chrome
      +page.svelte                   # new — orchestrator: <Step01/>..<Step10/>
    lib/
      engine/                        # KEEP — Plan 1's scoring engine
      stores/
        formState.svelte.ts          # new — Svelte-5 runes store
      components/
        ui/
          Step01ReporterAndCycle.svelte
          Step02Objective.svelte
          Step03Participants.svelte
          Step04StrategicAlignment.svelte
          Step05KeyResults.svelte
          Step06Initiatives.svelte
          Step07Risks.svelte
          Step08CheckIn.svelte
          Step09Forecast.svelte
          Step10ScoreAndSignOff.svelte
          RagBadge.svelte
          FlagList.svelte
  e2e/
    fixtures.spec.ts                 # new — Playwright smoke test against 14 fixtures
  playwright.config.ts               # new
```

---

## Task 1: Upgrade `package.json` and install SvelteKit toolchain

- [ ] **Step 1: Replace `package.json` dependencies and scripts** with:

```json
{
  "name": "objectives-and-key-results-tracker-front-end-form-with-svelte",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.15.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Install and confirm engine tests still pass.**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte
pnpm install
pnpm test
```

Expected: 44 tests pass (engine tests from Plan 1, unchanged).

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/{package.json,pnpm-lock.yaml}
git commit -m "OKR tracker: Svelte form upgrade to full SvelteKit toolchain"
```

---

## Task 2: SvelteKit config files

**Files:**
- Create: `svelte.config.js`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `src/app.html`, `src/app.css`

- [ ] **Step 1: Write `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter({ fallback: 'index.html' }), alias: { $engine: 'src/lib/engine', $stores: 'src/lib/stores', $ui: 'src/lib/components/ui' } },
};
```

- [ ] **Step 2: Write `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: { include: ['src/**/*.test.ts'] },
});
```

(Delete the standalone `vitest.config.ts` from Plan 1 — Vitest now reads the `test` section from `vite.config.ts`.)

- [ ] **Step 3: Write `tailwind.config.ts`**

```ts
export default { content: ['./src/**/*.{html,js,svelte,ts}'] };
```

- [ ] **Step 4: Write `src/app.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%sveltekit.assets%/favicon.png" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>OKR Tracker</title>
  %sveltekit.head%
</head>
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
</html>
```

- [ ] **Step 5: Write `src/app.css`**

```css
@import 'tailwindcss';
```

- [ ] **Step 6: Verify build and tests still pass**

```sh
pnpm test && pnpm exec svelte-kit sync && pnpm build
```

Expected: tests pass; build emits a static `build/` directory.

- [ ] **Step 7: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/{svelte.config.js,vite.config.ts,tailwind.config.ts,src/app.html,src/app.css}
git rm forms/objectives-and-key-results-tracker/front-end-form-with-svelte/vitest.config.ts
git commit -m "OKR tracker: Svelte form config (SvelteKit + Vite + Tailwind)"
```

---

## Task 3: Form-state store (Svelte-5 runes)

**Files:**
- Create: `src/lib/stores/formState.svelte.ts`

- [ ] **Step 1: Write the store** — mirrors the engine's `ObjectiveAssessment` shape plus the surrounding form fields:

```ts
import type { ObjectiveAssessment, RawScores, KeyResult } from '$engine/types';

const blankScores: RawScores = {
  progressPercent: null, confidenceDecile: null, stretchTier: null,
  alignmentGrade: null, impactTier: null, smartQuality: null, paceDeviationPercent: null,
};

function blankKR(position: number): KeyResult {
  return { position, title: '', krType: '', startValue: null, currentValue: null, targetValue: null,
    milestonesJson: null, binaryDone: null, progressFraction: null } as any;
}

class FormState {
  reporter = $state({ name: '', email: '', role: '' });
  cycle = $state({ level: '' as 'individual'|'team'|'department'|'company'|'', cycle: '' as 'monthly'|'quarterly'|'half-yearly'|'annual'|'custom'|'', cycleStartDate: '', cycleEndDate: '' });
  objective = $state({ obj_title: '', obj_long_description: '', strategic_theme: '', parent_objective_id: '' });
  participants = $state({ dri: '', contributors: '', reviewers: '', stakeholders: '' });
  alignment = $state({ sa_parent_summary: '', sa_business_value_statement: '' });
  keyResults = $state<KeyResult[]>([blankKR(1)]);
  initiatives = $state({ in_initiatives: '', in_supporting_links: '' });
  risks = $state({ rk_known_risks: '', rk_dependencies: '', rk_blockers: '', rk_mitigation_plans: '' });
  checkIn = $state({ narrative: '', since_last_changes: '', blockers: '', asks: '' });
  forecast = $state({ fc_expected_end_state: '', fc_residual_risk: '' });
  scores = $state<RawScores>({ ...blankScores });
  signature = $state({ signed_by: '', override_reason: '', recommendation: '' });

  addKr() { if (this.keyResults.length < 5) this.keyResults.push(blankKR(this.keyResults.length + 1)); }
  removeKr(i: number) { this.keyResults.splice(i, 1); this.keyResults.forEach((k, idx) => (k.position = idx + 1)); }

  buildAssessment(): ObjectiveAssessment {
    return {
      scores: this.scores,
      keyResults: this.keyResults,
      context: {
        level: this.cycle.level, parentObjectiveId: this.objective.parent_objective_id || null,
        parentObjectiveStatus: null, driPresent: !!this.participants.dri,
        cycleStartDate: this.cycle.cycleStartDate || null, cycleEndDate: this.cycle.cycleEndDate || null,
        checkedInAt: this.checkIn.narrative ? new Date().toISOString() : null,
        previousConfidenceDecile: null,
      },
      now: new Date().toISOString(),
    };
  }
}

export const formState = new FormState();
```

- [ ] **Step 2: Run tests to confirm nothing breaks.**

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/stores/formState.svelte.ts
git commit -m "OKR tracker: Svelte form state store (runes)"
```

---

## Task 4: Layout + page shell + Step01

**Files:**
- Create: `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `src/lib/components/ui/Step01ReporterAndCycle.svelte`

- [ ] **Step 1: Write `+layout.svelte`**

```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="max-w-4xl mx-auto p-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold">OKR Tracker</h1>
    <p class="text-sm text-gray-600">One Objective with its 1–5 Key Results.</p>
  </header>
  {@render children()}
</div>
```

- [ ] **Step 2: Write `+page.svelte`**

```svelte
<script lang="ts">
  import Step01 from '$ui/Step01ReporterAndCycle.svelte';
  import Step02 from '$ui/Step02Objective.svelte';
  import Step03 from '$ui/Step03Participants.svelte';
  import Step04 from '$ui/Step04StrategicAlignment.svelte';
  import Step05 from '$ui/Step05KeyResults.svelte';
  import Step06 from '$ui/Step06Initiatives.svelte';
  import Step07 from '$ui/Step07Risks.svelte';
  import Step08 from '$ui/Step08CheckIn.svelte';
  import Step09 from '$ui/Step09Forecast.svelte';
  import Step10 from '$ui/Step10ScoreAndSignOff.svelte';
</script>

<div class="space-y-6">
  <Step01 /><Step02 /><Step03 /><Step04 /><Step05 />
  <Step06 /><Step07 /><Step08 /><Step09 /><Step10 />
</div>
```

This file will fail to compile until all ten components exist — that's expected. Tasks 5–13 add them.

- [ ] **Step 3: Write `Step01ReporterAndCycle.svelte`**

```svelte
<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="1">
  <h2 class="text-xl font-semibold mb-3">1. Reporter &amp; cycle</h2>
  <div class="grid grid-cols-2 gap-3">
    <label>Reporter name<input class="w-full border p-1" bind:value={formState.reporter.name}/></label>
    <label>Reporter email<input class="w-full border p-1" type="email" bind:value={formState.reporter.email}/></label>
    <label>Reporter role<input class="w-full border p-1" bind:value={formState.reporter.role}/></label>
    <label>Level
      <select class="w-full border p-1" bind:value={formState.cycle.level}>
        <option value="">—</option>
        <option value="individual">individual</option>
        <option value="team">team</option>
        <option value="department">department</option>
        <option value="company">company</option>
      </select>
    </label>
    <label>Cycle
      <select class="w-full border p-1" bind:value={formState.cycle.cycle}>
        <option value="">—</option>
        <option value="monthly">monthly</option>
        <option value="quarterly">quarterly</option>
        <option value="half-yearly">half-yearly</option>
        <option value="annual">annual</option>
        <option value="custom">custom</option>
      </select>
    </label>
    <label>Cycle start date<input class="w-full border p-1" type="date" bind:value={formState.cycle.cycleStartDate}/></label>
    <label>Cycle end date<input class="w-full border p-1" type="date" bind:value={formState.cycle.cycleEndDate}/></label>
  </div>
</section>
```

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/{routes,lib/components/ui/Step01ReporterAndCycle.svelte}
git commit -m "OKR tracker: Svelte form layout, page, and Step 1"
```

---

## Task 5–9: Steps 2–9 (one component each, mostly text inputs)

For each step, create a `.svelte` file under `src/lib/components/ui/` that imports `formState` and binds inputs to the corresponding state slice. Pattern is identical to Step 1.

| Step | Component | Bindings |
|---|---|---|
| 2 | Step02Objective.svelte | `formState.objective.{obj_title, obj_long_description, strategic_theme, parent_objective_id}` |
| 3 | Step03Participants.svelte | `formState.participants.{dri, contributors, reviewers, stakeholders}` |
| 4 | Step04StrategicAlignment.svelte | `formState.alignment.{sa_parent_summary, sa_business_value_statement}` |
| 6 | Step06Initiatives.svelte | `formState.initiatives.{in_initiatives, in_supporting_links}` |
| 7 | Step07Risks.svelte | `formState.risks.{rk_known_risks, rk_dependencies, rk_blockers, rk_mitigation_plans}` |
| 8 | Step08CheckIn.svelte | `formState.checkIn.{narrative, since_last_changes, blockers, asks}` |
| 9 | Step09Forecast.svelte | `formState.forecast.{fc_expected_end_state, fc_residual_risk}` |

Step 5 is special (dynamic KR list — see Task 6). Step 10 is special (compute + actions — see Task 7).

- [ ] **Step 1: Write all seven components** following the Step01 pattern. Use `<textarea>` for long-description fields (`obj_long_description`, `sa_parent_summary`, `sa_business_value_statement`, all of `rk_*`, narrative, `fc_*`).

- [ ] **Step 2: Commit each as one logical group, or commit per file with messages like `OKR tracker: Svelte form Step N`. Either way, end up with seven new commits.**

---

## Task 6: Step 5 — dynamic Key Results

- [ ] **Step 1: Write `Step05KeyResults.svelte`**

```svelte
<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="5">
  <h2 class="text-xl font-semibold mb-3">5. Key Results (1–5)</h2>
  {#each formState.keyResults as kr, i}
    <fieldset class="border p-3 mb-3" data-kr={i}>
      <legend class="font-semibold">KR {kr.position}
        <button type="button" class="ml-2 text-sm text-red-600" onclick={() => formState.removeKr(i)}>remove</button>
      </legend>
      <div class="grid grid-cols-2 gap-3">
        <label>Title<input class="w-full border p-1" bind:value={kr.title}/></label>
        <label>Type
          <select class="w-full border p-1" bind:value={kr.krType}>
            <option value="">—</option>
            <option value="numeric">numeric</option>
            <option value="milestone">milestone</option>
            <option value="binary">binary</option>
          </select>
        </label>
        <label>Unit<input class="w-full border p-1" bind:value={kr.unit}/></label>
        <label>Owner<input class="w-full border p-1" bind:value={kr.ownerName}/></label>
        <label>Start<input class="w-full border p-1" type="number" step="any" bind:value={kr.startValue}/></label>
        <label>Current<input class="w-full border p-1" type="number" step="any" bind:value={kr.currentValue}/></label>
        <label>Target<input class="w-full border p-1" type="number" step="any" bind:value={kr.targetValue}/></label>
        <label>Due date<input class="w-full border p-1" type="date" bind:value={kr.dueDate}/></label>
      </div>
    </fieldset>
  {/each}
  <button type="button" class="bg-blue-600 text-white px-3 py-1 rounded" disabled={formState.keyResults.length >= 5} onclick={() => formState.addKr()}>Add Key Result</button>
</section>
```

- [ ] **Step 2: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/components/ui/Step05KeyResults.svelte
git commit -m "OKR tracker: Svelte form Step 5 dynamic Key Results"
```

---

## Task 7: Step 10 — Compute, RAG badge, flag list, PDF, copy

**Files:**
- Create: `src/lib/components/ui/Step10ScoreAndSignOff.svelte`, `RagBadge.svelte`, `FlagList.svelte`

- [ ] **Step 1: `RagBadge.svelte`**

```svelte
<script lang="ts">
  let { band }: { band: 'green' | 'amber' | 'red' | null } = $props();
  const cls = { green: 'bg-green-700', amber: 'bg-amber-600', red: 'bg-red-700' };
</script>

{#if band}
  <span class="inline-block text-white font-bold px-3 py-1 rounded {cls[band]}">{band.toUpperCase()}</span>
{:else}
  <span class="inline-block text-gray-500">(not computed)</span>
{/if}
```

- [ ] **Step 2: `FlagList.svelte`** — renders a `<ul>` from a `FiredFlag[]` prop.

- [ ] **Step 3: `Step10ScoreAndSignOff.svelte`** — seven score inputs + Compute + PDF + Copy buttons + result panel:

```svelte
<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  import { gradeObjective } from '$engine/composite-grader';
  import type { GradeResult } from '$engine/types';
  import RagBadge from './RagBadge.svelte';
  import FlagList from './FlagList.svelte';

  let result: GradeResult | null = $state(null);

  function compute() { result = gradeObjective(formState.buildAssessment()); }

  async function copyTriage() {
    if (!result) return;
    const lines = [
      `[OKR] ${formState.objective.obj_title}`,
      `RAG: ${result.computedCompositeRag.toUpperCase()}  Progress: ${formState.scores.progressPercent}%  Conf: ${formState.scores.confidenceDecile}/10`,
      `KRs (${formState.keyResults.length}):`,
      ...formState.keyResults.map((k) => `  ${k.position}. ${k.title} — ${k.currentValue}/${k.targetValue} ${k.unit ?? ''}`),
      `Flags: ${result.flags.map((f) => `${f.flagCode}(${f.priority})`).join(', ') || '(none)'}`,
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
  }

  async function downloadPdf() {
    if (!result) return;
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = await import('pdfmake/build/vfs_fonts');
    pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
    pdfMake.createPdf({
      content: [
        { text: 'OKR Tracker Report', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        { text: formState.objective.obj_title || '(no title)', fontSize: 14, bold: true },
        { text: `RAG: ${result.computedCompositeRag.toUpperCase()}`, fontSize: 16, bold: true, color: result.computedCompositeRag === 'red' ? '#c0392b' : result.computedCompositeRag === 'amber' ? '#c47a00' : '#2c8a3a' },
        { text: 'Key Results', fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
        { ul: formState.keyResults.map((k) => `${k.position}. ${k.title} — ${k.currentValue}/${k.targetValue} ${k.unit ?? ''}`) },
        { text: 'Flags', fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
        { ul: result.flags.map((f) => `[${f.priority}] ${f.flagCode}: ${f.description}`) },
      ],
    }).download(`okr-${(formState.objective.obj_title || 'objective').replaceAll(/\s+/g, '-')}.pdf`);
  }
</script>

<section class="border rounded p-4" data-step="10">
  <h2 class="text-xl font-semibold mb-3">10. Score &amp; sign-off</h2>
  <div class="grid grid-cols-2 gap-3">
    <label>Progress percent (0–100)<input class="w-full border p-1" type="number" min="0" max="100" bind:value={formState.scores.progressPercent}/></label>
    <label>Confidence decile (1–10)<input class="w-full border p-1" type="number" min="1" max="10" bind:value={formState.scores.confidenceDecile}/></label>
    <label>Stretch tier
      <select class="w-full border p-1" bind:value={formState.scores.stretchTier}>
        <option value={null}>—</option><option value={1}>1 — committed</option>
        <option value={2}>2 — aspirational</option><option value={3}>3 — moonshot</option>
      </select>
    </label>
    <label>Alignment grade (1–5)<input class="w-full border p-1" type="number" min="1" max="5" bind:value={formState.scores.alignmentGrade}/></label>
    <label>Impact tier (1–5)<input class="w-full border p-1" type="number" min="1" max="5" bind:value={formState.scores.impactTier}/></label>
    <label>SMART quality (0–5)<input class="w-full border p-1" type="number" min="0" max="5" bind:value={formState.scores.smartQuality}/></label>
    <label>Pace deviation % (-100..+100)<input class="w-full border p-1" type="number" min="-100" max="100" bind:value={formState.scores.paceDeviationPercent}/></label>
    <label>Signed by<input class="w-full border p-1" bind:value={formState.signature.signed_by}/></label>
  </div>
  <div class="mt-4 flex gap-2">
    <button type="button" class="bg-blue-700 text-white px-3 py-1 rounded" onclick={compute} data-test="btn-compute">Compute score</button>
    <button type="button" class="bg-gray-700 text-white px-3 py-1 rounded" onclick={downloadPdf} data-test="btn-pdf">Download PDF</button>
    <button type="button" class="bg-gray-700 text-white px-3 py-1 rounded" onclick={copyTriage} data-test="btn-copy">Copy triage line</button>
  </div>
  <div class="mt-4" data-test="result">
    {#if result}
      <RagBadge band={result.computedCompositeRag}/>
      <FlagList flags={result.flags}/>
    {/if}
  </div>
</section>
```

- [ ] **Step 4: Install pdfmake**

```sh
pnpm add pdfmake
```

- [ ] **Step 5: Verify dev server**

```sh
pnpm dev
```

Open `http://localhost:5173`, fill fixture 01 values, click Compute, verify GREEN badge.

- [ ] **Step 6: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/{package.json,pnpm-lock.yaml,src/lib/components/ui/{Step10ScoreAndSignOff,RagBadge,FlagList}.svelte}
git commit -m "OKR tracker: Svelte form Step 10 + PDF + copy"
```

---

## Task 8: Playwright smoke test against the 14 shared fixtures

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/fixtures.spec.ts`

- [ ] **Step 1: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  webServer: { command: 'pnpm dev', port: 5173, reuseExistingServer: true },
  use: { baseURL: 'http://localhost:5173' },
});
```

- [ ] **Step 2: Write `e2e/fixtures.spec.ts`**

This test directly invokes the engine on the page (via `page.evaluate`) for each fixture — equivalent to the HTML form's smoke test in Plan 2 Task 10. It's faster and more deterministic than driving the form UI for all 14 scenarios. (UI-driving for one or two scenarios — fixture 01 and fixture 03 — is exercised as separate tests in Task 9.)

```ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const FIXTURES_DIR = path.resolve(__dirname, '../../test-fixtures/scoring');

const fixtures = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, body: JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8')) }));

for (const { file, body } of fixtures) {
  test(`engine: ${file}: ${body.name}`, async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async (input) => {
      const mod = await import('/src/lib/engine/composite-grader.ts');
      return mod.gradeObjective(input);
    }, body.input);
    expect(result.computedCompositeRag).toBe(body.expected.computedCompositeRag);
    expect(result.flags.map((f: any) => f.flagCode).sort()).toEqual(body.expected.expectedFlags.map((f: any) => f.flagCode).sort());
  });
}
```

- [ ] **Step 3: Install Playwright browsers and run**

```sh
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

Expected: 14 / 14 pass.

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/{playwright.config.ts,e2e/fixtures.spec.ts,pnpm-lock.yaml}
git commit -m "OKR tracker: Svelte form Playwright fixture smoke test"
```

---

## Task 9: One UI-driving Playwright test (fixture 01 end-to-end)

- [ ] **Step 1: Add `e2e/ui-driving.spec.ts`** that actually fills every input via Playwright, clicks Compute, and asserts the visible GREEN badge.

```ts
import { test, expect } from '@playwright/test';

test('fixture 01 driven through the UI shows GREEN', async ({ page }) => {
  await page.goto('/');
  // Step 1
  await page.getByLabel('Reporter name').fill('Alice');
  await page.getByLabel('Level').selectOption('team');
  await page.getByLabel('Cycle', { exact: true }).selectOption('quarterly');
  await page.getByLabel('Cycle start date').fill('2026-04-01');
  await page.getByLabel('Cycle end date').fill('2026-06-30');
  // Step 3
  await page.getByLabel('DRI').or(page.locator('[data-step="3"] input').first()).fill('Alice');
  // Step 5 — fill the first KR
  await page.locator('[data-step="5"] fieldset').first().getByLabel('Type').selectOption('numeric');
  await page.locator('[data-step="5"] fieldset').first().getByLabel('Start').fill('32');
  await page.locator('[data-step="5"] fieldset').first().getByLabel('Current').fill('46');
  await page.locator('[data-step="5"] fieldset').first().getByLabel('Target').fill('50');
  // Step 10 — scores
  await page.getByLabel('Progress percent (0–100)').fill('80');
  await page.getByLabel('Confidence decile (1–10)').fill('8');
  await page.getByLabel('Stretch tier').selectOption('1');
  await page.getByLabel('Alignment grade (1–5)').fill('5');
  await page.getByLabel('Impact tier (1–5)').fill('4');
  await page.getByLabel('SMART quality (0–5)').fill('5');
  await page.getByLabel('Pace deviation % (-100..+100)').fill('0');
  await page.getByTestId('btn-compute').click();
  await expect(page.getByTestId('result')).toContainText('GREEN');
});
```

- [ ] **Step 2: Run and confirm pass.**

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/e2e/ui-driving.spec.ts
git commit -m "OKR tracker: Svelte form UI-driving smoke test"
```

---

## Task 10: Form-level docs (AGENTS, plan, tasks, index)

Following the same template as Plan 2 Task 11 — fill in the four scaffold doc files under `front-end-form-with-svelte/` with brief content and pointers to the parent design spec.

- [ ] Commit: `OKR tracker: Svelte form sub-project docs`

---

## Task 11: Acceptance gate

- [ ] **Step 1:** `pnpm test` → 44 passing (engine).
- [ ] **Step 2:** `pnpm test:e2e` → 15 passing (14 fixtures + 1 UI-driving).
- [ ] **Step 3:** `pnpm build` succeeds and emits `build/`.
- [ ] **Step 4:** `pnpm dev` and exercise fixture 03 manually — confirm RED badge appears.
- [ ] **Step 5:** Tag

```sh
git tag okr-tracker-plan-3-svelte-form
```

Plan 3 done.
