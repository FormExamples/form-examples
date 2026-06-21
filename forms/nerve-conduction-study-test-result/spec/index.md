# Nerve Conduction Study Test Result — living spec

Living domain spec for the nerve conduction study / EMG result (report) form. The
schema in [`../sql/`](../sql) is the source of truth; this spec describes the
behaviour the front-ends and back-end must implement identically.

## Entities

| Table | Role |
| --- | --- |
| `patient` | Patient demographics. |
| `clinician` | Reporting clinician (report author/signer). |
| `nerve_conduction_study_test_result` | Main result/report record (source of truth). |
| `nerve_conduction_study_test_result_grade` | Computed four-axis interpretation grade (1:1 with result). |
| `nerve_conduction_study_test_result_grade_rule` | Audit trail of fired scoring rules. |
| `nerve_conduction_study_test_result_grade_flag` | Safety-critical flags. |

## Result record (`nerve_conduction_study_test_result`)

- **Identification:** `patient_id`, `clinician_id`,
  `originating_request_reference`, `report_status`
  (preliminary / final / amended / cancelled), `performed_date`, `reported_date`.
- **Examination:** `study_type` (nerve-conduction / emg /
  nerve-conduction-and-emg / repetitive-stimulation / other), `region`
  (upper-limb / lower-limb / all-limbs / cranial / generalised / other),
  `laterality` (left / right / bilateral / not-applicable), `study_adequacy`
  (adequate / limited / non-diagnostic).
- **Clinical context:** `clinical_history`, `comparison_with_previous`.
- **Findings:** `nerve_conduction_findings` (≤2000), `emg_findings` (≤2000),
  plus structured booleans `carpal_tunnel_syndrome`, `peripheral_neuropathy`,
  `radiculopathy`, `motor_neurone_disease_features`, `myopathy`,
  `neuromuscular_junction_disorder`, `normal_study`.
- **Characterisation:** `severity` (mild / moderate / severe / not-applicable),
  `pattern` (demyelinating / axonal / mixed / not-applicable).
- **Conclusion:** `impression` (≤2000), `reporting_category` (free text),
  `recommended_follow_up`.
- **Critical communication:** `critical_result_communicated`, `reported_to`.

## Grade contract (`nerve_conduction_study_test_result_grade`)

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

If the result describes a critical finding (motor neurone disease features, or a
severe acute neuropathy such as a Guillain-Barré syndrome pattern), Axis D
**must** be `critical-alert` and a `critical-result-alert` flag **must** be
present, irrespective of the other axes.

## Rules and flags

- `nerve_conduction_study_test_result_grade_rule`: one row per fired rule with
  `rule_id`, `axis` (classification / severity / completeness / follow-up),
  `category`, `description`. Rule IDs are stable and shared across
  implementations.
- `nerve_conduction_study_test_result_grade_flag`: `flag_id`, `category`
  (critical-result-alert, incidental-finding, discrepancy-with-request,
  abnormal-requiring-action, urgent-referral, inadequate-technique,
  unexpected-finding, missing-impression, missing-measurement, other),
  `priority` (low / medium / high), `description`, `suggested_action`.

## Conventions

- camelCase in front-end serde; snake_case in SQL.
- `''` for unanswered text / enum; `null` for unanswered numeric / date / time.
- One continuous single-page wizard (~7 sections).
