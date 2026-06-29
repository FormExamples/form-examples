# Urinalysis Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the urinalysis test request /
order, with the seven request sections and the four-axis vetting grade
(appropriateness, preanalytical specimen suitability, request completeness,
triage priority) plus an overall recommendation. Lily Design System Svelte
conventions; rule IDs match the back-end. RESTful routes: a dashboard at
`/urinalysis-test-requests` lists sample requests with their computed triage tier
and recommendation, and `/urinalysis-test-requests/[id]` is the wizard, reusing
the same engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
