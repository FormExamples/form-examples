# Microbiology Culture Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the microbiology specimen
culture / MC&S request, with the seven request sections and the four-axis
vetting grade (appropriateness, pre-analytical specimen safety, request
completeness, triage priority) plus an overall recommendation and
safety-critical flags. Lily Design System Svelte conventions; rule IDs match the
back-end. A dashboard at `/microbiology-culture-test-requests` lists sample
requests with their computed triage tier and recommendation, reusing the same
engine. See the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
