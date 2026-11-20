# United States Marriage License Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United States marriage license application wizard; `dashboard.html` is the
application review dashboard. Shared `css/` and `js/` (the eligibility
classification engine in `js/{types,rules,grader,flags}.js`, the apps in
`js/form-app.js` + `js/dashboard-app.js`).

The application is a **documentation-support instrument**, not legal advice. The
engine records the issuing state and county, both applicants, eligibility (age
and consent, prior marriages, relationship, proxy), the license issuance and fee,
and the ceremony and certified-certificate steps. It classifies the application
as **ready-to-apply**, **incomplete**, or **not-eligible**, derives the earliest
permitted ceremony date and the license expiry from a per-state rule table
(`STATE_RULES` in `js/rules.js`), and raises flagged issues. Not-eligible takes
precedence over incomplete. An unlisted state falls back to the uniform default
and raises a "verify state rule" flag. The issuing county clerk or a court decides.

See [`../spec/index.md`](../spec/index.md) for the rules and the sources in
[`../doc/`](../doc/).
