# Plan: United Kingdom Vehicle Bill of Sale — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end mirroring the sibling `medical-certificate-of-cause-of-death`
structure. The engine is ported from this form's HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `bill-of-sale-rules.ts`,
      `bill-of-sale-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Classification: precedence `risk-flagged` > `incomplete` > `complete`.
- [x] Flagged issues: no VIN, no mileage, finance outstanding, V5C missing,
      V5C mismatch, seller not keeper, description mismatch, payment risk,
      finance unchecked, MOT issue, trader sale, unsigned, V5C/2 slip, DVLA
      notification, faults not recorded.
- [x] `bill-of-sale-grader.test.ts` — local `blank` fixture (no store import).
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-kingdom-vehicle-bill-of-sale.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (9 steps), `config/themes.ts` (per-form storage key).
- [x] `data/sample-reports.ts` — 6 samples from the personas, with engine-derived
      dashboard rows.
- [x] Step components `Step1Sale` to `Step9Signatures`.
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- [x] `pnpm check` / `vitest run` / lint / format:check green.

## Notes

- Documentation support, not legal advice.
- `DateInput` accepts a nullable value so it binds to the model's
  `string | null` date fields (null convention preserved).
