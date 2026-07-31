# Inpatient Clinical Note — SvelteKit front-end

Consolidated SvelteKit app: the twelve-step wizard, the graded report, and the
ward dashboard, all driven by one shared engine.

## Routes

- **Welcome** (`/inpatient-clinical-note/`) — what the form is for and links to
  the two working surfaces. `/` redirects here.
- **Wizard** (`/inpatient-clinical-notes/[id]`) — the twelve-section note.
  `new` starts a blank draft; any other id seeds from the matching sample.
  Drafts persist to localStorage per id.
- **Report** (`/inpatient-clinical-notes/[id]/report`) — both gradings side by
  side, per-component presence, the acuity rules that fired, and the safety
  flags. `report/pdf` is a server endpoint returning a `pdfmake` PDF.
- **Dashboard** (`/inpatient-clinical-notes`) — SVAR DataGrid of notes with
  completeness, acuity, NEWS2, and flag counts. `ssr = false` because the grid
  is client-only. Sorted by acuity descending.

## The two engines

The completeness engine grades the record against the components required
**for the note type**; the acuity engine bands the observations by max-band.
They are independent: a note can be Complete and Critical (a well-documented
deterioration) or Incomplete and Stable (a thin entry on a well patient).

- `src/lib/engine/types.ts` — data model, the twelve components, the
  note-type required-set map, `emptyAssessment()`.
- `src/lib/engine/news2.ts` — RCP 2017 parameter scoring and aggregate
  derivation. An entered total always wins over a derived one; both are kept.
- `src/lib/engine/note-rules.ts` — per-component `documented` predicates and
  the required set resolved per note type.
- `src/lib/engine/acuity.ts` — the max-band acuity rules.
- `src/lib/engine/flagged-issues.ts` — the twelve safety flags.
- `src/lib/engine/note-grader.ts` — `assess()`, the single entry point.
- `src/lib/engine/note-grader.test.ts` — Vitest suite covering the worked
  examples and boundaries in the domain spec.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
