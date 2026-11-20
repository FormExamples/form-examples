# United States Property Tax Exemption Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United States Property Tax Exemption Application wizard; `dashboard.html` is the
assessor dashboard. Shared `css/` and `js/` (the eligibility engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The application is a **completeness and eligibility instrument**, not a scored
assessment and **not legal or tax advice**. The engine records the applicant,
the parcel, ownership and occupancy on the assessment date, the exemptions
claimed (homestead, senior, disability, disabled veteran, circuit-breaker), the
household income, the proof documents, the filing date, the assessment-appeal
basics and the signed declaration. It classifies the application as **likely
eligible**, **incomplete** or **likely ineligible** by precedence: a failed base
requirement (ownership, occupancy, a single homestead), a filing after the state
deadline, or every claimed exemption failing the state test makes it likely
ineligible; otherwise any missing item makes it incomplete; otherwise it is
likely eligible. `STATE_RULES` in `js/rules.js` encodes the deadline, senior
age and income limit for CA, NY, TX, FL, IL, PA, OH and WA; any other state uses
a default rule and raises a verify flag. The county assessor or state agency
decides.
