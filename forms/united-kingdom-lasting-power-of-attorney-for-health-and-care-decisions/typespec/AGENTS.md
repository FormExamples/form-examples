# UK LPA for Health and Care Decisions — TypeSpec

Hand-authored TypeSpec API contract. Compiles to OpenAPI 3 + JSON Schema
for the front-ends and the back-end's request/response validation.

Models mirror the SQL schema (`Donor`, `Attorney`, `ReplacementAttorney`,
`CertificateProvider`, `PersonToNotify`, `Lpa`) plus the engine output
(`LpaValidityResult`, `FiredRule`, `AdditionalFlag`).

REST operations cover:

- create / update an LPA
- run the validity engine
- generate the OPG submission packet
- export FHIR R5 Bundle, XML, and OPG-ready PDF

The TypeSpec file is the canonical API contract. The Loco backend's axum
routes and the SvelteKit client's API client both derive from the
compiled OpenAPI document.
