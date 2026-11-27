# Medical Renal Living Donor Request: HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
wizard; `dashboard.html` is the vetting dashboard. Shared `css/` and `js/`.
Engine: `js/rules.js` (axes), `js/flags.js`, `js/grader.js` (`calculateGrade`).
Turnaround targets (`TARGETS` in `rules.js`) and tube volumes (`TEST_DEFINITIONS` in `types.js`) are local-policy defaults.
