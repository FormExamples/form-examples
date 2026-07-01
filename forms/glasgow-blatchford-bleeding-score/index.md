# Glasgow-Blatchford Bleeding Score (GBS)

A pre-endoscopy risk-stratification score for adults presenting with suspected
**acute upper gastrointestinal bleeding**. It combines eight weighted
parameters — blood urea, haemoglobin, systolic blood pressure, pulse, melaena,
syncope, hepatic disease, and cardiac failure — into a single total of
**0–23**. The score predicts the likelihood that a patient will need a clinical
intervention (blood transfusion, endoscopic therapy, interventional radiology,
or surgery) or die. Crucially, a score of **0** (some services use **≤ 1**)
identifies very-low-risk patients who may be considered for outpatient
management or early discharge without inpatient endoscopy; higher scores
prompt admission and endoscopy.

The score was derived by Blatchford, Murray and Blatchford (*Lancet* 2000) using
only clinical and laboratory data available at first assessment, so it can be
calculated before any endoscopy is performed. NICE guideline CG141 recommends
using the Glasgow-Blatchford score at **first assessment** of acute upper GI
bleeding, and calculating a full Rockall score **after** endoscopy.

## Scope and intended users

- **Setting:** emergency department, acute medical unit, gastroenterology and
  general medical wards — any first point of contact for suspected acute upper
  gastrointestinal bleeding.
- **Users:** doctors, nurses, and advanced practitioners performing the initial
  assessment of a patient with haematemesis, coffee-ground vomiting, melaena, or
  suspected upper GI bleeding.
- **Patients:** adults (≥ 16 years) presenting with suspected acute upper
  gastrointestinal bleeding.
- **Not for:** lower gastrointestinal bleeding, paediatric patients, or as a
  substitute for clinical judgement. The GBS supports the decision to admit or
  discharge and the timing of endoscopy; it does not replace resuscitation of
  the actively bleeding or shocked patient, and a low score does not override
  clinical concern. Post-endoscopy risk is assessed with the full Rockall score.

## Scoring system

**Primary instrument:** Glasgow-Blatchford Bleeding Score — eight weighted
admission parameters summed to a total of **0–23**. Each parameter contributes
0 points at its normal band and an increasing number of points as the value
becomes more abnormal.

| # | Parameter | Band | Points |
| --- | --- | --- | --- |
| 1 | **Blood urea** (mmol/L) | < 6.5 | 0 |
| | | 6.5 – 7.9 | 2 |
| | | 8.0 – 9.9 | 3 |
| | | 10.0 – 24.9 | 4 |
| | | ≥ 25.0 | 6 |
| 2 | **Haemoglobin — men** (g/L) | ≥ 130 | 0 |
| | | 120 – 129 | 1 |
| | | 100 – 119 | 3 |
| | | < 100 | 6 |
| 3 | **Haemoglobin — women** (g/L) | ≥ 120 | 0 |
| | | 100 – 119 | 1 |
| | | < 100 | 6 |
| 4 | **Systolic blood pressure** (mmHg) | ≥ 110 | 0 |
| | | 100 – 109 | 1 |
| | | 90 – 99 | 2 |
| | | < 90 | 3 |
| 5 | **Pulse** (beats/min) | ≥ 100 | 1 |
| 6 | **Melaena** | present | 1 |
| 7 | **Syncope** | present | 2 |
| 8 | **Hepatic disease** | present | 2 |
| 9 | **Cardiac failure** | present | 2 |

Haemoglobin is scored on **sex-specific** bands (men and women share the two
lowest bands; women have no 120–129 band). Parameters 5–9 are single-point or
fixed-point markers that add only when present. The maximum total is
`6 + 6 + 3 + 1 + 1 + 2 + 2 + 2 = 23`.

**Interpretation.**

| Total score | Risk band | Recommended action |
| --- | --- | --- |
| 0 (or ≤ 1 by local policy) | Very low risk | Consider outpatient management / early discharge with planned outpatient review; inpatient endoscopy may be deferred. Verify no other admission indication. |
| 1 – 5 | Low–moderate risk | Admit for observation and inpatient upper GI endoscopy; monitor for deterioration. |
| ≥ 6 | High risk | Admit; high likelihood of needing intervention or transfusion. Arrange urgent upper GI endoscopy (within 24 h, or immediately after resuscitation for unstable patients) and active resuscitation. |

The evidence-based discharge threshold is a score of **0** (Blatchford 2000;
NICE CG141); some services extend the very-low-risk category to **≤ 1** where
supported by local pathways. Increasing scores correlate with an increasing
need for intervention and with mortality.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
data available at **first assessment**, before endoscopy.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, presenting complaint |
| 2 | Patient identification | patient identifier, age band, sex (drives haemoglobin bands) |
| 3 | Laboratory markers | blood urea (mmol/L) → parameter 1; haemoglobin (g/L) → parameter 2/3 |
| 4 | Haemodynamics | systolic blood pressure (mmHg) → parameter 4; pulse (beats/min) → parameter 5 |
| 5 | Clinical markers | melaena, syncope, hepatic disease, cardiac failure → parameters 6–9 |
| 6 | Summary and score | computed GBS total, risk band, per-parameter points, red-flag issues, disposition recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support risk-stratification tool; the output supports admission /
  discharge and endoscopy-timing decisions rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Blatchford O., Murray W.R., Blatchford M. A risk score to predict need for
  treatment for upper-gastrointestinal haemorrhage. *Lancet* 2000;
  356(9238):1318–1321.
- NICE CG141. *Acute upper gastrointestinal bleeding in over 16s: management*
  (2012, updated).
- Stanley A.J. *et al.* Comparison of risk scoring systems for patients
  presenting with upper gastrointestinal bleeding. *BMJ* 2017; 356:i6432.
- Rockall T.A. *et al.* Risk assessment after acute upper gastrointestinal
  haemorrhage. *Gut* 1996; 38(3):316–321.

## Verify

```sh
bin/test-form glasgow-blatchford-bleeding-score
```
