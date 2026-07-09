# Return to Work — FHIR R5 Agent Instructions

Generated FHIR HL7 R5 JSON resources are emitted into this directory
by `bin/fhir-r5/generate-fhir-r5-representations.py`. See
[`index.md`](./index.md) for the SQL → FHIR resource map.

## Authoring rules

- **Do not hand-edit generated files.** Edit
  `../sql/*.sql` and re-run the generator.
- Resource files are named after the source SQL entity in
  snake_case with the `.json` extension.
- Every generated resource must validate against the FHIR R5
  `StructureDefinition` referenced in its `meta.profile`.
- SNOMED CT and ICD-10 codes come from the parent SQL row
  (`primary_diagnosis_snomed`, `primary_diagnosis_icd10`).
- Restriction `kind` enum values use the local code system at
  `https://form-examples.example/fhir/CodeSystem/return-to-work-restriction`.

## Bundle assembly

The Rust full-stack backend assembles the final `Bundle` of
type `document` in
`back-end-with-loco/src/services/fhir.rs`.
This directory is only the per-resource skeleton.

## Verify

```sh
bin/fhir-r5/generate-fhir-r5-representations.py return-to-work
```
