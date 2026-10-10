# DTAC assessor wizard — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

- Engine contract (do not change): `js/grader.js` `calculateGrade(state)`, `js/types.js` `emptyAssessment()`, `js/criteria.js` `CRITERIA`/`SECTIONS`/`STATUSES`, `js/flags.js` `detectFlags(state, grade)`.
- `js/form-app.js` generates every criterion radio group from `CRITERIA`; never hand-write criteria markup. It exposes the `window.__FORM_STATE__` contract used by `js/form-export.js`, `js/form-import.js` and `js/restore-banner.js`.
- `js/data.js` sample rows mirror `../examples/personas.json` (`expected` grades); regenerate by hand when personas change (`bin/generate-persona-dashboard-samples.py` does not support this form, which has no Svelte `ReportRow`).
- Shared assets (`css/`, picker/export JS) are copied verbatim from the reference form `pre-operative-assessment-by-clinician`, with only the per-form localStorage keys changed.
- Verify: `bin/test-engines`, `bin/test-personas`, `bin/test-e2e --html`, `bin/verify-blank-submit`, `bin/verify-personas` with this form's slug.
