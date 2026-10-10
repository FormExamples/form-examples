# Medical Forms

Medical forms monorepo for structured clinical assessments, patient intake,
cardiovascular risk calculators, administrative healthcare documents, privacy
notices, and staff training checklists. Each form collects data via a
single-page, step-by-step questionnaire, applies a validated scoring or grading
engine, and generates a clinical report with flagged issues.

## Spec-driven development

The system spec lives in [`spec.md`](spec.md) at the repo root. Each form
has its own domain spec directory [`forms/<slug>/spec/`](forms/AGENTS.md)
(`index.md` + a `README.md` symlink).
Update specs before changing code; regenerate derived artefacts after
schema changes. See `spec.md` §10 for the spec-driven workflow.

## Documentation

- [`docs/index.md`](docs/index.md) — guides (architecture, data model,
  generator pipeline, scoring engines, Lily, back end, verification, i18n,
  tools reference) and [`docs/tutorials/`](docs/tutorials).
- [`arc42/index.md`](arc42/index.md) — full arc42 architecture document.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to work in this repo and the
  verify gates.

## Tools

### Structure and validation

- `bin/forms-as-kebab-case` — list all form directory slugs
- `bin/test` — run all form validation tests
- `bin/test-form <slug>` — test a single form by slug
- `bin/test-sql-apply [<slug>…]` — apply every form's numbered SQL migrations in order to a fresh scratch Postgres database; the executable gate for `sql/` correctness
- `bin/test-examples-conformance [<slug>…]` — check each form's `examples/assessment.json` against its `sql/` schema (every key names a real table/column; catches drift after a schema change)
- `bin/test-vendored-uniformity [--verbose]` — verify the vendored theme catalogues (both stacks) and the one still-vendored Lily Svelte helper component, `DateTimePicker.svelte`, are byte-identical across every form. (The other four Svelte helpers — `ThemePicker`/`LocalePicker`/`TextSizePicker`/`SharePicker` — and `locales.ts` stopped being vendored fleet-wide when `bin/svelte-lily-pnpm-migrate` moved them to real pnpm dependencies; nothing left to hash is a stronger uniformity guarantee than a byte-compare ever was.) The CI-checkable half of the checkout-reading sync tools' invariant: fleet uniformity runs everywhere, upstream currency stays a maintainer-run check against the pinned checkout
- `bin/test-e2e [--html] [--svelte] [--all|<slug>…]` — Playwright smoke + axe-core accessibility sweep over form front-ends
- `bin/test-tools` — smoke-test every Lily-system tool's `--check` / `--counts` / `--help` modes
- `bin/test-personas [<slug>…] [--update] [--verbose]` — verify each form's hand-authored `examples/personas.json` (a realistic filled state + the engine's exact expected grade) against its actual scoring engine; `--update` (re)computes `expected`; `--verbose` lists every persona, and the summary counts both forms and personas. Split engines (a separate flag detector that `form-app.js` composes at render time) have their flags pinned too, via `flagsHint` + `flagsArgs` (the detector's exact call contract, copied from `form-app.js` — detectors variously take `(state)`, `(state, grade)`, or specific grade fields, so the contract must be spelled out or the pinned flags would silently differ from the UI). The wall clock is frozen while grading (`clock`, default `2026-09-03T12:00:00Z`) so review-date / expiry / certification flags never rot. Richer regression oracle than the type-defaulted `examples/assessment.json` fixture — several persona sets have found real, verified gaps between a form's documented behavior and what its engine actually does
- `bin/test-engines [<slug>…] [--verbose] [--skip-summary] [--probe <slug>]` — headless smoke gate for every HTML front-end's scoring engine: loads it (real ES-module `import()`, or a `vm` sandbox for any classic-script straggler), runs its grader over the default state, and asserts a structured result. Catches an engine that throws on load or returns malformed output, with no browser. Discovery is by *probing* (`bin/lib/engine-loader.js`): the factory is the zero-arg export building the largest state object, and the grader is the plausibly-named export whose result over that state looks most like a composite (rule + flag arrays, a status-like key) — names only break ties. The earlier name-only heuristic mis-picked sub-axis graders on six verified forms and left 76 forms SKIPped; probing leaves 15 (all genuinely engine-less or factory-less). `--skip-summary` groups the SKIPs by reason class; `--probe` shows every candidate's score for one form
- `bin/test-loco-routes` — assert every Loco crate exposes its domain HTTP API: a crate whose `app.rs` `routes()` wires only `auth::routes()` compiles and has a full data layer but exposes no domain entities over HTTP; fails any crate wiring fewer than two routes
- `bin/test-tutorials` — fast doc-rot check for `docs/tutorials/`: extracts every fenced ` ```sh ` block, scans it for `bin/...` and `forms/...` path tokens, and asserts each still exists. Static reference check only — starts no servers, runs no tutorial commands
- `bin/create-form <slug>` — scaffold a new form directory
- `bin/update` — run the `update / upgrade / fix / harmonize / audit / test` Claude Code prompt against the repo
- `bin/generate-forms-tsv.py [--check]` — generate `forms.tsv`, the case-conversion lookup table read by `bin/forms-as-kebab-case` and friends
- `bin/generate-tools-doc.py [--check]` — generate `docs/tools.md` from every `bin/` tool's self-documenting header

### SQL

- `bin/migrate-sql-filenames.py` — one-shot migration of each form's `sql/` to the canonical `NN_create_table_<name>.sql` layout
- `bin/sql/generate-sql-comments.py` — append missing `COMMENT ON TABLE` / `COMMENT ON COLUMN` to numbered SQL migrations
- `bin/sql/generate-sql-combined.py` — combine each form's numbered SQL migrations into `schema.sql`

### Loco back-end refactor

Mechanical fleet-wide maintenance tools for `back-end-with-loco/` crates
(background-queue/observability config, migration defaults/nullability, UUID primary keys,
`deny.toml`, `#![forbid(unsafe_code)]`, scaffold-bug fixups, the loco-rs
1.0.1 migration, MSRV, connection-pool sizing, `GET /api/openapi.yaml`,
camelCase JSON) are catalogued in
[`AGENTS/back-end-with-loco.md`](AGENTS/back-end-with-loco.md) §Fleet-wide
maintenance tools, to keep this file under the repo's own 40KB target.
Each has a `--check` CI drift detector, listed in the Verify block below.

