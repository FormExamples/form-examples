# Quality Improvement Tasks for AI (form-examples)

This is a **360-form medical monorepo** with a full stack per form: SQL → generated representations (XML, FHIR R5, Protocol Buffers, OpenAPI) → HTML + SvelteKit front-ends → Rust axum back-end. Uniformity across all forms is the core value proposition.

Below are **prioritized, actionable tasks** grouped by objective. Each task is designed for **AI execution** (automation, generation, analysis, verification) with clear acceptance criteria.

---

---

## 🎯 **Category 1: New Visitor Help, Promotion & Upskilling**

*Goal: Lower the barrier to entry, increase visibility, and help users learn the codebase and domain.*

### **P0: Critical Onboarding Gaps**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **1.1** | **Create an interactive form catalog** | High | Medium | ✅ AI-generated | `forms/index.html` with searchable/filterable table of all 360 forms: name, category, description (from `index.md`), tags. Use existing `bin/forms-as-kebab-case` as data source. |
| **1.2** | **Generate a "Getting Started in 5 Minutes" guide** | High | Low | ✅ AI-generated | New `docs/quickstart-5min.md` with: clone → pick a form → run HTML front-end locally (no build step) → try it. Zero prerequisites. |
| **1.3** | **Create a visual architecture diagram** | High | Low | ✅ AI-generated | `docs/architecture-diagram.md` with Mermaid diagrams: per-form stack, cross-form generators, CI pipeline. Link from `docs/architecture.md`. |
| **1.4** | **Generate per-form "Try It Now" badges** | High | Low | ✅ AI-generated | For each form, generate markdown badge in `forms/<slug>/README.md` linking to live HTML (GitHub Pages). Script: `bin/generate-try-badges.py`. |
| **1.5** | **Build a contribution path finder** | High | Medium | ✅ AI-generated | `CONTRIBUTING.md` addendum: interactive quiz ("I know: [SQL][Rust][Svelte][HTML][Clinical]") → suggests tasks from open issues or `tasks.md` across forms. |

### **P1: Documentation & Discovery**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **1.6** | **Generate per-form one-paragraph summaries** | High | Medium | ✅ AI-generated | Extract from each `forms/<slug>/index.md` first paragraph. Create `forms/SUMMARIES.md` with alphabetical list. Use for search, catalog. |
| **1.7** | **Create a "Form of the Week" blog series** | Medium | Low | ✅ AI-generated | `docs/blog/form-of-the-week/` with 8-10 highlight forms (clinical significance + implementation notes). Auto-generate from `index.md` + `CHANGELOG.md`. |
| **1.8** | **Generate comparison tables for similar forms** | Medium | Medium | ✅ AI-generated | Identify form families (e.g., all cardiovascular risk calculators, all symptom scales). Create comparison tables in `COMPARISONS.md` addendum. |
| **1.9** | **Add clinical domain tags to all forms** | Medium | Medium | ✅ AI-generated | Parse `forms/AGENTS.md` index + each form's `index.md` to auto-tag: `[Cardiology]`, `[Oncology]`, `[Psychiatry]`, `[Pre-op]`, etc. Add to `forms/<slug>/index.md` frontmatter. |
| **1.10** | **Create a glossary of clinical terms** | Medium | High | ✅ AI-generated | Extract all acronyms (PHQ-9, GAD-7, KDIGO, ECOG, NYHA, etc.) from form docs. Create `docs/glossary.md` with definitions and links to source forms. |
| **1.11** | **Generate language statistics** | Low | Low | ✅ AI-generated | Count: forms with i18n support, lines of SQL, lines of TypeScript, lines of Rust per form. Update `BENCHMARKS.md`. |
| **1.12** | **Create a "Contribution Bingo" card** | Low | Low | ✅ AI-generated | Gamified onboarding: 25 squares (fix a typo in doc/, run `bin/test-form`, add a SQL comment, etc.). `docs/CONTRIBUTING-bingo.md`. |

