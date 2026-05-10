# Agile Principles Assessment — Static HTML Dashboard

A self-contained, single-page review dashboard that runs without a build step.
Open `index.html` directly via `file://` or via any static-file server.

The page lists recent assessment submissions (sample data when no backend is
reachable), provides sortable columns and dropdown filters on maturity level
and respondent role, and shows a per-maturity summary tile row.

## Layout

```
front-end-dashboard-with-html/
  index.html
  css/style.css
  js/data.js   # SAMPLE_ASSESSMENTS rows
  js/api.js    # fetchAssessments() with sample-data fallback
  js/app.js    # filters, sorting, rendering
```
