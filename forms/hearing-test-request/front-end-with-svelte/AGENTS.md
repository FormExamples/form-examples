# Hearing Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the audiology /
hearing-assessment request, with the six request sections and the four-axis
vetting grade (appropriateness 1–9 + band, urgency triage, request completeness,
clinical priority) plus an overall recommendation and safety-critical flags.
Lily Design System Svelte conventions; rule and flag IDs match the HTML
front-end engine and the back-end. The RESTful dashboard at
`/hearing-test-requests` lists sample requests with their computed triage tier
and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
