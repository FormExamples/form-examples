# NIPE — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the NIPE specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **classification / completeness** form — the engine classifies each
key component (eyes, heart, hips, testes) as `satisfactory` / `refer` /
`not-examined` (testes → `not-applicable` for girls) and rolls the applicable
components up into an overall outcome (`satisfactory` / `refer` / `incomplete`).
There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `nipe-rules.ts`, `nipe-grader.ts`, `flagged-issues.ts`) + `nipe-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (9 steps: context, baby, risk factors, eyes, heart, hips, testes, systematic,
  summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/newborn-and-infant-physical-examinations/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Per-component classification then an outcome roll-up (no total):

```
each key component = refer trigger ? 'refer'
                   : all obs unexamined ? 'not-examined' : 'satisfactory'
testes             = sex != 'male' ? 'not-applicable' : (as above)

overallOutcome     = any 'refer' ? 'refer'
                   : any 'not-examined' ? 'incomplete' : 'satisfactory'
completeness       = any applicable 'not-examined' ? 'incomplete' : 'complete'
```

Each `refer` component emits a `Referral { component, pathway, urgency }`.
`calculateNipeGrade` returns the four component results, the overall outcome,
completeness (+ percent), the referral pathways, the fired-rule audit trail, and
the flagged issues.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- An enum observation counts as unexamined when blank or `not-examined`.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
