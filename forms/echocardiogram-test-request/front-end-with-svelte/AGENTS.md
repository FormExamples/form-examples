# Echocardiogram Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the cardiac echocardiogram
request (referral), with eight sections (referring clinician, patient
identification, requested examination, symptoms, investigations, red flags,
triage, review) and the four-axis grade (appropriateness, urgency, request
completeness, clinical priority) plus an overall recommendation and
safety-critical flags. Lily Design System Svelte conventions; rule and flag IDs
match the back-end and the HTML front-end. RESTful routes: a vetting dashboard
at `/echocardiogram-test-requests` lists sample requests with their computed
grades, and `/echocardiogram-test-requests/[id]` is the wizard, reusing the same
engine. See the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
