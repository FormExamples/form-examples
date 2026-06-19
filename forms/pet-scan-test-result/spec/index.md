# PET Scan Test Result — living spec

Living domain spec for the PET-CT scan result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `pet_scan_test_result` | Main result/report record (source of truth). |
| `pet_scan_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `pet_scan_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `pet_scan_test_result_grade_flag` | Safety-critical flags. |

## Result record (`pet_scan_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `scan_type` (fdg-pet-ct / psma-pet /
  dotatate-pet / amyloid-pet / cardiac-pet / other), `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Clinical context & acquisition:** `clinical_history`, `blood_glucose_mmol_l`,
  `injected_activity_mbq`, `examination_adequacy` (adequate / limited /
  non-diagnostic).
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `hypermetabolic_lesion`, `nodal_uptake`, `distant_metastasis`,
  `no_abnormal_uptake`, `physiological_uptake_only`, `incidental_finding`.
- **Measurements & comparison:** `suv_max`, `largest_lesion_size_mm`,
  `comparison_with_previous`, `treatment_response` (complete / partial / stable /
  progressive / not-applicable).
- **Conclusion:** `impression` (≤2000), `reporting_category` (free-text Deauville
  / PERCIST label), `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`pet_scan_test_result_grade`)

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

### Findings → classification

- `no_abnormal_uptake` / `physiological_uptake_only` ⇒ **normal**.
- `hypermetabolic_lesion` and/or `nodal_uptake` ⇒ **abnormal**.
- `distant_metastasis` or `treatment_response = progressive` ⇒ **critical**.
- `examination_adequacy = non-diagnostic` ⇒ **inconclusive**.

### Escalation invariant

If the result describes a critical finding (distant metastasis or progressive
disease), Axis D **must** be `critical-alert` and a `critical-result-alert` flag
**must** be present, irrespective of the other axes.

## Rules and flags

- `pet_scan_test_result_grade_rule`: one row per fired rule with `rule_id`, `axis`
  (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `pet_scan_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
