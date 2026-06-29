# Coagulation Test Request — front-end with Svelte

SvelteKit single continuous single-page wizard for capturing a coagulation /
haemostasis test request and presenting the four-axis vetting grade
(appropriateness 1–9, pre-analytical specimen safety, request completeness,
triage priority) plus the overall vetting recommendation and safety flags. The
RESTful routes are `/coagulation-test-requests/` (SVAR vetting dashboard) and
`/coagulation-test-requests/[id]` (wizard) with `[id]/report` and
`[id]/report/pdf`. The same engine grades both the form and the dashboard.
