# Blood Cross-Match Test Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for the
engine unit tests.

Single-page, seven-step clinician wizard plus a transfusion-laboratory vetting
dashboard. The shared engine in `src/lib/engine/` grades each request on four
independent axes — appropriateness (NICE NG24), identity / sample safety
(BSH / SHOT), request completeness, and triage priority — and raises
safety-critical flags.

RESTful routes: `/blood-cross-match-test-requests/` (dashboard) and
`/blood-cross-match-test-requests/[id]` (wizard) + `[id]/report` + `[id]/report/pdf`.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the clinical specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
