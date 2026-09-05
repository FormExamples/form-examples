# Plan

Living roadmap for the medical-forms monorepo. The current round is first;
previous rounds are archived below, verbatim. Companion file:
[`tasks.md`](tasks.md) holds the executable checklists.

## Round 2 (2026-08-26) — gate truth, CI completeness, professionalization

Planned after a research pass over the whole monorepo (355 forms, ~146k
tracked files, 1,141 commits). The build-out is done and uniform; Round 1
built the verification machinery. The finding of this pass is that **some of
that machinery has quietly stopped telling the truth**: two CI-wired gates are
red fleet-wide from one loader bug, a third of the AGENTS.md verify list never
made it into CI, three gates false-positive against an un-pinned local
checkout, and a 710-file dependency bump is sitting uncommitted on `main`.
The theme of this round is therefore *make every gate green, honest, and
CI-enforced* — then finish professionalization and the deliberate Round 1
carry-overs.

### Already landed in this round (2026-08-26, this session)

- Public-repo special files per `spec/special-files-for-public-repos/`:
  `AI_STATEMENT.md`, `GOVERNANCE.md`, `MAINTAINERS.md`, `SECURITY.md`,
  `CODEOWNERS`, root `CHANGELOG.md`, `NEWS.md`, `INSTALL.md`,
  `COMPARISONS.md`, `BENCHMARKS.md`; SPDX in `LICENSE.md`; richer
  `CITATION.cff`; ways-to-contribute in `CONTRIBUTING.md`; project-documents
  table in `index.md`.
- `#![forbid(unsafe_code)]` on all 1,412 crate roots (355 crates × 4 targets),
  via new `bin/loco-forbid-unsafe` with `--check` in CI; the generated
  `back-end-with-loco-setup` scripts now apply it to freshly scaffolded crates.
