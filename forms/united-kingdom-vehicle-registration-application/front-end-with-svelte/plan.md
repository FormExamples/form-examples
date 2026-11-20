# Plan: United Kingdom Vehicle Registration Application — SvelteKit front-end (form + dashboard)

## Status: complete

Greenfield SvelteKit front-end mirroring the sibling
`medical-certificate-of-cause-of-death/front-end-with-svelte/` (a validity
classification form). The engine is ported from this form's HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `vra-rules.ts`,
      `vra-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Validity classification: precedence `incomplete` >
      `needs-supporting-documents` > `ready-to-submit`; fee due per application
      type.
- [x] Flagged issues: the thirteen categories in `../spec/index.md` §5.
- [x] `vra-grader.test.ts` — local blank-application fixture (no store import);
      covers fee rules, format checks, each validity class, MOT age thresholds,
      NOVA, and a replay of every persona.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-kingdom-vehicle-registration-application.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (7 steps), `config/themes.ts` (per-form storage key).
- [x] `data/sample-reports.ts` — 6 samples built from personas, with
      engine-derived dashboard rows.
- [x] Step components `Step1Application` to `Step7FeeAndDeclaration`.
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts` — `pdfmake` document.
- [x] `pnpm check`, `pnpm build`, `vitest run`, `pnpm lint`, and
      `pnpm format:check` all green.
