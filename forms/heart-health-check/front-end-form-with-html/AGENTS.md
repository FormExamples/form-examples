# Heart Health Check: Front End Patient Form With HTML

Patient-facing 10-step Heart Health Check assessment form. Built with plain
HTML, CSS, and vanilla JavaScript. Classic `<script>` tags (no ES modules,
no build step) so the page works when opened directly via `file://`.

## Architecture

- Single-page continuous wizard with all 10 sections rendered in document order
- Sticky top-of-page progress bar driven by an `aria-live` field count
- Pure scoring engine: 10-year CVD risk + heart age + 20 HHC rules + 13 flags
- IIFE-wrapped classic scripts that publish exports to `window.HeartHealthCheck`
- Data persistence to `localStorage` under key
  `heart-health-check.front-end-form-with-html.v1`
- Conditional sections via `data-conditional` and `data-conditional-any` hooks
- Inline aria-live `#report` region rendered after submission

## Files

```
front-end-form-with-html/
  index.html             # Page shell (sticky progress, form host, report region)
  css/style.css          # Mobile-first responsive styling
  js/
    types.js             # emptyAssessment(), BMI, TC/HDL, smoking points
    risk-rules.js        # 20 HHC rules (evaluateRules())
    risk-grader.js       # estimateTenYearRisk(), calculateHeartAge(), calculateRisk()
    flagged-issues.js    # 13 clinical flags (detectAdditionalFlags())
    app.js               # Wizard render, persistence, submission, report rendering
```

## Scoring engine

- **risk-grader.js**: Point-based QRISK3-shaped scoring with exponential
  mapping; heart-age calculation iterates a baseline patient by age.
- **risk-rules.js**: 20 declarative rules (HHC-001 to HHC-020) with
  evaluate functions.
- **flagged-issues.js**: 13 safety-critical clinical alerts with priority
  sorting (high > medium > low).

## Report

- Risk banner with colour-coded category, 10-year risk %, heart age
- Fired-rules table (high/medium/low)
- Flagged-issues list with priority colours
- Start over action that clears localStorage and re-renders the wizard

## Status

Implemented.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
