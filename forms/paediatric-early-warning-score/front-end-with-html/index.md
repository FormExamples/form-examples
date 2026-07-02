# PEWS — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
PEWS bedside wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the age-banded PEWS scoring engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The age band is selected first and drives the normal ranges for the
respiratory-rate and heart-rate parameters; each of the seven parameters scores
0–3, the aggregate (0–21) maps to an escalation band (routine / low / medium /
high), and single-parameter=3, nurse concern, and parent/carer concern are
independent override triggers.
