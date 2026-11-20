# United Kingdom Vehicle Registration Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United Kingdom Vehicle Registration Application wizard; `dashboard.html` lists
applications with their validity class, fee due, and missing count. Shared `css/`
and `js/` (the validity engine in `js/{types,rules,grader,flags}.js`, the apps in
`js/form-app.js` + `js/dashboard-app.js`).

The form is a **completeness and validity** instrument, not a scored assessment
and **not a decision** on the application. The engine records the applicant, the
keeper and owner, the vehicle, the supporting evidence, and the fee, then
classifies the application as **ready to submit**, **incomplete**, or **needs
supporting documents**, works out the fee due (£25 for a V62, £55 for a first
registration), and raises flags for missing identity evidence, vehicle approval,
MOT, insurance, HMRC NOVA, a wrong fee, a malformed VIN or registration number,
and a seriously damaged vehicle. Classification is by precedence: `incomplete`
outranks `needs-supporting-documents`. Only the DVLA decides every application.

## Layout

- `index.html` — wizard shell; the eight steps are rendered by `js/form-app.js`.
- `dashboard.html` + `js/dashboard-app.js` — sortable, filterable table over
  `js/data.js` sample rows (or `GET /api/dashboard/applications` when the back-end
  is up).
- `js/types.js` — `emptyApplication()`, enum labels.
- `js/rules.js` — fee rules, format checks, `evaluate()`.
- `js/grader.js` — `validateApplication(state)`.
- `js/flags.js` — `detectFlaggedIssues(state)`.
- `js/{theme-select,locale-select,text-size-picker,share-picker,date-time-picker,restore-banner,form-export,form-import,table-export}.js` — shared Lily helpers, byte-identical fleet-wide apart from the slug.

## Verify

```sh
bin/lily-html-refactor --check united-kingdom-vehicle-registration-application
bin/es-modules-refactor --check united-kingdom-vehicle-registration-application
bin/test-personas united-kingdom-vehicle-registration-application
bin/test-engines united-kingdom-vehicle-registration-application
bin/test-e2e --html united-kingdom-vehicle-registration-application
```