### **P2: Promotion & External Visibility**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **1.13** | **Generate Open Graph meta tags for GitHub Pages** | High | Low | ✅ AI-generated | Ensure `formexamples.github.io/` has proper OG tags. Script to inject into all HTML front-ends. |
| **1.14** | **Create shareable demo links** | High | Low | ✅ AI-generated | For each form, ensure HTML front-end works on GitHub Pages. Generate `forms/<slug>/demo-url.md` with direct links. |
| **1.15** | **Generate a project pitch deck** | Medium | Medium | ✅ AI-generated | `docs/pitch-deck.md` (markdown slides) for conferences, meetups. Highlights: scale, uniformity, clinical coverage, tech stack. |
| **1.16** | **Create a "Powered by form-examples" badge** | Medium | Low | ✅ AI-generated | SVG badge + markdown for users to add to their projects. Host in `assets/badges/`. |
| **1.17** | **Generate a press kit** | Medium | Medium | ✅ AI-generated | `docs/press-kit.md`: project description (100/250/500 chars), key stats, screenshots (links), contact info, license summary. |
| **1.18** | **Create a Hacktoberfest participation guide** | Medium | Low | ✅ AI-generated | `docs/hacktoberfest.md`: labeled issues, how to claim, verification steps. |
| **1.19** | **Generate a "Good First Issue" label automation** | Medium | Medium | ✅ AI-generated | Script: scan all `forms/<slug>/tasks.md` for `[ ]` items, create GitHub issues with `good-first-issue` label + form context. |

### **P3: Upskilling & Learning**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **1.20** | **Create a learning path for each tech stack** | High | Medium | ✅ AI-generated | `docs/learning-paths/`: HTML/Lily, SvelteKit/Lily, Rust/Axum, SQL. Each: beginner → advanced with project tasks. |
| **1.21** | **Generate "How It Works" deep dives** | High | Medium | ✅ AI-generated | `docs/how-it-works/` series: scoring engines, generator pipeline, Lily sync, Axum scaffolding. Diagrams + code walkthroughs. |
| **1.22** | **Create a clinical instrument catalog** | Medium | High | ✅ AI-generated | `docs/clinical-instruments.md`: table of all implemented instruments with licensing info, validation studies, domains. Cross-reference with forms. |
| **1.23** | **Generate architecture decision records (ADRs)** | Medium | Medium | ✅ AI-generated | Retroactive ADRs for key decisions: why axum, why Lily, why SQL as source of truth, why 4 front-ends. `docs/adr/`. |
| **1.24** | **Create a "Pattern Library"** | Medium | High | ✅ AI-generated | `docs/patterns/`: scoring engine patterns, form step patterns, dashboard patterns, API patterns. Extracted from existing forms. |
| **1.25** | **Generate a medical domain primer** | Medium | High | ✅ AI-generated | `docs/medical-primer.md`: explain common concepts (risk scores, symptom scales, clinical assessments) for non-clinical contributors. |

---

---

## 🔧 **Category 2: Engineering, Coding, Testing & Auditing**

*Goal: Improve code quality, test coverage, automation, and maintainability across the 360-form fleet.*

### **P0: Critical Engineering Gaps**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.1** | **Run full verify suite and fix all failures** | Critical | High | ✅ AI-executable | Execute every gate in `AGENTS.md##Verify`. Document failures, root causes, and fixes. Target: 100% pass rate. |
| **2.2** | **Implement missing Axum HTTP routes** | Critical | High | ✅ AI-generated | Script: for each form, check `back-end-with-axum/src/` routes vs SQL tables. Generate missing CRUD routes. Run `bin/test-axum-routes --check`. |
| **2.3** | **Fix all SQL CHECK constraint violations in fixtures** | Critical | High | ✅ AI-executable | Run `bin/axum-fixture-checks --check --all`. Generate corrected fixture data. Re-run until green. |
| **2.4** | **Ensure all 360 forms have CHANGELOG.md** | Critical | Medium | ✅ AI-generated | Script: check `forms/<slug>/CHANGELOG.md` existence. Generate from git history + `index.md` for missing ones. |
| **2.5** | **Ensure all 360 forms have spec/index.md** | Critical | Medium | ✅ AI-generated | Run `bin/generate-spec.py --check`. Generate missing specs from `index.md` + `AGENTS.md`. |

