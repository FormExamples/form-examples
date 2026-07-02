# Fluid Balance Chart — SvelteKit front-end (form + dashboard)

A consolidated SvelteKit front-end for the Fluid Balance Chart: a single
continuous single-page wizard plus a clinician dashboard, styled with the Lily
Design System (Svelte headless) and Tailwind CSS 4.

This is a MULTI-TABLE form. A parent chart header carries the charting context
and the patient weight; two one-to-many child lists carry the timed **intake**
rows and the timed **output** rows, each edited through its own add/remove
repeating-row editor. The shared pure engine reconciles the recorded volumes
into totals, a running and cumulative net balance, and the weight-indexed
urine-output rate (mL/kg/h), grades the fluid status (Balanced / Positive /
Negative / Oliguria), and independently raises safety flags.

## Routes

- `/` — welcome page (purpose, spec, docs, and links to the form and dashboard).
- `/fluid-balance-charts` — clinician dashboard (SVAR DataGrid; `ssr = false`),
  columns for totals, net balance, urine-output rate, and fluid status, with
  fluid-status and ward filters.
- `/fluid-balance-charts/[id]` — the charting wizard (id-keyed; hydrates a saved
  draft, a sample seed, or a blank chart).
- `/fluid-balance-charts/[id]/report` — the reconciliation report.
- `/fluid-balance-charts/[id]/report/pdf` — server-side `pdfmake` PDF endpoint.

## Wizard steps

1. Chart context — charting clinician, role, patient identifier, ward, start
   time, and charting period (hours).
2. Patient weight — enables the weight-indexed urine-output rate.
3. Intake entries — repeating rows (time, category, route, volume in mL).
4. Output entries — repeating rows (time, category, description, volume in mL).
5. Summary and note — live totals / net balance / fluid status plus a free-text
   clinical note.

## Engine

Pure functions in `src/lib/engine/`: `types.ts`, `utils.ts`,
`fluid-balance-rules.ts` (thresholds + classification), `fluid-balance-grader.ts`
(totals, net balance, running balance, mL/kg/h, status), and `flagged-issues.ts`
(fluid-overload, dehydration, oliguria, anuria, incomplete-recording). Covered
by `fluid-balance-grader.test.ts` (Vitest).

## Develop

```sh
pnpm install
pnpm run dev      # dev server
pnpm run check    # svelte-check (0 errors, 0 warnings)
pnpm run build    # production build
pnpm exec vitest run
```
