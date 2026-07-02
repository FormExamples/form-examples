# Caprini VTE Risk Assessment — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Caprini VTE risk-assessment wizard; `dashboard.html` is the clinician dashboard.
Shared `css/` and `js/` (the Caprini scoring engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The engine sums each present risk factor's fixed weight (1, 2, 3, or 5 points)
plus the age-band weight into a total Caprini score, maps the total to a risk
band (very low 0-1, low 2, moderate 3-4, high 5+), and recommends a prophylaxis
strategy. A high bleeding risk downgrades any pharmacological recommendation to
mechanical prophylaxis.
