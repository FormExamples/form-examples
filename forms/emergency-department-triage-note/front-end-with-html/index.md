# Emergency Department Triage Note — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
ED triage wizard; `dashboard.html` is the clinician dashboard. Shared `css/` and
`js/` (the classification engine in `js/{types,rules,grader,flags}.js`, the apps
in `js/form-app.js` + `js/dashboard-app.js`).

This is a **classification** form. The engine (`grader.js`) does not sum a
total: it computes a supporting NEWS2 aggregate from the vital signs, evaluates
the Manchester Triage System (MTS) discriminators, applies NEWS2 escalation
(aggregate ≥ 7 or any parameter 3 → at least Level 2; 5–6 → at least Level 3),
and assigns the **most urgent** MTS priority level (1 Red / Immediate / 0 min →
5 Blue / Non-urgent / 240 min). Red-flag issues (`flags.js`) — life threat,
sepsis, time-critical presentations, severe pain, incomplete triage — are raised
independently of the assigned level.
