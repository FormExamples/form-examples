# Plan: United States Last Will and Testament — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end for the United States Last Will and Testament, with the engine
ported from this form's HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `will-rules.ts`,
      `will-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Validity classification: precedence `formality-risk` > `incomplete` >
      `valid-ready-to-execute`; state rules from `STATE_RULES`.
- [x] `will-grader.test.ts`: pins every persona in `examples/personas.json`
      (class, figures, and the exact flags) plus targeted capacity, witness,
      bequest-arithmetic, elective-share and estate-tax tests.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-states-last-will-and-testament.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (6 steps), `config/themes.ts`.
- [x] `data/sample-reports.ts`: one sample per persona, with engine-derived rows.
- [x] Step components `Step1Testator` to `Step6SelfProving` (live validity status).
- [x] Routes: welcome, layout, dashboard (SVAR, `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts`: `pdfmake` document (validity report, not a score).
- [x] `pnpm run check`, `pnpm exec vitest run`, `pnpm run lint` and
      `pnpm run format:check` are green.

## Notes

- `DateInput` accepts a nullable value so it binds to the model's `string | null`
  date fields (null convention preserved).
