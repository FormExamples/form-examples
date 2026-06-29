# Cardiac Stress Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the cardiac stress / exercise
test request, with the seven request sections and the four-axis vetting grade
(appropriateness, safety / contraindication, request completeness, triage
priority) plus an overall recommendation. Lily Design System Svelte conventions;
rule and flag IDs match the back-end. A vetting dashboard at
`/cardiac-stress-test-requests` lists sample requests with their computed triage
tier and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
