# Plan: Lifeguard Certification Checklist — examiner form (SvelteKit)

## Current status

Consolidated gold `front-end-with-svelte/`: single-page ten-section wizard,
pure competency-grading engine with Vitest tests, id-keyed reactive store with
localStorage persistence, SVAR DataGrid dashboard, report view, and PDF export.

## Structure

- `src/lib/engine/` — `types.ts`, `rules.ts`, `lifeguard-grader.ts`,
  `flagged-issues.ts`, `utils.ts`, `lifeguard-grader.test.ts`
- `src/lib/stores/assessment.svelte.ts` — id-keyed store (`assessment`)
- `src/lib/components/steps/` — `Step1..Step10` section components
- `src/lib/components/ui/` — Lily Svelte headless components + `TriStateField`
- `src/lib/data/sample-reports.ts` — sample records + engine-derived rows
- `src/routes/lifeguard-certification-checklists/` — dashboard, wizard, report, PDF
