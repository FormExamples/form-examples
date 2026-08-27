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
- `bin/test-vendored-uniformity [--verbose]` — verify the vendored theme catalogues (both stacks) and the five Lily Svelte helper components + `locales.ts` are byte-identical across every form. The CI-checkable half of the checkout-reading sync tools' invariant: fleet uniformity runs everywhere, upstream currency stays a maintainer-run check against the pinned checkout
- `bin/test-e2e [--html] [--svelte] [--all|<slug>…]` — Playwright smoke + axe-core accessibility sweep over form front-ends
- `bin/test-tools` — smoke-test every Lily-system tool's `--check` / `--counts` / `--help` modes
- `bin/create-form <slug>` — scaffold a new form directory
- `bin/update` — run the `update / upgrade / fix / harmonize / audit / test` Claude Code prompt against the repo
- `bin/generate-forms-tsv.py [--check]` — generate `forms.tsv`, the case-conversion lookup table read by `bin/forms-as-kebab-case` and friends
- `bin/generate-tools-doc.py [--check]` — generate `docs/tools.md` from every `bin/` tool's self-documenting header

### SQL

- `bin/migrate-sql-filenames.py` — one-shot migration of each form's `sql/` to the canonical `NN_create_table_<name>.sql` layout
- `bin/sql/generate-sql-comments.py` — append missing `COMMENT ON TABLE` / `COMMENT ON COLUMN` to numbered SQL migrations
- `bin/sql/generate-sql-combined.py` — combine each form's numbered SQL migrations into `schema.sql`

### Loco back-end refactor

