# Medical Information Form for Air Travel — Protocol Buffers

Protocol Buffers (proto3) schemas, one `.proto` file per SQL table in
`../sql/`. Use for binary wire encoding (gRPC, Kafka, S3 archives)
when the JSON/XML representations are too verbose.

## Files

```
patient.proto
clinician.proto
medical_information_form_for_air_travel.proto
medical_information_form_for_air_travel_grade.proto
medical_information_form_for_air_travel_grade_rule.proto
medical_information_form_for_air_travel_grade_flag.proto
```

## SQL → proto3 type mapping

| SQL | proto3 |
| --- | --- |
| `UUID` | `string` (UUIDv4 canonical text) |
| `TEXT`, `VARCHAR(n)` | `string` |
| `CHAR(2)`, `CHAR(3)`, `CHAR(12)` | `string` |
| `INTEGER` | `int32` |
| `NUMERIC(p,s)` | `double` |
| `DATE` | `string` (ISO 8601 `YYYY-MM-DD`) |
| `TIMESTAMPTZ` | `google.protobuf.Timestamp` |
| `BOOLEAN` (none used; yes/no enums are `string`) | `bool` |

`CHECK ... IN (...)` enum columns stay as `string` to keep the wire encoding
forward-compatible with new values added in the SQL CHECK constraint.

## Conventions

- `syntax = "proto3";` on every file.
- Package name: `medical_information_form_for_air_travel`.
- Message name: PascalCase of the table name.
- Field name: `snake_case` matching the SQL column name (proto3 idiomatic).
- Field numbers: SQL column order, starting at 1.
- `google.protobuf.Timestamp` import only when the table has a TIMESTAMPTZ
  column (every application table here does).
- Comments above each field cite the source SQL type for round-tripping.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
protoc --proto_path=protobuf --descriptor_set_out=/dev/null protobuf/*.proto
```
