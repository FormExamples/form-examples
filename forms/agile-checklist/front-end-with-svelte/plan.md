# Agile Checklist — SvelteKit Form Plan

## Goal

A 5-step single-page SvelteKit wizard that collects 57 yes/no/n-a
answers, computes the composite maturity, and renders a printable
report (PDF via `pdfmake`).

## Build order

1. Scaffold SvelteKit 2 + TypeScript + Tailwind 4 project.
2. Encode the 57 items in `src/lib/config/items.ts`.
3. Implement the engine: `factory.ts`, `composite-grader.ts`,
   `maturity-rules.ts`, `flagged-issues.ts`.
4. Vitest unit tests covering every threshold and every flag.
5. Wizard UI: 5 step components, tri-state Yes/No/N-A radio control.
6. Report page with maturity, per-section bands, fired rules, flags,
   top three actions, sign-off button.
7. PDF export via `pdfmake`.
8. LocalStorage autosave + draft recovery.

## Status

Pending — not yet scaffolded.