- Fixed the `#![warn(clippy::clippy::pedantic)]` unknown-lint typo (3 crates).
- v1.0.0 tagged and released 2026-08-26.
- 2026-08-27: checked GitHub's actual CI run history for the first time —
  every run had failed or been cancelled. What followed was a real-CI-
  run-at-a-time loop: ten more fleet-wide bugs found and fixed, each
  by watching an actual run rather than assuming a fix worked (one
  wrong diagnosis, on a SvelteKit rename, was caught and reverted
  before landing) — see tasks.md Phase 9's correction entries for the
  full account. **2026-08-28: confirmed green by a real CI run** — run
  [33213955606](https://github.com/FormExamples/form-examples/actions/runs/33213955606),
  every job `success`, first time in this repository's history.

### Defects found (verified 2026-08-26 — the evidence for R0)

1. **`bin/test-engines` FAIL 355/355 and `bin/test-personas` FAIL 109/109**
   — every form, same error: `text-size-picker.js: Identifier 'STORAGE_KEY'
   has already been declared`. Root cause: `bin/lib/engine-loader.js`'s
   `NON_ENGINE` skip-list predates the header-control helpers
   (`theme-select.js`, `locale-select.js`, `text-size-picker.js`,
   `share-picker.js`, `date-time-picker.js`); they are classic scripts, each
   declaring a top-level `STORAGE_KEY`, and the loader concatenates them into
   one shared `vm` scope. Both gates run in the CI drift job, so **the drift
   job has been red since the picker vendoring**. Fix is one skip-list edit.
2. **Uncommitted fleet-wide dependency bump on `main`**: loco-rs 1.0.1 →
   1.1.0 + uuid 1.24 → 1.25 across all 355 `Cargo.toml` + `Cargo.lock` pairs
   (~710 files), plus a `formexamples.github.io/pnpm-lock.yaml` refresh.
   Five crates verified compiling this session; the rest are unverified and
   the change is unrecorded. Verify (sharded `cargo check`) then commit — or
   revert deliberately.
3. **Clippy pedantic debt fails CI**: the 8 rustdoc'd crates carry
   `#![warn(clippy::pedantic)]`, and the CI Rust shards run
   `cargo clippy -- -D warnings`, so warn = error there. Measured:
   medical-operation-note 30, architecture-decision-record 25,
   cardiology-request 22, inpatient-clinical-note 19 distinct errors
   (doc_markdown, must_use_candidate, uninlined_format_args, casts, …).
   Either fix the ~140 findings or make the lint level match CI intent.
4. **`bin/es-modules-refactor --check --all` reports 36 forms drifted**
   ("no namespace (html-only)", both HTML files). The inline FOUC
   theme-restore `<script>` exists fleet-wide, so the discriminator for these
   36 is not yet understood — diagnose before "fixing" either side.
5. **Three gates false-drift against an un-pinned checkout**:
   `svelte-theme-css-sync --check` (reports all 355 changed),
   `html-theme-locale-select-refactor --check`, and
   `svelte-helpers-picker-rename --check` read the live
   `~/git/lilydesignsystem/` checkout, which is at `7396cf295` (2026-08-26)
   while the recorded pin is `ebf770be7`. The tools should assert the
   checkout matches `forms/lily-version.md` / `lily-svelte-version.md` and
   refuse with a clear message, not report fleet drift. Separately: decide
   whether to re-pin + re-sync to current upstream.
6. **CI runs only part of the AGENTS.md verify list.** Not in `ci.yml`:
   `es-modules-refactor --check`, `page-header-layout-refactor --check`,
   `html-helpers-picker-rename --check`, `svelte-helpers-picker-rename
   --check`, both `*-date-time-picker-vendor --check`,
   `html-theme-locale-select-refactor --check`, `svelte-theme-css-sync
   --check`, `svelte-kit-3-theme-url-fix.py --check`,
   `loco-migration-defaults --check`, `loco-migration-nullability --check`,
   `loco-rs-1-migration --check`, `generate-loco-deny-config.py --check`.
   A gate that only runs on a maintainer's machine protects nothing.
7. **`bin/test` without Postgres dies 24 s in** at the first crate's
   `cargo test` (mass `PoolTimedOut`) instead of skipping with a notice
   (`TEST_FORM_SKIP_CARGO=1` exists but is not self-applied).
8. **GitHub hygiene gaps**: no issue templates, no PR template (nowhere to
   put the `AI_STATEMENT.md` §10 disclosure prompt), no dependabot/renovate,
   and no release has ever been tagged (root `CHANGELOG.md` now says so).

### Workstreams

**R0 — Gate truth (first; small, high leverage).** Fix defects 1–5 and 7.
Order: engine-loader skip-list (un-reds two CI gates at a stroke), then the
dep-bump verify+commit, then clippy debt, then the checkout-pin guards, the
es-modules diagnosis, and the `bin/test` no-DB behaviour.

**R1 — CI completeness and efficiency.** Wire every AGENTS.md verify gate
into CI (defect 6) — checkout-dependent ones need either the pin cloned in CI
or a vendored-snapshot comparison mode. Then efficiency: per-PR changed-forms
detection for the Rust/Svelte shards (full matrix on nightly + main), pnpm
store caching, and a scheduled `cargo deny` advisories job so 355 identical
dependency sets get one currency signal. Add dependabot for the two
workflows' actions and the site.

**R2 — Professionalization.** Issue templates + PR template (with the AI
disclosure checkbox), tag the first release (`v1.0.0` per GOVERNANCE.md,
drawing notes from `CHANGELOG.md` `[Unreleased]`), document branch-protection
/ required-checks settings in GOVERNANCE.md, set GitHub repo
description/topics from `NEWS.md`'s fact sheet, and decide (maintainer call,
recorded in the spec) on: Zenodo DOI for `CITATION.cff`, and whether the
CC BY-NC-SA licence remains right for a code corpus (`COMPARISONS.md` names
it as a weakness — a decision item, not a recommendation).

**R3 — Functionality carry-overs (from Round 1 Phases 3/6, still open).**
Form export/import (JSON/XML/CSV/TSV — the Conventions section promises it);
Loco per-crate seed + serve-OpenAPI second half; personas from 109 → all
scorable forms (unblocked by R0's loader fix); `example-invalid.json` +
validation-error assertions; API transcripts; examples gallery on the site;
the latent snake_case↔camelCase API contract; i18n past the pilot.

**R4 — Optimizations (measured, not guessed — see BENCHMARKS.md).**
Document a shared `CARGO_TARGET_DIR` + sccache for local dev (355 `target/`
dirs is tens of GB); note that the 45-theme × 710-copy CSS catalogue is
byte-identical across forms (git stores ~90 blobs — repo cost is fine, the
working tree and file-count cost is the debatable part; curate the theme set
only if a real need appears); add the Svelte E2E sweep to the nightly job
alongside HTML.

### Sequencing

R0 strictly first — extending CI (R1) before the gates tell the truth would
enshrine red. R1 before R3's mechanical rollouts (land against green,
CI-enforced gates). R2 any time after R0. R4 opportunistic.

