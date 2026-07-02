# Fluid Balance Chart — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
charting wizard (a parent chart header plus a repeating one-to-many list of
timed intake/output entries); `dashboard.html` is the clinician dashboard.
Shared `css/` and `js/` (the reconciliation engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).
