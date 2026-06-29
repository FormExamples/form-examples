# Tumor Marker Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the serum tumour-marker
blood-test request, with the five request sections (requesting clinician,
patient identification, requested markers, clinical context, triage) and the
four-axis vetting grade (appropriateness, interpretation safety, request
completeness, urgency / triage priority) plus an overall recommendation. Lily
Design System Svelte conventions; rule / flag IDs match the back-end. A vetting
dashboard at `/tumor-marker-test-requests` lists sample requests with their
computed grades, reusing the same engine. See the form root
[`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