---

## Plan — major improvements (2026-07)

Roadmap for the next round of work on the medical-forms monorepo:
capabilities, functionality, documentation, tutorials, and examples.
Companion file: [`tasks.md`](tasks.md) holds the executable task checklist.

### Execution progress (2026-07-12 → 07-13)

**See [`tasks.md`](tasks.md) "Status summary" for the current, authoritative
state** (Phases 0/1/4/5 done; 2 done bar oracle-dependent `expected` blocks; 3
partial; 6 at 108 personas), plus the full audit-fix-gate log (81 mangled SQL
migrations, 170 READMEs, a stub dashboard, missing controllers, 135 stale docs,
1652 false-positive tests, a ~4000-test seed regression, and invalid
OpenAPI/protobuf — each fixed and gated). The original 07-12 highlights follow.

Phases 0, 1, 4, 5 are **complete**; Phase 2 is complete except the
engine-oracle-dependent fixture `expected` blocks; Phases 3 and 6 are
**assessed and de-risked but not rolled out** (they are genuine per-form batch
work — see the notes under each in [`tasks.md`](tasks.md)). Highlights:

- **Repair (Phase 0):** `forms.tsv` regenerated (124→286) via a new
  `bin/generate-forms-tsv.py --check`; stray root route dirs removed; both
  Lily-Svelte TODO forms brought to canonical PASS (286/286); orthopedic
  spelling decision recorded. **Found + fixed a latent bug:** 81
  `92_create_table_*_grade_flag` migrations had lost their `.sql` extension
  (commit 40794d6d4), silently dropping a table from `schema.sql`, the SQL
  gate, protobuf, and OpenAPI — restored and validated (286/286 SQL apply).
- **CI (Phase 1):** `ci.yml` fully rewritten — structure, drift (all
  `--check` gates), SQL-apply (Postgres service), FHIR (HL7 validator),
  8-way-sharded Rust and Svelte matrices, nightly E2E. New tools:
  `bin/test-examples-conformance`, `bin/forms-shard`, `bin/generate-tools-doc.py`.
  Added the 4 missing Svelte engine test suites (286/286 covered).
- **E2E + a11y (Phase 2):** shared Playwright + axe-core harness at `e2e/`
  (`bin/test-e2e`). Fixed a near-universal WCAG contrast failure and the
  remaining palette debt: **286/286 HTML front-ends now pass** smoke + a11y
  (from ~2 at the start).
- **Docs + tutorials (Phases 4–5):** `CONTRIBUTING.md`, a 13-file `arc42/`,
  an 11-file `docs/` suite, and 6 runnable `docs/tutorials/` with a
  `bin/test-tutorials` doc-rot gate.

### Current status (verified 2026-07-12)

The build-out phase is essentially complete. Coverage is uniform:

- **286 form directories** in `forms/`, every one with: `index.md`, `spec/`,
  `doc/`, `CHANGELOG.md`, `examples/`, `sql/` migrations, generated `xml/`,
  `fhir/r5/`, `protobuf/`, `openapi/`, `front-end-with-html/` (index +
  dashboard), `front-end-with-svelte/`, and a `back-end-with-loco/` crate.
- Lily Svelte conformance: **284 PASS / 2 TODO**
  (`agile-consulting-scorecard-for-hiring-help`,
  `objectives-and-key-results-tracker`).
- 283/286 Svelte front-ends have Vitest test files; all Loco crates have a
  `tests/` directory; the crate-compile batch last ran fully green.
- `bin/test`, the generator suite, and the Lily drift detectors are in place
  and idempotent on a clean checkout.

So the leverage now is **not** more scaffolding — it is (0) fixing the drift
that accumulated during the build-out, (1) making CI actually prove what the
repo claims, (2) deepening runtime functionality, and (3) making the repo
teachable: documentation, tutorials, richer examples.

### Known defects (found during this planning pass — fix first)

