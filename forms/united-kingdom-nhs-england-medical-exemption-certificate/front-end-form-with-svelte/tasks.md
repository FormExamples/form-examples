# Tasks: SvelteKit form — UK NHS England Medical Exemption Certificate (FP92A)

- [x] Scaffold SvelteKit + Svelte 5 + Tailwind 4 + Vite 7 project.
- [x] Declare `Fp92aApplication` data model in `engine/types.ts`.
- [x] Implement declarative rules in `engine/fp92a-rules.ts`.
- [x] Implement `evaluateFp92a()` in `engine/fp92a-validator.ts`.
- [x] Implement advisory flags in `engine/flagged-issues.ts`.
- [x] Implement reusable UI primitives in `components/ui/`.
- [x] Implement Step1..Step10 components.
- [x] Wire the single-page wizard in `routes/+page.svelte`.
- [x] Vitest coverage for the grading engine.
- [ ] pdfmake PDF preview of the completed FP92A.
- [ ] JSON / XML / CSV / TSV import & export.
- [ ] Wire the FHIR R5 Bundle export.
- [ ] Accessibility audit.
