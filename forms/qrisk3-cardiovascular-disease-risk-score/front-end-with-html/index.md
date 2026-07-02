# QRISK3 Cardiovascular Disease Risk Score — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
assessment wizard; `dashboard.html` is the clinician dashboard. Shared `css/`
and `js/` (the representative weighted risk engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The wizard collects the QRISK3 model inputs across eight steps (context,
identification, eligibility, lifestyle, cardiometabolic measurements,
comorbidities, medication, summary) and shows a live 10-year CVD risk
percentage. Submission produces a report with the risk percentage, risk band
(`low` / `raised` / `high`), an estimated heart age, the weighted contributions,
and flagged issues (statin offer, high risk, not eligible, missing cholesterol,
incomplete, severe hypertension).

**Representative model.** The engine (`js/rules.js` + `js/grader.js`) is a
documented approximation in the *shape* of QRISK3 — a sex-specific linear
predictor mapped through an approximate baseline survival — not the official
QRISK3-2017 Cox coefficient set. It is for demonstration only and must not drive
real prescribing decisions.
