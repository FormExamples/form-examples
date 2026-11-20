# United States Vehicle Title and Registration Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
vehicle title and registration application wizard; `dashboard.html` is the clerk
dashboard. Shared `css/` and `js/` (the classification engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The application is a **completeness, validity, and eligibility instrument**, not
a scored assessment and **not legal advice**. The engine records the application
(state, transaction, acquisition), the owner identification, the vehicle and its
VIN, the federal odometer disclosure, the title history and brands, any lien,
insurance and inspections, and the fees and tax; it then classifies the
application as **ready to submit**, **incomplete**, or **title brand or lien
issue** and raises prioritized flags. The classification is by precedence: a
title brand, NMVTIS brand or theft record, unreleased lien, or "not actual
mileage" disclosure takes priority over completeness; otherwise any outstanding
item makes the application incomplete; otherwise it is ready to submit. There is
no numeric score. The issuing state agency decides whether to issue a title.

Nine states (CA, NY, TX, FL, IL, PA, OH, WA, AZ) carry encoded rules in
`js/rules.js` (`STATE_RULES`); any other state uses the uniform default and a
"verify the state rule" flag.
