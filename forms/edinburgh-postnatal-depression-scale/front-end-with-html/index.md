# EPDS — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
EPDS self-report wizard; `dashboard.html` is the clinician dashboard. Shared
`css/` and `js/` (the EPDS scoring engine in `js/{types,rules,grader,flags}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

Each of the ten items presents four response options in the printed order; the
wizard stores the raw selected option index and the grader applies the
reverse-scoring for items 3, 5, 6, 7, 8, 9 and 10 (`score = 3 - optionIndex`)
before summing the 0-30 total, deriving the interpretation band
(lower / possible / likely), and raising the mandatory item-10 self-harm flag
whenever item 10 scores greater than 0 — independent of the total.
