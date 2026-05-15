# Plan: Meeting — Front-end Form (SvelteKit)

## Current status

Scaffolded 2026-05-13. Implementation deferred — requires `pnpm install`.
`tasks.md` tracks the remaining build steps.

## Goal

A SvelteKit 2.x + Svelte 5 application that renders the 10-step
single-page wizard described in the top-level [`index.md`](../index.md)
and runs the shared `validateMeeting()` engine on every keystroke.

## Build order

1. `pnpm create svelte@latest .` and accept the TypeScript + Tailwind
   options.
2. Configure Tailwind CSS 4 with `@import 'tailwindcss'` and the
   monorepo `@theme` tokens.
3. Author the type model in `src/lib/types.ts` (`Meeting`, `Participant`,
   `AgendaItem`, …).
4. Port `validateMeeting()` into `src/lib/validateMeeting.ts` and cover
   every fired rule with Vitest cases.
5. Author the 10 step components under `src/lib/components/steps/`
   following the `StepNName.svelte` convention.
6. Build the `/meeting/[step=step]/+page.svelte` route and `step` param
   matcher.
7. Wire LocalStorage autosave keyed by meeting `id`.
8. Wire `pdfmake` PDF export and the ICS export hook.
9. Run `bin/test-form meeting`.

## Design principles

- One continuous single-page wizard.
- Engine logic shared rule-for-rule with the HTML form and Rust backend.
- Tailwind tokens come from the monorepo `@theme` set so every form
  looks identical.
- All shared types use camelCase to match `serde(rename_all = "camelCase")`
  on the Rust side.
