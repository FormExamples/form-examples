# Electroencephalogram Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the electroencephalogram
(EEG) test request (referral), with the request sections (requesting clinician,
patient identification, requested examination, seizure / epilepsy context, red
flags, triage, review) and the four-axis vetting grade (appropriateness,
urgency, request completeness, clinical priority) plus an overall
recommendation and safety-critical flags. Lily Design System Svelte
conventions; rule IDs match the back-end. A dashboard at
`/electroencephalogram-test-requests` lists sample requests with their computed
triage tier, appropriateness, clinical priority, and recommendation, reusing
the same engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
