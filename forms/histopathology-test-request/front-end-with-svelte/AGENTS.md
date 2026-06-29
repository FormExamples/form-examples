# Histopathology Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the tissue histopathology
specimen request, with the seven request sections and the four-axis vetting
grade (appropriateness 1–9 + band, specimen quality, request completeness,
urgency triage) plus an overall recommendation. Lily Design System Svelte
conventions; rule and flag IDs match the back-end. A dashboard at
`/histopathology-test-requests` lists sample requests with their computed triage
tier and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
