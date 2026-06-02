# Issue tracker

A general-purpose issue tracker that borrows the structure of a clinical
**SOAP-style assessment** and applies it to any reportable problem — software
defects, operational incidents, safety events, project blockers, customer
complaints, and so on. Each issue is captured through a single-page,
step-by-step questionnaire (nine SOAP-style sections) and graded with seven
independent scoring scales drawn from medicine, aviation, civil engineering,
and software-product practice. The output is a signed report with a composite
priority and a list of safety-critical flags, suitable for triage and
remediation tracking.

This form is the "non-clinical" counterpart in the monorepo: it reuses the
same patient-assessment scaffold (single-page wizard, pure scoring engine,
SQL-XML-FHIR representation, four front-ends, full-stack Rust backend) but
treats the *issue itself* as the patient.

## Scope and intended users

- **Setting:** software engineering team, DevOps / SRE on-call rotation,
  incident response, project management, product operations, clinical safety
  reporting (LFPSE), legal/compliance casework.
- **Users:** engineers, on-call responders, project managers, product
  managers, compliance officers, customer-success agents, safety officers.
- **Subjects:** any reportable problem — bug, outage, safety event,
  blocker, incident, near-miss, complaint, regulatory issue, hardware
  fault, operational risk.

## Nine SOAP-style sections

The questionnaire walks the reporter through the same nine fields a
clinician would walk a patient through, adapted to issue triage:

| # | Section | Abbrev. | Purpose |
| --- | --- | --- | --- |
| 1 | Chief Complaint | CC | One-sentence summary of the problem as reported by the affected person |
| 2 | Participants | Pt | Discoverer, affected users, assignees, stakeholders to inform |
| 3 | Symptoms | Sx | What is going wrong on the surface — error messages, outage signals, alerts |
| 4 | Fractures | Fx | What is broken — failed component, crashed process, stuck pipeline |
| 5 | History | Hx | Background — prior similar issues, references, related tickets |
| 6 | Investigations | Ix | Steps being taken to research the issue — tests, repros, queries |
| 7 | Diagnosis | Dx | Underlying cause(s) — root cause and contributing causes |
| 8 | Treatments | Tx | Action items, mitigations, remediations, fix plans |
| 9 | Prognosis | Px | Forecast — expected resolution, residual risk, monitoring plan |

## Seven scoring systems

The grade table records seven independent scores. The composite priority is
the worst-band finding across them (max-grade algorithm), so a single
catastrophic dimension drives the issue to the top of the queue.

