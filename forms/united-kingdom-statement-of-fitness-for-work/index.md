# United Kingdom Statement of Fitness for Work

A digital implementation of the UK Statement of Fitness for Work — commonly
known as the **fit note** or **Med 3** — issued by a healthcare professional
(doctor, nurse, occupational therapist, pharmacist, or physiotherapist) to
record the impact of a patient's health condition on their fitness for work.

The fit note supports the patient to stay in or return to work, and acts as
evidence for Statutory Sick Pay (SSP) and health-related benefits. It is the
statutory replacement of the older "sick note" introduced by the UK Department
for Work and Pensions (DWP) in 2010 and significantly revised in 2022 to
broaden the set of authorized issuers and to enable digital delivery.

This implementation captures the fit note via a single-page, ten-step wizard,
applies a rule-based grading engine that classifies the fitness category,
adaptation intensity, and period compliance, computes safety flags drawn from
DWP policy, and generates a clinical report suitable for the patient,
employer, and DWP.

## Scope and intended users

- **Setting:** NHS primary care (GP practice), NHS secondary care
  (hospital discharge), occupational-health clinic, pharmacy consultation
  room, physiotherapy clinic, community nursing.
- **Issuers:** registered doctors (GMC), nurses (NMC), occupational
  therapists, physiotherapists, pharmacists (HCPC / GPhC). The 2022 policy
  change broadened issuance beyond doctors.
- **Recipients:** patients (the primary holder), employers (with the patient's
  consent), DWP (where benefit claims are made), HMRC (where SSP disputes
  arise).

## Scoring system

The fit note has no validated clinical score; instead, the implementation
applies a rule-based **policy compliance and triage grader** that captures
the structural choices made on the form and flags policy non-compliance.

### Fitness for work category

| Category | Driver |
| --- | --- |
| `not_fit` | clinician selected "you are not fit for work" |
| `may_be_fit` | clinician selected "you may be fit for work" with adaptations advice |

Per DWP policy 3.2, the fit note cannot certify "fit for work" — that branch
is intentionally absent.

### Adaptation intensity (only when `may_be_fit`)

| Intensity | Driver |
| --- | --- |
| `none` | "may be fit" selected but no tick boxes — invalid combination |
| `light` | 1 tick box selected (e.g. phased return only) |
| `moderate` | 2 tick boxes selected |
| `substantial` | 3 tick boxes selected |
| `comprehensive` | all 4 tick boxes selected |

### Period compliance

| Compliance | Driver |
| --- | --- |
| `self_cert_range` | period < 7 calendar days — fit note not required |
| `compliant` | period within DWP rules |
| `exceeds_initial_max` | > 3 months in the first 6 months of the condition (policy 3.3) |
| `long_term` | period > 4 weeks — Access to Work referral suggested |
| `very_long_term` | period > 6 months — chronic condition pathway suggested |

### Overall recommendation

| Recommendation | When |
| --- | --- |
| `standard` | routine fit note, no policy concerns |
| `refer_occupational_health` | substantial / comprehensive adaptations or repeated absence |
| `refer_access_to_work` | disability or long-term limitation |
| `refer_employment_advisor` | return to work after extended absence |
| `review_for_validity` | one or more invalidity flags fired |

## Safety flags

Computed independently of the fitness category. Priority: high / medium / low.

| Flag | Priority | Rule |
| --- | --- | --- |
| `invalid_no_name` | high | DWP policy 3.7 — fit note without name is invalid |
| `invalid_no_profession` | high | policy 3.7 — fit note without profession is invalid |
| `invalid_no_practice_address` | high | policy 3.7 — practice address required |
| `may_be_fit_no_adaptations` | medium | "may be fit" selected but no tick boxes |
| `may_be_fit_no_comments` | medium | policy 5.6 — comments box should give practical advice |
| `non_medical_reason_detected` | medium | policy 3.6 — fit notes cannot be issued for non-medical problems |
| `automatic_disability` | medium | HIV / cancer / multiple sclerosis — Equality Act 2010 (policy 5.8) |
| `duration_exceeds_3_months_in_first_6_months` | high | policy 3.3 — initial fit note maximum |
| `self_cert_range` | low | < 7 days — self-certification is sufficient |
| `long_absence_four_weeks` | low | > 4 weeks — Access to Work eligibility |
| `long_absence_twelve_weeks` | medium | > 12 weeks — SSP review window |
| `private_practice` | low | non-NHS issuer; acceptance is at employer's discretion |
| `secondary_care_discharge` | medium | issued on hospital discharge (policy 3.5) |
| `new_authority_hcp` | low | issuer is a nurse / OT / pharmacist / physiotherapist under 2022 policy |
| `mental_health_condition` | medium | mental-health diagnosis — signpost mental-health resources |
| `driving_restriction_recommended` | medium | comments mention "should not drive" |
| `safeguarding_concern` | high | clinician flagged a safeguarding concern |
| `ongoing_review_required` | low | "will assess again" checkbox is set |

