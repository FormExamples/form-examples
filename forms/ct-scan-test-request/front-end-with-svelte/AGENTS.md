# CT Scan Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the CT (computed tomography)
scan request (referral), with the eight request sections and the four-axis
vetting grade (appropriateness 1–9, radiation & contrast safety, request
completeness, triage priority) plus an overall recommendation and
safety-critical flags. Lily Design System Svelte conventions; rule and flag IDs
match the source-of-truth HTML engine and the back-end. RESTful routes:
`/ct-scan-test-requests/` (SVAR vetting dashboard) and
`/ct-scan-test-requests/[id]` (wizard) + `[id]/report` + `[id]/report/pdf`. The
dashboard lists sample requests with their computed grades, reusing the same
engine. See the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
