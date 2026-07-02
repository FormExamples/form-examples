# H&P — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the History and Physical Examination (H&P)
clerking document. A single continuous single-page wizard captures the full
history, vital signs, examination by body system, investigations, impression,
and management plan; the shared pure engine grades the record for documentation
completeness; and a SVAR DataGrid dashboard lists clerked patients with their
engine-computed completeness status and blocking-flag indicator.

This is a **documentation and completeness** form, not a numeric score. The
engine reports a completeness status — `complete`, `partial`, or `incomplete` —
with a completeness percentage, and raises safety flags. Two flags are
**blocking** (allergies not documented; no impression and no plan) and force an
`incomplete` status. There is no total, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/history-and-physical-examinations/[id]`) — the eight-section
  clerking; grades completeness on submit.
- **Report** (`/history-and-physical-examinations/[id]/report`) — completeness
  and blocking-flag banners, interpretation, required-component documentation
  table, and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/history-and-physical-examinations`) — SVAR DataGrid of clerked
  patients (client-only, `ssr = false`), filterable by completeness and care
  setting.

## Engine

The ten required components:

1. Presenting complaint
2. History of presenting complaint
3. Past medical and surgical history
4. Drug history and allergies
5. Social history
6. Systems review
7. Vital signs (at least one recorded)
8. Core examination (all four core systems examined or deferred)
9. Impression / problem list
10. Management plan

```
completenessPercent = round(100 * satisfiedComponents / 10)
blocking            = allergies undocumented || (no impression AND no plan)
coreNarrative       = presenting complaint + its history + core exam addressed
                      + (impression || plan)
status = blocking || !coreNarrative -> 'incomplete'
         all ten components satisfied -> 'complete'
         otherwise -> 'partial'
```

The safety flags are: allergies not documented (high, blocking), no impression
or plan (high, blocking), red-flag finding without a plan (high), abnormal vital
signs (medium), incomplete systems examination (medium), and incomplete history
(low). It is a documentation aid, not a diagnosis.

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/history-and-physical-rules.ts` — the ten required-component
  rules, vital-sign ranges, and the shared predicates.
- `src/lib/engine/history-and-physical-grader.ts` —
  `calculateHistoryAndPhysicalGrade()` completeness entry point.
- `src/lib/engine/flagged-issues.ts` — the six safety flags.
- `src/lib/engine/utils.ts` — label + Lily-token colour helpers.
- `src/lib/engine/history-and-physical-grader.test.ts` — Vitest unit tests.

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
