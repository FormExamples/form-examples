# DEXA Bone Density Test Result

A UK NHS–aligned **DEXA / DXA (dual-energy X-ray absorptiometry) bone-density
result (report)** that a reporting clinician completes after a DEXA examination
has been performed. It is the **result/report counterpart** to *DEXA Bone
Density Test Request* (a referral): where the request captures why a scan should
be done, this form records what the scan **found** and a structured
**interpretation**.

DEXA results are **quantitative**. The form records the performed examination,
the clinical history, the **bone mineral density (BMD)** in g/cm², the
**T-scores** and **Z-scores** at the lumbar spine, femoral neck, and total hip
(plus the lowest T-score across sites), the **WHO densitometric classification**,
the **FRAX** 10-year fracture probabilities, whether a vertebral fracture was
identified, comparison with previous imaging and the percentage BMD change,
the impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured bone-densitometry report.

This form mirrors the repository's gold-template result form
*CT Scan Test Result* in structure and conventions. It is completed by a
radiologist, consultant, reporting radiographer, rheumatologist, or
endocrinologist rather than by the patient, and is aligned with the **WHO**
densitometric definition of osteoporosis, the **ISCD** Official Positions, and
the UK **National Osteoporosis Guideline Group (NOGG)** clinical guideline.

## Scope and intended users

- **Setting:** NHS radiology / osteoporosis / metabolic-bone service reporting
  workflow, DEXA scanning unit, or fracture-liaison service.
- **Users:** radiologists, consultants, reporting radiographers, rheumatologists,
  and endocrinologists who interpret and sign DEXA reports.
- **Patients:** any patient who has undergone a DEXA bone-densitometry
  examination — most commonly postmenopausal women and men aged 50 or older.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`dexa_bone_density_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Quantitative findings

DEXA reports quantitative densitometry, expressed as standard-deviation scores
against reference populations:

- **T-score** — standard deviations from the **young-adult** reference mean. The
  T-score is the basis of the WHO densitometric classification and is used in
  postmenopausal women and men aged 50 or older.
- **Z-score** — standard deviations from the **age-matched** reference mean.
  Preferred in premenopausal women, men under 50, and children; a Z-score
  ≤ −2.0 is "below the expected range for age".
- **BMD** — the underlying areal bone mineral density in g/cm² at the reference
  site, used for monitoring and percentage-change calculations.

The form captures T-scores and Z-scores at the **lumbar spine** and **femoral
neck**, the **total-hip** T-score, the **lowest T-score** across measured sites
(which drives the classification), and the **BMD** at the reference site.

## WHO densitometric classification

The World Health Organization classifies bone status by the **lowest T-score**
at the lumbar spine, total hip, or femoral neck:

| Lowest T-score | WHO category |
| --- | --- |
| T ≥ −1.0 | **Normal** |
| −1.0 > T > −2.5 | **Osteopenia** (low bone mass) |
| T ≤ −2.5 | **Osteoporosis** |
| T ≤ −2.5 **with** one or more fragility fractures | **Severe (established) osteoporosis** |

The ISCD Official Positions confirm that **T-scores are preferred and the WHO
densitometric classification is applicable**, that osteoporosis may be diagnosed
when the T-score is **−2.5 or lower at the lumbar spine, total hip, or femoral
neck** (and, in some situations, the 33 % / one-third radius), and that the
**Z-score** rather than the T-score should be used in younger adults and
children. NOGG and the modern UK guideline frame treatment decisions on
**fracture risk** (via FRAX) rather than BMD in isolation; BMD/DEXA refines that
risk and informs the management recommendation.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | WHO densitometric classification | abnormality severity (none / minor / moderate / major) + a `reporting_category` label carrying the WHO class |
| **C. Report completeness** | Mandatory report-section checklist (history, adequacy, quantitative findings, comparison, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

### T-score / WHO → axes mapping

| Lowest T-score | WHO classification | Axis A classification | Axis D follow-up | Recommendation |
| --- | --- | --- | --- | --- |
| T ≥ −1.0 | normal | normal | routine | no-action / routine-follow-up |
| −1.0 > T > −2.5 | osteopenia | abnormal | recommended | routine-follow-up |
| T ≤ −2.5 | osteoporosis | abnormal | urgent | specialist-referral / treatment review |
| T ≤ −2.5 with vertebral / fragility fracture | severe osteoporosis | abnormal / critical | critical-alert | urgent-review (treatment review) |

The `reporting_category` field on the grade **carries the WHO classification**.
**Severe osteoporosis** or an **identified vertebral fracture**
**auto-escalates** Axis D to *urgent / critical-alert* and raises the
`abnormal-requiring-action` / `urgent-referral` flag regardless of the other
axes. Choose the least-urgent band only when no rule fires.

### Structured finding and measurements

The boolean structured finding `vertebral_fracture_identified` (e.g. on
vertebral fracture assessment / lateral spine imaging) participates in
classification, severity, and flags. Key measurements: `lowest_t_score` (drives
classification), `bone_mineral_density_g_cm2` (monitoring),
`percent_change_since_previous` (interval change), and the FRAX outputs
`frax_major_fracture_percent` and `frax_hip_fracture_percent`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | scan region, examination adequacy |
| 3 | Clinical history | clinical history |
| 4 | Quantitative findings | lumbar-spine / femoral-neck / total-hip T-scores and Z-scores, lowest T-score, BMD (g/cm²), WHO classification |
| 5 | Fracture risk & comparison | FRAX major & hip probabilities, vertebral fracture identified, comparison with previous, percent change |
| 6 | Impression | impression, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** bone-densitometry report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
dexa-bone-density-test-result/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  spec/                             # living spec
  doc/                              # clinical reference documentation
  sql/                              # PostgreSQL migrations (source of truth)
  xml/                              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  typespec/                         # TypeSpec API definitions (generated)
  front-end-with-svelte/            # SvelteKit single-page wizard
  back-end-with-loco/               # Rust axum + Loco JSON API
```

## Clinical references

- WHO densitometric classification of osteoporosis (normal / osteopenia /
  osteoporosis / severe osteoporosis by T-score), as summarized by the
  International Osteoporosis Foundation.
  <https://www.osteoporosis.foundation/health-professionals/diagnosis>
- ISCD — 2023 Official Adult Positions (T-scores preferred; WHO classification
  applicable; osteoporosis at T ≤ −2.5 at lumbar spine, total hip, or femoral
  neck; Z-score for younger adults / children).
  <https://iscd.org/official-positions-2023/>
- NOGG / UK clinical guideline for the prevention and treatment of osteoporosis
  (fracture-risk–based management; FRAX with BMD).
  <https://www.nogg.org.uk/sites/nogg/download/NOGG-Guideline-2021-g.pdf>
- The 2024 UK clinical guideline for the prevention and treatment of
  osteoporosis (NOGG update).
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12417299/>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management.
- UK Medical Devices Regulations 2002.
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form dexa-bone-density-test-result
```
