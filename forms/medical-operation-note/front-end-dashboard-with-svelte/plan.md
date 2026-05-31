# Plan: SvelteKit theatre-review dashboard

- [x] SvelteKit 2 + Svelte 5 + Tailwind 4 scaffold mirroring the canonical
  `pre-operative-assessment-by-clinician` dashboard.
- [x] SVAR DataGrid dependency wired in `package.json`; column definitions
  centralised in `src/lib/columns.ts`.
- [x] Sample-data fallback (`src/lib/sample-data.ts`) with 12 synthetic op
  notes spanning every composite-risk band, several Clavien–Dindo grades,
  every NCEPOD urgency, a never-event candidate, and signed/unsigned cases.
- [x] Risk / Clavien–Dindo / urgency / counts / never-event / signed badges
  as `src/lib/badges/*.svelte`.
- [x] SVAR-style dropdown filters: composite risk, Clavien–Dindo,
  urgency, never-event flagged, signed/unsigned.
- [x] Sortable columns with sort-direction indicators.
- [x] Row click expands a detail panel rendering all safety flags by
  priority colour.
- [ ] Live API integration against the Loco backend (deferred).
- [ ] CSV / TSV export (deferred).
- [ ] Per-surgeon and per-specialty audit views (deferred).
