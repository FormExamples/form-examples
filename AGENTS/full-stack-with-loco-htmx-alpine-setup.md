# full-stack-with-loco-alpine-setup.md

For each form's sql-migrations/ directory, parses CREATE TABLE statements and
emits a script `full-stack-with-loco-alpine-setup` containing:

- Create database user `loco` (if not exists).
- Create application databases for development, test, production (if not exists).
- Create Cargo Loco commands to generate scaffolds.

Tables are scaffolded in the same order as the form's sql-migrations/ 
so that FK targets already exist when referencing tables are created.

Loco field-type syntax:

- Types: string, text, int, bigint, float, double, bool, date, ts, uuid,
  json, jsonb, blob, references, references:<col>
- Suffix `!` marks NOT NULL, suffix `^` marks UNIQUE, no suffix means nullable.
- `id`, `created_at`, `updated_at` are added automatically by Loco and are
  therefore skipped here.

Script starts with this template:

```sh
#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco [form-name-snake-case]_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco [form-name-snake-case]_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco [form-name-snake-case]_production || :
loco new --name [form-name-kebab-case] --db postgres --bg async --assets serverside
```

Example for form name pre-operative-assessment-by-clinician:

```sh
#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco pre_operative_assessment_by_clinician_production || :
loco new --name pre-operative-assessment-by-clinician --db postgres --bg async --assets serverside
```

## cargo loco generate scaffold

Example:

```sh
cargo loco generate scaffold post title:text author:references
```

Rust web framework.

The generate subcommand scaffolds code and boilerplate using predefined templates, so you can skip writing infrastructure by hand.

The generate command performs "code generation creates a set of files and code templates based on a predefined set of rules."

You run it from inside a Loco project via cargo loco generate <COMPONENT> [args] (or the short form cargo loco g).

Subcommands

Command:

- cargo loco generate scaffold — generates a full CRUD resource (model + migration + controller + tests) in one shot.

Example:

- `cargo loco generate scaffold <name> [field:type ...] --htmx`

Field suffixes: ! marks a field as required (NOT NULL), ^ marks it unique; no suffix means nullable. created_at and updated_at timestamps are added automatically. Loco

Naming patterns are meaningful:

- AddNameAndAgeToUsers (the Users part becomes the table name)
- AddUserRefToPosts for references
- CreateJoinTable___And___ for join tables between two tables. Loco 
  
You can also use cargo loco db down to rollback.

Common types accepted in the field:type arguments:

- string
- text
- int
- int!
- bigint
- float
- double
- bool
- date
- ts (timestamp)
- uuid
- json
- jsonb
- blob
- references (relational type with default FK column name)
- references:<column_name> (relational type with custom FK column name)
