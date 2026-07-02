# MSE — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the MSE specification and completeness engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and completeness** form — the engine grades the record
`complete` / `partial` with a completeness percentage and derives a risk
indicator (`none` / `low` / `moderate` / `high`) from safety flags. There is no
numeric score.

## Layout

- `src/lib/engine/` — pure completeness-and-risk engine (`types.ts`, `utils.ts`,
  `mse-rules.ts`, `mse-grader.ts`, `flagged-issues.ts`) + `mse-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (10 steps: context, patient, and the seven ASEPTIC domains, then summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (completeness + risk, not score).
- `src/routes/mental-state-examinations/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Documentation completeness (no total):

```
completenessPercent = round(100 * documentedDomains / 7)
status              = documentedDomains === 7 ? 'complete' : 'partial'
riskLevel           = highest priority among the safety flags raised
                      (high > moderate > low > none)
```

A domain is documented when any one of its finding fields is non-blank.
`calculateMseGrade` returns the completeness status, the completeness
percentage, the per-domain documented flags, the fired-rule audit trail, the
safety flags, and the derived risk level.

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
