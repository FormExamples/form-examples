---
name: form-examples-maintainer-skill
description: Technical implementation workflow for maintaining and extending the form-examples monorepo — adding or editing a form, regenerating derived artefacts, and running the repo's generators and verify gates. Use when implementing a change to a form's spec, SQL schema, front-end, back-end, or personas, or when running the repo's test/generator/drift-check pipeline.
---

# Form Examples — Maintainer Skill

This is the implementation-facing companion to `form-examples-skill` (the
concepts/terminology skill for end users). It orients a maintainer or agent
doing real work in this repo. The canonical, always-current sources are
[`AGENTS.md`](../AGENTS.md) (full `bin/` tool catalogue and verify-gate list)
and [`CONTRIBUTING.md`](../CONTRIBUTING.md) (environment, ways to contribute,
golden rule) — read those for exact flags and the full picture; this skill is
a condensed map of where things live and how the pieces fit together, not a
replacement for them.

## Golden rule: spec → code → regenerate → verify

Never edit generated files by hand, and never change code before its spec.
The order is always:

1. Update the spec — [`spec.md`](../spec.md) for system-wide changes, or
   `forms/<slug>/spec/index.md` for one form.
2. Change the source-of-truth code (`sql/` for schema; the front-end/back-end
   source for behavior).
3. Regenerate every derived artefact from that source (see Generators,
   below) — never hand-edit XML, FHIR, protobuf, OpenAPI, the Loco setup
   script, `CHANGELOG.md`, or `examples/`.
4. Run the relevant verify gate(s) before committing.

## Form directory layout

Each form lives in `forms/<slug>/`, scaffolded by `bin/create-form <slug>`:

```
forms/<slug>/
  index.md, README.md -> index.md, AGENTS.md, CLAUDE.md   # description + agent docs
  spec/index.md (+ README.md symlink)                      # living domain spec
  plan.md, tasks.md, CHANGELOG.md, doc/
  sql/                        # PostgreSQL Liquibase migrations — source of truth
  xml/, fhir/r5/, protobuf/, openapi/                       # generated per SQL entity
  examples/                   # assessment.json fixture + personas.json + FHIR Bundle
  front-end-with-html/        # Lily Design System headless HTML (index.html + dashboard.html)
  front-end-with-svelte/      # SvelteKit + Lily; routes under src/routes/<slug>/
  back-end-with-loco/         # Rust axum + Loco JSON API; crate source under src/<form_snake_case>/
  back-end-with-loco-setup    # generated `cargo loco generate scaffold` script
```

## Standard workflow for a new form

1. `bin/create-form <slug>` to scaffold the directory.
2. Fill in `index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`.
3. Author SQL migrations in `sql/`.
4. Regenerate: `xml-representations`, `fhir-r5`, `protobuf`, `openapi`,
   `back-end-with-loco/generate-back-end-with-loco-setup.py`,
   `generate-changelog-and-examples.py`.
5. Build both front-ends (HTML and SvelteKit), form + dashboard.
6. Build the Loco back-end.
7. `bin/lily-html-refactor --check --all` to confirm no Lily contract drift.
8. `bin/test-form <slug>` to validate structure.
9. Update `tasks.md`.

## Tool catalogue, by purpose

Full flags and descriptions are in [`AGENTS.md`](../AGENTS.md) (source of
truth) or the generated [`docs/tools.md`](../docs/tools.md). Categories:

- **Structure & validation** — `bin/test`, `bin/test-form <slug>`,
  `bin/test-sql-apply`, `bin/test-examples-conformance`,
  `bin/test-vendored-uniformity`, `bin/test-e2e`, `bin/test-tools`,
  `bin/test-personas` (personas vs their scoring engine), `bin/create-form`.
- **SQL** — `bin/migrate-sql-filenames.py`,
  `bin/sql/generate-sql-comments.py`, `bin/sql/generate-sql-combined.py`.
