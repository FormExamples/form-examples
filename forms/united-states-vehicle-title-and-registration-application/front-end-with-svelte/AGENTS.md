# United States Vehicle Title and Registration Application — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness, validity, and eligibility** instrument: the engine
emits an application class (`ready-to-submit` / `incomplete` /
`title-brand-or-lien-issue`), the VIN status, whether an odometer disclosure is
required, the outstanding-item count, and a set of flagged issues. There is
**no numeric score**, and it is documentation support, not legal advice; the
issuing state agency decides.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `defaults.ts`,
  `utils.ts`, `title-rules.ts`, `title-grader.ts`, `flagged-issues.ts`) +
  `title-grader.test.ts`, which checks every persona in
  `../examples/personas.json` against the HTML engine's pinned output.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge. `createDefaultApplication()`
  lives in `engine/defaults.ts`, not in the store, so tests can import it.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (8 steps: application, owner, vehicle, odometer, title history, lien,
  insurance and inspections, fees and tax).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample applications (the first personas) and
  engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-states-vehicle-title-and-registration-application/vehicle-title-applications/`
  — RESTful routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]`
  (wizard) + `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported line for line from the HTML front-end's `js/{types,rules,grader,flags}.js`.
`validateApplication(data)` assigns exactly one class (first match wins:
`title-brand-or-lien-issue` > `incomplete` > `ready-to-submit`), and
`detectFlaggedIssues(data)` returns the flags. `STATE_RULES` covers CA, NY, TX,
FL, IL, PA, OH, WA, and AZ; any other state uses the uniform default and raises a
"verify the state rule" flag. All functions are pure: no I/O, no clock.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Generic Lily `Badge`; no cardiovascular entry components.
- Keep the TypeScript engine in step with the HTML engine; the persona test fails if they diverge.
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run lint
pnpm run format:check
pnpm run build
pnpm exec vitest run
```
