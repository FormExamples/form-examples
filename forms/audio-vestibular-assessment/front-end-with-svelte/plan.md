# Plan: Audio-Vestibular Assessment — front-end (SvelteKit)

## Current status

Complete. Consolidated gold-standard SvelteKit front-end built from the HTML
source of truth.

- Pure scoring engine in `src/lib/engine/` (WHO PTA grade + DHI) with Vitest.
- Nine step components in `src/lib/components/steps/`.
- Id-keyed reactive store (`src/lib/stores/assessment.svelte.ts`) with
  in-place `deepAssign` merge and localStorage persistence.
- RESTful routes: `/audio-vestibular-assessments` (SVAR dashboard, `ssr = false`)
  and `/audio-vestibular-assessments/[id]` (wizard) + `[id]/report` + report PDF.
- 45 Lily themes + `ThemeSelect`; welcome page; themed layout.
- Lily token utilities only (no hardcoded palette).

## Verification

- `pnpm run check` — 0 errors, 0 warnings.
- `pnpm run build` — succeeds.
- `pnpm exec vitest run` — all engine tests pass.