### Generators (SQL → derived representations)

- `bin/xml-representations/generate-xml-representations.py` — generate XML and DTD per SQL table entity
- `bin/fhir-r5/generate-fhir-r5-representations.py` — generate FHIR HL7 R5 JSON per SQL entity
- `bin/protobuf/generate-protobuf-representations.py` — generate Protocol Buffers `.proto` schemas per SQL entity
- `bin/openapi/generate-openapi-representations.py` — generate OpenAPI 3.1 `.yaml` specifications per SQL entity
- `bin/openapi/generate-openapi-combined.py [--check] [<slug>…]` — merge a form's per-entity OpenAPI files into one `forms/<slug>/openapi/openapi.yaml` (union of `paths` and `components.schemas` under a form-level `info` block, for Swagger UI / client codegen consumers that want one document per form); `--check` is the CI drift detector
- `bin/back-end-with-loco/generate-back-end-with-loco-setup.py [--check] [<slug>…]` — emit each form's `cargo loco generate scaffold --api` setup script; `--check` is the CI drift detector
- `bin/back-end-with-loco/generate-rust-docs.py <crate>…` — insert rustdoc (crate `//!`, module headers, `///` on every `pub` item) so each Loco crate compiles under `#![deny(missing_docs)]`; idempotent
- `bin/back-end-with-loco/generate-loco-agents.py [--stale|--list-stale] <slug>…` — regenerate a form's `back-end-with-loco/AGENTS.md` to describe the crate as it actually is (relational per-table Loco JSON API, RESTful scaffold controller per domain table); replaces docs still describing the obsolete single-`assessments`-table-with-JSONB design. `--list-stale` is the CI drift detector
- `bin/generate-changelog-and-examples.py [--check] [<slug>…]` — scaffold per-form `CHANGELOG.md` and `examples/` (filled-form JSON fixture + FHIR R5 Bundle); `--check` is the CI drift detector
- `bin/generate-persona-fhir-bundles.py [--check] [--all|<slug>…]` — generate one FHIR R5 `Bundle` per `examples/personas.json` entry into `examples/personas-fhir/`, built from that persona's actual filled `state` and computed `expected` grade (richer than `generate-changelog-and-examples.py`'s generic, type-defaulted `examples/fhir-bundle.json`, which carries the same placeholder values for every reader). Scoped to the `*-test-result` family, whose `sql/` all share one shape (`patient` + `clinician` + a single main `<slug>_result` table + a `_grade`/`_grade_rule`/`_grade_flag` triad); defaults to that whole family with no arguments. `--check` is the CI drift detector
- `bin/generate-persona-dashboard-samples.py [--check] [--all|<slug>…]` — regenerate each `*-test-result` form's clinician-dashboard sample rows (`front-end-with-html/js/data.js` + the parallel `front-end-with-svelte/src/lib/data/sample-reports.ts`) from `examples/personas.json`, one row per persona, so the dashboard's offline sample data and the persona oracle can never disagree. Field order is read from each form's own `ReportRow` TypeScript interface (a few forms interleave a domain-specific field, e.g. `dexa-bone-density-test-result`'s `lowestTScore`/`whoClassification`, rather than appending it); the synthetic `id` reuses each form's own existing prefix (no fleet-wide naming rule). `--check` is the CI drift detector

