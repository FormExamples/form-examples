# Lumbar Puncture Test Result — living spec

Living domain spec for the lumbar puncture (LP) / cerebrospinal-fluid (CSF)
analysis result (report) form. The schema in [`../sql/`](../sql) is the source of
truth; this spec describes the behaviour the front-ends and back-end must
implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `lumbar_puncture_test_result` | Main result/report record (source of truth). |
| `lumbar_puncture_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `lumbar_puncture_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `lumbar_puncture_test_result_grade_flag` | Safety-critical flags. |

## Result record (`lumbar_puncture_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Clinical context:** `clinical_history`.
- **Manometry:** `opening_pressure_cmh2o`.
- **Appearance & cells:** `csf_appearance` (clear / cloudy / turbid /
  blood-stained / xanthochromic), `csf_white_cell_count`, `csf_red_cell_count`.
- **Biochemistry:** `csf_protein_g_l`, `csf_glucose_mmol_l`,
  `csf_serum_glucose_ratio`, `csf_lactate_mmol_l`.
- **Microbiology & specialist:** `gram_stain_result`, `culture_result`,
  `pcr_result`, `oligoclonal_bands` (positive / negative / not-tested),
  `xanthochromia` (positive / negative / not-tested).
- **Structured findings:** `raised_protein`, `pleocytosis`, `low_glucose`,
  `bacterial_meningitis_pattern`, `viral_pattern`,
  `subarachnoid_haemorrhage_suggested`, `normal_csf`.
- **Conclusion:** `findings_narrative` (≤2000), `impression` (≤2000),
  `reporting_category`, `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`lumbar_puncture_test_result_grade`)

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

If the result describes a critical CSF finding — `bacterial_meningitis_pattern`,
`subarachnoid_haemorrhage_suggested`, or a positive `culture_result` — then
Axis D **must** be `critical-alert` and a `critical-result-alert` flag **must**
be present, irrespective of the other axes.

## Rules and flags

- `lumbar_puncture_test_result_grade_rule`: one row per fired rule with `rule_id`,
  `axis` (classification / severity / completeness / follow-up), `category`,
  `description`. Rule IDs are stable and shared across implementations.
- `lumbar_puncture_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
