# Mental State Examination — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
examination wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the completeness-and-risk engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a documentation-and-completeness instrument, not a numeric score. The
engine grades the record **Complete** or **Partial** across the seven ASEPTIC
domains (Appearance and behaviour, Speech, Emotion, Perception, Thought,
Insight, Cognition), computes a `completenessPercent`, and derives a **risk
indicator** (none / low / moderate / high) from the highest-priority safety flag
raised. Everything runs client-side and works from `file://` with no build step.
