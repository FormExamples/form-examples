# X-Ray Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the plain-radiograph (X-ray)
request (referral), with the seven request sections and the four-axis vetting
grade (appropriateness, radiation safety, request completeness, triage priority)
plus a radiation-dose band, pregnancy / IR(ME)R safety flags, and an overall
recommendation. Lily Design System Svelte conventions; rule and flag IDs match
the back-end. RESTful routes: a vetting dashboard at `/x-ray-test-requests`
lists sample requests with their computed appropriateness band, radiation safety
band, triage tier, and recommendation, and `/x-ray-test-requests/[id]` is the
wizard, all reusing the same engine. See the form root [`../AGENTS.md`](../AGENTS.md)
and [`../spec/`](../spec).
