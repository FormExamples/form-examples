# CHA2DS2-VASc SvelteKit front-end — plan

## Status: complete

Greenfield build mirroring the gold-standard qSOFA SvelteKit front-end.

## Done

- [x] Scaffolding, config, themes, and Lily Svelte headless UI component set.
- [x] Pure scoring engine ported from `front-end-with-html/js/`:
  - `types.ts` — data model + grading types.
  - `utils.ts` — display + Lily-token colour helpers.
  - `cha2ds2vasc-rules.ts` — eight declarative weighted criterion rules.
  - `cha2ds2vasc-grader.ts` — additive 0–9 grader, risk band, stroke-rate
    lookup, anticoagulation recommendation.
  - `flagged-issues.ts` — red-flag detection.
  - `cha2ds2vasc-grader.test.ts` — Vitest coverage of age boundaries
    (64/65/74/75), mutually-exclusive bands, female-total-1 low, male-total-1
    intermediate, max 9, stroke-rate lookup, and flag detection.
- [x] id-keyed reactive store with localStorage persistence + `deepAssign`.
- [x] Six wizard step components (Context, Identification, CardiacHistory,
  MetabolicHistory, AgeCriterion, Summary) with live per-criterion readouts.
- [x] RESTful routes under `/cha2ds2-vasc-assessments/`: dashboard (SVAR grid,
  `ssr = false`), wizard `[id]`, report, and PDF endpoint.
- [x] Four sample assessments spanning low / intermediate / high plus the
  female-sex-threshold edge case; dashboard rows derived by the shared engine.
- [x] `pdfmake` report builder.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
