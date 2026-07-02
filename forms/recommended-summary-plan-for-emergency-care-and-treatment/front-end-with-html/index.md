# ReSPECT — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
ReSPECT plan wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the completeness / validity engine in `js/{types,rules,grader,flags}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

ReSPECT is a documentation and governance instrument, not a scored assessment:
the engine grades a plan as `complete` or `incomplete`, reports a completeness
percentage, records which of the eight mandatory rules fired, and raises safety
and governance flags. There is no numeric clinical score.
