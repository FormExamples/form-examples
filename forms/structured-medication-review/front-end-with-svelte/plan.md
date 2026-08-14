# Plan — Structured Medication Review SvelteKit front-end

## Status: built

Greenfield SvelteKit front-end mirroring the completed sibling
`medication-reconciliation/front-end-with-svelte`, adapted for this multi-table
documentation form (parent review header + one repeating **medicine** list +
a review completeness/status grade — not a numeric score).

## Done

- [x] Scaffold from the template (configs, `app.css`, `app.html`, themes, generic
      UI component set including `Badge` and `ListEditor`, `Form.svelte` with
      `novalidate`).
- [x] Port the engine to TypeScript: `types.ts`, `utils.ts`,
      `structured-medication-review-rules.ts`,
      `structured-medication-review-grader.ts`, `flagged-issues.ts`.
- [x] Model the medicine list as `data.medicines[]` on the store;
      `createDefaultReview()` initializes it to `[]`.
- [x] Generic `ListEditor.svelte` repeating-row editor (add / remove) for the
      15-field medicine row (indication, adherence, ACB points, high-risk class,
      monitoring, deprescribing, STOPP/START).
- [x] Eight step components; live burden + status readout (`LiveStatus.svelte`).
- [x] RESTful routes under `/structured-medication-reviews/` (dashboard
      `ssr=false`, `[id]` wizard, `[id]/report`, `[id]/report/pdf`), plus welcome
      + layout.
- [x] Four sample reviews with populated medicine arrays spanning low / moderate /
      high burden and complete / incomplete status, plus engine-derived dashboard
      rows.
- [x] PDF builder (`pdfmake`).
- [x] Vitest engine tests (local `createDefaultReview` fixture; no store import):
      polypharmacy boundaries (4/5, 9/10), ACB boundary (2/3), composite burden,
      review-status completeness, and every flagged issue.

## Verify

- `pnpm run check` — 0 errors, 0 warnings.
- `pnpm run build` — succeeds.
- `pnpm exec vitest run` — all engine tests pass.
