# Nuclear Medicine Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the nuclear medicine
(radionuclide imaging) request, with the seven request sections and the
four-axis vetting grade (ACR / RCR iRefer appropriateness, preparation &
radiation safety, request completeness, triage priority) plus safety-critical
flags and an overall recommendation. Lily Design System Svelte conventions;
rule and flag IDs match the back-end. RESTful routes: a vetting dashboard at
`/nuclear-medicine-test-requests` lists sample requests with their computed
safety band, triage tier, and recommendation, and
`/nuclear-medicine-test-requests/[id]` is the wizard, all reusing the same
engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
