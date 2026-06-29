# Integumentary Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Single continuous nine-step wizard (Demographics, Presenting Skin Concern,
Skin Inspection, Hair & Scalp Examination, Nail Examination, Wound Assessment,
Braden Scale Scoring, Photography & Documentation, Clinical Impression & Care
Plan) plus a tissue-viability SVAR dashboard. The pure engine under
`src/lib/engine/` (`types.ts`, `braden-rules.ts`, `integumentary-grader.ts`,
`flagged-issues.ts`, `utils.ts`) grades the Braden Scale and detects flags.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
