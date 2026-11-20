# United States Property Tax Exemption Application — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../spec/index.md`](../spec/index.md)
for the specification and the eligibility engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and eligibility** instrument: the engine emits an
eligibility class (`likely-eligible` / `incomplete` / `likely-ineligible`), the
state filing deadline, whether the filing is late, the qualifying exemptions, and
a set of flagged issues. It is documentation support, not legal or tax advice;
the county assessor decides.

## Layout

- `src/lib/engine/` - `types.ts`, `rules.ts` (with `STATE_RULES`), `grader.ts`,
  `flags.ts`, `utils.ts`, `defaults.ts`, ported from the HTML front-end and
  checked against `../examples/personas.json` by `grader.test.ts`.
- `src/lib/components/steps/` - the eight wizard sections.
- `src/routes/united-states-property-tax-exemption-application/` - welcome page;
  `property-tax-exemption-applications/` (dashboard), `[id]` (wizard) and
  `[id]/report`.
