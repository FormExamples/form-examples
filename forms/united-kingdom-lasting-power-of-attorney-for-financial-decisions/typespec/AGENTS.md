# UK Lasting Power of Attorney for Financial Decisions — TypeSpec

Generated artifact: `main.tsp` defines one TypeSpec `model` per SQL table.

## Conventions

- Single file `main.tsp` with `@service` namespace `LpaFinance`.
- Each table becomes a PascalCase `model` (e.g. `LastingPowerOfAttorney`).
- snake_case SQL columns become camelCase TypeSpec properties? No — to keep
  parity with FHIR / protobuf and to round-trip with SQL, we keep
  snake_case property names. (camelCase is reserved for the TS / front-end
  serialization layer.)
- `@key id: string;` on every model with `@format("uuid")`.
- TIMESTAMPTZ columns become `utcDateTime`.
- DATE columns become `plainDate`.
- BOOLEAN columns become `boolean`.
- TEXT CHECK enums become TypeSpec named `union` types.
- Cross-table references use a documentation comment plus the FK column
  typed as `@format("uuid") string`. A future iteration may wire these via
  `@references` once that decorator stabilizes in the TypeSpec spec.

Compile with `tsp compile main.tsp`.
