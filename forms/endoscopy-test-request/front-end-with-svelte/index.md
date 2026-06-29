# Endoscopy Test Request — front-end with Svelte

SvelteKit single-page wizard for capturing a GI endoscopy procedure request
(referral) and presenting the four-axis vetting grade (appropriateness 1–9,
cancer-pathway urgency / triage tier, request completeness, and pre-procedure
risk) plus the overall vetting recommendation and safety-critical flags. A
vetting dashboard at `/endoscopy-test-requests` lists sample requests with their
computed triage tier and pre-procedure risk, reusing the same pure engine.
