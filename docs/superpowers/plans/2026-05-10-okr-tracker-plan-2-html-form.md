# OKR Tracker — Plan 2: HTML wizard (vanilla)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the single-page-wizard HTML form for the OKR tracker as a fully static site (no build step, no framework). One `index.html`, vanilla JS for navigation and scoring, pdfmake (CDN) for PDF export.

**Architecture:** One HTML file with ten `<section>` blocks (one per wizard step) on a single scrollable page. JS holds a single `state` object, mutates it via `addEventListener` on each input, and computes the grade + flags using a JS port of the scoring engine. No bundler, no transpiler. Plain ES2022 modules served from the file system or a static host.

**Tech Stack:** HTML5, CSS3 (no framework), ES2022 modules, [pdfmake 0.2 from CDN](https://cdn.jsdelivr.net/npm/pdfmake@0.2/build/pdfmake.min.js).

**Reference spec:** [`docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md`](../specs/2026-05-08-objective-and-key-result-tracker-design.md). **Reference Plan 1:** `2026-05-08-okr-tracker-plan-1-foundation.md` — the TypeScript engine in `front-end-form-with-svelte/src/lib/engine/` is the source of truth. This plan translates it to plain JS.

**Out of scope:** persistence (the form posts to `console.log` only in this plan; persistence comes in Plan 6); SvelteKit (Plan 3); dashboard (Plans 4/5).

**Plan-2 acceptance gate:**
1. Opening `forms/objective-and-key-result-tracker/front-end-form-with-html/index.html` in a browser shows a continuous-page wizard with all ten steps visible.
2. Filling all fields and clicking "Compute score" updates the RAG badge and lists every triggered flag.
3. Clicking "Download PDF" produces a PDF that includes every entered field plus the computed RAG.
4. Clicking "Copy plain-text triage line" copies the seven-score one-liner to the clipboard.
5. A Playwright smoke test (Plan 2 Task 12) drives the wizard with each of the 14 shared fixtures from `test-fixtures/scoring/*.json` and asserts the RAG/flag output matches the fixture's `expected` block.

---

## File structure

```
forms/objective-and-key-result-tracker/front-end-form-with-html/
  index.html                # 10-step wizard, all sections on one page
  style.css                 # form layout + RAG badge styles
  engine.js                 # JS port of the Plan 1 TS scoring engine
  app.js                    # wizard state + DOM bindings + PDF/copy actions
  smoke.spec.mjs            # Playwright smoke test (Plan 2 Task 12)
  package.json              # @playwright/test as devDep only
  .gitignore
```

---

## Task 1: Bootstrap the directory and shell

**Files:**
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/index.html`
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/style.css`
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/.gitignore`

- [ ] **Step 1: Write `index.html` skeleton**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>OKR Tracker — Wizard</title>
  <link rel="stylesheet" href="style.css" />
  <script defer src="https://cdn.jsdelivr.net/npm/pdfmake@0.2/build/pdfmake.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/pdfmake@0.2/build/vfs_fonts.js"></script>
  <script type="module" defer src="app.js"></script>
</head>
<body>
  <header><h1>OKR Tracker</h1><p class="subtitle">One Objective with its 1–5 Key Results.</p></header>
  <main id="wizard"></main>
  <footer>
    <button id="btn-compute">Compute score</button>
    <button id="btn-pdf">Download PDF</button>
    <button id="btn-copy-triage">Copy plain-text triage line</button>
    <div id="result" aria-live="polite"></div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Write `style.css`** — minimal layout (1-column form, RAG color tokens green/amber/red):

```css
:root { --rag-green:#2c8a3a; --rag-amber:#c47a00; --rag-red:#c0392b; }
body { font-family: system-ui, sans-serif; max-width: 880px; margin: 1rem auto; padding: 0 1rem; }
section.step { border: 1px solid #ddd; border-radius: 6px; padding: 1rem; margin: 1rem 0; }
section.step h2 { margin-top: 0; }
label { display: block; margin: 0.5rem 0 0.25rem; font-weight: 600; }
input, textarea, select { width: 100%; padding: 0.4rem; box-sizing: border-box; }
textarea { min-height: 5rem; }
.rag-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; color: white; font-weight: 700; }
.rag-green { background: var(--rag-green); } .rag-amber { background: var(--rag-amber); } .rag-red { background: var(--rag-red); }
.flag-list li { margin: 0.25rem 0; }
footer { position: sticky; bottom: 0; background: white; border-top: 1px solid #ddd; padding: 0.75rem; }
button { padding: 0.5rem 1rem; margin-right: 0.5rem; }
```

- [ ] **Step 3: Write `.gitignore`**

```gitignore
node_modules/
test-results/
playwright-report/
```

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/{index.html,style.css,.gitignore}
git commit -m "OKR tracker: HTML form shell"
```

---

## Task 2: Port the scoring engine to vanilla JS

**Files:**
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/engine.js`

This is a direct translation of `front-end-form-with-svelte/src/lib/engine/*.ts` into a single ES module. Same thresholds, same flag logic, same `worstBand` algorithm. No imports — exports `gradeObjective(assessment): GradeResult`.

- [ ] **Step 1: Write `engine.js`** (single module containing all rules + composite + flags; values match the corrected tier-1 threshold of 50 from Plan 1):

```js
const ORDER = { green: 0, amber: 1, red: 2 };
const worstBand = (bands) => bands.reduce((a, b) => (ORDER[b] > ORDER[a] ? b : a), 'green');
const daysBetween = (a, b) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);

const rule = (id, instrument, grade, description) => ({ ruleId: id, instrument, grade, category: instrument, description });

function gradeProgress(s) {
  const p = s.progressPercent;
  const tier = s.stretchTier ?? 1;
  if (p === null) return ['amber', [rule('R-PROGRESS-MISSING', 'progress', 'amber', 'Progress missing.')]];
  const t = { 1: { green: 70, red: 50 }, 2: { green: 30, red: 10 }, 3: { green: 25, red: -1 } }[tier];
  const band = p >= t.green ? 'green' : p < t.red ? 'red' : 'amber';
  return [band, [rule(`R-PROGRESS-${band.toUpperCase()}-T${tier}`, 'progress', band, `Progress ${p}% tier ${tier} → ${band}.`)]];
}
function gradeConfidence(d) {
  if (d === null) return ['amber', [rule('R-CONFIDENCE-MISSING', 'confidence', 'amber', 'Confidence missing.')]];
  const band = d >= 7 ? 'green' : d <= 3 ? 'red' : 'amber';
  return [band, [rule(`R-CONFIDENCE-${band.toUpperCase()}`, 'confidence', band, `Confidence ${d}/10 → ${band}.`)]];
}
function gradeAlignment(g) {
  if (g === null) return ['amber', [rule('R-ALIGNMENT-MISSING', 'alignment', 'amber', 'Alignment missing.')]];
  const band = g >= 4 ? 'green' : g <= 2 ? 'red' : 'amber';
  return [band, [rule(`R-ALIGNMENT-${band.toUpperCase()}`, 'alignment', band, `Alignment ${g}/5 → ${band}.`)]];
}
function gradeSmart(q) {
  if (q === null) return ['amber', [rule('R-SMART-MISSING', 'smart', 'amber', 'SMART missing.')]];
  const band = q >= 4 ? 'green' : q <= 1 ? 'red' : 'amber';
  return [band, [rule(`R-SMART-${band.toUpperCase()}`, 'smart', band, `SMART ${q}/5 → ${band}.`)]];
}
function gradePace(d) {
  if (d === null) return ['amber', [rule('R-PACE-MISSING', 'pace', 'amber', 'Pace missing.')]];
  const band = d >= -10 ? 'green' : d <= -50 ? 'red' : 'amber';
  return [band, [rule(`R-PACE-${band.toUpperCase()}`, 'pace', band, `Pace ${d}% → ${band}.`)]];
}
function gradeStretch(t) {
  const name = { 1: 'COMMITTED', 2: 'ASPIRATIONAL', 3: 'MOONSHOT' }[t ?? 1];
  return ['green', [rule(`R-STRETCH-${name}`, 'stretch', 'green', `Stretch ${name.toLowerCase()} (informational).`)]];
}
function gradeImpact(t) {
  return ['green', [rule(`R-IMPACT-T${t ?? 0}`, 'impact', 'green', `Impact tier ${t ?? 0}/5 (informational).`)]];
}

function computeFlags(a) {
  const flags = []; const s = a.scores; const c = a.context;
  const add = (code, priority, description) => flags.push({ flagCode: code, priority, description });
  if (s.alignmentGrade !== null && s.alignmentGrade <= 2) add('mis-aligned', 'high', `Alignment ${s.alignmentGrade}/5.`);
  if (['individual', 'team', 'department'].includes(c.level) && c.parentObjectiveId === null) add('orphaned', 'high', `Level ${c.level} no parent.`);
  if (s.smartQuality !== null && s.smartQuality <= 1) add('non-smart', 'high', `SMART ${s.smartQuality}/5.`);
  const krTypes = (a.keyResults ?? []).map(k => k.krType);
  if (krTypes.length && !krTypes.some(t => t === 'numeric' || t === 'milestone')) add('unmeasurable', 'high', 'No numeric/milestone KR.');
  if (!c.driPresent) add('no-dri', 'high', 'No DRI.');
  if (s.stretchTier === 1 && s.progressPercent !== null && s.progressPercent < 50 && c.cycleStartDate && c.cycleEndDate) {
    const total = daysBetween(c.cycleStartDate, c.cycleEndDate);
    const elapsed = daysBetween(c.cycleStartDate, a.now);
    if (total > 0 && elapsed / total >= 0.5) add('committed-at-risk', 'high', 'Committed behind ≥50% elapsed.');
  }
  if (s.paceDeviationPercent !== null && s.paceDeviationPercent <= -50) add('pace-collapse', 'high', `Pace ${s.paceDeviationPercent}%.`);
  if (c.previousConfidenceDecile !== null && s.confidenceDecile !== null && c.previousConfidenceDecile - s.confidenceDecile >= 3) add('confidence-collapse', 'medium', 'Confidence dropped ≥3.');
  if (c.checkedInAt && c.cycleStartDate && c.cycleEndDate) {
    const total = daysBetween(c.cycleStartDate, c.cycleEndDate);
    const since = daysBetween(c.checkedInAt, a.now);
    const threshold = Math.max(14, Math.round(total * 0.25));
    if (since > threshold) add('stale-check-in', 'medium', `${since} days since check-in.`);
  }
  if (['retired', 'cancelled', 'missed'].includes(c.parentObjectiveStatus)) add('cascading-broken', 'medium', `Parent ${c.parentObjectiveStatus}.`);
  if ((a.keyResults ?? []).length > 5) add('over-scoped', 'low', `${a.keyResults.length} KRs.`);
  if (s.stretchTier === 3 && s.progressPercent !== null && s.progressPercent >= 70) add('moonshot-progress', 'low', `Moonshot at ${s.progressPercent}%.`);
  return flags;
}

export function gradeObjective(a) {
  const axes = [gradeProgress(a.scores), gradeConfidence(a.scores.confidenceDecile),
    gradeStretch(a.scores.stretchTier), gradeAlignment(a.scores.alignmentGrade),
    gradeImpact(a.scores.impactTier), gradeSmart(a.scores.smartQuality),
    gradePace(a.scores.paceDeviationPercent)];
  const composite = worstBand(axes.map(([b]) => b));
  const rulesFired = axes.flatMap(([, r]) => r);
  rulesFired.push(rule(`R-COMPOSITE-${composite.toUpperCase()}`, 'composite', composite, `Composite ${composite}.`));
  return { computedCompositeRag: composite, rulesFired, flags: computeFlags(a) };
}
```

- [ ] **Step 2: Smoke-test by importing in a Node REPL**

```sh
cd forms/objective-and-key-result-tracker/front-end-form-with-html
node --input-type=module -e "
  import('./engine.js').then(({ gradeObjective }) => {
    const r = gradeObjective({ scores: { progressPercent: 80, confidenceDecile: 8, stretchTier: 1, alignmentGrade: 5, impactTier: 4, smartQuality: 5, paceDeviationPercent: 0 }, keyResults: [{ position:1, krType:'numeric', startValue:0, currentValue:80, targetValue:100 }], context: { level: 'team', parentObjectiveId: 'p', parentObjectiveStatus: 'active', driPresent: true, cycleStartDate: '2026-04-01', cycleEndDate: '2026-06-30', checkedInAt: '2026-05-08T12:00:00Z', previousConfidenceDecile: 7 }, now: '2026-05-08T12:00:00Z' });
    console.log(r.computedCompositeRag, r.flags.length);
  });
"
```

Expected: `green 0`.

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/engine.js
git commit -m "OKR tracker: HTML form vanilla JS scoring engine"
```

---

## Task 3: Wizard state + step rendering scaffolding

**Files:**
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/app.js`

- [ ] **Step 1: Write the bootstrap of `app.js` — state + step container plus a `renderSteps()` that injects empty `<section>` elements**

```js
import { gradeObjective } from './engine.js';

export const state = {
  reporter: { name: '', email: '', role: '' },
  cycle: { level: '', cycle: '', cycleStartDate: '', cycleEndDate: '' },
  objective: { obj_title: '', obj_long_description: '', strategic_theme: '', parent_objective_id: '' },
  participants: { dri: '', contributors: '', reviewers: '', stakeholders: '' },
  alignment: { sa_parent_summary: '', sa_business_value_statement: '' },
  keyResults: [], // 1..5 entries pushed by Step 5
  initiatives: { in_initiatives: '', in_supporting_links: '' },
  risks: { rk_known_risks: '', rk_dependencies: '', rk_blockers: '', rk_mitigation_plans: '' },
  checkIn: { narrative: '', since_last_changes: '', blockers: '', asks: '', confidenceDecileAtCheckIn: null },
  forecast: { fc_expected_end_state: '', fc_residual_risk: '' },
  scores: { progressPercent: null, confidenceDecile: null, stretchTier: null,
    alignmentGrade: null, impactTier: null, smartQuality: null, paceDeviationPercent: null },
  signature: { signed_by: '', override_reason: '', recommendation: '' },
};

const STEPS = [
  { id: 1, title: 'Reporter & cycle' },
  { id: 2, title: 'Objective' },
  { id: 3, title: 'Participants' },
  { id: 4, title: 'Strategic alignment' },
  { id: 5, title: 'Key Results (1–5)' },
  { id: 6, title: 'Initiatives' },
  { id: 7, title: 'Risks & dependencies' },
  { id: 8, title: 'Check-in narrative' },
  { id: 9, title: 'Forecast' },
  { id: 10, title: 'Score & sign-off' },
];

function renderSteps() {
  const wiz = document.querySelector('#wizard');
  for (const s of STEPS) {
    const sec = document.createElement('section');
    sec.className = 'step'; sec.id = `step-${s.id}`;
    sec.innerHTML = `<h2>${s.id}. ${s.title}</h2><div class="body" data-step="${s.id}"></div>`;
    wiz.appendChild(sec);
  }
}

document.addEventListener('DOMContentLoaded', renderSteps);
```

- [ ] **Step 2: Reload `index.html` in a browser, confirm 10 empty sections appear with numbered headings.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form state and step scaffolding"
```

---

## Task 4: Steps 1–4 fields (reporter, objective, participants, alignment)

Inject form controls into each step's `.body` div. Bind to `state.*`.

- [ ] **Step 1: Add `renderStep1..4` helpers to `app.js`** (extend the existing file). Each helper sets innerHTML for `.body[data-step="N"]` with the field controls listed below, then attaches `input` event listeners that write into `state`.

```js
const bind = (selector, path) => {
  const [section, key] = path.split('.');
  document.querySelector(selector).addEventListener('input', (e) => {
    state[section][key] = e.target.value;
  });
};

function renderStep1() {
  document.querySelector('[data-step="1"]').innerHTML = `
    <label>Reporter name<input id="r-name"/></label>
    <label>Reporter email<input id="r-email" type="email"/></label>
    <label>Reporter role<input id="r-role"/></label>
    <label>Level<select id="c-level">
      <option value="">—</option><option>individual</option><option>team</option>
      <option>department</option><option>company</option></select></label>
    <label>Cycle<select id="c-cycle">
      <option value="">—</option><option>monthly</option><option>quarterly</option>
      <option>half-yearly</option><option>annual</option><option>custom</option></select></label>
    <label>Cycle start date<input id="c-start" type="date"/></label>
    <label>Cycle end date<input id="c-end" type="date"/></label>
  `;
  bind('#r-name', 'reporter.name'); bind('#r-email', 'reporter.email'); bind('#r-role', 'reporter.role');
  bind('#c-level', 'cycle.level'); bind('#c-cycle', 'cycle.cycle');
  bind('#c-start', 'cycle.cycleStartDate'); bind('#c-end', 'cycle.cycleEndDate');
}

// Similar renderStep2 / renderStep3 / renderStep4 — see continuation below.
```

Add `renderStep2..4` analogously, mapping each spec field to an `<input>` or `<textarea>` with appropriate `bind()` calls. Reference the spec's "Ten-step wizard" table in `index.md` for field names.

- [ ] **Step 2: Call all four renderers after `renderSteps()`** at the bottom of the DOMContentLoaded listener:

```js
document.addEventListener('DOMContentLoaded', () => {
  renderSteps(); renderStep1(); renderStep2(); renderStep3(); renderStep4();
});
```

- [ ] **Step 3: Reload, manually fill in step 1 and verify `state.reporter.name` updates in DevTools console.**

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form steps 1-4"
```

---

## Task 5: Step 5 — dynamic Key Results (1–5)

- [ ] **Step 1: Add `renderStep5()` to `app.js`** with an "Add KR" button (disabled at 5 entries), an "Remove" button per row, and KR fields for title / type / start / current / target / unit / owner / due date.

```js
function renderKR(i, kr) {
  return `<fieldset data-kr="${i}">
    <legend>Key Result ${i + 1} <button type="button" data-action="remove" data-kr="${i}">remove</button></legend>
    <label>Title<input data-field="title" value="${kr.title}"/></label>
    <label>Type<select data-field="krType">
      <option value="">—</option><option>numeric</option><option>milestone</option><option>binary</option></select></label>
    <label>Unit<input data-field="unit" value="${kr.unit}"/></label>
    <label>Start<input type="number" step="any" data-field="startValue" value="${kr.startValue ?? ''}"/></label>
    <label>Current<input type="number" step="any" data-field="currentValue" value="${kr.currentValue ?? ''}"/></label>
    <label>Target<input type="number" step="any" data-field="targetValue" value="${kr.targetValue ?? ''}"/></label>
    <label>Owner<input data-field="ownerName" value="${kr.ownerName}"/></label>
    <label>Due date<input type="date" data-field="dueDate" value="${kr.dueDate}"/></label>
  </fieldset>`;
}

function renderStep5() {
  const root = document.querySelector('[data-step="5"]');
  const draw = () => {
    root.innerHTML = state.keyResults.map((kr, i) => renderKR(i, kr)).join('') +
      `<button type="button" id="kr-add" ${state.keyResults.length >= 5 ? 'disabled' : ''}>Add Key Result</button>`;
    root.querySelector('#kr-add')?.addEventListener('click', () => {
      if (state.keyResults.length >= 5) return;
      state.keyResults.push({ position: state.keyResults.length + 1, title: '', krType: '', unit: '',
        startValue: null, currentValue: null, targetValue: null, ownerName: '', dueDate: '' });
      draw();
    });
    root.querySelectorAll('[data-action="remove"]').forEach((btn) => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.kr);
      state.keyResults.splice(i, 1);
      state.keyResults.forEach((kr, idx) => { kr.position = idx + 1; });
      draw();
    }));
    root.querySelectorAll('fieldset[data-kr]').forEach((fs) => {
      const i = Number(fs.dataset.kr);
      fs.querySelectorAll('[data-field]').forEach((inp) => {
        inp.addEventListener('input', () => {
          const field = inp.dataset.field;
          const v = inp.type === 'number' ? (inp.value === '' ? null : Number(inp.value)) : inp.value;
          state.keyResults[i][field] = v;
        });
      });
    });
  };
  draw();
}
```

- [ ] **Step 2: Wire `renderStep5()` into the DOMContentLoaded chain. Reload, click "Add Key Result" 6 times, confirm the button disables at 5 and the state has 5 entries with `position: 1..5`.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form step 5 dynamic Key Results"
```

---

## Task 6: Steps 6–9 fields (initiatives, risks, check-in, forecast)

Four straightforward text-area-heavy steps. Follow the same `bind()` pattern as Task 4.

- [ ] **Step 1: Add `renderStep6..9` to `app.js`**. Each is a sequence of `<textarea>` and `<input>` elements bound to the corresponding `state.*` keys (`initiatives.in_initiatives`, `risks.rk_known_risks`, etc.).

- [ ] **Step 2: Wire all four into the DOMContentLoaded handler.**

- [ ] **Step 3: Reload and confirm all four sections render and bind correctly via DevTools.**

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form steps 6-9"
```

---

## Task 7: Step 10 — scores + Compute button

- [ ] **Step 1: Add `renderStep10()` with the seven score inputs and a sign-off field.** Inputs:

```html
<label>Progress percent (0–100)<input id="s-progress" type="number" min="0" max="100"/></label>
<label>Confidence decile (1–10)<input id="s-confidence" type="number" min="1" max="10"/></label>
<label>Stretch tier<select id="s-stretch">
  <option value="">—</option><option value="1">1 — committed</option>
  <option value="2">2 — aspirational</option><option value="3">3 — moonshot</option></select></label>
<label>Alignment grade (1–5)<input id="s-alignment" type="number" min="1" max="5"/></label>
<label>Impact tier (1–5)<input id="s-impact" type="number" min="1" max="5"/></label>
<label>SMART quality (0–5)<input id="s-smart" type="number" min="0" max="5"/></label>
<label>Pace deviation % (-100..+100)<input id="s-pace" type="number" min="-100" max="100"/></label>
<label>Signed by<input id="s-signed-by"/></label>
<label>Recommendation<select id="s-rec"><option value="">—</option>
  <option>continue</option><option>escalate</option><option>re-scope</option>
  <option>retire</option><option>split</option><option>merge</option></select></label>
<label>Override reason (if any)<textarea id="s-override"></textarea></label>
```

Bind each numeric input to `state.scores.*` (parsing `Number()` and treating empty as `null`).

- [ ] **Step 2: Add the Compute button handler that builds an `ObjectiveAssessment` from `state` and passes it to `gradeObjective()`:**

```js
function buildAssessment() {
  const driPresent = !!state.participants.dri;
  return {
    scores: state.scores,
    keyResults: state.keyResults,
    context: {
      level: state.cycle.level,
      parentObjectiveId: state.objective.parent_objective_id || null,
      parentObjectiveStatus: null,
      driPresent,
      cycleStartDate: state.cycle.cycleStartDate || null,
      cycleEndDate: state.cycle.cycleEndDate || null,
      checkedInAt: state.checkIn.narrative ? new Date().toISOString() : null,
      previousConfidenceDecile: null,
    },
    now: new Date().toISOString(),
  };
}

document.querySelector('#btn-compute').addEventListener('click', () => {
  const r = gradeObjective(buildAssessment());
  const el = document.querySelector('#result');
  el.innerHTML = `<span class="rag-badge rag-${r.computedCompositeRag}">${r.computedCompositeRag.toUpperCase()}</span>
    <h3>Flags (${r.flags.length})</h3>
    <ul class="flag-list">${r.flags.map(f => `<li><b>${f.flagCode}</b> (${f.priority}): ${f.description}</li>`).join('')}</ul>`;
  el.dataset.lastResult = JSON.stringify(r);
});
```

- [ ] **Step 3: Reload, fill in scores so the form mimics fixture 01 (all healthy), click Compute, confirm a green RAG badge appears and the flag list is empty.**

- [ ] **Step 4: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form step 10 + compute"
```

---

## Task 8: PDF export

- [ ] **Step 1: Add the click handler for `#btn-pdf` that builds a pdfmake docDefinition from the current `state` and the last computed result.**

```js
document.querySelector('#btn-pdf').addEventListener('click', () => {
  const last = JSON.parse(document.querySelector('#result').dataset.lastResult || '{}');
  const doc = {
    content: [
      { text: 'OKR Tracker Report', style: 'header' },
      { text: state.objective.obj_title || '(no title)', style: 'subheader' },
      { text: `Level: ${state.cycle.level}  •  Cycle: ${state.cycle.cycleStartDate} → ${state.cycle.cycleEndDate}` },
      { text: `RAG: ${last.computedCompositeRag ?? '(not computed)'}`, style: 'rag', color: last.computedCompositeRag === 'red' ? '#c0392b' : last.computedCompositeRag === 'amber' ? '#c47a00' : '#2c8a3a' },
      { text: 'Key Results', style: 'subheader' },
      { ul: state.keyResults.map(k => `${k.position}. ${k.title} (${k.krType}) — ${k.currentValue}/${k.targetValue} ${k.unit}`) },
      { text: 'Flags', style: 'subheader' },
      { ul: (last.flags ?? []).map(f => `[${f.priority}] ${f.flagCode}: ${f.description}`) },
      { text: `Signed by ${state.signature.signed_by} on ${new Date().toISOString()}` },
    ],
    styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }, subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }, rag: { fontSize: 16, bold: true, margin: [0, 5, 0, 10] } },
  };
  pdfMake.createPdf(doc).download(`okr-${(state.objective.obj_title || 'objective').replaceAll(/\s+/g, '-')}.pdf`);
});
```

- [ ] **Step 2: Reload, fill a few fields, click Download PDF, confirm a PDF downloads and contains the title, RAG, KR list, flag list.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form PDF export"
```

---

## Task 9: Plain-text triage summary (clipboard)

- [ ] **Step 1: Add the click handler for `#btn-copy-triage`:**

```js
document.querySelector('#btn-copy-triage').addEventListener('click', async () => {
  const last = JSON.parse(document.querySelector('#result').dataset.lastResult || '{}');
  const lines = [
    `[OKR] ${state.objective.obj_title || '(no title)'}`,
    `Level: ${state.cycle.level}  Cycle: ${state.cycle.cycleStartDate} → ${state.cycle.cycleEndDate}`,
    `RAG: ${(last.computedCompositeRag ?? 'not-computed').toUpperCase()}  Progress: ${state.scores.progressPercent}%  Conf: ${state.scores.confidenceDecile}/10`,
    `KRs (${state.keyResults.length}):`,
    ...state.keyResults.map(k => `  ${k.position}. ${k.title} — ${k.currentValue}/${k.targetValue} ${k.unit}`),
    `Flags: ${(last.flags ?? []).map(f => `${f.flagCode}(${f.priority})`).join(', ') || '(none)'}`,
  ];
  await navigator.clipboard.writeText(lines.join('\n'));
  document.querySelector('#result').insertAdjacentHTML('beforeend', '<p><i>Copied to clipboard.</i></p>');
});
```

- [ ] **Step 2: Reload, fill the form, compute, click Copy. Paste into a text editor and confirm the format.**

- [ ] **Step 3: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/app.js
git commit -m "OKR tracker: HTML form plain-text triage summary"
```

---

## Task 10: Playwright smoke test against the 14 shared fixtures

**Files:**
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/package.json`
- Create: `forms/objective-and-key-result-tracker/front-end-form-with-html/smoke.spec.mjs`

- [ ] **Step 1: Write `package.json`:**

```json
{
  "name": "objective-and-key-result-tracker-front-end-form-with-html",
  "version": "0.1.0",
  "private": true,
  "scripts": { "test": "playwright test smoke.spec.mjs --reporter=line" },
  "devDependencies": { "@playwright/test": "^1.50.0" }
}
```

- [ ] **Step 2: Write `smoke.spec.mjs`** — loads `index.html` over a `file://` URL, programmatically pokes `window.state` and calls the engine via the module to verify it agrees with each fixture's expected output:

```js
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, '../test-fixtures/scoring');

const fixtures = fs.readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, body: JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8')) }));

test.describe('engine.js — every fixture', () => {
  for (const { file, body } of fixtures) {
    test(`${file}: ${body.name}`, async ({ page }) => {
      await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
      const result = await page.evaluate(async (input) => {
        const mod = await import('./engine.js');
        return mod.gradeObjective(input);
      }, body.input);
      expect(result.computedCompositeRag).toBe(body.expected.computedCompositeRag);
      const got = result.flags.map((f) => f.flagCode).sort();
      const want = body.expected.expectedFlags.map((f) => f.flagCode).sort();
      expect(got).toEqual(want);
    });
  }
});
```

- [ ] **Step 3: Install Playwright and run the smoke test:**

```sh
cd forms/objective-and-key-result-tracker/front-end-form-with-html
pnpm install
pnpm exec playwright install --with-deps chromium
pnpm test
```

Expected: 14 tests pass.

- [ ] **Step 4: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objective-and-key-result-tracker/front-end-form-with-html/{package.json,smoke.spec.mjs,pnpm-lock.yaml}
git commit -m "OKR tracker: HTML form smoke test via Playwright"
```

---

## Task 11: Author form-level docs (AGENTS, plan, tasks for this sub-project)

**Files:**
- Modify: `forms/objective-and-key-result-tracker/front-end-form-with-html/index.md` (the scaffold left it empty)
- Modify: `forms/objective-and-key-result-tracker/front-end-form-with-html/AGENTS.md`
- Modify: `forms/objective-and-key-result-tracker/front-end-form-with-html/plan.md`
- Modify: `forms/objective-and-key-result-tracker/front-end-form-with-html/tasks.md`

- [ ] **Step 1: Write each file with a short description and pointers to the parent design spec and this plan.** Pattern (use this verbatim for `index.md`):

```markdown
# OKR Tracker — HTML form (vanilla)

Static single-page wizard for the OKR tracker form. No build step. Opens directly from the file system.

- 10 steps on one continuous page
- Scoring engine ported to vanilla JS (same logic as `front-end-form-with-svelte/src/lib/engine/`)
- PDF export via pdfmake (CDN)
- Plain-text triage summary
- Smoke-tested with the 14 shared fixtures via Playwright

See [the parent form's index.md](../index.md) and
[the design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md).

## Verify

```sh
pnpm install && pnpm test
```
```

Write the AGENTS / plan / tasks files similarly — terse and pointing at the parent docs.

- [ ] **Step 2: Commit**

```sh
git add forms/objective-and-key-result-tracker/front-end-form-with-html/{index.md,AGENTS.md,plan.md,tasks.md}
git commit -m "OKR tracker: HTML form sub-project docs"
```

---

## Task 12: Verify Plan-2 acceptance gate

- [ ] **Step 1: Open `index.html` in a browser, mentally run through fixture 01 (green/healthy):** fill reporter, level=team, cycle=quarterly, dates 2026-04-01 → 2026-06-30, objective=`Lift NPS to 50`, DRI=Alice, one numeric KR start=32/current=46/target=50/unit=points, scores 80/8/1/5/4/5/0. Click Compute. Confirm GREEN badge and zero flags.

- [ ] **Step 2: Click Download PDF, confirm the file downloads and contains all fields and the GREEN RAG.**

- [ ] **Step 3: Click Copy triage line, paste, confirm the format.**

- [ ] **Step 4: Run the smoke test:** `pnpm test` — expect 14 / 14 passing.

- [ ] **Step 5: Tag**

```sh
git tag okr-tracker-plan-2-html-form
```

Plan 2 done. The HTML wizard works end-to-end and matches Plan 1's engine across every shared fixture.
