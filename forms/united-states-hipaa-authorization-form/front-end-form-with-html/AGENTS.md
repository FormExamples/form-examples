# front-end-form-with-html — Agent Instructions

Static single-page HTML wizard for the HIPAA authorization. Implements
the 9 steps from `../index.md` on one continuous page (no multi-page
forms).

## Stack

- Plain HTML, CSS, JavaScript ES modules.
- Optional Alpine.js for declarative interactivity (loaded via CDN).
- `localStorage` autosave of the in-progress authorization.
- No bundler; no transpiler; works directly when opened.

## Conventions

- Step components are sections (`<section data-step="N">`) on a single
  page; navigation scrolls.
- Engine modules under `js/` are pure functions, ES module exports.
- `validate-authorization.js` is the entrypoint.
- Inputs use names matching the SQL `snake_case` for round-trip parity
  with the back-end, while the in-memory JS uses `camelCase`.
- Sensitive-category yes/no fields require a paired initials input.

## Run

Open `index.html` in any modern browser. No server required.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
