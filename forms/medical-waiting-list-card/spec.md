# Medical Waiting List Card — specification

This file is the **living domain spec** for this form. It captures the
contract each implementation (SQL schema, generated representations,
front-ends, and Rust backend) must satisfy. Treat it as the source of truth
for behaviour — update the spec before changing code.

Slug: `medical-waiting-list-card`

## 1. Purpose

A practitioner-completed administrative card that places a patient on a
medical waiting list and gives the patient a transparent view of their
referral, expected wait, and upcoming appointment.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard,
each in HTML and SvelteKit), and the Rust full-stack crate listed in §5.
Out of scope: hosted deployment, authentication, multi-tenancy, direct
NHS e-RS integration, automated breach-letter dispatch.

## 3. Scoring system

See [`index.md`](index.md) for the scoring instrument, ranges, and
categories. The composite grader combines:

- **Waiting Time Status** — four bands (`within-target`,
  `approaching-breach`, `breached`, `long-wait`) computed from days waited,
  the priority-driven target wait, and the 18-week / 52-week RTT thresholds.
- **Clinical Priority** — P1a, P1b, P2, P3, P4, P5, P6 recorded at referral.

The worst-band finding sets the overall Waiting Time Status. Safety /
operational flags fire independently and are returned as
`additionalFlags[]`.

## 4. Inputs and outputs

**Inputs.** A typed `WaitingListCard` object whose shape mirrors the SQL
schema in `sql-migrations/`. Unanswered text and enum fields default to
`''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: `waitingTimeStatus`,
`clinicalPriority`, `daysWaited`, `weeksWaited`, `daysToTarget`,
`daysToBreach`, `daysToAppointment`, `firedRules[]`, `additionalFlags[]`,
plus a patient-facing card and a practitioner report. Rendered as HTML in
the browser, exported as PDF via the SvelteKit endpoint, and convertible to
FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

Required artefacts and their current status:

| Subdirectory | Role |
| --- | --- |
| `sql-migrations` | source of truth |
| `xml-representations` | generated |
| `fhir-r5` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-form-with-html` | Lily contract |
| `front-end-form-with-svelte` | SvelteKit |
| `front-end-dashboard-with-html` | Lily contract |
| `front-end-dashboard-with-svelte` | SvelteKit + SVAR |
| `full-stack-with-loco-tera-htmx-alpine` | Rust + Loco |
| `full-stack-with-loco-tera-htmx-alpine-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup
script) are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form medical-waiting-list-card` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The four front-ends pass `pnpm run check` where applicable.
- The Rust crate builds with `cargo build` and passes `cargo test`.
- All generated artefacts are reproducible from `sql-migrations/`.

## 7. Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — administrative
  patient-pathway record; Class I.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.
- UK GDPR and Data Protection Act 2018.

## 8. Clinical / policy references

- NHS England *RTT consultant-led waiting times — Rules Suite*.
- NHS England *Clinical Prioritisation* framework (P1–P6).
- NHS Constitution for England.
- Royal College of Surgeons *Clinical guide to surgical prioritisation
  during the coronavirus pandemic*.

## 9. Living-spec change rules

- Update this file *before* changing the SQL migrations or the scoring
  engine.
- After schema changes, regenerate XML, FHIR, protobuf, OpenAPI, and the
  Loco setup script using the generators in `/AGENTS.md` §Tools.
