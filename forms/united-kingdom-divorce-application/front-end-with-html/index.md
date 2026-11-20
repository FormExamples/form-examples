# United Kingdom Divorce Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
divorce (or civil-partnership dissolution) application wizard; `dashboard.html`
is the caseworker dashboard. Shared `css/` and `js/` (the readiness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The form is a **completeness and time-gate checker**, not a scored assessment
and **not legal advice**. It tests the stage gate (one year of marriage; 20
weeks from issue to the conditional order; 6 weeks and 1 day from the
conditional order to the final order), checks the required information and
documents, tests the England and Wales jurisdiction grounds, and classifies the
application as **ready to apply**, **incomplete**, or **not eligible yet**. Every
date is tested against the `asOfDate` the user supplies, never the wall clock.

See the form root [`../index.md`](../index.md), [`../spec/index.md`](../spec/index.md)
and [`../AGENTS.md`](../AGENTS.md). Lily HTML headless conventions:
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

## Verify

```sh
bin/test-personas united-kingdom-divorce-application
bin/test-engines united-kingdom-divorce-application
bin/test-e2e --html united-kingdom-divorce-application
```
