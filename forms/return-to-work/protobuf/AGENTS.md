# Return to Work — Protocol Buffers Agent Instructions

Generated Protocol Buffers `.proto` schemas for the Return to Work
form. See [`index.md`](./index.md) for the file map.

## Authoring rules

- **Do not hand-edit generated files.** Edit
  `../sql-migrations/*.sql` and re-run the generator.
- `syntax = "proto3";`
- Package `formexamples.return_to_work.v1`.
- Field names are snake_case.
- Enum default sentinel is `*_UNSPECIFIED = 0`.
- Use `google.protobuf.Timestamp` for SQL TIMESTAMPTZ.

## Verify

```sh
bin/protobuf/generate-protobuf-representations.py return-to-work
protoc --proto_path=. --descriptor_set_out=/dev/null *.proto
```
