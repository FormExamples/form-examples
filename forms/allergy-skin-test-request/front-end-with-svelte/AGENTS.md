# Allergy Skin Test Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 (Lily Design System tokens) +
SVAR DataGrid. Vitest for the four-axis grading engine.

Single continuous wizard at `/allergy-skin-test-requests/[id]` and a vetting
dashboard at `/allergy-skin-test-requests`. The pure engine in
`src/lib/engine/` grades each request on four axes — appropriateness, validity
and safety, request completeness, and triage priority — and raises safety flags.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
