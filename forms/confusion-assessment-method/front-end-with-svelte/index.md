# CAM — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Confusion Assessment Method (CAM)
bedside delirium screen. A single continuous single-page wizard captures the
four CAM features; the shared pure engine applies the validated boolean
diagnostic algorithm and produces a classification report; and a SVAR
DataGrid dashboard lists assessed patients with their engine-computed
classification.

This is a **status / classification** form. The engine emits a delirium
classification — `present`, `absent`, or `unable-to-assess` — plus the set of
positive features. There is no numeric score, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/confusion-assessment-methods/[id]`) — the eight-step CAM
  screen; classifies on submit.
- **Report** (`/confusion-assessment-methods/[id]/report`) — classification
  banner, interpretation, feature table, and flagged issues; PDF via
  `report/pdf`.
- **Dashboard** (`/confusion-assessment-methods`) — SVAR DataGrid of assessed
  patients (client-only, `ssr = false`), filterable by CAM variant and
  classification.

## Algorithm

```
deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
classification  = deliriumPresent ? 'present' : 'absent'
```

- feature 1 — acute onset and fluctuating course
- feature 2 — inattention
- feature 3 — disorganised thinking
- feature 4 — altered level of consciousness

For the CAM-ICU variant, an unrousable patient (RASS -4/-5) yields
`unable-to-assess` and the algorithm is not evaluated.

## Stack

SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS 4, SVAR Svelte DataGrid,
pdfmake, Vitest, and the Lily Design System (Svelte headless) component
contract. See [`AGENTS.md`](AGENTS.md) for the directory layout and conventions.

## Commands

```sh
pnpm install
pnpm run check      # svelte-check (0 errors, 0 warnings)
pnpm run build      # production build
pnpm exec vitest run # engine unit tests
```
