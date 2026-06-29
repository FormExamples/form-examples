# Bronchoscopy Test Request — front-end with Svelte

SvelteKit single continuous single-page wizard for capturing a bronchoscopy
request (referral) and presenting the four-axis vetting grade (appropriateness,
cancer-pathway urgency, request completeness, pre-procedure risk) plus the
overall vetting recommendation and safety flags. RESTful routes: a vetting
dashboard at `/bronchoscopy-test-requests` (SVAR DataGrid over sample requests)
and the wizard at `/bronchoscopy-test-requests/[id]`, with a vetting report and
PDF at `/bronchoscopy-test-requests/[id]/report`.
