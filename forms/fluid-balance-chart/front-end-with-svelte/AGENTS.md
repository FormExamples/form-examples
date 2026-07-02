# Fluid Balance Chart — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

This is a MULTI-TABLE form: a parent chart header plus TWO one-to-many child
lists — the timed **intake** rows and the timed **output** rows, each with its
own add/remove repeating-row editor. The engine reconciles the recorded volumes
into totals, a running/cumulative **net balance**, and the weight-indexed
urine-output rate (mL/kg/h), grades the **fluid status** (Balanced / Positive /
Negative / Oliguria), and — independently — raises safety flags. It is NOT a
validated named score.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure reconciliation engine (`types.ts`, `utils.ts`,
  `fluid-balance-rules.ts`, `fluid-balance-grader.ts`, `flagged-issues.ts`) +
  `fluid-balance-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge (recurses objects and mutates
  arrays in place so seeded intake/output rows reach the editors),
  `createDefaultAssessment()` plus `createDefaultEntry()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections;
  steps 3 (Intake) and 4 (Output) are add/remove repeating-row editors bound to
  the store's `intake` / `output` child arrays.
- `src/lib/components/ui/` — Lily Svelte headless component set (generic Badge).
- `src/lib/config/` — `steps.ts` (5 steps), `themes.ts`.
- `src/lib/data/sample-reports.ts` — 4 sample charts (populated intake/output
  arrays spanning balanced / positive / negative / oliguria) + engine-derived
  dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/fluid-balance-charts/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Reconciliation engine

- `totalIntakeMl`, `totalOutputMl`, `netBalanceMl = intake − output`.
- Per-category subtotals, a time-sorted running balance (intake +, output −).
- `urineOutputRateMlPerKgPerHour = urineOutputMl / weightKg / hoursObserved`.
- Fluid status, precedence-ordered: **oliguria** (urine rate < 0.5 mL/kg/h over
  >= 6 h) → **positive** (net >= +threshold) → **negative** (net <= −threshold)
  → **balanced**. Threshold defaults to ±1000 mL per 24 h and scales linearly.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation of the chart-context items + `ErrorSummary`;
  `Form.svelte` carries `novalidate` (native constraint validation must not
  block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
