# Plan: Medical Certificate of Cause of Death — SvelteKit front-end (form + dashboard)

## Status: complete

Greenfield SvelteKit front-end mirroring the completed sibling
`mental-health-act-assessment/front-end-with-svelte/` (a statutory,
validity-classification form). The engine is ported from this form's HTML
front-end (`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `mccd-rules.ts`,
      `mccd-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Validity classification: precedence `refer-to-coroner` > `incomplete`
      (missing I(a) / unacceptable sole "mode of death") > `valid`; underlying
      cause = lowest completed Part I line.
- [x] Flagged issues: coroner-referral-required, unacceptable-sole-cause,
      missing-Part-I(a), illogical-sequence, medical-examiner-scrutiny,
      missing-interval, incomplete-certifier.
- [x] `mccd-grader.test.ts` — local `createDefaultCertificate` fixture (no store
      import); covers each validity class, coroner-referral precedence,
      unacceptable-sole-cause, underlying-cause derivation, and every flag.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `medical-certificate-of-cause-of-death.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (6 steps), `config/themes.ts` (per-form storage key).
- [x] `data/sample-reports.ts` — 4 samples spanning valid / incomplete /
      refer-to-coroner, with engine-derived dashboard rows.
- [x] Step components: `Step1Certification`, `Step2Deceased`, `Step3Death`,
      `Step4PartI`, `Step5PartII`, `Step6Referral` (live validity status).
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts` — `pdfmake` document (validity report, not score).
- [x] `pnpm check` / `pnpm build` / `vitest run` all green.

## Notes

- Generic Lily `Badge`; no cardiovascular entry components.
- `DateInput` accepts a `type` override and a nullable value so it binds to the
  model's `string | null` date / time fields (null convention preserved).
