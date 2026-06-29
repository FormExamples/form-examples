# PET Scan Test Request — front-end with Svelte

SvelteKit single-page wizard for capturing a PET-CT scan request (referral) and
presenting the four-axis vetting grade (appropriateness, preparation safety and
radiation dose, request completeness, triage priority) plus the overall vetting
recommendation. A vetting dashboard at `/pet-scan-test-requests` lists sample
requests with their computed grades, reusing the same engine.
