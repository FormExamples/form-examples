# DEXA Bone Density Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the DEXA / DXA bone-density
(osteoporosis) scan request, with the seven request sections (requesting
clinician, patient identification, requested examination, fracture-risk factors,
previous DEXA, triage, review) and the four-axis vetting grade (appropriateness,
radiation safety, request completeness, triage priority) plus an overall
recommendation. Lily Design System Svelte conventions; rule IDs match the
back-end. A dashboard at `/dexa-bone-density-test-requests` lists sample requests
with their computed triage tier and recommendation, reusing the same engine. See
the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
