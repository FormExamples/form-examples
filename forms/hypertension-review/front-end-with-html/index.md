# Hypertension Annual Review — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
review wizard; `dashboard.html` is the clinician dashboard. Shared `css/` and
`js/` (the control-classification-and-completeness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a control-classification and documentation-completeness instrument, not
a numeric score. The engine (NICE NG136) selects the tightest applicable
blood-pressure target from the patient's age band and comorbidity, classifies
control against the primary reading (home/ambulatory if present, else clinic) as
**controlled / uncontrolled / severe-uncontrolled**, assigns a hypertension
**stage** (none / stage-1 / stage-2 / stage-3-severe) from the raw readings,
grades the review **complete / partial / incomplete**, and — independently —
raises flags (severe hypertension, uncontrolled BP, missing bloods, missing ACR,
high CV risk untreated, adherence concern, postural drop, incomplete). The clinic
reading always drives the &ge; 180/120 severe classification. Everything runs
client-side and works from `file://` with no build step.
