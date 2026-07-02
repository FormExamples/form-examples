# COPD Review — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Chronic Obstructive Pulmonary Disease
Review (COPD annual review). A single continuous single-page wizard captures the
annual-review data; the shared pure engine derives the four classification
outputs plus the review-completeness grade; and a SVAR DataGrid dashboard lists
reviewed patients with their engine-computed GOLD grade, ABE group, and
completeness.

This is a **severity-classification and completeness** form, not a numeric
score. The engine derives a **GOLD airflow-limitation grade (1–4)**, a symptom
axis, an exacerbation axis, a combined **ABE assessment group** (A / B / E), and
a **review-completeness grade** (complete / partial / incomplete). There is no
total, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/chronic-obstructive-pulmonary-disease-reviews/[id]`) — the
  eleven-section review; classifies on submit.
- **Report** (`/chronic-obstructive-pulmonary-disease-reviews/[id]/report`) —
  GOLD + ABE banners, symptom / exacerbation / completeness tiles,
  interpretation, and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/chronic-obstructive-pulmonary-disease-reviews`) — SVAR
  DataGrid of reviewed patients (client-only, `ssr = false`), filterable by GOLD
  grade and ABE group.

## Engine

Four independent derivations plus the review-completeness grade:

```
goldGrade        = FEV₁ % predicted banded ≥80→1, ≥50→2, ≥30→3, <30→4; null when unrecorded
symptomBurden    = (mMRC ≥ 2) or (CAT ≥ 10)             ? 'high' : 'low'
exacerbationRisk = (≥ 2 moderate) or (≥ 1 hospitalised) ? 'high' : 'low'
abeGroup         = no axis data ? null : exac high ? 'E' : symptom high ? 'B' : 'A'
reviewStatus     = any core missing ? 'incomplete'
                   : any supporting missing ? 'partial' : 'complete'
```

A missing numeric input contributes nothing to its axis (treated as absent, not
a normal value) and lowers the completeness grade. Six flags are raised
independently (escalate therapy, smoking cessation, poor inhaler technique,
missing vaccinations, pulmonary-rehab candidate, incomplete review), each with a
priority. It is a documentation and severity-classification aid, not a diagnosis.

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/copd-review-rules.ts` — threshold helpers, classification
  rules, and the completeness-component tables.
- `src/lib/engine/copd-review-grader.ts` — `gradeCopdReview()` entry point.
- `src/lib/engine/flagged-issues.ts` — the six clinical flags.
- `src/lib/engine/utils.ts` — label + Lily-token colour helpers.
- `src/lib/engine/copd-review-grader.test.ts` — Vitest unit tests.

## Stack

SvelteKit 2 + Svelte 5 runes, Tailwind CSS 4, Lily Design System (Svelte
headless) component contract, SVAR DataGrid (dashboard), pdfmake (report),
Vitest (engine tests).

## Commands

```sh
pnpm install
pnpm run check     # svelte-check (0 errors, 0 warnings)
pnpm run build     # production build
pnpm exec vitest run
```
