# Tasks

Executable checklist for [`plan.md`](plan.md) (Round 2, 2026-08; Round 1,
2026-07, below).
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

## Status summary (2026-08-26) — Round 2

Round 2 (see [`plan.md`](plan.md) "Round 2") opened after a research pass:
355 forms, all Round 1 build-out claims still hold, but several gates have
stopped telling the truth. Special files + `forbid(unsafe_code)` landed the
same day (Phase 7 below, complete); Phases 8–12 are open. **Start at Phase 8
(R0 gate truth) — everything else sequences behind it.**

Gate-truth repair (Phase 8) largely landed same-day: **all 29 cheap verify
gates green** (`test-tools` 21 ok / 0 failed) after the ESM engine-loader
rebuild (test-engines PASS 279/SKIP 76/FAIL 0; test-personas PASS 109, zero
oracle diff), the es-modules indent fix, and the Lily re-pin to `e05a138e6`
with fleet theme re-sync. **Phases 8 and 9 completed the same day**
(gate truth; CI completeness — see each phase), and Phase 10's tooling half
too. v1.0.0 tagged 2026-08-26. Open: two maintainer decisions in Phase 10
(Zenodo DOI; licence fit), then Phases 11-12.

**2026-08-27/28 — Phase 9 correction, repeated eight more times, then
confirmed green.** Checked GitHub's actual CI run history for the first
time since Phase 9 claimed "complete" — every run had failed or been
cancelled, Rust and Svelte matrices had never once gone green. What
followed was a real-CI-run-at-a-time loop, not a single fix: each push's
own run was watched through to its actual result rather than assumed,
and nine more times it surfaced a bug the previous fix hadn't touched —
a scaffold clippy default, `npm ci` against pnpm-only front-ends, a
missing PyYAML install, a missing `pnpm-workspace.yaml` key, a merge-
regressed `locales.ts`, an XML-escaping/orphan-file generator bug, a
SvelteKit 3.0-next rename (after one wrong diagnosis was caught and
reverted before landing), a stray post-rename reference left in
`seed()`, the Rust runner filling its own disk, an FHIR validator that
had never once completed plus every real error it was masking, a
concurrency group that let a delayed cron cancel real work, a test-only
connection-pool race, and a gitignored E2E lockfile. Persona work
continued in parallel: 109 → 186 this session. **Confirmed, not
assumed:** run
[33213955606](https://github.com/FormExamples/form-examples/actions/runs/33213955606)
— every job green, first time in this repository's history. See Phase
9's correction entries below for the full account of each bug.

## Status summary (2026-07-13)

Phases **0, 1, 4, 5 complete**; **2** complete bar the engine-oracle-dependent
fixture `expected` blocks; **3** has print CSS + dashboard CSV/TSV export + the
i18n pilot delivered (export/import + Loco seed/serve still open); **6** has the
engine + persona oracle with **108 forms** carrying verified personas.

Beyond the plan, an audit-fix-gate loop found and closed a long chain of latent
bugs, each fenced with a new gate:

- 81 mangled `*_grade_flag.sql` migrations (lost `.sql` extension) restored.
- 170 missing `front-end-with-html/README.md` symlinks added.
- `mobility-assessment`'s stub dashboard implemented.
- `medical-operation-note` missing domain controllers → added; `bin/test-loco-routes`.
- 135 stale back-end `AGENTS.md` (obsolete JSONB API) regenerated; `--list-stale` gate.
- 1652 false-positive scaffold request tests (trailing-slash → welcome page) fixed.
- **The big one:** a route-nesting seed-path regression had broken ~4000
  back-end tests (every seeding test); fixed corpus-wide + gated.
- 7 invalid OpenAPI specs (YAML-indicator enum values) + 3 invalid protobuf
  (proto3 enum-name collisions) → generator fixes + `protoc`/`openapi` CI gates.
- All 4 generated representation formats (XML, FHIR, OpenAPI, protobuf) now
  validate end-to-end; a combined OpenAPI spec per form added.

New verification tooling (all in CI): `bin/generate-forms-tsv.py`,
`bin/test-examples-conformance`, `bin/forms-shard`, `bin/generate-tools-doc.py`,
`e2e/` (Playwright + axe-core) + `bin/test-e2e`, `bin/test-engines`,
`bin/test-personas`, `bin/test-loco-routes`, `bin/test-tutorials`,
`bin/back-end-with-loco/generate-loco-agents.py`,
`bin/openapi/generate-openapi-combined.py`.

**Remaining large/deliberate items** (documented in-place below): snake_case↔
camelCase API contract (283 crates + ~1400 insta-snapshot regen; latent),
form export/import (per-form state seam), serve-OpenAPI second half (per-crate
Rust route serving `combined/openapi.yaml`), and the Phase 6 persona rollout to
the remaining scorable forms.

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
  blob" approach is not reliable — **first normalize the STORAGE_KEY
  convention** (a `bin/` normalizer + `--check`) as a prerequisite.
- Export/import exists in only 2 forms; each `form-app.js` is bespoke (the
  `state` object is module-local), so export needs per-form wiring OR a
  refactor to expose a common `getState()`/`setState()` hook per form.
- Recommended sequencing: (0) normalize STORAGE_KEY; (1) add a shared
  `getState()`/`setState()` seam to each form-app.js (mechanical once the key
  is normalized); (2) drop in a shared `js/form-io.js` (export JSON/XML/CSV/
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
- [x] **Dashboard CSV/TSV export (HTML)** on all 286 dashboards. Shared,
      form-agnostic `js/table-export.js` self-injects "Download CSV" / "Download
      TSV" buttons above the dashboard's data table and serializes the rendered
      header + visible rows (respecting filters/sort) with correct delimiter
      escaping. Rolled out mechanically (283 via `<script src>`, 3 inline for
      the no-`js/` dashboards). Verified by `e2e/tests/dashboard-export.spec.ts`
      (buttons present, CSV downloads with a real header) → 286/286.
- [x] **Fixed `mobility-assessment`'s stub dashboard** (found via the export
      harness): its `dashboard-app.js` was a 2-line "Implementation pending"
      scaffold — the ONLY unimplemented front-end across all 286 forms
      (audited: 0 stubs remain). Implemented it (12 Tinetti sample rows, 6
      columns, filters, sort) + its scaffold CSS; html-smoke + dashboard-export
      + a11y all pass.
- [ ] **Loco seed data**: per-crate seeder loading `examples/` typical
      fixture; document `cargo loco db seed` (or task equivalent).
- [x] **Fixed a real back-end bug found by audit:** `medical-operation-note`
      — the crate the notes call the "gold reference" — was the ONLY crate of
      286 missing its domain HTTP controllers (its `controllers/` had just
      `auth.rs`; `app.rs routes()` wired only `auth`, vs 2–23 domain routes in
      every other crate). Its API exposed no domain entities. Added the 13
      per-model controllers + wired routes (mirroring apgar-score); REST now at
      `/api/<table>/`. `cargo check --all-targets` clean; loco-config-refactor
      `--check` still passes. (A cross-crate `add_route`-count audit is a cheap
      future gate to prevent recurrence.)
- [x] **Fixed 135 stale back-end `AGENTS.md`** (found following the
      medical-operation-note fix): 135/286 crate docs still described the
      obsolete single-`assessments`-table JSONB API (`/api/assessments`,
      `data JSONB`, `src/bin/main.rs` layout) that no longer exists — the
      crates are relational per-table. Added
      `bin/back-end-with-loco/generate-loco-agents.py` (emits an accurate doc
      from each crate's real controllers) + a `--list-stale` gate wired into
      `bin/test-tools` and CI; regenerated the 135, left the 151 correct
      hand-authored docs untouched.
- [x] **FIXED — 3 invalid generated Protocol Buffers (found by audit).** The
      protobuf generator emitted `<FIELD>_UNSPECIFIED = 0` and then a CHECK
      value literally `'unspecified'` produced the SAME constant at index N;
      proto3 scopes enum value names to the package, so it was a duplicate →
      `protoc` rejected it. Hit body-mass-index-…-calculator, international-
      certificate-of-vaccination-or-prophylaxis, partogram. Fixed the generator
      to dedup by generated constant name (pre-seeding the UNSPECIFIED
      sentinel); regenerated (3 files); all 1850 `.proto` now compile. Added a
      `protoc` validation step to the CI drift job.
- [x] **FIXED — 7 invalid generated OpenAPI specs (found by audit).** The
      OpenAPI generator emitted CHECK-enum values unquoted, so a value with a
      leading YAML indicator char (`>=80`, an adult age band) parsed as a block
      scalar → invalid YAML. Affected bhutani-bilirubin-nomogram, chronic-
      kidney-disease-review, COPD-review, epilepsy-review, heart-failure-review,
      hypertension-review, partogram. Fixed `yaml_enum_value()` to quote such
      values; regenerated (7 files); all 1850 specs now validate. Added an
      OpenAPI 3.1 validation step to the CI drift job (previously only XML +
      FHIR were validated).
- [x] **FHIR: role-based resource classification — dangling Encounter refs 178→0.**
      `classify_table` matched FHIR resource types by LITERAL table names
      (`assessment`→Encounter, `grade`→ClinicalImpression), so the ~178 forms
      with a form-specific main table (`apgar_score`, not `assessment`) got no
      Encounter/ClinicalImpression — everything fell to Observation — and their
      `Encounter/<uuid>` references dangled (the uuid came from a hardcoded
      `get_uuid("assessment")` seed matching no resource). Rewrote it to
      identify the core table by role (`find_main_table`: non-patient/clinician,
      non-grade, prefix of the most others) and classify grade tables by suffix
      (`_grade`/`_grade_rule`/`_grade_flag`), aliasing the `"assessment"` uuid to
      the real main table so refs resolve; defensively drop the `encounter`
      element when a form has no core table. Result: **dangling Encounter refs
      178→0**, resource types now correct (289 Encounter / 383 ClinicalImpression
      / 547 DetectedIssue), 0 structural problems, idempotent. Uses the same
      builders CI already HL7-validates for the generic-named forms (the 2-min
      tool cap prevents a local HL7 run; the CI `fhir` job is authoritative).
      Also (prior round) bundle references rewritten to `urn:uuid:` fullUrls.
- [x] **FHIR: orphan cleanup + patient-aware refs — 0 dangling bundle refs.**
      (Follow-up to the row above, now closed.) Two root causes remained:
      (1) the generator never deleted stale `*.json` for renamed/dropped tables
      (`grading_result`→`grade`, `arc42_documentation`→its split tables) — **139
      orphans across 115 forms**, each duplicating a live resource and carrying
      cross-refs baked against an older UUID assignment, which is what actually
      produced the dangling `Encounter/<patient-uuid>` refs. Generalized the
      cleanup from `assessment_*.json` to any `*.json` outside the current table
      set. (2) builders hardcode `subject: Patient/<uuid>`, so the **13
      non-clinical forms with no patient table** (arc42, meeting, issue-tracker,
      agile/OKR/LPA/neurodiversity) dangled 118 `Patient/` refs. Made
      `build_fhir_resource` reference-aware (`has_patient`): drop the optional
      `subject` (Observation/Encounter/DetectedIssue) and downgrade the grade
      table's ClinicalImpression (subject 1..1 required) to a neutral Observation
      (subject 0..1). **Result: unresolved refs 0 across 0 forms** (was Patient
      221 / Encounter 104 across 117); idempotent; xml/openapi/protobuf
      unchanged; `--check` green. Commit `c779754a1`.
- [x] **psychology-assessment stub SQL — FIXED.** The form's SQL was a
      patient+clinician stub with its entire DASS-21 schema absent (so every
      generated representation was empty of domain content and it could not
      score). Added the canonical four domain migrations mirroring the
      item-based pattern (autism/attention-deficit): minimal `assessment`
      parent, a `grade` child with the three DASS-21 subscale scores (0-42,
      raw doubled) + severity categories, plus `grading_fired_rule` and
      `grading_additional_flag`. Verified on scratch Postgres 18 — all 6
      migrations apply, full patient→assessment→grade→rule/flag insert chain
      succeeds, CHECK constraints reject invalid severities. Regenerated all
      representations; FHIR now emits the correct Encounter/ClinicalImpression/
      DetectedIssue set. Commit `fcd9df60f`.
- [x] **psychology-assessment Loco crate — completed (`8ed5d7e40`).** The crate
      lagged its schema (patient+clinician only). Added the full relational
      stack for all four domain entities (assessment/grade/grading_fired_rule/
      grading_additional_flag), mirroring the sibling autism-assessment crate:
      SeaORM migrations, _entities with relations, model wrappers, JSON-API
      controllers wired into app.rs, and model + request tests. Verified on
      scratch Postgres 18 — cargo check clean; full suite 35 tests, 0 failed
      (up from 27); loco route + config drift gates green.
- [x] **Loco setup-script drift (81 forms) — FIXED + gated.** Surfaced while
      regenerating for psychology-assessment: 81 `back-end-with-loco-setup`
      scripts were missing the `grading_additional_flag` scaffold call. Root
      cause: they were generated during Phase 0 while the 81
      `92_*_grade_flag.sql` migrations still lacked their `.sql` extension, so
      the grade_flag table was invisible. Regenerated all 81 (pure additions,
      idempotent; commit `f40c11605`). The generator had **no `--check` mode**,
      which is why this drifted silently — added `--check` + slug filtering and
      wired the gate into CI (commit `62b306f67`).
- [x] **vaccinations-assessment broken submit — FIXED (`b22d0662d`).** Found by
      auditing front-end architecture: its HTML wizard's submit navigated to
      `report.html`, which does not exist → clinician landed on a 404 and never
      saw the result. index.html already had the intended inline `#report`
      region; replaced the redirect with an inline renderReport() (status,
      score, fired rules, flags — escaped + priority-coloured), matching the
      single-page convention. Verified with Playwright (no navigation, `#report`
      fills, 0 page errors; smoke+a11y green). **Stub audit was otherwise clean:
      psychology-assessment was the only stub SQL; no other broken submits.**
      **Gated (`394bd2aa7`):** the html-smoke sweep now asserts the primary
      action never changes the pathname (single-page-wizard invariant) — it
      catches this whole class and passed 572/572 across all 286 forms with the
      new assertion (the old sweep only checked for thrown JS errors, which a
      404 navigation does not raise, so the bug had slipped through).
- [x] **ES-modules front-end refactor — DONE (2026-07-15).** Reverses the
      earlier item (1): rather than de-module the 3 outliers to match the
      classic `window.<Namespace>` scripts, the project decision flipped — **all
      HTML front-ends now use native ES modules** (`import`/`export` +
      `<script type="module">`). Recorded in [`spec/es-modules.md`](spec/es-modules.md)
      (incl. the accepted `file://` tradeoff — modules must be served over HTTP).
      Built `bin/es-modules-refactor` (offset-based, namespace-aware converter:
      strips IIFE + namespace plumbing, resolves a per-(namespace,symbol)→file
      map, emits import/export, re-declares non-namespace IIFE params, rewrites
      HTML to a single module entry; idempotent; `--check` CI drift detector,
      wired into AGENTS.md Verify). It handles the many real idioms found in the
      corpus (per-symbol + `Object.assign` publishes, two-line & parenthesised &
      reverse `|| {}` inits, `const NS = window.X` aliases, global-param IIFEs
      incl. multi-param `(root, doc)`, inline member-access consumes, same-name
      shadows via `as`-aliased imports, function-RHS publishes with inner refs).
      **283 forms tool-converted; 3 bare-global forms (issue-tracker, meeting,
      architecture-decision-record) hand-converted (the tool aborts + reports
      those rather than silently dropping scripts).** `--check --all` clean; all
      2809 JS files pass `node --check`; full `bin/test-e2e --html --all`
      smoke+a11y+dashboard-export sweep green. Updated
      `forms/AGENTS-front-end-html.md` §5 and the gold-standard example.
      *Note:* the `file://` self-contained property in earlier notes no longer
      holds — that was the whole tradeoff.
- [x] **Front-end autosave rollout — DONE (2026-07-15).** Added
      `localStorage`/`STORAGE_KEY` autosave (`<slug>.front-end-with-html.v1`,
      try/catch save/load, save-on-edit + hydrate-on-load) to the 5 forms that
      lacked it: objectives-and-key-results-tracker, issue-tracker,
      vaccinations-assessment, agile-principles-assessment, and uk-lpa-health
      (LP1H). issue-tracker uses a DOM-level variant (no central state object);
      the rest persist their state object deep-merged onto the canonical shape,
      LP1H's dynamic lists included. Verified per form: `node --check`, a
      fill→reload→persists check, and `bin/test-e2e --html <slug>` green.
      *(Superseded note (3): `agile-consulting-scorecard-for-hiring-help` is NOT
      a single-page-wizard violation — it is a single inline `<script>` form with
      `onsubmit="return false;"` + live recompute-on-input and no `js/` dir; its
      `report.html` is an intentional standalone printable artifact, not wizard
      navigation. The full `bin/test-e2e --html --all` sweep passes it. The
      ES-modules refactor correctly skipped it — nothing to modularize.)*
- [i] **Representation-coverage audit — CORRECTED (2026-07-14).** The earlier
      audit (2026-07-13) wrongly called the FHIR-only extra file a "synthetic
      `grading_result`" and declared it intentional. It was NOT: `grading_result`
      was a stale ORPHAN left by the `grading_result`→`grade` table rename, now
      deleted (see the orphan-cleanup row above). The one genuinely intentional
      fold remains: XML is per-table, while FHIR/protobuf/OpenAPI fold
      `assessment_<section>` children into the parent `assessment` entity
      (documented in the generator headers). Post-cleanup, FHIR file counts match
      the current table set exactly (0 orphans).
- [x] **Loco API round-trip integration test** (template DONE on apgar-score):
      `tests/requests/patients.rs` POSTs a patient to `/api/patients`, asserts
      200 + id, GETs `/api/patients/{id}`, asserts every field round-trips, and
      confirms list membership. Verified against a real Postgres (1 passed).
      Domain routes need NO auth. Ports to other crates by swapping the field
      set per that crate's `Params`. Also fixed apgar's stale `Cargo.lock` and
      dropped `--locked` from the CI rust job (lock hygiene isn't maintained
      across all 286 crates; matches `bin/test-loco-project`).
- [ ] **FINDING — API serves snake_case, not camelCase (283/286 crates).**
      The scaffold `Params`/`_entities` models derive plain serde with NO
      `rename_all = "camelCase"`, so the Loco JSON API emits snake_case keys —
      contradicting the repo convention ("camelCase on structs shared with the
      front-end") and the camelCase front-ends. A latent contract mismatch
      (nothing currently wires the front-ends to the API). Fixing = add the
      rename to 283 crates + regenerate + refresh insta snapshots + cargo
      verify: a dedicated effort, not a quick sweep.
- [x] **FIXED — 1652 false-positive scaffold request tests.** They GET
      `/api/<table>/` (trailing slash → Loco's HTML welcome page, 200) and
      asserted 200, so they passed without reaching the handler (confirmed:
      `/api/patients` → 200 `application/json` `[]`; `/api/patients/` → 200
      `text/html` welcome page). Removed the trailing slash so each hits the
      real list handler, and added a content-type assertion so it verifies the
      JSON response, not the welcome page. Verified on a sample against real
      Postgres — all domain list tests pass.
- [x] **FIXED — broken seed path broke ~4000 tests (route-nesting regression).**
      What looked like an "auth magic-link mailer" failure was really a broken
      `App::seed`: the nesting refactor moved fixtures to
      `src/<snake>/fixtures/users.yaml`, but `seed()` still used
      `base.join("users.yaml")` where the harness's `base` resolves to the old
      flat path → seed failed with "No such file or directory". Every seeding
      test (models, requests, AND the magic-link tests, which seed first)
      failed — ~14 per crate × 280 ≈ 4000 tests, silent because nothing ran the
      full suite to completion. Fixed all 279 crates to seed via
      `CARGO_MANIFEST_DIR`; verified full suites now pass 0-failed (apgar 38,
      stroke 35, patient-intake 32, mental-health 32). This is what actually
      unblocks the CI rust job's `cargo test`. Added a `bin/test-loco-routes`
      gate rejecting the broken `base.join("users.yaml")` pattern. (The 6
      crates without a users.yaml never call seed — genuinely fine.)
- [ ] **Loco API integration test rollout** (per crate) once the two findings
      above are resolved — the apgar template is the pattern.
- [x] **Combined OpenAPI spec per form** (the first half of "serve OpenAPI"):
      `bin/openapi/generate-openapi-combined.py [--check]` merges each form's
      per-entity `openapi/*.yaml` into one `openapi/combined/openapi.yaml`
      (union of paths + component schemas, form-level info). Written to a
      `combined/` subdir so the per-entity generator's non-recursive dir
      cleanup never touches it. All 286 validate; wired into the CI drift
      regenerate + `--check` + recursive OpenAPI validation. Useful directly
      for Swagger UI / client codegen.
- [ ] **Serve OpenAPI**: static route in each crate serving its
      `openapi/*.yaml` at `/api/openapi.yaml`.
- [i] **Svelte build audit (2026-07-13): CLEAN.** Sampled `npm run build`
      across diverse forms (incl. the re-ported Lily forms + a test-request
      form) → all build; `npm run check` + `vitest` also green on the sample.
      Unlike the Rust suite, the Svelte CI job is genuinely sound.
- [x] **i18n pilot DONE** on `medical-language-speaking-assessment-for-cymraeg`:
      message layer (`src/lib/i18n/messages.ts` typed `{en,cy}` catalogue +
      `locale.svelte.ts` runes store, localStorage-persisted, `t()` with en
      fallback, mirrors `<html lang>` en-GB/cy) + `LocaleSelect` switcher
      mirroring ThemeSelect. Welcome + layout chrome in en-GB + Cymraeg
      (incl. NHS Wales "Mwy na Geiriau"). `npm run check` 0/0, build ok, Lily
      no drift. Step/clinical content + other locales deferred; `docs/i18n.md`
      updated to the shipped-pilot pattern.
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
      ESM engines, inline computation, or unrecognized entry points, reported
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
- [x] **44 forms** now have verified, deterministic, clinically-coherent
      personas (`bin/test-personas` PASS 44 / FAIL 0, twice-identical,
      `--update` yields zero diff). Reference batch (9) + 4 parallel batches
      (35): AAA, allergy, anaesthesiology, asthma, ADHD, audio-vestibular,
      audiology, blood-donation, bone-marrow, FIT, breast, CAGE, Caprini,
      Centor, cervical, Child-Pugh, COPD, C-SSRS, CAM, contraception, dental,
      derm, diabetic-eye, EPDS, EMT, endocrine, epilepsy, ergonomic (REBA),
      fall-risk (Morse), fertility, Framingham, gastro, Glasgow-Blatchford,
      GRACE, HAS-BLED — plus the reference 9.
- [ ] **Finding:** ~6 forms were skipped because their only whole-state
      grader stamps a live `new Date()` timestamp (dyslexia-, endometriosis-,
      first-responder-assessment; bhutani-bilirubin-nomogram;
      birth-control-assessment) with no deterministic band-producing entry to
      pin. Their `expected` cannot be reproduced. Worth a follow-up: refactor
      those graders to take an injected clock / split the timestamp out, so
      they become testable.
- [x] **108 forms** now have verified personas (`bin/test-personas` PASS 108 /
      FAIL 0, deterministic across the full corpus). Rounds: 9 reference + 35
      + 18 (F,H) + 18 (E,G re-authored) + 19 (I,J) + 9 (timestamp-unlocked).
- [x] **Timestamp-skip category CLOSED:** `bin/test-personas` now strips
      volatile timestamp fields (`timestamp`/`gradedAt`/…) before comparing,
      so graders that stamp `new Date()` are coverable. Re-authored all 9
      previously-skipped forms (dyslexia, endometriosis, first-responder,
      bhutani-bilirubin, birth-control, mental-state-examination,
      newborn-blood-spot, plastic-surgery, return-to-work). This obviated the
      earlier "refactor the graders to an injected clock" follow-up.
- [ ] Continue persona batches for the remaining scorable forms
      (subagents on the proven rail; `spec/index.md` defines the bands).
      63 forms are `test-engines` SKIPs (ESM/inline/nonstandard) — those need
      a bespoke driver first.
- [!] **Parallel-subagent hazard (lesson):** a leftover bulk-generator script
      in the shared scratchpad was found + run by two concurrent persona
      subagents; each script's "clean up my strays" `rm` deleted the OTHER
      batches' legitimate files (18 lost, then re-authored). When fanning out
      writers over a shared tree, instruct them to Write only their own target
      paths, never delete another item's output, and never run a pre-existing
      scratchpad script. Audit new-file counts against the dispatched set
      before committing.
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

## Phase 7 — Special files + unsafe-forbid ✅ COMPLETE (2026-08-26)

- [x] `spec/special-files-for-public-repos/` implemented: `AI_STATEMENT.md`,
      `GOVERNANCE.md`, `MAINTAINERS.md`, `SECURITY.md`, `CODEOWNERS`,
      root `CHANGELOG.md`, `NEWS.md`, `INSTALL.md`, `COMPARISONS.md`,
      `BENCHMARKS.md`; SPDX in `LICENSE.md`; `CITATION.cff` enriched;
      ways-to-contribute in `CONTRIBUTING.md`; docs table in `index.md`;
      spec marked implemented with per-file status table.
- [x] `#![forbid(unsafe_code)]` on all 1,412 crate roots via new
      `bin/loco-forbid-unsafe` (idempotent; `--check` in CI drift job);
      generated `back-end-with-loco-setup` scripts now run it post-scaffold
      (355 regenerated); 5 sample crates compile clean.
- [x] `#![warn(clippy::clippy::pedantic)]` typo → `clippy::pedantic` in the
      3 crates carrying it (which surfaces real pedantic findings — Phase 8).

## Phase 8 — R0 gate truth ✅ COMPLETE (2026-08-26)

- [x] **Engine loader (2026-08-26):** deeper than the skip-list — the
      `STORAGE_KEY` collision was masking that the 2026-07 ES-modules
      conversion had made every engine unloadable by the classic-vm harness.
      Rebuilt `bin/lib/engine-loader.js` with a real-`import()` ESM path
      (temp-dir copy + `{"type":"module"}` package.json, browser-global
      stubs, merged exports; classic-vm fallback kept), added the helpers to
      `NON_ENGINE`, refactored `bin/test-engines` onto the shared lib
      (deleting its inlined duplicate loader). Result: `bin/test-engines`
      **PASS 279 / SKIP 76 / FAIL 0** (up from PASS 220 pre-breakage — the
      ESM path recovers forms the old harness couldn't load);
      `bin/test-personas` **PASS 109 / FAIL 0**, and `--update` produced a
      **zero diff** across all 109 personas.json — the ESM loader computes
      byte-identical results to the recorded oracle.
- [x] **Engine loader, second bug found 2026-08-27:** `NON_ENGINE` also
      excluded `form-validator.js` as a presumed generic DOM utility — but
      it's the actual scoring engine's entry file in all 4 forms that use
      that name (`code-of-conduct-notice`, `consent-to-treatment`,
      `medical-records-release-permission`,
      `research-and-planning-privacy-notice`), so the exclusion silently
      broke both `bin/test-engines` and `bin/test-personas` for all 4 —
      found authoring `consent-to-treatment`'s personas. Removed the
      exclusion (comment in the source records why). `test-engines`
      unaffected at the fleet level (still PASS 279/SKIP 76/FAIL 0 — the
      2 that now load land as PASS, offsetting 2 that were previously
      miscounted); `test-personas` PASS 183 after re-verifying.
- [x] **Dep bump (2026-08-26):** verified with a 4-way-parallel
      `cargo check --all-targets` over all 355 crates — **355/355 PASS,
      0 FAIL** (which also validates the forbid-unsafe rollout against
      loco-rs 1.1.0) — then committed as one change (`aa434eec9`).
- [x] **Clippy pedantic (2026-08-26):** cleared, not scoped out
      (`b2f26393c`). `cargo clippy --fix` for the mechanical tier; by hand:
      format_push_string → `write!`/`writeln!`, ptr_arg `&String`→`&str`,
      genuinely-redundant match arms merged, u64 counts → `usize::try_from`.
      Domain-shaped findings got scoped allows with one-line reasons
      (sql/-mirroring bool structs, linear rule lists, published band
      tables, 0-100 percentage casts). All 8 crates
      `clippy --all-targets -- -D warnings` clean; cardiology engine tests
      (12 + 15) pass unchanged.
- [x] **es-modules (2026-08-26):** diagnosed — the 36 forms are formatted
      at 8-space indent and the tool regenerated the script block hardcoded
      at 2-space, so `--check` flagged a byte diff that was pure whitespace.
      Fixed the tool to emit at the file's own indent (first script tag's
      leading whitespace). `--check --all` → 0 / 355 drifted.
- [x] **Re-pin + re-sync (2026-08-26):** re-pinned both Lily snapshots to
      upstream `e05a138e6` (HEAD had moved again past `7396cf295`). Content
      delta was tiny and inspected: HTML spec 491/491 unchanged; Svelte spec
      2 files (upstream's own ProgressCircle test ARIA fix
      `Progress`→`progressbar`, a Slider doc wording change) — no component
      source changed, no per-form rollout triggered. Then re-synced the theme
      catalogues fleet-wide (`svelte-theme-css-sync --apply`,
      `html-theme-locale-select-refactor --apply`): the only real change is
      the unwired date-time-picker's `:disabled`→`[data-disabled]` selectors
      (4 lines/theme). Canonicalized 2 divergent `locales.ts`
      (pre-anaesthesia-assessment, pre-operative-assessment-by-clinician)
      via `svelte-helpers-picker-rename --apply`. All Lily gates green;
      `bin/test-tools` 21 ok / 0 failed.
- [x] **Checkout-pin guards (2026-08-26):** new `bin/lib/lily_pin.py`
      (`assert_lily_pin`), wired into `svelte-theme-css-sync`,
      `html-theme-locale-select-refactor`, and
      `svelte-helpers-picker-rename` right after arg parsing. A resolvable
      checkout HEAD that contradicts the `forms/lily-version.md` pin now
      aborts with the two remedies (checkout the pin / deliberately re-pin);
      unverifiable checkouts (no `.git`, no pin file) proceed best-effort.
      Vindicated within the hour: upstream moved again (`e05a138e6` →
      `d891fff23`) and the tools now refuse cleanly instead of reporting
      355-form phantom drift. The pin deliberately stays at the inspected
      `e05a138e6` — no chasing an actively-moving upstream.
- [x] **`bin/test` without a DB (2026-08-26):** `bin/test-form` now probes
      `pg_isready` before the cargo-test gate and skips with an explicit
      per-crate notice when no Postgres is reachable (missing `pg_isready`
      counts as unreachable). Full `bin/test` on a DB-less machine:
      355/355 structural PASS in 33 s, exit 0, 355 honest notices —
      instead of dying at the first crate on `PoolTimedOut`.

## Phase 9 — R1 CI completeness + efficiency ✅ COMPLETE (2026-08-26)

- [x] **Drift job completeness (2026-08-26):** the ten repo-internal gates
      wired in (`416312a75`). `svelte-helpers-picker-rename` and
      `svelte-date-time-picker-vendor` turned out to read the local Lily
      checkout too, so all four checkout-readers stay maintainer-side with
      an in-YAML comment (same treatment as the lily-sync pair).
- [x] **Checkout-dependent gates (2026-08-26):** solved with a
      vendored-uniformity gate instead of cloning upstream in CI: new
      `bin/test-vendored-uniformity` proves both theme catalogues (4
      deliberate collision exemptions) and the five Svelte helper
      components + `locales.ts` are byte-identical across all 355 forms.
      Upstream currency remains the maintainer-run half, guarded by
      `bin/lib/lily_pin.py`.
- [x] **Changed-forms sharding (2026-08-26):** new `changes` job diffs the
      push/PR base and narrows the Rust + Svelte shard loops to touched
      forms; cross-cutting paths, unusable bases, `workflow_dispatch`, and
      the nightly schedule run the full fleet (so filtering narrows
      coverage by at most one day). npm dependency caching added to the
      svelte shards; `workflow_dispatch` trigger added.
- [x] **Weekly advisories job (2026-08-26):** Mondays 05:17 UTC, cargo-deny
      advisories over every crate's committed lockfile (no compilation);
      the other jobs are excluded from that cron. It caught a live finding
      before ever running: loco-rs 1.1's jsonwebtoken pulls rsa 0.9.10
      (RUSTSEC-2023-0071, no fixed release). deny.toml policy updated with
      the reachability argument (HS256 HMAC auth; no RSA algorithm
      configured), four stale 0.16-era ignores dropped, 355 regenerated,
      full `cargo deny` green on sampled crates.
- [x] **dependabot.yml (2026-08-26):** GitHub Actions + the site + the E2E
      harness, weekly; the 355-crate fleet deliberately excluded (lockstep
      sweeps, not 355 bump PRs — reasoning recorded in the file).
- [x] **Correction (2026-08-27) — "complete" above was gate-shape complete,
      not gate-*green*.** The first real push after v1.0.0 was checked
      against GitHub's actual run history: every CI run on this repository
      had failed or been cancelled — the Rust and Svelte matrices had
      never gone green, not once, including every run this phase's own
      commits triggered. Two independent, pre-existing, fleet-wide bugs,
      neither introduced this round:
      - **Rust, all 8 shards:** `loco new` scaffolds
        `App::seed(ctx: &AppContext, base: &Path)` (unused `base` —
        fixtures load via `env!("CARGO_MANIFEST_DIR")`) and the test
        `auth_header()` helper's `format!("Bearer {}", &token)` (redundant
        `&`, `token: &str` already a reference) — both fail
        `clippy -D warnings` by default, on 346/355 crates. New
        `bin/loco-seed-base-rename` and `bin/loco-test-auth-header-fix`
        (single-occurrence-per-file confirmed before writing, `--check`
        gated, wired into the setup script alongside `loco-forbid-unsafe`).
        24-crate sample across all 8 shards verified clippy-clean.
      - **Svelte, all 8 shards:** the job ran `npm ci`, but every
        `front-end-with-svelte` is its own pnpm project with no
        `package-lock.json` — `npm ci` has required one since npm 5 and
        failed immediately, every time. This predates the session; this
        round's own npm-caching addition pointed at the same nonexistent
        lockfile without catching the underlying bug. Switched to
        `pnpm/action-setup` + `pnpm install --frozen-lockfile` +
        `pnpm run check/build` + `pnpm exec vitest`, matching
        `bin/test-e2e --svelte` and the documented dev workflow. Full
        pipeline verified locally (check 0 errors, build green, vitest
        19/19) before committing.
      **Lesson for how "complete" gets claimed going forward:** a gate
      wired into `ci.yml` is a claim, not a fact, until a real CI run has
      gone green on it — local reproduction of individual steps is not a
      substitute for checking `gh run list`. Watch the next push's Rust
      and Svelte matrices before calling this phase actually done.
- [x] **Second correction, same day — the lesson above was immediately
      vindicated.** The push containing the fix above (`beea33fd4`) was
      watched through to its own real CI result rather than assumed green,
      and it wasn't: **Drift detectors failed** (`ModuleNotFoundError: No
      module named 'yaml'` — `bin/openapi/generate-openapi-combined.py`
      needs PyYAML, which the drift job's bare `actions/setup-python@v5`
      never installs; ran fine on the maintainer's machine only because
      PyYAML happens to be globally present there) and **all 8 Svelte
      shards failed again**, for a *different* reason than the one just
      fixed: `pnpm install --frozen-lockfile` under the CI-pinned pnpm 9
      hit `ERROR packages field missing or empty` — every one of the 355
      `pnpm-workspace.yaml` files was missing a `packages:` key, which
      pnpm 9 rejects outright and the maintainer's local pnpm 11 silently
      tolerates. Fixed both: `pip install pyyaml` added to the drift job;
      new `bin/svelte-pnpm-workspace-fix` adds `packages: ['.']`
      fleet-wide (355 files) and, found in the same file while there,
      normalizes `allowBuilds.esbuild` (a stray unfilled template string
      in 32 files, `false` in 1, `true` in the rest — confirmed the bad
      values don't themselves break the install, just wrong data) to
      `true`. Reproduced the original error and verified the fix with a
      **real pnpm 9 binary** (not the local pnpm 11, which cannot see
      this bug) across three sample forms: install, `check`, `build`, and
      `vitest run` all green. `--check`-gated, wired into the drift job.
      **Still unconfirmed by a real CI run — do not mark this phase
      actually done until the next push's Drift, Rust, and Svelte jobs
      are checked and green, not assumed.**
- [x] **Third correction, same investigation — confirmed, then found eight
      more.** Watching kept surfacing real bugs the local checks couldn't
      see, one real CI run at a time, right up to the first fully green
      run in this repository's history:
      - `test-vendored-uniformity` failed on two forms' `locales.ts`
        (regressed in a merge two days earlier) — restored from the
        fleet-uniform content.
      - The XML generator wrote unescaped element text (2 forms broke
        well-formedness on a literal `<` in a CHECK-constraint enum) and
        never cleaned up orphaned `.xml`/`.dtd` from a renamed/dropped
        table (260 files, 110 forms). Both fixed at the generator.
      - `@sveltejs/kit@3.0.0-next.23` renamed `$app/environment` to
        `$app/env`, dropping the old path's type declarations —
        `svelte-check` fails fleet-wide on it. **A first attempt
        misdiagnosed this as a missing `svelte.config.js`, applied it
        fleet-wide, and had to revert it** after re-verification showed
        kit 3.0-next hard-errors the moment that file exists; the actual
        fix (source imports already correct at `$app/env`; 7 forms'
        `vitest.config.ts` alias keys needed to follow) came from reading
        the installed `@sveltejs/kit` package's own bundled types, not
        from the error text alone.
      - 11 forms' `App::seed()` had a stray `let _ = base;` — a leftover
        reference to the parameter `bin/loco-seed-base-rename` had
        already renamed to `_base`, a hard compile error found only by
        actually compiling those 11 crates.
      - All 8 Rust shards failed identically on the runner's own "No
        space left on device" — ~44 independent crates per shard, no
        shared workspace, each leaving `target/` behind. Fixed by wiping
        each crate's `target/` once done, at the cost of rust-cache's
        cross-run warm start.
      - FHIR CI had never completed at all: the validator's default
        `tx.fhir.org` round-trip against 2,600+ files hung for hours.
        `-tx n/a` fixed the hang (~19s fleet-wide) and surfaced what it
        had been masking — 1,090 empty `valueString`s, every example
        Bundle's invalid `document` type, `DetectedIssue.severity` values
        outside FHIR's fixed set, two fabricated extension URLs.
      - The workflow's single `concurrency` group let a delayed nightly
        cron (GitHub queued a 03:17 UTC schedule run until 15:22 UTC)
        cancel a real, in-progress push run outright. Scoped by
        `github.event_name`.
      - `config/test.yaml`'s scaffold default `max_connections: 1`
        raced `cargo test`'s default concurrency
        (`SqlxError(PoolTimedOut)`) — a real, deterministic mechanism
        with an intermittent outcome, not unexplained flakiness. Raised
        to 10, fleet-wide.
      - The nightly E2E job's `e2e/.gitignore` excluded
        `package-lock.json` — `npm ci` had never had a lockfile to
        install from. Committed.
      **Confirmed, not assumed:** run
      [33213955606](https://github.com/FormExamples/form-examples/actions/runs/33213955606)
      — every job green: both matrices (8/8 Rust, 8/8 Svelte), FHIR,
      drift, SQL apply, structure. First fully green run in this
      repository's history. Phase 9 is now actually done.

## Phase 10 — R2 professionalization — tooling done; 3 maintainer decisions open

- [x] **Issue + PR templates (2026-08-26):** `.github/ISSUE_TEMPLATE/`
      (defect form; clinical-correctness form requiring a citation against
      the published instrument; config.yml contact links routing security
      to SECURITY.md's private path and press to NEWS.md) +
      `PULL_REQUEST_TEMPLATE.md` (spec-first / regenerate / gates /
      uniformity / CHANGELOG checklist, and the AI-disclosure section per
      `AI_STATEMENT.md` §10 — in the PR description, never trailers).
- [x] **Governance of settings (2026-08-26):** GOVERNANCE.md gains a
      Repository settings section (branch protection = the per-push CI
      checks required, no force push; review-requirement deliberately off
      at bus factor one — the honest control is the gates) and a 5-step
      release runbook. GitHub topics set from the fact sheet (14 topics,
      via gh); description left as the maintainer's wording.
- [x] **First release (2026-08-26):** the maintainer directed
      "commit, merge, push, publish" — v1.0.0 tagged per the GOVERNANCE.md
      runbook: CHANGELOG `[Unreleased]` cut to `[1.0.0]`, NEWS.md updated,
      annotated tag pushed to all three remotes, GitHub release created
      with the changelog section as notes. AI_STATEMENT.md reviewed —
      issued the same day, no changes needed.
- [ ] **Maintainer decision — Zenodo DOI** for `CITATION.cff` (link the
      GitHub repo to Zenodo before the first release so the release mints
      the DOI; then add the DOI to CITATION.cff and NEWS.md).
- [ ] **Maintainer decision — licence fit** of CC BY-NC-SA for a code
      corpus (COMPARISONS.md names it a weakness). Decide and record in
      the spec; if it ever changes, LICENSE.md, CITATION.cff, and
      AI_STATEMENT.md §8 move together.

## Phase 11 — R3 functionality carry-overs (from Phases 3/6)

- [ ] Form export/import (JSON/XML/CSV/TSV) — design on the reference forms,
      roll out mechanically with a `--check` tool (Conventions promise).
- [ ] Loco: per-crate seeder from `examples/` + serve `combined/openapi.yaml`
      at `/api/openapi.yaml` (second half of serve-OpenAPI).
- [ ] Personas: **225/355 verified** (`bin/test-personas` ground truth,
      not hand-tracked — the incrementally-tracked count in this entry had
      drifted from it; was 109). 2026-08-26: the whole
      `*-waiting-list-card` family (56 forms) done in one batch — the family
      engine is template-identical (2 comment lines differ), so three RTT
      scenarios (within-target / approaching-breach+interpreter /
      52-week-breach+harm-review) were authored once and specialized per
      specialty; `bin/test-personas` gained per-persona `options` so the
      family's clock-derived grader pins `todayIso` (without it the oracle
      rots daily — the reason this family was never covered). A separate
      batch of 39 bespoke single-document forms (not the `*-test-request`
      suffix family below — admin/clinical documents like referral letters
      and training checklists) had 21 done 2026-08-26 in 9 pairs, 3 personas
      each, grounded in the engines' own rule sets: cardiology-request/response,
      inpatient-clinical-note, medical-operation-note,
      who-surgical-safety-checklist, emergency-department-triage-note,
      partogram, post-anaesthesia-care-unit-record, soap-note,
      nursing-care-plan, medical-error-report, child-safeguarding-referral —
      the last with its live-clock overdue flag deliberately unexercised,
      noted in the persona file — general-practitioner-referral-letter,
      history-and-physical-examination, advance-decision-to-refuse-treatment,
      advance-statement-about-care, cardiopulmonary-resuscitation-training,
      consent-to-treatment, employee-onboarding-checklist,
      first-aid-training-checklist, medical-records-release-permission; 18 of
      that batch remain. Remaining frontier: 37 `*-test-result` (13 already
      had verified personas from earlier, pre-this-tracking work — this
      entry's "37 not started" had drifted from that ground truth, the
      same class of error the 2026-09-02 *-test-request correction below
      fixed; 24 remained as of 2026-09-02) and 39 `*-test-request` — NOT
      template-identical, per-form panels/rules, needs real per-form
      batches; confirmed 2026-09-02 that **all 39 have a working
      `calculateGrade` engine** (none are
      engine-SKIP) via `bin/test-engines --verbose`, so every one is
      immediately actionable. 18 done 2026-09-02 (angiography-test-request,
      blood-test-request, x-ray-test-request, mri-scan-test-request,
      coagulation-test-request, lumbar-puncture-test-request,
      allergy-skin-test-request, electrocardiogram-test-request,
      genetic-test-request, biopsy-test-request, cytology-test-request,
      cardiac-stress-test-request, ambulatory-blood-pressure-test-request,
      blood-cross-match-test-request, endoscopy-test-request,
      ct-scan-test-request, echocardiogram-test-request,
      urinalysis-test-request — each 3 personas spanning a
      well-formed/routine, a caution/escalated, and a
      contraindicated-or-reject/incomplete scenario, verified field-by-field
      against that form's own `js/rules.js` + `js/form-app.js` option lists
      before running `--update`, not just accepting whatever it computed;
      cytology-test-request's pre-analytical axis is clock-derived
      (`Date.now()`), so its personas were designed to land in a band that
      doesn't drift as real time passes — not-yet-collected or a timestamp
      far enough in the past — rather than a narrow window a fixed date
      would age out of, the same rot risk `*-waiting-list-card` hit first).
      3 more done 2026-09-02 (colonoscopy-test-request,
      dexa-bone-density-test-request, mammography-test-request — same
      per-form-verified methodology; colonoscopy's FIT-value and dexa's
      scan-region persona drafts each had a design error caught by
      cross-checking the computed `expected` against the intended clinical
      narrative before treating the persona as done, fixed before commit).
      3 more done 2026-09-02 (bronchoscopy-test-request,
      cystoscopy-test-request, electroencephalogram-test-request — same
      methodology; electroencephalogram's third persona exercises a
      distinctive rule unique to that engine — NICE NG217's
      eeg-not-to-exclude-epilepsy guideline-misuse flag, detected from
      clinical-question free text, forces query-referrer independently of
      the appropriateness band). 3 more done 2026-09-02
      (eye-vision-test-request, fluoroscopy-test-request,
      hearing-test-request — same methodology; fluoroscopy's third
      persona exercises a distinctive `redirect` recommendation unique to
      that engine — barium requested for suspected perforation forces a
      `contraindicated` safety band, which short-circuits straight to
      `redirect` in `deriveRecommendation` ahead of the appropriateness
      check, even though the same mismatch would independently have
      earned a `query-referrer` verdict on its own). 3 more done
      2026-09-02 (histopathology-test-request,
      holter-monitor-test-request, microbiology-culture-test-request —
      same methodology; holter-monitor's engine adjusts its raw
      indication-fit score by a symptom-frequency/monitor-duration match
      (+1/-1/-3, capped 1-9), so its `redirect` persona shows a score of
      5 despite an "ideal" indication pairing; microbiology-culture's
      `deriveRecommendation` is stricter than its siblings — a `caution`
      pre-analytical band alone (not just `reject-risk`) forces
      query-referrer, so its second persona is stat-tier triage yet
      still query-referrer, and its third persona is this backlog's
      first `reject` outcome, from a blood culture drawn after
      antibiotics were already started). 3 more done 2026-09-02
      (nerve-conduction-study-test-request, nuclear-medicine-test-request,
      pet-scan-test-request — same methodology; nerve-conduction-study's
      third persona isolates its procedural-risk-high query-referrer path
      from an otherwise-ideal indication pairing (needle EMG vs
      anticoagulation), distinct from the usual appropriateness-mismatch
      route; nuclear-medicine repurposes `redirect` to mean "Accept with
      safety caution" (a high-dose study alone lifts prep-safety from ok
      to caution) and contributed this backlog's second `reject` (confirmed
      pregnancy); pet-scan's sibling engine is stricter — caution forces
      plain query-referrer, not an accept-with-caution redirect — and its
      reject persona (confirmed pregnancy again) is a third such outcome;
      pet-scan's dose and prep-safety axes are also fully independent,
      unlike nuclear-medicine's, so even its well-formed persona carries a
      non-blocking high-dose flag). 3 more done 2026-09-02
      (pregnancy-ultrasound-test-request, pulmonary-function-test-request,
      sleep-study-test-request — same methodology; pregnancy-ultrasound's
      distinctive Axis B is a gestational-age window fit, not a safety
      band — its `redirect` persona is an ideal indication/scan-type
      pairing at a gestation far outside that scan's window, recommending
      the scan type that actually fits; sleep-study mirrors holter-
      monitor's score-adjustment pattern (+1/-1 for Epworth/STOP-BANG
      evidence on OSA-pathway indications) and its first persona
      deliberately has evidence present but below threshold, so neither
      adjustment fires; pulmonary-function's `redirect` means 'Defer /
      redirect' — a fourth distinct semantic for that label in this family
      (compare fluoroscopy's literal redirect, holter-monitor's redirect-
      to-a-different-monitor, and nuclear-medicine's accept-with-caution)).
      Final 3 done 2026-09-02 (toxicology-test-request,
      tumor-marker-test-request, ultrasound-test-request — same
      methodology; tumor-marker-test-request's third persona is a verified
      *engine finding*, not just a persona design choice — its `redirect`
      recommendation (interpretationBand === 'misuse-risk') is unreachable
      in practice, because `scoreAppropriateness` forces
      `usually-not-appropriate` in the exact same broad-screening case that
      `scoreInterpretation` forces `misuse-risk`, and `deriveRecommendation`
      checks the appropriateness band first — so screening misuse always
      resolves to query-referrer, confirmed by running `--update` rather
      than assumed).
      **`*-test-request` family COMPLETE: 39/39 forms have verified
      personas** (count re-verified directly against the fleet each
      update, not hand-tracked, after the 2026-09-02 tracking-drift
      correction). Moved on to the `*-test-result` family (the report/
      interpretation counterpart, per-form but structurally parallel:
      resultClassification / abnormalitySeverity+reportingCategory /
      reportCompletenessPercent / followUpUrgency, same
      read-rules.js-then-author-3-personas-then-`--update` method); all 37
      confirmed engine-actionable via `bin/test-engines --verbose` (none
      SKIP), and these engines stamp a `gradedAt` wall-clock ISO timestamp
      that `bin/test-personas` already strips via its volatile-key regex,
      so no special pinning was needed. 3 done 2026-09-02
      (blood-test-result, blood-cross-match-test-result,
      bronchoscopy-test-result — each form's `hasCriticalFinding`-style
      predicate bundles some, but not all, of its major-severity triggers;
      every form's second persona deliberately isolates a major/abnormal
      finding that is *not* in that predicate — blood-cross-match's
      insufficient-units, bronchoscopy's extrinsic central-airway
      compression — to verify the non-critical-alert path actually stays
      non-critical-alert, not just the obvious critical path). 3 more
      done 2026-09-03 (coagulation-test-result, colonoscopy-test-result,
      ct-scan-test-result — the last is this family's gold template;
      coagulation's second persona confirmed a genuine dead-code branch
      (`R-FU-RECOMMENDED-03`, an isolated-APTT-specific follow-up message)
      is unreachable, since `gradeSeverity` always routes isolated APTT
      prolongation through the generic 'moderate' severity first, which
      `gradeFollowUp`'s `severity === 'moderate'` check catches before
      ever reaching the dedicated branch — confirmed by running
      `--update`, the same class of finding as tumor-marker-test-request's
      unreachable `redirect` from the prior *-test-request batch;
      ct-scan's second persona instead covers the one severity band
      (`minor`, incidental-only) not yet exercised by this family's other
      forms this backlog, and confirmed that same follow-up branch IS
      reachable there, unlike coagulation's). 3 more done 2026-09-03
      (cystoscopy-test-result, cytology-test-result,
      eye-vision-test-result — same methodology; cytology's critical/
      low-grade detection is keyword-based (scans `cytologyResultCategory`
      + `reportingCategory` text for substrings like "high-grade" /
      "malignant" / "thy5" / "c5"), not purely boolean-driven, and its
      third persona's narrative deliberately includes "suspicious" (a
      low-grade trigger word) to confirm the sibling urgent-referral flag
      still correctly stays suppressed once hasCriticalFinding is already
      true; eye-vision's second persona confirms background diabetic
      retinopathy (R1) is deliberately not "referable" per NHS Diabetic
      Eye Screening Programme criteria, so it grades minor severity, not
      major, distinct from pre-proliferative / proliferative / maculopathy).
      3 more done 2026-09-03 (fluoroscopy-test-result,
      hearing-test-result, histopathology-test-result — same
      methodology; fluoroscopy's second persona isolates a fistula
      finding, which grades major severity via its own dedicated rule
      but is deliberately not one of the two triggers in
      `hasCriticalFinding` (perforation/leak, obstruction), so it
      escalates only to 'urgent' follow-up, not 'critical-alert';
      hearing's second persona isolates a conductive-component finding
      (bilateral otosclerosis) that grades only moderate severity via
      its own actionable-finding rule, distinct from the PTA-severity
      ladder and from `hasCriticalFinding`'s sudden-SNHL/asymmetry
      triggers; histopathology's engine has the richest split of this
      family — malignancy alone is not a critical finding, only an
      *unexpected* malignancy (no linked originating request) or an
      involved resection margin is — so the second persona confirms a
      biopsy-anticipated, originating-request-linked colorectal
      adenocarcinoma classifies abnormal + moderate severity and drives
      urgent MDT follow-up without ever reaching critical-alert, while
      the third persona's incidental appendiceal adenocarcinoma with no
      originating request confirms the true unexpected-malignancy
      critical path). 3 more done 2026-09-03 (holter-monitor-test-result,
      lumbar-puncture-test-result, mammography-test-result — same
      methodology; holter's second persona isolates paroxysmal atrial
      fibrillation with a controlled ventricular rate (max 132 bpm,
      below the 150 bpm `FAST_AF_MAX_HR_BPM` threshold), which grades
      only moderate via its own dedicated AF rule, distinct from
      `hasCriticalFinding`'s fast-AF/VT/pause>3s/high-grade-AV-block
      triggers — and separately confirmed `F-UNEXPECTED-FINDING-001`
      checks only AF/VT/high-grade-AV-block, not a significant pause, so
      the third (critical, pause-only) persona never raises it even with
      no originating request linked; lumbar-puncture's second persona
      isolates `viralPattern` (its own moderate-severity trigger) with
      an explicitly negative culture ('No growth'), confirming
      `culturePositive`'s negative-phrase matching correctly keeps a
      markedly raised white-cell count off the bacterial/critical
      pathway; mammography is the family's first BI-RADS-driven engine —
      classification and follow-up are keyed off the ACR BI-RADS final
      assessment category rather than the structured-finding booleans,
      and the second persona isolates BI-RADS 4a (`isBiRadsUrgent`,
      urgent biopsy referral) to confirm it stays short of
      `isBiRadsCritical` (BI-RADS 4c/5 only), distinct from the third
      persona's BI-RADS 5). 3 more done 2026-09-03
      (microbiology-culture-test-result, mri-scan-test-result,
      nerve-conduction-study-test-result — same methodology;
      microbiology-culture's second persona isolates MRSA on a
      significant wound-swab culture, which grades major severity via
      its own dedicated resistant-organism rule (R-SEV-MAJOR-02) yet
      classifies only abnormal (not critical) and escalates only to
      'urgent', since `hasCriticalOrganism` requires a positive blood
      culture, a CSF isolate, CPE, or the explicit criticalOrganism
      flag — none of which a resistant wound-swab organism trips; also
      caught and fixed a self-authored gap where the first ("complete")
      persona's antibiotic-sensitivities section was left blank for a
      no-growth culture, silently capping completeness at 80% instead
      of the intended 100%, verified and corrected via `--update` before
      accepting. mri-scan's second persona isolates a large (>= 30mm)
      but non-compressive meningioma, which grades major severity via
      its own dedicated large-lesion rule (R-SEV-MAJOR-02) entirely
      separate from `hasCriticalFinding` (cord compression, haemorrhage,
      infarct only), so it escalates only to 'urgent'. nerve-conduction-
      study's `isSevereAcuteNeuropathy` critical trigger requires
      severity 'severe' AND pattern 'demyelinating' specifically — the
      second persona's severe *axonal* diabetic polyneuropathy grades
      major severity via the general severe-abnormality rule but never
      trips the critical predicate, since only the acute demyelinating
      (GBS-like) pattern is treated as the medical emergency, distinct
      from the third persona's motor-neurone-disease critical path).
      3 more done 2026-09-03 (nuclear-medicine-test-result,
      pet-scan-test-result, sleep-study-test-result — same methodology;
      nuclear-medicine's second persona isolates a reduced ejection
      fraction (< 40%) on a myocardial perfusion gated SPECT, a
      dedicated major-severity rule checked BEFORE the perfusion-defect
      actionable-finding rule and entirely independent of
      `hasCriticalFinding` (a perfusion defect only counts toward
      critical on a `vq-lung-scan`, never on myocardial-perfusion), so
      it escalates only to 'urgent'; pet-scan's second persona isolates
      a high SUVmax (>= 10) primary lesion with no nodal or distant
      spread, a dedicated major-severity rule wholly separate from
      `hasCriticalFinding` (distant metastasis / progressive disease
      only); sleep-study's `hasCriticalFinding` requires severe OSA
      (AHI >= 30) TOGETHER WITH significant desaturation (or nocturnal
      hypoventilation alone) — the second persona's severe OSA (AHI 42)
      with no significant desaturation grades major severity via the
      AHI band alone but never trips the critical predicate, distinct
      from the third persona's severe-OSA-plus-desaturation critical
      path). Final 3 done 2026-09-03 (tumor-marker-test-result,
      ultrasound-test-result, x-ray-test-result — same methodology;
      tumor-marker's engine is the family's odd one out — measured
      NUMERIC marker values, not structured-finding booleans — and its
      `isCriticalResult` covers only a reported-critical overall status
      or a very-high-AFP/beta-hCG germ-cell pattern, so the second
      persona's markedly elevated but *stable* (not rising) CA125 on
      ovarian-cancer surveillance classifies abnormal and grades
      moderate via `hasActionSignal` without ever reaching critical;
      also confirmed `deriveRecommendation` maps moderate severity to
      'urgent-review' here (not 'specialist-referral' as in most
      siblings), since tumour markers are poor screening tests and any
      actionable elevation warrants prompt oncology correlation
      regardless of band. ultrasound's second persona isolates a large
      (>= 30mm) indeterminate hepatic mass, a dedicated major-severity
      rule wholly separate from `hasCriticalFinding` (DVT present or
      aneurysm only). x-ray's `hasCriticalFinding` requires an
      *unstable* fracture specifically — the second persona's stable,
      minimally displaced distal radius fracture grades only moderate
      severity via the general actionable-finding rule and never trips
      the critical predicate, distinct from the third persona's
      pneumothorax critical path.
      **All 37 of 37 `*-test-result` forms now have hand-curated
      personas — this sub-family of Phase 11 is COMPLETE** (count
      re-verified directly against the fleet each update, not
      hand-tracked — `bin/test-personas` ground truth: PASS 270/355,
      up from the family's starting baseline). 73
      forms (outside this family) are engine-SKIP and need
      discovery hints first (was 76 — the `form-validator.js`
      false-exclusion fix above unblocked 2). Then `example-invalid.json` +
      wizard-blocks-submission E2E assertion; API transcripts; FHIR bundles
      for personas; site examples gallery.
- [ ] Latent: snake_case↔camelCase API contract (283 crates + snapshot
      regen); i18n past the Welsh pilot.

## Phase 12 — R4 optimizations ✅ COMPLETE (2026-09-02)

- [x] **Document shared `CARGO_TARGET_DIR` + sccache in CONTRIBUTING.md
      (2026-09-02)** — new "Rust build performance (355 crates)" subsection
      under Environment, linking to the existing (but undiscoverable —
      no guide linked to it) `docs/rust/index.md` sccache setup page for
      detail. Also fixed that page's "sscache" → "sccache" typo (heading +
      two mentions in prose; the actual shell commands were already
      correct) while touching it.
- [x] **Add `--svelte` E2E sweep to the nightly job alongside `--html` (2026-09-02).**
      Found two real gate-truth bugs in `bin/test-e2e` while wiring this up —
      exactly the class of defect Phase 8/9 fixed elsewhere, so fixed rather
      than carried: (1) the svelte loop's `pnpm install && pnpm run build`
      had no failure guard, so under `set -eu` one bad form's install/build
      failure aborted the *entire* fleet sweep rather than being reported
      and skipped; (2) the per-form Playwright test result was swallowed by
      a trailing `|| true` with no aggregate failure tracking at all, so the
      svelte sweep could never turn the job red regardless of how many forms
      failed their a11y smoke check — a gate that cannot fail is not a gate.
      Both fixed: failures are now caught per-form, reported, and the script
      exits 1 if any form failed, while still running every other form.
      Verified against 25 forms (random sample across families) passing,
      plus both failure paths (install failure, and — by construction, same
      code path as the playwright branch — test failure) exercised directly.
      CI: added `pnpm/action-setup@v6` to the `e2e` job and a second step
      running `bin/test-e2e --svelte --all` after the existing `--html` one.
- [ ] Theme-catalogue size: leave as-is unless a need appears (byte-identical
      copies; git stores ~90 blobs — working-tree cost only); revisit only
      with a measurement.

## Done (previous rounds — summary)

- 286 forms built to uniform depth: specs, docs, SQL, generated XML / FHIR
  R5 / protobuf / OpenAPI, HTML + Svelte front-ends, Loco back-end crates,
  CHANGELOGs, examples. HTML consolidation 286/286; Svelte route nesting +
  `app.css` import fix 286/286 (routes return 200); Loco crate batch fully
  green; Lily HTML drift 0; Lily Svelte 284/286 PASS.
