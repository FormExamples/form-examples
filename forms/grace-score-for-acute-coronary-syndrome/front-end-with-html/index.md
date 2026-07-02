# GRACE Score for Acute Coronary Syndrome — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
GRACE admission wizard; `dashboard.html` is the clinician dashboard. Shared
`css/` and `js/` (the GRACE weighted-regression scoring engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

GRACE is a weighted regression point model, not a simple sum: each of the eight
admission variables (age, heart rate, systolic blood pressure, serum creatinine,
Killip class, cardiac arrest at admission, ST-segment deviation, elevated cardiac
enzymes) maps through a weighted, banded lookup in `js/rules.js`; the points are
summed into a GRACE total that is read against the in-hospital (≤108 / 109–140 /
>140) and 6-month (≤88 / 89–118 / >118) mortality-band thresholds, with the
overall risk category taken as the worse of the two bands.