### Lily Design System (HTML and Svelte front-ends)

Mechanical, fleet-wide Lily maintenance tools (`bin/es-modules-refactor`,
`bin/lily-html-refactor`, `bin/lily-sync`, `bin/html-theme-locale-select-refactor`,
`bin/lily-svelte-refactor`, `bin/lily-svelte-sync`, `bin/svelte-lily-pnpm-migrate`,
`bin/svelte-lily-picker-defaults`, the export/import and restore-banner rollouts,
the superseded one-shots, and the rest) are catalogued in
[`AGENTS/lily-tools.md`](AGENTS/lily-tools.md), to keep this file under the
repo's own 40KB target. Each has a `--check` CI drift detector, listed in the
Verify block below; `docs/tools.md` has every tool's generated header.

### Specs

- `bin/generate-llms-txt.py [--check] [<slug>…]` — generate per-form `llms.txt` (llmstxt.org format, derived from `index.md`); `--check` is the CI drift detector
- `bin/oxford-spelling-sweep [--check] [--dry-run]` — sweep hand-authored Markdown prose (every form's `index.md`/`AGENTS.md`/`CHANGELOG.md`/`plan.md`/`tasks.md`/`doc/**`/`spec/**`, plus the same root-level docs and `docs/`/`arc42/`/`spec/`/`AGENTS/`) from British `-ise`/`-isation` to Oxford `-ize`/`-ization` spelling, per [`spec/oxford-spelling/oxford-spelling.md`](spec/oxford-spelling/oxford-spelling.md). Converts only the Greek-derived verbs that spec lists (organise → organize, standardise → standardize, …); leaves English/French `-ise` roots alone (exercise, promise, surprise, comprise, practise, precise, disable, …) via a hand-classified convert list, not a blind suffix regex — the earlier blind-regex draft of this sweep (an abandoned branch) is exactly the failure mode this avoids. Protects fenced code blocks, inline code spans, Markdown link targets, *italic*/_italic_ spans (this repo's citation-title convention — including spans that hard-wrap across a line break, which needed a specific fix after the first pass silently missed one and "fixed" a citation into the wrong spelling), and an explicit `PROTECTED_PHRASES` list for exact proper nouns that appear as plain unmarked text (e.g. the *Human Fertilisation and Embryology Act 1990*, a UK statute always cited in its enacted British spelling regardless of Oxford's general rule). Excludes `spec/oxford-spelling/oxford-spelling.md` itself, whose own "Use (Oxford) | Not" table deliberately puts the wrong spelling in its right-hand column as a worked example — sweeping it would "fix" the example into two identical columns. `--check` is the CI drift detector
- `bin/generate-spec.py [--check] [--force] [<slug>…]` — scaffold per-form `spec/index.md` (hand-maintained living domain spec, seeded from `index.md`; never overwritten unless `--force <slug>`); `--check` verifies every form has a non-empty spec + README symlink
- `bin/generate-form-skills.py [--check] [<slug>…]` — generate two Claude Code Skills per form under `forms/<slug>/skills/`: `<slug>-skill` (end-user concepts, mirroring the repo-root `form-examples-skill`) and `<slug>-maintainer-skill` (implementation workflow, mirroring `form-examples-maintainer-skill`). Content is derived from the form's own `index.md` (title, first paragraph) and `AGENTS.md` (its `Scoring system`/`Scoring engine` and `Verify` sections, falling back to `bin/test-form <slug>` plus any generically-applicable gate — `test-sql-apply`, `test-personas`, `test-e2e --html` — the form qualifies for but doesn't already mention) and which artefact directories actually exist on disk, not what a possibly-stale `AGENTS.md` claims. `--check` is the CI drift detector
- `bin/sync-form-tasks-checkboxes [--check] [--all|<slug>…]` — check off stale per-form `tasks.md`/`plan.md` items whose named artefact already exists on disk: every form's checklist began as `bin/create-form`'s scaffold template, and fleet-wide tooling since has built almost all of it directly without ever going back to tick the original per-form list (1856 stale `tasks.md` + 69 stale `plan.md` lines found fleet-wide 2026-09-12). Deliberately conservative — a line only flips to `[x]` when *every* backtick-quoted token on it resolves to a real, non-empty file or directory relative to that form's own directory; a line with no backtick-quoted path, or any backtick span that's a command invocation rather than a path (`bin/test-form <slug>`, `cargo test` — unverifiable here without a live Postgres per crate, ~45s/crate observed), is left untouched rather than guessed at. 450/1856 `tasks.md` + 36/69 `plan.md` eligible and closed under this rule; the rest are prose-only scaffold items with no path claim to verify, correctly left open. The root `tasks.md` remains the actually-maintained fleet backlog; this only keeps the per-form snapshots from misleading a reader into thinking finished work is outstanding
- `bin/node-current-version-set [--check] [--dry-run]` — apply [`spec/node-current-version/`](spec/node-current-version/) fleet-wide: every existing `package.json` gets `engines.node` pinned to the spec's current major, every existing `.npmrc` gets `engine-strict=true`, and every GitHub Actions workflow's `node-version:` is bumped to match. Also sets `pnpm-workspace.yaml`'s `engineStrict: true` alongside any `.npmrc` — not in the spec's literal text, but required to make its own verified requirement (an actual `EBADENGINE`-equivalent failure on a stale Node) true for the fleet's actual package manager: `pnpm install` only *warns* on an engines mismatch even with `.npmrc`'s `engine-strict=true` set, verified directly; only `pnpm-workspace.yaml`'s camelCase key (or the `--engine-strict` CLI flag) actually raises `ERR_PNPM_UNSUPPORTED_ENGINE`. Repo-wide (`git ls-files`-driven), not the `--all|<slug>` pattern — there is no single per-form scope for a toolchain-version policy that also covers `e2e/` and `formexamples.github.io/`. Never creates a file that doesn't already exist, per the spec's own "if file X exists" scoping; the target version is parsed from the spec, not hardcoded, so it needs no code change when the spec's version bumps. `--check` is the CI drift detector
- `bin/make-github-pages [--dry-run]` (delegate of `make github-pages`, the root `Makefile`'s default target) — per [`spec/monorepo-github-pages/`](spec/monorepo-github-pages/): export `formexamples.github.io/`'s tree via `git subtree push --prefix=formexamples.github.io github-pages main` to the sibling, top-level, read-only `github.com/FormExamples/formexamples.github.io` repo (the GitHub-convention `<org>.github.io` repo, auto-served at the domain root — unlike this monorepo's own Pages, which nests under `/form-examples/`). Adds the `github-pages` remote first if it's missing (e.g. on a fresh clone). `formexamples.github.io/.github/workflows/deploy.yml` is inert here (GitHub only reads `.github/workflows/` at a repo's root) but becomes the sibling's real, root-level deploy workflow once exported, so the sibling builds and redeploys itself on every push this tool makes. Never work directly in the sibling clone — always re-publish from here. `--dry-run` splits without pushing

## Form index

See [`forms/AGENTS.md`](forms/AGENTS.md) for the alphabetical index of every
form project.

## Form directory structure

Each form lives in `forms/<slug>/` with a consistent layout (the scaffolding
is created by `bin/create-form`):

```
forms/<slug>/
  index.md                                         # Form description and scoring details
  README.md -> index.md                            # Symlink for GitHub rendering
  AGENTS.md                                        # Agent instructions for this form
  CLAUDE.md                                        # Claude Code project instructions
  spec/                                            # Living spec directory (index.md) for spec-driven development
  plan.md                                          # Implementation plan and status
  tasks.md                                         # Task tracking
  CHANGELOG.md                                     # Keep-a-Changelog 1.1.0 + SemVer per form
  doc/                                             # Clinical/regulatory reference documentation
  examples/                                        # Filled-form JSON fixtures + FHIR R5 Bundle samples
  sql/                                             # PostgreSQL Liquibase migrations (source of truth)
  xml/                                             # XML + DTD per SQL table entity (generated)
  fhir/r5/                                         # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                                        # Protocol Buffers .proto schemas per SQL entity (generated)
  openapi/                                         # OpenAPI 3.1 .yaml specifications per SQL entity (generated)
  front-end-with-html/                             # Questionnaire + dashboard (HTML + Lily Design System; index.html + dashboard.html)
  front-end-with-svelte/                           # Questionnaire + dashboard (SvelteKit + Lily); routes nested under src/routes/<form-kebab-case>/ (served at /<slug>/)
  back-end-with-loco/                              # Back-end Rust JSON API (axum + Loco; no Tera/HTMX/Alpine/CSS); crate source under src/<form_snake_case>/
  back-end-with-loco-setup                         # Scaffold generator (executable shell script of `cargo loco generate scaffold --api` calls; generated)
```

## Standard workflow for a new form

1. `bin/create-form <slug>` — scaffold the directory.
2. Fill in `forms/<slug>/index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
   `tasks.md` with the design spec.
3. Author SQL migrations in `forms/<slug>/sql/`.
4. Regenerate derived representations:
   - `python3 bin/xml-representations/generate-xml-representations.py`
   - `python3 bin/fhir-r5/generate-fhir-r5-representations.py`
   - `python3 bin/protobuf/generate-protobuf-representations.py`
   - `python3 bin/openapi/generate-openapi-representations.py`
   - `python3 bin/back-end-with-loco/generate-back-end-with-loco-setup.py`
   - `python3 bin/generate-changelog-and-examples.py` (CHANGELOG + examples/)
5. Build the front-ends (form and dashboard, each in HTML and SvelteKit).
6. Build the back-end Rust JSON API implementation.
7. Run `bin/lily-html-refactor --check --all` to confirm no Lily contract drift.
8. `bin/test-form <slug>` — validate structure.
9. Update `forms/<slug>/tasks.md` with the work done.

## User interface

**IMPORTANT:** the form must be one continuous single-page wizard. No
multi-page forms.

## Technology stacks

See the per-stack agent docs:

- [Front-end with HTML / Lily Design System headless](forms/AGENTS-front-end-html.md)
- [Front-end with SvelteKit / Lily Design System Svelte headless](forms/AGENTS-front-end-svelte.md)
- [Front-end with SvelteKit / Tailwind / SVAR](AGENTS/front-end-with-sveltekit-tailwind-svar.md)
- [Back-end with Rust / axum / Loco (JSON API)](AGENTS/back-end-with-loco.md)
- [Lily Design System fleet-wide tools](AGENTS/lily-tools.md)
- [Back-end scaffold generator (setup script)](AGENTS/back-end-with-loco-setup.md)
- [SQL migrations](AGENTS/sql.md)
- [XML representations](AGENTS/xml-representations.md)
- [FHIR HL7 R5 representations](AGENTS/fhir-r5.md)
- [Protocol Buffers representations](AGENTS/protobuf.md)
- [OpenAPI representations](AGENTS/openapi.md)

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed; no spaces, ampersands, or parentheses in filename).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV (Comma-Separated Values), and TSV (Tab-Separated Values).
- Generated artefacts are never hand-edited (XML, FHIR, protobuf, OpenAPI, Loco setup script).

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022 — Design and development of information for users](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

## Verify

```sh
bin/test                              # validates every form's structure
bin/test-sql-apply                    # SQL apply gate: every form's migrations on a fresh scratch DB
bin/es-modules-refactor --check --all # ES-modules front-end drift detector
bin/lily-html-refactor --check --all  # Lily HTML contract drift detector
bin/lily-sync --check                 # Lily HTML spec-snapshot drift detector
bin/lily-svelte-refactor --check --all # Lily Svelte contract drift detector
bin/lily-svelte-sync --check          # Lily Svelte spec-snapshot drift detector
bin/svelte-locale-select-refactor --check      # Svelte LocaleSelect drift detector
bin/html-theme-locale-select-refactor --check  # HTML theme/locale-select drift detector (also re-syncs theme CSS)
bin/svelte-theme-css-sync --check              # Svelte theme CSS re-sync drift detector
bin/svelte-pnpm-workspace-fix --check --all    # Svelte pnpm-workspace.yaml packages-field + esbuild-allow drift detector
bin/svelte-vitest-app-env-alias-fix --check --all # Svelte vitest.config.ts $app/environment -> $app/env alias-key drift detector
bin/svelte-kit-3-theme-url-fix.py --check      # Svelte sv-migrate themesUrl-fix drift detector (one-shot)
bin/svelte-autosave-restore-fix --check        # Svelte autosave-restore bug fix + restore-banner drift detector
# bin/svelte-date-time-picker-vendor --check   # one-shot, superseded by svelte-lily-picker-defaults — vendored copy deleted fleet-wide as unneeded; do not run as a CI gate
bin/html-date-time-picker-vendor --check       # HTML date-time-picker vendor drift detector (vendor-only, unwired)
bin/page-header-layout-refactor --check        # HTML page-header title-left/controls-right drift detector
bin/form-export-import-refactor --check        # HTML wizard-level export/import rollout drift detector (263/350 forms)
bin/form-restore-banner-refactor --check       # HTML wizard restore-banner rollout drift detector (263/263 migrated forms)
bin/generate-export-samples --check            # per-form export-sample.csv/.tsv drift detector (265/356 forms; slow — drives a real browser)
bin/verify-personas                            # personas.json vs real wizard submit/render (slow)
bin/verify-blank-submit                        # blank-state submit never crashes
bin/html-error-message-contrast-fix --check    # HTML semantic-colour (danger/success/warning/info/muted) WCAG AA contrast drift detector
bin/svelte-lily-pnpm-migrate --check --all    # Svelte Lily vendoring -> real pnpm dependency drift detector (headless primitives + picker-bar consolidation)
bin/svelte-lily-scope-rename --check --all    # Svelte Lily unscoped -> @lilydesignsystem npm-scope rename drift detector
bin/svelte-lily-picker-defaults --check --all # Svelte Lily default theme-order/text-size-scale + DateTimePicker-retirement drift detector
bin/html-helpers-picker-rename --check        # HTML text-size-chooser/share-chooser -> *-picker rename drift detector (supersedes html-helpers-chooser-rename / html-text-size-select-refactor / html-share-button-refactor, below)
# bin/svelte-helpers-picker-rename --check     # one-shot, superseded by svelte-lily-pnpm-migrate — the vendored copies it renamed are gone fleet-wide; always reports "nothing to do"; do not run as a CI gate
# bin/svelte-helpers-chooser-rename --check    # one-shot, superseded by svelte-helpers-picker-rename — always false-positives post-rename; do not run as a CI gate
# bin/html-helpers-chooser-rename --check      # one-shot, superseded by html-helpers-picker-rename — always false-positives post-rename; do not run as a CI gate
# bin/html-text-size-select-refactor --check   # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/svelte-text-size-select-refactor --check # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/html-share-button-refactor --check       # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/svelte-share-button-refactor --check     # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/lily-svelte-theme-locale-select-refactor --check # one-shot, superseded — app.css marker check uses pre-rename class names; do not run as a CI gate
bin/generate-llms-txt.py --check      # Per-form llms.txt drift detector
bin/oxford-spelling-sweep --check     # British -ise/-isation -> Oxford -ize/-ization prose drift detector
bin/generate-spec.py --check          # Per-form spec/ presence check (specs are hand-maintained)
bin/generate-form-skills.py --check   # Per-form skills/ (end-user + maintainer Claude Code Skills) drift detector
bin/node-current-version-set --check  # spec/node-current-version/ drift detector (engines.node, engine-strict, engineStrict, CI node-version)
bin/generate-changelog-and-examples.py --check # CHANGELOG + examples/ drift detector
bin/generate-persona-fhir-bundles.py --check   # per-persona FHIR R5 Bundle drift detector (*-test-result family)
bin/generate-persona-dashboard-samples.py --check # per-persona dashboard sample-row drift detector (*-test-result family)
bin/back-end-with-loco/generate-back-end-with-loco-setup.py --check # Loco setup-script drift detector
bin/back-end-with-loco/generate-loco-agents.py --list-stale # Back-end AGENTS.md staleness check (empty output = clean)
bin/loco-config-refactor --check --all # Loco background-queue + observability drift detector
bin/generate-loco-deny-config.py --check # Loco deny.toml drift detector
bin/loco-forbid-unsafe --check --all # Loco #![forbid(unsafe_code)] crate-root drift detector
bin/loco-seed-base-rename --check --all # Loco seed() unused-base-param drift detector
bin/loco-seed-base-stray-usage-fix --check --all # Loco seed() stray `let _ = base;` completeness check (one-shot)
bin/loco-test-auth-header-fix --check --all # Loco test auth_header() redundant-& drift detector
bin/loco-migration-defaults --check --all # Loco migration vs sql/ column-default drift detector
bin/loco-migration-nullability --check --all # Loco migration/entity/controller vs sql/ nullability drift detector
bin/loco-test-max-connections-fix --check --all # Loco config/test.yaml max_connections=1 pool-race drift detector
bin/loco-serve-openapi-refactor --check --all # Loco GET /api/openapi.yaml route rollout drift detector
bin/loco-camel-case-json-refactor --check --all # Loco domain-struct rename_all=camelCase drift detector
bin/loco-integration-test-rollout --check --all # Loco patient-table POST/GET round-trip test rollout drift detector
bin/loco-seed-data-rollout --check --all # Loco App::seed() domain-table fixture rollout drift detector
bin/generate-api-transcripts --check   # per-form api-create.http drift detector (336/356; slow, real server)
bin/loco-missing-request-test-stubs-fix --check --all # Loco missing-domain-test-stub completeness check (one-shot)
bin/loco-uuid-pk-refactor --check --all # Loco integer-id -> UUID primary-key drift detector
bin/loco-rs-1-migration --check --all # Loco 0.16 -> 1.0.1 migration completeness check (one-shot)
bin/loco-msrv-set --msrv 1.96 --check --all # Rust MSRV (rust-version) drift detector, per spec/rust-msrv-n-minus-2/
bin/generate-forms-tsv.py --check     # forms.tsv drift detector
bin/generate-tools-doc.py --check     # docs/tools.md drift detector
bin/openapi/generate-openapi-combined.py --check # per-form combined openapi.yaml drift detector
bin/test-examples-conformance         # example fixtures vs sql/ schema conformance
bin/test-tutorials                    # docs/tutorials/ reference only existing tools/paths
bin/test-engines                      # HTML scoring engines load and run headless
bin/test-loco-routes                  # every Loco crate exposes its domain HTTP API
bin/test-vendored-uniformity          # vendored themes + DateTimePicker byte-identical fleet-wide
bin/test-personas                     # personas.json vs each form's actual scoring engine
bin/test-e2e --html                   # Playwright smoke + axe-core a11y sweep (HTML)
```

Per-crate (each `forms/<slug>/back-end-with-loco/`, run in CI as part of the sharded Rust job):

```sh
cargo deny --all-features check       # supply-chain policy: advisories, licenses, bans, sources
```
