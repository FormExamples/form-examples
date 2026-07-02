# Ottawa Ankle Rules — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Ottawa Ankle / Foot Rules bedside wizard; `dashboard.html` is the clinician
dashboard. Shared `css/` and `js/` (the Ottawa decision engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This instrument is a boolean **decision rule**, not a numeric score: the engine
emits two independent imaging decisions — ankle X-ray indicated (yes/no) and
foot X-ray indicated (yes/no) — plus the criteria that drove them. There is no
total and no risk band.
