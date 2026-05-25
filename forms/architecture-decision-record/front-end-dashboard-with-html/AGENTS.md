# front-end-dashboard-with-html — Agent Instructions

Pending implementation. When building this:

- Same `file://`-friendly constraints as `front-end-form-with-html`:
  classic scripts, no modules, no server.
- Read decisions from a static JSON file. Generate that file from the
  database via a separate script — do not couple the dashboard to a
  live API.
- Read-only by design. Authoring happens in the form, not here.

## Lily Design System HTML headless

This dashboard conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) §3
(`.data-table-*` family) for the shared vocabulary, filter shape
(`.text-input`, `.select`), and `.alert[data-type]` status messages.
