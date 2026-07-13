# Tasks

Executable checklist for [`plan.md`](plan.md) (2026-07 improvement round).
Work phases in order; within a phase, mechanical per-form items may be
batched across parallel subagents. After every phase run the full gate:

```sh
bin/test
bin/test-sql-apply
bin/lily-html-refactor --check --all && bin/lily-svelte-refactor --check --all
bin/lily-sync --check && bin/lily-svelte-sync --check
bin/generate-llms-txt.py --check && bin/generate-spec.py --check
bin/generate-changelog-and-examples.py --check
bin/loco-config-refactor --check --all
```

## Phase 0 — Repair & hygiene ✅ COMPLETE (2026-07-12)

- [x] Regenerate `forms.tsv` to cover all 286 forms. Created
      `bin/generate-forms-tsv.py [--check]` (derives rows from `forms/*/`
      dirs that contain `index.md`; excludes support dirs); wired `--check`
      into `bin/test`. `bin/forms-as-kebab-case | wc -l` → 286.
- [x] Rewrote `.github/workflows/ci.yml` for the current layout (see Phase 1).
- [x] Removed the stray empty root route dirs
      `glasgow-blatchford-bleeding-scores/[id]/report/pdf` and
      `substance-abuse-assessments/[id]/report/pdf` (untracked, zero files).
- [x] Brought the 2 Lily-Svelte TODO forms to PASS (canonical UI ports).
      `bin/lily-svelte-status --counts` → PASS 286 / TODO 0.
- [x] Recorded the `orthopedic-assessment` spelling decision in its
      `spec/index.md`: UK "Orthopaedic" display title, stable American slug
      (renaming would churn every derived artefact for no clinical benefit).
- [x] **BONUS defect found + fixed:** commit 40794d6d4 had stripped `.sql`
      from 81 forms' `92_create_table_*_grade_flag` migrations, silently
      dropping `grading_additional_flag` from `schema.sql`, the SQL-apply
      gate, protobuf, and OpenAPI (FHIR/XML/Loco already had it). Restored
      the extension (`git mv`), regenerated `schema.sql` + protobuf +
      OpenAPI, and validated: `bin/test-sql-apply` → 286/286 PASS,
      `bin/test-examples-conformance` → 286/286 conform.
- [x] **BONUS structure gap fixed:** 170/286 forms were missing
      `front-end-with-html/README.md` (the `-> index.md` symlink required by
      `bin/test-form`), which halted `bin/test` at the first form. Added all
      170 symlinks. **All 286 forms now pass `bin/test-form` structure
      validation** (the DB-dependent `cargo test` portion needs Postgres,
      supplied by the CI `rust` job / `TEST_FORM_SKIP_CARGO=1` locally).

## Phase 1 — CI and verification depth (WS1) ✅ COMPLETE (2026-07-12)

- [x] Rewrote `.github/workflows/ci.yml` as a full matrix:
  - [x] `structure` — `bin/test`.
  - [x] `drift` — regenerates all artefacts + every `--check` gate
        (forms-tsv, tools-doc, llms, spec, changelog/examples, all four Lily
        checks, loco-config, examples-conformance) + XML/DTD validation +
        fail-on-uncommitted-diff.
  - [x] `sql-apply` — `bin/test-sql-apply` against a `postgres:18` service.
  - [x] `rust` — 8-way sharded (`bin/forms-shard`) `cargo check` +
        `clippy -D warnings` + `cargo test`, each shard with a Postgres
        service and per-crate DB creation; `Swatinem/rust-cache`.
  - [x] `svelte` — 8-way sharded `npm ci && check && build && vitest run`.
  - [x] `fhir` — official HL7 `validator_cli.jar` (pinned 6.3.11, cached)
        over generated `fhir/r5/*.json` + example Bundles.
- [x] Wrote `bin/test-examples-conformance` (entity/property vs SQL schema,
      separator-insensitive, light numeric/boolean type check). Wired into
      `bin/test`, `bin/test-tools`, and the CI `drift` job. Found + fixed 8
      genuine fixture bugs (3 forms regenerated).
- [x] Added `bin/forms-shard <i> <n>` (deterministic split; sums to 286).
- [x] Added the 4 missing Svelte Vitest suites (diabetes-assessment,
      heart-health-check, systematic-coronary-risk-evaluation-2-diabetes,
      vaccinations-assessment) — all 286 front-ends now have engine tests.
