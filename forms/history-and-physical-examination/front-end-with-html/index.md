# H&P — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
History and Physical Examination clerking wizard; `dashboard.html` is the
clinician dashboard. Shared `css/` and `js/` (the completeness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a documentation / completeness form, not a scored instrument: the engine
grades the clerking **Complete** / **Partial** / **Incomplete**, reports a
completeness percentage over the ten required components, and raises safety flags
(two of which — allergies not documented, and no impression or plan — are
blocking).
