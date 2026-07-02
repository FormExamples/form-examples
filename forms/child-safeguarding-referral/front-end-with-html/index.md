# Child Safeguarding Referral — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
child safeguarding referral wizard; `dashboard.html` is the duty-team dashboard.
Shared `css/` and `js/` (the completeness / urgency engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a documentation-completeness and risk-classification instrument, not a
scored assessment: the engine grades a referral's completeness (`complete` /
`partial` / `incomplete`) with a completeness percentage, classifies its
urgency (`emergency` / `urgent` under Children Act 1989 s47, or `standard` under
s17), records which mandatory rules fired, and raises safeguarding flags. There
is no numeric clinical score. Urgency is always computed — even when the
referral is incomplete — so danger is never hidden by an unfinished form.
