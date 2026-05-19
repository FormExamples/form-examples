# protobuf/ — Agent Instructions

Generated Protocol Buffers (`proto3`) per SQL table. Re-run the generator
after any change to `../sql-migrations/`.

```sh
bin/protobuf/generate-protobuf-representations.py united-kingdom-statement-of-fitness-for-work
```

Field names use `snake_case`. Enum values are `UPPER_SNAKE_CASE` with the
column name as the prefix. Timestamps and dates use the standard
`google.protobuf.Timestamp` and `google.type.Date` types.

See [`./index.md`](./index.md) for the file list and conventions.
