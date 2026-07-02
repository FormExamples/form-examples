# Plan: General Practitioner Referral Letter — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`child-safeguarding-referral` front-end and porting the completeness /
urgency-classification engine from `front-end-with-html/js/`.

- [x] Pure engine ported from the HTML front-end (`src/lib/engine/`):
      urgency-dependent mandatory-field completeness (ten always-mandatory
      fields plus urgency-conditional fields), `Complete` / `Incomplete` status,
      completeness percentage, echoed urgency (routine / urgent / two-week-wait /
      emergency), and six flags
- [x] Vitest tests covering the blank / partial / complete boundary,
      the two-week-wait and urgent mandatory-field expansion, urgency echo for an
      incomplete referral, and every flag; a local `createDefaultAssessment`
      fixture (no store import)
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Nine wizard step components (conditional urgency section) + step list and
      progress
- [x] Welcome page, wizard, report, and PDF endpoint routes under
      `/general-practitioner-referral-letters`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows, urgency and
      status filters
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
