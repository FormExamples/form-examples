# bin/ tools reference

Auto-generated from each tool's source header by `bin/generate-tools-doc.py` — do not hand-edit. Run the generator after adding or re-documenting a tool.

43 tools.

- [`bin/clean`](#clean)
- [`bin/consolidate-front-end-html`](#consolidate-front-end-html)
- [`bin/create-form`](#create-form)
- [`bin/fill-full-stack-stubs.py`](#fill-full-stack-stubspy)
- [`bin/forms-as-kebab-case`](#forms-as-kebab-case)
- [`bin/forms-as-pascal-case`](#forms-as-pascal-case)
- [`bin/forms-as-snake-case`](#forms-as-snake-case)
- [`bin/forms-as-tsv`](#forms-as-tsv)
- [`bin/forms-shard`](#forms-shard)
- [`bin/generate-changelog-and-examples.py`](#generate-changelog-and-examplespy)
- [`bin/generate-forms-tsv.py`](#generate-forms-tsvpy)
- [`bin/generate-llms-txt.py`](#generate-llms-txtpy)
- [`bin/generate-spec.py`](#generate-specpy)
- [`bin/generate-tools-doc.py`](#generate-tools-docpy)
- [`bin/lily-html-refactor`](#lily-html-refactor)
- [`bin/lily-svelte-refactor`](#lily-svelte-refactor)
- [`bin/lily-svelte-status`](#lily-svelte-status)
- [`bin/lily-svelte-sync`](#lily-svelte-sync)
- [`bin/lily-sync`](#lily-sync)
- [`bin/loco-config-refactor`](#loco-config-refactor)
- [`bin/migrate-sql-filenames.py`](#migrate-sql-filenamespy)
- [`bin/normalize`](#normalize)
- [`bin/route-loco-layout`](#route-loco-layout)
- [`bin/route-svelte-layout`](#route-svelte-layout)
- [`bin/sync-from-skel-to-forms`](#sync-from-skel-to-forms)
- [`bin/test`](#test)
- [`bin/test-e2e`](#test-e2e)
- [`bin/test-engines`](#test-engines)
- [`bin/test-examples-conformance`](#test-examples-conformance)
- [`bin/test-form`](#test-form)
- [`bin/test-loco-project`](#test-loco-project)
- [`bin/test-personas`](#test-personas)
- [`bin/test-sql-apply`](#test-sql-apply)
- [`bin/test-tools`](#test-tools)
- [`bin/test-tutorials`](#test-tutorials)
- [`bin/update`](#update)
- [`bin/update-group-b-plans.py`](#update-group-b-planspy)
- [`bin/protobuf/generate-protobuf-representations.py`](#protobufgenerate-protobuf-representationspy)
- [`bin/openapi/generate-openapi-representations.py`](#openapigenerate-openapi-representationspy)
- [`bin/back-end-with-loco/generate-back-end-with-loco-setup.py`](#back-end-with-locogenerate-back-end-with-loco-setuppy)
- [`bin/back-end-with-loco/generate-rust-docs.py`](#back-end-with-locogenerate-rust-docspy)
- [`bin/sql/generate-sql-combined.py`](#sqlgenerate-sql-combinedpy)
- [`bin/sql/generate-sql-comments.py`](#sqlgenerate-sql-commentspy)

<h2 id="clean"><code>bin/clean</code></h2>

_No header documentation._

<h2 id="consolidate-front-end-html"><code>bin/consolidate-front-end-html</code></h2>

```text
consolidate-html <slug> : merge legacy split HTML front-ends
   front-end-form-with-html/ + front-end-dashboard-with-html/
 into the canonical consolidated front-end-with-html/ layout.

 Deterministic and git-aware (uses git mv). Refuses to run unless the two
 legacy dirs exist and the canonical dir does not.
```

<h2 id="create-form"><code>bin/create-form</code></h2>

_No header documentation._

<h2 id="fill-full-stack-stubspy"><code>bin/fill-full-stack-stubs.py</code></h2>

```text
Fill stub back-end-with-loco/ AGENTS.md, plan.md, index.md files across all
forms.

Replaces files that contain the placeholder phrase "Not yet implemented." with
templated content describing the planned Rust JSON API back-end. Each form's
root index.md is read to extract the form's title and one-line description.
```

<h2 id="forms-as-kebab-case"><code>bin/forms-as-kebab-case</code></h2>

_No header documentation._

<h2 id="forms-as-pascal-case"><code>bin/forms-as-pascal-case</code></h2>

_No header documentation._

<h2 id="forms-as-snake-case"><code>bin/forms-as-snake-case</code></h2>

_No header documentation._

<h2 id="forms-as-tsv"><code>bin/forms-as-tsv</code></h2>

_No header documentation._

<h2 id="forms-shard"><code>bin/forms-shard</code></h2>

```text
bin/forms-shard <index> <total> — print the form slugs assigned to one
 shard of a deterministic split of all forms into <total> groups.

 Slugs come from bin/forms-as-kebab-case (sorted). Form N (0-based) goes to
 shard (N mod total). Used by CI matrix jobs to parallelize per-form work
 (cargo, npm) across runners.

   bin/forms-shard 0 8      # first of eight shards

 <index> is 0-based and must satisfy 0 <= index < total.
```

<h2 id="generate-changelog-and-examplespy"><code>bin/generate-changelog-and-examples.py</code></h2>

```text
bin/generate-changelog-and-examples.py — Scaffold CHANGELOG.md and examples/.

For every form under forms/ this script ensures:

- forms/<slug>/CHANGELOG.md (Keep-a-Changelog 1.1.0 stub, semver policy)
- forms/<slug>/examples/AGENTS.md, CLAUDE.md, index.md, README.md (skeleton)
- forms/<slug>/examples/assessment.json (a filled-form JSON fixture derived from
  sql/ — type-defaulted, CHECK-constraint aware)
- forms/<slug>/examples/fhir-bundle.json (a FHIR R5 Bundle of type=document
  composed by wrapping every resource under forms/<slug>/fhir/r5/*.json)

Idempotent. Re-running with no upstream schema change is a no-op (same bytes).
The CHANGELOG.md is never overwritten if it already exists with non-default
content (we only write the stub the first time).

Usage:
  bin/generate-changelog-and-examples.py                 # all forms
  bin/generate-changelog-and-examples.py <slug> [...]    # only named forms
  bin/generate-changelog-and-examples.py --check         # exit nonzero on drift
```

<h2 id="generate-forms-tsvpy"><code>bin/generate-forms-tsv.py</code></h2>

```text
bin/generate-forms-tsv.py — Generate forms.tsv from the forms/ directory.

forms.tsv is the case-conversion lookup table read by bin/forms-as-kebab-case,
bin/forms-as-snake-case, and bin/forms-as-pascal-case (hence by bin/test and
every tool that iterates the form slugs). Each row is three tab-separated
columns derived mechanically from a form's directory name:

    <kebab-case>        <snake_case>    <PascalCase>

Rows are the sorted list of immediate sub-directories of forms/ that are real
form projects (they contain an index.md), excluding shared support dirs such
as lily-spec/, lily-svelte-spec/, doc/, and fhir/.

Generated artefact: do not hand-edit. Idempotent — re-running with no upstream
change is a no-op (same bytes).

Usage:
  bin/generate-forms-tsv.py          # rewrite forms.tsv to match forms/
  bin/generate-forms-tsv.py --check  # exit non-zero if forms.tsv is stale
```

<h2 id="generate-llms-txtpy"><code>bin/generate-llms-txt.py</code></h2>

```text
bin/generate-llms-txt.py — Generate forms/<slug>/llms.txt per form.

Writes each form's llms.txt in the llmstxt.org format: an H1 title, a
one-paragraph blockquote summary (both drawn from the form's index.md),
and a Docs section linking the form's key artefacts. The file gives LLM
agents a compact, curated entry point into the form directory.

Generated artefact: do not hand-edit. Idempotent — re-running with no
upstream change is a no-op (same bytes).

Usage:
  bin/generate-llms-txt.py            # generate for every form
  bin/generate-llms-txt.py <slug> ... # generate only the named forms
  bin/generate-llms-txt.py --check    # exit non-zero if any llms.txt would change
```

<h2 id="generate-specpy"><code>bin/generate-spec.py</code></h2>

```text
bin/generate-spec.py — Scaffold forms/<slug>/spec/index.md per form.

For every directory under forms/ that contains an index.md, ensure a
spec/ directory exists holding index.md (the living domain spec) plus a
README.md symlink — the form-level counterpart to the top-level system
spec. (Older forms used a single `spec.md` file; the gold standard is
now the `spec/` directory.)

The per-form spec is a HAND-MAINTAINED living document: it is the
source of truth for behaviour, updated before code changes
(spec-driven development). This tool therefore only SCAFFOLDS:

- default: write spec/index.md only where it is missing or empty
  (seeded from index.md), and repair a missing README.md symlink;
- --force: deliberately regenerate the named forms' spec/index.md
  from the template, overwriting hand edits (requires explicit slugs);
- --check: exit non-zero if any form lacks a non-empty spec/index.md
  or its README.md symlink. Hand-edited content is never "drift".

Usage:
  bin/generate-spec.py                    # scaffold all missing specs
  bin/generate-spec.py <slug> ...         # scaffold only the named forms
  bin/generate-spec.py --force <slug> ... # regenerate named forms (overwrite)
  bin/generate-spec.py --check            # structural check, no writes
```

<h2 id="generate-tools-docpy"><code>bin/generate-tools-doc.py</code></h2>

```text
bin/generate-tools-doc.py — Generate docs/tools.md from bin/ tool headers.

Every tool in bin/ documents itself in a leading header: a module docstring
(Python) or a run of `#` comment lines (shell). This script harvests that
header — WITHOUT executing the tool, since some tools have side effects — and
renders a single reference page, docs/tools.md.

Generated artefact: do not hand-edit. Idempotent.

Usage:
  bin/generate-tools-doc.py          # write docs/tools.md
  bin/generate-tools-doc.py --check  # exit non-zero if docs/tools.md is stale
```

<h2 id="lily-html-refactor"><code>bin/lily-html-refactor</code></h2>

```text
bin/lily-html-refactor — mechanically refactor a form's
`front-end-form-with-html/` and/or `front-end-dashboard-with-html/`
to the Lily Design System HTML headless class contract.

Scope: HTML and JS class swaps only. CSS rewrites and semantic
restructuring (sectionCard → fieldset, radio-group restructure,
new step-list/validation wiring) are out of scope — the tool
reports those locations so a subagent pass can handle them.

See forms/AGENTS-front-end-html.md for the class contract and
forms/plan.md §7 Phase 2 for the rationale.

Usage:
  bin/lily-html-refactor <slug>            # one form
  bin/lily-html-refactor --all             # all forms in forms/
  bin/lily-html-refactor --dry-run <slug>  # show what would change
  bin/lily-html-refactor --check --all     # CI drift check (non-zero on drift)
  bin/lily-html-refactor --scope=form <slug>
  bin/lily-html-refactor --scope=dashboard <slug>

The tool is idempotent: re-running on an already-refactored form
makes no further changes.

--check implies --dry-run and exits non-zero if any safe swaps would
be applied. Risky lines (structural patterns the tool won't auto-fix)
are reported but do not fail --check, since they require subagent
attention rather than mechanical correction.
```

<h2 id="lily-svelte-refactor"><code>bin/lily-svelte-refactor</code></h2>

```text
bin/lily-svelte-refactor — mechanically refactor a form's
`front-end-form-with-svelte/` and/or `front-end-dashboard-with-svelte/`
toward the Lily Design System Svelte headless contract.

Scope: safe class-attribute swaps inside Svelte template / TypeScript /
TSX-like fragments AND a risky-pattern report listing old-style
components, imports, and markup that require a subagent rewrite (the
structural rewrite is too varied to mechanise — see Phase 5.4 pilot
commit for the canonical shape).

See forms/AGENTS-front-end-svelte.md for the class contract, the
component vocabulary, and the prop conventions; forms/plan.md §7
Phase 5 for the rationale.

Usage:
  bin/lily-svelte-refactor <slug>            # one form
  bin/lily-svelte-refactor --all             # all forms in forms/
  bin/lily-svelte-refactor --dry-run <slug>  # show what would change
  bin/lily-svelte-refactor --check --all     # CI drift check (non-zero on drift)
  bin/lily-svelte-refactor --scope=form <slug>
  bin/lily-svelte-refactor --scope=dashboard <slug>

The tool is idempotent: re-running on an already-refactored form makes
no further changes.
```

<h2 id="lily-svelte-status"><code>bin/lily-svelte-status</code></h2>

```text
bin/lily-svelte-status — Report each form's Lily Svelte conformance level.

Inspects every `forms/<slug>/front-end-with-svelte/` and emits a
status line:

  PASS    — canonical Lily UI components present (Form, Fieldset, Field,
            Button, ErrorSummary, Panel, Progress) AND no legacy
            SectionCard/SelectInput/TextArea/ProgressBar/StepNavigation.
  PARTIAL — emits Lily classes but retains legacy component filenames.
  EMPTY   — no real implementation (no src/lib/components/steps/ or
            placeholder +page.svelte only).
  TODO    — has implementation, no Lily conversion yet.

Usage:
  bin/lily-svelte-status                # full report
  bin/lily-svelte-status --counts       # just the totals
  bin/lily-svelte-status --slugs-only   # one slug per line, filterable by --status=<value>
  bin/lily-svelte-status --status=TODO  # only forms needing work
```

<h2 id="lily-svelte-sync"><code>bin/lily-svelte-sync</code></h2>

```text
bin/lily-svelte-sync — Snapshot Lily Svelte headless component specs into this repo.

Walks the Lily Svelte checkout at
~/git/lilydesignsystem/lily-design-system/lily-design-system-svelte-headless/components/
and copies each component's source files into forms/lily-svelte-spec/, then
records the pinned upstream commit hash and today's date in
forms/lily-svelte-version.md.

Lily Svelte is consumed as a *contract* at authoring time. There is no
runtime dependency on the upstream package — each form's local
`src/lib/components/ui/` mirrors the Lily API. See
forms/AGENTS-front-end-svelte.md §2 for context.

Per component, the following files are snapshotted:

  <Name>.svelte
  <Name>.stories.svelte   (if present)
  <Name>.test.ts          (if present)
  index.md                (if present, copied as <Name>.md)

Usage:
  bin/lily-svelte-sync                 # snapshot from default checkout
  bin/lily-svelte-sync --lily-dir PATH # alternate checkout
  bin/lily-svelte-sync --check         # verify snapshot matches upstream (no writes)

Idempotent: re-running with no upstream change is a no-op.
```

<h2 id="lily-sync"><code>bin/lily-sync</code></h2>

```text
bin/lily-sync — Snapshot Lily HTML headless component specs into this repo.

Reads HTML component files from the Lily checkout at
~/git/lilydesignsystem/lily-design-system/lily-design-system-html-headless/components/,
copies them into forms/lily-spec/, and records the pinned upstream commit
hash + today's date in forms/lily-version.md.

Lily is consumed as a *spec* at authoring time. There is no runtime
dependency on Lily — this tool is a doc-snapshotting helper so a
contributor can read the class/attribute contract without needing the
external checkout. See forms/AGENTS-front-end-html.md §2 for context.

Usage:
  bin/lily-sync                 # snapshot from default Lily checkout
  bin/lily-sync --lily-dir PATH # use a different Lily checkout location
  bin/lily-sync --check         # verify snapshot matches upstream (no writes)

The tool is idempotent: re-running with no upstream changes is a no-op.
```

<h2 id="loco-config-refactor"><code>bin/loco-config-refactor</code></h2>

```text
bin/loco-config-refactor — mechanically refactor each form's
`back-end-with-loco/` Loco crate to the canonical
background-queue and observability conventions documented in
`AGENTS/back-end-with-loco.md`:

  - Postgres-backed background queue (`bg_pg`)
  - SQLite-backed (`bg_sqlt`) and Redis-backed (`bg_redis`) queues removed
  - OpenTelemetry OTLP exporter dependencies
  - Prometheus `/metrics` dependency (`axum-prometheus`)

Edits per Loco crate (a crate is any dir containing a `Cargo.toml` whose
contents reference `loco-rs`):

  Cargo.toml:
    - Rewrite the `loco-rs = { ... }` declaration to set
      `default-features = false` and an explicit features list that
      includes `bg_pg` and excludes `bg_sqlt` / `bg_redis`.
    - Append OTel + Prometheus deps under `[dependencies]` if missing.

  config/development.yaml, config/test.yaml, config/production.yaml:
    - Set `workers.mode`: BackgroundQueue (development/production) or
      ForegroundBlocking (test, so queued mailer jobs run inline).
    - Insert/replace a `queue:` block with `kind: Postgres`, reusing the
      same Postgres URI as the existing `database.uri` and setting
      `dangerously_flush` and `num_workers` per environment.

The tool is idempotent: re-running on an already-refactored crate
makes no further changes.

Usage:
  bin/loco-config-refactor <slug>              # one form
  bin/loco-config-refactor --all               # every form's Loco crate
  bin/loco-config-refactor --dry-run <slug>    # show what would change
  bin/loco-config-refactor --check --all       # CI drift check (non-zero on drift)
```

<h2 id="migrate-sql-filenamespy"><code>bin/migrate-sql-filenames.py</code></h2>

```text
Full forward migration of every form's sql/ to the canonical
filename convention used by bin/test-form.

Canonical filename layout per form:

    00_create_extensions.sql                        -- CREATE EXTENSION pgcrypto
    01_create_function_set_updated_at.sql    -- trigger function
    02_create_table_patient.sql              -- canonical patient
    03_create_table_clinician.sql            -- canonical clinician
    04_create_table_<slug>.sql               -- per-form main assessment
    05_create_table_grade.sql
    06_create_table_grading_fired_rule.sql
    07_create_table_grading_additional_flag.sql
    (and any additional CREATE TABLE statements renumbered sequentially)

Actions per form:

- Overwrite the four canonical files with corrected content (the existing
  copies distributed across all 114 forms contain known syntax errors:
  the patient file is missing a comma, has a duplicate UPDATE comment, and
  a COMMENT refers to a renamed column; the clinician file has a trailing
  comma before `)` and references a non-existent `clinician_role` in its
  CHECK constraint).
- Delete the legacy `01_patient.sql` (conflicts numerically and
  semantically with the canonical `02_create_table_patient.sql`).
- Rename every remaining legacy `NN_<name>.sql` file that has a
  `CREATE TABLE` inside to `MM_create_table_<table>.sql`, where MM is
  sequential starting at 04, preserving the file order.
- Add the `.sql` extension to any `NN_create_table_*` files that are
  missing it.
- If `04_main.sql` exists (a consolidated copy of an older schema-flat.sql
  containing duplicated patient + assessment + grading blocks), split it
  on its `-- === <filename> === --` section markers, keep only the
  assessment + assessment_<section> blocks as individual per-table files,
  and discard the duplicated extensions / patient / grading blocks. Then
  delete `04_main.sql` and continue with the normal rename pass.

Idempotent. Safe to re-run.
```

<h2 id="normalize"><code>bin/normalize</code></h2>

_No header documentation._

<h2 id="route-loco-layout"><code>bin/route-loco-layout</code></h2>

```text
route-loco-layout <slug> : move a form's Loco crate source into the
 route layout  back-end-with-loco/src/<form_snake_case>/*.rs
   - flat   (src/*.rs)            -> src/<snake>/*.rs
   - nested (<snake>/src/*.rs +   -> src/<snake>/*.rs, crate files hoisted
             top-level symlinks)     to back-end-with-loco/
 Idempotent: skips if src/<snake>/lib.rs already exists.
```

<h2 id="route-svelte-layout"><code>bin/route-svelte-layout</code></h2>

```text
route-svelte-layout <slug> : nest a form's SvelteKit routes under
 front-end-with-svelte/src/routes/<form-kebab-case>/  and prefix internal
 absolute route links (href / goto / redirect, plus the "/" home link) with
 /<slug>. /api/ fetch paths are left untouched. Idempotent (skips if routed).
```

<h2 id="sync-from-skel-to-forms"><code>bin/sync-from-skel-to-forms</code></h2>

_No header documentation._

<h2 id="test"><code>bin/test</code></h2>

```text
https://github.com/sixarm/unix-shell-script-kit
```

<h2 id="test-e2e"><code>bin/test-e2e</code></h2>

```text
bin/test-e2e — run the Playwright smoke + accessibility sweep over form
 front-ends. The HTML harness drives every form's single-page wizard from a
 static server; the Svelte harness builds and previews each app, then checks
 its welcome route.

 Usage:
   bin/test-e2e [--html] [--svelte] [--all | <slug> ...]

   --html      run the HTML front-end sweep (default if neither flag given)
   --svelte    run the SvelteKit front-end sweep (build + preview per form)
   --all       every form (default when no slugs are listed)
   <slug> ...  restrict to the named forms

 Requires e2e/ deps installed (cd e2e && npm ci) and browsers
 (cd e2e && npx playwright install chromium).
```

<h2 id="test-engines"><code>bin/test-engines</code></h2>

_No header documentation._

<h2 id="test-examples-conformance"><code>bin/test-examples-conformance</code></h2>

```text
bin/test-examples-conformance — check example fixtures against SQL schema.

Each form's examples/assessment.json is an entity-keyed, camelCase filled-form
fixture. Its shape must track the form's sql/ migrations (the source of truth):
every top-level key must name a real table, and every property must name a real
column of that table. This gate catches fixtures that drift after a schema
change — a renamed column, a dropped table, a typo'd property.

Name matching is separator-insensitive: a JSON key and a SQL identifier match
when they are equal after lowercasing and removing underscores. This tolerates
the ambiguous digit boundaries in legacy identifiers (countryAsIso31661Alpha2
<-> country_as_iso_3166_1_alpha_2) without a brittle camel<->snake round-trip.

A light type check also flags a numeric column holding a boolean value, or a
boolean column holding a number — hard mismatches that indicate real drift.

Usage:
  bin/test-examples-conformance            # every form
  bin/test-examples-conformance <slug> ... # only the named forms

Exit status is non-zero if any fixture does not conform, with one line per
problem.
```

<h2 id="test-form"><code>bin/test-form</code></h2>

```text
test-form: test one form directory in this project for implementation

 Syntax:

     test-form <form-name-slug>

 Example:

     test-form pre-operative-assessment-by-clinician

 Structural checks print "Error: ..." lines and the script exits non-zero
 if any check failed. The Loco crate's `cargo test` is the only executable
 gate (it needs the Rust toolchain and a running Postgres).
```

<h2 id="test-loco-project"><code>bin/test-loco-project</code></h2>

```text
https://github.com/sixarm/unix-shell-script-kit
```

<h2 id="test-personas"><code>bin/test-personas</code></h2>

_No header documentation._

<h2 id="test-sql-apply"><code>bin/test-sql-apply</code></h2>

```text
test-sql-apply: apply each form's numbered SQL migrations, in filename
 order, to a fresh scratch PostgreSQL database. This is the gate that
 proves the sql/ directory is a working migration set (no missing
 extensions, no child-before-parent ordering, no duplicate CREATEs, no
 syntax errors) — not just files that look right.

 Syntax:

     test-sql-apply              # gate every form
     test-sql-apply <slug> ...   # gate only the named forms

 Environment:

     PGHOST (default localhost), PGPORT (default 5432),
     PGUSER (default loco) — connection for createdb/dropdb/psql.

 Exit status is non-zero if any form fails, with one line per failure
 naming the first file that errored and the first error line.
```

<h2 id="test-tools"><code>bin/test-tools</code></h2>

```text
bin/test-tools — exercise every Lily-system tool's --check / --counts /
 --help modes and confirm contract drift is zero across the corpus.

 A green run means:
   • every per-form Lily HTML conforms to the class contract,
   • every per-form Lily Svelte conforms to the canonical UI shape,
   • the Lily HTML + Svelte upstream snapshots match what is pinned,
   • every form has an up-to-date spec.md,
   • the conformance tracker reports 0 PARTIAL and 0 TODO.

 Usage: bin/test-tools

 Exits non-zero on first failing check.
```

<h2 id="test-tutorials"><code>bin/test-tutorials</code></h2>

```text
bin/test-tutorials — honest, fast doc-rot check for docs/tutorials/.

 What it does
 ------------
 For every `docs/tutorials/*.md` file it:
   1. extracts the fenced ```sh code blocks (only ```sh, not ```ts/```json/…);
   2. scans each line for `bin/...` and `forms/...` path tokens;
   3. asserts each referenced path is real:
        • bin/<tool>            — must exist; if it has no filename extension
                                  (a directly-invoked shell tool such as
                                  bin/create-form) it must also be executable.
                                  Scripts with an extension (bin/foo.py) are
                                  invoked via an interpreter (python3 foo.py),
                                  so only existence is required.
        • forms/<slug>/...      — must exist, UNLESS it is a disposable example
                                  the tutorial itself creates then deletes
                                  (any path matching forms/example-*), which is
                                  skipped.

 What it does NOT do
 -------------------
 It starts no servers, runs no builds, and executes none of the tutorial
 commands. It is a static reference check: it catches a tutorial pointing at a
 tool or form path that has been renamed or removed (doc rot). It is fast and
 deterministic.

 Usage: bin/test-tutorials
 Exit status: 0 if every referenced path resolves, 1 otherwise.
```

<h2 id="update"><code>bin/update</code></h2>

_No header documentation._

<h2 id="update-group-b-planspy"><code>bin/update-group-b-plans.py</code></h2>

```text
Update plan.md for the 11 Group B forms whose front-end-form-with-svelte
was just implemented. Replace stub status with accurate "implemented"
status for the SvelteKit patient form, and note the dashboard + Rust
backend remaining.
```

<h2 id="protobufgenerate-protobuf-representationspy"><code>bin/protobuf/generate-protobuf-representations.py</code></h2>

```text
Generate Protocol Buffers (.proto) representations from SQL migrations.

For each form's sql/ directory, parses CREATE TABLE statements
and writes one .proto file per top-level SQL entity into protobuf/.

Conventions documented in AGENTS/protobuf.md:
  - syntax = "proto3";
  - package form_examples.<form_slug_in_snake_case>;
  - PascalCase message name per table, snake_case fields, sequential field
    numbers starting at 1.
  - assessment_<section> child tables fold into the assessment.proto
    message (mirrors the FHIR R5 and XML generators).
  - SQL CHECK (... IN (...)) constraints become proto enums with a
    leading _UNSPECIFIED = 0 value.
```

<h2 id="openapigenerate-openapi-representationspy"><code>bin/openapi/generate-openapi-representations.py</code></h2>

```text
Generate OpenAPI 3.1 (.yaml) representations from SQL migrations.

For each form's sql/ directory, parses CREATE TABLE statements
plus COMMENT ON TABLE / COMMENT ON COLUMN, and writes one .yaml file per
top-level SQL entity into openapi/.

Conventions documented in AGENTS/openapi.md:
  - One .yaml per top-level table; assessment_<section> children fold
    into a single assessment.yaml (mirrors FHIR R5, XML, protobuf).
  - openapi: 3.1.0
  - info.title = "<Form Slug Titlecased> — <Resource>"
  - info.description = COMMENT ON TABLE (or the table name if absent)
  - Five operations per resource: GET list, POST create, GET by-id,
    PATCH update, DELETE.
  - Property descriptions sourced from COMMENT ON COLUMN.
  - required = NOT NULL columns except id.
  - CHECK (... IN (...)) constraints become string enums.
```

<h2 id="back-end-with-locogenerate-back-end-with-loco-setuppy"><code>bin/back-end-with-loco/generate-back-end-with-loco-setup.py</code></h2>

```text
Generate setup script for subprojects from SQL migration files.

For each form's sql/ directory, parses CREATE TABLE statements and
emits a `setup.sh` script containing:

- Create application databases for development, test, production (if not exists).
- Create Cargo Loco commands to generate scaffolds.

Tables are scaffolded in the same order as the form's sql/ 
so that FK targets already exist when referencing tables are created.

Loco field-type syntax:

- Types: string, text, int, bigint, float, double, bool, date, ts, uuid,
  json, jsonb, blob, references, references:<col>
- Suffix `!` marks NOT NULL, suffix `^` marks UNIQUE, no suffix means nullable.
- `id`, `created_at`, `updated_at` are added automatically by Loco and are
  therefore skipped here.
```

<h2 id="back-end-with-locogenerate-rust-docspy"><code>bin/back-end-with-loco/generate-rust-docs.py</code></h2>

```text
Insert rustdoc on undocumented `pub` items in the Loco back-end crates.

Idempotent: skips items that already carry a doc comment. Operates line-by-line
with brace/context tracking so struct fields and enum variants are distinguished
from top-level items, and so function bodies are never touched.
```

<h2 id="sqlgenerate-sql-combinedpy"><code>bin/sql/generate-sql-combined.py</code></h2>

```text
Combine each form's numbered SQL migrations into one sql/schema.sql file.

For each form with a `sql/` directory, concatenates every
`NN-*.sql` migration file (in numeric order) into a single `schema.sql`
file at `forms/<slug>/sql/schema.sql`. The combined file is
a convenience rollup of the whole schema suitable for one-shot apply in
development databases, editor inspection, or LLM context windows.

The generator only consumes files whose name begins with a digit; it
ignores `schema.sql` itself so re-running is idempotent.
```

<h2 id="sqlgenerate-sql-commentspy"><code>bin/sql/generate-sql-comments.py</code></h2>

```text
Add missing COMMENT ON TABLE and COMMENT ON COLUMN statements to every
numbered SQL migration file.

For each form's sql/NN-*.sql file, this generator:

- Parses every CREATE TABLE statement and its column definitions.
- Detects existing `COMMENT ON TABLE <name>` and
  `COMMENT ON COLUMN <table>.<column>` entries already present anywhere in
  the same file.
- Appends a `COMMENT ON TABLE` for every table that lacks one, and a
  `COMMENT ON COLUMN` for every column that lacks one, to the end of the
  file.
- Leaves existing comments untouched; re-running is idempotent.

Comment text is produced by a simple heuristic (well-known columns like
`id`, `created_at`, `updated_at`, FK columns, CHECK-constrained enum
columns) with a humanized column name as a fallback. The intent is
correctness-by-presence, not clinical precision; domain experts can later
edit individual comments where the heuristic is too generic.
```
