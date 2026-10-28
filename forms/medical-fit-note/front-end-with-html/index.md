# Medical Fit Note — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end for the medical fit note form
([`../index.md`](../index.md)). `index.html` is the single-page clinician
wizard; `dashboard.html` is the clinician dashboard. They share one `css/` and
one `js/` of native ES modules, so serve the directory over HTTP (not
`file://`).

## Wizard

One continuous page with eight steps: Employee, Assessment, Condition,
Fitness advice, Adjustments, Period, Consent and sign-off (including the
clinician registration body and number), and Report. Submitting runs the pure
approval engine and renders the approval status (`approved`,
`needs-completion`, `blocked`), the rules that fired (R-01 to R-09) and the
flags. Drafts persist in `localStorage` under
`medical-fit-note.front-end-with-html.v1`.

## Dashboard

A sortable, filterable table of fit notes. The offline sample rows in
`js/data.js` are one per persona in
[`../examples/personas.json`](../examples/personas.json), carrying the
engine's exact expected grade. The page tries `GET /api/medical_fit_notes` on
the Loco back-end first and falls back to the sample rows.

## Files

- `js/fit-note-grader.js` — the pure engine (`createDefaultAssessment`,
  `gradeFitNote`); do not change behaviour here without updating the spec
- `js/types.js` — wizard state (`emptyAssessment`), option lists, row typedefs
- `js/form-app.js`, `js/dashboard-app.js`, `js/api.js`, `js/data.js`
- shared fleet assets: `css/`, `js/{theme-select,locale-select,text-size-picker,share-picker,date-time-picker,table-export,restore-banner,form-export,form-import}.js`

## Run and verify

```sh
python3 -m http.server -d forms/medical-fit-note/front-end-with-html 8080
bin/test-engines medical-fit-note
bin/test-personas medical-fit-note
bin/test-e2e --html medical-fit-note
```
