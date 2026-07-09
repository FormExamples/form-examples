# Pre-operative Assessment by Patient

A UK NHS–aligned, **patient self-report** pre-operative questionnaire that the
patient (or their carer) completes before surgery. It collects patient-reported
health data via a single-page, step-by-step wizard, computes an **ASA
(American Society of Anesthesiologists) Physical Status Classification** grade,
and flags safety-critical issues for anaesthetic planning.

This form is the **patient counterpart** to
[`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician),
which records the clinician's objective findings (history, examination, vitals,
laboratory results, imaging). Where the clinician form captures observed
findings, this form captures what the patient reports about themselves.

## Scope and intended users

- **Setting:** NHS pre-operative assessment clinic, day-surgery unit, or online
  pre-assessment completed by the patient at home before attending.
- **Users:** the **patient**, or a carer completing the form on the patient's
  behalf.
- **Patients:** adults considered for elective or urgent surgery under general,
  regional, or anaesthesia-led sedation.

## Scoring system

- **Instrument**: ASA Physical Status Classification (PSC)
- **Range**: I-VI
- **Categories**:
  - ASA I: Normal, healthy patient
  - ASA II: Patient with mild systemic disease
  - ASA III: Patient with severe systemic disease
  - ASA IV: Patient with severe, incapacitating systemic disease
  - ASA V: Moribund patient not expected to survive without the operation
  - ASA VI: Brain-dead patient for organ donation

## Steps

| #   | Step                     |
| --- | ------------------------ |
| 1   | Demographics             |
| 2   | Cardiovascular           |
| 3   | Respiratory              |
| 4   | Renal                    |
| 5   | Hepatic                  |
| 6   | Endocrine                |
| 7   | Neurological             |
| 8   | Haematological           |
| 9   | Musculoskeletal & Airway |
| 10  | Gastrointestinal         |
| 11  | Medications              |
| 12  | Allergies                |
| 13  | Previous Anaesthesia     |
| 14  | Social History           |
| 15  | Functional Capacity      |
| 16  | Pregnancy                |

## Directory structure

```
pre-operative-assessment-by-patient/
  index.md                        # this file
  README.md -> index.md           # symlink for GitHub rendering
  AGENTS.md                       # agent instructions
  plan.md                         # implementation roadmap
  tasks.md                        # task tracking
  CHANGELOG.md                    # Keep-a-Changelog per form
  llms.txt                        # llmstxt.org summary (generated)
  doc/                            # clinical / regulatory reference documentation
  examples/                       # filled-form JSON fixtures + FHIR R5 Bundle samples
  spec/                           # living domain spec (index.md)
  sql/                            # PostgreSQL Liquibase migrations (source of truth)
  xml/                            # XML + DTD per SQL table entity (generated)
  fhir/r5/                        # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                       # Protocol Buffers .proto schemas per SQL entity (generated)
  openapi/                        # OpenAPI 3.1 .yaml specifications per SQL entity (generated)
  front-end-with-html/            # questionnaire + dashboard (HTML + Lily Design System)
  front-end-with-svelte/          # questionnaire + dashboard (SvelteKit + Lily)
  back-end-with-loco/             # back-end Rust JSON API (axum + Loco)
```

## Documentation

See [doc/index.md](doc/index.md) for comprehensive documentation including ASA grading rules, clinical safety case, and deployment guides.

## Technology

See [root index.md](../index.md) for technology stacks.
</content>
</invoke>
