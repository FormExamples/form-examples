# Meeting — Front-end Form (SvelteKit) Agent Instructions

SvelteKit 2.x + Svelte 5 single-page wizard for the meeting form. See
[`AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the stack-wide contract.

## Tools

- `pnpm install` — install dependencies.
- `pnpm dev` — local dev server.
- `pnpm test` — Vitest unit tests for `validateMeeting()`.
- `pnpm build` — production bundle.

## File naming convention

- `StepNName.svelte` — wizard step component (1-indexed: `Step1Organiser.svelte`,
  `Step2TitleAndPurpose.svelte`, …).
- UI primitives in `src/lib/components/ui/`.
- Engine in `src/lib/validateMeeting.ts`.
- Tests in `src/lib/validateMeeting.test.ts`.

## Contents

- `./index.md` — overview
- `./AGENTS.md` — this file
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)
- `./plan.md` — implementation roadmap
- `./tasks.md` — task tracking

## Stack

- SvelteKit 2.x + TypeScript.
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for client-side PDF.
- Vitest for engine unit tests.

## Routing

- `/meeting/[step=step]/+page.svelte` with the `step` param matcher
  validating the integer range 1–10.
- Despite the dynamic route, the wizard is one continuous single page;
  the route only deep-links the user to a section.

## Conventions

- camelCase TypeScript property names.
- Empty string `''` for unanswered text fields; `null` for numeric.
- 250-character cap on `summary` enforced in `Step8Summary.svelte` and
  re-asserted by `validateMeeting()`.

## Verify

```sh
bin/test-form meeting
```
