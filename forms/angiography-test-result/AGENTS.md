# Angiography Test Result — Agent Instructions

UK NHS–aligned structured angiography result (report) that a reporting
clinician completes after a vascular angiographic examination. Collects the
examination details, clinical history, narrative and structured vascular
findings, measurements, impression, and sign-off via a single continuous
single-page wizard, then computes a **four-axis interpretation grade** —
Axis A result classification (normal / abnormal / critical / inconclusive),
Axis B abnormality severity plus a structured NASCET / ECST reporting
category, Axis C report completeness (0–100 %), and Axis D follow-up urgency
(routine → recommended → urgent → critical-alert) — plus an overall
recommendation, a fired-rule audit trail, and safety-critical flags with an
automatic **critical-result alert**.

See [`index.md`](./index.md) for the full design and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (RCR reporting standards, NASCET / ECST, IR(ME)R 2017)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Grading engine

- **Input shape:** `AngiographyResult` — the report record mirroring
  `sql/04_create_table_angiography_test_result.sql` (camelCase properties).
- **Output shape:** `calculateGrade(result)` returns a `GradingResult`:
  `resultClassification`, `abnormalitySeverity` + `reportingCategory`,
  `reportCompletenessPercent`, `followUpUrgency` + `targetTimeframe` +
  `recommendedAction`, overall `recommendation`, `firedRules[]`, `flags[]`,
  and `gradedAt`.
- **Safety invariant:** a critical finding (active extravasation, dissection,
  occlusion, or a near-occlusive stenosis ≥ 99 %) auto-escalates Axis D to
  `critical-alert` and raises the `critical-result-alert` flag regardless of
  the other axes. The least-urgent band is chosen only when no rule fires.
- **Engine files (SvelteKit, tested):**
  `front-end-with-svelte/src/lib/engine/{types,utils,classification-rules,severity-rules,completeness-rules,follow-up-rules,grader,flagged-issues}.ts`
  with `grader.test.ts`.
- **Engine files (HTML port):**
  `front-end-with-html/js/{types,rules,grader,flags}.js` — keep rule IDs,
  thresholds, and flag categories identical to the SvelteKit engine.

## Flagged issues

Computed independently of the four axes: critical-result alert (high, plus a
second high flag when not yet communicated), abnormal requiring action
(high), urgent referral for ≥ 70 % stenosis (medium), inadequate technique
(high / medium), incidental finding (low), missing impression (medium),
missing measurement (low), and unexpected finding with no originating request
reference (low). Flags sort high → medium → low.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript, JavaScript, and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Royal College of Radiologists. *Standards for the interpretation and
  reporting of imaging investigations.*
- NASCET / ECST arterial-stenosis grading conventions.
- ACR Appropriateness Criteria.
- UK Ionising Radiation (Medical Exposure) Regulations — IR(ME)R 2017.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form angiography-test-result
```
