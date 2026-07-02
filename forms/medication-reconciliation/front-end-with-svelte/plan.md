# Plan — Medication Reconciliation SvelteKit front-end

## Status: built

Greenfield SvelteKit front-end mirroring the completed sibling
`quick-sequential-organ-failure-assessment/front-end-with-svelte`, adapted for a
multi-table documentation form (parent header + four repeating child lists +
a completeness/discrepancy status).

## Done

- [x] Scaffold from the template (configs, `app.css`, `app.html`, themes, UI
      component set, `Form.svelte` with `novalidate`).
- [x] Port the engine to TypeScript: `types.ts`, `utils.ts`,
      `medication-reconciliation-rules.ts`, `medication-reconciliation-grader.ts`,
      `flagged-issues.ts`.
- [x] Model the four child lists as arrays on the store data;
      `createDefaultReconciliation()` initialises them to `[]`.
- [x] Generic `ListEditor.svelte` repeating-row editor (add / remove) for
      sources, allergies, medication line items, and discrepancies.
- [x] Seven step components; live-status readout (`LiveStatus.svelte`).
- [x] RESTful routes under `/medication-reconciliations/` (dashboard `ssr=false`,
      `[id]` wizard, `[id]/report`, `[id]/report/pdf`), plus welcome + layout.
- [x] Sample reconciliations with populated medication arrays spanning complete /
      discrepancies-outstanding / incomplete, and engine-derived dashboard rows.
- [x] PDF builder (`pdfmake`).
- [x] Vitest engine tests (local `createDefaultReconciliation` fixture; no store
      import): each status class, discrepancy classification, high-risk branch,
      `< 2` sources branch, allergy-conflict branch, flag sorting.

## Verify

- `pnpm run check` — 0 errors, 0 warnings.
- `pnpm run build` — succeeds.
- `pnpm exec vitest run` — all engine tests pass.