1. **`forms.tsv` is stale**: 124 rows vs 286 forms, so
   `bin/forms-as-kebab-case` (and anything built on it) sees fewer than half
   the repo. It should be generated from `forms/*/` with a `--check` drift
   gate like the other generators.
2. **`.github/workflows/ci.yml` is stale**: the generators job calls
   `bin/generate-xml-representations.py` and validates
   `forms/*/xml-representations/` and `forms/*/fhir-r5/` — all pre-reorg
   paths (now `bin/xml-representations/…`, `forms/*/xml/`, `forms/*/fhir/r5/`).
   That job cannot be passing meaningfully.
3. **Stray route directories at repo root**:
   `glasgow-blatchford-bleeding-scores/[id]/` and
   `substance-abuse-assessments/[id]/` are misplaced Svelte route dirs that
   escaped `forms/<slug>/front-end-with-svelte/src/routes/`.
4. **Two Lily-Svelte TODO forms** (named above) never got the canonical UI.
5. **`arc42/` is empty** and there is no `CONTRIBUTING.md`; `docs/` holds
   only `rust/` — no architecture, authoring, or usage documentation
   despite `spec.md` §1 promising a teachable shared design.

### Workstreams

#### WS0 — Repair & hygiene (prerequisite)

Fix the five defects above. Make `forms.tsv` a generated artefact
(`bin/generate-forms-tsv.py [--check]`) so it can never rot again, and wire
the `--check` into `bin/test` and CI.

#### WS1 — Capabilities: CI and verification depth

CI today runs structure validation plus a broken generators job. Target: CI
proves every claim the repo makes about itself.

- Rewrite `ci.yml` for the current layout; run **all** drift detectors
  (`lily-html-refactor --check --all`, `lily-svelte-refactor --check --all`,
  both `lily-*-sync --check`, `generate-llms-txt.py --check`,
  `generate-spec.py --check`, `generate-changelog-and-examples.py --check`,
  `loco-config-refactor --check --all`, new `generate-forms-tsv.py --check`).
- Add the SQL apply gate (`bin/test-sql-apply`) using a Postgres service
  container — this is the executable source-of-truth check.
- Add a sharded Rust job: `cargo check` + `cargo clippy -- -D warnings` +
  `cargo test` across the 286 crates (matrix-sharded; cached).
- Add a sharded Svelte job: `npm ci && npm run check && npm run build &&
  npx vitest run` per form (matrix-sharded; cached).
- Add real FHIR validation: run generated `fhir/r5/*.json` and the
  `examples/` Bundles through the official HL7 FHIR validator (or a pinned
  `fhir-validator` container) instead of the current "has resourceType"
  check.
- Add a fixture-conformance checker: every `examples/*.json` filled-form
  fixture must match the form's schema (field names/types derived from
  `sql/`), so examples can't drift from migrations.

#### WS2 — Capabilities: end-to-end and accessibility testing

There are currently **zero** Playwright configs in the repo.

- Build one shared Playwright harness (repo root, not per-form) that, for a
  given slug, serves the HTML front-end and the built Svelte front-end,
  loads the `examples/` fixture, drives the single-page wizard to
  completion, and asserts the rendered score/flags against expected values
  recorded in the fixture.
- Add expected-output fields (score, grade, flags) to every `examples/`
  fixture so the harness has an oracle.
- Integrate axe-core into the same harness run; gate on zero serious/critical
  violations per form page and dashboard.
- CI runs the full sweep nightly and a changed-forms subset per PR.

#### WS3 — Functionality: runtime features across all forms

The conventions section promises import/export via JSON, XML, CSV, TSV —
make that uniformly true, plus the long-standing UX items:

- **Import/export**: JSON + XML + CSV + TSV export of a completed form, and
  JSON import to re-populate the wizard, in both HTML and Svelte front-ends.
  Implement once as a shared pattern, roll out mechanically.
- **Autosave**: localStorage persistence with restore-on-load and explicit
  clear, in both front-ends.
- **Print-friendly report CSS** for the report/summary step.
- **Dashboard export**: CSV/TSV download from every dashboard.
- **Back-end seed data**: a seeder per crate loading the `examples/` fixture,
  so `cargo loco …` boots with demo rows; API integration test that POSTs the
  fixture and GETs it back.
- **Serve OpenAPI**: each crate serves its own `openapi/*.yaml` at
  `/api/openapi.yaml` (spec-first; no drift).
