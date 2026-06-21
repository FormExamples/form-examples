# Biopsy Test Result — living spec

Living domain spec for the biopsy histopathology result (report) form. The schema
in [`../sql/`](../sql) is the source of truth; this spec describes the behaviour
the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `biopsy_test_result` | Main result/report record (source of truth). |
| `biopsy_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `biopsy_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `biopsy_test_result_grade_flag` | Safety-critical flags. |

## Result record (`biopsy_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / supplementary / cancelled),
  `performed_date`, `reported_date`.
- **Specimen & procedure:** `biopsy_site`, `biopsy_method`, `specimen_adequacy`
  (adequate / suboptimal / inadequate).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Description:** `macroscopic_description` (≤2000),
  `microscopic_description` (≤2000).
- **Diagnosis & grading:** `diagnosis` (≤2000), `malignancy_present`,
  `tumour_type`, `histological_grade` (well-/moderately-/poorly-differentiated /
  undifferentiated / not-applicable), `resection_margins`
  (clear / involved / close / not-applicable), `lymphovascular_invasion`,
  `immunohistochemistry`, `molecular_results`, `snomed_code`.
- **Conclusion:** `impression` (≤2000), `reporting_category` (free-text grade /
  diagnosis summary), `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`biopsy_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-testing /
specialist-referral / urgent-mdt. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical finding — an unexpected malignancy or an
**involved** resection margin — Axis D **must** be `critical-alert` and a
`critical-result-alert` flag **must** be present, irrespective of the other
axes.

## Rules and flags

- `biopsy_test_result_grade_rule`: one row per fired rule with `rule_id`, `axis`
  (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `biopsy_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
