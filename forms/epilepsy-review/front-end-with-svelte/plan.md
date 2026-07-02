# Epilepsy Annual Review — SvelteKit front-end plan

## Status: complete

Greenfield SvelteKit front-end (wizard + dashboard) built on the shared,
pure seizure-control-and-completeness engine. Mirrors the consolidated
gold-standard layout (RESTful `/epilepsy-reviews/` list + `/epilepsy-reviews/[id]`
form).

## Done

- **Engine** (`src/lib/engine/`): ported from the HTML front-end
  (`types` / `rules` / `grader` / `flags`) to TypeScript —
  `types.ts`, `utils.ts`, `epilepsy-review-rules.ts`,
  `epilepsy-review-grader.ts`, `flagged-issues.ts`. Seizure control
  (seizure-free / controlled / uncontrolled), review completeness with
  seizure + medication gates and applicable-only childbearing domains, and the
  full safety-flag set.
- **Tests** (`epilepsy-review-grader.test.ts`): local `createDefaultAssessment`
  fixture (no store import); covers each control class, each completeness grade,
  and every flag including the valproate / PPP edge cases.
- **Store** (`stores/assessment.svelte.ts`): id-keyed Svelte 5 runes store with
  `deepAssign` deep-merge, `createDefaultAssessment()`, and localStorage key
  `epilepsy-review.front-end-with-svelte.<id>.v1`.
- **Config** (`config/steps.ts`, `config/themes.ts`): 11-step wizard config and
  the Lily theme catalogue.
- **Data** (`data/sample-reports.ts`): four sample reviews spanning the control
  classes and completeness statuses, with engine-derived dashboard rows.
- **Steps** (`components/steps/Step1..Step11`): the eleven wizard sections.
- **Routes**: welcome, dashboard (`ssr = false`), `[id]` wizard, report, and the
  `report/pdf` server endpoint.
- **Report** (`report/pdf-builder.ts`): `pdfmake` document (control +
  completeness + flags, no score).

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
