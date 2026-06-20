# Holter Monitor Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
ambulatory ECG (Holter) monitoring. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards and ambulatory ECG analysis

### ACC/AHA Guidelines for Ambulatory Electrocardiography

The ACC/AHA ambulatory electrocardiography guideline frames *why* a recording is
performed and *what* abnormal findings mean for management. Unexplained syncope,
near-syncope, episodic dizziness, and palpitations are Class I indications; the
analysed report must therefore relate the recorded rhythm back to the clinical
question. This underpins the form's `clinical_history`,
`symptom_rhythm_correlation`, and the follow-up-urgency axis.

- ACC/AHA Guidelines for Ambulatory Electrocardiography
  (Circulation 1999;100:886).
  <https://www.ahajournals.org/doi/10.1161/01.cir.100.8.886>

### 2017 ISHNE-HRS expert consensus on ambulatory ECG

The ISHNE-HRS consensus describes the analysis and reporting of ambulatory ECG
and external cardiac monitoring, including the rhythm and rate summary, ectopy
burden quantification, pause detection, and recording-quality / analysable-time
reporting that the form captures in `mean_heart_rate_bpm`,
`minimum_heart_rate_bpm`, `maximum_heart_rate_bpm`, `longest_pause_seconds`,
`ventricular_ectopic_percent`, `supraventricular_ectopic_percent`,
`recording_duration_hours`, and `analysed_percent`.

- 2017 ISHNE-HRS expert consensus statement on ambulatory ECG and external
  cardiac monitoring / telemetry.
  <https://www.heartrhythmjournal.com/article/s1547-5271(17)30415-0/fulltext>

## Critical-finding thresholds

Significant arrhythmias recorded on a Holter warrant prompt specialist referral
even when the patient is asymptomatic. The form escalates the following to
*critical* (Axis A) / *critical-alert* (Axis D) and raises the
`critical-result-alert` flag:

| Finding | Threshold / definition | Field(s) |
| --- | --- | --- |
| Ventricular tachycardia | sustained or rapid non-sustained VT | `ventricular_tachycardia` |
| Significant pause | longest R-R pause > 3 seconds | `significant_pauses`, `longest_pause_seconds` |
| High-grade AV block | Mobitz II or third-degree (complete) AV block | `high_grade_av_block` |
| Fast atrial fibrillation | AF with uncontrolled fast ventricular response | `atrial_fibrillation_detected`, `maximum_heart_rate_bpm` |

Pauses > 3 seconds, Mobitz II / third-degree AV block, and rapid VT are widely
treated as actionable thresholds requiring cardiology review, and high-grade AV
block / symptomatic pauses are pacing indications under ESC guidance.

### NICE NG196 — atrial fibrillation

NICE NG196 anchors AF detection and rate-control assessment: rate control aiming
for a resting heart rate target, with escalation when ventricular rates remain
uncontrolled. This supports the `atrial_fibrillation_detected` finding and the
`reporting_category` AF-burden label.

- NICE NG196 *Atrial fibrillation: diagnosis and management*.
  <https://www.nice.org.uk/guidance/ng196/chapter/Recommendations>

### ESC cardiac pacing guidance

The 2021 ESC Guidelines on cardiac pacing and cardiac resynchronization therapy
define the pause, sinus-node-disease, and AV-block thresholds at which pacing is
indicated, grounding the significant-pause and high-grade-AV-block escalation.

- 2021 ESC Guidelines on cardiac pacing and cardiac resynchronization therapy.
  <https://www.escardio.org/Guidelines>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| ACC/AHA actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| ISHNE-HRS rhythm / rate / ectopy summary | rate-summary columns, ectopy-percent columns |
| ISHNE-HRS recording-quality reporting | `recording_duration_hours`, `analysed_percent`, report-completeness axis |
| Pause > 3 s / VT / high-grade AV block thresholds | `significant_pauses`, `ventricular_tachycardia`, `high_grade_av_block`, `critical-result-alert` flag |
| NICE NG196 AF detection / rate control | `atrial_fibrillation_detected`, `reporting_category` (Axis B) |
| ESC pacing thresholds | `longest_pause_seconds`, `high_grade_av_block` escalation |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
