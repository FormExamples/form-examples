# General Practitioner Referral Letter — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
and the living spec [`../spec/index.md`](../spec/index.md) for the data model,
completeness rules, urgency classification, and flag rules. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a documentation-completeness and urgency-classification form, not a
scored assessment: the engine returns `{ status, urgency, completenessPercent,
presentCount, mandatoryCount, firedRules, flaggedIssues }` — no numeric clinical
score. Urgency is always echoed, even for an incomplete referral.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`,
  `gp-referral-rules.ts`, `gp-referral-grader.ts`, `flagged-issues.ts`) +
  `gp-referral-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (Step1Referrer … Step9Review).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample referrals + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/general-practitioner-referral-letters/` — RESTful routes:
  `/general-practitioner-referral-letters` (dashboard, `ssr = false`) +
  `/general-practitioner-referral-letters/[id]` (wizard) +
  `/general-practitioner-referral-letters/[id]/report` (+ `report/pdf` server endpoint).

## Conventions

- Empty string `''` for unanswered text / enum / date fields.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- The urgency section (step 4) is conditional: the urgency-reason field shows for
  any non-routine urgency; the NICE NG12 suspected-cancer criterion and pathway
  fields show for two-week-wait referrals. These conditional fields also expand
  the mandatory-field set the grader evaluates.
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
