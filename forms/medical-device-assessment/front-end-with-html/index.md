# Medical Device Assessment — HTML front-end

Single-page, nine-step wizard (`index.html`) and sample-data dashboard
(`dashboard.html`) for the medical device risk-class assessment, built with
the Lily Design System HTML headless contract and native ES modules (serve
over HTTP; `file://` does not work).

- `js/device-grader.js` — pure EU MDR Annex VIII engine (`createDefaultAssessment`, `gradeDevice`)
- `js/types.js` — wizard state shape and label helpers
- `js/steps.js` — declarative step and field definitions, including which questions apply to which answers
- `js/form-app.js` — wizard app: autosave, progress, report
- `js/dashboard-app.js`, `js/data.js` — dashboard; sample rows mirror `examples/personas.json`

Run: `python3 -m http.server -d forms/medical-device-assessment/front-end-with-html`.
