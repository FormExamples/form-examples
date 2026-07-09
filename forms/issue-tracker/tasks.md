# Tasks

## Authored

- [x] Design spec in `index.md` derived from `seed.md`
- [x] Agent instructions in `AGENTS.md`
- [x] Implementation plan in `plan.md`
- [x] SQL migrations: extensions, trigger function, reporter, participant,
      issue_tracker, issue_tracker_grade, issue_tracker_grade_rule,
      issue_tracker_grade_flag
- [x] Generated XML + DTD per SQL table
- [x] Generated FHIR HL7 R5 JSON per SQL entity
- [x] Scaffolded the four front-end directories (form + dashboard, each in
      HTML and SvelteKit) with `index.md`, `AGENTS.md`, `CLAUDE.md`,
      `plan.md`, `tasks.md`
- [x] Scaffolded the Rust crate at
      `back-end-with-loco/` with `Cargo.toml`,
      `.gitignore`, `src/bin/main.rs`, and a base Tera template that
      includes HTMX, Alpine.js, and `hx-boost`
- [x] Authored the `back-end-with-loco-setup` scaffold
      generator shell script

## Pending

### Scoring engine

- [x] Author `types.ts` for the `IssueTrackerAssessment` input
      (`front-end-with-svelte/src/lib/engine/types.ts`)
- [x] Author `priority-rules.ts`, `severity-rules.ts`, `magnitude-rules.ts`,
      `harm-rules.ts`, `failure-rules.ts`, `moscow-rules.ts`,
      `frequency-rules.ts`
- [x] Author `composite-grader.ts` with max-grade behaviour
- [x] Author `flagged-issues.ts` for the safety flags
- [x] Vitest unit tests for the composite grader and every rule file
      (17 tests, all passing)
- [x] Zod runtime input-validation schemas mirroring `types.ts` —
      `src/lib/engine/schemas.ts` exposes
      `issueTrackerAssessmentSchema`, `rawScoresSchema`,
      `reporterMetadataSchema`, plus `parseAssessment`/`parseScores`
      (throwing) and `safeParseAssessment` (path-keyed errors). Numeric
      fields use `z.preprocess` to coerce HTML-form strings to numbers
      and treat `''` as `null`. Sections default to `{}` so a partial
      payload validates. Verified by `schemas.test.ts` (12 tests
      passing — total Vitest 29/29).
- [x] localStorage autosave for the wizard — `src/lib/autosave.ts`
      with `save() / load() / clear() / subscribe()` (debounced writer
      with `flush()` / `cancel()`). Saved blob carries a schema version
      so incompatible drafts get rejected on reload; `load()` re-runs
      the Zod schema so out-of-range stored data is silently discarded
      instead of crashing the form. Storage backend is injectable so
      tests use an in-memory mock. Verified by `autosave.test.ts`
      (10 tests passing — total Vitest 39/39).

### Front-end

- [ ] Flesh out the SvelteKit single-page wizard with `StepNNName.svelte`
      step components (1..10)
- [ ] Wire the class-based reactive store
      (`assessment.svelte.ts`)
- [x] PDF report renderer (`pdfmake`-compatible docDefinition builder) —
      `src/lib/report/pdf.ts` exports `buildReportDocDefinition(data,
      result, opts)` returning the document object the wizard's
      `/report/pdf` endpoint hands to `pdfMake.createPdf(...).download()`.
      Includes title bar with composite-priority badge, metadata
      columns, the seven-scores table, fired-rule list, safety-flag
      list (with priority styling), all nine SOAP-section headings,
      and an optional dashboard URL. PDF metadata (`info.title`,
      `info.subject`) populated from the assessment. Verified by
      `pdf.test.ts` (10 tests passing — total Vitest 49/49).
- [ ] Wire `buildReportDocDefinition` into a SvelteKit
      `/report/pdf/+server.ts` endpoint (pending the SvelteKit
      project bootstrap)
- [ ] SVAR DataGrid review dashboard with composite, severity, harm,
      failure, frequency, environment filters
- [x] Static HTML wizard mirror with native form elements (10-step
      single page) — verified end-to-end with Playwright
- [x] Static HTML dashboard mirror with sortable / filterable table —
      verified end-to-end with Playwright

### Rust backend

- [x] Implement the Rust port of the scoring engine with
      `serde(rename_all = "camelCase")` — eleven modules under
      `src/scoring/` mirroring the TypeScript engine
- [x] `cargo test` coverage of the scoring engine
      (17 tests, all passing — symmetric with the Vitest suite)
- [x] CLI binary `issue-tracker-cli` that round-trips
      `IssueTrackerAssessment` JSON on stdin to `GradeResult` JSON on stdout
- [ ] Run the scaffold generator to produce SeaORM entities and Loco
      controllers from the SQL migrations (re-adds Loco / SeaORM /
      axum / Tera deps to `Cargo.toml`)
- [x] Tera templates: `assessment.html.tera` (the single-page wizard
      embedding ten step partials), `assessment/step01..step10.html.tera`,
      `report.html.tera`, `dashboard.html.tera` — verified by
      `tests/template_tests.rs` (5 tests passing)
- [x] HTMX-driven dashboard chrome (`hx-get`, `hx-target`, debounced
      search) — verified by template tests; live wiring to a controller
      pending the Loco scaffold

### Adapters

