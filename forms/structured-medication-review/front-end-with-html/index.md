# Structured Medication Review (SMR) — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
SMR wizard (parent review plus a repeating one-to-many medicine list);
`dashboard.html` is the clinician dashboard. Shared `css/` and `js/` (the SMR
scoring engine in `js/{types,rules,grader,flags}.js`, the apps in
`js/form-app.js` + `js/dashboard-app.js`).
