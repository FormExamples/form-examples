# Dietetic Assessment — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

The scoring engine (`js/types.js`, `js/must-rules.js`, `js/glim-rules.js`, `js/composite-grader.js`, `js/flagged-issues.js`) is hand-curated: generators must not overwrite it. `js/table-export.js`, `js/date-time-picker.js`, `js/theme-select.js`, `js/locale-select.js`, `js/text-size-picker.js`, `js/share-picker.js`, and `css/themes/` are shared vendored assets kept in sync by the `bin/` tools; do not hand-edit them.

See [`index.md`](./index.md) for the layout, the import graph, and how to serve the directory.
