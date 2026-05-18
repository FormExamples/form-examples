# Agile Checklist — Static HTML Form

A self-contained, single-page wizard that runs without a build step.
Open `index.html` directly via `file://` or via any static-file server.

The page renders 5 sections (respondent + 3 section checklists +
summary), computes the maturity result entirely in vanilla JavaScript
plus Alpine.js, and shows an in-page report with fired rules and
operational flags.

## Layout (planned)

```
front-end-form-with-html/
  index.html
  css/style.css
  js/items.js          # the 57 item definitions
  js/engine.js         # scoring engine (mirrors the Svelte engine)
  js/app.js            # form rendering, state, report
```

## Conventions

- Classic `<script>` tags so the page works under `file://`.
- Each script attaches its public symbols to `window.AgileChecklist`.
- Tri-state Yes / No / N-A is implemented with three native
  `<input type="radio">` per item for accessibility.
