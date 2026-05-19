# Plan: UK NHS England Medical Exemption Certificate (FP92A) — patient form (SvelteKit)

## Current status

Initial implementation complete:

- 10-step single-page wizard backed by a Svelte 5 runes store.
- Declarative grading engine in `src/lib/engine/` with Vitest coverage.
- Tailwind 4 styling with NHS blue theme tokens.
- Reusable UI primitives in `src/lib/components/ui/`.

## Future work

- pdfmake client-side PDF preview matching the FP92A paper layout.
- JSON / XML / CSV / TSV import & export.
- Wire the FHIR R5 Bundle output (Patient, Practitioner, Coverage, Condition).
- Backend integration with the Loco full-stack implementation.
- Accessibility audit (axe-core + manual keyboard run-through).
