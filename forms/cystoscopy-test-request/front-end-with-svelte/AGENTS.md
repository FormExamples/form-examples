# Cystoscopy Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the cystoscopy (bladder
endoscopy) request, with the six request sections and the four-axis vetting
grade (appropriateness, cancer-pathway urgency, request completeness,
pre-procedure risk) plus an overall recommendation. Lily Design System Svelte
conventions; rule and flag IDs match the HTML front-end and the back-end. A
vetting dashboard at `/cystoscopy-test-requests/` lists sample requests with
their computed cancer-pathway urgency and recommendation, reusing the same
engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
