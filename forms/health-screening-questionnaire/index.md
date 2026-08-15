# Health Screening Questionnaire

A generic, purpose-flexible baseline health and lifestyle screen used by
employers, gyms and fitness professionals, and primary-care / preventive-health
services to establish a person's medical history, uncover hidden risk factors,
and flag whether they need further medical review before starting an activity
(an exercise programme, a new job role) or as a routine wellness check. The
form wraps two real, validated instruments — **PAR-Q+** for physical-activity
readiness and **AUDIT-C** for alcohol use — inside a wider occupational and
wellness screening questionnaire, and computes a composite risk band with a
referral recommendation and a set of safety flags.

Unlike the monorepo's condition-specific assessments, this form does not
diagnose a single condition — it screens broadly and routes to further review
when indicated.

## Relationship to `patient-intake`

The monorepo already has [`patient-intake`](../patient-intake), a general
patient intake form collecting demographics, insurance, medical history,
medications, allergies, and a review of systems, with a Low/Medium/High risk
stratification. The two are complementary, not duplicates:

| | `patient-intake` | `health-screening-questionnaire` |
| --- | --- | --- |
| Purpose | register a patient and capture administrative + clinical intake | screen a person's baseline health and readiness for activity or role |
| Instrument | none named | PAR-Q+ (physical-activity readiness) + AUDIT-C (alcohol) |
| Output | risk level (administrative triage) | PAR-Q+ clearance, AUDIT-C band, composite risk band, referral recommendation |
| Setting | any clinical registration point | employer occupational health, gym/fitness, primary-care preventive-health |
| Users | any registration/clinical staff | assessors — who may not be clinicians at all |

See [`spec/index.md`](spec/index.md) §2.1 for the full differentiation.

## Scope and intended users

- **Settings:** occupational pre-placement health screening, routine
  public-health / NHS-Health-Check-style wellness checks, perioperative
  referral screening, and physical-activity-readiness screening at gyms,
  personal-training studios, and sports clubs.
- **Users (assessors):** occupational-health nurses, GPs and practice nurses,
  physiotherapists, personal trainers, gym instructors, sports therapists, and
  HR officers running pre-placement screens. The assessor is often **not** a
  clinician — see [`AGENTS.md`](AGENTS.md) for the `assessor` naming decision.
- **Screened persons:** adults (≥ 16 years). PAR-Q+ and AUDIT-C are both adult
  instruments; under-16 respondents raise a `paediatric` flag and are routed to
  a paediatric-specific pathway instead of being scored.

## Scoring system

- **Primary instrument — PAR-Q+** (Physical Activity Readiness Questionnaire
  for Everyone, 2011 revision, PAR-Q+ Collaboration / CSEP): 7 general-health
  yes/no questions.

  | # | Question |
  | --- | --- |
  | 1 | Diagnosed heart condition |
  | 2 | Chest pain at rest |
  | 3 | Chest pain during, or caused by, physical activity in the last month |
  | 4 | Dizziness / loss of balance or consciousness in the last 12 months |
  | 5 | Another diagnosed chronic medical condition |
  | 6 | Currently prescribed medication for a chronic condition |
  | 7 | A bone, joint, or soft-tissue problem that activity could worsen |

  All 7 "no" → **cleared** for general physical activity. Any "yes" →
  **further-assessment-required** — a deliberate scope simplification; see
  [`spec/index.md`](spec/index.md) §2 for why this form raises a single
  follow-up flag rather than reproducing PAR-Q+'s branching
  condition-specific supplementary questionnaires.

- **Secondary instrument — AUDIT-C** (3-item alcohol screen, 0–12), identical
  in structure and scoring to
  [`forms/alcohol-use-disorders-identification-test-consumption/`](../alcohol-use-disorders-identification-test-consumption)
  and the alcohol domain in
  [`forms/perioperative-optimization/`](../perioperative-optimization):
  frequency (0–4), typical quantity (0–4), binge frequency (0–4). At-risk
  threshold ≥ 5 (men) / ≥ 4 (women); higher-risk threshold ≥ 8.

- **Composite risk band** — `low` / `moderate` / `high` / `refer-urgently` by
  max-grade (the worst finding wins):

  | Band | Drivers |
  | --- | --- |
  | Low | PAR-Q+ cleared, no red-flag symptoms, AUDIT-C low — routine pathway |
  | Moderate | PAR-Q+ further-assessment-required, or AUDIT-C increasing-risk, or a single chronic condition without a red-flag symptom |
  | High | any red-flag symptom, or AUDIT-C higher-risk, or family history of a premature cardiac event with a current chronic condition |
  | Refer urgently | unexplained chest pain or fainting/loss-of-consciousness — same-day medical attention, not a routine screening pathway |

