# Epilepsy Annual Review — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the epilepsy-review specification and classification engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and decision-support** form — the engine classifies
seizure control, grades review completeness over the required domains, and
raises safety flags. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification-and-completeness engine
  (`types.ts`, `utils.ts`, `epilepsy-review-rules.ts`,
  `epilepsy-review-grader.ts`, `flagged-issues.ts`) +
  `epilepsy-review-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (11 steps: context, profile, seizures, medication, triggers, SUDEP, injuries,
  safety, childbearing, mental health, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (control + completeness, not score).
- `src/routes/epilepsy-reviews/` — RESTful routes: `/epilepsy-reviews/`
  (dashboard, `ssr = false`) + `/epilepsy-reviews/[id]` (wizard) +
  `/epilepsy-reviews/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Seizure-control classification and documentation completeness (no total):

```
control      = uncontrolled | controlled | seizure-free
               (uncontrolled: increasing trend, any status epilepticus, or
                weekly/daily frequency; seizure-free: no seizures or a
                seizure-free trend; controlled: everything else)
reviewStatus = incomplete (seizure or medication gate missing)
               | complete (all applicable domains) | partial
```

The valproate / PPP and folic-acid domains are required for completeness only
when `womanOfChildbearingPotential === 'yes'`. `review()` returns the seizure
control, the review status, the completeness score, the per-domain documented
flags, the fired-rule audit trail, and the safety flags.

## Conventions

- British English throughout.
- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
