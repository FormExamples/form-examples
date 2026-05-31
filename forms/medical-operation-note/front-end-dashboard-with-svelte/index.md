# Dashboard — SvelteKit + SVAR DataGrid

SvelteKit + Svelte 5 + Tailwind 4 dashboard for reviewing submitted
medical-operation-note records. Theatre coordinators and clinical
governance leads use it to triage cases by composite operative risk,
Clavien–Dindo grade, never-event candidacy, and sign-off status.

## Stack

- SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS 4.
- SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme — column
  definitions in [`src/lib/columns.ts`](src/lib/columns.ts).
- Sample-data fallback in [`src/lib/sample-data.ts`](src/lib/sample-data.ts)
  so the dashboard runs standalone without the Rust backend.
- Risk / Clavien–Dindo / urgency / sign-off / counts / never-event badges
  in [`src/lib/badges/`](src/lib/badges/).

## Columns

Hospital, theatre, list type, lead surgeon, anonymised patient label,
primary procedure (OPCS-4 + name), urgency (NCEPOD), composite risk,
Clavien–Dindo grade, estimated blood loss (mL), counts agreed,
never-event flagged, recovery destination, sign-off timestamp.

## Filters

SVAR dropdowns: composite risk, Clavien–Dindo, urgency, never-event
flagged, signed / unsigned.

## Running

```sh
pnpm install
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Conventions

- Synthetic patient identifiers only (e.g. `Pt-007`). No real NHS numbers.
- camelCase TypeScript property names throughout.
- Risk badges colour-coded by band:
  routine = emerald, complicated = amber, high-risk = orange, critical = red.
