# Eye Vision Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the ophthalmic / optometric
eye examination request, with the seven request sections and the four-axis
vetting grade (appropriateness, urgency / triage priority, request completeness,
clinical priority) plus an overall recommendation. Lily Design System Svelte
conventions; rule IDs match the back-end. A dashboard at
`/eye-vision-test-requests` lists sample requests with their computed triage
tier and clinical priority, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
