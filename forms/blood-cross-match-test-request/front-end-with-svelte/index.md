# Blood Cross-Match Test Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for the
engine unit tests.

A single-page, seven-step clinician wizard for a UK NHS–aligned blood
cross-match / transfusion compatibility request, plus a transfusion-laboratory
vetting dashboard. The shared pure engine grades each request on four
independent axes — appropriateness (NICE NG24), identity / sample safety
(BSH / SHOT), request completeness, and triage priority — derives an overall
vetting recommendation, and raises safety-critical flags.

## Routes

- `/` — welcome page.
- `/blood-cross-match-test-requests` — SVAR DataGrid vetting dashboard
  (client-only; `ssr = false`).
- `/blood-cross-match-test-requests/[id]` — the seven-step wizard.
- `/blood-cross-match-test-requests/[id]/report` — the vetting report.
- `/blood-cross-match-test-requests/[id]/report/pdf` — PDF endpoint (pdfmake).

See parent [`../index.md`](../index.md) for the full clinical specification
(steps, four-axis scoring engine, safety flags, conventions).
