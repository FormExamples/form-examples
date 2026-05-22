# Return to Work — Protocol Buffers

Generated Protocol Buffers `.proto` schemas for the Return to Work
form. Each SQL entity is emitted as one `.proto` file by
`bin/protobuf/generate-protobuf-representations.py`.

## File map (after generation)

| SQL table | `.proto` file | Message |
| --- | --- | --- |
| `patient` | `patient.proto` | `Patient` |
| `clinician` | `clinician.proto` | `Clinician` |
| `employer` | `employer.proto` | `Employer` |
| `return_to_work` | `return_to_work.proto` | `ReturnToWork` |
| `return_to_work_restriction` | `return_to_work_restriction.proto` | `ReturnToWorkRestriction` |
| `return_to_work_grade` | `return_to_work_grade.proto` | `ReturnToWorkGrade` |
| `return_to_work_grade_rule` | `return_to_work_grade_rule.proto` | `ReturnToWorkGradeRule` |
| `return_to_work_grade_flag` | `return_to_work_grade_flag.proto` | `ReturnToWorkGradeFlag` |

## Conventions

- `syntax = "proto3";`
- Package `formexamples.return_to_work.v1`.
- Field names are snake_case (matching SQL).
- Enums are emitted as proto3 `enum` blocks with a default
  `*_UNSPECIFIED = 0` entry, matching the empty-string sentinel
  used in SQL.
- UUID fields are emitted as `string`.
- Timestamps are emitted as `google.protobuf.Timestamp`.
- Decimals (NUMERIC) are emitted as `double` with a comment
  preserving the SQL precision and scale.

## Purpose

Protocol Buffers are provided for high-throughput gRPC integration
between the Rust full-stack backend and any downstream microservice
that processes the *Statement of Fitness for Work* (for example a
batch DVLA-notification helper or an automated employer-OH router).

## Verify

```sh
bin/protobuf/generate-protobuf-representations.py return-to-work
protoc --proto_path=. --descriptor_set_out=/dev/null *.proto
```
