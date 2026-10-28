# Medical Device Assessment — SvelteKit front-end

Single-page, nine-step wizard and dashboard for the medical device
risk-class assessment (EU MDR 2017/745 Annex VIII / UK MDR 2002), built with
SvelteKit, the Lily Design System Svelte headless components and the SVAR
DataGrid. It is a port of [`../front-end-with-html/`](../front-end-with-html/).

## Routes

Served under `/medical-device-assessment/` (the root `/` redirects there):

| URL                                                              | Purpose                          |
| ---------------------------------------------------------------- | -------------------------------- |
| `/medical-device-assessment/`                                    | Welcome page                     |
| `/medical-device-assessment/medical-device-assessments/`         | Dashboard (SVAR DataGrid)        |
| `/medical-device-assessment/medical-device-assessments/[id]`     | Wizard (`new` creates a draft)   |
| `/medical-device-assessment/medical-device-assessments/[id]/report` | Report; `…/report/pdf` makes a PDF |

## Layout

- `src/lib/engine/` — pure engine ported from `js/device-grader.js`
  (`device-grader.ts`), defaults (`defaults.ts`), types derived from them
  (`types.ts`), label and colour helpers (`utils.ts`), and the Vitest suite
  that replays all 11 entries of `../examples/personas.json`.
- `src/lib/config/steps.ts` — declarative steps and fields, including the
  conditional-field predicates, ported from `js/steps.js`.
- `src/lib/components/steps/Step1…Step9*.svelte` — one component per step,
  rendered through `StepSection.svelte` and `FieldRenderer.svelte`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed store with localStorage
  autosave (`medical-device-assessment.front-end-with-svelte.v1` for `new`).
- `src/lib/api/medical-device-assessments.ts` — Loco API client: dashboard
  join (assessments + grades + flags) and the submit sequence (manufacturer,
  assessor, assessment, grade, rules, flags). Set `VITE_API_BASE` to point at
  the back end (default `http://localhost:5150`); the offline samples remain
  the fallback when it is down or empty.
- `src/lib/data/sample-reports.ts` — one sample per persona and the dashboard
  rows derived by running the engine.

## Run

```sh
pnpm install
pnpm dev          # http://localhost:5173/medical-device-assessment/
pnpm check && pnpm test && pnpm build
```