- [x] Added the nightly `schedule` trigger + `e2e` job (`if: schedule`).
- [x] **BONUS:** `bin/generate-tools-doc.py [--check]` → `docs/tools.md`
      (Phase 4 item, built here); wired into `bin/test-tools` + CI drift.

## Phase 2 — E2E and accessibility (WS2) — harness + a11y done; oracles pending

- [x] Built the shared Playwright harness at `e2e/` (config, static server,
      form-list resolver) + specs:
  - [x] `tests/html-smoke.spec.ts` — every HTML front-end: loads with no
        uncaught JS error, primary action responds, **axe-core** WCAG 2 A/AA
        (fails on serious/critical).
  - [x] `tests/svelte-smoke.spec.ts` — welcome route render + a11y (env-driven).
  - [x] `bin/test-e2e [--html|--svelte] [--all|<slug>…]` wrapper.
- [x] Integrated `@axe-core/playwright`. Fixed **all** WCAG 2 AA
      color-contrast debt across the shared Lily palette (step-list
      in-progress `#2563eb`→`#1e40af`; finished-step greens; alert grays;
      flag/mandatory badges; blue button/link) and 3 genuine per-form a11y
      bugs (unlabeled controls in vaccinations-assessment; invalid `<ol>`
      structure in workplace-safety-assessment; non-focusable scroll regions
      in the UK LPA form). **Full sweep: 286/286 HTML front-ends pass** smoke
      + a11y (from ~2/286 at the start). Harness retries once to absorb
      parallel-load flakes.
- [ ] Extend `examples/` fixtures with an `expected` block (score/grade/flags)
      as the E2E oracle — REQUIRES running each form's JS engine over the
      fixture (Python generator cannot; needs a Node oracle harness). Pending.
- [ ] Fill `expected` for all 286 typical fixtures (mechanical; needs oracle).
- [ ] Wire changed-forms E2E subset into PR CI (nightly full sweep done).

## Phase 2 — E2E and accessibility (WS2)

- [ ] Extend the `examples/` fixture format with an `expected` block:
      score(s), grade, and flag list the engine must produce. Update
      `bin/generate-changelog-and-examples.py` scaffolding + `--check`.