### **P1: Code Quality & Consistency**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.6** | **Standardize all SQL comments** | High | Medium | ✅ AI-executable | Run `bin/sql/generate-sql-comments.py --check --all`. Auto-add missing `COMMENT ON TABLE`/`COLUMN` from type names. |
| **2.7** | **Harmonize Rust deny.toml across all crates** | High | Medium | ✅ AI-executable | Run `bin/generate-axum-deny-config.py --check --all`. Regenerate all `deny.toml` files. Verify with `cargo deny check`. |
| **2.8** | **Enforce #![forbid(unsafe_code)] in all crates** | High | Medium | ✅ AI-executable | Run `bin/axum-forbid-unsafe --check --all`. Add annotation to missing crates. Verify CI passes. |
| **2.9** | **Roll out request validation to all crates** | High | High | ✅ AI-executable | Run `bin/axum-request-validation --check --all`. For each failing crate, add `Validate` derive and 422 handlers. |
| **2.10** | **Ensure soft delete across all crates** | High | High | ✅ AI-executable | Run `bin/axum-soft-delete --check --all`. Add `deleted_at` columns, DELETE CASCADE, query filters. |
| **2.11** | **Migrate all crates to axa 0.14+** | High | High | ✅ AI-executable | Run `bin/axum-axa-0-14 --check --all`. Update `Cargo.toml` + lockfiles. Verify builds. |
| **2.12** | **Add cursor pagination to all list endpoints** | High | High | ✅ AI-executable | Run `bin/axum-cursor-pagination --check --all`. Replace offset pagination with cursor-based. |
| **2.13** | **Verify all SQL columns exist in Rust crates** | High | Medium | ✅ AI-executable | Run `bin/axum-sql-columns --check --all`. Add missing fields to Rust structs. |
| **2.14** | **Add CHECK constraints from SQL to all crates** | High | High | ✅ AI-executable | Run `bin/axum-check-constraints --check --all`. Migrate SQL CHECKs to Rust validation. |

### **P2: Testing & Verification**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.15** | **Generate property-based tests for scoring engines** | High | High | ✅ AI-generated | For each form's grader, generate property tests: identity, monotonicity, boundary conditions. Use `fast-check` (TS) or `proptest` (Rust). |
| **2.16** | **Expand persona test coverage** | High | Medium | ✅ AI-generated | For forms missing `examples/personas.json`, generate realistic persona states + expected grades from `index.md` spec. Run `bin/test-personas`. |
| **2.17** | **Create end-to-end test for all 360 HTML front-ends** | High | Very High | ✅ AI-executable | Extend `bin/test-e2e --html` to cover all forms. Parallelize. Target: <30 min total. |
| **2.18** | **Add SvelteKit E2E tests** | High | Very High | ✅ AI-executable | Create `bin/test-e2e --svelte` mirroring HTML tests. Use Playwright. |
| **2.19** | **Generate mutation tests for Rust crates** | Medium | Very High | ✅ AI-executable | Run `bin/mutation-test-axum --all`. Generate mutants, verify kill rate. Target: >80%. |
| **2.20** | **Add API contract tests** | High | Medium | ✅ AI-generated | For each form, generate OpenAPI-based contract tests using `openapi/` specs. Verify API conformance. |
| **2.21** | **Create performance benchmarks for all engines** | Medium | High | ✅ AI-executable | Run `bin/benchmark-engines --all --tsv`. Document slowest 10%. Optimize. |
| **2.22** | **Verify all generated artifacts are fresh** | High | Medium | ✅ AI-executable | Run all `--check` generators. Document staleness. Regenerate all stale artifacts in one commit. |
| **2.23** | **Add snapshot tests for Lily components** | Medium | Medium | ✅ AI-generated | Create snapshot tests for all Lily HTML + Svelte components. Verify no drift. |
| **2.24** | **Generate integration tests for SQL → OpenAPI → Rust** | High | High | ✅ AI-generated | For each form: verify SQL schema → OpenAPI generation → Rust struct generation round-trip preserves all fields. |

