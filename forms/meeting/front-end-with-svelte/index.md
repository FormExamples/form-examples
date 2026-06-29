# Meeting — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. Vitest for the validation engine.

A single-page, ten-step wizard records a meeting (organiser, title, invitation,
agenda, participants, resources, recurrence, summary, action items / outputs /
outcomes, sign-off). The shared validation engine checks the record for
structural problems and produces an overall health verdict with flagged issues.
A SVAR DataGrid dashboard lists recorded meetings; a report view and PDF
endpoint produce a shareable record.

See parent [`../index.md`](../index.md) for the full form specification.
