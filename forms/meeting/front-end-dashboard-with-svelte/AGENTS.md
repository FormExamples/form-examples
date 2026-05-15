# Meeting — Front-end Dashboard (SvelteKit) Agent Instructions

SvelteKit 2.x + Svelte 5 review dashboard for the meeting form, built
around the SVAR DataGrid (`@svar-ui/svelte-grid`). See
[`AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the stack-wide contract.

## Tools

- `pnpm install` — install dependencies.
- `pnpm dev` — local dev server.
- `pnpm build` — production bundle.

## File naming convention

- `src/lib/api.ts` — API client with sample-data fallback.
- `src/lib/columns.ts` — SVAR DataGrid column definitions.
- `src/routes/+page.svelte` — the dashboard page.

## Contents

- `./index.md` — overview
- `./AGENTS.md` — this file
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)
- `./plan.md` — implementation roadmap
- `./tasks.md` — task tracking

## Stack

- SvelteKit 2.x + TypeScript.
- Svelte 5 runes (`$state`, `$derived`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.

## Columns

| Column | Source | Sort | Filter |
| --- | --- | --- | --- |
| Title | `meeting.title` | yes | text |
| Category | `meeting.category` | yes | dropdown |
| Status | `meeting.status` | yes | dropdown |
| Scheduled start | `meeting.scheduledStartAt` | yes | date range |
| Participants | derived count | yes | — |
| Fired rules | derived count | yes | — |
| Result | `meetingGrade.overallResult` | yes | dropdown |

## Verify

```sh
bin/test-form meeting
```
