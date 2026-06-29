# Genetic Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the clinical genetics /
genomic test request (referral), with the six request sections and the four-axis
vetting grade (appropriateness 1–9 + band, consent & counselling, request
completeness, triage priority) plus an overall recommendation. Lily Design
System Svelte conventions; rule IDs match the back-end. A dashboard at
`/genetic-test-requests` lists sample requests with their computed grade and
recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