- `bin/loco-config-refactor [--check] [--dry-run] [--all|<slug>]` — mechanical Loco crate refactor for the canonical background-queue (Postgres only; drops `bg_sqlt` / `bg_redis`) and observability (OpenTelemetry + Prometheus `/metrics`) conventions; `--check` is the CI drift detector
- `bin/loco-migration-defaults [--check] [--dry-run] [--verbose] [--all|<slug>…]` — mirror each form's `sql/` column defaults into its `back-end-with-loco/migration/` as `ColType::*WithDefault`. `cargo loco generate scaffold` cannot express defaults, so every generated migration drops them and the back-end schema silently disagrees with `sql/`, its own source of truth; re-run after any re-scaffold. `--check` is the CI drift detector
- `bin/loco-migration-nullability [--check] [--dry-run] [--verbose] [--all|<slug>…]` — restore each form's `sql/` column nullability across the migration, the entity, and the controller's `Params` (all three must move together). Loco has no nullable-unique `ColType`, so `StringUniq` forced nullable UNIQUE columns such as `united_kingdom_nhs_number` to `NOT NULL UNIQUE` — which admits only **one** row without the identifier, the rest colliding on `''`. Uniqueness is re-expressed as an explicit unique index. `--check` is the CI drift detector
- `bin/generate-loco-deny-config.py [--check] [<slug>…]` — write each Loco crate's `deny.toml` (cargo-deny advisories/licenses/bans/sources policy); `--check` is the CI drift detector. Run `cargo deny --all-features check` from inside a crate to execute the policy
- `bin/loco-forbid-unsafe [--check] [--dry-run] [--verbose] [--all|<slug>…]` — add `#![forbid(unsafe_code)]` to every crate root in each form's `back-end-with-loco/`: the library, the `-cli` binary, the `migration` library, and the integration-test target (four per form; the attribute is per crate root, not per file). Nothing in these crates needs `unsafe`, and `forbid` — unlike `deny` — cannot be reopened by a later inner `allow`. `cargo loco generate scaffold` does not emit the attribute, so each form's generated `back-end-with-loco-setup` script calls this tool as its final step; `--check` is the CI drift detector
- `bin/loco-seed-base-rename [--check] [--dry-run] [--all|<slug>…]` — rename the unused `base` param in every crate's `App::seed()` to `_base`. `loco new` scaffolds `seed(ctx: &AppContext, base: &Path)` and never uses `base` (fixtures load via `env!("CARGO_MANIFEST_DIR")` instead), so `cargo clippy --all-targets -- -D warnings` failed 346/355 crates — a fleet-wide, CI-breaking scaffold bug discovered when CI's Rust job was checked and found to have never gone green. `back-end-with-loco-setup` calls it as a final step so a newly scaffolded crate is never affected; `--check` is the CI drift detector
- `bin/loco-test-auth-header-fix [--check] [--dry-run] [--all|<slug>…]` — drop the redundant `&` in every crate's test `auth_header()` helper (`format!("Bearer {}", &token)` where `token: &str` is already a reference). Same `loco new` scaffold-bug class as `loco-seed-base-rename`, found alongside it (346/355 crates); wired into the same setup-script step; `--check` is the CI drift detector
- `bin/loco-rs-1-migration [--check] [--dry-run] [--all|<slug>…]` — one-shot loco-rs 0.16 → 1.0.1 major-version migration: `Cargo.toml`/`migration/Cargo.toml` version bumps, the `auth_jwt`/`bg_pg` → `auth`/`worker` feature rename, and every `id`/`*_id` entity, controller `Params`, `Path<i32>`, and hand-written helper moved `i32` → `i64` (loco-rs 1.0's `ColType::PkAuto` now renders `BIGINT`). Applied fleet-wide 2026-08-02; `--check` confirms no crate is still on 0.16

### Generators (SQL → derived representations)

- `bin/xml-representations/generate-xml-representations.py` — generate XML and DTD per SQL table entity
- `bin/fhir-r5/generate-fhir-r5-representations.py` — generate FHIR HL7 R5 JSON per SQL entity
- `bin/protobuf/generate-protobuf-representations.py` — generate Protocol Buffers `.proto` schemas per SQL entity
- `bin/openapi/generate-openapi-representations.py` — generate OpenAPI 3.1 `.yaml` specifications per SQL entity
- `bin/back-end-with-loco/generate-back-end-with-loco-setup.py [--check] [<slug>…]` — emit each form's `cargo loco generate scaffold --api` setup script; `--check` is the CI drift detector
- `bin/back-end-with-loco/generate-rust-docs.py <crate>…` — insert rustdoc (crate `//!`, module headers, `///` on every `pub` item) so each Loco crate compiles under `#![deny(missing_docs)]`; idempotent
- `bin/generate-changelog-and-examples.py [--check] [<slug>…]` — scaffold per-form `CHANGELOG.md` and `examples/` (filled-form JSON fixture + FHIR R5 Bundle); `--check` is the CI drift detector

### Lily Design System (HTML front-ends)

- `bin/es-modules-refactor [--check] [--dry-run] [--all|<slug>…]` — convert each form's `front-end-with-html/` JavaScript from the classic `window.<Namespace>` global-sharing pattern to native ES modules (`import`/`export` + `<script type="module">`); `--check` is the CI drift detector. See [`spec/es-modules.md`](spec/es-modules.md)
- `bin/es-modules-decomment [--apply] [file…]` — one-shot (already applied): strip the stale IIFE/namespace/classic-script comments the ES-module conversion left behind; comment-only, idempotent
- `bin/lily-html-refactor [--check] [--dry-run] [--scope=form|dashboard|both] [--all|<slug>]` — mechanical Lily HTML class swaps; `--check` is the CI drift detector
- `bin/lily-sync [--check] [--lily-dir PATH]` — snapshot Lily HTML component specs into `forms/lily-spec/` and record the pinned upstream commit in `forms/lily-version.md`
- `bin/html-theme-locale-select-refactor [--check|--apply] [--lily-dir PATH]` — vendor the Lily multi-theme CSS catalogue into `css/themes/`, alias each form's `css/style.css`/`css/dashboard.css` tokens onto it, and add header theme-select + locale-select controls; re-syncs the theme catalogue from the pinned checkout on every run (independent of whether the header-control patch itself changed anything); `--check` is the CI drift detector
- `bin/svelte-pnpm-workspace-fix [--check] [--dry-run] [--all|<slug>…]` — fix every form's `front-end-with-svelte/pnpm-workspace.yaml`: add the `packages: ['.']` key pnpm 9 requires (missing fleet-wide; the CI-pinned pnpm rejects the file outright without it — `ERROR packages field missing or empty` — while the maintainer's local pnpm 11 tolerated the omission, which is why this went unnoticed) and normalize `allowBuilds.esbuild` to `true` (32 files carried a stray unfilled template string, 1 carried `false`). `--check` is the CI drift detector
- `bin/svelte-theme-css-sync [--check|--apply] [--lily-dir PATH]` — re-sync the same 45 reference theme stylesheets into every form's `front-end-with-svelte/static/themes/`; `--check` is the CI drift detector
- `bin/svelte-date-time-picker-vendor [--check|--apply]` — vendor `DateTimePicker.svelte`, the fifth Lily Svelte helper, into every form's `front-end-with-svelte/src/lib/components/ui/`; vendor-only, not wired into any layout/route — the existing `DateInput.svelte` (native `<input type="date">`) stays the actual date field in every form. `--check` is the CI drift detector
- `bin/html-date-time-picker-vendor [--check|--apply]` — add the hand-authored `js/date-time-picker.js` (this repo's vanilla-JS reimplementation of the same helper, matching the `share-picker.js`/`text-size-picker.js` style rather than Lily's custom-element package) to every form's `front-end-with-html/js/`; byte-identical across forms (no persistence, so no per-form storage key to template), vendor-only and unwired, same rationale as above. `--check` is the CI drift detector
- `bin/page-header-layout-refactor [--check|--apply]` — re-layout each HTML front-end's page header so the title sits left and the nav link(s) + select controls sit right (`.page-header-bar` / `.page-header-title`); `--check` is the CI drift detector
- `bin/html-text-size-select-refactor [--check|--apply]` — one-shot (superseded): originally added the third header control as `#text-size-select`; renamed to `#text-size-chooser` by `bin/html-helpers-chooser-rename`, then to `#text-size-picker` by `bin/html-helpers-picker-rename` below, which is now the canonical drift detector for it. This tool's `--check` still looks for the pre-rename `#text-size-select` id, so it always reports false drift post-rename — do not run it as a CI gate
- `bin/html-share-button-refactor [--check|--apply]` — one-shot (superseded): originally added the fourth header control as `.share-button`; renamed to `.share-chooser` by `bin/html-helpers-chooser-rename`, then to `.share-picker` by `bin/html-helpers-picker-rename` below, which is now the canonical drift detector for it. This tool's `--check` still looks for the pre-rename `.share-button` markup, so it always reports false drift post-rename — do not run it as a CI gate

