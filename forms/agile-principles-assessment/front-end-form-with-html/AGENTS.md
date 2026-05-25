# Agile Principles Assessment — Static HTML Form

A self-contained, single-page wizard that runs without a build step.
Open `index.html` directly via `file://` or via any static-file server.

The page renders 14 sections (respondent + 12 principle Likert questions
+ summary), computes the maturity result entirely in vanilla JavaScript,
and shows an in-page report with fired rules and operational flags.

## Layout

```
front-end-form-with-html/
  index.html
  css/style.css
  js/principles.js     # the 12 principle definitions
  js/engine.js         # scoring engine (mirrors the Svelte engine)
  js/app.js            # form rendering, state, report
```

## Conventions

- Classic `<script>` tags so the page works under `file://`.
- Each script attaches its public symbols to
  `window.AgilePrinciplesAssessment`.
- The HTML form uses native `<input type="radio">` for the Likert scale
  for accessibility; styling is handled with CSS, not JavaScript.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
