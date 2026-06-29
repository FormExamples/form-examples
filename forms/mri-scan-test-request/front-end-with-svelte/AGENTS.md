# MRI Scan Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the MRI scan request
(referral), with the eight request sections and the four-axis vetting grade
(ACR appropriateness, MRI safety, request completeness, triage priority) plus a
gadolinium-vs-eGFR contrast-renal check, safety flags, and an overall
recommendation. Lily Design System Svelte conventions; rule and flag IDs match
the back-end. RESTful routes: a vetting dashboard at `/mri-scan-test-requests`
lists sample requests with their computed safety band, triage tier, and
recommendation, and `/mri-scan-test-requests/[id]` is the wizard, all reusing
the same engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