### **P3: Auditing & Security**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.25** | **Audit all crates for unsafe code** | Critical | Medium | ✅ AI-executable | Run `bin/axum-forbid-unsafe --check --all`. Flag any `unsafe` blocks. Create issues. |
| **2.26** | **Scan all dependencies for vulnerabilities** | Critical | Medium | ✅ AI-executable | Run `cargo audit` + `cargo deny check` on all 356 crates. Document findings. Update `deny.toml` bans. |
| **2.27** | **Verify all licenses are compatible** | High | Medium | ✅ AI-executable | Run `cargo deny check --licenses`. Ensure all dependencies are MIT/Apache-2.0 compatible. |
| **2.28** | **Check for hardcoded secrets** | High | Medium | ✅ AI-executable | Run `git-secrets` / `gitleaks` scan on entire repo. Flag and redact any secrets. |
| **2.29** | **Audit PostgreSQL permissions in tests** | Medium | Medium | ✅ AI-executable | Review all `PG*` env var usage. Ensure tests use least-privilege roles. Document. |
| **2.30** | **Verify security.txt is current** | High | Low | ✅ AI-executable | Run `bin/test-security-policy`. Update `SECURITY.md` + `/.well-known/security.txt` if expired. |
| **2.31** | **Add rate limiting to all Axum crates** | High | Medium | ✅ AI-executable | Run `bin/axum-axa-adopt --check --all`. Ensure per-client rate limiting configured. |
| **2.32** | **Verify all forms have UUID primary keys** | Medium | Medium | ✅ AI-executable | Scan all `sql/` for `SERIAL` or integer PKs. Convert to `UUID` with `gen_random_uuid()`. |
| **2.33** | **Add timestamptz to all tables** | Medium | Medium | ✅ AI-executable | Scan all `sql/` for tables missing `created_at`, `updated_at`, `deleted_at`. Add migrations. |

### **P4: Refactoring & Technical Debt**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.34** | **Migrate all HTML front-ends to ES modules** | High | Medium | ✅ AI-executable | Run `bin/es-modules-refactor --check --all`. Convert remaining commonJS front-ends. |
| **2.35** | **Harmonize all Lily HTML class names** | High | Medium | ✅ AI-executable | Run `bin/lily-html-refactor --check --all`. Apply all pending class swaps. |
| **2.36** | **Harmonize all Lily Svelte class names** | High | Medium | ✅ AI-executable | Run `bin/lily-svelte-refactor --check --all`. Apply all pending class swaps. |
| **2.37** | **Sync all Lily snapshots** | High | Medium | ✅ AI-executable | Run `bin/lily-sync --check` + `bin/lily-svelte-sync --check`. Update all pinned snapshots. |
| **2.38** | **Migrate all date handling to jiff** | High | Medium | ✅ AI-executable | Run `bin/axum-chrono-to-jiff --check --all`. Replace `chrono` with `jiff` + `jiff-sqlx`. |
| **2.39** | **Add export/import to all HTML wizards** | Medium | High | ✅ AI-executable | Run `bin/form-export-import-refactor --check`. Roll out to remaining 91 forms. |
| **2.40** | **Add restore banner to all HTML wizards** | Medium | Medium | ✅ AI-executable | Run `bin/form-restore-banner-refactor --check`. All 269 should pass. |
| **2.41** | **Fix all date-time-picker vendors** | Medium | Medium | ✅ AI-executable | Run `bin/html-date-time-picker-vendor --check`. Ensure vendored copy is byte-identical. |
| **2.42** | **Convert all vendored themes to pnpm** | Medium | High | ✅ AI-executable | Run `bin/svelte-lily-pnpm-migrate --check --all`. Migrate remaining vendored deps. |
| **2.43** | **Fix all page-header layouts** | Medium | Medium | ✅ AI-executable | Run `bin/page-header-layout-refactor --check`. Apply title-left/controls-right. |
| **2.44** | **Fix all semantic color contrasts** | Medium | Medium | ✅ AI-executable | Run `bin/html-error-message-contrast-fix --check`. Ensure WCAG AA compliance. |

