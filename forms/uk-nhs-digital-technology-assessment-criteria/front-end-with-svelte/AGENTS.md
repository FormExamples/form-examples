# AGENTS — front-end-with-svelte

Conventions: see [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).
Canonical reference: `forms/pre-operative-assessment-by-clinician/front-end-with-svelte/`.

- Routes nested under `src/routes/uk-nhs-digital-technology-assessment-criteria/`;
  collection is `assessments`.
- Engine in `src/lib/engine/` mirrors `../front-end-with-html/js/`. Do not diverge
  rule/flag IDs; `../examples/personas.json` is the oracle (`pnpm test`).
- `createDefaultAssessment()` lives in `src/lib/engine/defaults.ts`, not the store.
- Steps are `StepNName.svelte` (1-indexed); steps 4-10 wrap
  `ui/CriteriaSection.svelte`, which generates radios from `criteria.ts`.
- `''` for unanswered text/enum; `null` for unanswered dates (the date steps use
  function bindings to map `null` to the headless `DateInput`).
- Unlike the reference, no PDF endpoint; the report is a print view.

Verify: `pnpm test && pnpm check && pnpm build`, then the repo-root Svelte `--check` gates.
