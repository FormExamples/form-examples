# Newborn Blood Spot Screening — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
screening wizard; `dashboard.html` is the screening dashboard. Shared `css/`
and `js/` (the pure classification engine in `js/{types,rules,flags,grader}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

This is a documentation-and-classification record, not a numeric score: each of
the nine screened conditions (SCD, CF, CHT, PKU, MCADD, MSUD, IVA, GA1, HCU)
carries one result class, and `gradeBloodspot` derives the overall outcome,
referral status, sample quality, and flagged issues.
