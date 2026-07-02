# Ward Round Note — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Ward Round Note. A single continuous
single-page wizard captures one daily inpatient review across ten review
components (review header, overnight events, current problems and progress,
examination and NEWS2, investigations reviewed, VTE assessment, medication
changes, plan and jobs, escalation / ceiling-of-care status, and estimated
discharge) plus patient identification and a free-text summary; the shared pure
engine grades the entry for documentation completeness and raises safety flags;
and a SVAR DataGrid dashboard lists documented reviews with their engine-computed
completeness status and safety-flag counts.

This is a **documentation and completeness** form, not a numeric score. The
engine reports a completeness status — `complete`, `partial`, or `incomplete` —
with a completeness percentage over the eight required components, and —
independently — raises safety flags. There is no total, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/ward-round-notes/[id]`) — the eleven-section ward round note;
  grades completeness on submit.
- **Report** (`/ward-round-notes/[id]/report`) — completeness banner,
  interpretation, review-component presence table, and safety flags; PDF via
  `report/pdf`.
- **Dashboard** (`/ward-round-notes`) — SVAR DataGrid of documented reviews
  (client-only, `ssr = false`), filterable by completeness and ward.

## Engine

Eight required review components (`header`, `problems`, `examination`,
`investigations`, `vte`, `medication`, `plan`, `escalation`) and two recommended
(`overnight-events`, `estimated-discharge`). A component is "documented" when its
required field(s) hold a meaningful entry OR an explicit negative flag is set
(e.g. "no changes", "none outstanding") — a deliberate negative is a valid
clinical record.

```
completenessPercent = round(100 * documentedRequired / 8)
status =
  (documentedRequired == 8)                       -> 'complete'
  (header && plan && documentedRequired >= 4)     -> 'partial'
  otherwise                                       -> 'incomplete'
```

Presence means a non-empty field (or an explicit negative) — no semantic
analysis. It is a documentation aid, not a diagnosis, a risk score, or a
substitute for clinical judgement.

## Safety flags

Computed independently of the status: deteriorating NEWS2 needing escalation
(high), VTE assessment not done (high), no plan or jobs documented (high),
abnormal results not actioned (medium), no senior review when required (medium),
and incomplete entry (low).

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/ward-round-rules.ts` — component presence + required/recommended tally.
- `src/lib/engine/ward-round-grader.ts` — `calculateWardRoundGrade()` completeness entry point.
- `src/lib/engine/flagged-issues.ts` — the six safety flags.
- `src/lib/engine/utils.ts` — label + Lily-token colour helpers.
- `src/lib/engine/ward-round-grader.test.ts` — Vitest unit tests.

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
