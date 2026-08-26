# Changelog

All notable repository-level changes are recorded here. The format is based on
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and the project
aims to follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

**Two scopes, deliberately.** This file records changes to the *repository*: the
conventions every form obeys, the toolchain, the CI gates, the fleet-wide
rollouts. Each form additionally carries its own `forms/<slug>/CHANGELOG.md`
under the same format, versioned independently, for changes to that form's
schema, engine, and front-ends.

**No versioned release has been cut yet.** The repository has never been tagged
for release, so this file has no version headings before `[Unreleased]`; the
historical sections below are dated milestones reconstructed from git history,
which remains the authoritative record. The first tagged release will draw its
notes from `[Unreleased]`, and every section after it will carry a version.

## [Unreleased]

### Added

- `#![forbid(unsafe_code)]` on every crate root in every form's
  `back-end-with-loco/` — the library, the `-cli` binary, the `migration`
  library, and the integration-test target — 1,412 crate roots across 355
  crates. Nothing in these crates needs `unsafe`, and `forbid`, unlike `deny`,
  cannot be reopened by a later inner `allow`.
- `bin/loco-forbid-unsafe`, the tool that applies and gates the above, with
  `--check` wired into the CI drift job. Every form's generated
  `back-end-with-loco-setup` script now calls it as its final step, so a newly
  scaffolded crate arrives with the attribute already in place.
- Repository-level special files for public repositories: `AI_STATEMENT.md`,
  `BENCHMARKS.md`, `CHANGELOG.md`, `CODEOWNERS`, `COMPARISONS.md`,
  `GOVERNANCE.md`, `INSTALL.md`, `MAINTAINERS.md`, `NEWS.md`, and `SECURITY.md`,
  per [`spec/special-files-for-public-repos/`](spec/special-files-for-public-repos).
- SPDX identification in `LICENSE.md`, and richer metadata in `CITATION.cff`.

### Changed

- `CONTRIBUTING.md` gained the ways to contribute that are not code.

### Added

- CI now runs every repo-internal verify gate (ten were missing), a
  changed-forms detection job that narrows the Rust/Svelte matrices to
  touched forms on pushes and PRs (full fleet nightly), a weekly cargo-deny
  advisories sweep over every crate's lockfile, `workflow_dispatch`, npm
  caching, and Dependabot for Actions, the site, and the E2E harness.
