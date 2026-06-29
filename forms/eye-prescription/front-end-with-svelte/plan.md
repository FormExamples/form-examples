# Plan: Eye Prescription — SvelteKit Front-End Form

## Build order

1. `pnpm create svelte@latest` — scaffold (SvelteKit 2, TypeScript,
   Tailwind 4).
2. Install dependencies: `pdfmake`, `@types/pdfmake`, `vitest`,
   `@testing-library/svelte`.
3. Author `src/lib/types.ts` with the `EyePrescription` shape and all
   child types matching the SQL schema.
4. Author `src/lib/refractive-rules.ts` with the sphere / cylinder /
   addition band tables.
5. Author `src/lib/complexity-grader.ts` with the worst-of composite
   complexity engine.
6. Author `src/lib/flagged-issues.ts` with the 11 safety flags.
7. Write Vitest unit tests for steps 4–6.
8. Author UI components in `src/lib/components/ui/` (Button, Input,
   Select, Fieldset, NumberStepper for 0.25 D snap).
9. Author 11 step components in `src/lib/components/`.
10. Wire up `routes/prescription/[step=step]/+page.svelte` with the step
    matcher.
11. Author `src/lib/pdf.ts` with `pdfmake` for a UK NHS / GOC layout.
12. Add Playwright happy-path test (deferred).
13. `pnpm run check` and `pnpm run test` pass.

## Design principles

- One continuous single-page form (monorepo rule).
- State held in a single `$state` rune at the layout level.
- `$derived` for computed values (classification, complexity, flags).
- Sign-convention strict: cylinder must be ≤ 0 (offer plus → minus
  conversion button if user enters positive).
- All numeric inputs snap to 0.25 D on blur.
- Axis input rejects 0 and suggests 180.
- Real-time summary on step 11 driven by `$derived`.

## Out of scope (deferred)

- LocalStorage autosave with draft recovery.
- Zod runtime validation.
- Plus-cylinder display toggle.
- Bilingual UI.
- NHS PDS integration.
- Side-by-side comparison view.