- **Generators (SQL → derived representations)** — the `xml-representations`,
  `fhir-r5`, `protobuf`, `openapi`, `back-end-with-loco` generators, plus
  `generate-changelog-and-examples.py`.
- **Loco back-end refactor / drift tools** — `loco-config-refactor`,
  `loco-migration-defaults`, `loco-migration-nullability`,
  `generate-loco-deny-config.py`, `loco-forbid-unsafe`,
  `loco-seed-base-rename`, `loco-test-auth-header-fix`,
  `loco-rs-1-migration`, `loco-msrv-set`, `loco-test-max-connections-fix`.
  Most have a `--check` mode that is the CI drift detector for that
  convention; several are one-shot migrations already applied fleet-wide
  (their header comment says so — do not re-run them as a gate).
- **Lily Design System (HTML)** — `es-modules-refactor`, `lily-html-refactor`,
  `lily-sync`, `html-theme-locale-select-refactor`,
  `page-header-layout-refactor`, `html-helpers-picker-rename`.
- **Lily Design System (Svelte)** — `lily-svelte-refactor`,
  `lily-svelte-status`, `lily-svelte-sync`, `svelte-locale-select-refactor`,
  `svelte-helpers-picker-rename`, `svelte-pnpm-workspace-fix`,
  `svelte-vitest-app-env-alias-fix`, `svelte-theme-css-sync`.
- **Specs** — `generate-llms-txt.py`, `generate-spec.py` (never overwrites an
  existing hand-maintained spec unless `--force <slug>`).

Several tools are marked in `AGENTS.md` as **one-shot, superseded** — their
`--check` always false-positives now that a later rename tool supersedes
them (e.g. the `*-chooser` rename tools, superseded by the `*-picker` rename
tools). Check `AGENTS.md`'s per-tool note before wiring anything into a gate.

## Personas (scoring-engine regression fixtures)

`forms/<slug>/examples/personas.json` holds hand-authored, realistic filled
states plus the engine's exact expected output — richer than the
type-defaulted `examples/assessment.json`. Format and workflow are in
`bin/test-personas`'s header comment:

```sh
bin/test-personas                 # verify every form's personas (default)
bin/test-personas <slug> ...      # verify only the named forms
bin/test-personas <slug> --update # (re)compute `expected` from the engine
```

Compute `expected` under Node 26 (the CI-pinned version — `mise exec node@26
-- node bin/test-personas <slug> --update`), then re-verify with a plain
run. When authoring new personas, read the actual engine source
(`rules.js`/`flags.js`/`grader.js` under `front-end-with-html/js/`) rather
than trusting a form's `AGENTS.md`/`index.md` summary at face value — several
prior persona sets found real, verified gaps between the documented
behavior and what the code actually does (e.g. a documented field the
grading rules never read, or an escalation condition narrower than the
severity check it's supposed to mirror). Cross-check every fired flag in a
persona's computed `expected` against its exact condition in `flags.js`
before trusting it.

## Verify gates

The full, current list lives in `AGENTS.md`'s Verify section — run the
subset relevant to what changed, or `bin/test` plus the specific drift
detectors for the stack you touched (SQL, HTML/Lily, Svelte/Lily, Loco,
specs/generators). Per-crate, `cargo deny --all-features check` runs from
inside each `back-end-with-loco/`.

## Conventions

- Empty string `''` for unanswered text/enum fields; `null` for unanswered
  numeric/date/time fields.
- `camelCase` in TypeScript and front-end Rust serde; `snake_case` in SQL and
  Rust internals; `serde(rename_all = "camelCase")` on shared structs.
- Svelte step components named `StepNName.svelte` (1-indexed, no spaces,
  ampersands, or parentheses); UI components under `src/lib/components/ui/`.
- UUIDv4 primary keys via `gen_random_uuid()`; every table has `created_at` /
  `updated_at` / `deleted_at`.
- The whole form is one continuous single-page wizard — never multi-page.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup script,
  `CHANGELOG.md`, `examples/`) are never hand-edited; regenerate instead.
