# Plan: front-end-form-with-svelte

SvelteKit 2.x + Svelte 5 + Tailwind 4 single-page wizard for the HIPAA
authorization.

## Build order

1. [x] Scaffold SvelteKit project (`pnpm create svelte`).
2. [x] Tailwind 4 configuration with `@import 'tailwindcss'`.
3. [x] Engine modules (`types.ts`, `validation-rules.ts`,
       `sensitive-category-rules.ts`, `flagged-issues.ts`,
       `validate-authorization.ts`).
4. [x] Reactive store (`authorization.svelte.ts`).
5. [x] Dynamic step route (`/authorization/[step=step]/+page.svelte`).
6. [x] 9 step components in `src/lib/components/steps/`.
7. [x] UI components (StepNavigation, ProgressBar, ValidityBanner).
8. [x] PDF generation server endpoint (`/report/pdf`).
9. [ ] Zod runtime validation of incoming payloads.
10. [ ] Axe-core accessibility audit.
11. [ ] Playwright end-to-end tests.
12. [ ] Spanish-language overlay.