- [ ] Fill `expected` values for all 286 typical fixtures (mechanical batch
      work; derive from each form's scoring spec in `spec/index.md`).
- [ ] Build the shared Playwright harness at `e2e/`:
  - [ ] `e2e/run-form.ts` — given a slug and fixture: serve
        `front-end-with-html/index.html` statically, drive the wizard,
        assert rendered score/flags against `expected`.
  - [ ] Same flow against the built Svelte app (`npm run build && preview`),
        route `/<slug>/`.
  - [ ] Dashboard smoke test (loads, renders rows from fixture data).
  - [ ] `bin/test-e2e [--html|--svelte] [--all|<slug>…]` wrapper.
- [ ] Integrate `@axe-core/playwright` into the harness; fail on
      serious/critical violations. Fix violations found (batch by pattern —
      most will be shared markup, fixable via one refactor + rollout).
- [ ] Wire changed-forms E2E subset into PR CI; full sweep into nightly.

## Phase 3 — Functionality rollout (WS3) — ASSESSED; remaining as batch rollout

**2026-07-12 assessment (read before starting):** this phase is genuinely
heterogeneous per-form work, NOT a clean mechanical sweep. Findings:
- **Autosave is partially present but inconsistent.** 531 HTML `js/` files
  touch `localStorage`, but the `STORAGE_KEY` convention varies wildly: 75
  forms use `<slug>.front-end-with-html.v1`, 108 use the legacy
  `<slug>.front-end-form-with-html.v1`, a handful are bespoke
  (`icvp-form-state`, `adr.form.v1`, `who-surgical-safety-checklist-draft`),
  and ~100 form-app.js files have no `STORAGE_KEY` constant at all (state is
  persisted elsewhere or not at all). So a generic "export the localStorage
  blob" approach is not reliable — **first normalise the STORAGE_KEY
  convention** (a `bin/` normaliser + `--check`) as a prerequisite.
- Export/import exists in only 2 forms; each `form-app.js` is bespoke (the
  `state` object is module-local), so export needs per-form wiring OR a
  refactor to expose a common `getState()`/`setState()` hook per form.
- Recommended sequencing: (0) normalise STORAGE_KEY; (1) add a shared
  `getState()`/`setState()` seam to each form-app.js (mechanical once the key
  is normalised); (2) drop in a shared `js/form-io.js` (export JSON/XML/CSV/
  TSV + import) referenced from index.html; (3) roll out via subagents in
  batches, verified by the E2E harness (round-trip export→import→same report).

Design each feature on the reference forms
(`pre-operative-assessment-by-clinician` HTML,
`cardiology-request` Svelte), spot-check, then batch-roll to all forms.

- [ ] **Export**: JSON / XML / CSV / TSV download of a completed form —
      HTML front-end (vanilla JS shared snippet) and Svelte front-end
      (shared `src/lib/` module). Filenames `<slug>-<date>.<ext>`.
- [ ] **Import**: JSON upload re-populates the wizard (both front-ends);
      round-trip test in the E2E harness (export → import → same report).
- [ ] **Autosave**: localStorage persistence keyed by slug, restore banner
      on load, clear-on-submit + explicit clear control; both front-ends.
      E2E test: fill half, reload, assert restored.
- [x] **Print CSS (HTML)**: added a shared, idempotent `@media print` block
      (`print-report-styles v1`) to every HTML front-end — hides wizard chrome
      (buttons, progress, step-list, theme switcher), flattens colours/shadows
      for paper, `@page` margins. Applied to all 286 (283 external `style.css`
      + 3 inline `<style>`). Verified by a print-media assertion in the E2E
      harness (buttons `display:none` under `@media print`). Svelte print CSS
      still pending.
- [ ] **Dashboard CSV/TSV export** on every dashboard.
- [ ] **Loco seed data**: per-crate seeder loading `examples/` typical
      fixture; document `cargo loco db seed` (or task equivalent).
- [ ] **Loco API integration test**: POST fixture → GET back → assert
      round-trip, per crate (template test, mechanical rollout).
- [ ] **Serve OpenAPI**: static route in each crate serving its
      `openapi/*.yaml` at `/api/openapi.yaml`.
- [ ] **i18n pilot**: extract UI strings behind a minimal message layer in
      one Svelte form; ship English + Welsh for the Cymraeg-relevant form;
      write up the pattern in `docs/i18n.md`; defer full rollout (record as
      future work in plan.md).
- [ ] Update every touched form's `CHANGELOG.md` (batchable; group features
      per release entry).

## Phase 4 — Documentation (WS4) ✅ COMPLETE (2026-07-12)

- [x] `CONTRIBUTING.md` — setup, spec-driven workflow, generated-artefact
      rules, the full verify-gate list, scratch-Postgres recipe, batching.
- [x] Populated `arc42/` — `index.md` + all 12 sections
      (`01-introduction-and-goals.md` … `12-glossary.md`), with Mermaid
      context/building-block/runtime/pipeline diagrams and 5 ADRs.
- [x] `docs/` suite — `index.md`, `architecture.md`, `data-model.md`,
      `generator-pipeline.md`, `scoring-engines.md`, `lily.md`,
      `back-end.md`, `verification.md`, `i18n.md`, `tools.md`. All
      cross-linked; grounded in the ACTUAL repo (corrected several brief
      assumptions: real grade-flag table names, Rust edition 2021, i18n
      unimplemented, semantic Lily class names).
- [x] `bin/generate-tools-doc.py [--check]` → `docs/tools.md` (parses each
      tool's source header — safe, no `--help` execution which has side
      effects). Wired into `bin/test-tools` + CI drift.
- [x] Linked `docs/index.md`, `docs/tutorials/`, `arc42/`, and
      `CONTRIBUTING.md` from `README.md` (index.md) and `AGENTS.md`.
      All doc/arc42/tutorial internal links verified resolving (0 broken).

## Phase 5 — Tutorials (WS5) ✅ COMPLETE (2026-07-12)

All under `docs/tutorials/`, numbered, each ending with a "verify you got
here" block; linked from `docs/index.md`.

- [x] `01-quickstart.md` — run one form locally (HTML static server, Svelte
      dev, Loco API + scratch Postgres).
- [x] `02-new-form.md` — full standard workflow on a disposable worked
      example (`example-screening-score`), with cleanup.
- [x] `03-scoring-engine.md` — pure engine + Vitest + golden vectors.
- [x] `04-generator-pipeline.md` — add a SQL column, regenerate, show diffs
      + what each `--check` catches.
