# Ambulatory Blood Pressure Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
ambulatory blood pressure monitoring (ABPM) and home blood pressure monitoring
(HBPM). These sources anchor the four-axis interpretation grade, the ABPM stage
thresholds, the nocturnal-dipping classification, and the critical-result
alerting rules used by this form.

## Diagnostic thresholds

### NICE NG136 — Hypertension in adults: diagnosis and management

NICE NG136 makes ABPM the most accurate method for confirming a diagnosis of
hypertension. Crucially, **ambulatory and home averages use lower thresholds
than clinic blood pressure**, because out-of-office readings are systematically
lower than readings taken in a clinic.

Key thresholds relevant to this form:

- **Daytime (waking-hours) average ≥135/85 mmHg confirms hypertension** when
  the clinic blood pressure is ≥140/90 mmHg. This is **stage 1** hypertension;
  a daytime average ≥150/95 mmHg is **stage 2**. This maps to the
  `daytime_average_systolic` / `daytime_average_diastolic` fields, the
  `hypertension_confirmed` structured flag, the `reporting_category` stage
  label, and Axes A and B.
- **24-hour average ≥130/80 mmHg** indicates hypertension; maps to the
  `twenty_four_hour_average_*` fields.
- **Severe / accelerated hypertension** — a clinic BP ≥180/120 mmHg (ABPM
  average equivalent ≥150/95) with signs of retinal haemorrhage or
  papilloedema, or with life-threatening symptoms, warrants **same-day
  specialist review**. This maps to the `severe_hypertension` structured flag,
  the Axis D `critical-alert` escalation, and the `critical-result-alert` safety
  flag.
- **Measurement standard** — at least 2 measurements per hour during usual
  waking hours, using the average of at least 14 measurements; recordings below
  this standard reduce diagnostic adequacy (`valid_readings_percent`,
  `recording_adequate`, `inadequate-technique` flag).

Sources:

- Recommendations | Hypertension in adults: diagnosis and management (NG136),
  NICE. <https://www.nice.org.uk/guidance/ng136/chapter/recommendations>
- NG136 visual summary — ABPM / HBPM vs clinic BP thresholds.
  <https://www.nice.org.uk/guidance/ng136/resources/visual-summary-pdf-6899919517>
- NICE QS28 *Hypertension in adults* — quality statement 1: diagnosis with ABPM.
  <https://www.nice.org.uk/guidance/qs28>

## Measurement and reporting guidance

### British and Irish Hypertension Society (BIHS)

The BIHS publishes ABPM measurement and reporting guidance and maintains the
validated blood pressure monitor lists. Its guidance underpins the recording
adequacy fields and the structured averages reported by this form.

- BIHS — ABPM guidance and validated monitor lists.
  <https://bihsoc.org/>

## Nocturnal dipping and nocturnal hypertension

### European Society of Hypertension (ESH)

The ESH classifies the nocturnal dipping pattern by the percentage fall in
average systolic pressure from daytime to nighttime: **dippers (>10–20 %),
non-dippers (>0–10 %), reverse dippers (≤0 %, a nighttime rise), and extreme
dippers (>20 %)**. Non-dipping and reverse dipping are associated with greater
target-organ damage (left ventricular hypertrophy, stroke, proteinuria), with
risk higher in reverse dippers than non-dippers. **Nocturnal hypertension**
(nighttime average ≥120/70 mmHg) is itself an independent risk marker.

This maps to the `nocturnal_dip_percent`, `dipper_status`,
`nighttime_average_*`, and `nocturnal_hypertension` fields, and to Axis B
severity and the abnormal-requiring-action / urgent-referral flags.

- Association of Extreme Nocturnal Dipping With Cardiovascular Events,
  *Hypertension* (ESH dipping thresholds).
  <https://www.ahajournals.org/doi/10.1161/HYPERTENSIONAHA.119.14085>
- Controversies in Hypertension III: Dipping, Nocturnal Hypertension, and the
  Morning Surge.
  <https://www.sciencedirect.com/science/article/abs/pii/S0002934323001602>

## White-coat and masked hypertension

ABPM/HBPM averages contrasted with the clinic blood pressure distinguish
**white-coat hypertension** (raised clinic BP but normal ambulatory averages)
from **masked hypertension** (normal clinic BP but raised ambulatory averages).
These map to the `white_coat_effect` and `masked_hypertension` structured flags
and to the `discrepancy-with-request` flag where the result contradicts the
referral's clinic reading.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| NICE NG136 ABPM daytime ≥135/85 | `daytime_average_*`, `hypertension_confirmed`, Axes A/B |
| NICE NG136 stage banding (≥135/85 stage 1, ≥150/95 stage 2) | `reporting_category` (Axis B) |
| NICE NG136 24-hour ≥130/80 | `twenty_four_hour_average_*` |
| NICE NG136 severe / same-day review (clinic ≥180/120, ABPM ≥150/95) | `severe_hypertension`, Axis D `critical-alert`, `critical-result-alert` flag |
| NICE NG136 measurement standard | `valid_readings_percent`, `recording_adequate`, `inadequate-technique` flag |
| ESH nocturnal dipping classification | `nocturnal_dip_percent`, `dipper_status` |
| ESH nocturnal hypertension ≥120/70 | `nighttime_average_*`, `nocturnal_hypertension` |
| White-coat / masked hypertension | `white_coat_effect`, `masked_hypertension`, `discrepancy-with-request` flag |
