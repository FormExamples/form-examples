# US Standard Certificate of Death — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
US Standard Certificate of Death wizard (eleven steps); `dashboard.html` is the
certifier dashboard. Shared `css/` and `js/` (the validity classification engine
in `js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The certificate is a **documentation-support instrument**, not a scored
assessment, **not a diagnostic tool**, and **not legal advice**. The engine
records the decedent and death details, the certifier, the Part I cause-of-death
chain with intervals and Part II, the manner of death, tobacco, pregnancy and
injury items, the medical examiner or coroner referral, the funeral director's
disposition, and the certified-copy order. It classifies the certificate as
**valid**, **incomplete**, or **refer to medical examiner or coroner**, derives
the **underlying cause** (the lowest completed Part I line), and raises
prioritized flags. Classification is by precedence: a referral criterion first;
otherwise a missing Part I line (a), a mechanism of death standing alone, or a
blank required item makes it incomplete; otherwise it is valid. `STATE_RULES` in
`js/rules.js` holds the per-state filing deadlines and certified-copy fees for
eight states; any other state falls back to a uniform default and raises a
"verify state rule" flag. The registering state agency decides.
