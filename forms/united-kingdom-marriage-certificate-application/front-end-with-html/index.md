# United Kingdom Marriage Certificate Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United Kingdom Marriage Certificate Application wizard; `dashboard.html` is the
register-office dashboard. Shared `css/` and `js/` (the classification engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The application is a **completeness and validity instrument**, not a scored
assessment and **not legal advice**. The engine records the notice, the ceremony,
each party's identity, residence, previous-relationship and immigration
evidence, whether the parties are closely related, and the GRO certificate
order; it then classifies the application as **ready to submit**,
**incomplete**, **needs evidence or correction**, or **ineligible**, computes the
permitted ceremony window (notice + 29 days to notice + 12 months), and raises
flags. The classification is by precedence: ineligible, then incomplete, then
needs-evidence, otherwise ready to submit. There is no numeric score. A **ready
to submit** classification does not mean the notice will be accepted; the
register office decides each notice.
