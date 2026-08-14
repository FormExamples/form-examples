# Knee Replacement Surgery Evaluation

An orthopaedic **knee-replacement surgery evaluation**: the assessment used by
an orthopaedic surgeon or extended-scope physiotherapist in a joint-replacement
clinic to decide whether a patient is a suitable candidate for total or
partial knee arthroplasty. The form records the presenting history, scores the
validated **Oxford Knee Score (OKS)**, captures the physical examination and
diagnostic imaging, audits the conservative treatment already tried, and
computes an OKS total and category, a surgical-candidacy recommendation, and a
set of safety flags. The output is a signed evaluation report suitable for the
clinical record and the joint-replacement multidisciplinary team (MDT).

## What this form answers

Not "how risky is this patient under anaesthesia?" — the monorepo already has
three ASA-grading pre-operative forms for that
([`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician),
[`pre-operative-assessment-by-patient`](../pre-operative-assessment-by-patient),
[`pre-anaesthesia-assessment`](../pre-anaesthesia-assessment)). This form
answers a different question: **does this patient's knee disease and
functional decline justify replacement surgery, and have conservative options
been exhausted?** See [`spec/index.md`](spec/index.md) §2 "What this form is
not" for the full contrast, and [`AGENTS.md`](AGENTS.md) for the same note
aimed at agents working on this codebase.

## Scope and intended users

- **Setting:** NHS orthopaedic outpatient clinic, joint-replacement
  assessment clinic, private orthopaedic practice, virtual fracture/joint
  clinic.
- **Users:** orthopaedic surgeons (consultant and trainee grades), extended-
  scope physiotherapists (ESPs) working in a joint-replacement triage role.
- **Patients:** adults (≥ 16 years). Paediatric patients raise a `paediatric`
  flag, because the Oxford Knee Score is not validated below 16 years of age.

## Scoring system

- **Primary instrument: Oxford Knee Score (OKS)** (Dawson et al., *J Bone
  Joint Surg Br* 1998) — the validated 12-item patient-reported outcome
  measure for knee replacement. Each item scores 0 (worst) to 4 (best); the
  total ranges 0–48, where 48 is the best outcome.

  | # | Item |
  | --- | --- |
  | 1 | Usual knee pain severity |
  | 2 | Washing and drying difficulty |
  | 3 | Getting in/out of a car or public transport |
  | 4 | Walking distance before severe pain |
  | 5 | Pain sitting or lying |
  | 6 | Limping when walking |
  | 7 | Kneeling difficulty |
  | 8 | Night pain frequency |
  | 9 | Pain interfering with usual work |
  | 10 | Feeling the knee might "give way" |
  | 11 | Ability to do household shopping alone |
  | 12 | Ability to walk down a flight of stairs |

  **OKS category** (this form's operational banding — see
  [`spec/index.md`](spec/index.md) §3 for provenance):

  | Band | OKS total |
  | --- | --- |
  | Severe | 0–19 |
  | Moderate | 20–29 |
  | Mild to moderate | 30–39 |
  | Satisfactory | 40–48 |

- **Secondary instrument: Kellgren–Lawrence radiographic grade** (Kellgren &
  Lawrence, *Ann Rheum Dis* 1957), 0–4, scored per compartment (medial,
  lateral, patellofemoral) from the weight-bearing X-ray.

- **Computed surgical candidacy** — evaluated in order, first match wins:

  | Candidacy | Criteria |
  | --- | --- |
  | Strong candidate | OKS ≤ 19 **and** Kellgren–Lawrence ≥ 3 in any compartment **and** conservative measures exhausted |
  | Candidate | OKS ≤ 29 **and** conservative measures exhausted **and** Kellgren–Lawrence ≥ 2 in any compartment |
  | Continue conservative management | Conservative measures **not** exhausted, regardless of OKS or Kellgren–Lawrence |
  | Not indicated | OKS ≥ 40, **or** Kellgren–Lawrence ≤ 1 in every compartment |
  | MDT review | Fallback for a mixed or borderline picture |

## 15-step clinician wizard

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician identification | name, role, registration body and number (GMC number), site, assessment date and time |
| 2 | Patient identification | name, DOB, sex, NHS number, contact, BMI (height/weight) |
| 3 | Presenting history | knee side (left/right/bilateral), symptom duration, pain 0–10 at rest and on activity, night pain, prior knee surgery (arthroscopy/ligament repair/previous partial replacement), prior injury |
| 4 | Oxford Knee Score | 12 items, each scored 0–4 |
| 5 | Functional limitations | walking distance before pain, stair-climbing ability, standing from a chair unaided, walking aid (none/stick/frame/wheelchair) |
| 6 | Physical examination — range of motion | flexion degrees, extension deficit degrees, fixed flexion deformity present and degrees |
| 7 | Physical examination — stability & alignment | coronal deformity type and severity (varus/valgus, none–severe), ligament laxity (ACL/PCL/MCL/LCL, stable/lax), patellar tracking |
| 8 | Physical examination — muscle strength & effusion | quadriceps strength (MRC 0–5), effusion present, crepitus present |
| 9 | Diagnostic imaging | weight-bearing X-ray performed, Kellgren–Lawrence grade per compartment, MRI performed + findings, CT performed + indication |
| 10 | Conservative treatment audit | physiotherapy tried + duration, weight-management advice given, injection given (steroid/hyaluronic acid) + count + response, NSAID/analgesic trial + response, walking-aid trial, conservative measures exhausted |
| 11 | General health & surgical fitness screen | diabetes control, cardiac disease, bleeding disorder/anticoagulant, smoking status, general-fitness free-text note |
| 12 | Pre-operative baseline bloods/tests | FBC, renal function, clotting/INR, ECG, MRSA screen, urinalysis — each a done/not-done checklist item |
| 13 | Shared decision-making | risks/benefits discussed, realistic expectations discussed, patient decision aid given, interpreter required |
| 14 | Management plan & recommendation | recommendation (total/partial knee replacement, continue conservative management, MDT review, not currently a candidate), target list date, responsible surgeon |
| 15 | Summary & sign-off | computed OKS total and category, computed surgical candidacy, clinician override + reason, notes, electronic signature |

## Safety flags

Computed independently of the OKS score and the clinician's candidacy
override; never suppressed. Priority: high / medium / low.

| Category | Priority | Fires when |
| --- | --- | --- |
| `conservative-treatment-not-exhausted` | medium | A surgical recommendation is made without conservative measures having been exhausted |
| `high-bmi-surgical-risk` | medium | BMI ≥ 40 |
| `pre-op-bloods-incomplete` | medium | A surgical recommendation is made but a step-12 checklist item is not done |
| `fixed-flexion-deformity` | medium | Fixed flexion deformity > 15°, affecting surgical planning |
| `bilateral-symptomatic` | low | Both knees significantly symptomatic — staging decision needed |
| `paediatric` | high | Age < 16 years — the Oxford Knee Score is not validated below 16 |

## Clinician override

The engine produces a **computed** OKS category and surgical candidacy. The
clinician may override the candidacy recommendation on step 15 with a
documented reason. Both the computed and the final values are stored, and both
appear in the report, the PDF, and the FHIR Bundle, so the audit trail is
preserved.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.
- **Evaluation report** suitable for the clinical record and the
  joint-replacement MDT.

## Directory structure

```
knee-replacement-surgery-evaluation/
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

- Dawson J, Fitzpatrick R, Murray D, Carr A. *Questionnaire on the perceptions
  of patients about total knee replacement.* Journal of Bone and Joint Surgery
  (Br) 1998;80-B(1):63–9.
- Kellgren JH, Lawrence JS. *Radiological assessment of osteo-arthrosis.*
  Annals of the Rheumatic Diseases 1957;16(4):494–502.
- NHS. *Knee replacement.*
  <https://www.nhs.uk/tests-and-treatments/knee-replacement/>
- NHS inform (Scotland). *Knee replacement.*
  <https://www.nhsinform.scot/tests-and-treatments/surgical-procedures/knee-replacement/>
- NICE. *Joint replacement (primary): hip, knee and shoulder* (NG157).
  <https://www.nice.org.uk/guidance/ng157>
- Nuffield Health. *Knee replacement.*
  <https://www.nuffieldhealth.com/treatments/knee-replacement>
- Orthoinfo (AAOS). *Preparing for joint replacement surgery.*
  <https://www.orthoinfo.org/treatment/preparing-for-joint-replacement-surgery/>

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis and does
not replace the clinical judgement of the orthopaedic surgeon or extended-scope
physiotherapist.