### Lily Design System (Svelte front-ends)

- `bin/lily-svelte-refactor [--check] [--dry-run] [--scope=form|dashboard|both] [--show-risky] [--all|<slug>]` — mechanical Lily Svelte class swaps + risky-pattern report; `--check` is the CI drift detector
- `bin/lily-svelte-status [--counts] [--slugs-only] [--status=PASS|PARTIAL|TODO|EMPTY]` — per-form Lily Svelte conformance report (PASS = canonical UI; PARTIAL = legacy names but Lily classes; TODO = no Lily yet; EMPTY = no implementation)
- `bin/lily-svelte-sync [--check] [--lily-dir PATH]` — snapshot Lily Svelte component sources into `forms/lily-svelte-spec/` and record the pinned upstream commit in `forms/lily-svelte-version.md`
- `bin/svelte-locale-select-refactor [--check|--apply]` — add a hand-authored LocaleSelect control (before ThemeSelect) to every form's root layout header; `--check` is the CI drift detector
- `bin/lily-svelte-theme-locale-select-refactor [--check|--apply]` — one-shot (superseded): migrated ThemeSelect/LocaleSelect from the old native-`<select>` pattern to the `lily-design-system-svelte-helpers` headless button+listbox pattern (fully applied, pin recorded in [`forms/lily-svelte-helpers-version.md`](forms/lily-svelte-helpers-version.md)). Its `--check` also verifies an `app.css` marker block using the pre-rename `.lily-theme-select`/`.lily-locale-select` class names, which the `*-chooser` rename changed to `.theme-chooser`/`.locale-chooser`, and the later `*-picker` rename changed again to `.theme-picker`/`.locale-picker` — so `--check` always reports false drift now. Do not run it as a CI gate
- `bin/svelte-text-size-select-refactor [--check|--apply]` — one-shot (superseded): originally added the third header control as `TextSizeSelect`; renamed to `TextSizeChooser` by `bin/svelte-helpers-chooser-rename`, then to `TextSizePicker` by `bin/svelte-helpers-picker-rename` below, which is now the canonical drift detector. This tool's `--check` still looks for the pre-rename `TextSizeSelect` component, so it always reports false drift post-rename — do not run it as a CI gate
- `bin/svelte-share-button-refactor [--check|--apply]` — one-shot (superseded): originally added the fourth header control as `ShareButton`; renamed to `ShareChooser` by `bin/svelte-helpers-chooser-rename`, then to `SharePicker` by `bin/svelte-helpers-picker-rename` below, which is now the canonical drift detector. This tool's `--check` still looks for the pre-rename `ShareButton` component, so it always reports false drift post-rename — do not run it as a CI gate
- `bin/svelte-helpers-chooser-rename [--check|--apply]` — one-shot (superseded): renamed the four Svelte helper controls from `*Select`/`ShareButton` to `*Chooser`, matching upstream's then-current `*-select`/`share-button` → `*-chooser` package rename (reads fresh component source from the pinned checkout at apply time). Superseded by `bin/svelte-helpers-picker-rename` below, since upstream has since renamed `*-chooser` → `*-picker`; this tool's `--check` looks for the pre-rename `*Select`/`ShareButton` components, none of which exist any more, so it always reports false drift — do not run it as a CI gate
- `bin/html-helpers-chooser-rename [--check|--apply]` — one-shot (superseded): the HTML-side half of the same rename: `#text-size-select`→`#text-size-chooser`, `.share-button`→`.share-chooser`. Superseded by `bin/html-helpers-picker-rename` below; do not run it as a CI gate
- `bin/svelte-helpers-picker-rename [--check|--apply]` — rename the four Svelte helper controls from `*-chooser` to `*-picker` names, matching upstream's `*-chooser` → `*-picker` package rename ("to harmonize with Adobe"; reads fresh component source from the pinned checkout at apply time); `--check` is the CI drift detector
- `bin/html-helpers-picker-rename [--check|--apply]` — the HTML-side half of the same rename: `text-size-chooser`→`text-size-picker`, `share-chooser`→`share-picker`. `#theme-select`/`#locale-select` are untouched (they mirror the unrelated, never-renamed catalog components); `--check` is the CI drift detector
- `bin/svelte-test-result-theming-backport [--check|--apply] [--lily-dir PATH]` — one-shot: backport the gold-standard Lily theme system (oklch tokens, `static/themes/`, ThemeSelect) to the `*-test-result` family, which predates the theming rollout; run `bin/svelte-locale-select-refactor` afterwards
- `bin/svelte-kit-3-theme-url-fix.py [--check|--apply]` — one-shot: fix the `sv migrate sveltekit-3` codemod's fleet-wide `themesUrl={resolve(\`themes/\`)}` mistake in every form's root `+layout.svelte` (SvelteKit 3's typed `resolve()`/`asset()` can't express a runtime-selected theme-directory prefix; no form configures `kit.paths.base`, so the pre-migration value was always the literal `/themes/`) and delete the resolved `MIGRATION_TASKS.md`; `--check` is the CI drift detector

