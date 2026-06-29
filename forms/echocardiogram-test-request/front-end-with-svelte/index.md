# Echocardiogram Test Request — front-end with Svelte

SvelteKit single continuous single-page wizard for capturing a cardiac
echocardiogram request (referral) and presenting the four-axis grade
(appropriateness, urgency, request completeness, clinical priority) plus the
overall vetting recommendation and safety-critical flags. RESTful routes: a
vetting dashboard at `/echocardiogram-test-requests` lists sample requests with
their engine-computed grades, and `/echocardiogram-test-requests/[id]` is the
wizard. The same engine grades both the form and the dashboard.
