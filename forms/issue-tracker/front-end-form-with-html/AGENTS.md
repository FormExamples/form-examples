# Issue Tracker — front-end form with HTML

Static single-page issue-reporting wizard built with plain HTML, CSS,
and a small amount of vanilla JavaScript. Mirrors the SvelteKit version
field-for-field but has no build step.

## Status

Scaffold only. The 10-step wizard form, scoring engine, and report
rendering still need to be authored.

## Conventions

- One `index.html` containing the full 10-step wizard (single page).
- Native HTML form elements with `name` attributes matching the SQL
  column names (`cc_summary`, `score_by_priority_rank`, etc.).
- Step navigation handled with `details` / `summary` plus a small
  scoring-engine JS module.
- No bundler. Plain CSS file.
- Print-friendly stylesheet for the report view.

## Scoring

The seven raw scores are computed in `scoring.js`, which mirrors the
TypeScript engine. Composite priority uses the max-grade algorithm.

## Verify

Open `index.html` in a browser and walk through the 10 steps.
