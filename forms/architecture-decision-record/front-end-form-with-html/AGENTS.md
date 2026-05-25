# front-end-form-with-html — Agent Instructions

This is the static HTML implementation of the ADR wizard. Constraints:

- Must work from `file://` — no `type="module"`, no `fetch`, no relative
  imports requiring a server.
- One JS file is enough; do not split into modules.
- Use Alpine.js only if it is loaded via `<script>` tag from CDN; for now
  we use plain DOM manipulation.
- 16 sections rendered as scrollable cards on one page, no multi-page
  wizard.
- The submit action produces a Markdown ADR; it does not POST anywhere.

When changing field shapes, keep `js/app.js`'s `emptyData()` and the SQL
migrations in `sql-migrations/` in sync.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
