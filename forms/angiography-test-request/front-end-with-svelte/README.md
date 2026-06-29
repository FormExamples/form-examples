# Angiography Test Request — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 (Lily Design System tokens).
Vitest for the engine unit tests.

Consolidated front-end for the vascular angiography request (referral): a
single-page, seven-step wizard plus a SVAR DataGrid vetting dashboard. The
shared pure engine grades each request on four axes (appropriateness, contrast /
radiation safety, request completeness, triage priority) and raises
safety-critical flags.

RESTful routes:

- `/` — welcome page
- `/angiography-test-requests` — vetting dashboard (SVAR DataGrid)
- `/angiography-test-requests/[id]` — request wizard (`new` for a blank draft)
- `/angiography-test-requests/[id]/report` — vetting report
- `/angiography-test-requests/[id]/report/pdf` — server-rendered PDF

See parent [`../index.md`](../index.md) for the clinical specification.