- [x] LFPSE FHIR DetectedIssue export adapter (clinical issues only) —
      `src/adapters/lfpse.rs` with eligibility predicate and
      `to_lfpse_bundle()` returning a FHIR R5 collection Bundle of
      ClinicalImpression + N DetectedIssue resources; verified by
      `tests/lfpse_tests.rs` (6 tests passing)
- [x] ICO personal-data-breach export adapter — `src/adapters/ico.rs`
      with eligibility (data-protection issues, or security issues with
      harm ≥ 1) and `to_ico_breach_report()` returning a UK GDPR
      Article 33-aligned JSON document; verified by
      `tests/ico_tests.rs` (6 tests passing). Out-of-band fields
      (data-subject categories, approximate counts, DPO contact,
      cross-border flag) accepted via an explicit `IcoBreachExtras`
      struct so the core schema doesn't need to grow.
- [x] HSE RIDDOR export adapter — `src/adapters/riddor.rs` with
      eligibility (workplace-safety or medical-device, harm ≥ 1) and
      `to_riddor_report()` returning a JSON document aligned with the
      HSE F2508 family of forms; verified by `tests/riddor_tests.rs`
      (7 tests passing). Out-of-band RIDDOR-specific fields (incident
      type per the 2013 regulations, injured-person details, site
      address, days off work) accepted via an explicit
      `RiddorReportExtras` struct.
- [x] Inbound webhooks: Sentry and PagerDuty —
      `src/adapters/webhooks/{sentry,pagerduty}.rs` parsers that turn
      external alert payloads into a `WebhookDraft { assessment,
      cc_summary, external_reference }`. Sentry maps `level`
      (fatal..debug) → severity 5..1 and routes fatal/error to
      `service-outage`; PagerDuty maps `urgency` (high/low) → severity
      4/2 and routes `incident.triggered` to `service-outage`. Verified
      by `tests/webhook_tests.rs` (6 tests passing).
- [x] Inbound webhooks: Datadog, CloudWatch —
      `src/adapters/webhooks/{datadog,cloudwatch}.rs`. Datadog maps
      `alert_type` (error/warning/info/success) → severity 4/3/2/1 and
      `priority` (P1..P5) → priority rank, with `Triggered/Re-triggered`
      → `service-outage` and `Recovered` → `process`; pulls
      env/service/host from the comma-separated tags string. CloudWatch
      maps `NewStateValue` (ALARM / INSUFFICIENT_DATA / OK) →
      severity 4/2/1 and the same → category mapping; system_name is
      `Namespace/MetricName` and external_reference is the alarm ARN.
      Verified by `tests/webhook_datadog_cloudwatch_tests.rs`
      (7 tests passing).
- [x] Outbound notifications: Slack Block Kit, MS Teams Adaptive Card,
      and email — `src/adapters/notifications/{slack,teams,email}.rs`.
      Each renderer skips low/moderate composite priority (returns `None`)
      and emits the right wire format for high/critical issues. Email
      `body_html` HTML-escapes user-supplied text. Verified by
      `tests/notification_tests.rs` (7 tests passing).

### Bulk imports

- [x] GitHub Issues and Jira Cloud importers —
      `src/adapters/imports/{github,jira}.rs`. GitHub maps labels to
      issue category (security/performance/outage/bug/etc.) and
      `p0`..`p3` labels to priority rank 1..4; falls back to
      `repository.full_name` then to URL parsing for the system name.
      Jira maps `issuetype.name` to category (Bug→software-defect,
      Incident→service-outage, Story/Task→process) and
      `priority.name` (Blocker..Trivial) to priority rank 1..5.
      Verified by `tests/import_tests.rs` (8 tests passing).
- [ ] Linear and Azure Boards importers (same `ImportDraft` shape)

### Integration pipeline

- [x] `src/pipeline.rs` orchestrator — `run_integrations(issue_id,
      cc_summary, dashboard_url, extras, data, result)` returns an
      `IntegrationOutputs` struct with all six adapter outputs in one
      pass. Each output is `Some` only when its adapter's eligibility
      predicate passes (LFPSE clinical+harm, ICO data-protection,
      RIDDOR workplace, notifications high/critical). Verified by
      `tests/pipeline_tests.rs` (6 tests passing) covering: low-priority
      software-defect → 0 outputs; clinical fatal → LFPSE+3 notifications;
      data-protection breach → ICO+3 notifications; workplace injury →
      RIDDOR+3 notifications; medical-device → LFPSE+RIDDOR+3 notifications
      simultaneously; moderate priority skips all six gates.

### Compliance

- [ ] ISO/IEC 27035 alignment review
- [ ] ISO 31000:2018 risk-management mapping
- [ ] DCB0129 clinical-risk management for the LFPSE export path
- [ ] GDPR data-processing impact assessment

## Known issues

- Form is a *general-purpose* issue tracker, but the FHIR mapping uses
  clinical-safety resources (Patient → Reporter, Encounter → Issue,
  Observation → Section, ClinicalImpression → Grade, DetectedIssue → Flag).
  This is appropriate when the issue is a clinical safety event but is
  semantically loose for non-clinical issues. A second mapping (FHIR
  AuditEvent / Communication) may be appropriate later.
- The `score_by_priority_rank` is unbounded in `seed.md`. The
  implementation caps it at 999 for storage and rendering.
- "Fractures (Fx)" is the section name in the seed; the term comes from
  the medical analogy. UI labels say "Failures" alongside "Fractures" so
  non-medical reporters are not confused.
