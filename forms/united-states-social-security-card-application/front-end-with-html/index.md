# Social Security Card Application (Form SS-5) — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Form SS-5 wizard; `dashboard.html` is the preparer dashboard. Shared `css/` and
`js/` (the classification engine in `js/{types,rules,grader,flags}.js`, the apps
in `js/form-app.js` + `js/dashboard-app.js`).

The form is a **documentation-support and completeness instrument**, not legal
advice and not an SSA decision. The engine records the request, the applicant,
the identity, age, and citizenship evidence, the signer, and the death-related
Tell-SSA items; it then classifies the application as **ready to submit**,
**incomplete**, **evidence missing**, or **not eligible**, and raises flags. The
classification is by precedence: a deceased applicant, or a replacement-card
limit (3 per calendar year, 10 per lifetime) with no supported exception, is
not eligible; otherwise blank required items, a mailed original card for an
applicant aged 12 or older, or an unsuitable signer for a minor make it
incomplete; otherwise any evidence gap makes it evidence missing; otherwise it
is ready to submit. There is no numeric score. The rules are federal, so the
state of residence is recorded but changes nothing. The Social Security number
is never collected.
