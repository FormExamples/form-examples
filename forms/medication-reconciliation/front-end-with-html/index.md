# Medication Reconciliation — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
reconciliation wizard (a parent header plus four repeating one-to-many child
lists — information sources, allergies, medication line items tagged `bpmh` or
`inpatient`, and reconciliation discrepancies); `dashboard.html` is the
clinician dashboard. Shared `css/` and `js/` (the reconciliation engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The engine grades a completeness **status** (Complete /
Discrepancies-outstanding / Incomplete), classifies each discrepancy, and raises
**safety flags**. It is a documentation-and-completeness instrument, not a
numeric score.
