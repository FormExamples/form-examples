# Eye Prescription — TypeSpec

Hand-authored [TypeSpec](https://typespec.io/) models for the eye-
prescription form. TypeSpec is a Microsoft-authored DSL for designing APIs
and data models that compiles to OpenAPI 3, JSON Schema, Protobuf, and
client SDKs in multiple languages.

## Files

- `main.tsp` — all models in a single namespace.

## Build

```sh
npm install --save-dev @typespec/compiler @typespec/openapi3
npx tsp compile main.tsp --emit @typespec/openapi3
```

This emits an `tsp-output/@typespec/openapi3/openapi.yaml` file that can
be served from a Swagger UI or Redoc, fed into Stoplight Studio, etc.

## Conventions

- One `namespace` for the whole form (`EyePrescription`).
- One `model` per SQL table, with field names in camelCase.
- Enum-style strings expressed as TypeSpec union literals.
- `plainDate` for dates, `plainTime` for times, `utcDateTime` for
  timestamps.
- `float64` for `NUMERIC(5,2)` columns (sphere, cylinder, prism,
  refractive index, etc.).
- `int32` for axis (1–180) and other integer columns.
- Optional fields use the `?:` suffix.

## Relation to other representations

TypeSpec is the **API-first** representation. SQL is the storage truth;
FHIR is the clinical-integration truth; TypeSpec is the contract that a
SvelteKit / Rust client speaks to the back-end. The three should agree.
If they drift, the SQL is authoritative — regenerate the FHIR / protobuf
representations and re-author the TypeSpec to match.

## Verify

There is no monorepo-wide test for TypeSpec yet; rely on `tsp compile`
to catch syntax errors.
