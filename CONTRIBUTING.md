# Contributing

This is a spec-driven monorepo of 355 medical / administrative forms. Each form
carries a full stack — SQL schema, generated representations (XML, FHIR R5,
Protocol Buffers, OpenAPI), two front-ends (HTML and SvelteKit), and a Rust
back-end (axum + Loco). The uniformity is the point: one shared design proven
across many clinical domains. Contributions must preserve that uniformity.

## Ways to contribute

Not all of them are code, and the non-code ones are genuinely useful to a
project with one maintainer.

- **Report a defect.** A wrong threshold, a mis-implemented score, a schema that
  disagrees with the form it models, a broken wizard step: open an issue. A form
  slug and a reproduction are enough. Clinical-correctness reports are the most
  valuable kind, because the machine gates cannot catch them.
- **Report a vulnerability.** Privately, and not as an issue — read
  [`SECURITY.md`](SECURITY.md) first.
- **Improve a form's clinical documentation.** Each form has a `doc/` citing the
  instrument it implements. Better citations, corrected references, and notes on
  licensing terms of an instrument are all welcome.
- **Add or fix a form.** The workflow is below.
- **Improve the toolchain.** A generator, a drift detector, a test gate. See
  [`BENCHMARKS.md`](BENCHMARKS.md) for what the gates currently cost to run.
- **Translate.** The i18n groundwork is in [`docs/i18n.md`](docs/i18n.md).
- **Review a pull request.** Sustained, useful review is the main route to
  becoming a maintainer; [`GOVERNANCE.md`](GOVERNANCE.md) describes it.
