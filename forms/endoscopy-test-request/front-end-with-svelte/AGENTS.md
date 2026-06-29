# Endoscopy Test Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the GI endoscopy procedure
request (referral), with the eight request sections and the four-axis vetting
grade (appropriateness 1–9, cancer-pathway urgency / triage tier, request
completeness, and pre-procedure risk via Glasgow-Blatchford + Rockall + BSG/ESGE
anticoagulant stratification) plus an overall recommendation and safety-critical
flags. Lily Design System Svelte conventions; rule IDs (`R-APPROP-*`,
`R-URGENCY-*`, `R-COMPLETE-*`, `R-RISK-*`) and flag IDs (`F-*`) match the
back-end. RESTful routes: `/endoscopy-test-requests/` (SVAR vetting dashboard) +
`/endoscopy-test-requests/[id]` (wizard) + `[id]/report` + `[id]/report/pdf`,
all reusing the same engine. See the form root [`../AGENTS.md`](../AGENTS.md) and
[`../spec/`](../spec).
