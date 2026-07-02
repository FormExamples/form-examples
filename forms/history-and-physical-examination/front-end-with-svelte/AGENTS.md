# H&P — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the H&P specification and completeness engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and completeness** form — the engine grades the record
`complete` / `partial` / `incomplete` with a completeness percentage and raises
safety flags. Two flags are **blocking** (allergies not documented; no impression
and no plan) and force an `incomplete` status. There is no numeric score.

## Layout

- `src/lib/engine/` — pure completeness engine (`types.ts`, `utils.ts`,
  `history-and-physical-rules.ts`, `history-and-physical-grader.ts`,
  `flagged-issues.ts`) + `history-and-physical-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (8 steps: encounter, patient, presenting complaint, past history, social and
  systems, vitals, examination, then impression and plan).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (completeness, not score).
- `src/routes/history-and-physical-examinations/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Documentation completeness (no total):

```
completenessPercent = round(100 * satisfiedComponents / 10)
blocking            = allergies undocumented || (no impression AND no plan)
coreNarrative       = presenting complaint + its history + core exam addressed
                      + (impression || plan)
status = blocking || !coreNarrative -> 'incomplete'
         all ten components satisfied -> 'complete'
         otherwise -> 'partial'
```

Ten required components are each evaluated as satisfied or missing.
`calculateHistoryAndPhysicalGrade` returns the completeness status, the
completeness percentage, the per-component satisfied flags, the fired-rule audit
trail, the safety flags, and the `blocking` boolean.

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
