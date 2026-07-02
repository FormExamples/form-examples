# Abdominal Aortic Aneurysm (AAA) Screening — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the AAA screening specification and classification engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `aaa-rules.ts`, `aaa-grader.ts`, `flagged-issues.ts`) + `aaa-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/abdominal-aortic-aneurysm-screenings/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Classification engine

Classification-based (not additive): the maximum antero-posterior aortic
diameter is classified against fixed thresholds — normal (`< 3.0 cm`), small
(`3.0-4.4 cm`), medium (`4.5-5.4 cm`), large (`>= 5.5 cm`), each band
lower-bound inclusive and upper-bound exclusive. A non-visualised guard applies
first when `aortaVisualised == 'no'` or the diameter is missing. Each category
maps to a surveillance/referral band; growth since the prior scan
(`maxAorticDiameterCm - priorMaxDiameterCm`) feeds the rapid-growth flag.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric,
  date, and time fields.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
