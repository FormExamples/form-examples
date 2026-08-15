# Cataract Diagnostic Evaluation

A comprehensive **cataract diagnostic evaluation**: the ophthalmic assessment
used to confirm the presence of a cataract, grade its severity against the
validated **LOCS III** (Lens Opacities Classification System III) instrument,
assess its functional impact on the patient's daily life, rule out competing
posterior-segment pathology (glaucoma, age-related macular degeneration,
diabetic retinopathy), and determine surgical candidacy. Performed by an
optometrist or ophthalmologist. The output is a signed evaluation report with
a computed surgical-candidacy recommendation suitable for the clinical
record and for referral into a cataract-surgery pathway.

The full evaluation typically takes **1 to 2 hours**, because it requires
pupil dilation and precise structural measurements of the eye.

## Relationship to `eye-vision-test-result`

The monorepo already has [`eye-vision-test-result`](../eye-vision-test-result),
a general-purpose eye examination and vision-test-result record. This form is
narrower and deeper: it is specifically **cataract-focused**.

| | `eye-vision-test-result` | `cataract-diagnostic-evaluation` |
| --- | --- | --- |
| Purpose | general vision test / eye exam result | confirm, grade, and plan for cataract |
| Instrument | visual acuity, refraction, IOP, fundus | LOCS III lens grading + glare + biometry |
| Output | vision-test result record | LOCS III severity band + surgical candidacy |
| Surgical planning | not included | biometry, keratometry, IOL power |

## Scope and intended users

- **Setting:** NHS or private ophthalmology outpatient clinic, optometry
  practice with an enhanced/cataract-referral service, pre-operative
  assessment clinic.
- **Users:** optometrists (GOC-registered), ophthalmologists (GMC-registered),
  and orthoptists working under supervision.
- **Patients:** adults (≥ 16 years). Paediatric patients raise a `paediatric`
  flag directing the user to a paediatric ophthalmology pathway, because LOCS
  III and this form's adult referral pathway are not validated for
  paediatric cataract.

## Scoring system

- **Primary instrument: LOCS III** (Chylack et al., Arch Ophthalmol 1993).
  Four subscales, each graded per eye on a continuous 0.1-step decimal scale
  against the LOCS III standard photographs:

  | Subscale | Range |
  | --- | --- |
  | Nuclear Opalescence (NO) | 0.1–6.9 |
  | Nuclear Colour (NC) | 0.1–6.9 |
  | Cortical cataract (C) | 0.1–5.9 |
  | Posterior Subcapsular cataract (P) | 0.1–5.9 |

  LOCS III does not itself define a severity band. **This form's own
  operational simplification** collapses the four subscores per eye into a
  three-level severity band used to drive the surgical-candidacy
  recommendation:

  - `mild` — all four subscores below 3.0
  - `moderate` — any subscore 3.0–4.9
  - `severe` — any subscore 5.0 or above

- **Computed surgical candidacy**, from the worse eye's severity band,
  best-corrected visual acuity, and glare testing:

  | Recommendation | Drivers |
  | --- | --- |
  | `not-indicated` | mild severity both eyes, and best-corrected acuity ≥ 6/12 (LogMAR ≤ 0.30) both eyes |
  | `consider` | moderate severity in the affected eye, or acuity worse than 6/12 in the affected eye |
  | `indicated` | severe severity in the affected eye, or acuity worse than 6/18 (LogMAR ≥ 0.48), or severe glare-testing functional impact |
  | `urgent-referral` | any safety/referral flag below has fired |

- **Functional / quality-of-life score:** a simple 0–4 self-report composite
  covering difficulty with reading, driving, and daily activities.

## 15-step wizard

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician identification | name, role (optometrist/ophthalmologist), registration body and number (GOC/GMC), site, assessment date and time |
| 2 | Patient identification | name, DOB, sex, NHS number, contact |
| 3 | Presenting complaint & visual symptoms | blurred vision, glare/halos, night-driving difficulty, faded colour perception, frequent prescription changes, symptom duration, laterality |
| 4 | Ocular & medical history | diabetes, prior eye surgery, ocular trauma, uveitis, steroid use, family history of cataract, smoking, UV exposure, high myopia |
| 5 | Visual acuity | unaided and best-corrected acuity per eye (LogMAR and Snellen-equivalent), pinhole acuity |
| 6 | Refraction | current spectacle Rx sphere/cylinder/axis per eye, refraction stability |
| 7 | Slit-lamp examination | LOCS III grading (NO, NC, C, P) per eye, cataract type, anterior chamber depth, corneal clarity, pupil reaction |
| 8 | Glare testing | glare acuity result per eye, functional impact of glare |
| 9 | Tonometry | intraocular pressure per eye, method |
| 10 | Dilated fundus examination | performed, cup:disc ratio per eye, macula findings, retinal findings, view obscured by cataract |
| 11 | Differential / competing-pathology screen | glaucoma, AMD, diabetic retinopathy suspected |
| 12 | Biometry | performed, axial length per eye, keratometry K1/K2, OCT performed and findings, calculated IOL power |
| 13 | Functional & quality-of-life impact | 0–4 difficulty with reading, driving, daily activities |
| 14 | Management plan | recommendation, eye(s) for surgery, risks/benefits counselled, consent discussed |
| 15 | Summary & sign-off | computed LOCS III severity band per eye, computed surgical candidacy, clinician override and reason, notes, electronic signature |

## Safety / referral flags

Computed independently of the surgical-candidacy recommendation and never
suppressed by a clinician override.

| Flag | Priority | Fires when |
| --- | --- | --- |
| `competing-pathology-suspected` | high | glaucoma, AMD, or diabetic retinopathy suspected |
| `raised-iop` | high | intraocular pressure > 21 mmHg either eye |
| `view-obscured-fundus-not-assessed` | medium | cataract too dense to assess fundus and dilated exam not performed |
| `rapid-progression` | medium | symptom duration < 3 months with a severe LOCS III grade |
| `biometry-incomplete-for-surgical-planning` | low | surgical referral recommended but biometry not performed |
| `paediatric` | standard | age < 16 years — LOCS III is not validated for paediatric cataract |

## Clinician override

The engine produces a **computed** LOCS III severity band per eye and a
computed surgical-candidacy recommendation. The clinician may override the
final surgical-candidacy recommendation on step 15 with a documented reason.
Both the computed and the final values are stored, and both appear in the
report, the PDF, and the FHIR Bundle, so the audit trail is preserved. Safety
flags are never suppressed by the override.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.
- **Evaluation report** suitable to include in the clinical record and to
  share with the referring optometrist, the patient, and the cataract-surgery
  pathway team.

## Directory structure

```
cataract-diagnostic-evaluation/
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

- Chylack LT Jr, Wolfe JK, Singer DM, et al. *The Lens Opacities
  Classification System III.* Arch Ophthalmol. 1993;111(6):831–6.
- NICE. *Cataracts in adults: management* (NG77).
  <https://www.nice.org.uk/guidance/ng77>
- Royal College of Ophthalmologists. *Cataract Surgery Guidelines.*
  <https://www.rcophth.ac.uk/>
- Snellen H. *Test-types for the determination of the acuity of vision* (1862).
- Medical News Today. *How is cataract diagnosed?*
  <https://www.medicalnewstoday.com/articles/cataract-diagnosis>

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis and
does not replace the clinical judgement of an optometrist or ophthalmologist.
