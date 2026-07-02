# Parkland Formula for Burns — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Parkland specification and calculation engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure calculation engine (`types.ts`, `utils.ts`,
  `parkland-rules.ts`, `parkland-grader.ts`, `flagged-issues.ts`) +
  `parkland-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/parkland-formula-for-burns-calculations/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Calculation engine

Formula-based (not additive): `total24hVolumeMl = 4 × weightKg × tbsaPercent`,
computed only when both weight and %TBSA are present; each phase is half the
total. The 8h/16h split is measured **from the time of injury**, so
`remainingFirst8hHours = max(8 − hoursSinceInjury, 0)` and the first-phase rate
is `first8hVolumeMl ÷ remainingFirst8hHours` (null when overdue — give the
outstanding volume now). `next16hRateMlPerHour = next16hVolumeMl ÷ 16`. The
urine-output target is 0.5-1.0 mL/kg/h. Missing weight or %TBSA yields null
volumes and a data-completeness flag; no partial arithmetic is invented.

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
