# Learning Disability Annual Health Check — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
annual-health-check wizard; `dashboard.html` is the clinician dashboard. Shared
`css/` and `js/` (the completeness engine in `js/{types,rules,grader,flags}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

This is a documentation / completeness front-end, not a numeric score: the
engine counts the required components carried out completely, reports a
`completenessPercent`, confirms the Health Action Plan was produced and shared
(the `complete` gate), and raises clinical flags — including STOMP — independently
of the status.
