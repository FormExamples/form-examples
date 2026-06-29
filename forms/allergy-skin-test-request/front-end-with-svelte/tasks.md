# Tasks: Allergy Skin Test Request — consolidated front-end (SvelteKit)

## Done

- [x] Port the four-axis engine (appropriateness, validity/safety, completeness,
      triage) + safety flags to TypeScript under `src/lib/engine/`.
- [x] Id-keyed reactive store with in-place `deepAssign` and localStorage.
- [x] Seven step components for the single-page wizard.
- [x] RESTful routes: dashboard (SVAR), wizard, report, report/pdf.
- [x] Welcome page, themed layout, Lily token utilities only.
- [x] Vitest engine suite; `pnpm check` and `pnpm build` green.

## Pending

- [ ] Replace sample-data fallback with the Loco back-end JSON API.
