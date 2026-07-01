# Modified Early Warning Score (MEWS)

A bedside aggregate **track-and-trigger** score for adult inpatients. It records
five routine physiological observations — **systolic blood pressure**, **heart
rate**, **respiratory rate**, **temperature**, and **level of consciousness
(AVPU)** — allocates each a sub-score of **0–3**, sums an aggregate of **0–14**,
and triggers escalation when the aggregate is high or any single parameter
scores the maximum. A high MEWS is not a diagnosis; it is a prompt to increase
monitoring frequency, obtain urgent medical review, and consider critical-care
outreach.

MEWS is the aggregate-weighted successor to the original Early Warning Score and
was popularised by Subbe *et al.* (*QJM* 2001) as a predictor of clinical
deterioration, intensive-care admission, and death among acute medical
admissions.

> **Note — superseded by NEWS2.** In the United Kingdom the Royal College of
> Physicians' **National Early Warning Score 2 (NEWS2)** is the recommended
> standardised track-and-trigger system; MEWS predates it and remains in use in
> some settings and internationally. Where a national standard applies, prefer
> NEWS2 — see the sibling form
> [`national-early-warning-score-2`](../national-early-warning-score-2/index.md).

## Scope and intended users

- **Setting:** general and acute adult wards, admissions and assessment units,
  and any inpatient setting that records periodic vital-sign observations.
- **Users:** nurses, healthcare assistants, doctors, and rapid-response /
  outreach teams performing or reviewing routine observations.
- **Patients:** adults (≥ 16 years).
- **Not for:** paediatric patients (use a paediatric early-warning score),
  pregnancy-specific scoring, or as a substitute for clinical judgement. A low
  MEWS does not exclude serious illness.

## Scoring system

**Primary instrument:** MEWS — five physiological parameters, each mapped from
its measured value to a sub-score of 0, 1, 2, or 3 by the allocation table
below. Sub-scores sum to an aggregate of **0–14**.

**Parameter allocation table** (Subbe *et al.* 2001):

| Parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Systolic blood pressure (mmHg) | ≤ 70 | 71–80 | 81–100 | 101–199 | — | ≥ 200 | — |
| Heart rate (bpm) | — | ≤ 40 | 41–50 | 51–100 | 101–110 | 111–129 | ≥ 130 |
| Respiratory rate (breaths/min) | — | < 9 | — | 9–14 | 15–20 | 21–29 | ≥ 30 |
| Temperature (°C) | — | < 35.0 | — | 35.0–38.4 | — | ≥ 38.5 | — |
| AVPU (level of consciousness) | — | — | — | Alert | reacting to **V**oice | reacting to **P**ain | **U**nresponsive |

Each parameter therefore contributes a sub-score in the range 0–3; the maximum
aggregate is 14 (systolic BP 3 + heart rate 3 + respiratory rate 3 + temperature
2 + AVPU 3).

**Interpretation.**

| Aggregate | Risk band | Recommended action |
| --- | --- | --- |
| 0–1 | Low | Routine observations at the standard ward frequency. |
| 2–4 | Medium | Increase observation frequency; inform the nurse in charge; consider medical review. |
| ≥ 5 | High | Urgent medical review; consider critical-care outreach and continuous monitoring. |

**Single-parameter trigger.** Any single parameter scoring **3** is itself a
trigger for urgent medical review, regardless of the aggregate — a patient can
be critically unwell on one axis while the total remains modest.

A **deteriorating trend** (a rising aggregate across successive observation sets)
is itself clinically significant and prompts escalation even when the current
aggregate has not crossed a band boundary.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective bedside observation**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of observation, care setting, ward / location |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Systolic blood pressure | measured systolic blood pressure (mmHg) → parameter 1 |
| 4 | Heart rate | measured heart rate (bpm) → parameter 2 |
| 5 | Respiratory rate | measured respiratory rate (breaths/min) → parameter 3 |
| 6 | Temperature | measured temperature (°C) → parameter 4 |
| 7 | Level of consciousness | AVPU (Alert / Voice / Pain / Unresponsive) → parameter 5 |
| 8 | Summary and score | computed sub-scores, aggregate MEWS, risk band, single-parameter and trend triggers, red-flag issues, escalation recommendation, free-text clinical note |

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
  decision-support track-and-trigger tool; the output prompts escalation and
  monitoring rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Subbe C.P. *et al.* Validation of a modified Early Warning Score in medical
  admissions. *QJM* 2001; 94(10):521–526.
- Royal College of Physicians. *National Early Warning Score (NEWS2):
  standardising the assessment of acute-illness severity in the NHS* (2017).
- NICE CG50. *Acutely ill adults in hospital: recognising and responding to
  deterioration* (2007, updated).

## Verify

```sh
bin/test-form modified-early-warning-score
```
