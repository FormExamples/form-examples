# AGENTS — `front-end-*-with-html/` (Lily Design System HTML headless)

Conventions for every form's `front-end-form-with-html/` and
`front-end-dashboard-with-html/` subprojects. Applies to all 133 forms.

Companion docs: [`plan.md`](plan.md), [`tasks.md`](tasks.md).

## 1. What Lily HTML headless is, for our purposes

`lily-design-system-html-headless` is a **specification** of accessible,
framework-free HTML components — not a runtime library. Each component file
under `~/git/lilydesignsystem/lily-design-system/lily-design-system-html-headless/components/`
is a tiny HTML template plus a documentation comment block describing:

- the HTML tag,
- the CSS class name (kebab-case, stable contract),
- accepted ARIA attributes,
- accepted `data-*` attributes and their values,
- expected keyboard behavior,
- expected child structure.

Most components ship **zero JavaScript** (e.g., `text-input`, `step-list`,
`step-list-item`, `field`, `button`, `error-summary`). A few interactive
components (e.g., `dialog`, `tab-bar`) embed vanilla JS for keyboard
behavior; when we need that behavior, we copy the JS into the form's
`js/app.js` rather than loading the `.html` file at runtime.

**Consequence: there is nothing to install.** Our forms conform to Lily's
class/attribute contract; we do not link to, bundle, or vendor Lily files
at runtime. This is consistent with the project-wide no-build constraint.

## 2. Consumption model (decision)

- **Lily is treated as a spec the generator reads at authoring time.**
  Generators under `bin/` read Lily's component files to learn class
  names, attribute contracts, and structure rules.
- **No runtime dependency on Lily.** No `<script src="…/lily/…">`, no
  CSS imports, no npm package. Every form's `front-end-*-with-html/`
  directory is self-contained and works via `file://`.
- **Lily checkout location is `~/git/lilydesignsystem/lily-design-system/lily-design-system-html-headless/`.**
  Generators look there; if absent they fail with a clear error.
- **Pinned commit recorded in `doc/lily-version.md`.** Re-running
  `bin/lily-sync` (a doc-snapshotting helper, not a runtime sync)
  refreshes the pinned hash and copies the spec comments into
  `doc/lily-spec/` for quick reference without needing the external
  checkout.

## 3. Class vocabulary (Lily contract)

Every class name on a form element MUST come from this list (or be a
project-local layout helper such as `.visually-hidden`,
`.page-header`, `.page-header-inner`, `.subtitle`).

### Form structure

| Concept              | Lily class                         | Tag           |
|----------------------|------------------------------------|---------------|
| Form root            | `.form`                            | `<form>`      |
| Grouped fields       | `.fieldset` + `.fieldset-legend`   | `<fieldset>` + `<legend>` |
| Single field wrapper | `.field`                           | `<div>`       |
| Field label          | `.label`                           | `<label>`     |
| Field hint           | `.hint`                            | `<span>`      |
| Field error          | `.error-message`                   | `<span>`      |
| Page-level errors    | `.error-summary`                   | `<div role="alert">` |

### Inputs

| Concept            | Lily class               | Tag                          |
|--------------------|--------------------------|------------------------------|
| Single-line text   | `.text-input`            | `<input type="text">`        |
| Multi-line text    | `.text-area-input`       | `<textarea>`                 |
| Email              | `.email-input`           | `<input type="email">`       |
| Number             | `.number-input`          | `<input type="number">`      |
| Date               | `.date-input`            | `<input type="date">`        |
| Time               | `.time-input`            | `<input type="time">`        |
| Tel                | `.tel-input`             | `<input type="tel">`         |
| URL                | `.url-input`             | `<input type="url">`         |
| Search             | `.search-input`          | `<input type="search">`      |
| File               | `.file-input`            | `<input type="file">`        |
| Range slider       | `.range-input`           | `<input type="range">`       |
| Single checkbox    | `.checkbox-input`        | `<input type="checkbox">`    |
| Single radio       | `.radio-input`           | `<input type="radio">`       |
| Select dropdown    | `.select`                | `<select>`                   |
| Checkbox group     | `.checkbox-group`        | `<div role="group">`         |
| Radio group        | `.radio-group`           | `<div role="radiogroup">`    |

### Buttons

| Concept            | Lily class               | Tag                            |
|--------------------|--------------------------|--------------------------------|
| Generic button     | `.button`                | `<button>`                     |
| Submit             | `.submit-input`          | `<input type="submit">`        |
| Reset              | `.reset-input`           | `<input type="reset">`         |

Variant styling (primary/secondary/danger) is conveyed via a
`data-variant` attribute on `.button`, e.g. `data-variant="primary"`.
The consumer stylesheet keys on the attribute.

### Wizard / progress

| Concept            | Lily class                       | Tag      |
|--------------------|----------------------------------|----------|
| Step list          | `.step-list`                     | `<ol>`   |
| Step list item     | `.step-list-item`                | `<li>`   |
| Progress bar       | `.progress`                      | `<progress>` |

Step state is encoded on each `.step-list-item` via:

- `data-status="waiting" | "in-progress" | "finished" | "error"`
- `aria-current="step"` on the active item

The list's current index is mirrored on the parent: `data-current="N"`.

### Dashboard

| Concept            | Lily class               | Tag       |
|--------------------|--------------------------|-----------|
| Data table         | `.data-table`            | `<table>` |
| Table head         | `.data-table-head`       | `<thead>` |
| Table body         | `.data-table-body`       | `<tbody>` |
| Table foot         | `.data-table-foot`       | `<tfoot>` |
| Row                | `.data-table-row`        | `<tr>`    |
| Header cell        | `.data-table-th`         | `<th>`    |
| Data cell          | `.data-table-td`         | `<td>`    |

