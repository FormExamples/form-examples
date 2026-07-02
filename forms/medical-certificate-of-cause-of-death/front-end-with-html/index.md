# Medical Certificate of Cause of Death — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Medical Certificate of Cause of Death (MCCD) wizard; `dashboard.html` is the
certifier / medical-examiner dashboard. Shared `css/` and `js/` (the validity
classification engine in `js/{types,rules,grader,flags}.js`, the apps in
`js/form-app.js` + `js/dashboard-app.js`).

The MCCD is a **statutory documentation instrument**, not a scored assessment
and **not a diagnostic tool**. The engine records the deceased's details, the
Part I direct causal sequence (I(a) → I(b) → I(c)) and Part II contributory
conditions with onset-to-death intervals, and the coroner / medical-examiner
referral status; it then classifies the certificate as **valid**,
**incomplete**, or **refer to coroner**, derives the **underlying cause** (the
lowest completed Part I line), and raises statutory, safety, and governance
flags. The classification is by precedence: a met coroner-referral criterion
takes priority over completeness; otherwise a missing Part I(a) or an
unacceptable sole "mode of death" makes the certificate incomplete; otherwise it
is valid. There is no numeric score. A **valid** classification does not
discharge the certifying doctor's duty to consider referral, and every
non-coroner death requires medical-examiner scrutiny before registration. The
prescribed statutory certificate remains the definitive legal record.
