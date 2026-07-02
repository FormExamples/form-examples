# Zarit Burden Interview (ZBI) — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
caregiver-burden wizard; `dashboard.html` is the clinician dashboard. Shared
`css/` and `js/` (the ZBI scoring engine in `js/{types,rules,grader,flags}.js`,
the apps in `js/form-app.js` + `js/dashboard-app.js`).

The carer rates each item on the shared 0-4 frequency scale (0 = Never …
4 = Nearly always); a higher rating always means greater perceived burden, so
there is no reverse-scoring. An instrument-form selector chooses the full
**ZBI-22** (all 22 items summed to 0-88) or the validated **ZBI-12** short form
(the 12-item subset 1, 2, 3, 6, 9, 10, 11, 12, 17, 20, 21, 22 summed to 0-48).
The grader sums the answered ratings over the active item set and maps the total
to a burden band (ZBI-22: little-or-none 0-21 / mild-to-moderate 22-40 /
moderate-to-severe 41-60 / severe 61-88; ZBI-12: lower 0-16 / high ≥ 17). Flagged
issues (severe burden, moderate-to-severe burden, carer mental-health screen,
high global burden on item 22, incomplete assessment) are computed independently
of the band.
