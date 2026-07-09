# Meeting — TypeSpec API Definitions

Planned TypeSpec API surface for the meeting form. TypeSpec
(<https://typespec.io>) emits OpenAPI 3, JSON Schema, and protobuf from
a single source, and is the intended canonical description of the HTTP
service that fronts the Rust backend.

The surface covers CRUD on each top-level entity — `meeting`,
`participant`, `agenda_item`, `resource`, `action_item`, `meeting_output`,
`meeting_outcome`, `recurring_rule` — plus a `validate` action that
runs the shared validation engine against a candidate meeting and
returns the fired rules and flags. The schema is derived from
`../sql/`; once the generator script is in place the files
in this directory become generated artefacts.

This directory is scaffolding only — there is no generator yet, so the
files will be written manually until
`bin/typespec/generate-typespec-representations.py` lands. See the
sibling [`AGENTS.md`](./AGENTS.md) for agent instructions.
