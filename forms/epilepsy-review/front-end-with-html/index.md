# Epilepsy Annual Review — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
review wizard; `dashboard.html` is the clinician dashboard. Shared `css/` and
`js/` (the classification-and-completeness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a control-classification and documentation-completeness instrument, not
a numeric score. The engine (NICE NG217) classifies seizure control as
**seizure-free / controlled / uncontrolled** from the worst finding (an
increasing trend, weekly/daily frequency, or any status epilepticus force
uncontrolled; no seizures or a seizure-free trend give seizure-free; otherwise
controlled), grades the review **complete / partial / incomplete** by counting
the documented required domains (a missing core seizure or medication domain
forces incomplete; valproate / PPP and folic acid are required only for a woman
of childbearing potential), and — independently — raises safety flags
(specialist review, valproate / PPP, status epilepticus, DVLA driving, mental
health, SUDEP not documented, poor adherence, ASM side effects, folic acid
missing, review incomplete / overdue). Everything runs client-side and works
from `file://` with no build step.
