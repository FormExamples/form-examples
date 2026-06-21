# Pulmonary Function Test Result — living spec

Living domain spec for the pulmonary function test (lung-function / spirometry)
result (report) form. The schema in [`../sql/`](../sql) is the source of truth;
this spec describes the behaviour the front-ends and back-end must implement
identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `pulmonary_function_test_result` | Main result/report record (source of truth). |
| `pulmonary_function_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `pulmonary_function_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `pulmonary_function_test_result_grade_flag` | Safety-critical flags. |

## Result record (`pulmonary_function_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `test_type` (spirometry /
  spirometry-with-reversibility / full-lung-function / gas-transfer-dlco /
  peak-flow / feno / other), `performed_date`, `reported_date`, `report_status`
  (preliminary / final / amended / cancelled), `test_quality` (acceptable /
  sub-optimal / unacceptable).
- **Clinical context:** `clinical_history`.
- **Measured values:** `fev1_litres`, `fev1_percent_predicted`, `fvc_litres`,
  `fvc_percent_predicted`, `fev1_fvc_ratio`, `peak_expiratory_flow`,
  `dlco_percent_predicted`.
- **Interpretation summary:** `ventilatory_pattern` (normal / obstructive /
  restrictive / mixed), `severity` (none / mild / moderate / severe /
  very-severe), `bronchodilator_reversibility` (positive / negative / not-tested).
- **Structured findings:** booleans `airflow_obstruction`, `restriction`,
  `reduced_gas_transfer`, `significant_reversibility`, `normal_spirometry`.
- **Narrative & conclusion:** `findings_narrative` (≤2000),
  `comparison_with_previous`, `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`pulmonary_function_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-testing /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical finding (severe / very-severe obstruction or
restriction, or marked decline versus previous), Axis D **must** be
`critical-alert` and a `critical-result-alert` flag **must** be present,
irrespective of the other axes.

## Rules and flags

- `pulmonary_function_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `pulmonary_function_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