### **P5: Tooling & Automation**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.45** | **Parallelize slow verify gates** | High | High | ✅ AI-generated | Identify gates >30s (`bin/test-sql-apply`, `bin/test-e2e`). Parallelize with `xargs`/`GNU parallel`. Target: CI under 15 min. |
| **2.46** | **Create a unified test runner** | High | High | ✅ AI-generated | Single command: `bin/test-all` that runs all gates, parallelized, with progress bar. |
| **2.47** | **Add progress tracking to long generators** | Medium | Medium | ✅ AI-generated | Modify Python generators to emit progress (e.g., "Processing form 120/360"). |
| **2.48** | **Generate a dependency graph** | Medium | Low | ✅ AI-generated | Create `docs/dependency-graph.md`: which forms depend on which tools, libraries. Mermaid diagram. |
| **2.49** | **Create a "dry-run" mode for all generators** | Medium | Medium | ✅ AI-generated | Add `--dry-run` flag to all `bin/*.py` generators. Show what would change. |
| **2.50** | **Add automatic changelog generation** | Medium | Medium | ✅ AI-generated | Script: parse git log since last tag, auto-populate `CHANGELOG.md` for each form. |
| **2.51** | **Create a form health dashboard** | Medium | High | ✅ AI-generated | Script: run all `--check` gates, generate `HEALTH.md` with pass/fail per form, per gate. |
| **2.52** | **Add pre-commit hooks** | Medium | Medium | ✅ AI-generated | `.pre-commit-config.yaml` with hooks for: lint, format, verify gates on changed files. |
| **2.53** | **Generate GitHub Actions workflows** | Medium | Medium | ✅ AI-generated | Auto-generate `.github/workflows/` for new forms: CI, verify, build, deploy. |

### **P6: Data & Schema Improvements**

| # | Task | Impact | Effort | AI Suitability | Acceptance Criteria |
|---|------|--------|--------|----------------|---------------------|
| **2.54** | **Add missing SQL comments for all columns** | Medium | Medium | ✅ AI-executable | Run `bin/sql/generate-sql-comments.py`. Add descriptive comments to all uncommented columns. |
| **2.55** | **Generate combined schema.sql for all forms** | Medium | Medium | ✅ AI-executable | Run `bin/sql/generate-sql-combined.py --all`. Verify all 360 `schema.sql` files are current. |
| **2.56** | **Verify all XML/DTD representations** | Medium | Medium | ✅ AI-executable | Run `xmllint` on all `xml/*.xml` + `xml/*.dtd` files. Fix validation errors. |
| **2.57** | **Verify all FHIR R5 representations** | Medium | High | ✅ AI-executable | Use HL7 validator on all `fhir/r5/*.json` files. Fix validation errors. |
| **2.58** | **Verify all OpenAPI specs** | Medium | Medium | ✅ AI-executable | Use `swagger-cli validate` on all `openapi/*.yaml`. Fix errors. |
| **2.59** | **Verify all Protocol Buffers schemas** | Medium | Medium | ✅ AI-executable | Use `protoc --check` on all `protobuf/*.proto`. Fix errors. |
| **2.60** | **Add foreign key constraints to all SQL** | Medium | High | ✅ AI-executable | Scan all `sql/` for missing FKs (e.g., `patient_id` without `REFERENCES patient(id)`). Add migrations. |
| **2.61** | **Normalize all enum values** | Medium | Medium | ✅ AI-executable | Scan all `sql/` for enum columns. Ensure consistent casing, no duplicates across forms. |
| **2.62** | **Add NOT NULL constraints where appropriate** | Medium | Medium | ✅ AI-executable | Analyze all columns. Add `NOT NULL` to required fields per form spec. |

