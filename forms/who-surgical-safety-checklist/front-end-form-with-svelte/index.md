# WHO Surgical Safety Checklist — SvelteKit front-end form

Single-page wizard implementation of the WHO Surgical Safety Checklist built
with SvelteKit 2.x, Svelte 5 runes, Tailwind CSS 4, and `pdfmake`.

## Wizard

Five steps on a single-page wizard, with a dynamic route
`/checklist/[step=step]/+page.svelte` validated by `src/params/step.ts`
(accepting 0–4):

| # | Component                       | Purpose                                  |
| - | ------------------------------- | ---------------------------------------- |
| 0 | `Step0CaseDetails.svelte`       | Case identification, theatre, lead clinicians, abandonment reason |
| 1 | `Step1SignIn.svelte`            | Sign In items 1–7 plus coordinator sign-off |
| 2 | `Step2TimeOut.svelte`           | Time Out items 1–10, team roster, coordinator sign-off |
| 3 | `Step3SignOut.svelte`           | Sign Out items 1–5 plus coordinator sign-off |
| 4 | `Step4Summary.svelte`           | Lifecycle status, safety flags, PDF / JSON export |

## Engine

Pure functions in `src/lib/checklist/`:

- `types.ts` — `WhoSurgicalSafetyChecklist` and `TeamMember` types in camelCase
  mirroring the SQL columns.
- `factory.ts` — `createEmptyChecklist()` builder.
- `flags.ts` — `computeSafetyFlags(checklist)` returning the safety-flag list
  defined in the parent form's `index.md`.
- `completion.ts` — `computeStatus(checklist)` returning the lifecycle status
  (`not-started`, `sign-in-complete`, `time-out-complete`, `completed`,
  `abandoned`).

Vitest tests live next to each module: `flags.test.ts`, `completion.test.ts`.

## State

`src/lib/stores/checklist.svelte.ts` is a Svelte 5 class-based reactive store
with `$state` data, `$derived` flags / status, and localStorage persistence
under the key `who-surgical-safety-checklist-draft`.

## PDF export

`src/lib/report/pdf-builder.ts` produces a `pdfmake` document definition.
Step 4 (Summary) dynamically imports `pdfmake` in the browser and triggers
download.

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm check
pnpm build
```
