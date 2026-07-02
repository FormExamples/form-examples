# Protocol Buffers representations

Protocol Buffers (`.proto`) schemas for each form, **generated** from
`sql/` (the source of truth — see `spec.md` §3.1). One `.proto`
file is produced per top-level SQL table entity, so that a form's data can
be serialised, transmitted, or code-generated into any of the languages the
protobuf compiler supports. Do not hand-edit; re-run the generator after
schema changes.

Slug: protobuf

- Search pattern: `forms/*/sql/*.sql`
- Search pattern: `forms/*/protobuf/*.proto`
- Generator: `bin/protobuf/generate-protobuf-representations.py`

## What is Protocol Buffers?

Protocol Buffers (protobuf) is Google's language-neutral, platform-neutral,
extensible mechanism for serialising structured data — smaller, faster, and
simpler than XML. You define how you want your data to be structured once,
in a `.proto` file, then compile with the protocol buffer compiler
(`protoc`) to generate native code in C++, C#, Dart, Go, Java, Kotlin,
Objective-C, Python, Rust, Ruby, or PHP.

Reference: <https://protobuf.dev/>

## Directory structure

One `.proto` file per top-level SQL entity. The assessment's per-section
sub-tables (`assessment_<section>`) are folded into the single
`assessment.proto` message, mirroring the behaviour of the FHIR R5 and XML
generators — one form has exactly one `assessment.proto`.

```
protobuf/
  patient.proto                    # message Patient
  assessment.proto                 # message Assessment (with nested section fields)
  grade.proto                      # message Grade
  grading_fired_rule.proto         # message GradingFiredRule
  grading_additional_flag.proto    # message GradingAdditionalFlag
  ...                              # one .proto per remaining SQL entity
```

The merged `Assessment` message inlines every column from each
`assessment_<section>` child table at the top level, prefixing section
names on column-name collisions to keep every field unique.

## Conventions

- `syntax = "proto3";` — the most widely-supported syntax across language
  runtimes.
- `package form_examples.<form_slug_in_snake_case>;` — namespaces every
  form's messages.
- One `message` per `.proto` file, named in PascalCase from the SQL table
  name (`patient` → `Patient`, `grading_fired_rule` → `GradingFiredRule`).
- Field names in `snake_case`, matching the source SQL column names.
- Field numbers assigned sequentially starting at `1`, in SQL column order.
- A header comment marking the file as generated:
  `// Generated from sql/. Do not edit by hand.`
- A `// SOURCE: <table_name>` comment recording the originating SQL table.

## SQL → protobuf type mapping

| SQL type                                    | proto3 type | Notes                              |
| ------------------------------------------- | ----------- | ---------------------------------- |
| `UUID`                                      | `string`    | hyphenated lowercase UUIDv4        |
| `TIMESTAMPTZ`, `TIMESTAMP`                  | `string`    | ISO 8601 in UTC                    |
| `DATE`                                      | `string`    | ISO 8601 date (`YYYY-MM-DD`)       |
| `BOOLEAN`                                   | `bool`      |                                    |
| `SMALLINT`, `INTEGER`, `INT`, `SERIAL`      | `int32`     |                                    |
| `BIGINT`, `BIGSERIAL`                       | `int64`     |                                    |
| `NUMERIC(p,s)`, `DECIMAL(p,s)`              | `double`    | precision preserved as a comment   |
| `REAL`                                      | `float`     |                                    |
| `DOUBLE PRECISION`                          | `double`    |                                    |
| `TEXT`, `VARCHAR(n)`, `CHAR(n)`             | `string`    | length recorded as a comment       |
| `JSON`, `JSONB`                             | `string`    | serialised JSON                    |
| `BYTEA`                                     | `bytes`     |                                    |

Columns with `CHECK (... IN (...))` constraints become a proto `enum`
named `<MessageName><FieldName>Enum`, with each `IN` value mapped to an
enum constant. The first enum value is `<NAME>_UNSPECIFIED = 0;`,
required by proto3, representing the unanswered state.

Foreign-key columns (e.g. `patient_id UUID REFERENCES patient(id)`) are
emitted as plain `string` fields (the UUID), not as nested messages. This
keeps each `.proto` file self-contained and avoids import-cycle issues
when consumers code-generate.

## Regenerate

Regenerate all `.proto` files from the current SQL migrations:

```sh
python3 bin/protobuf/generate-protobuf-representations.py
```

## Verify

If `protoc` is installed, validate every `.proto` file in the monorepo:

```sh
for proto in forms/*/protobuf/*.proto; do
  protoc --proto_path="$(dirname "$proto")" \
         --descriptor_set_out=/dev/null "$proto" \
    || echo "FAIL: $proto"
done
```

A lightweight structural check (no protoc required) — every `.proto` file
should declare `syntax = "proto3";` and contain at least one `message`:

```sh
for proto in forms/*/protobuf/*.proto; do
  grep -q 'syntax = "proto3";' "$proto" || echo "missing syntax: $proto"
  grep -q '^message ' "$proto" || echo "missing message: $proto"
done
```

## Generate language bindings

Once `.proto` files exist, generate native bindings with `protoc`:

```sh
# Python
protoc --python_out=./gen --proto_path=forms/<slug>/protobuf forms/<slug>/protobuf/*.proto

# Go
protoc --go_out=./gen --proto_path=forms/<slug>/protobuf forms/<slug>/protobuf/*.proto

# Rust (via prost-build or tonic-build)
# add prost-build = "0.13" to build-dependencies and call it from build.rs
```
