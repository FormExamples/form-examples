# Plan: Oncology Waiting List Card

## Current status

Scaffolded 2026-05-31 from `seed.md`. Design extends the seed into a
7-step practitioner wizard aligned with NHS England Referral to Treatment
(RTT) rules and the Clinical Prioritisation framework (P1–P6).

## Why this form exists

NHS waiting lists are opaque to patients: they typically receive a referral
letter, then nothing measurable until an appointment is offered weeks or
months later. The Oncology Waiting List Card gives the patient a single
record that captures *what they are waiting to do*, *when they joined the
list*, *what their clinical priority is*, and *when their next appointment
is*. The same record gives booking-office staff a structured artefact that
fires breach-risk flags as the RTT clock-start date ages past the priority
target.

## Design principles

- **Patient-readable output** — the card is rendered as a patient-facing
  summary, not a clinical letter. The patient sees what they are waiting
  for, when they joined the list, their clinical priority in plain
  language, and their next appointment.
- **Practitioner-completed input** — entered by a GP, hospital consultant,
  referral co-ordinator, or outpatient booking clerk. The card is never
  edited by the patient.
- **Single-page wizard** — 7 steps on one continuous page (no multi-page
  forms; monorepo rule).
- **NHS RTT alignment** — the Waiting Time Status is derived from the RTT
  clock-start date, the clinical priority, and the appointment date using
  the published NHS targets.
- **Max-grade composite scoring** — the worst-band finding sets the overall
  Waiting Time Status; safety / operational flags fire independently.
- **Pure scoring engine** — `calculateWaitingTimeStatus()` is a pure
  function with no I/O, fully unit-tested with Vitest.
- **FHIR-first exchange** — the canonical interchange format is FHIR R5
  Bundle (`Patient`, `ServiceRequest`, `Appointment`); XML is an archival
  fallback.

## Scoring engine

The composite grader combines two instruments:

- **Waiting Time Status** (four bands) computed from days waited, the
  priority-driven target wait, and the 18-week / 52-week RTT thresholds.
- **Clinical Priority** (P1a / P1b / P2 / P3 / P4 / P5 / P6) recorded at
  referral by the practitioner; surfaced unchanged but used as input to
  the Waiting Time Status calculation.

Safety / operational flags fire independently and surface as
`additionalFlags[]` on the engine output.

## Build order

1. [x] Scaffold directory (existing).
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`, `spec.md`, `doc/index.md`.
3. [ ] Author SQL Liquibase migrations for patient, practitioner, waiting
       list card, appointment, grade, grade rule, and grade flag.
4. [ ] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
5. [ ] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. [ ] Generate Protocol Buffers with
       `bin/protobuf/generate-protobuf-representations.py`.
7. [ ] Generate OpenAPI 3.1 with
       `bin/openapi/generate-openapi-representations.py`.
8. [ ] Generate Loco scaffold script with
       `bin/back-end-with-loco/generate-back-end-with-loco-setup.py`.
9. [ ] Build SvelteKit practitioner form (single-page wizard).
10. [ ] Build static HTML practitioner form (Alpine.js).
11. [ ] Build SvelteKit dashboard (SVAR DataGrid).
12. [ ] Build static HTML dashboard (sortable table).
13. [ ] Build Rust full-stack with axum / Loco JSON API.
14. [ ] Unit-test composite grader (Vitest).
15. [ ] Run `bin/test-form oncology-waiting-list-card`.

## Out of scope

- Hosted deployment, authentication, multi-tenancy.
- Direct integration with the NHS e-RS (Electronic Referral Service); the
  card emits a FHIR R5 Bundle that an integration layer can convert.
- Automated breach-letter dispatch; the card surfaces breach flags but
  letters are produced by the host system.
