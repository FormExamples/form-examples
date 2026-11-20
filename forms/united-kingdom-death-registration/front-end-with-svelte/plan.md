# Plan: United Kingdom death registration — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end whose engine is ported from this form's HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `registration-rules.ts`,
      `registration-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Classification: precedence `referred-to-coroner-pending` > `incomplete` (any
      blocking rule) > `registered` > `ready-to-register`; 5-day deadline status.
- [x] 18 flagged issues: deadline, jurisdiction, coroner, MCCD, medical examiner,
      informant, appointment, documents, green form, Tell Us Once, copies.
- [x] `registration-grader.test.ts` — local `createDefaultRegistration` fixture (no store
      import); covers each class, coroner precedence,
      the qualified-informant list, the 5-day boundaries, and replays the personas.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-kingdom-death-registration.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (6 steps), `config/themes.ts` (per-form storage key).
- [x] `data/sample-reports.ts` — 7 samples taken from the personas spanning all four classes, with engine-derived dashboard rows.
- [x] Step components: `Step1Deceased`, `Step2Medical`, `Step3Coroner`,
      `Step4Informant`, `Step5Registration`, `Step6Aftercare`.
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts` — `pdfmake` document (readiness report, not score).
- [x] `pnpm check` / `pnpm build` / `vitest run` all green.

## Notes

- Generic Lily `Badge`; no cardiovascular entry components.
- `DateInput` accepts a `type` override and a nullable value so it binds to the
  model's `string | null` date / time fields (null convention preserved).
