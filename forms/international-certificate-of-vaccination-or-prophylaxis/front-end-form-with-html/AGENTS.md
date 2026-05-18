# ICVP — Static HTML form wizard — agent instructions

Self-contained static HTML / CSS / vanilla JavaScript implementation of the
ICVP eight-step single-page wizard. No build step. No external runtime
dependencies (CDN scripts are permitted only for fonts).

## Conventions

- ES module-free vanilla JavaScript, supported by all modern browsers from
  2022 onward.
- DOM state held in a single `state` object inside `script.js`; persisted to
  `localStorage` under the key `icvp-form-state`.
- Each step is a `<fieldset>` with a `data-step="N"` attribute; the active
  step's fieldset has the `is-active` class.
- The validation engine is a pure function `validateCertificate(state)` that
  returns `{ overallValid, firedRules: [{ code, severity, message }] }`.
- The summary panel re-renders on each `input`/`change` event.
- Disease codes use kebab-case slugs (`yellow-fever`, `polio`, …).

## Acceptance

- `index.html` opens directly in a browser.
- The eight steps render in order; Previous / Next buttons move between
  them with keyboard support (Enter / arrow keys).
- The "Generate certificate" button on Step 8 renders the printable
  certificate preview and lists any fired validation warnings.

## Out of scope

- Server submission. The form is local-only.
- PDF export. Use the browser's "Print to PDF" feature on the Step 8
  preview.