- `bin/test-vendored-uniformity` — proves the vendored theme catalogues and
  Lily Svelte helpers are byte-identical across all 355 forms (the
  CI-checkable half of the checkout-reading sync tools' invariant).
- Personas for the flagship `cardiology-request` / `cardiology-response`
  pair: routine-accept, urgent typical-angina, and an emergency ACS
  escalation on the request; no-abnormality, HFrEF (EF 32%), and an
  uncommunicated critical aortic-stenosis result on the response.
- Personas for the entire `*-waiting-list-card` family (56 forms; fleet
  total 109 → 167 verified): three clinically coherent RTT scenarios each —
  routine P4 within target, urgent P2 approaching target with an interpreter
  flag, and a P3 52-week long-wait breach with harm-review and
  missing-appointment flags. `bin/test-personas` gained an optional
  per-persona `options` object passed as the grader's second argument, so
  clock-derived engines pin `todayIso` and the recorded oracle cannot rot.
- GitHub issue templates (defect; clinical-correctness, which requires a
  citation against the published instrument; contact links routing security
  reports to SECURITY.md's private path) and a pull-request template carrying
  the spec-first checklist and the `AI_STATEMENT.md` §10 disclosure section.
- GOVERNANCE.md documents the intended repository settings (branch
  protection, required checks, why review-requirement stays off at bus
  factor one) and a 5-step release runbook; repo topics set from NEWS.md's
  fact sheet.

### Changed

- The fleet `deny.toml` policy tracks the loco-rs 1.1 dependency tree:
  RUSTSEC-2023-0071 (rsa Marvin attack, no fixed release; unreachable here —
  JWT auth is HMAC HS256) ignored with the reasoning stated, and the four
  stale 0.16-era ignores dropped.
- Every Loco crate bumped loco-rs 1.0.1 → 1.1.0 and uuid 1.24 → 1.25,
  lockfiles refreshed; fleet-verified with `cargo check --all-targets` on all
  355 crates (355/355 PASS) before committing.
- The clippy pedantic debt in the 8 strict-header crates cleared (~140
  findings fixed or given scoped, justified allows); all 8 now pass
  `clippy --all-targets -- -D warnings`.

### Fixed

- The headless engine oracle, broken fleet-wide since the 2026-07 ES-modules
  conversion: `bin/lib/engine-loader.js` now loads ES-module engines with real
  dynamic `import()` (temp dir + `{"type":"module"}`, merged exports; classic
  vm fallback kept), skips the vendored header-control helpers whose
  module-scoped `STORAGE_KEY` collided, and `bin/test-engines` shares the lib
  instead of an inlined duplicate. `bin/test-engines`: FAIL 355 → PASS 279 /
  SKIP 76 / FAIL 0; `bin/test-personas`: FAIL 109 → PASS 109 with a zero-diff
  `--update` (the ESM path reproduces the recorded oracle byte-identically).
- `bin/es-modules-refactor` no longer reports pure-whitespace drift on the 36
  HTML front-ends formatted at 8-space indent: the emitted script block now
  matches the file's own indentation.
- Lily snapshots re-pinned to upstream `e05a138e6` and the theme catalogues
  re-synced fleet-wide (the unwired date-time-picker's
  `:disabled` → `[data-disabled]` selectors); two divergent `locales.ts`
  canonicalized. All Lily drift gates green.
- `#![warn(clippy::clippy::pedantic)]` — a doubled path segment, and therefore
  an unknown lint that did nothing — corrected to `#![warn(clippy::pedantic)]`
  in the three crates carrying it (`architecture-decision-record`,
  `inpatient-clinical-note`, `medical-operation-note`), matching the five
  rustdoc'd crates that already had the correct spelling.

## 2026-08 — loco-rs 1.0, schema fidelity, five new full-stack forms

### Added

- Five new forms built to full-stack depth (cataract diagnostic evaluation,
  health screening questionnaire, hernia diagnostic evaluation, hip replacement
  surgery evaluation, knee replacement surgery evaluation): spec, SQL, both
  front-ends, and a Loco crate each.
- [`spec/oxford-spelling/`](spec/oxford-spelling) — the repository's prose
  spelling standard (`en-GB-oxendict`).
- `bin/loco-migration-defaults`, `bin/loco-migration-nullability`, and
  `bin/loco-rs-1-migration`, each with a `--check` drift gate.

### Changed

- Every Loco crate migrated from loco-rs 0.16 to 1.0.1: the `auth_jwt`/`bg_pg`
  feature rename, and every `id`/`*_id` moved `i32` → `i64` to match 1.0's
  `BIGINT` primary keys.
- Lily Svelte helper components re-vendored, clearing the fleet-wide
  accessibility and state warnings they had been emitting.

### Fixed

- Column defaults from each form's `sql/` mirrored into its Loco migration; the
  scaffold generator cannot express defaults, so the back-end schema had been
  silently disagreeing with its own source of truth.
- Column nullability restored across migration, entity, and controller `Params`
  together. Loco has no nullable-unique column type, so `StringUniq` had forced
  nullable UNIQUE columns such as `united_kingdom_nhs_number` to `NOT NULL
  UNIQUE` — which admits exactly one row without the identifier, the rest
  colliding on the empty string. Uniqueness is now an explicit unique index.
- The `sv migrate sveltekit-3` codemod's fleet-wide `themesUrl` mistake.

## 2026-07 — route layouts, gates, and front-end modernization

### Added

- The SQL apply gate (`bin/test-sql-apply`): every form's numbered migrations,
  applied in order to a fresh scratch Postgres.
- Per-form `llms.txt`, `CHANGELOG.md`, and `examples/` (a filled-form JSON
  fixture plus a FHIR R5 Bundle), each with its generator and `--check` gate.
- Authored personas per form, cross-checked against engine output.
- A `/` welcome page in every Svelte front-end.
- `localStorage` autosave in the HTML wizards.
- The Lily header controls — theme, locale, text size, share — plus the vendored
  date-time picker, across both front-end stacks.
- `cargo deny` supply-chain policy per Loco crate, generated and gate-checked.

### Changed

- Route layouts settled: Loco crates under `back-end-with-loco/src/<snake>/`,
  Svelte routes nested under `src/routes/<form-kebab-case>/`.
- Every HTML front-end converted from classic `window.<Namespace>` scripts to
  native ES modules, with `spec/es-modules.md` and a `--check` gate.
- Form front-ends made fully scrollable: the fixed and sticky header and footer
  are gone.
- All Loco crates rebuilt to the relational gold layout: one migration and one
  entity per SQL table.
- `sql-migrations/` renamed to `sql/` everywhere, and the SQL-derived generators
  modernized to read it.
- The Lily HTML and Svelte helpers renamed `*-chooser` → `*-picker`, tracking
  upstream.

### Fixed

- A class of broken submits that rendered a 404 instead of the report, plus the
  single-page-wizard smoke gate that now catches it.
- 61 forms missing from `forms.tsv`; 81 stale Loco setup scripts; several stale
  FHIR example bundles.

## 2026-06 — one back-end design, one front-end per stack

### Changed

- Every form's back end migrated to the canonical Loco + SeaORM + PostgreSQL
  JSON API, replacing the earlier Tera/HTMX/Alpine full-stack approach.
- Postgres-only background queue, plus OpenTelemetry and a Prometheus `/metrics`
  endpoint, standardized across every crate.
- Every form's Svelte front-end consolidated into `front-end-with-svelte/`.
- Directory reorganization: `spec.md` → `spec/index.md`, `xml-representations/`
  → `xml/`, `fhir-r5/` → `fhir/r5/`.
- Every Loco crate documented to satisfy `deny(missing_docs)`.

## 2026-05 — the Lily Design System rollout

### Added

- The Lily Design System class contract for both front-end stacks, with pinned
  upstream snapshots under `forms/lily-spec/` and `forms/lily-svelte-spec/` and
  the `--check` detectors that keep every form on it.
- The `formexamples.com` site, built from `formexamples.github.io/` and deployed
  by GitHub Pages.

### Changed

- Every form's HTML and Svelte front-end refactored onto the Lily contract, and
  the canonical Lily UI components promoted over the legacy per-form ones.

## 2026-04 — the generator pipeline

### Added

- The generators that derive XML + DTD, FHIR R5, and the Loco scaffold script
  from each form's SQL, and `bin/test-form` to validate a form's structure.

### Changed

- Multi-step forms replaced by the single-page, all-in-one wizard that is now
  the rule.
- SQL and the generators refactored to per-entity files.

## 2026-03 — first commit

### Added

- The repository, the `forms/<slug>/` layout, `bin/create-form`, and the first
  forms: advance decision to refuse treatment, advance statement about care,
  allergy assessment, and others.
