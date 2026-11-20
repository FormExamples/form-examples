# United Kingdom Birth Registration — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United Kingdom Birth Registration wizard; `dashboard.html` is the registrar
dashboard. Shared `css/` and `js/` (the readiness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The form is an **administrative completeness-and-validity instrument**, not a
scored assessment and **not legal advice**. It collects the child, the mother,
the second parent and the basis for recording them, the informant and identity
evidence, and the certificate order, then classifies the application as **ready
to submit**, **incomplete**, **needs additional evidence**, or **out of scope**
by precedence (out of scope, then incomplete, then needs additional evidence),
reports the days from birth to registration against the 42-day statutory period,
and raises flags. A class of ready to submit does not guarantee registration: the
registrar's entry in the register remains the legal record.
