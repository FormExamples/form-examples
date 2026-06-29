# Blood Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the pathology / phlebotomy
blood-test order, with the seven request sections (requesting clinician, patient
identification, requested panels, clinical context, pre-analytical and specimen,
patient safety, triage and submit) and the four-axis vetting grade
(appropriateness 1–9 + band, pre-analytical / specimen safety, request
completeness, triage priority) plus an overall recommendation and
safety-critical flags. Lily Design System Svelte conventions; rule IDs match the
back-end. A vetting dashboard at `/blood-test-requests` lists sample requests
with their computed grades, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