- **Donate money.** [GitHub Sponsors](https://github.com/sponsors/joelparkerhenderson)
  is the funding channel, and it is a personal sponsorship of the sole
  maintainer, not of an organization — there still isn't a legal entity behind
  this project (see [`MAINTAINERS.md`](MAINTAINERS.md)), and sponsoring changes
  nothing about that. If you'd rather fund something else in this space, fund
  the publishers of the clinical instruments, or the open-source projects in
  [`COMPARISONS.md`](COMPARISONS.md) that have their own funding routes.

Everyone taking part is covered by the
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Contributions are accepted under the
repository's licence, [`LICENSE.md`](LICENSE.md) (CC BY-NC-SA 4.0). If you use
AI tooling on a contribution, disclose it in the pull-request description —
which tool, and what it did — and carry a `Co-Authored-By:` trailer naming
the tool on any commit it touched (see Commit conventions below); the rule
and the reasoning are in [`AI_STATEMENT.md`](AI_STATEMENT.md) §10. Note for
context: Claude Code also carries a standing, maintainer-granted authority
to decide a candidate commit is release-ready and carry out the release
itself, and to publish a fleet crate to crates.io — see
[`GOVERNANCE.md`](GOVERNANCE.md)'s Releases and Publishing crates sections.
Neither authority extends to merging a pull request, which stays the
maintainer's alone.

Read [`spec.md`](spec.md) (the system spec) and the relevant per-stack agent
doc under [`AGENTS/`](AGENTS) and [`forms/`](forms) before changing code.

## Environment

- **Python 3.12+** — the generators (`bin/*.py`).
- **PostgreSQL 18** — the SQL apply gate and Loco back-end tests.
- **Node 26+** and **pnpm** — the SvelteKit front-ends and the E2E harness.
- **Rust (stable; most crates are edition 2021, a few 2024)** with the
  `x86_64-unknown-linux-musl` target and `clippy` — the Loco back-ends.
- **xmllint** (`libxml2-utils`) — XML/DTD validation.
- **Java 21** — the HL7 FHIR validator (CI only).

### Rust build performance (355 crates)

Each `forms/<slug>/back-end-with-loco/` is its own self-contained workspace
(there is no repo-root `Cargo.toml` uniting them), so a plain `cargo build`
gives every one of the 355 crates its own `target/` directory — tens of GB
in aggregate, with the same dependency versions (loco-rs, sea-orm, tokio, …)
compiled from scratch 355 times over. Two independent fixes, both safe to
set globally in `~/.cargo/config.toml`:

- **A shared `CARGO_TARGET_DIR`** — point every crate's build output at one
  directory (`export CARGO_TARGET_DIR=~/.cargo-target-shared`, or the
  equivalent `[build]` `target-dir` key in `~/.cargo/config.toml`) so
  identical dependency versions across crates are compiled once and reused,
  not duplicated per crate.
- **`sccache`** as the compiler wrapper, caching individual compiler
  invocations across builds (including across unrelated crates, and across
  clean rebuilds). See [`docs/rust/index.md`](docs/rust/index.md) for setup
  and sizing the cache.

CI gets the same effect per-job via `Swatinem/rust-cache@v2`, scoped to each
sharded job rather than shared across the whole matrix.

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
`protobuf/`, `openapi/`, `back-end-with-loco-setup`, `back-end-with-loco/deny.toml`,
`llms.txt`, `examples/assessment.json`, and `examples/fhir-bundle.json` are all
generated. After a schema change, regenerate:

```sh
python3 bin/generate-forms-tsv.py
python3 bin/generate-tools-doc.py
python3 bin/sql/generate-sql-combined.py
python3 bin/xml-representations/generate-xml-representations.py
python3 bin/fhir-r5/generate-fhir-r5-representations.py
python3 bin/protobuf/generate-protobuf-representations.py
python3 bin/openapi/generate-openapi-representations.py
python3 bin/back-end-with-loco/generate-back-end-with-loco-setup.py
python3 bin/generate-loco-deny-config.py
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
bin/test-tutorials                     # docs/tutorials/ reference only existing tools/paths
bin/test-engines                       # HTML scoring engines load and run headless
bin/test-loco-routes                   # every Loco crate exposes its domain HTTP API
bin/test-vendored-uniformity           # vendored themes + helpers uniform fleet-wide
bin/test-personas                      # personas.json vs each form's actual scoring engine
bin/test-tools                         # every generator/Lily --check gate
bin/lily-html-refactor --check --all   # Lily HTML class contract
bin/lily-svelte-refactor --check --all # Lily Svelte class contract
bin/lily-sync --check                  # Lily HTML snapshot
bin/lily-svelte-sync --check           # Lily Svelte snapshot
bin/back-end-with-loco/generate-loco-agents.py --list-stale # back-end AGENTS.md staleness
bin/loco-config-refactor --check --all # Loco queue + observability conventions
bin/loco-forbid-unsafe --check --all   # #![forbid(unsafe_code)] in every crate root
bin/loco-seed-base-rename --check --all      # seed() unused-base-param drift
bin/loco-test-auth-header-fix --check --all  # test auth_header() redundant-& drift
bin/generate-loco-deny-config.py --check # Loco deny.toml drift
bin/node-current-version-set --check   # spec/node-current-version/ drift
bin/test-e2e --html                    # Playwright smoke + axe-core a11y (HTML)
```

Per crate, `cargo deny --all-features check` (run in CI as part of the
sharded Rust job) verifies the supply-chain policy: licenses, security
advisories, banned crates, and trusted sources.

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
- A commit an AI tool touched carries two trailers naming it — distinct
  purposes, both kept:

  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_...
  ```

  `Co-Authored-By:` is the standard git/GitHub attribution trailer — GitHub
  renders it as a co-author on the commit. `Claude-Session:` is not a
  standard git trailer; it links to the session transcript, so a reader can
  follow the actual work rather than take the trailer's word for it — that's
  provenance, a different job from attribution. Neither changes git's
  `Author:`/`Committer:` fields, which stay the human's; each is a second,
  additional line on the commit, not a claim about who ran `git commit`. Per
  [`AI_STATEMENT.md`](AI_STATEMENT.md) §10, both are alongside the
  PR-description disclosure, not instead of it.