## 14-step wizard

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | screening purpose, assessor name/role, site, assessment date, assessment mode |
| 2 | Personal details | name, DOB, sex, NHS-or-employee number, emergency contact name/relationship/phone |
| 3 | Lifestyle — activity & diet | usual activity level, moderate-exercise days/week, fruit & vegetable portions/day, diet notes |
| 4 | Lifestyle — smoking & alcohol | smoking status, cigarettes/day, AUDIT-C 3 items |
| 5 | Medical history | chronic conditions checklist, past surgeries, current medications, known drug allergies |
| 6 | Family history | premature cardiac event < 60y in a first-degree relative, other hereditary conditions |
| 7 | Symptom review | chest pain, dizzy spells/fainting, persistent cough > 3 weeks, unexplained weight loss, joint pain, breathlessness on exertion, palpitations |
| 8 | PAR-Q+ general health screen | the 7 items above |
| 9 | Vital signs / basic measurements | height, weight, BMI (auto), resting blood pressure, resting heart rate — all optional |
| 10 | Occupational/role-specific factors | shown only when screening purpose is occupational pre-placement: job role, physical demands, exposure risks |
| 11 | Mental health & wellbeing check | stress level 0–4, sleep quality 0–4, current concern y/n + note — light-touch only |
| 12 | Vaccination status | up to date y/n/unsure, notable gaps |
| 13 | Consent & data | consent to screening, information-accurate confirmation, interpreter required |
| 14 | Summary & recommendation | computed risk band, PAR-Q+ clearance, AUDIT-C band, referral recommendation, assessor override + reason, notes, electronic signature |

## Safety flags

Computed independently of the risk band and never suppressed by an assessor
override. Priority: high / medium / low.

| Category | Fires when |
| --- | --- |
| `urgent-cardiac-symptom` | unexplained chest pain or fainting/loss-of-consciousness reported |
| `alcohol-higher-risk` | AUDIT-C ≥ 8 |
| `parq-positive-medical-clearance-needed` | any PAR-Q+ item is "yes" |
| `family-history-premature-cardiac-event` | family history of a premature cardiac event |
| `unexplained-weight-loss` | unexplained weight loss reported |
| `occupational-restriction-indicated` | physical demands of the role exceed what current findings suggest is safe |
| `vaccination-gap` | vaccination status not up to date, or gaps noted |
| `paediatric` | age < 16 — PAR-Q+ and AUDIT-C are not validated below 16 |

## Assessor override

The engine produces a **computed** risk band and recommendation. The assessor
may override the final risk band on step 14 with a documented reason. Both the
computed and the final values are stored and appear in the report, the PDF,
and the FHIR Bundle, so the audit trail is preserved. Safety flags are never
suppressed by an override.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with occupational-health or
  hospital EHR systems.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.

## Directory structure

```
health-screening-questionnaire/
  index.md                     # this file
  README.md -> index.md        # symlink for GitHub rendering
  AGENTS.md                    # agent instructions
  CLAUDE.md                    # Claude Code project instructions
  spec/                        # living domain spec
  plan.md                      # implementation roadmap
  tasks.md                     # task tracking
  CHANGELOG.md                 # Keep a Changelog 1.1.0 + SemVer
  doc/                         # clinical reference documentation
  examples/                    # filled-form JSON fixture + FHIR R5 Bundle
  sql/                         # PostgreSQL migrations (source of truth)
  xml/                         # generated XML + DTD per SQL table
  fhir/r5/                     # generated FHIR HL7 R5 JSON per SQL entity
  protobuf/                    # generated Protocol Buffers schemas
  openapi/                     # generated OpenAPI 3.1 specifications
  front-end-with-html/         # single-page wizard + dashboard (Lily, no build)
  front-end-with-svelte/       # SvelteKit wizard + dashboard
  back-end-with-loco/          # Rust axum + Loco JSON API
  back-end-with-loco-setup     # generated scaffold script
```

## Clinical references

- PAR-Q+ Collaboration. Warburton DER, Jamnik VK, Bredin SSD, Gledhill N.
  *The Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) and
  Electronic Physical Activity Readiness Medical Examination (ePARmed-X+).*
  Health & Fitness Journal of Canada 2011;4(2):3–17. <http://eparmedx.com/>
- Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. *The AUDIT alcohol
  consumption questions (AUDIT-C): an effective brief screening test for
  problem drinking.* Archives of Internal Medicine 1998;158(16):1789–95.
- NHS. *NHS Health Check* programme.
  <https://www.nhs.uk/conditions/nhs-health-check/>
- University Hospital Southampton NHS Foundation Trust. *My Medical Record —
  Perioperative Screening Questionnaire.*
  <https://www.uhs.nhs.uk/departments/perioperative-care/my-medical-record-perioperative-screening-questionnaire>

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis and
does not replace the clinical judgement of a qualified professional.
