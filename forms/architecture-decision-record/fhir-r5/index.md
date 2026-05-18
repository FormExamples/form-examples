# FHIR R5 Representations — Architecture Decision Record

FHIR HL7 R5 JSON resources generated from the SQL migrations by
`bin/fhir-r5/generate-fhir-r5-representations.py`. One JSON file per table,
mapped to the closest FHIR resource type.

FHIR is a clinical data interchange standard; for an ADR it is a stretch
fit. The generator emits structurally valid R5 JSON so the same tooling
pipeline used by the clinical forms in this repo continues to work, but the
resources are not intended for clinical exchange. Treat them as
"FHIR-shaped JSON" rather than full clinical FHIR.
