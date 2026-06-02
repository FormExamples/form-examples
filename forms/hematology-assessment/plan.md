# Plan: Hematology Assessment

## Current status

Implemented. SvelteKit patient form with 10-step wizard covering blood
count analysis, coagulation studies, blood film, iron studies,
haemoglobinopathy screening, bone-marrow assessment, transfusion
history, treatment, and clinical review. SQL migrations,
xml-representations, and FHIR R5 resources in place. Dashboard and
full-stack Rust backend remain to be built.

## Scoring engine

The hematology grader interprets CBC parameters (haemoglobin, white-cell
count, platelets, MCV/MCH/MCHC) against reference ranges and classifies
abnormalities as Normal, Mild, Moderate, or Severe. It cross-references
iron studies (ferritin, serum iron, TIBC, transferrin saturation) and
coagulation values (PT, APTT, fibrinogen, D-dimer) to refine the
classification, and produces flagged issues for critical values
requiring urgent intervention (e.g. severe anaemia, thrombocytopenia,
neutropenia, deranged coagulation).

## Future enhancements

- Build front-end-dashboard-with-svelte with SVAR DataGrid
- Build back-end-with-loco Rust backend
- Add input validation with Zod schemas
- Add accessibility audit (axe-core)
- Add end-to-end tests with Playwright
- Add form autosave to localStorage
- Add internationalisation (i18n) support
- Clinical safety case documentation
- User acceptance testing with haematology clinicians
