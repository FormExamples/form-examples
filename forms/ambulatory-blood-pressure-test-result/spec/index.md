# Ambulatory Blood Pressure Test Result — living spec

Living domain spec for the ABPM result (report) form. The schema in
[`../sql/`](../sql) is the source of truth; this spec describes the behaviour the
front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `ambulatory_blood_pressure_test_result` | Main result/report record (source of truth). |
| `ambulatory_blood_pressure_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `ambulatory_blood_pressure_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `ambulatory_blood_pressure_test_result_grade_flag` | Safety-critical flags. |

## Result record (`ambulatory_blood_pressure_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `monitoring_type`
  (24-hour-abpm / home-blood-pressure-monitoring / other), `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Recording adequacy:** `valid_readings_percent`, `recording_adequate`.
- **Clinical context:** `clinical_history`.
- **Averaged measurements (mmHg):** `daytime_average_systolic` /
  `daytime_average_diastolic`, `nighttime_average_systolic` /
  `nighttime_average_diastolic`, `twenty_four_hour_average_systolic` /
  `twenty_four_hour_average_diastolic`.
- **Nocturnal dipping:** `nocturnal_dip_percent`, `dipper_status`
  (dipper / non-dipper / reverse-dipper / extreme-dipper).
- **Findings:** `findings_narrative` (≤2000), plus structured booleans
  `hypertension_confirmed`, `white_coat_effect`, `masked_hypertension`,
  `severe_hypertension`, `nocturnal_hypertension`, `normal_study`.
- **Conclusion:** `comparison_with_previous`, `impression` (≤2000),
  `reporting_category` (free-text hypertension stage), `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`ambulatory_blood_pressure_test_result_grade`)

Pure function over the result:

| Axis | Field(s) | Domain |
| --- | --- | --- |
| A. classification | `result_classification` | normal / abnormal / critical / inconclusive |
| B. severity | `abnormality_severity` + `reporting_category` | none / minor / moderate / major (+ stage label) |
| C. completeness | `report_completeness_percent` | 0–100 |
| D. follow-up urgency | `follow_up_urgency` + `target_timeframe` + `recommended_action` | routine / recommended / urgent / critical-alert |

Overall `recommendation`: no-action / routine-follow-up / further-imaging /
specialist-referral / urgent-review. Sign-off via `signed_at`; engine timestamp
`graded_at`.

### Threshold anchors (NICE NG136 / ESH)

- Daytime average ≥135/85 → hypertension confirmed (stage 1); ≥150/95 → stage 2.
- 24-hour average ≥130/80 → hypertension.
- Nighttime average ≥120/70 → nocturnal hypertension.
- ABPM average ≥150/95 (clinic-equivalent ≥180/120) → severe hypertension.
- Dipper status from `nocturnal_dip_percent`: dipper >10–20 %, non-dipper
  >0–10 %, reverse-dipper ≤0 %, extreme-dipper >20 %.

### Escalation invariant

If the result describes severe hypertension (ABPM average ≥150/95, clinic-equiv
≥180/120), Axis D **must** be `critical-alert` and a `critical-result-alert`
flag **must** be present, irrespective of the other axes.

## Rules and flags

- `ambulatory_blood_pressure_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `ambulatory_blood_pressure_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
