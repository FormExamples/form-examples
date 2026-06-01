# Medical Waiting List Card — static HTML practitioner form

Single-page, dependency-free HTML wizard mirroring the SvelteKit form.
Uses Alpine.js for interactivity and the Lily Design System (HTML
headless) for styling.

See the form-level [`../AGENTS.md`](../AGENTS.md) for the data model and
[`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for the
Lily HTML conventions.

The static HTML form is offered as a low-friction fallback for sites that
cannot run a SvelteKit build, and as the reference Lily-class contract
verified by `bin/lily-html-refactor --check`.
