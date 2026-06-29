# Lumbar Puncture Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the lumbar puncture (LP)
request / referral, with the six request sections (requesting clinician, patient
identification, procedure and indication, raised-ICP and neuro safety, bleeding
and coagulation safety, procedure detail and triage) and the four-axis vetting
grade (appropriateness, safety / contraindication, request completeness, triage
priority) plus an overall recommendation. Lily Design System Svelte conventions;
rule IDs match the back-end. RESTful routes:
`/lumbar-puncture-test-requests` is the SVAR vetting dashboard and
`/lumbar-puncture-test-requests/[id]` is the wizard, reusing the same engine. See
the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
