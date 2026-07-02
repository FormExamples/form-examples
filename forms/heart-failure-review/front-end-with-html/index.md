# Heart Failure Annual Review — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
annual-review wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the classification-and-completeness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a documentation and status-classification front-end, not a numeric
score. The engine derives an NYHA functional status, a four-pillar
medication-optimisation status, a review-completeness grade, and a set of
safety flags. See the form root [`../index.md`](../index.md) and
[`../spec/index.md`](../spec/index.md) for the domain contract.
