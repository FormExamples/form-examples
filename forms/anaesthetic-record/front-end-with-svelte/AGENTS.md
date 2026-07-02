# Anaesthetic Record — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

This is a MULTI-TABLE documentation form: a parent record plus three
one-to-many child lists (drug administrations, timed observations, and
intra-operative events). The engine grades **completeness** (Complete / Partial
/ Incomplete) with a completeness percent and, independently, raises safety
flags — it is NOT a numeric severity score.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and completeness engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure completeness engine (`types.ts`, `utils.ts`,
  `anaesthetic-record-rules.ts`, `anaesthetic-record-grader.ts`,
  `flagged-issues.ts`) + `anaesthetic-record-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge (recurses objects and mutates
  arrays in place so seeded child rows reach the editors),
  `createDefaultAssessment()` plus `createDefaultDrug/Observation/Event()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections;
  steps 4 (Drugs), 7 (Timed observations), and 10 (Events) are add/remove
  repeating-row editors bound to the store's child arrays.
- `src/lib/components/ui/` — Lily Svelte headless component set (generic Badge).
- `src/lib/config/` — `steps.ts` (12 steps), `themes.ts`.
- `src/lib/data/sample-reports.ts` — 4 sample records (populated child arrays) +
  engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/anaesthetic-records/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Completeness classification

- Any **critical** mandatory item missing → `incomplete`.
- Else any **non-critical** mandatory item missing → `partial`.
- Else → `complete`. `completenessPercent` = round(100 × satisfied / total).

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation of the critical items + `ErrorSummary`;
  `Form.svelte` carries `novalidate` (native constraint validation must not
  block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
