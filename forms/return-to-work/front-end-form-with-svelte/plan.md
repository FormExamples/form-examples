# Plan: SvelteKit clinician wizard

## Build order

1. [ ] `pnpm create svelte@latest` (skeleton, TypeScript, ESLint,
       Prettier, Vitest).
2. [ ] Install Tailwind 4 via `@tailwindcss/vite`.
3. [ ] Author `lib/engine/types.ts` with the `ReturnToWorkAssessment`
       shape and the supporting sub-types.
4. [ ] Author the pure scoring engine: `fitness-rules.ts`,
       `restriction-rules.ts`, `composite-grader.ts`,
       `flagged-issues.ts`.
5. [ ] Write Vitest tests for the engine.
6. [ ] Build the 12 step components.
7. [ ] Wire the dynamic step route `/assessment/[step=step]`.
8. [ ] Build the report preview page and PDF endpoint.
9. [ ] Wire the API client with sample-data fallback for standalone
       use.

## Future enhancements

- Zod runtime validation on every step submit.
- LocalStorage autosave with draft-recovery.
- Axe-core accessibility audit.
- Playwright end-to-end test of the full 12-step happy path.
- Bilingual (English / Cymraeg) UI.
- SNOMED CT search box on step 5 via NHS Digital terminology server.
