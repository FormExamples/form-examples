# WHO Surgical Safety Checklist — SQL migrations agent instructions

See `./index.md` for the file index, and `../../AGENTS/sql.md` for
the project-wide SQL conventions.

Canonical first four fields of every table:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at TIMESTAMPTZ DEFAULT NULL,
```

`updated_at` is maintained by a `BEFORE UPDATE` trigger that calls
`set_updated_at()` (defined in `01_create_function_set_updated_at.sql`).

After editing migrations, regenerate downstream artefacts:

```sh
python3 bin/xml-representations/generate-xml-representations.py
python3 bin/fhir-r5/generate-fhir-r5-representations.py
python3 bin/protobuf/generate-protobuf-representations.py
```