- [x] `05-consume-the-api.md` — seeded crate, curl CRUD vs OpenAPI, FHIR
      Bundle export.
- [x] `06-lily.md` — theming + the lily `status`/`refactor`/`sync` tools.
- [x] `bin/test-tutorials` — fast, honest static check: extracts fenced `sh`
      blocks and fails if any referenced `bin/` tool or `forms/` path is
      missing (doc-rot gate). Runs clean: 6 tutorials, 110 references, 0
      failures. (Does NOT execute servers/builds — deliberate; those are
      covered by the other gates.)

## Phase 6 — Examples deepening (WS6) — BLOCKED on engine oracle

**2026-07-12 assessment:** the personas need an `expected` block (score/grade/
flags), and those values can only come from RUNNING each form's scoring engine
over the fixture. The Python fixture generator cannot compute them (the engines
are JS/TS/Rust). **Prerequisite: build a Node "oracle" harness** that, per form,
imports `front-end-with-html/js/{grader,rules,flags}.js`, runs it over a fixture,
and records the result — reused by both the Phase 2 `expected` block and these
personas. Once the oracle exists, persona scaffolding + fill is mechanical
(subagents, per-form spec defines what "flagged" means).

- [x] **Oracle foundation built:** `bin/test-engines` — a headless Node gate
      that loads each HTML front-end's scoring engine (retry-until-stable,
      types→rules→flags→grader order), discovers the grader + default-state
      factory, runs the grader over the default state, and asserts structured
      output. **PASS 220 / SKIP 63 / FAIL 0** (0 broken engines; 63 SKIP are
      ESM engines, inline computation, or unrecognised entry points, reported
      honestly via `--verbose`). Wired into `bin/test-tools` + CI. This is the
      reusable engine-execution half of the oracle; the remaining work is the
      per-form fixture→engine-state adapter that yields the actual `expected`
      score/grade/flags.
- [ ] Extend the fixture convention to three personas per form:
      `example-minimal.json`, `example-typical.json` (rename of current),
      `example-flagged.json` — each with `expected` scores/flags. Update
      `bin/generate-changelog-and-examples.py` scaffold + `--check`.
- [x] **Persona format + verifier built:** `bin/test-personas` — authors write
      realistic filled states in the engine's shape under
      `forms/<slug>/examples/personas.json`; `--update` computes `expected` by
      running the engine, default mode verifies it (regression oracle). Shared
      engine loader at `bin/lib/engine-loader.js`. Template authored +
      verified for `apgar-score` (3 personas: reassuring 8/10, moderately-low
      4/9, low 2/3). Wired into `bin/test-tools` + CI.
- [x] Reference batch authored + verified (9 forms total): apgar-score,
      cardiology-assessment, mental-health-assessment (PHQ-9), CURB-65,
      CHA₂DS₂-VASc, Wells DVT, glasgow-coma-scale, NEWS2, PSQI —
      `bin/test-personas` PASS 9 / FAIL 0, deterministic.
- [ ] Scaffold personas for the remaining ~211 scorable forms in batches
      (subagents on the proven rail; the form's `spec/index.md` scoring rules
      define low/typical/flagged). Note: 63 forms are `test-engines` SKIPs
      (ESM/inline/nonstandard engines) — those need a bespoke driver first.
- [ ] `example-invalid.json` per form + expected validation errors list;
      assert in the E2E harness (wizard blocks submission).
- [ ] CSV and TSV export samples per form matching the typical persona
      (generate via the Phase 3 export feature to guarantee fidelity).
- [ ] API transcripts per form: `examples/api-create.http` (or .md) with
      recorded request/response against the seeded crate.
- [ ] FHIR Bundles for the new personas; validate in the `fhir` CI job.
- [ ] Examples gallery page on `formexamples.github.io` (per-form card:
      description, personas, score ranges, links).
- [ ] Run E2E sweep against all three personas per form.

## Done (previous rounds — summary)

- 286 forms built to uniform depth: specs, docs, SQL, generated XML / FHIR
  R5 / protobuf / OpenAPI, HTML + Svelte front-ends, Loco back-end crates,
  CHANGELOGs, examples. HTML consolidation 286/286; Svelte route nesting +
  `app.css` import fix 286/286 (routes return 200); Loco crate batch fully
  green; Lily HTML drift 0; Lily Svelte 284/286 PASS.
