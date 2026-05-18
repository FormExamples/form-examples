# International Certificate of Vaccination or Prophylaxis — TypeSpec

TypeSpec API definitions, one `.tsp` file per SQL table. Generates an OpenAPI
3 schema via `@typespec/openapi3`.

Files:

- `patient.tsp`
- `clinician.tsp`
- `center.tsp`
- `international_certificate_of_vaccination_or_prophylaxis.tsp`
- `international_certificate_of_vaccination_or_prophylaxis_entry.tsp`

Conventions:

- `@service(#{ title: "International Certificate of Vaccination or Prophylaxis" })`
- `namespace InternationalCertificateOfVaccinationOrProphylaxis`
- `model` per table, `PascalCase` model name, `camelCase` properties.
- SQL `CHECK (... IN (...))` becomes a `|`-separated string union.
