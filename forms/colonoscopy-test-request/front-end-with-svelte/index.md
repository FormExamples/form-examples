# Colonoscopy Test Request — front-end with Svelte

SvelteKit single continuous single-page wizard for capturing a lower-GI
endoscopy (colonoscopy) procedure request and presenting the four-axis vetting
grade (appropriateness 1–9, cancer-pathway urgency, request completeness,
pre-procedure risk) plus the overall vetting recommendation and safety-critical
flags. RESTful routes: a vetting dashboard at `/colonoscopy-test-requests` lists
sample requests, and `/colonoscopy-test-requests/[id]` opens the wizard, with
`/colonoscopy-test-requests/[id]/report` and `.../report/pdf` for the report.
