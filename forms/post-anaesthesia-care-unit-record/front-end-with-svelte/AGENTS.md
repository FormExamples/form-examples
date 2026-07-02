# PACU Record — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the PACU specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `pacu-rules.ts`, `pacu-grader.ts`, `flagged-issues.ts`) + `pacu-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (10 steps: context, identification, five Aldrete parameters, observations,
  PADSS, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/post-anaesthesia-care-unit-records/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

- Five Modified Aldrete parameters, each 0/1/2 → total 0-10.
- `readinessBand = (aldreteTotal >= 9 && oxygenSaturationScore === 2)
  ? 'discharge-ready' : 'not-ready'` (SpO2-gated).
- Optional PADSS: five criteria 0/1/2, total 0-10; `padssStreetFit = total >= 9`;
  scored only when the case is ambulatory and all five criteria are supplied.
- Flags (independent of the total): not-ready, hypoxia, unstable vitals,
  uncontrolled pain, uncontrolled PONV, surgical bleeding, incomplete assessment.

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
