# Colonoscopy Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the lower-GI endoscopy
(colonoscopy) procedure request, with the seven request sections and the
four-axis vetting grade (appropriateness 1–9, cancer-pathway urgency, request
completeness, pre-procedure risk) plus an overall recommendation and
safety-critical flags. Lily Design System Svelte conventions; rule and flag IDs
match the HTML front-end and the back-end. A vetting dashboard at
`/colonoscopy-test-requests` lists sample requests with their computed triage
tier, risk band, and recommendation, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