## Ten-step single-page wizard

Each step is rendered on the same continuous page (no multi-page form).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Issuer identification | name, profession, registration body + number, medical practice name + address, postcode |
| 2 | Patient identification | name, date of birth, NHS number, email, phone, postal address |
| 3 | Assessment | assessment date, method (in-person / video / telephone / written report from another HCP) |
| 4 | Diagnosis | condition text, SNOMED CT code (optional), mental-health flag, automatic-disability indicator |
| 5 | Fitness for work | radio: `not_fit` / `may_be_fit` |
| 6 | Adaptations | tick boxes: phased return, altered hours, amended duties, workplace adaptations (visible only when `may_be_fit`) |
| 7 | Comments | free-text advice describing functional impact and practical recommendations |
| 8 | Period | period type: `duration` or `from_to`; duration value + unit; from-date and to-date |
| 9 | Follow-up | will-assess-again checkbox, planned-review-date |
| 10 | Sign-off | computed grade, fired rules, safety flags, clinician signature, issue date, issued-via channel |

## Output

- **HTML preview** of the rendered fit note.
- **Downloadable PDF** via `pdfmake` mirroring the official DWP layout.
- **FHIR R5 Bundle** with `Patient`, `Practitioner`, `Organization`, and a
  `DocumentReference` plus a structured `Observation` for fitness category.
- **XML + DTD** for archival and import into legacy occupational-health
  systems.
- **Protocol Buffers** schema for high-volume RPC interop.
- **CSV / TSV** rows for batch export to occupational health analytics.

## Directory structure

```
united-kingdom-statement-of-fitness-for-work/
  index.md                                        # this file
  AGENTS.md                                       # agent instructions
  plan.md                                         # implementation roadmap
  tasks.md                                        # task tracking
  seed.md                                         # source material from gov.uk
  doc/                                            # clinical and policy references
  sql/                                 # Liquibase Postgres migrations
  xml/                            # XML + DTD per SQL table
  fhir/r5/                                        # FHIR HL7 R5 JSON resources
  protobuf/                                       # Protocol Buffers schemas
  typespec/                                       # Microsoft TypeSpec schemas
  front-end-with-html/                       # static HTML wizard
  front-end-with-svelte/                     # SvelteKit wizard
  front-end-with-html/                  # HTML review table
  front-end-with-svelte/                # SVAR DataGrid review dashboard
  back-end-with-loco/          # Rust backend (axum + Loco JSON API)
  back-end-with-loco-setup     # cargo loco scaffold generator (shell script)
```

## Policy and clinical references

- UK Government / DWP. *Fit note: guidance for patients and employees*
  (August 2023). <https://www.gov.uk/government/publications/fit-note-a-guide-for-patients-and-employees>
- UK Government / DWP. *Fit note: guidance for healthcare professionals*
  (2022).
- The Social Security (Medical Evidence) Regulations 1976 and the
  Social Security (Medical Evidence) (Amendment) Regulations 2022.
- Equality Act 2010 — automatic disability provisions for HIV, cancer, MS.
- NHS Digital. *Fit Note Snomed CT subset*.
- DWP. *Getting the most out of the fit note: GP guidance* (Royal College
  of General Practitioners).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR / IVDR Software Classification) — Class I as a
  data-capture instrument, not a clinical decision-support system.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA — Software and AI as a Medical Device guidance.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form united-kingdom-statement-of-fitness-for-work
```
