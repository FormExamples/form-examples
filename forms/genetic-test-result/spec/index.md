# Genetic Test Result — living spec

Living domain spec for the genetic / genomic test result (report) form. The
schema in [`../sql/`](../sql) is the source of truth; this spec describes the
behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `genetic_test_result` | Main result/report record (source of truth). |
| `genetic_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `genetic_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `genetic_test_result_grade_flag` | Safety-critical flags. |

## Result record (`genetic_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Test details:** `test_type` (diagnostic-single-gene / gene-panel /
  whole-exome / whole-genome / chromosomal-microarray / karyotype /
  predictive-presymptomatic / carrier-testing / pharmacogenomic / prenatal /
  other), `genes_tested`, `sample_type` (blood / saliva / tissue / prenatal).
- **Clinical context:** `clinical_history`, `inheritance_pattern`.
- **Findings:** `variants_detected` (≤2000), `variant_classification`
  (pathogenic / likely-pathogenic / variant-uncertain-significance /
  likely-benign / benign / no-variant-detected), `zygosity` (heterozygous /
  homozygous / hemizygous / not-applicable), plus structured booleans
  `pathogenic_variant_found`, `vus_found`, `carrier_status_positive`,
  `secondary_finding`, `no_clinically_significant_variant`.
- **Interpretation:** `interpretation` (≤2000), `impression` (≤2000),
  `reporting_category` (free-text ACMG class).
- **Follow-up:** `recommended_cascade_testing`, `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`genetic_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ ACMG class label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a pathogenic / likely-pathogenic actionable variant (or
a secondary actionable finding), Axis A **must** be `abnormal` or `critical`,
Axis D **must** be `urgent` or `critical-alert`, and a `critical-result-alert` /
`pathogenic-variant-found` flag **must** be present, irrespective of the other
axes. A VUS yields `inconclusive` classification and a `recommended` follow-up
with a `variant-uncertain-significance` flag.

## Rules and flags

- `genetic_test_result_grade_rule`: one row per fired rule with `rule_id`, `axis`
  (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `genetic_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, pathogenic-variant-found, secondary-finding,
  variant-uncertain-significance, cascade-testing-recommended,
  discrepancy-with-request, abnormal-requiring-action, urgent-referral,
  missing-impression, missing-classification, other), `priority`
  (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
