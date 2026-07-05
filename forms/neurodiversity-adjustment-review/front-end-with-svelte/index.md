# Neurodiversity Adjustment Review — front-end with Svelte

SvelteKit single continuous single-page wizard for the UK workplace
reasonable-adjustments review for neurodiversity (ACAS / Equality Act 2010; not
clinical), presenting the four-axis interpretation grade.

A manager / HR contact completes six review sections with the worker — review
identification, worker identification, per-category effectiveness of the
adjustments in place, worker experience, changes & next steps, and sign-off. The
shared engine then computes a four-axis grade (overall effectiveness, wellbeing
risk, review completeness, and next-step urgency) plus review flags including an
automatic adjustments-not-working alert, and produces a structured review record
with an HTML report preview and a downloadable PDF.

## Routes

- `/` — welcome page.
- `/neurodiversity-adjustment-reviews` — reviews dashboard (SVAR DataGrid + review
  overview cards).
- `/neurodiversity-adjustment-reviews/new` — new review wizard.
- `/neurodiversity-adjustment-reviews/[id]` — edit a review.
- `/neurodiversity-adjustment-reviews/[id]/report` — graded report preview.
- `/neurodiversity-adjustment-reviews/[id]/report/pdf` — server-rendered PDF.

## Engine

The four-axis engine lives in `src/lib/engine/`
(`effectiveness-rules.ts`, `wellbeing-rules.ts`, `completeness-rules.ts`,
`next-step-rules.ts`, `flags.ts`, `grader.ts`, `types.ts`, `utils.ts`). Rule and
flag IDs are identical across every front-end and the back-end.

## Verify

```sh
pnpm install
pnpm run check
pnpm test
```
