# Structured Medication Review — SvelteKit front-end

SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS 4 implementation of the structured
medication review wizard and clinician dashboard, sharing one pure review
engine. A documentation form with **partial scoring**: the engine derives a
review **status** (Complete / Incomplete), a polypharmacy band, an
anticholinergic-burden sum and band, a composite burden band, per-medicine
STOPP/START flags, and a set of flagged issues — not a single numeric score.

## Multi-table model

The form is a parent review header plus a repeating one-to-many **medicine**
list. Each medicine carries its indication, adherence, anticholinergic burden
points (0-3), high-risk class, monitoring, deprescribing flag, and any
STOPP/START criterion. The medicine list is edited through the generic
`ListEditor` component and stored as `data.medicines[]` on the reactive store.

## Layout

- `src/lib/engine/` — pure engine: `types.ts`, `utils.ts`,
  `structured-medication-review-rules.ts`,
  `structured-medication-review-grader.ts`, `flagged-issues.ts`, and
  `structured-medication-review-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence (`structured-medication-review.front-end-with-svelte.<id>.v1`),
  in-place `deepAssign` deep-merge, `createDefaultReview()`.
- `src/lib/components/ui/ListEditor.svelte` — generic repeating one-to-many row
  editor driving the medicine list.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (Context, Identification, Problems, Medicines, Monitoring, Goals, Plan,
  Summary).
- `src/lib/config/` — `steps.ts` (8 steps), `themes.ts`.
- `src/lib/data/sample-reports.ts` — four sample reviews + engine-derived
  dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/structured-medication-reviews/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

`gradeReview(data)` returns `medicineCount`, `regularMedicineCount`,
`anticholinergicBurdenScore`, `polypharmacyBand`, `anticholinergicBand`,
`burdenBand`, `reviewStatus`, `stopFlags[]`, `startFlags[]`, `firedRules[]`,
`flaggedIssues[]`, and a `timestamp`. Boundaries (spec §4): polypharmacy 5 / 10
regular; anticholinergic significant at 3; composite burden is the worse of the
two bands. `reviewStatus` is Complete only when every required section is filled
and the review is marked finished.

## Verify

```sh
pnpm install
pnpm run check   # 0 errors / 0 warnings
pnpm run build
pnpm exec vitest run
```
