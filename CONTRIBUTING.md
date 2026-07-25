# Contributing

This is a spec-driven monorepo of 347 medical / administrative forms. Each form
carries a full stack — SQL schema, generated representations (XML, FHIR R5,
Protocol Buffers, OpenAPI), two front-ends (HTML and SvelteKit), and a Rust
back-end (axum + Loco). The uniformity is the point: one shared design proven
across many clinical domains. Contributions must preserve that uniformity.

Read [`spec.md`](spec.md) (the system spec) and the relevant per-stack agent
doc under [`AGENTS/`](AGENTS) and [`forms/`](forms) before changing code.

## Environment

- **Python 3.12+** — the generators (`bin/*.py`).
- **PostgreSQL 18** — the SQL apply gate and Loco back-end tests.
- **Node 22+** and **pnpm** — the SvelteKit front-ends and the E2E harness.
- **Rust (stable; most crates are edition 2021, a few 2024)** with the
  `x86_64-unknown-linux-musl` target and `clippy` — the Loco back-ends.
- **xmllint** (`libxml2-utils`) — XML/DTD validation.
- **Java 21** — the HL7 FHIR validator (CI only).

## Golden rule: the spec is the source of truth

The workflow is **spec → code → regenerate → verify**, never the reverse:

1. Change the form's domain spec ([`forms/<slug>/spec/index.md`](forms/AGENTS.md))
   or the system spec ([`spec.md`](spec.md)) first.
2. Change the SQL migrations under `forms/<slug>/sql/` — the SQL schema is the
   **source of truth for the data shape**.
3. Regenerate every derived artefact (see below). Generated files are **never
   hand-edited**.
4. Build/adjust the front-ends and back-end to match.
5. Run the verify gates and update `tasks.md` + the form's `CHANGELOG.md`.

## Generated artefacts — never hand-edit

`forms.tsv`, `docs/tools.md`, each form's `sql/schema.sql`, `xml/`, `fhir/r5/`,
`protobuf/`, `openapi/`, `back-end-with-loco-setup`, `llms.txt`,
`examples/assessment.json`, and `examples/fhir-bundle.json` are all generated.
After a schema change, regenerate:

```sh
python3 bin/generate-forms-tsv.py
python3 bin/generate-tools-doc.py
python3 bin/sql/generate-sql-combined.py
python3 bin/xml-representations/generate-xml-representations.py
python3 bin/fhir-r5/generate-fhir-r5-representations.py
python3 bin/protobuf/generate-protobuf-representations.py
python3 bin/openapi/generate-openapi-representations.py
python3 bin/back-end-with-loco/generate-back-end-with-loco-setup.py
python3 bin/generate-llms-txt.py
python3 bin/generate-changelog-and-examples.py
```

Each generator has a `--check` mode used by CI to fail the build if the
committed output is stale. See [`docs/tools.md`](docs/tools.md) for every tool.

## Verify (run before every PR)

See [`docs/verification.md`](docs/verification.md) for what each gate proves.

```sh
bin/test                               # structure + forms.tsv + example conformance
bin/test-sql-apply                     # apply every form's migrations on a scratch DB
bin/test-examples-conformance          # example fixtures match SQL schema
bin/test-tools                         # every generator/Lily --check gate
bin/lily-html-refactor --check --all   # Lily HTML class contract
bin/lily-svelte-refactor --check --all # Lily Svelte class contract
bin/lily-sync --check                  # Lily HTML snapshot
bin/lily-svelte-sync --check           # Lily Svelte snapshot
bin/loco-config-refactor --check --all # Loco queue + observability conventions
bin/test-e2e --html                    # Playwright smoke + axe-core a11y (HTML)
```

The SQL apply gate and the Loco tests need a Postgres reachable via `PGHOST` /
`PGPORT` / `PGUSER` (default `localhost:5432`, user `loco`). A throwaway local
instance:

```sh
PGDATA=$(mktemp -d)/data; SOCK=$(mktemp -d)
initdb -D "$PGDATA" -U loco --auth=trust
pg_ctl -D "$PGDATA" -o "-p 5433 -k $SOCK -c listen_addresses=''" start
PGHOST="$SOCK" PGPORT=5433 PGUSER=loco bin/test-sql-apply
```

## Adding a new form

```sh
bin/create-form <slug>        # scaffold from etc/skeleton
```

Then follow the standard workflow in the root [`AGENTS.md`](AGENTS.md)
("Standard workflow for a new form"): fill the spec, author SQL, regenerate,
build the front-ends and back-end, and run `bin/test-form <slug>`. There is a
worked walkthrough in [`docs/tutorials/02-new-form.md`](docs/tutorials/02-new-form.md).

## Batching and mechanical rollouts

Cross-cutting changes (a shared Lily fix, a new front-end feature) are designed
once on a reference form (`pre-operative-assessment-by-clinician` for HTML,
`cardiology-request` for Svelte), reviewed, then rolled out mechanically with
`perl -i -pe` sweeps (BSD/macOS `sed` lacks `\b`) and re-verified with the
relevant `--check` gate. When a rollout bounds coverage (top-N, sampling),
say so — never truncate silently.

## Commit conventions

- One logical change per commit; keep generated-output regeneration in the same
  commit as the schema change that caused it.
- Update the affected form's `CHANGELOG.md` (Keep-a-Changelog + SemVer).
- Never commit a red gate. If a gate cannot pass, explain why in the PR.
