# Newborn Blood Spot Screening — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and result-classification** form — each of the nine
screened conditions carries one result class, and the engine derives the overall
screening outcome by precedence (`referral-required` > `repeat-required` >
`incomplete` > `declined-only-outstanding` > `all-not-suspected`) plus a referral
status. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `bloodspot-rules.ts`, `bloodspot-grader.ts`, `flagged-issues.ts`) +
  `bloodspot-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (7 steps: sample-taker, baby, consent, sample event, quality, conditions,
  summary).
- `src/lib/components/ui/` — Lily Svelte headless component set (generic Badge).
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/newborn-blood-spot-screenings/` — RESTful routes: `/<plural>/`
  (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Engine

Per-condition classification then an outcome roll-up by precedence (no total):

```
each condition   = one result class (not-suspected / suspected / carrier /
                   repeat-required / declined / pending); '' and an invalid
                   carrier are treated as 'pending' for outcome purposes.
overallOutcome   = any suspected      ? 'referral-required'
                 : any repeat-required ? 'repeat-required'
                 : any pending         ? 'incomplete'
                 : any declined        ? 'declined-only-outstanding'
                 : 'all-not-suspected'
referralStatus   = referral-required ? 'urgent' : repeat-required ? 'repeat' : 'routine'
```

Each `suspected` condition emits a `Referral { code, service, urgency: 'urgent' }`.
`gradeBloodspot` returns the recomputed age at sample, the nine condition
results, the urgent referrals, the overall outcome, the referral status, the
sample-quality object (adequacy, day 5–8 window, avoidable repeat), and the
flagged issues.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric / date / time.
- `carrier` is valid for SCD only; a carrier on any other condition is invalid.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
