# Hip Replacement Surgery Evaluation

A **hip-replacement surgery evaluation** is the orthopaedic assessment used to
determine whether a patient is a suitable candidate for total hip
arthroplasty. It is performed by an orthopaedic surgeon or extended-scope
physiotherapist in a joint-replacement clinic. The form quantifies hip pain
and functional decline with the validated **Oxford Hip Score (OHS)**, records
the physical examination and imaging findings, audits which conservative
treatments have already been tried, screens general surgical fitness, and
produces a **surgical-candidacy recommendation** together with a set of
safety-critical flags.

> **What this form answers.** *Does this patient's hip disease and functional
> decline justify replacement surgery, and have conservative options been
> exhausted?* It is deliberately **not** another ASA-grading pre-operative
> assessment — see [`AGENTS.md`](./AGENTS.md) §"What this form is not".

## Scope and intended users

- **Setting:** NHS orthopaedic outpatient clinic, joint-replacement clinic, or
  a virtual/telephone triage clinic feeding into one.
- **Users:** orthopaedic surgeons (consultant or registrar), extended-scope
  physiotherapists, orthopaedic nurse practitioners.
- **Patients:** adults (≥ 16 years) with hip osteoarthritis or another
  degenerative hip condition being considered for total hip arthroplasty.
  Paediatric patients raise a `paediatric` flag because the Oxford Hip Score
  is not validated below 16 years of age.

## Scoring system

- **Primary instrument:** **Oxford Hip Score (OHS)** — the validated 12-item
  patient-reported outcome measure (Dawson et al., *J Bone Joint Surg Br*
  1996). Each item is scored 0 (worst) to 4 (best); the total is 0–48, where
  48 is the best outcome.

  | Band | OHS total |
  | --- | --- |
  | Severe | 0–19 |
  | Moderate | 20–29 |
  | Mild-to-moderate | 30–39 |
  | Satisfactory | 40–48 |

- **Radiographic grading:** **Kellgren and Lawrence (KL) grade**, 0 (none) to
  4 (severe) (Kellgren & Lawrence, *Ann Rheum Dis* 1957).

- **Surgical-candidacy recommendation**, computed from the OHS total, the KL
  grade, and whether conservative measures are exhausted:

  | Candidacy | Condition |
  | --- | --- |
  | Strong candidate | OHS ≤ 19, KL ≥ 3, conservative measures exhausted |
  | Candidate | OHS ≤ 29, KL ≥ 2, conservative measures exhausted |
  | Continue conservative management | conservative measures not exhausted |
  | Not currently indicated | OHS ≥ 40, or KL ≤ 1 |
  | MDT review | mixed or borderline picture |

## 15-step clinician wizard

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician identification | name, role, GMC/registration number, site, assessment date and time |
| 2 | Patient identification | name, DOB, sex, NHS number, contact, height, weight, BMI |
| 3 | Presenting history | affected side, symptom duration, pain 0–10 at rest and on activity, night pain, prior hip surgery, prior injury/dysplasia history |
| 4 | Oxford Hip Score | 12 items, each scored 0–4 |
| 5 | Functional limitations | walking distance before pain, shoes/socks difficulty, walking-aid use |
| 6 | Physical examination — gait and biomechanical | limp, antalgic gait, Trendelenburg sign, measured leg-length discrepancy |
| 7 | Physical examination — range of motion | flexion, internal/external rotation, abduction/adduction, fixed flexion deformity |
| 8 | Physical examination — stability and muscle strength | hip abductor strength (MRC 0–5), joint stability, tenderness site |
| 9 | Diagnostic imaging | weight-bearing X-ray, Kellgren-Lawrence grade, joint-space narrowing, sclerosis/cysts, MRI, CT |
| 10 | Conservative treatment audit | physiotherapy, weight-management advice, steroid injections, analgesic trial, walking-aid trial, exhausted y/n |
| 11 | General health and surgical fitness screen | diabetes control, cardiac disease, bleeding disorder/anticoagulants, smoking status, general-fitness note |
| 12 | Pre-operative baseline bloods and tests | full blood count, renal function, clotting/INR, ECG, MRSA screen, urinalysis |
| 13 | Shared decision-making | risks/benefits discussed, realistic expectations discussed, decision aid given, interpreter required |
| 14 | Management plan and recommendation | recommendation, target list date, responsible surgeon |
| 15 | Summary and sign-off | computed OHS total + category, computed candidacy, clinician override + reason, notes, electronic signature |

## Safety flags

Computed independently of the candidacy recommendation. Priority: high /
medium / low. Categories:

| Category | Fires when |
| --- | --- |
| `conservative-treatment-not-exhausted` | conservative measures not exhausted |
| `high-bmi-surgical-risk` | patient BMI ≥ 40 |
| `pre-op-bloods-incomplete` | any pre-operative baseline test not done |
| `leg-length-discrepancy-significant` | measured leg-length discrepancy > 2cm |
| `trendelenburg-positive` | Trendelenburg sign positive |
| `bilateral-symptomatic` | affected side is bilateral |
| `paediatric` | age < 16 years — OHS is not validated below 16 |
| `other` | free-text clinician-raised concern |

## Clinician override

The engine produces a **computed** OHS total, category, and candidacy
recommendation. The clinician may override the candidacy recommendation on
step 15 with a documented reason. Both the computed and the final values are
stored, and both appear in the report, the PDF, and the FHIR Bundle, so the
audit trail is preserved. Safety flags are never suppressed by the override.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.

## Directory structure

```
hip-replacement-surgery-evaluation/
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

- Dawson J, Fitzpatrick R, Carr A, Murray D. *Questionnaire on the perceptions
  of patients about total hip replacement.* J Bone Joint Surg Br.
  1996;78(2):185–190.
- Kellgren JH, Lawrence JS. *Radiological assessment of osteo-arthrosis.* Ann
  Rheum Dis. 1957;16(4):494–502.
- NHS Getting It Right First Time (GIRFT). *Orthopaedics.*
  <https://gettingitrightfirsttime.co.uk/>
- NHS Wales. *Hip replacement.*
  <https://111.wales.nhs.uk/encyclopaedia/h/article/hipreplacement>
- Oxford University Innovation. *Oxford Hip Score (OHS).*
  <https://innovation.ox.ac.uk/outcome-measures/oxford-hip-score-ohs/>
- National Joint Registry (NJR) annual reports.

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis and does
not replace the clinical judgement of the orthopaedic surgeon or
extended-scope physiotherapist.
