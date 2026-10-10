# UK NHS DTAC — SvelteKit front-end

SvelteKit 3 + Svelte 5 + Lily Design System front-end for the UK NHS Digital
Technology Assessment Criteria (DTAC) form: a single-page, step-by-step wizard
that records 47 criteria across seven DTAC sections, grades them with the
shared engine and renders a report, plus a dashboard of assessments.

## Routes

Served at `/uk-nhs-digital-technology-assessment-criteria/`:

| URL | Purpose |
| --- | --- |
| `/` | Redirects to the welcome page |
| `/uk-nhs-digital-technology-assessment-criteria/` | Welcome page |
| `.../assessments` | Dashboard (SVAR DataGrid, sample rows from the engine) |
| `.../assessments/[id]` | Single-page wizard (`new` to create) |
| `.../assessments/[id]/report` | Report view (print) |

## Wizard steps

1 Supplier, 2 Product, 3 Assessor, 4-10 DTAC sections A-G (radio groups
generated from the criteria catalogue), 11 Review and outcome.

## Engine

`src/lib/engine/` is a TypeScript port of `../front-end-with-html/js/`
(`criteria.ts`, `grader.ts`, `flags.ts`; `types.ts`, `defaults.ts`) with
identical rule and flag IDs. `grader.test.ts` asserts every persona in
`../examples/personas.json` matches the engine's outcome, counts, sections,
fired rules and flags.

## Commands

```sh
pnpm install
pnpm test     # vitest
pnpm check    # svelte-check
pnpm build
pnpm dev
```
