# Hernia Diagnostic Evaluation

A **hernia diagnostic evaluation** is the clinical assessment used to detect,
classify, and grade the urgency of an abdominal-wall or groin hernia,
performed by a GP, surgical registrar, or general surgeon. Most uncomplicated
hernias are identified during a standard physical examination — visual
inspection, palpation, cough impulse, and a reducibility check — without
needing advanced imaging. This form records that examination, applies the
European Hernia Society (EHS) groin-hernia classification and a red-flag
urgency screen, and produces a hernia classification plus an urgency band
suitable for the clinical record and for a referral letter.

## Relationship to the pre-operative assessment forms

The monorepo already has
[`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician)
and [`pre-operative-assessment-by-patient`](../pre-operative-assessment-by-patient),
which assess a patient's fitness for a **planned** operation once the decision
to operate has already been made. This form is upstream of that decision:

| | `hernia-diagnostic-evaluation` | `pre-operative-assessment-by-clinician` |
| --- | --- | --- |
| Purpose | detect, classify, and grade urgency | assess fitness for a planned operation |
| Question answered | what type of hernia is this, and does it need referral today? | is this patient safe to anaesthetise and operate on? |
| Instrument | EHS classification + red-flag urgency screen | American Society of Anesthesiologists (ASA) grade and organ-system review |
| Output | classification + urgency band | fitness-for-surgery grade |
| Typical next step | referral to a surgical service, at the urgency indicated | theatre listing |

A hernia diagnostic evaluation that recommends elective repair is the usual
referral trigger into the pre-operative assessment forms.

## Scope and intended users

- **Setting:** GP practice, surgical assessment unit, ambulatory emergency
  care, or emergency department.
- **Users:** general practitioners, surgical registrars, general surgeons, and
  nurse practitioners working within their scope of practice.
- **Patients:** any age. Patients under 16 years raise a `paediatric` safety
  flag, because groin-hernia examination technique and referral pathways
  differ in children.

## Classification and urgency system

- **Primary output — hernia classification.** Hernia type (inguinal / femoral
  / umbilical / epigastric / incisional / paraumbilical / spigelian / other);
  for inguinal hernias, the European Hernia Society (EHS) subtype (direct /
  indirect / pantaloon / uncertain); laterality (left / right / bilateral);
  EHS size grade (1 for less than 2 cm, 2 for 2–4 cm, 3 for more than 4 cm);
  reducibility status (reducible / irreducible / incarcerated).

- **Primary output — urgency band.** No single validated numeric instrument
  dominates this domain, so the form computes an urgency band directly from
  the reducibility assessment and a red-flag screen, rather than summing a
  score.

  | Urgency band | Condition |
  | --- | --- |
  | `routine` | Reducible and asymptomatic, or mildly symptomatic, with a normal examination |
  | `soon` | Reducible but symptomatic (pain score above 4/10), or European Hernia Society size grade 3 |
  | `urgent` | Irreducible or incarcerated, with no red-flag symptoms |
  | `emergency` | Any red-flag symptom is positive, or an incarcerated hernia with any red flag |

  A single positive red flag in step 8 forces `emergency` regardless of every
  other finding — this mirrors how `perioperative-optimization`'s
  `insufficient-time` domain forces `defer-surgery`: a safety-critical finding
  cannot be diluted by an otherwise reassuring examination.

## 14-step clinician wizard

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician identification | name, role, registration body and number, site, assessment date and time |
| 2 | Patient identification | name, date of birth, sex, NHS number, contact details |
| 3 | Presenting complaint & history | duration of bulge, pain score 0–10, onset (sudden / gradual), aggravating factors (straining, lifting, coughing), prior hernia history, prior hernia repair and whether mesh was used |
| 4 | Risk factors | chronic cough, constipation or straining, heavy-lifting occupation, obesity, smoking, family history, prior abdominal surgery, pregnancy, connective-tissue disorder, ascites |
| 5 | Visual inspection | location (groin / umbilical / epigastric / incisional / femoral / other), bulge visible at rest, bulge enlarges on standing or straining, skin changes (erythema / discolouration) |
| 6 | Palpation & cough impulse | palpable mass, cough impulse positive, tenderness, size in cm |
| 7 | Reducibility assessment | reducible / irreducible / incarcerated, and whether it reduces spontaneously, with manual pressure, or not at all |
| 8 | Red-flag / emergency symptom screen | severe pain, vomiting, fever, absolute constipation, erythema or discolouration, a previously reducible hernia now irreducible, tachycardia — **drives the computed urgency band** |
| 9 | Clinical classification | hernia type; for inguinal, the EHS subtype (direct / indirect / pantaloon / uncertain); laterality; EHS size grade |
| 10 | Imaging | ultrasound, CT, and MRI performed and findings; imaging indication |
| 11 | Differential diagnosis considered | lipoma, lymphadenopathy, hydrocele, undescended testis, femoral aneurysm, abscess, other |
| 12 | Functional impact | pain interfering with work or activity, functional impact scale 0–10, activity limitation |
| 13 | Management plan | watchful waiting / elective repair referral / urgent referral / emergency referral / conservative; referral made; target timeframe |
| 14 | Summary & sign-off | computed classification, computed urgency band, clinician override and reason, recommendation, notes, electronic signature |

## Safety flags

Computed independently of the urgency band. Priority: high / medium / low.
Categories:

| Category | Priority | Fires when |
| --- | --- | --- |
| `strangulation-suspected` | high | Irreducible and any red flag is positive |
| `incarceration-risk` | high | Irreducible, no red flags yet |
| `emergency-surgical-referral` | high | Any red flag is positive |
| `atypical-presentation` | medium | Imaging is inconclusive after an inconclusive or atypical exam |
| `occult-hernia-suspected` | medium | High clinical suspicion, negative exam, imaging not yet done |
| `recurrent-hernia` | medium | A prior repair is recorded at the same site |
| `paediatric` | high | Patient younger than 16 years |
| `pregnancy` | medium | Patient is pregnant |
| `capacity-concern` | medium | A documented capacity concern |
| `other` | variable | Free-text clinician-raised concern |

## Clinician override

The engine produces a **computed** classification and urgency band. The
clinician may override the **urgency band** on step 14 with a mandatory
reason. Both the computed and the final values are stored, and both appear in
the report, the PDF, and the FHIR Bundle, so the audit trail is preserved.
Safety flags are computed independently and are never suppressed by the
override.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.
- **Referral summary** suitable to include in the clinical record and to send
  with a surgical referral.

## Directory structure

```
hernia-diagnostic-evaluation/
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

- Miserez M, Peeters E, Aufenacker T, et al. *Update with level 1 evidence on
  the European Hernia Society (EHS) groin hernia management guideline.*
  Hernia 2007;18(2):151–63.
- Simons MP, Aufenacker T, Bay-Nielsen M, et al. *European Hernia Society
  guidelines on the treatment of inguinal hernia in adult patients.* Hernia
  2009;13(4):343–403.
- NICE. *Groin hernia: assessment and management* (clinical knowledge
  summary). <https://cks.nice.org.uk/topics/groin-hernia/>
- BMJ Best Practice. *Assessment of groin masses and hernias.*
  <https://bestpractice.bmj.com/>
- NHS. *Hernia — symptoms, diagnosis, and treatment.*
  <https://www.nhs.uk/conditions/hernia/>
- Bupa UK. *Abdominal hernia.*
  <https://www.bupa.co.uk/health-information/digestive-gut-health/abdominal-hernia>
- American College of Surgeons / ASC Abstracts. *Guidelines for diagnosis of
  occult inguinal hernias.* <https://www.asc-abstracts.org/>
- HerniaSurge Group. *International guidelines for groin hernia management.*
  Hernia 2018;22(1):1–165.

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis and
does not replace the clinical judgement of the examining clinician. Any
positive red flag requires same-day clinical escalation regardless of what the
software displays.
