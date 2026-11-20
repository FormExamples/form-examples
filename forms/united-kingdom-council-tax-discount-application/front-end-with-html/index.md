# United Kingdom Council Tax Discount Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Council Tax discount application wizard; `dashboard.html` is the applications
dashboard. Shared `css/` and `js/` (the eligibility engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The form is a **completeness and eligibility** instrument, not a scored
assessment. The engine takes the claim, the applicant and property, the occupant
roster, the evidence and the declaration; it classifies the application as
**likely eligible**, **incomplete** or **likely ineligible** (a disqualifying
fact outranks a missing item), counts the adults, states the indicative outcome
and raises flags. **Eligibility is decided by the billing authority**, not by
this form; every report carries that disclaimer.
