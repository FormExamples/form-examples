# Microbiology Culture Test Result — fhir/r5/

Generated FHIR HL7 R5 JSON per SQL table entity. Never hand-edit; regenerate
from [`../../sql/`](../../sql) with the repo generators in `bin/`. A microbiology
culture result maps naturally to a FHIR `DiagnosticReport` (category LAB)
referencing per-organism / per-sensitivity `Observation` resources and a
`Specimen`.
