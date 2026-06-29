# Audio-Vestibular Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated front-end for the Audio-Vestibular Assessment: a single continuous,
step-by-step wizard plus a clinician dashboard, both powered by the same pure
scoring engine.

## Routes

- `/` — welcome page with links to the form and dashboard.
- `/audio-vestibular-assessments` — SVAR DataGrid clinician dashboard
  (`ssr = false`; client-only). Filter by WHO hearing grade and DHI handicap.
- `/audio-vestibular-assessments/[id]` — the nine-section wizard (use `new` for
  a fresh draft; sample ids `AV-2026-0001`…`AV-2026-0004` seed worked examples).
- `/audio-vestibular-assessments/[id]/report` — the graded report.
- `/audio-vestibular-assessments/[id]/report/pdf` — server endpoint emitting a
  pdfmake PDF.

## Scoring engine (`src/lib/engine/`)

- `types.ts` — the nine-section data model and grading result types.
- `rules.ts` — WHO PTA cutoffs, DHI item registry, DHI answer scoring.
- `audio-vestibular-grader.ts` — `grade()` pipeline (PTA + DHI).
- `flagged-issues.ts` — clinician-facing red-flag / referral detection.
- `utils.ts` — labels and Lily-token colour classes.
- `audio-vestibular-grader.test.ts` — Vitest coverage of the engine.

## Two instruments

1. **WHO pure-tone audiometry grade** from the better-ear four-frequency
   (0.5/1/2/4 kHz) air-conduction average.
2. **Dizziness Handicap Inventory (DHI)** — 25 items (F/E/P subscales),
   total 0-100, classified No handicap / Mild / Moderate / Severe.
