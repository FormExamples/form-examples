# Medical Information Form for Air Travel — FHIR HL7 R5 JSON

FHIR HL7 R5 JSON resources, one file per SQL table in `../sql-migrations/`.
The MEDIF maps to `Patient`, `Practitioner`, `Encounter`,
`ClinicalImpression`, and `DetectedIssue` resources, composed into a
`document`-type `Bundle` at export time.

See [`AGENTS.md`](./AGENTS.md) for the resource-by-resource mapping,
placeholder UUIDs, and bundling rules.
