# Pulmonary Embolism Rule-out Criteria (PERC) — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
PERC bedside wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the PERC classification engine in `js/{types,rules,grader,flags}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

This is a status / classification form, not a numeric-score form: the engine
emits a binary PERC classification (perc-negative / perc-positive) plus the set
of failed criteria and whether PERC is applicable, derived from the boolean
conjunction `pretestProbability == 'low' AND all eight criteria satisfied`. A
single failed criterion, or a pre-test probability that is not low, yields
perc-positive.
