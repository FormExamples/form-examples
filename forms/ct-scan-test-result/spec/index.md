# CT Scan Test Result — living spec

Living domain spec for the CT scan result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `ct_scan_test_result` | Main result/report record (source of truth). |
| `ct_scan_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `ct_scan_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `ct_scan_test_result_grade_flag` | Safety-critical flags. |

## Result record (`ct_scan_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `body_region`, `contrast_used` (none / iv-iodinated / oral /
  both), `technique`, `examination_adequacy` (adequate / limited / non-diagnostic).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `acute_finding`, `mass_or_lesion`, `haemorrhage`, `infarct`, `fracture`,
  `infection_inflammation`, `obstruction`, `incidental_finding`.
- **Measurements:** `largest_lesion_size_mm`, `radiation_dose_dlp`.
- **Conclusion:** `impression` (≤2000), `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`ct_scan_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If the result describes a critical finding, Axis D **must** be `critical-alert`
and a `critical-result-alert` flag **must** be present, irrespective of the
other axes.

## Rules and flags

- `ct_scan_test_result_grade_rule`: one row per fired rule with `rule_id`, `axis`
  (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `ct_scan_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
