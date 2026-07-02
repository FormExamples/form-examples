# LD Annual Health Check — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the annual-health-check specification and completeness engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and completeness** form — the engine grades the record
`complete` / `incomplete` with a completeness percentage, confirms the Health
Action Plan, and raises clinical flags (including the STOMP flag). There is no
numeric score.

## Layout

- `src/lib/engine/` — pure completeness engine (`types.ts`, `utils.ts`,
  `ld-health-check-rules.ts`, `ld-health-check-grader.ts`, `flagged-issues.ts`)
  + `ld-health-check-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (10 steps: context, person, adjustments, physical health, screening,
  medication/STOMP, mental health, syndrome-specific, carer, Health Action Plan).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (completeness + HAP, not score).
- `src/routes/learning-disability-annual-health-checks/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Documentation completeness (no total):

```
completenessPercent      = round(100 * completedComponents / 18)
healthActionPlanComplete = plan produced AND shared
status                   = completedComponents === 18 && healthActionPlanComplete
                           ? 'complete' : 'incomplete'
```

A required component is completed only when it carries a real recorded value
(`not-recorded` / `not-assessed` / `not-reviewed` / `not-done` / `''` do not
count; `declined` / `not-applicable` / `not-eligible` / `no-carer` do).
`calculateHealthCheckGrade` returns the completeness status, the completeness
percentage, the Health Action Plan gate, the per-component completed flags, the
fired-rule audit trail, and the clinical flags.

The **STOMP flag** fires when a psychotropic is prescribed and any of: no
documented indication, STOMP not discussed, or no last-review date.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
