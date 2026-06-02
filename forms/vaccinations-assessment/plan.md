# Plan: Vaccinations Assessment

## Current status

Implemented. SvelteKit patient form with 10-step wizard covering
immunisation history, childhood/adult/travel/occupational vaccinations,
contraindication screening, consent capture, and administration record.
SQL migrations, xml-representations, and FHIR R5 resources in place.
Dashboard and full-stack Rust backend remain to be built.

## Scoring engine

The vaccinations grader compares the patient's recorded immunisation
history against the UK Green Book schedule (Immunisation against
infectious disease) and classifies compliance as Compliant, Partial, or
Non-compliant. It generates catch-up schedules for missed vaccinations,
screens for contraindications (immunosuppression, severe allergy,
pregnancy where applicable), and integrates travel-vaccination
requirements based on the destination country.

## Future enhancements

- Build front-end-dashboard-with-svelte with SVAR DataGrid
- Build back-end-with-loco Rust backend
- Add input validation with Zod schemas
- Add accessibility audit (axe-core)
- Add end-to-end tests with Playwright
- Add form autosave to localStorage
- Add internationalisation (i18n) support
- Clinical safety case documentation
- User acceptance testing with immunisation nurses
