# Medical Fit Note — SvelteKit front-end (form + dashboard)

Single SvelteKit app (Lily Design System, headless) serving the clinician
sign-off wizard, the fit-note dashboard and the report for the medical fit
note form ([`../index.md`](../index.md)). It is a port of
[`../front-end-with-html/`](../front-end-with-html/index.md); the approval
engine behaves identically.

## Routes

Served at `/medical-fit-note/` (the root `/` redirects there):

| URL                                              | Purpose                                             |
| ------------------------------------------------ | --------------------------------------------------- |
| `/medical-fit-note/`                             | Welcome page                                        |
| `/medical-fit-note/medical-fit-notes/`           | Dashboard (SVAR DataGrid; sample rows from engine)  |
| `/medical-fit-note/medical-fit-notes/[id]`       | Eight-step single-page wizard (`new` for a blank)   |
| `/medical-fit-note/medical-fit-notes/[id]/report` | Report (approval status, fired rules, flags, PDF)   |

## Wizard

Eight steps: Employee, Assessment, Condition, Fitness advice, Adjustments,
Period, Consent and sign-off, Report. Only the employee name is required by
the UI; every other gap is the engine's job to report as a fired rule
(R-01 to R-09). Drafts persist in `localStorage` under
`medical-fit-note.front-end-with-svelte.v1` (other ids get
`medical-fit-note.front-end-with-svelte.<id>.v1`).

## Layout

- `src/lib/engine/` — `fit-note-grader.ts` (`gradeFitNote`), `defaults.ts`
  (`createDefaultAssessment`, kept out of the store because the store imports
  `$app/env`, which Vitest cannot resolve), `types.ts`, `utils.ts` (options
  and labels), `fit-note-grader.test.ts`
- `src/lib/data/personas.json` — copy of `../examples/personas.json`; the
  Vitest suite asserts all 13 personas, and `sample-reports.ts` derives the
  dashboard rows `FN001..FN013` from them
- `src/lib/stores/assessment.svelte.ts` — id-keyed store (`deepAssign` merge)
- `src/lib/components/steps/Step1Employee.svelte` … `Step8Report.svelte`

## Back-end wiring

`src/lib/api/index.ts` is the API client; the base URL is
`VITE_API_BASE` (default `http://localhost:5150`). The dashboard fetches and
joins notes, employees, clinicians, grades and flags client-side, falling back
to the sample rows (with a notice) on failure or an empty list. Submit runs the
engine locally, opens the report, and `store.save()` posts, in order: employee
(find or create), clinician (find or create), `medical_fit_notes` (`signed`
only when approved and declared, else `draft`), `medical_fit_note_grades`, then
each fired rule and flag (categories outside the SQL CHECK list are skipped).
The report page shows the saved note id or an error; the report and draft are
kept either way. Run against a dev server with
`VITE_API_BASE=http://localhost:5151 pnpm dev`.

## Run and verify

```sh
cd forms/medical-fit-note/front-end-with-svelte
pnpm install && pnpm dev
pnpm run check && pnpm test && pnpm run build
pnpm run lint && pnpm run format:check
```
