# Patient Intake — patient form (static HTML + vanilla JS)

Static HTML + vanilla JavaScript. No build step.

See parent [`../index.md`](../index.md) for the form specification.

## Architecture

- Single-page continuous wizard (10 sections rendered in document order)
- Sticky header with progress bar; aria-live report region; skip link
- IIFE-wrapped classic `<script>` files (no ES modules) so the page works
  when opened directly via `file://`
- Every JS file attaches its public symbols to `window.PatientIntake`
- Pure scoring engine mirrors the SvelteKit reference

## Files

```
index.html              # Page shell + sticky progress + report region
css/style.css           # Mobile-first styles, no framework
js/types.js             # AssessmentData shape + emptyAssessment() factory
js/intake-rules.js      # Declarative risk-classification rules
js/intake-grader.js     # calculateRiskLevel() pure function
js/flagged-issues.js    # detectAdditionalFlags() (safety + admin)
js/app.js               # Wizard controller: renderers, persistence, submit
```

## Persistence

`localStorage` key: `patient-intake.front-end-form-with-html.v1`
