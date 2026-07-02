# Waterlow Pressure Ulcer Risk Assessment — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Waterlow pressure-ulcer risk-assessment wizard; `dashboard.html` is the
clinician dashboard. Shared `css/` and `js/` (the Waterlow scoring engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The engine maps each core category (build / weight for height, skin type, sex
and age, continence, mobility) and each special-risk group (tissue malnutrition,
neurological deficit, major surgery or trauma, medication) to its weighted
points and **sums** them into a total Waterlow score. A higher total means
higher risk: the total maps to a risk band (low under 10, at risk 10-14, high
15-19, very high 20+) and a prevention recommendation. An existing-pressure-
damage flag, discoloured / broken skin, multiple special-risk factors, and an
incomplete assessment raise independent red-flag issues.
