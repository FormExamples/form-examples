# Coagulation Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the coagulation / haemostasis
test request, with the seven request sections and the four-axis vetting grade
(appropriateness 1–9, pre-analytical specimen safety, request completeness,
triage priority) plus an overall recommendation and safety flags. Lily Design
System Svelte conventions; rule IDs match the back-end and the HTML front-end. A
vetting dashboard at `/coagulation-test-requests` lists sample requests with their
computed grade and recommendation, reusing the same engine. Active major bleeding
or suspected DIC auto-escalate the triage tier to STAT. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
