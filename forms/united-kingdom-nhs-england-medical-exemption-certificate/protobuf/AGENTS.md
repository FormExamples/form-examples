# UK NHS England Medical Exemption Certificate (FP92A) — Protocol Buffers

Generated artifacts: do not edit by hand. Regenerate via `bin/protobuf/generate-protobuf-representations.py united-kingdom-nhs-england-medical-exemption-certificate`.

See root [`AGENTS/protobuf.md`](../../../AGENTS/protobuf.md) for conventions and the SQL to proto mapping rules.

- `syntax = "proto3"`
- `package fp92a`
- One `.proto` file per SQL table
- SQL `UUID` to proto `string`; `TIMESTAMPTZ` and `DATE` to `string` (ISO 8601); `INTEGER` to `int32`; `NUMERIC` to `double`
- SQL `CHECK` enums become proto `enum` types
