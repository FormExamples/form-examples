# Plan: United Kingdom Marriage Certificate Application — SvelteKit front-end (form + dashboard)

## Status: complete

Greenfield SvelteKit front-end mirroring the completed sibling
`mental-health-act-assessment/front-end-with-svelte/` (a validity-classification form). The engine is ported from this form's HTML
front-end (`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `marriage-rules.ts`,
      `marriage-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Classification: precedence `ineligible` > `incomplete` > `needs-evidence` >
      `ready-to-submit`; ceremony window = notice + 29 days to notice + 12 months.
- [x] Flagged issues: the eighteen flags in `../spec/index.md` §5.
- [x] `marriage-grader.test.ts` — local blank-party fixture (no store import);
      covers each class, the precedence, the 29-day / 12-month / age-18
      boundaries, joint notice and the EU Settlement Scheme exception, and parity
      with every persona in `../examples/personas.json`.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-kingdom-marriage-certificate-application.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (6 steps), `config/themes.ts` (per-form storage key).
- [x] `data/sample-reports.ts` — 5 samples spanning ready-to-submit / incomplete /
      needs-evidence / ineligible, with engine-derived dashboard rows.
- [x] Step components: `Step1Notice`, `Step2Ceremony`, `Step3PartyOne`,
      `Step4PartyTwo`, `Step5Relationship`, `Step6Certificate`.
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts` — `pdfmake` document (validity report, not score).
- [x] `pnpm check` / `pnpm build` / `vitest run` all green.

## Notes

- Generic Lily `Badge`; no cardiovascular entry components.
- `DateInput` accepts a `type` override and a nullable value so it binds to the
  model's `string | null` date / time fields (null convention preserved).
