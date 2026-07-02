# Hypertension Annual Review — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the hypertension-review specification and classification engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and control-classification** form — the engine
classifies blood-pressure control against an age- and comorbidity-specific
target, assigns a hypertension stage, grades review completeness, and raises
flags. There is no numeric score.

## Layout

- `src/lib/engine/` — pure control-classification-and-completeness engine
  (`types.ts`, `utils.ts`, `hypertension-review-rules.ts`,
  `hypertension-review-grader.ts`, `flagged-issues.ts`) +
  `hypertension-review-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (12 steps: context, patient, diagnosis, clinic BP, home BP, medication, CV
  risk, bloods, urine ACR, lifestyle, complications, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (control + completeness, not score).
- `src/routes/hypertension-reviews/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Engine

Control classification and documentation completeness (no total):

```
target       = tightest of the age/comorbidity BP targets; home = clinic − 5/5
control      = severe-uncontrolled | uncontrolled | controlled
               (clinic drives the 180/120 severe classification; primary reading
                is home if present, else clinic)
stage        = stage-3-severe | stage-2 | stage-1 | none  (from raw readings)
reviewStatus = incomplete (no BP) | complete (all components) | partial
```

`review()` returns the control status (class, target, primary source, stage),
the review status, the per-component documented flags, the fired-rule audit
trail, and the flags.

## Conventions

- British English throughout.
- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
