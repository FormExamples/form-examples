# Mental Health Act Assessment — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Mental Health Act assessment wizard; `dashboard.html` is the clinician
dashboard. Shared `css/` and `js/` (the legal-completeness / classification
engine in `js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The Mental Health Act Assessment is a **legal and clinical documentation
instrument**, not a scored assessment and **not an automated decision to
detain**. The engine classifies the recommended section (`section-2` /
`section-3` / `section-4` / `section-5-2` / `section-5-4` / `section-136` /
`none`), looks up that section's required signatories and statutory criteria,
validates **legal completeness** (`valid` / `incomplete`), classifies the
**urgency** (`routine` / `urgent` / `emergency`), and raises safety, legal, and
governance flags. There is no numeric clinical score. The statutory forms
prescribed under the Act remain the definitive legal record.
