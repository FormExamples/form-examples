# DEXA Bone Density Test Request

A UK NHS–aligned **DEXA / DXA bone-densitometry (osteoporosis) scan request
(referral)** that a clinician completes to request a dual-energy X-ray
absorptiometry examination to measure bone mineral density (BMD). It records the
requested scan region, the clinical indication and specific question,
fracture-risk factors (FRAX inputs), previous DEXA history, and the requested
urgency — then computes a **four-axis grading** (appropriateness, radiation
safety, request completeness, and triage priority) plus a set of safety-critical
flags. The output is a vetting report that supports the imaging department's
triage and booking decision.

This form is the bone-densitometry counterpart to the repository's other
clinician-driven request forms. It is completed by a radiologist, GP,
rheumatologist, endocrinologist, hospital doctor, or radiographer rather than by
the patient, and is aligned with NICE CG146, the National Osteoporosis Guideline
Group (NOGG) guidance, FRAX, and the International Society for Clinical
Densitometry (ISCD) Official Positions.

## Scope and intended users

- **Setting:** NHS outpatient clinic, fracture liaison service, rheumatology /
  endocrinology clinic, community service, or imaging-department triage /
  vetting desk.
- **Users:** radiologists, GPs, rheumatologists, endocrinologists, hospital
  doctors, and radiographers who vet incoming requests.
- **Patients:** adults requiring bone-mineral-density assessment for
  osteoporosis risk, diagnosis, or treatment monitoring.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE CG146 / NOGG / FRAX intervention thresholds (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Radiation safety** | DEXA effective-dose banding | low / moderate / high dose band (+ safety note; DEXA is very low dose, pregnancy caution) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent (+ target timeframe) |

A high-acuity factor (recent fragility fracture, very high FRAX risk, long-term
high-dose steroids) **escalates** the triage tier regardless of the other axes.

### Scan region and indication

| Scan region | Typical use |
| --- | --- |
| Hip | Standard site; femoral neck and total hip BMD |
| Spine | Lumbar spine (L1–L4) BMD; affected by degenerative change |
| Hip and spine | Dual-site assessment (most common diagnostic request) |
| Forearm | Used when hip/spine non-evaluable or for hyperparathyroidism |
| Whole body | Body composition; paediatric / research contexts |
| Other | Site not listed above |

| Indication | Notes |
| --- | --- |
| Osteoporosis screening | Risk-stratified screening after FRAX / QFracture |
| Fragility fracture | Prior low-trauma fracture (high-value indication) |
| Long-term steroids | Glucocorticoid-induced osteoporosis risk |
| Early menopause | Menopause before age 45 |
| High FRAX risk | FRAX near or above the NOGG intervention threshold |
| Monitoring treatment | Interval BMD change on therapy |
| Secondary osteoporosis | Hyperparathyroidism, malabsorption, hypogonadism, etc. |
| Other | Indication not listed above |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, weight |
| 3 | Requested examination | scan region, primary indication, specific clinical question, relevant history |
| 4 | Fracture-risk factors | FRAX major-fracture %, previous fragility fracture, long-term steroids, menopause status, parental hip fracture, weight |
| 5 | Previous DEXA | previous DEXA result, previous DEXA date |
| 6 | Triage & submit | requested urgency, requested-by date, setting, notes |
| 7 | Review | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
are recent-fragility-fracture, high-frax-risk, duplicate-recent-dexa, pregnancy,
missing-indication, missing-clinical-question, and other. DEXA delivers a very
low radiation dose (typically ~1–5 microsievert), but a scan should be deferred
in known or suspected pregnancy.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
dexa-bone-density-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml-representations/              # XML + DTD per SQL table (generated)
  fhir-r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-form-with-html/         # single-page HTML wizard
  front-end-form-with-svelte/       # SvelteKit single-page wizard
  front-end-dashboard-with-html/    # vetting dashboard (HTML table)
  front-end-dashboard-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NICE CG146 *Osteoporosis: assessing the risk of fragility fracture* — assess
  with FRAX (without BMD) or QFracture first, then DXA when risk is near an
  intervention threshold.
  <https://www.nice.org.uk/guidance/cg146/chapter/Recommendations>
- NICE QS149 *Osteoporosis* quality standard — assessment of fragility fracture
  risk. <https://www.nice.org.uk/guidance/qs149/chapter/Quality-statement-1-Assessment-of-fragility-fracture-risk>
- National Osteoporosis Guideline Group (NOGG) — *Clinical guideline for the
  prevention and treatment of osteoporosis* (2024); intervention thresholds and
  repeat-DXA guidance. <https://www.nogg.org.uk/sites/nogg/download/NOGG-Guideline-2024.pdf>
- FRAX — WHO Fracture Risk Assessment Tool (10-year major osteoporotic and hip
  fracture probability). <https://frax.shef.ac.uk/>
- ISCD *2023 Official Positions — Adult*; DXA best practices and precision /
  least-significant-change for monitoring intervals.
  <https://iscd.org/official-positions-2023/>
- Radiation dose: DEXA effective dose is very low (~1–5 microsievert per scan);
  defer in known or suspected pregnancy (IAEA RPOP).
  <https://www.iaea.org/resources/rpop/health-professionals/other-specialities-and-imaging-modalities/dxa-bone-mineral-densitometry/patients>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / scan selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form dexa-bone-density-test-request
```
