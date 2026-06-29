# PET Scan Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the PET-CT scan request
(referral), with the eight request sections and the four-axis vetting grade
(appropriateness, preparation safety and radiation dose, request completeness,
triage priority) plus an overall recommendation. Lily Design System Svelte
conventions; rule IDs match the back-end. A vetting dashboard at
`/pet-scan-test-requests` lists sample requests with their computed triage tier
and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
