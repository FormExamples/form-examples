# Plan: Child Safeguarding Referral — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`recommended-summary-plan-for-emergency-care-and-treatment` front-end and
porting the completeness / risk-classification engine from
`front-end-with-html/js/`.

- [x] Pure engine ported from the HTML front-end (`src/lib/engine/`): six
      mandatory rules, conditional unsafe-to-inform slot, completeness
      field-slots, urgency classification (emergency / urgent / standard), and
      eight safeguarding flags
- [x] Vitest tests covering each mandatory rule (pass and fail), each urgency
      branch, the conditional completeness slot, and every flag; a local
      `createDefaultAssessment` fixture (no store import)
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Nine wizard step components (conditional consent section) + live
      completeness status and urgency on the summary step
- [x] Welcome page, wizard, report, and PDF endpoint routes under
      `/child-safeguarding-referrals`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows, urgency and
      status filters
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
