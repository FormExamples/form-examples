# Blood Test Result — living spec

Living domain spec for the blood / pathology test result (report) form. The
schema in [`../sql/`](../sql) is the source of truth; this spec describes the
behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `blood_test_result` | Main result/report record with analyte result values (source of truth). |
| `blood_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `blood_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `blood_test_result_grade_flag` | Safety-critical flags. |

## Result record (`blood_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Specimen:** `specimen_type` (serum / plasma / whole-blood),
  `specimen_condition` (satisfactory / haemolysed / lipaemic / clotted /
  insufficient).
- **Clinical context:** `clinical_history`.
- **Result values (nullable `NUMERIC`):**
  - FBC — `haemoglobin_g_l`, `white_cell_count`, `platelets`, `neutrophils`.
  - U&E / renal — `sodium_mmol_l`, `potassium_mmol_l`, `urea_mmol_l`,
    `creatinine_umol_l`, `egfr`.
  - LFT — `alt_u_l`, `alkaline_phosphatase`, `bilirubin_umol_l`, `albumin_g_l`.
  - Inflammation — `c_reactive_protein`.
  - Glycaemic — `hba1c_mmol_mol`, `glucose_mmol_l`.
  - Endocrine — `tsh`. Haematinics — `ferritin`. Coagulation — `inr`.
- **Interpretation summary:** `overall_result_status` (normal / abnormal /
  critical), `abnormal_results_present`, `critical_value_present`,
  `critical_value_detail`, `findings_narrative` (≤2000),
  `comparison_with_previous`.
- **Conclusion:** `impression` (≤2000), `reporting_category`,
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`blood_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / repeat-test /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Escalation invariant

If `critical_value_present` is true (a critical / panic value), Axis A **must**
be `critical`, Axis D **must** be `critical-alert`, and a `critical-result-alert`
flag **must** be present, irrespective of the other axes. If
`abnormal_results_present` is true but no critical value is present, Axis A is
`abnormal` and Axis D is at least `recommended`.

## Rules and flags

- `blood_test_result_grade_rule`: one row per fired rule with `rule_id`, `axis`
  (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `blood_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-specimen,
  unexpected-finding, missing-impression, missing-result-value, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
