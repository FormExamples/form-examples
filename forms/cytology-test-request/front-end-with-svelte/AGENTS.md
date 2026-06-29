# Cytology Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the cytology specimen
request (referral), with the six request sections and the four-axis vetting
grade (appropriateness, pre-analytical specimen adequacy, request completeness,
triage priority) plus an overall recommendation and safety-critical flags. Lily
Design System Svelte conventions; rule IDs match the back-end. A dashboard at
`/cytology-test-requests` lists sample requests with their computed triage tier
and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
