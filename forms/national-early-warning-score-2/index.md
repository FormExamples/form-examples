# National Early Warning Score 2 (NEWS2)

A UK NHS–aligned implementation of the **National Early Warning Score 2
(NEWS2)**, the standardized track-and-trigger early warning system published by
the Royal College of Physicians (RCP) in December 2017. The form records six
routinely measured physiological parameters at the bedside, scores each against
the published NEWS2 allocation, aggregates them into a total score of **0 to
20+**, and returns the resulting **clinical-risk band** together with the RCP's
recommended monitoring frequency and clinical-response (escalation) actions.

NEWS2 standardizes the assessment and response to acute illness, promotes early
detection of clinical deterioration and sepsis, and provides a common language
of acuity across the whole acute care pathway. This form is completed by a
nurse, healthcare assistant, doctor, paramedic, or other clinician taking a set
of observations; it is a decision-support aid and does not replace clinical
judgement.

## Scope and intended users

- **Setting:** NHS acute hospital wards, emergency departments, acute medical
  and surgical assessment units, ambulance / pre-hospital services, and other
  settings where adult vital-sign observations are recorded.
- **Users:** registered nurses, healthcare assistants, doctors, paramedics, and
  other clinicians who record and act on adult observations.
- **Patients:** acutely ill adults (≥ 16 years). NEWS2 is **not** validated for
  and must not be used in children (< 16), pregnant women (use a maternity early
  warning system), or patients with spinal-cord injury; these are excluded by
  design.

## Scoring system

- **Primary instrument:** National Early Warning Score 2 (NEWS2, RCP 2017), an
  aggregate weighted track-and-trigger score derived from six physiological
  parameters plus a supplemental-oxygen weighting.
- **Aggregate range:** 0 to 20+ (each of the six parameters scores 0–3; the
  air-or-oxygen item adds 0 or 2).
- **SpO₂ scales:** **Scale 1** is used for the majority of patients. **Scale 2**
  is used only for patients with a prescribed target oxygen saturation of 88–92 %
  (typically hypercapnic respiratory failure, e.g. some patients with COPD) and
  must be endorsed by a competent clinician; the scale in use is recorded on the
  chart.

### Parameter point allocation

| Physiological parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Respiration rate (breaths/min) | ≤ 8 | | 9–11 | 12–20 | | 21–24 | ≥ 25 |
| SpO₂ **Scale 1** (%) | ≤ 91 | 92–93 | 94–95 | ≥ 96 | | | |
| SpO₂ **Scale 2** (%) — on oxygen | ≤ 83 | 84–85 | 86–87 | 88–92 | 93–94 | 95–96 | ≥ 97 |
| SpO₂ **Scale 2** (%) — on air | | | | 88–92 | ≥ 93 | | |
| Air or oxygen | | Oxygen | | Air | | | |
| Systolic blood pressure (mmHg) | ≤ 90 | 91–100 | 101–110 | 111–219 | | | ≥ 220 |
| Pulse (beats/min) | ≤ 40 | | 41–50 | 51–90 | 91–110 | 111–130 | ≥ 131 |
| Consciousness (ACVPU) | | | | Alert | | | Confusion / V / P / U |
| Temperature (°C) | ≤ 35.0 | | 35.1–36.0 | 36.1–38.0 | 38.1–39.0 | ≥ 39.1 | |

Notes: Scale 2 scores SpO₂ against a target range of 88–92 %; a patient on air
whose SpO₂ is ≥ 93 % on Scale 2 scores 1. **ACVPU** — new-onset Confusion,
Voice, Pain, and Unresponsive all score 3; only **Alert** scores 0. Any patient
receiving supplemental oxygen scores 2 for the air-or-oxygen item.

### Aggregate risk bands, monitoring and escalation

| Aggregate NEWS2 | Clinical risk | Minimum monitoring | Response |
| --- | --- | --- | --- |
| 0 | Low | Minimum 12-hourly | Continue routine NEWS2 monitoring |
| 1–4 | Low | Minimum 4–6 hourly | Registered nurse assesses; decides whether to increase frequency and/or escalate |
| **3 in any single parameter** (red score) | Low–medium | Minimum 1-hourly | Urgent review by a ward-based clinician to decide whether escalation of care is needed |
| 5–6 | Medium | Minimum 1-hourly | Urgent review by a clinician / team with competence in acute illness; consider higher-dependency care |
| ≥ 7 | High | Continuous monitoring of vital signs | Emergency assessment by a team with critical-care competencies, usually including a clinician able to manage the airway; consider transfer to a higher level of care |

The **red score** (a single parameter scoring 3) escalates a patient into the
low–medium band even when the aggregate is 1–4, because an extreme derangement
in one system carries risk that the aggregate can mask.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | recording clinician name + role, date and time of observation, ward / location, SpO₂ scale in use (Scale 1 / Scale 2) with clinician endorsement for Scale 2 |
| 2 | Patient identification | NHS number, name, date of birth |
| 3 | Respiration rate | breaths per minute |
| 4 | Oxygen saturation | SpO₂ %, scored against the selected scale |
| 5 | Air or supplemental oxygen | on air / on oxygen; device, flow rate, FiO₂ if on oxygen |
| 6 | Systolic blood pressure | systolic mmHg (diastolic optional) |
| 7 | Pulse | beats per minute |
| 8 | Consciousness (ACVPU) | Alert / new Confusion / Voice / Pain / Unresponsive |
| 9 | Temperature | °C |
| 10 | Review & sign-off | computed per-parameter subscores, aggregate total, red-score flag, risk band, monitoring frequency, escalation recommendation, notes, clinician signature |

## Safety flags

Computed independently of the aggregate band. Priority: high / medium / low.

- **red-score** — any single parameter scores 3 (high).
- **aggregate-high** — aggregate ≥ 7 (high); emergency critical-care assessment.
- **aggregate-medium** — aggregate 5–6 (medium); urgent clinical review.
- **new-confusion** — new-onset confusion / altered consciousness on ACVPU (high);
  consider sepsis, hypoxia, and other acute causes.
- **hypoxia** — SpO₂ below the target range for the selected scale (high).
- **hypotension** — systolic BP ≤ 90 mmHg (high).
- **on-oxygen** — patient receiving supplemental oxygen (medium); saturations must
  be interpreted against the prescribed target.
- **out-of-scope** — patient age < 16, pregnancy, or spinal-cord injury; NEWS2 is
  not validated (high).

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** (Observation resources + derived NEWS2 score) exportable for
  integration with hospital EHR.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Clinical references

- Royal College of Physicians. *National Early Warning Score (NEWS) 2:
  Standardising the assessment of acute-illness severity in the NHS. Updated
  report of a working party.* London: RCP, 2017.
  <https://www.rcp.ac.uk/improving-care/resources/national-early-warning-score-news-2/>
- NHS England. *National Early Warning Score (NEWS)* — adoption across acute and
  ambulance trusts.
- Royal College of Physicians. *NEWS2 chart and scoring system* (2017).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives monitoring frequency and escalation of
  care.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form national-early-warning-score-2
```
