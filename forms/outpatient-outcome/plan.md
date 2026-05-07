# Plan: Outpatient Outcome Report

## Current status

Implementation complete. SQL migrations, generated artifacts (XML, FHIR R5), SvelteKit form (with full OOCG scoring engine and 50 Vitest tests), SvelteKit dashboard (with SVAR DataGrid), HTML scaffolds, and Rust full-stack crate are all in place.

## Scoring engine

The Outpatient Outcome Composite Grade (OOCG) takes four independent domain grades — clinical outcome classification, PROM composite (EQ-5D-5L + GRC + PROMIS Global Health), PREM Friends and Family Test response, and operational attendance + wait-time vs target — on an A–E scale and emits the worst of the four as the overall grade.

Flagged issues include DNA, any PROM worsening, FFT Poor/Very Poor, wait time over target, clinical Worsened/Died, and data-quality gaps in PROM/PREM/attendance fields.

## Future enhancements

- Add PROMIS official T-score calibration tables (current implementation uses a documented linear approximation)
- Obtain EuroQol EQ-5D-5L licence for production use (current implementation paraphrases the items)
- Add autosave to localStorage
- Add i18n support
- Connect the Rust backend to PostgreSQL via Loco entities (currently uses in-memory stubs)
- Build the static HTML front-ends to the same level as the SvelteKit ones
- Clinical safety case documentation
