# united-states-hipaa-authorization-form — typespec

TypeSpec models mirroring `../sql-migrations/`. Suitable for generating
OpenAPI 3 specifications, JSON Schema, and client SDKs via the
`@typespec/openapi3` emitter.

## Files

- `main.tsp` — every model for the HIPAA authorization form.

## Compile

```sh
npx tsp compile main.tsp --emit @typespec/openapi3
```

## Maintenance

Hand-authored. Keep in sync with `../sql-migrations/` after any schema
change.