---

---

## 🎯 **Quick Wins (High Impact, Low Effort)**

Start with these to build momentum:

### **Community/Promotion (1-2 days)**
- **1.2**: 5-minute quickstart guide
- **1.3**: Architecture diagrams (Mermaid)
- **1.13**: Open Graph meta tags
- **1.1**: Interactive form catalog (can start with static HTML table)

### **Engineering (1-3 days)**
- **2.1**: Run full verify suite, document failures
- **2.4**: Generate missing CHANGELOG.md files
- **2.5**: Generate missing spec/index.md files
- **2.26**: Full dependency vulnerability scan
- **2.27**: License compatibility audit

---

---

## 📊 **Prioritization Matrix**

| Priority | Community/Promotion | Engineering | Estimated AI Hours |
|----------|---------------------|-------------|---------------------|
| **P0 (Critical)** | 1.1, 1.2, 1.3, 1.4 | 2.1, 2.2, 2.3, 2.4, 2.5 | 20-40 |
| **P1 (High)** | 1.6, 1.7, 1.8, 1.9, 1.10 | 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14 | 80-120 |
| **P2 (Medium)** | 1.11-1.25 | 2.15-2.44 | 150-200 |
| **P3 (Low)** | All remaining | All remaining | 100+ |

---

---

## 🤖 **Execution Strategy for AI**

### **Phase 1: Audit & Triage (Week 1)**
1. Run **all verify gates** (2.1) - document failures
2. Run **all `--check` generators** - document staleness
3. Run **security audits** (2.25-2.33) - document findings
4. Create **project health dashboard** (2.51)

### **Phase 2: Quick Wins (Week 2)**
1. Generate **documentation** (1.2, 1.3, 1.6, 1.7)
2. Fix **critical engineering gaps** (2.4, 2.5, 2.26, 2.27)
3. Create **onboarding materials** (1.1, 1.20)

### **Phase 3: Fleet-wide Rollouts (Weeks 3-6)**
1. **SQL consistency**: 2.6, 2.40, 2.41, 2.54, 2.60
2. **Axum consistency**: 2.2, 2.3, 2.8, 2.9, 2.11-2.14
3. **Lily consistency**: 2.35, 2.36, 2.37
4. **Testing expansion**: 2.15-2.24

### **Phase 4: Advanced Improvements (Ongoing)**
1. **Performance**: 2.21, 2.45-2.47
2. **Security hardening**: 2.28-2.33
3. **Tooling**: 2.48-2.53
4. **Community**: 1.14-1.25

---

---

## 📝 **Recommendation Summary**

| Category | Top 5 Recommendations |
|----------|----------------------|
| **New Visitors** | 1.1 (Catalog), 1.2 (5-min guide), 1.3 (Architecture diagrams), 1.13 (OG tags), 1.20 (Learning paths) |
| **Promotion** | 1.14 (Demo links), 1.16 (Badge), 1.17 (Press kit), 1.19 (Good First Issue), 1.18 (Hacktoberfest) |
| **Upskilling** | 1.21 (Deep dives), 1.22 (Instrument catalog), 1.23 (ADRs), 1.24 (Pattern library), 1.25 (Medical primer) |
| **Engineering** | 2.1 (Verify suite), 2.2 (Axum routes), 2.3 (Fixtures), 2.26 (Vulnerability scan), 2.27 (License audit) |
| **Testing** | 2.15 (Property tests), 2.16 (Persona coverage), 2.17 (E2E all forms), 2.18 (Svelte E2E), 2.21 (Benchmarks) |
| **Auditing** | 2.25 (Unsafe code), 2.26 (Dependencies), 2.27 (Licenses), 2.28 (Secrets), 2.30 (Security policy) |

**Start with P0 tasks** to establish credibility and create immediate value. Then tackle P1 tasks for sustained impact. The fleet-wide consistency tasks (P1 Engineering) will have the highest long-term ROI by reducing technical debt and improving maintainability across all 360 forms.
