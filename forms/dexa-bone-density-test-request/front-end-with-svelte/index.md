# DEXA Bone Density Test Request — front-end with Svelte

SvelteKit single continuous single-page wizard for capturing a DEXA / DXA
bone-density (osteoporosis) scan request and presenting the four-axis vetting
grade (appropriateness, radiation safety, request completeness, triage priority)
plus the overall vetting recommendation. RESTful routes: a vetting dashboard at
`/dexa-bone-density-test-requests` lists sample requests with their computed
grades, and `/dexa-bone-density-test-requests/[id]` is the request wizard.
