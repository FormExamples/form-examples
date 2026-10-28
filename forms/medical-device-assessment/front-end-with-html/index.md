# Medical Device Assessment — HTML front-end

Single-page, nine-step wizard (`index.html`) and dashboard (back-end data, sample
fallback)
(`dashboard.html`) for the medical device risk-class assessment, built with
the Lily Design System HTML headless contract and native ES modules (serve
over HTTP; `file://` does not work).

- `js/device-grader.js` — pure EU MDR Annex VIII engine (`createDefaultAssessment`, `gradeDevice`)
- `js/types.js` — wizard state shape and label helpers
- `js/steps.js` — declarative step and field definitions, including which questions apply to which answers
- `js/form-app.js` — wizard app: autosave, progress, report, save to the back end
- `js/api.js` — Loco API client (dashboard join, submit sequence)
- `js/dashboard-app.js`, `js/data.js` — dashboard; sample rows mirror `examples/personas.json`

Run: `python3 -m http.server -d forms/medical-device-assessment/front-end-with-html`.

## Back-end wiring

`js/api.js` is the single client for the Loco API in `../back-end-with-loco`
(plain per-table REST, camelCase JSON, UUID ids). Base URL: `?api=` query
parameter, else `window.__API_BASE__`, else `http://localhost:5150`.

- Dashboard: GETs assessments, manufacturers, assessors, grades and grade
  flags and joins them client-side into the dashboard row shape. If the
  request fails or returns no assessments, the offline `js/data.js` samples
  stay and a notice explains why.
- Wizard submit: the engine runs locally and the report is shown; then
  `submitAssessment` saves it as `GET`+`POST` manufacturer and assessor
  (find-or-create by case-insensitive name; an empty name is stored as
  "Unspecified manufacturer" / "Unspecified assessor"), `POST` assessment,
  `POST` grade, `POST` one row per fired rule, `POST` one row per flag. A
  wizard status of `draft` is saved as `submitted`; `reviewed` and `urgent`
  are kept. A blocked result (IVD, or no device kind / intended purpose, so no
  computed class) saves the assessment as status `draft` and skips the grade,
  rule and flag POSTs. Success shows the assessment id; failure shows an
  error under the report and keeps the report and the localStorage draft.
  Each submit creates a new assessment (the API has no upsert).
- The dev server needs permissive CORS (`config/development.yaml` enables it).
