# United States Health Care Power of Attorney — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
health care power of attorney wizard; `dashboard.html` is the reviewer
dashboard. Shared `css/` and `js/` (the readiness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The form is a **documentation and execution-readiness instrument**, not a scored
assessment and **not legal advice**. The engine records the principal, the agent
and successors, the agent's authority, treatment wishes, and how the document is
signed; it classifies the directive as **ready to execute**, **incomplete**, or
**execution risk** against the principal's state rule (`STATE_RULES` in
`js/rules.js`: CA, NY, TX, FL, IL, PA, OH, WA, with a uniform default and a
"verify state rule" flag for other states) and raises flagged issues. An
execution risk takes precedence over incompleteness. A court, the treating
facility, and the state decide whether a directive is valid.
