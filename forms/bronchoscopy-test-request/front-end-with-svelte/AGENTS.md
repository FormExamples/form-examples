# Bronchoscopy Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the bronchoscopy request
(referral), with seven request sections and the four-axis vetting grade
(appropriateness 1–9 score + band, cancer-pathway urgency, request completeness,
pre-procedure risk) plus an overall recommendation and safety flags. Lily Design
System Svelte conventions; rule and flag IDs match the back-end and every other
front-end. The RESTful dashboard at `/bronchoscopy-test-requests` (SVAR
DataGrid) lists sample requests with their computed triage tier, risk band, and
recommendation, reusing the same engine; the wizard lives at
`/bronchoscopy-test-requests/[id]`. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
