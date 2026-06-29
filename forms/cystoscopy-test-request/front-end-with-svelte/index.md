# Cystoscopy Test Request — front-end with Svelte

SvelteKit single continuous single-page wizard for capturing a cystoscopy
(bladder endoscopy) request and presenting the four-axis vetting grade
(appropriateness, cancer-pathway urgency, request completeness, pre-procedure
risk) plus the overall vetting recommendation. RESTful routes:
`/cystoscopy-test-requests/` (SVAR DataGrid vetting dashboard) and
`/cystoscopy-test-requests/[id]` (wizard) with `[id]/report` and
`[id]/report/pdf`.
