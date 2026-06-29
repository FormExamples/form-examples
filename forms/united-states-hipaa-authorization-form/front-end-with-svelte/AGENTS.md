# United States HIPAA Authorization Form — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated gold front-end: a single-page nine-step authorization wizard plus
a SVAR DataGrid review dashboard, both driven by the shared HIPAA validity
engine.

See parent [`../index.md`](../index.md) for the full form specification.

## Structure

- `src/lib/engine/` — pure validity engine: `types.ts`, `defaults.ts`,
  `validation-rules.ts` (45 CFR § 164.508(c) core elements + required
  statements), `sensitive-category-rules.ts` (42 CFR Part 2, HIV/AIDS,
  mental-health, psychotherapy), `flagged-issues.ts`, `validate-authorization.ts`
  (entry point), `utils.ts` (labels/colours), `validate-authorization.test.ts`.
- `src/lib/stores/authorization.svelte.ts` — id-keyed reactive store
  (`authorization`); localStorage key
  `united-states-hipaa-authorization-form.front-end-with-svelte.<id>.v1`;
  in-place `deepAssign` merge; re-exports `createDefaultAuthorization`.
- `src/lib/components/steps/` — `Step1Patient` … `Step9SignatureWitness`.
- `src/routes/united-states-hipaa-authorization-forms/` — RESTful routes:
  `/` (dashboard, `ssr = false`), `/[id]` (wizard), `/[id]/report`,
  `/[id]/report/pdf`.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
