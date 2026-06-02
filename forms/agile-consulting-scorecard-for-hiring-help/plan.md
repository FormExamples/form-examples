# Plan

## Status

All six numbered high-priority items below are **done**. The remaining
work is the full Loco app (controllers + Tera templates replacing the
thin axum server), plus medium- and low-priority adapters and
compliance work. `bin/test-form` reports zero errors and **60 tests
pass** end-to-end (33 form Vitest + 13 dashboard Vitest + 14 Cargo).

## Architecture

- Single-page wizard collecting organization / respondent metadata plus
  the sixteen yes/no checklist items (4 manifesto + 12 principles).
- Pure scoring engine producing `score_total` (0..16),
  `score_band` (low / borderline / medium / high), the manifesto and
  principles subtotals, and six readiness flags. Implemented in
  TypeScript (form), Rust (server + CLI), and vanilla JS (static HTML).
- One PostgreSQL schema, generated XML + DTD per SQL entity, and
  generated FHIR HL7 R5 JSON resources.
- Four front-ends (form and dashboard, each in HTML and SvelteKit) plus
  a Rust crate that ships a CLI and a minimal axum HTTP server.
- Golden-file fixtures in `samples/` (`sample-assessment.json`,
  `sample-grade.json`) anchor engine parity across the three
  implementations.

## Roadmap

### High priority — DONE

1. **Domain modelling.** ✅ TypeScript `AgileConsultingScorecardAssessment`
   type + matching SQL columns (`m1`..`m4`, `p1`..`p12` with
   `*_done` boolean + `*_evidence` text).
2. **Scoring engine.** ✅ `gradeScorecard(data)` returns `scoreTotal`,
   `computedBand`, `manifestoSubtotal`, `principlesSubtotal`,
   `firedRules`, and `additionalFlags`. Implemented in TS, Rust, and
   vanilla JS; parity-tested against a single golden file.
3. **Single-page wizard.** ✅ Six-step SvelteKit wizard with
   `StepNavigation`, `ProgressBar`, `ChecklistItem`, and the
   canonical class-based reactive store (`assessment.svelte.ts`).
4. **Dashboard.** ✅ SVAR DataGrid with band, sector, and size filters,
   free-text search, per-row report drilldown, and same-origin
   `+server.ts` endpoints so it works standalone.
5. **Tests.** ✅ 33 + 13 + 14 = 60 cases. Vitest covers the engine,
   schema validation, PDF builder, dashboard recommendation mapper,
   and sample-data invariants. Cargo covers the engine and the axum
   integration surface.
6. **PDF report.** ✅ SvelteKit `/report/pdf` POST endpoint via
   `pdfmake`. Validates input with zod, runs `gradeScorecard`, builds
   a `TDocumentDefinitions` with score header, organization /
   respondent block, 16-row item table, and readiness-flag list.

### High priority — REMAINING

- **Full Loco app.** Run the `back-end-with-loco-setup`
  script to scaffold SeaORM entities and Loco controllers. Replace the
  thin axum server with Loco controllers wrapping the existing scoring
  engine.
- **Tera templates.** `assessment.html.tera` (six-step wizard with step
  partials), `report.html.tera`, `dashboard.html.tera` (HTMX-driven
  filter / sort).

### Medium priority

- "Recommended next actions" mapper: for each `false` item, surface the
  one or two interventions named in `seed.md` (e.g. internationalize
  the hello-world program, run a 3-amigos MVP).
- Pre-tender export adapter: produce a vendor-facing summary that omits
  raw answers and shares only the band + flags + recommended focus
  areas.
- Bulk import of historical scorecards from a CSV or JSON dump.
- Email + Slack outbound notifications when a flag fires.
- Comparison view: re-take the scorecard after 3 months and diff the
  two snapshots side-by-side.

### Low priority

- Markdown / rich-text editor for evidence fields.
- File attachments per item (e.g. a screenshot of the NPS dashboard).
- Trend dashboard: band distribution by sector / org size over time.
- i18n scaffolding (en-GB primary; en-US, cy-GB, de-DE planned).
- Anonymous benchmark mode: opt-in to share band-only results into an
  aggregate benchmark dataset.

## Compliance roadmap

- ISO 9001:2015 alignment review for the self-assessment workflow.
- UK GDPR data-processing impact assessment for respondent identity
  fields (name, email, signature).
- Accessibility audit (WCAG 2.2 AA) of the wizard and dashboard.
- Penetration testing and security audit of the full-stack deployment.

## Known gaps

- The seed's score band leaves `5` outside both Low and Medium. The
  engine treats `5 → borderline` (rendered as Low with an explanatory
  note) so the verdict is always defined for every total in 0..16.
- `seed.md` does not define how heavily to weigh manifesto items
  vs. principles. The engine reports both subtotals so weighting can
  be added later without re-modelling.
- This form is non-clinical, but the FHIR mapping reuses
  `ClinicalImpression` and `DetectedIssue` per the monorepo's
  patient-assessment scaffold. A second mapping (FHIR
  `QuestionnaireResponse` + `Organization`) may be more semantically
  appropriate; both will be evaluated.
- The Rust crate ships a thin axum server (good enough to serve the
  dashboard locally). The full Loco app — SeaORM entities, controllers,
  Tera templates — is still pending.
