# Nursing Care Plan — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
care-plan wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the completeness engine in `js/{types,rules,flags,grader}.js`, the
apps in `js/form-app.js` + `js/dashboard-app.js`).

This is a **multi-table relational** form: a parent care-plan record plus a
repeating array of **problem** cards, each carrying its own repeating **goal**
and **intervention** rows and an inline evaluation (the ADPIE nursing process).
The engine grades per-problem completeness (Complete / Partial / Incomplete),
rolls the problems up to a plan status, computes a completeness percentage, and
raises flagged issues. It is a documentation and completeness aid, not a
numeric score.
