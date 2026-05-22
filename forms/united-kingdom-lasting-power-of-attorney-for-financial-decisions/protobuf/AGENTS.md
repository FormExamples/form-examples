# UK Lasting Power of Attorney for Financial Decisions — Protocol Buffers

Generated artifacts: do not edit by hand. Regenerate via
`bin/protobuf/generate-protobuf-representations.py <form-slug>`.

## Conventions

- One `<table>.proto` per SQL table in `../sql-migrations/`.
- All files declare `syntax = "proto3";` and `package lpa.finance;`.
- One `message <PascalCaseTable>` per file, fields numbered `1..N` in SQL
  column order.
- `snake_case` field names mirror SQL column names exactly.
- Enum prefix is `<TABLE>_<VALUE>` (uppercased) and value 0 is reserved as
  `<TABLE>_<COLUMN>_UNSPECIFIED`.

## SQL-to-Protobuf mapping

| SQL type | Protobuf type |
| --- | --- |
| `UUID` | `string` (uuid) |
| `TEXT`, `VARCHAR` | `string` |
| `BOOLEAN` | `bool` |
| `SMALLINT`, `INTEGER` | `int32` |
| `NUMERIC(p,s)` | `double` |
| `DATE` | `string` (ISO 8601 date) |
| `TIMESTAMPTZ` | `google.protobuf.Timestamp` |
| `TEXT CHECK (col IN (...))` | `enum` with `<TABLE>_<COLUMN>` prefix |

See root [`AGENTS/protobuf.md`](../../../AGENTS/protobuf.md) for the full
SQL→Protobuf mapping rules and the canonical reference shape.
