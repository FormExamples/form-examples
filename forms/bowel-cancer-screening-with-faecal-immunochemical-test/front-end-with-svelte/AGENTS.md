# Bowel Cancer Screening with FIT — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the FIT specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `bowel-fit-rules.ts`, `bowel-fit-grader.ts`, `flagged-issues.ts`) +
  `bowel-fit-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/fit-screenings/` — RESTful routes: `/fit-screenings` (dashboard,
  `ssr = false`) + `/fit-screenings/[id]` (wizard) + `/fit-screenings/[id]/report`
  (+ `report/pdf` server endpoint).

## Classification engine

Priority-ordered classification (not additive): kit not returned or inadequate
sample → repeat kit; `faecalHaemoglobin >= thresholdApplied` (default 120 µg
Hb/g) → positive → colonoscopy; below threshold → negative → routine two-yearly
recall. A missing Hb on a returned, adequate kit is incomplete (not negative).
`redFlagSymptoms == 'yes'` sets `symptomaticPathway` independently of the result
class. Configuring the threshold to 10 yields NICE DG56 symptomatic behaviour.

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
