# Partogram — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Partogram (Partograph): a
single-page wizard that records the progress of labour, and a clinician
dashboard that lists partograms with their engine-computed labour-progress
classification.

This is a MULTI-TABLE labour-monitoring form: a parent labour-record header
(context, patient identification, admission findings) plus a one-to-many child
list of timed intrapartum observation rows. The shared engine plots the latest
cervical dilatation against two reference lines — the alert line (`4 + t` cm)
and the action line (`t` cm) — classifies labour progress (Normal / Alert-line
crossed / Action-line crossed), and — independently — raises threshold flags
across the whole observation series. It is NOT a validated numeric score.

## Routes

- `/` — welcome page (purpose, spec, docs, links to the form and dashboard).
- `/partograms` — clinician dashboard (SVAR DataGrid, `ssr = false`).
- `/partograms/new` and `/partograms/[id]` — the record wizard.
- `/partograms/[id]/report` — the report view (and `report/pdf` endpoint).

## Wizard steps

1. **Labour context** — recording clinician, role, care setting, and the
   active-phase start time (the reference point for the reference lines).
2. **Patient identification** — identifier, age band, parity, gestation.
3. **Admission findings** — membranes, risk factors, planned care.
4. **Observation series** — an add/remove repeating-row editor: one row per
   timed set of observations (dilatation, descent, contractions, fetal heart
   rate, liquor, moulding, maternal vitals, urine dipstick, oxytocin, drugs and
   fluids), with a live labour-progress read-out.
5. **Summary and progress** — the live classification, reference-line
   expectations, and flagged issues; submit to generate the full report.

## Engine

Pure functions in `src/lib/engine/`:

- `types.ts` — the `AssessmentData` model and grading types.
- `partogram-rules.ts` — reference-line geometry (`alertLineExpectedCm`,
  `actionLineExpectedCm`, `classifyProgress`) and the threshold constants.
- `partogram-grader.ts` — `calculateGrade(data)`: finds the latest dilatation
  observation, computes elapsed hours and the reference lines, classifies
  progress, and attaches the flagged issues.
- `flagged-issues.ts` — `detectFlaggedIssues(data, grade)`: the threshold flags
  scanned across the whole observation series.
- `utils.ts` — label and Lily-token colour helpers.
- `partogram-grader.test.ts` — Vitest coverage of the line boundaries, the
  threshold flags, and the no-observation case.

## Verify

```sh
pnpm install
pnpm run check     # 0 errors, 0 warnings
pnpm run build
pnpm exec vitest run
```
