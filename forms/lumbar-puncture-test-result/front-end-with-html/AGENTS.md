# Lumbar Puncture Test Result — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

## Contract

- One continuous single-page wizard (`index.html`) — no multi-page forms.
- The engine (`js/{types,rules,grader,flags}.js`) is a faithful vanilla-JS port
  of `../front-end-with-svelte/src/lib/engine/*.ts`. Rule IDs, flag IDs,
  categories, and descriptions are verbatim-identical across every front-end and
  the back-end. Do not rename or renumber them.
- Numeric fields serialize `''` → `null` (never `NaN`); localStorage
  rehydration is null-safe for `number | null` fields.
- Required fields carry `data-required`; `validateForm` targets
  `input[data-required], select[data-required], textarea[data-required]`.
- camelCase property names mirror the snake_case SQL columns.
- No build step, no ES modules — classic `<script>` load order matters
  (types → rules → flags → grader → form-app).

## Verify

```sh
bin/test-form lumbar-puncture-test-result
```
