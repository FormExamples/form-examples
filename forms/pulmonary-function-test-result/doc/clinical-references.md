# Pulmonary Function Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
pulmonary function (lung-function / spirometry) tests. These sources anchor the
four-axis interpretation grade, the ventilatory-pattern and severity banding, and
the critical-result alerting rules used by this form.

## Interpretation standards

### ERS/ATS technical standard on interpretive strategies for routine lung function tests (2022)

The European Respiratory Society / American Thoracic Society (ERS/ATS) 2022
technical standard is the current reference for interpreting routine lung
function tests. Its major changes relevant to this form:

- **z-score-based severity** — severity of impairment is graded on a three-level
  z-score system rather than the older slabs of FEV1 percent predicted: z-scores
  > −1.65 are normal, −1.65 to −2.5 mild, −2.51 to −4 moderate, and < −4.1
  severe. This underpins the `severity` field and the `reporting_category` label.
- **lower limit of normal (LLN)** — abnormality is defined relative to the
  Global Lung Function Initiative (GLI) reference equations (which require age,
  sex, and height), rather than a fixed cut-off, driving the
  `*_percent_predicted` measured values and the `airflow_obstruction` /
  `restriction` structured flags.
- the severity of *lung-function* impairment is not equivalent to *disease*
  severity — the report should state the pattern and severity, and leave overall
  acuity to the follow-up-urgency axis.

Sources:

- ERS/ATS technical standard on interpretive strategies for routine lung function
  tests (Stanojevic et al., *Eur Respir J* 2022; 60: 2101499).
  <https://publications.ersnet.org/content/erj/60/1/2101499>
- Understanding the use of z-scores and LLN in pulmonary function test reports.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC11789950/>

### ARTP statement on pulmonary function testing

The Association for Respiratory Technology & Physiology (ARTP) statement defines
UK practice for performing and quality-grading lung-function manoeuvres,
including ATS/ERS acceptability and repeatability criteria. This grounds the
`test_quality` field (acceptable / sub-optimal / unacceptable) and the
`inadequate-technique` safety-flag category.

- ARTP statement on pulmonary function testing (2020).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC7337892/>

## Severity and obstruction banding

### NICE NG115 / GOLD — airflow obstruction

Airflow obstruction is confirmed by a **post-bronchodilator FEV1/FVC ratio <
0.70**, which drives the `airflow_obstruction` structured flag and the
`obstructive` / `mixed` ventilatory patterns. GOLD then bands obstruction by FEV1
percent predicted, which may be stored in `reporting_category`:

| GOLD band | FEV1 % predicted | Severity mapping |
| --- | --- | --- |
| GOLD 1 | ≥ 80 % | mild |
| GOLD 2 | 50–79 % | moderate |
| GOLD 3 | 30–49 % | severe |
| GOLD 4 | < 30 % | very-severe |

Severe / very-severe obstruction (GOLD 3–4) is treated as a **critical finding**
that auto-escalates the follow-up-urgency axis and raises the
`critical-result-alert` flag.

- NICE NG115 *Chronic obstructive pulmonary disease in over 16s*.
  <https://www.nice.org.uk/guidance/ng115>
- GOLD — Global Initiative for Chronic Obstructive Lung Disease.
  <https://goldcopd.org/>
- Let's not forget: the GOLD criteria for COPD are based on post-bronchodilator
  FEV1 (*Eur Respir J*). <https://publications.ersnet.org/index.php/content/erj/23/4/497>

### NICE NG80 — asthma and bronchodilator reversibility

NICE NG80 positions spirometry, bronchodilator reversibility, and FeNO in the
diagnostic algorithm for asthma. Significant reversibility grounds the
`significant_reversibility` structured flag and the `bronchodilator_reversibility`
field.

- NICE NG80 *Asthma: diagnosis, monitoring and chronic asthma management*.
  <https://www.nice.org.uk/guidance/ng80>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| ERS/ATS 2022 z-score severity | `severity`, `reporting_category` (Axis B) |
| ERS/ATS 2022 GLI / LLN | `*_percent_predicted` measured values, `airflow_obstruction`, `restriction` |
| ARTP quality grading | `test_quality`, `inadequate-technique` flag |
| NICE NG115 / GOLD FEV1/FVC < 0.70 | `fev1_fvc_ratio`, `airflow_obstruction`, `ventilatory_pattern` |
| GOLD 1–4 FEV1 %-predicted bands | `fev1_percent_predicted`, `reporting_category` |
| NICE NG80 reversibility | `bronchodilator_reversibility`, `significant_reversibility` |
| Critical / urgent communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag, follow-up-urgency axis |