Filters above the table reuse `.text-input`, `.select`, and `.button`.

### Status messages

| Concept            | Lily class               | Tag       |
|--------------------|--------------------------|-----------|
| Alert              | `.alert`                 | `<div role="alert">` |
| Panel (report)     | `.panel`                 | `<section role="region">` |

`.alert` carries `data-type="info" | "success" | "warning" | "error"`.

### Local helpers (NOT Lily — defined in our `style.css`)

- `.visually-hidden` — screen-reader-only utility
- `.page-header`, `.page-header-inner`, `.subtitle` — page chrome
- `.skip-link` — top-of-page skip target
- `.empty-message` — empty-state copy inside a region

## 4. Page shell

Every `front-end-form-with-html/index.html` follows this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{Form Title}}</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <a class="skip-link visually-hidden" href="#form-sections">Skip to form</a>

  <header class="page-header">
    <div class="page-header-inner">
      <h1>{{Form Title}}</h1>
      <p class="subtitle">{{Form subtitle}}</p>
    </div>
    <progress class="progress" max="100" value="0"
              aria-label="Form completion"></progress>
    <ol class="step-list" aria-label="{{Form Title}} steps"
        data-current="0"><!-- step-list-items injected by app.js --></ol>
  </header>

  <main>
    <form class="form" id="form" autocomplete="off" novalidate
          onsubmit="return false;" aria-label="{{Form Title}}">
      <div class="error-summary" role="alert" aria-label="Errors"
           hidden><!-- populated on validation failure --></div>
      <div id="form-sections"><!-- fieldsets injected by app.js --></div>
      <div class="button-group">
        <button class="button" type="button" id="prev"
                data-variant="secondary">Previous</button>
        <button class="button" type="button" id="next"
                data-variant="primary">Next</button>
        <input class="submit-input" type="submit" value="Submit" hidden>
        <input class="reset-input" type="reset" value="Reset"
               data-variant="secondary">
      </div>
    </form>

    <section class="panel" role="region" aria-live="polite"
             aria-label="Report" id="report">
      <p class="empty-message">Submit the form to see the report.</p>
    </section>
  </main>

  <footer><!-- footer content --></footer>

  <script src="js/types.js"></script>
  <!-- domain scripts in order: rules → grader → flagged-issues -->
  <script src="js/app.js"></script>
</body>
</html>
```

Dashboards follow the analogous `.data-table-*` shell.

## 5. JavaScript conventions

- Classic `<script>` tags only. **No** `type="module"`, no bundler, no
  `import`/`export`. Pages must work via `file://`.
- IIFE wrapper per file. Public symbols hang off a single
  `window.FormNameCamelCase` namespace.
- Script load order:
  `types.js` → form-specific `*-rules.js` → `*-grader.js` →
  `flagged-issues.js` → `app.js`.
- `app.js` is responsible for:
  1. building `emptyAssessment()` and hydrating from localStorage,
  2. rendering each step as a `<fieldset class="fieldset">` containing
     Lily-shaped `.field` blocks,
  3. updating `.progress` value, `.step-list-item[data-status]`, and
     `aria-current="step"` on step changes,
  4. validating on Next/Submit; on failure, populating
     `.error-summary` and per-field `.error-message`, then focusing
     the summary,
  5. invoking the grader on submit and rendering the report into the
     `.panel` region.
- Domain files (`*-rules.js`, `*-grader.js`, `flagged-issues.js`) are
  hand-curated per form. The generator MUST NOT overwrite them.

## 6. LocalStorage

Key pattern, unchanged from current convention:

```
{form-slug}.front-end-form-with-html.v1
```

Values are JSON-serialized form state. On load, app.js merges the stored
value over a fresh `emptyAssessment()` so that adding new fields in
future versions does not orphan existing drafts.

The Lily refactor MUST preserve key and shape. A migration hook is
acceptable for additive shape changes; renames are not.

## 7. Validation pattern

On Next/Submit:

1. Run validators for the current step (or the whole form on Submit).
2. For each failing field:
   - Render its `.error-message` adjacent to the input.
   - Set `aria-invalid="true"` and `aria-describedby` on the input.
3. Render `.error-summary` at the top of the form with a `<ul>` of
   anchor links to each erroneous field by `id`.
4. Show the summary (`hidden` removed), set focus to it, scroll into view.
5. On the next successful re-validation, hide the summary and clear
   per-field errors.

`.alert` with `data-type="error"` MAY be used in place of `.error-summary`
when only one error is involved.

## 8. Accessibility commitments

- Single visible `<h1>` per page.
- Every input has an associated `<label>`.
- Step list reflects current step via `aria-current="step"` AND
  `data-status="in-progress"`.
- Report region is `role="region"` with `aria-live="polite"`.
- Skip link at top of body.
- Color contrast ≥ WCAG 2.2 AA on all interactive states.
- Keyboard navigation works without a mouse for: stepping through the
  wizard, choosing radio/checkbox options, opening any dialog, and
  closing it with Escape.

## 9. Canonical reference

The canonical Lily-shaped pair is:

- `forms/pre-operative-assessment-by-clinician/front-end-form-with-html/`
- `forms/pre-operative-assessment-by-clinician/front-end-dashboard-with-html/`

The `bin/generate-front-end-form-with-html.py` and
`bin/generate-front-end-dashboard-with-html.py` generators emit output
equivalent to the canonical form for any other form's spec.

## 10. Out of scope here

- SvelteKit subprojects (`front-end-*-with-svelte/`) — covered by a
  separate plan.
- The Loco/Rust full-stack subproject.
- The Lily library's own development.
