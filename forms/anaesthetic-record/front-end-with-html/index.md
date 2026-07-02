# Anaesthetic Record — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
anaesthetic-record wizard (a parent record plus THREE repeating one-to-many
child lists — drug administrations, timed observations, and intra-operative
events); `dashboard.html` is the clinician dashboard. Shared `css/` and `js/`
(the completeness engine in `js/{types,rules,grader,flags}.js`, the apps in
`js/form-app.js` + `js/dashboard-app.js`). The engine grades completeness
(Complete / Partial / Incomplete), reports a completeness percent, and raises
safety flags — it is not a numeric score.
