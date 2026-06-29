# Holter Monitor Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the ambulatory ECG (Holter)
monitoring request, with the six request sections and the four-axis vetting
grade (appropriateness, urgency / triage, request completeness, clinical
priority) plus an overall recommendation. Lily Design System Svelte conventions;
rule IDs match the back-end. A dashboard at `/holter-monitor-test-requests`
lists sample requests with their computed triage tier and recommendation,
reusing the same engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
