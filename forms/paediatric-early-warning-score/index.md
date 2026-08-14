# Paediatric Early Warning Score (PEWS)

An age-banded **track-and-trigger** early-warning tool for children. It records
a set of physiological observations across three domains — **respiratory**,
**cardiovascular**, and **behaviour / neurological** — scores each parameter
**0–3** against the **normal range for the child's age band**, sums an aggregate
total, and maps that total (together with single-parameter and concern triggers)
onto an **escalation band** with a recommended review timeframe. A high score,
any single parameter scoring 3, or documented **nurse or parent/carer concern**
each prompts escalation and senior review.

PEWS is a screening and monitoring aid, **not** a diagnosis. It standardizes the
recognition of the deteriorating child so that concern is escalated early and
consistently. This design follows the concept of the UK **national Paediatric
Early Warning System (PEWS)** chart, which is **age-banded** because a heart or
respiratory rate that is normal for a neonate is dangerously abnormal for a
teenager, and vice versa. Age-banding is therefore central to every parameter
score.

## Scope and intended users

- **Setting:** paediatric inpatient wards, children's assessment units, emergency
  departments, and any acute setting caring for children and young people from
  birth up to their 18th birthday.
- **Users:** paediatric nurses, healthcare assistants recording observations,
  doctors, and rapid-response / outreach teams.
- **Patients:** children and young people, stratified into five **age bands**:
  **0–<1 month** (neonate), **1–11 months** (infant), **1–4 years**,
  **5–11 years**, and **≥ 12 years**.
- **Not for:** neonatal intensive care (use a NICU-specific tool), definitive
  diagnosis, or as a substitute for clinical judgement. A low score does not
  exclude serious illness — clinician or parent concern overrides the number.

## Scoring system

**Primary instrument:** an age-banded PEWS aggregate. Each parameter is scored
**0–3** against the **normal range for the selected age band**; the further an
observation lies from the age-band normal, the higher the score.

**Step 1 — select the age band.** The age band sets the normal ranges used for
the respiratory-rate and heart-rate parameters. It **must** be chosen first.

| Age band | Normal respiratory rate (breaths/min) | Normal heart rate (beats/min) |
| --- | --- | --- |
| 0–<1 month (neonate) | 40–60 | 110–160 |
| 1–11 months (infant) | 30–50 | 100–160 |
| 1–4 years | 20–40 | 90–140 |
| 5–11 years | 18–30 | 70–120 |
| ≥ 12 years | 12–20 | 60–100 |

Observations within the age-band normal range score **0**; increasing deviation
above or below the range scores **1**, **2**, or **3**.

**Step 2 — score each parameter 0–3.**

| Domain | Parameter | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| Respiratory | Respiratory rate | within age-band normal | mildly outside | moderately outside | grossly outside / apnoea |
| Respiratory | Respiratory effort / recession | none | mild recession | moderate recession | severe recession / grunting |
| Respiratory | Oxygen saturation (SpO₂) | ≥ 96% | 94–95% | 92–93% | < 92% |
| Respiratory | Supplemental oxygen | room air | any low-flow O₂ | — | high-flow / FiO₂ ≥ 0.5 |
| Cardiovascular | Heart rate | within age-band normal | mildly outside | moderately outside | grossly outside |
| Cardiovascular | Capillary refill / colour | < 2 s, pink | 2–3 s | 3–4 s, pale | > 4 s, mottled / cyanosed |
| Behaviour / neuro | Consciousness (ACVPU) | Alert / playing | irritable / to Voice | to Pain | Unresponsive |

**Step 3 — aggregate and map to an escalation band.**

| Aggregate total | Escalation band | Recommended action and review timeframe |
| --- | --- | --- |
| 0–1 | Routine (low) | Continue routine observations at the scheduled frequency (e.g. 4-hourly). |
| 2–3 | Low escalation | Increase observation frequency (e.g. hourly); inform the nurse in charge; clinical review within 1 hour. |
| 4–5 | Medium escalation | Urgent review by the nurse in charge and a doctor within 30 minutes; continuous monitoring; consider outreach. |
| ≥ 6 | High escalation | Immediate review by a senior doctor / registrar; consider critical-care outreach; continuous monitoring. |

**Override triggers (independent of the aggregate total).**

- **Single parameter = 3** — any one parameter scoring 3 triggers urgent review
  (at least medium escalation) regardless of the total.
- **Nurse concern** — documented concern by any member of staff is an escalation
  trigger in its own right.
- **Parent / carer concern** — documented concern by a parent or carer is an
  escalation trigger in its own right; it must be recorded and acted upon.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of observation, care setting |
| 2 | Patient identification and age band | patient identifier, date of birth or age, **age band** (drives all normal ranges), sex |
| 3 | Respiratory | respiratory rate, respiratory effort / recession, SpO₂, supplemental oxygen |
| 4 | Cardiovascular | heart rate, capillary refill time / colour |
| 5 | Behaviour / neurological | ACVPU consciousness level, any new agitation or lethargy |
| 6 | Concern | nurse / staff concern (yes/no), parent / carer concern (yes/no) |
| 7 | Summary and score | per-parameter 0–3 scores, aggregate total, escalation band, fired override triggers, flagged issues, recommended review timeframe, free-text clinical note |

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
  decision-support / track-and-trigger tool; the output prompts escalation
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NHS England & the Royal College of Paediatrics and Child Health. *National
  Paediatric Early Warning System (PEWS) chart* (2023).
- Royal College of Paediatrics and Child Health. *The National PEWS programme.*
- NICE NG51. *Sepsis: recognition, diagnosis and early management* (2016,
  updated 2024) — paediatric considerations.

## Verify

```sh
bin/test-form paediatric-early-warning-score
```
