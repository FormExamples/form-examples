# Apgar Score

A rapid, structured assessment of a newborn's condition in the first minutes
after birth. It records five clinical signs — **Appearance** (skin colour),
**Pulse** (heart rate), **Grimace** (reflex irritability), **Activity** (muscle
tone), and **Respiration** — each scored **0, 1, or 2**, summed to a total of
**0–10** at each timepoint. The assessment is repeated at **1 minute** and
**5 minutes** after birth, and again at **10 minutes** (and, where indicated,
at subsequent 5-minute intervals) whenever the 5-minute score is below 7. The
score summarises the newborn's transition to extrauterine life and the response
to any resuscitation given; it is a description of condition and trend, not a
prediction of long-term outcome.

The score was devised by Dr Virginia Apgar in 1952. The signs are commonly
remembered by the backronym **APGAR** — **A**ppearance, **P**ulse, **G**rimace,
**A**ctivity, **R**espiration. A high score is reassuring; a low or falling
score prompts stimulation, support, or active resuscitation and continued
scoring until the newborn stabilises.

## Scope and intended users

- **Setting:** delivery room, obstetric theatre, birth centre, home birth, and
  the neonatal unit — any setting where a birth is attended.
- **Users:** midwives, obstetricians, neonatal and paediatric teams, neonatal
  nurses, and other clinicians present at delivery.
- **Patients:** newborn infants, assessed from the moment of birth.
- **Not for:** predicting individual neurological outcome, diagnosing the cause
  of depression at birth, guiding resuscitation timing (resuscitation follows
  the newborn-life-support algorithm and must not wait for the 1-minute score),
  or as a substitute for cord-blood gas analysis or clinical judgement.

## Scoring system

**Primary instrument:** the Apgar score — five signs, each scored 0, 1, or 2.
Total score 0–10 at each timepoint.

| Sign | 0 points | 1 point | 2 points |
| --- | --- | --- | --- |
| **A**ppearance (skin colour) | Blue or pale all over | Body pink, extremities blue (acrocyanosis) | Completely pink |
| **P**ulse (heart rate) | Absent | < 100 beats per minute | ≥ 100 beats per minute |
| **G**rimace (reflex irritability) | No response to stimulation | Grimace or feeble cry when stimulated | Cry, cough, sneeze, or pulls away |
| **A**ctivity (muscle tone) | Limp / floppy | Some flexion of limbs | Active movement |
| **R**espiration | Absent | Slow, irregular, or weak cry | Strong, regular cry |

**Interpretation.** The same bands apply at every timepoint.

| Total score | Band | Recommended action |
| --- | --- | --- |
| 7–10 | Reassuring (normal) | Routine care and observation; the newborn has adapted well. |
| 4–6 | Moderately low | Provide support and stimulation (drying, warmth, airway positioning, tactile stimulation, oxygen as indicated); reassess. |
| 0–3 | Low | Newborn is severely depressed; commence active resuscitation per newborn-life-support algorithm and obtain senior/neonatal support immediately. |

**Timepoints.** The score is recorded at **1 minute** and **5 minutes** after
birth. If the **5-minute** score is **below 7**, scoring is repeated every 5
minutes (at **10 minutes**, and further as needed) until the newborn stabilises
or is transferred. The trend across timepoints — improving, static, or falling —
is as important as any single value.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each timepoint
records all five signs.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Birth context | attending clinician name and role, date and time of birth, care setting, gestational age, mode of delivery |
| 2 | Newborn identification | newborn identifier, sex, birth order (for multiples) |
| 3 | 1-minute assessment | Appearance, Pulse, Grimace, Activity, Respiration (each 0–2) → total |
| 4 | 5-minute assessment | Appearance, Pulse, Grimace, Activity, Respiration (each 0–2) → total |
| 5 | 10-minute assessment (conditional) | recorded when the 5-minute total < 7; same five signs |
| 6 | Resuscitation and summary | resuscitation measures given, computed totals per timepoint, bands, trend, flagged issues, free-text clinical note |

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
  documentation and scoring tool; the output records condition and prompts
  clinical response rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Apgar V. A proposal for a new method of evaluation of the newborn infant.
  *Curr Res Anesth Analg* 1953; 32(4):260–267.
- American Academy of Pediatrics & American College of Obstetricians and
  Gynecologists. *The Apgar Score* (Committee Opinion, reaffirmed).
- Resuscitation Council UK. *Newborn Life Support* guidelines.
- NICE NG235. *Intrapartum care* (2023).

## Verify

```sh
bin/test-form apgar-score
```
</content>
