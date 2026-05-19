# HTML Fit-Note Wizard

Single-page static HTML implementation of the UK Statement of Fitness for
Work (Med 3 / fit note) ten-step wizard. No build step, no framework, no
CDN dependencies; runs from `file://`.

## Pages

- `index.html` — the wizard with sticky progress bar and report region.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- Classic `<script>` tags only (no ES modules) so the form runs from a
  filesystem on an air-gapped GP workstation.

## Files

- `index.html` — page shell and ten step sections.
- `css/style.css` — mobile-first stylesheet.
- `js/types.js` — empty fit-note factory and shared constants.
- `js/grader.js` — grading engine (validity, adaptation, period, safety).
- `js/app.js` — wizard renderer, persistence, report generation.

## Persistence

Form state autosaves to `localStorage` under the key
`united-kingdom-statement-of-fitness-for-work.front-end-form-with-html.v1`.

## Output

Renders an HTML preview of the fit note (mimicking the DWP layout) with
the fitness category, adaptation tick boxes, comments, period, and
follow-up date, plus the computed grade and safety-flag list.
