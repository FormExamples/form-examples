# Tasks: Meeting — Front-end Form (SvelteKit)

- [ ] Scaffold the SvelteKit 2.x + TypeScript + Tailwind project.
- [ ] Configure Tailwind CSS 4 with the monorepo `@theme` tokens.
- [ ] Author `src/lib/types.ts` with the camelCase type model.
- [ ] Port `validateMeeting()` into `src/lib/validateMeeting.ts`.
- [ ] Cover every fired rule with a Vitest case.
- [ ] Author `StepNName.svelte` components for all 10 steps.
- [ ] Build the `/meeting/[step=step]/+page.svelte` route.
- [ ] Author the `step` param matcher (1..10).
- [ ] Wire LocalStorage autosave keyed by meeting `id`.
- [ ] Wire `pdfmake` PDF export.
- [ ] Wire ICS export.
- [ ] Run `bin/test-form meeting` and resolve failures.
