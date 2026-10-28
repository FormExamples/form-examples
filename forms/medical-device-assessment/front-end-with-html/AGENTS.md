# AGENTS — medical-device-assessment `front-end-with-html/`

Follows [`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

- The engine `js/device-grader.js` is pure and covered by `bin/test-personas`; do not change its behavior from the UI layer.
- Add or alter questions in `js/steps.js` (fields carry an optional `show(state, liveResult)` predicate); hidden questions keep their stored values, so every engine field stays reachable.
- State shape lives in `js/types.js`; `emptyAssessment()` layers descriptive fields (manufacturer, assessor, device identification) on the engine defaults.
- localStorage keys: `medical-device-assessment.front-end-with-html.v1` (draft), `.theme.v1`, `.locale.v1`, `.text-size.v1`.
- `js/table-export.js` self-installs on the dashboard; add no CSV/TSV buttons of your own. `js/form-export.js`, `js/form-import.js` and `js/restore-banner.js` read `window.__FORM_STATE__` from `form-app.js`.
- `js/data.js` sample rows are derived from `examples/personas.json`; regenerate them if personas change.
- `js/api.js` is the only module that talks to the back end (base: `?api=` > `window.__API_BASE__` > `http://localhost:5150`). The sample fallback in `js/data.js` must keep working with the server down. Blocked results save the assessment as `draft` and skip the grade POSTs. Do not call `fetch` from `form-app.js` or `dashboard-app.js` directly.
- Verify: `bin/test-form medical-device-assessment`, `bin/test-personas medical-device-assessment`, `bin/test-engines medical-device-assessment`, `bin/test-e2e --html medical-device-assessment`.