| # | Score | Range | Origin | Purpose |
| --- | --- | --- | --- | --- |
| 1 | `score_by_priority_rank` | 1, 2, 3, … | to-do list practice | Workflow ordering — Priority 1 is "do first" |
| 2 | `score_by_severity_of_impact` | 1 (minimal) – 5 (catastrophic) | Saffir–Simpson hurricane scale | Magnitude of impact on users / business |
| 3 | `score_by_magnitude_of_damage` | 1 (minor) – 10 (total destruction) | Richter earthquake scale | Magnitude of physical / system damage |
| 4 | `score_by_harm_grade` | 0 (no harm) – 4 (fatal) | NHS LFPSE patient-safety grading | Harm to a person caused by the issue |
| 5 | `score_by_failure_condition` | A (catastrophic) – E (no effect) | FAA / EASA aviation standards | Failure-mode classification |
| 6 | `score_by_moscow_requirement` | 1 (must) – 4 (won't) | MoSCoW software-requirements method | Requirement prioritisation |
| 7 | `score_by_frequency_percent` | 0 % – 100 % | epidemiology / quality | Proportion of usage affected |

Each score is recorded once per issue, in the `issue_tracker_grade` row, with
the rule that fired captured in `issue_tracker_grade_rule` and the
safety-critical flags in `issue_tracker_grade_flag`.

### Composite priority

| Composite | Drivers |
| --- | --- |
| Low | priority 4+, severity 1, magnitude 1–2, harm 0, failure E, moscow 4, frequency < 5 % |
| Moderate | any single mid-band finding |
| High | priority 2, severity 4, magnitude 6–8, harm 2, failure B, moscow 1, frequency 50–75 % |
| Critical | priority 1, severity 5, magnitude 9–10, harm 3–4, failure A, frequency ≥ 75 % |

## Safety flags

Computed independently of the composite priority. Priority `high` / `medium`
/ `low`. Categories include:

- `harm-fatal` — harm grade 4 (LFPSE)
- `failure-catastrophic` — failure condition Level A
- `severity-catastrophic` — severity 5
- `magnitude-total-destruction` — magnitude 10
- `frequency-universal` — frequency ≥ 95 %
- `requirement-mandatory` — MoSCoW must-have
- `regulatory` — issue triggers regulatory reporting (LFPSE, ICO, MHRA, HSE)
- `safeguarding` — issue affects vulnerable persons or children
- `data-loss` — issue caused or risks loss of data integrity
- `outage` — issue caused or risks user-visible service outage
- `security` — issue involves a security boundary
- `safety` — issue involves a physical-world safety boundary

## 10-step single-page wizard

| # | Step | Captures |
| --- | --- | --- |
| 1 | Reporter & metadata | reporter id, role, reporting time, environment (dev/staging/prod), system name, customer/project tag |
| 2 | Chief complaint | one-sentence summary, free-text long description |
| 3 | Participants | discoverer, affected users, assignees, stakeholders to inform |
| 4 | Symptoms | external signals, alert IDs, error messages, screenshots |
| 5 | Fractures | broken components, services, pipelines, hardware |
| 6 | History | related tickets, prior occurrences, references |
| 7 | Investigations | hypotheses, repro steps, diagnostic queries |
| 8 | Diagnosis | root cause, contributing causes, scope |
| 9 | Treatments & prognosis | mitigation steps, fix plan, expected resolution, residual risk |
| 10 | Score & sign-off | the seven scores, computed composite, safety flags, override + reason, signature |

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital safety
  systems (LFPSE) when the issue is a clinical safety event.
- **XML** representation for archival or import into legacy ticketing
  systems.
- **Plain-text triage summary** suitable for pasting into chat / email
  and into the WHO/SRE incident-channel.

## Directory structure

```
issue-tracker/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # original design seed
  doc/                                              # documentation
  sql-migrations/                                   # Liquibase Postgres migrations
  xml-representations/                              # XML + DTD per SQL table
  fhir-r5/                                          # FHIR HL7 R5 JSON resources
  front-end-form-with-html/                         # static single-page wizard
  front-end-form-with-svelte/                       # SvelteKit single-page wizard
  front-end-dashboard-with-html/                    # review dashboard (HTML table)
  front-end-dashboard-with-svelte/                  # review dashboard (SVAR Grid)
  back-end-with-loco/            # Rust backend + server-rendered UI
  back-end-with-loco-setup       # scaffold generator script
```

## References

- NHS Learn from Patient Safety Events (LFPSE) — harm grade scale.
  <https://www.england.nhs.uk/patient-safety/learn-from-patient-safety-events-service/>
- Saffir, H.S. & Simpson, R.H. *The Saffir–Simpson Hurricane Wind Scale.*
  US National Hurricane Center.
- Richter, C.F. *An Instrumental Earthquake Magnitude Scale.* Bulletin of
  the Seismological Society of America, 1935.
- US FAA Advisory Circular 25.1309-1A — *System Design and Analysis* —
  failure condition classifications A–E.
- EASA CS-25 §1309 — equivalent EU airworthiness standards.
- Clegg, D. & Barker, R. *Case Method Fast-Track: A RAD Approach.*
  Addison-Wesley, 1994 — origin of MoSCoW prioritisation.
- ITIL 4 — *Service Operation*: incident, problem, and change management
  vocabulary.
- ISO 31000:2018 — *Risk management: Guidelines.*

## Compliance

- ISO/IEC 27035 — *Information security incident management.*
- ISO 31000:2018 — *Risk management: Guidelines.*
- NHS Patient Safety Strategy and LFPSE — for clinical safety issues.
- UK Information Commissioner's Office (ICO) personal-data breach notification.
- UK Health and Safety Executive (HSE) RIDDOR reporting where applicable.
- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — relevant when the
  issue tracker is used as part of a regulated quality-management system.
- ISO/IEC/IEEE 26514:2022 — *Design and development of information for users.*

## Verify

```sh
bin/test-form issue-tracker
```