### Specs

- `bin/generate-llms-txt.py [--check] [<slug>…]` — generate per-form `llms.txt` (llmstxt.org format, derived from `index.md`); `--check` is the CI drift detector
- `bin/generate-spec.py [--check] [--force] [<slug>…]` — scaffold per-form `spec/index.md` (hand-maintained living domain spec, seeded from `index.md`; never overwritten unless `--force <slug>`); `--check` verifies every form has a non-empty spec + README symlink

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
bin/svelte-kit-3-theme-url-fix.py --check      # Svelte sv-migrate themesUrl-fix drift detector (one-shot)
bin/svelte-date-time-picker-vendor --check     # Svelte date-time-picker vendor drift detector (vendor-only, unwired)
bin/html-date-time-picker-vendor --check       # HTML date-time-picker vendor drift detector (vendor-only, unwired)
bin/page-header-layout-refactor --check        # HTML page-header title-left/controls-right drift detector
bin/svelte-helpers-picker-rename --check      # Svelte *-chooser -> *-picker rename drift detector (supersedes svelte-helpers-chooser-rename / svelte-text-size-select-refactor / svelte-share-button-refactor, below)
bin/html-helpers-picker-rename --check        # HTML text-size-chooser/share-chooser -> *-picker rename drift detector (supersedes html-helpers-chooser-rename / html-text-size-select-refactor / html-share-button-refactor, below)
# bin/svelte-helpers-chooser-rename --check    # one-shot, superseded by svelte-helpers-picker-rename — always false-positives post-rename; do not run as a CI gate
# bin/html-helpers-chooser-rename --check      # one-shot, superseded by html-helpers-picker-rename — always false-positives post-rename; do not run as a CI gate
# bin/html-text-size-select-refactor --check   # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/svelte-text-size-select-refactor --check # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/html-share-button-refactor --check       # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/svelte-share-button-refactor --check     # one-shot, superseded — always false-positives post-rename; do not run as a CI gate
# bin/lily-svelte-theme-locale-select-refactor --check # one-shot, superseded — app.css marker check uses pre-rename class names; do not run as a CI gate
bin/generate-llms-txt.py --check      # Per-form llms.txt drift detector
bin/generate-spec.py --check          # Per-form spec/ presence check (specs are hand-maintained)
bin/generate-changelog-and-examples.py --check # CHANGELOG + examples/ drift detector
bin/back-end-with-loco/generate-back-end-with-loco-setup.py --check # Loco setup-script drift detector
bin/loco-config-refactor --check --all # Loco background-queue + observability drift detector
bin/generate-loco-deny-config.py --check # Loco deny.toml drift detector
bin/loco-forbid-unsafe --check --all # Loco #![forbid(unsafe_code)] crate-root drift detector
bin/loco-seed-base-rename --check --all # Loco seed() unused-base-param drift detector
bin/loco-test-auth-header-fix --check --all # Loco test auth_header() redundant-& drift detector
bin/loco-migration-defaults --check --all # Loco migration vs sql/ column-default drift detector
bin/loco-migration-nullability --check --all # Loco migration/entity/controller vs sql/ nullability drift detector
bin/loco-rs-1-migration --check --all # Loco 0.16 -> 1.0.1 migration completeness check (one-shot)
bin/generate-forms-tsv.py --check     # forms.tsv drift detector
bin/generate-tools-doc.py --check     # docs/tools.md drift detector
bin/test-examples-conformance         # example fixtures vs sql/ schema conformance
bin/test-vendored-uniformity          # vendored themes + Svelte helpers byte-identical fleet-wide
bin/test-e2e --html                   # Playwright smoke + axe-core a11y sweep (HTML)
```

Per-crate (each `forms/<slug>/back-end-with-loco/`, run in CI as part of the sharded Rust job):

```sh
cargo deny --all-features check       # supply-chain policy: advisories, licenses, bans, sources
```
