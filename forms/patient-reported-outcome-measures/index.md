# Patient-Reported Outcome Measures

A battery of **four independent, validated patient-reported outcome
instruments**, commonly administered together in spine-surgery outcomes
research: the **SF-36v2 Health Survey**, the **Neck Disability Index
(NDI)**, the **modified Japanese Orthopedic Association score
(mJOA)**, and **EuroQol 5-Dimensions (EQ-5D-3L)**.

The form is a single-page, 9-step wizard. Each instrument is scored
independently — there is no cross-instrument composite. See
[`spec/index.md`](./spec/index.md) for every item, response scale, and
the exact scoring algorithm for each instrument.

## Scope and intended users

- **Setting:** clinical outcomes research, most commonly spine surgery
  (the four instruments here are a classic cervical-spine outcomes
  battery — NDI and mJOA are cervical/neck-specific; SF-36 and EQ-5D
  are generic health-related quality-of-life measures used across
  many surgical specialties).
- **Respondents:** the patient completes SF-36v2, NDI, and EQ-5D
  directly; mJOA is typically completed by the assessing clinician
  based on examination findings.
- **Unit of assessment:** one patient, at one visit/time point (e.g.
  baseline, 6-week, 3-month, 1-year follow-up).

## Instruments

| Instrument | Items | Score range | Direction |
| --- | --- | --- | --- |
| SF-36v2 | 36 (11 questions) | 8 domains, each 0–100 | Higher = better |
| NDI | 10 sections | 0–100% | Lower = better |
| mJOA | 6 subscales | 0–17 | Higher = better |
| EQ-5D-3L | 5 dimensions + VAS | index ≈ −0.59 to 1.0; VAS 0–100 | Higher = better |

## Response model

- **SF-36v2:** 36 raw items, each on its own ordinal scale (see spec).
  Scored into 8 domain scores (0–100) via the public-domain RAND-36
  method, plus simplified (non-licensed) `pcsApprox`/`mcsApprox`
  summary scores — **not** the trademarked QualityMetric norm-based
  SF-36v2 PCS/MCS.
- **NDI:** 10 sections, each 0–5. Scored as a percentage
  (0–100%, adjusted for any unanswered sections).
- **mJOA:** 6 subscales, each with its own point range. Summed to a
  0–17 total.
- **EQ-5D-3L:** 5 dimensions (1–3 each) → a 5-digit health-state
  descriptor and a UK-tariff (Dolan 1997) index value, plus a
  directly-recorded 0–100 VAS.

## Wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Visit details | subject ID, visit label, assessment date |
| 2 | SF-36v2 — general health | questions 1–2 |
| 3 | SF-36v2 — activities | question 3 (10 items) |
| 4 | SF-36v2 — role limitations | questions 4–5 (7 items) |
| 5 | SF-36v2 — pain, social, vitality, health perceptions | questions 6–11 (17 items) |
| 6 | Neck Disability Index | 10 sections |
| 7 | modified JOA | 6 subscales |
| 8 | EQ-5D-3L | 5 dimensions + VAS |
| 9 | Summary | all four instruments' computed scores |

## Output

- **HTML report preview** showing all 8 SF-36 domain scores, the NDI
  percentage + band, the mJOA total + band, and the EQ-5D index + VAS.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** mapped to a generic
  `QuestionnaireResponse` resource (plus `Observation` resources for
  the computed scores) for monorepo consistency.
- **XML representation** for archival / legacy import.

## Directory structure

```
patient-reported-outcome-measures/
  index.md                                # this file
  AGENTS.md                               # agent instructions
  plan.md                                 # implementation roadmap
  tasks.md                                # task tracking
  spec/                                    # living spec: items + exact scoring algorithms
  doc/                                     # background reference
  sql/                                     # Liquibase Postgres migrations
  xml/                                     # XML + DTD per SQL table
  fhir/r5/                                 # FHIR R5 JSON resources
  front-end-with-html/                     # static single-page wizard + dashboard
  front-end-with-svelte/                   # SvelteKit single-page wizard + dashboard
  back-end-with-loco/                      # Rust axum + Loco JSON API
```

## Source grounding

- Ware, J. E. *et al.* SF-36v2 Health Survey. © 1992, 1996, 2000
  Medical Outcomes Trust and QualityMetric Incorporated.
- Hays, R. D. *et al.* RAND 36-Item Health Survey 1.0 scoring manual
  (public domain). RAND Corporation.
- Vernon, H. & Mior, S. *The Neck Disability Index: a study of
  reliability and validity*. J Manipulative Physiol Ther. 1991;
  14(7):409-15.
- Japanese Orthopaedic Association cervical myelopathy scale
  (modified).
- The EuroQol Group. *EuroQol — a new facility for the measurement of
  health-related quality of life*. Health Policy. 1990;16(3):199-208.
- Dolan, P. *Modeling valuations for EuroQol health states*. Medical
  Care. 1997;35(11):1095-1108 (UK TTO tariff used for the EQ-5D-3L
  index value in this form).

## Compliance

This form captures validated PRO instrument responses for clinical
research; it is not itself a diagnostic device. MDCG 2019-11 / UK MDR
2002 / MHRA SaMD classification depends on how results are used
downstream (research data capture vs. clinical decision support) —
consult your institution's research governance / IRB process before
using this form in a clinical trial. ISO/IEC/IEEE 26514:2022
(information for users) is followed for documentation quality.

## Verify

```sh
bin/test-form patient-reported-outcome-measures
```
