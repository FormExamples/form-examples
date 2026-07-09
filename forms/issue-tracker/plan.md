# Plan

## Status

Design spec authored from `seed.md`. SQL schema, XML, and FHIR R5
representations generated. Front-ends and Rust backend are scaffolded but
domain logic still needs to be filled out.

## Architecture

- Single-page wizard collecting the nine SOAP-style sections (CC, Pt, Sx, Fx,
  Hx, Ix, Dx, Tx, Px) plus reporter metadata.
- Pure scoring engine producing seven independent scores plus a composite
  priority and a list of safety flags.
- One PostgreSQL schema per form, generated XML + DTD per SQL entity, and
  generated FHIR HL7 R5 JSON resources.
- Four front-ends (form and dashboard, each in HTML and SvelteKit), and one
  Rust full-stack crate (axum + Loco JSON API).

## Roadmap

### High priority

1. **Domain modelling.** Translate the nine SOAP sections into TypeScript
   types and SQL columns. Capture each SOAP section as a JSONB sub-document
   on the parent `issue_tracker` row, mirroring the per-section pattern used
   by clinical assessments.
2. **Scoring engine.** Implement `gradeIssue(data)` returning the seven
   scores, the composite priority, fired rules, and safety flags.
3. **Single-page wizard.** Ten-step Svelte wizard with `StepNavigation`,
   `ProgressBar`, and the canonical class-based reactive store.
4. **Dashboard.** SVAR DataGrid with composite-priority filter, severity
   filter, harm-grade filter, failure-condition filter, environment filter,
   and free-text search across CC/Sx/Dx.
5. **Tests.** Vitest unit tests for every scoring rule and for the
   composite-grader's max-grade behaviour.
6. **PDF report.** SvelteKit `/report/pdf` endpoint via `pdfmake` rendering
   the nine SOAP sections, the seven scores, the composite, the flags,
   and the reporter signature.

### Done

- ✅ LFPSE FHIR export adapter
  (`src/adapters/lfpse.rs`).
- ✅ ICO personal-data-breach export adapter (`src/adapters/ico.rs`).
- ✅ HSE RIDDOR export adapter (`src/adapters/riddor.rs`).
- ✅ Bulk-import parsers for GitHub Issues and Jira Cloud
  (`src/adapters/imports/{github,jira}.rs`); Linear and Azure Boards
  parsers still pending.
- ✅ Inbound webhook parsers for Sentry, PagerDuty, Datadog, and
  CloudWatch (`src/adapters/webhooks/{sentry,pagerduty,datadog,cloudwatch}.rs`).
- ✅ Slack Block Kit, MS Teams Adaptive Card, and email outbound
  notification renderers (`src/adapters/notifications/{slack,teams,email}.rs`).

### Medium priority

- Linear and Azure Boards bulk-import parsers (same shape as GitHub /
  Jira).
- HTTP transport layer wiring the adapters to live endpoints (today's
  adapters return ready-to-post payloads — caller posts them).

### Low priority

- Markdown / HTML rich-text editor for the long-form sections.
- File / screenshot attachments per section.
- Linking issues into clusters (parent/child, blocks, duplicates).
- SLA timers per composite priority.
- ✅ Trend dashboards: issue count by month, harm grade by system,
  severity by environment — pure aggregator at
  `front-end-with-svelte/src/lib/dashboard/trends.ts`
  (`countByField`, `countByMonth`, `countByCompositeAndMonth`,
  `numericStatsByField`, `topNByField`); 13 vitest tests passing.
  Wiring to a chart component is left for the SvelteKit dashboard.
- i18n scaffolding (en-GB primary; en-US, cy-GB, de-DE planned).

## Compliance roadmap

- ISO/IEC 27035 alignment review.
- ISO 31000:2018 risk-management mapping.
- DCB0129 clinical-risk management for the LFPSE export path.
- GDPR data-processing impact assessment.
- Penetration testing and security audit of the full-stack deployment.

## Known gaps

- The Rust full-stack crate is a minimal `main.rs` shell; controllers,
  models, migrations, templates, and tests still need to be authored.
- The HTML and SvelteKit front-ends are scaffolds only — the multi-step
  wizard, scoring engine, and dashboard need domain-specific implementation.
- The `seeds/` directory does not yet hold authoritative source PDFs for
  the seven external scoring scales (Saffir-Simpson NWS factsheet,
  USGS Richter explainer, FAA AC 25.1309-1A, NHS LFPSE harm-grade guidance,
  Clegg-Barker MoSCoW source). These will be added when the form is
  promoted from design-spec to fully implemented.
