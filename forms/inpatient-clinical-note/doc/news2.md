# NEWS2 — National Early Warning Score 2

Royal College of Physicians, *National Early Warning Score (NEWS) 2:
Standardising the assessment of acute-illness severity in the NHS*, updated
report of a working party, December 2017.

See also the dedicated form
[`national-early-warning-score-2`](../../national-early-warning-score-2), which
models NEWS2 in full. This form carries the aggregate and the seven parameters
so that the acuity band can be derived without a second data entry.

## Parameters and scoring — scale 1

Scale 1 applies to all patients except those with confirmed hypercapnic
respiratory failure and a prescribed target saturation range of 88–92%.

| Parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Respiration rate (per minute) | ≤8 | | 9–11 | 12–20 | | 21–24 | ≥25 |
| SpO2 scale 1 (%) | ≤91 | 92–93 | 94–95 | ≥96 | | | |
| Air or oxygen | | oxygen | | air | | | |
| Systolic blood pressure (mmHg) | ≤90 | 91–100 | 101–110 | 111–219 | | | ≥220 |
| Pulse (per minute) | ≤40 | | 41–50 | 51–90 | 91–110 | 111–130 | ≥131 |
| Consciousness (ACVPU) | | | | Alert | | | C, V, P, or U |
| Temperature (°C) | ≤35.0 | | 35.1–36.0 | 36.1–38.0 | 38.1–39.0 | ≥39.1 | |

## Parameters and scoring — scale 2

Scale 2 applies only to patients with confirmed hypercapnic respiratory failure
whose prescribed target saturation is 88–92%. It differs from scale 1 in the
SpO2 row only:

| SpO2 scale 2 (%) | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| On air | ≤83 | 84–85 | 86–87 | 88–92 or ≥93 on air | | | |
| On oxygen | ≤83 | 84–85 | 86–87 | 88–92 | 93–94 | 95–96 | ≥97 |

Scale 2 must be prescribed by a competent clinical decision-maker and recorded
on the chart. The form records the scale in `spo2_scale`; the default is
scale 1.

## RCP escalation thresholds

| Aggregate | Risk | RCP-recommended response |
| --- | --- | --- |
| 0 | Low | Routine monitoring, minimum 12-hourly |
| 1–4 | Low | Minimum 4–6 hourly; registered nurse assesses |
| 3 in a single parameter | Low–medium | Minimum hourly; registered nurse reviews and decides whether escalation is needed |
| 5–6 | Medium | Minimum hourly; urgent review by a clinician competent in acute illness |
| ≥7 | High | Continuous monitoring; emergency assessment by a team with critical-care competencies |

## How this form uses NEWS2

The acuity engine maps the RCP thresholds onto its four bands:

| NEWS2 condition | Acuity band |
| --- | --- |
| 0–4 with no single parameter scoring 3 | `stable` |
| 5–6, or any single parameter scoring 3, or a worsening trend | `watch` |
| ≥7 | `escalate` |
| ≥9 | `critical` |

The `≥9 → critical` step is this form's addition, not an RCP band. It exists so
that the very highest scores are visually separated from the broad ≥7 group on
the dashboard, and because at that score the other `critical` drivers (organ
support, critical-care referral) are almost always present too. It never
*lowers* an escalation the RCP thresholds imply.

`news2_total` is entered directly when the ward chart already has it. When it is
absent and all seven parameters are present, the engine derives it. An entered
total always wins over a derived one, and both are reported, so a discrepancy
between the chart and the parameters is visible rather than silently resolved.

## Caveats

- NEWS2 is not validated in pregnancy, in children under 16, or in patients with
  spinal-cord injury. The form records the patient's age and a
  `news2_applicable` flag so a note can record that NEWS2 was deliberately not
  used.
- NEWS2 is a track-and-trigger tool, not a diagnostic instrument. A low score
  does not exclude serious illness, and the form's output says so.
- The score is only as good as the observation set. An incomplete observation
  set yields no derived total, and the `observations` component is then
  documented only if a total was entered directly.
