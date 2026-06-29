# Nerve Conduction Study Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the nerve conduction study /
EMG (electrodiagnostic) request, with the seven request sections and the
four-axis vetting grade (appropriateness, procedural risk, request completeness,
triage priority) plus an overall recommendation. Lily Design System Svelte
conventions; rule IDs match the back-end. A dashboard at
`/nerve-conduction-study-test-requests` lists sample requests with their computed
triage tier and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
