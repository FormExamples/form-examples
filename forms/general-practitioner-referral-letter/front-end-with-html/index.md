# General Practitioner Referral Letter — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
referral-letter wizard; `dashboard.html` is the referrals dashboard. Shared
`css/` and `js/` (the completeness / urgency engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a documentation-completeness and urgency-classification instrument, not
a scored assessment: the engine grades a referral's completeness (`Complete` /
`Incomplete`) with a completeness percentage, echoes its urgency (`routine` /
`urgent` / `two-week-wait` suspected cancer / `emergency`), records which
mandatory-field rules fired, and raises flags. There is no numeric clinical
score. The mandatory-field set depends on the selected urgency, and the urgency
is echoed even when the referral is incomplete so the correct pathway is never
hidden by an unfinished form.
