# Confusion Assessment Method (CAM) — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
CAM bedside wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the CAM classification engine in `js/{types,rules,grader,flags}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

This is a status / classification form, not a numeric-score form: the engine
emits a delirium classification (present / absent / unable-to-assess) plus the
set of positive features, derived from the fixed CAM algorithm
`feature 1 AND feature 2 AND (feature 3 OR feature 4)`.
