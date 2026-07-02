# Child Safeguarding Referral — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
and the living spec [`../spec/index.md`](../spec/index.md) for the data model,
completeness rules, urgency classification, and flag rules. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a documentation-completeness and risk-classification form, not a scored
assessment: the engine returns `{ status, urgency, completenessPercent,
satisfiedCount, mandatoryCount, firedRules, flaggedIssues }` — no numeric
clinical score. Urgency is always computed, even for an incomplete referral.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`,
  `child-safeguarding-rules.ts`, `child-safeguarding-grader.ts`,
  `flagged-issues.ts`) + `child-safeguarding-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (Step1Referrer … Step9Action).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample referrals + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/child-safeguarding-referrals/` — RESTful routes:
  `/child-safeguarding-referrals` (dashboard, `ssr = false`) +
  `/child-safeguarding-referrals/[id]` (wizard) +
  `/child-safeguarding-referrals/[id]/report` (+ `report/pdf` server endpoint).

## Conventions

- Empty string `''` for unanswered text / enum / date fields; `null` for the
  unanswered numeric age field.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- The consent section (step 7) is conditional: the lawful-basis field shows when
  consent is not given; the unsafe-to-inform reason shows when the family is
  unaware (`familyAware === 'no'`), which also drives the conditional
  completeness slot and the child-unaware flag.
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
