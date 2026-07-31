# Inpatient Clinical Note — SvelteKit front-end tasks

## Done

- Ported both engines to TypeScript and covered them with 29 Vitest cases.
- Built the twelve step components, including the four repeating-collection
  steps (investigations, problems, medications, jobs).
- Rewrote the routes, the report, the PDF builder, and the dashboard for this
  form's data shape and its two gradings.
- Derived the dashboard sample rows by running the real engine, so the
  dashboard cannot disagree with the report.

## Notes

- The required-component set varies by `noteType`. Any code that needs it must
  call `requiredComponentKeys()` rather than assuming a fixed list.
- The completeness status is not overridable; only the acuity band is, and only
  with a recorded reason.
