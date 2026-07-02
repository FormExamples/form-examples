# SOAP Note — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the SOAP Note. A single continuous
single-page wizard captures one patient encounter across the four SOAP sections
(Subjective, Objective, Assessment, Plan) plus encounter context, patient
identification, and a free-text summary; the shared pure engine grades the note
for documentation completeness and raises safety flags; and a SVAR DataGrid
dashboard lists documented encounters with their engine-computed completeness
status and safety-flag counts.

This is a **documentation and completeness** form, not a numeric score. The
engine reports a completeness status — `complete`, `partial`, or `incomplete` —
with a completeness percentage, and — independently — raises safety flags. There
is no total, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/soap-notes/[id]`) — the seven-section SOAP note; grades
  completeness on submit.
- **Report** (`/soap-notes/[id]/report`) — completeness banner, interpretation,
  SOAP section-presence table, and safety flags; PDF via `report/pdf`.
- **Dashboard** (`/soap-notes`) — SVAR DataGrid of documented encounters
  (client-only, `ssr = false`), filterable by completeness and care setting.

## Engine

The four SOAP sections:

- **S** — Subjective (presenting complaint + its history are required)
- **O** — Objective (examination, vitals, or investigations — any one)
- **A** — Assessment (diagnosis, problem, or differential — any one)
- **P** — Plan (investigation, treatment, referral, or follow-up — any one)

```
completenessPercent = round(100 * presentRequiredComponents / totalRequiredComponents)
status =
  (!assessmentPresent || !planPresent)                 -> 'incomplete'
  (completenessPercent == 100 && no high-priority flag) -> 'complete'
  (assessmentPresent && planPresent)                   -> 'partial'
  otherwise                                            -> 'incomplete'
```

Conditionally-required components: safety-netting (when red-flag symptoms are
recorded or the patient is managed at home) and follow-up (whenever a plan is
recorded). Presence means a non-empty field — no semantic analysis. It is a
documentation aid, not a diagnosis, a risk score, or a substitute for clinical
judgement.

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/soap-note-rules.ts` — section presence + required-component tally.
- `src/lib/engine/soap-note-grader.ts` — `calculateSoapGrade()` completeness entry point.
- `src/lib/engine/flagged-issues.ts` — the six safety flags.
- `src/lib/engine/utils.ts` — label + Lily-token colour helpers.
- `src/lib/engine/soap-note-grader.test.ts` — Vitest unit tests.

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
