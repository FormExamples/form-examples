# Ottawa Knee Rule — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
Ottawa Knee Rule bedside wizard; `dashboard.html` is the clinician dashboard.
Shared `css/` and `js/` (the Ottawa Knee Rule decision engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a decision rule (ANY-of), not a score: a knee X-ray is indicated when at
least one of the five criteria is present.