- **i18n scaffold**: extract UI strings behind a minimal i18n layer; ship
  Welsh for one pilot form (the Cymraeg-relevant one) to prove the shape.

#### WS4 — Documentation

- Populate `arc42/` with a real arc42 architecture document (context,
  building blocks = the per-form layout, runtime views = wizard/scoring/
  report flow, deployment, cross-cutting concepts = Lily/generators/spec-
  driven workflow, quality scenarios, ADRs for the big decisions already
  made: relational-per-table Loco schema, route nesting, HTML consolidation).
- Write `CONTRIBUTING.md`: environment setup, verify commands, spec-driven
  workflow, generated-artefact rules.
- Build `docs/` as a proper suite: `docs/architecture.md` (short pointer to
  arc42), `docs/data-model.md`, `docs/generator-pipeline.md` (SQL → XML/FHIR/
  protobuf/OpenAPI/Loco-setup flow with diagram), `docs/scoring-engines.md`,
  `docs/lily.md` (HTML + Svelte usage and the sync/refactor tools),
  `docs/back-end.md`, `docs/verification.md` (every gate and what it proves),
  and a `docs/index.md` table of contents linked from `README.md`.
- Document every `bin/` tool in a generated `docs/tools.md` (from each tool's
  `--help`), with a `--check` drift gate.

#### WS5 — Tutorials

New `docs/tutorials/` series, each a runnable, copy-paste walkthrough,
smoke-tested by a `bin/test-tutorials` script that executes each tutorial's
fenced shell blocks:

1. **Quickstart** — clone, run one form's HTML front-end, Svelte front-end,
   and Loco API locally (includes the scratch-Postgres recipe).
2. **Build a new form end-to-end** — `bin/create-form` through generators,
   front-ends, back-end, and `bin/test-form`, following the standard
   workflow; use a small worked example (e.g. a 5-question screening score).
3. **Author a scoring engine** — pure engine + Vitest tests + golden vectors.
4. **The generator pipeline** — change a SQL column, regenerate, watch XML/
   FHIR/protobuf/OpenAPI update; what `--check` gates catch.
5. **Consume the API** — curl walkthrough against a seeded crate, mapped to
   the OpenAPI spec; FHIR Bundle export.
6. **Customize Lily** — theming and the sync/refactor/status tools.

#### WS6 — Examples

Today each form has one filled-form fixture + one FHIR Bundle. Deepen:

- **Three personas per form**: `minimal` (only required answers), `typical`,
  and `high-risk`/`flagged` (triggers the form's safety flags), each with
  expected score/flags recorded (these become the E2E oracles from WS2).
- **One invalid fixture per form** with the expected validation errors.
- **CSV and TSV export samples** matching the typical persona.
- **API transcripts**: recorded request/response pairs for create/read
  against the Loco crate.
- Extend `bin/generate-changelog-and-examples.py --check` to cover the new
  files; scaffold mechanically, then fill domain-specific values in batches.
- Add an examples gallery page to the `formexamples.github.io` site.

### Sequencing

- **WS0 first** (small, unblocks everything; CI must be trustworthy before
  it is extended).
- **WS1 → WS2** next: verification before features, so WS3's mechanical
  rollouts land against green gates.
- **WS6 personas before WS2 assertions** (the fixtures are the E2E oracle),
  so interleave: WS6 fixture schema → WS2 harness → WS6 full fill-out.
- **WS4/WS5** can proceed in parallel with anything after WS0.

### Execution conventions (for the Opus run)

- Work directly on `main`; avoid `.claude/worktrees/` (they vanish in this
  repo). Batch mechanical per-form work into parallel foreground subagents,
  5–6 per turn, with spot-checks between batches.
- Shared patterns (import/export, autosave, harness) get designed once on a
  reference form (`cardiology-request`, `pre-operative-assessment-by-clinician`),
  reviewed, then rolled out mechanically with a `--check`-style drift tool
  where feasible.
- Generated artefacts are never hand-edited; every new generator gets a
  `--check` mode wired into `bin/test` and CI.
- After each phase: `bin/test`, `bin/test-sql-apply`, all `--check` gates,
  and update `tasks.md` checkboxes plus per-form `CHANGELOG.md` where a
  form's behaviour changed.
