# Anion Gap Calculator — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the anion-gap specification and calculation engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure calculation engine (`types.ts`, `utils.ts`,
  `anion-gap-rules.ts`, `anion-gap-grader.ts`, `flagged-issues.ts`) +
  `anion-gap-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts` (5 steps), `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/anion-gap-calculators/` — RESTful routes: `/<plural>/`
  (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Calculation engine

Formula-based (not additive): `anionGap = (Na + K) − (Cl + HCO₃)` (or without K),
`correctedAnionGap = anionGap + 0.25 × (40 − albumin)` when albumin is present,
then classified against the reference range (8 lower; 16 upper with K, 12
without; ≥ 20 very high). The unrounded value drives classification and every
flag threshold; the rounded (1 dp) value is display-only. A high gap is flagged
for a HAGMA differential (GOLDMARK / MUDPILES); ≥ 20 mmol/L is urgent.

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
