# Hypertension Annual Review — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Hypertension Annual Review (NICE
NG136). A single continuous single-page wizard captures the review across twelve
sections; the shared pure engine classifies blood-pressure control against an
age- and comorbidity-specific target, assigns a hypertension stage, and grades
review completeness; and a SVAR DataGrid dashboard lists reviewed patients with
their engine-computed control class, stage, and completeness.

This is a **documentation and control-classification** form, not a numeric
score. The engine reports:

- **Control** — `controlled` / `uncontrolled` / `severe-uncontrolled` against
  the tightest applicable BP target (or "not classified" with no reading).
- **Stage** — `none` / `stage-1` / `stage-2` / `stage-3-severe` from the raw
  readings.
- **Review completeness** — `complete` / `partial` / `incomplete` (blood
  pressure is the gate).

There is no total, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/hypertension-reviews/[id]`) — the twelve-section review;
  classifies control and grades completeness on submit.
- **Report** (`/hypertension-reviews/[id]/report`) — control, completeness, and
  stage banners, blood-pressure target, interpretation, the review-completeness
  table, and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/hypertension-reviews`) — SVAR DataGrid of reviewed patients
  (client-only, `ssr = false`), filterable by control and completeness.

## Engine

```
target       = tightest of {140/90; 150/90 age >=80; 140/90 T2DM;
                            130/80 CKD+T2DM or CKD+ACR>=70}
               home target = clinic target minus 5/5 mmHg
control      = severe-uncontrolled  (clinic 180/120 or above)
             | uncontrolled         (primary reading above target)
             | controlled           (primary reading at/below target)
               primary reading = home if present, else clinic
stage        = stage-3-severe | stage-2 | stage-1 | none  (from raw readings)
reviewStatus = incomplete (no BP) | complete (all components) | partial
```

Flags are raised independently of the control class: severe hypertension
(high), uncontrolled BP (high), missing annual bloods (medium), missing urine
ACR (medium), high CV risk untreated (medium), adherence concern (medium),
postural drop (medium), and incomplete review (low).

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/utils.ts` — presence predicate, label + Lily-token colour helpers.
- `src/lib/engine/hypertension-review-rules.ts` — tightest-target selection,
  control classification, staging, and the review-completeness components.
- `src/lib/engine/hypertension-review-grader.ts` — `review()` control +
  completeness entry point.
- `src/lib/engine/flagged-issues.ts` — the eight flags.
- `src/lib/engine/hypertension-review-grader.test.ts` — Vitest unit tests.

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
