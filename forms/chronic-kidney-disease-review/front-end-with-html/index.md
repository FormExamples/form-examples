# Chronic Kidney Disease Annual Review — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
review wizard; `dashboard.html` is the clinician dashboard. Shared `css/` and
`js/` (the KDIGO-classification-and-completeness engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

This is a classification and documentation-completeness instrument, not a
numeric score. The engine (NICE NG203, KDIGO 2012/2024) derives the
**G-stage** (G1–G5) from the current eGFR and the **albuminuria stage** (A1–A3)
from the urine ACR, indexes the pair into the KDIGO risk **heat-map** to a risk
zone (**low / moderate / high / very high**), selects the applicable
blood-pressure target (130/80 with diabetes or ACR &ge; 70, else 140/90), grades
the review **complete / partial / incomplete** against the recommended bundle,
and — independently — raises flags (very-high-risk referral, eGFR &lt; 30
referral, ACR &ge; 70 referral, rapid eGFR decline, hyperkalaemia, anaemia,
uncontrolled BP, nephrotoxic drug, missing ACR, incomplete). Everything runs
client-side and works from `file://` with no build step.
