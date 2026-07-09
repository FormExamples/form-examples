# typespec — Agent Instructions

TypeSpec models mirroring `../sql/`. Hand-authored.

Keep in sync with `../sql/` after any schema change. When a
table is added, renamed, or has columns added or removed, update
`main.tsp` to match. The generator emits OpenAPI 3 specs via
`@typespec/openapi3`.
