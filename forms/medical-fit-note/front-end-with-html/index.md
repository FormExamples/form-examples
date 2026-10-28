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
engine's exact expected grade. The page tries the Loco back-end first (see
[Back-end wiring](#back-end-wiring)) and falls back to the sample rows.

## Back-end wiring

The Loco back-end has no bespoke dashboard or submit endpoint, so `js/api.js`
talks to the plain REST resources (`/api/employees`, `/api/clinicians`,
`/api/medical_fit_notes`, `/api/medical_fit_note_grades`,
`/api/medical_fit_note_grade_rules`, `/api/medical_fit_note_grade_flags`).

- **API base**: `http://localhost:5150` by default; override with
  `window.__API_BASE__` or a `?api=http://host:port` query parameter.
- **Dashboard**: GETs notes, employees, clinicians, grades and flags and joins
  them client-side into the dashboard row shape (notes without a grade row are
  omitted). On any failure or an empty result it keeps the sample rows and
  shows the "Showing sample data" notice.
- **Submit**: after the local engine grades the wizard (the report always
  renders), `saveFitNote` sends, in order: `GET /api/employees` then
  `POST` if no match (NHS number, or name + birth date); `GET /api/clinicians`
  then `POST` if no match (registration body + number, or name);
  `POST /api/medical_fit_notes` (`status: 'signed'` only when the engine says
  approved and the declaration is given, else `'draft'`);
  `POST /api/medical_fit_note_grades`; one `POST` per fired rule and per flag
  (flag categories outside the SQL CHECK list are skipped). Saving needs
  employee name, date of birth and clinician name; otherwise the notice says
  what to enter. Success shows the note id; failure shows an error and keeps
  the report and the localStorage draft.
- For a browser on another origin, run the back-end in development mode
  (`config/development.yaml` enables permissive CORS).

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
