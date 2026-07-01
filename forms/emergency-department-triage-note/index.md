# Emergency Department Triage Note

A first-contact assessment that a triage nurse completes when a patient arrives
at the emergency department (ED). It records the mode and time of arrival, the
presenting complaint, a brief relevant history, a set of triage vital signs, and
a pain score, then assigns a **triage category** that determines how soon the
patient must be seen by a clinician.

This is a **classification** form: the engine does not add up a numeric total.
Instead it selects the highest-acuity category justified by the recorded
findings, using the **Manchester Triage System (MTS)** five-level priority scale.
It also computes a supporting **NEWS2** aggregate from the vital signs and raises
red-flag issues (life threat, sepsis, time-critical presentations, incomplete
triage) that prompt immediate escalation.

The triage category is a prioritisation decision, not a diagnosis. It sets the
maximum time to first clinical assessment; it does not determine treatment.

## Scope and intended users

- **Setting:** the triage or "streaming" point of a hospital emergency
  department, urgent treatment centre, or minor-injuries unit.
- **Users:** registered ED triage nurses (and equivalent trained triage
  practitioners) performing initial assessment at first contact.
- **Patients:** all ages presenting to the ED. Paediatric red-flag
  discriminators are recognised, but paediatric-specific early-warning scoring
  (e.g. PEWS) is out of scope and must be applied separately.
- **Not for:** definitive diagnosis, disposition or treatment decisions,
  ambulance pre-alert scoring, or replacing clinician judgement. A lower category
  never overrides a clinician's decision to see a patient sooner.

## Triage system & classification model

**Primary instrument:** the Manchester Triage System (MTS) — a five-level
priority scale. Each level carries a colour, a name, and a **target time** to
first clinical assessment.

| Level | Colour | Name | Target time to be seen |
| --- | --- | --- | --- |
| 1 | Red | Immediate | 0 minutes |
| 2 | Orange | Very urgent | 10 minutes |
| 3 | Yellow | Urgent | 60 minutes |
| 4 | Green | Standard | 120 minutes |
| 5 | Blue | Non-urgent | 240 minutes |

**Discriminators.** MTS assigns a level by testing the presentation against a set
of **general discriminators** ordered from most to least urgent. The engine
selects the *highest* level (lowest number) whose discriminator is satisfied. The
general discriminators used here are grouped by the classic categories:

- **Airway** — threatened or compromised airway → Immediate (1).
- **Breathing** — inadequate breathing, very low `SpO₂`, or severe respiratory
  distress → Immediate (1) or Very urgent (2).
- **Circulation** — shock, major haemorrhage, or markedly abnormal heart rate /
  blood pressure → Immediate (1) or Very urgent (2).
- **Consciousness (disability)** — unresponsive or markedly reduced conscious
  level (low GCS, or "P"/"U" on AVPU), new seizure, focal neurology → Immediate
  (1) or Very urgent (2).
- **Temperature** — very high or very low temperature, or features of sepsis →
  Very urgent (2) or Urgent (3).
- **Pain** — severe pain (score ≥ 7/10) → Very urgent (2); moderate pain (4–6/10)
  → Urgent (3).

**NEWS2 support.** For adults, the engine also computes a **NEWS2** aggregate
from the recorded vital signs (respiratory rate, `SpO₂`, oxygen supplementation,
systolic blood pressure, pulse, consciousness, temperature). A high NEWS2
(aggregate ≥ 7, or any single parameter scoring 3) escalates the recommended
category and raises a sepsis/deterioration flag. NEWS2 supports, but does not
replace, the MTS category.

**Classification rule.** The assigned category is the most urgent of: (a) the
highest MTS discriminator satisfied, and (b) any escalation forced by a NEWS2
red flag. The target time follows directly from the assigned level.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
first-contact triage findings.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Triage context | triage nurse name, date and time of triage, care setting |
| 2 | Arrival | mode of arrival (walk-in / ambulance / other), time of arrival, referral source |
| 3 | Patient identification | patient identifier, age band, sex |
| 4 | Presenting complaint | presenting complaint, brief history, symptom onset |
| 5 | Vital signs | respiratory rate, `SpO₂`, oxygen supplementation, systolic blood pressure, pulse, temperature, consciousness (AVPU / GCS) |
| 6 | Pain score | pain score 0–10 |
| 7 | Discriminators | airway, breathing, circulation, consciousness, temperature/sepsis, and time-critical (chest pain, stroke, paediatric) discriminator flags |
| 8 | Summary and category | computed MTS level, colour, target time, supporting NEWS2, fired discriminators, red-flag issues, free-text triage note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support prioritisation tool; the output sets the maximum time to first
  assessment rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Mackway-Jones K., Marsden J., Windle J. (eds). *Emergency Triage: Manchester
  Triage Group.* 3rd ed. Wiley-Blackwell, 2014.
- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- Royal College of Emergency Medicine. *Initial Assessment of Emergency
  Department Patients* (best-practice guideline).
- NICE NG51. *Sepsis: recognition, diagnosis and early management* (2016, updated
  2024).

## Verify

```sh
bin/test-form emergency-department-triage-note
```
