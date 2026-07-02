# Partogram — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

This is a MULTI-TABLE labour-monitoring form: a parent labour-record header
(context, patient identification, admission findings) plus a one-to-many child
list of timed intrapartum observation rows. The engine plots the latest cervical
dilatation against the alert line (`4 + t` cm) and the action line (`t` cm),
classifies labour progress (Normal / Alert-line crossed / Action-line crossed),
and — independently — raises threshold flags. It is NOT a numeric severity score.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and progress engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure progress engine (`types.ts`, `utils.ts`,
  `partogram-rules.ts`, `partogram-grader.ts`, `flagged-issues.ts`) +
  `partogram-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence (`partogram.front-end-with-svelte.<id>.v1`), in-place `deepAssign`
  deep-merge (recurses objects and mutates arrays in place so seeded observation
  rows reach the editors), `createDefaultAssessment()` plus
  `createDefaultObservation()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections;
  step 4 (Observation series) is an add/remove repeating-row editor bound to the
  store's `observations` child array.
- `src/lib/components/ui/` — Lily Svelte headless component set (generic Badge).
- `src/lib/config/` — `steps.ts` (5 steps), `themes.ts`.
- `src/lib/data/sample-reports.ts` — 4 sample records (populated observation
  arrays spanning normal / alert-line / action-line) + engine-derived dashboard
  rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/partograms/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Progress classification (spec §4)

Let D be the latest observation carrying a cervical dilatation, at elapsed time
t hours from `activePhaseStartAt`:

```
alertLineExpectedCm  = 4 + t
actionLineExpectedCm = t
progressClassification =
    D >= alertLineExpectedCm  ? 'normal'
  : D >  actionLineExpectedCm ? 'alertLineCrossed'
  :                             'actionLineCrossed'
```

With no dilatation observation, the classification is `normal` and an
incomplete-observation flag is raised.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation of the required header items + `ErrorSummary`;
  `Form.svelte` carries `novalidate` (native constraint validation must not
  block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
