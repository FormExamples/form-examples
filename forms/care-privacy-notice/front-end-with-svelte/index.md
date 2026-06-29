# Care Privacy Notice — front end (SvelteKit)

Consolidated SvelteKit front end: the privacy notice wizard and the clinician
dashboard in one app. SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily
Design System tokens + SVAR DataGrid. Vitest for unit tests.

RESTful routes under `/care-privacy-notices/`:

- `/` — welcome page.
- `/care-privacy-notices` — clinician dashboard (SVAR DataGrid).
- `/care-privacy-notices/new` and `/care-privacy-notices/[id]` — the wizard.
- `/care-privacy-notices/[id]/report` — validation summary + PDF.

See parent [`../index.md`](../index.md) for the form specification.
