# Plan: Encounter Satisfaction

## Current status

Implemented. SvelteKit patient form with 8-step wizard, ESS composite
scoring (1.0–5.0), and flagged-issues detection. SQL migrations and
xml-representations in place. Dashboard and full-stack Rust backend
remain to be built.

## Scoring engine

The Encounter Satisfaction Score (ESS) grader is inspired by PSQ-18 and
HCAHPS. It scores 19 questions across 6 domains (Access & Scheduling,
Communication, Staff & Professionalism, Care Quality, Environment,
Overall Satisfaction) on a 5-point Likert scale. The composite score is
the mean of all answered Likert items (1.0–5.0), categorised as
Excellent (≥4.5), Good (≥3.5), Fair (≥2.5), Poor (≥1.5), or Very Poor.
Flagged issues escalate any Likert rating of 1, communication ratings
≤2, and Poor composite scores.

## Future enhancements

- Build front-end-dashboard-with-svelte with SVAR DataGrid
- Build back-end-with-loco Rust backend
- Add input validation with Zod schemas
- Add accessibility audit (axe-core)
- Add end-to-end tests with Playwright
- Add form autosave to localStorage
- Add internationalisation (i18n) support
- Clinical safety case documentation
- User acceptance testing with patient advisory group
