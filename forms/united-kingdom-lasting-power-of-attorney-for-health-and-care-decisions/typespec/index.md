# UK LPA for Health and Care Decisions — TypeSpec

TypeSpec API definitions describing the REST surface exposed by the
back-end. TypeSpec compiles to OpenAPI 3 (for the SvelteKit and HTML
clients) and to JSON Schema (for ingest validation).

The TypeSpec model declares:

- `Donor`, `Attorney`, `ReplacementAttorney`, `CertificateProvider`,
  `PersonToNotify` — value types
- `Lpa` — the aggregate model
- `LpaValidityResult`, `FiredRule`, `AdditionalFlag` — engine output
- REST operations `POST /lpa`, `PUT /lpa/{id}`, `POST /lpa/{id}/validate`,
  `POST /lpa/{id}/register`, `GET /lpa/{id}/pdf`,
  `GET /lpa/{id}/fhir-bundle`, `GET /lpa/{id}/xml`

Files are hand-authored — they are an API contract, not a generated
artifact.
