# Columbia Suicide Severity Rating Scale (C-SSRS) — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
C-SSRS suicide-risk wizard; `dashboard.html` is the clinician dashboard. Shared
`css/` and `js/` (the C-SSRS classification engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The engine records the five-point ordinal ideation level, the categorical
suicidal-behaviour items with recency, and the lethality of any actual attempt,
then derives a Low / Moderate / High risk tier. It is a status- and
severity-classification instrument, not a summed score.
