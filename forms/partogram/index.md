# Partogram (Partograph)

A graphical record of the progress of labour. The partogram plots a **timed
series of observations** — cervical dilatation, descent of the fetal head,
uterine contractions, fetal heart rate, amniotic fluid (liquor) and moulding,
maternal vital signs, urine, and drugs / oxytocin — against elapsed time in
active labour. Cervical dilatation is charted against two reference lines: an
**alert line** (expected progress of about 1 cm per hour from the start of the
active phase at 4 cm) and an **action line** drawn four hours to the right of
it. The engine **computes a labour-progress classification and raises flags**;
it does not produce a validated numeric score.

The partogram was popularised by Philpott and Castle (1972) and adopted by the
World Health Organization. Its modern successor is the **WHO Labour Care Guide**
(2020), which replaces the fixed alert / action lines with individualised
reference ranges ("alert" thresholds) for each observation. This form models the
classic alert-line / action-line partogram while treating the WHO Labour Care
Guide as the reference standard for thresholds and intended use.

## Scope and intended users

- **Setting:** labour ward, birth centre, maternity unit triage, and any setting
  where the first and second stages of labour are monitored over time.
- **Users:** midwives, obstetricians, and labour-ward nurses recording serial
  intrapartum observations.
- **Patients:** people in established (active) labour, typically from 4 cm
  cervical dilatation onward.
- **Not for:** definitive diagnosis of obstructed labour or fetal compromise
  (which require clinical assessment and, where indicated, cardiotocography),
  antenatal risk scoring, or as a substitute for clinical judgement. A partogram
  supports decision-making; it does not replace it.

## Data captured (timed observation series)

The core of the form is a **series of timed observation rows**, each stamped with
the time elapsed since the start of the active phase (or a wall-clock time). A
single labour record therefore holds one header (patient and admission context)
plus many observation entries. Each entry may record any of:

| Group | Fields |
| --- | --- |
| Progress | cervical dilatation (0–10 cm); descent of head (fifths palpable above the pelvic brim, 5→0) |
| Contractions | frequency (number per 10 minutes); duration band (< 20 s / 20–40 s / > 40 s); strength |
| Fetal | fetal heart rate (beats per minute) |
| Liquor | amniotic fluid state (membranes intact / clear / meconium-stained / blood-stained / absent); moulding (0 / + / ++ / +++) |
| Maternal vitals | systolic and diastolic blood pressure (mmHg); pulse (beats per minute); temperature (°C) |
| Urine | volume (mL); protein; ketones / acetone; glucose |
| Drugs | oxytocin infusion rate (drops per minute or mU/min); other drugs and intravenous fluids |

### Progress and flag model

The engine derives, for the **latest** cervical-dilatation observation, the time
elapsed since the active phase began at 4 cm and compares the plotted dilatation
with the two reference lines:

- **Alert line** — expected dilatation at elapsed time *t* hours is `4 + t`
  (1 cm/hour), reaching 10 cm at *t* = 6 h.
- **Action line** — parallel to the alert line but shifted **four hours to the
  right**: expected dilatation is `4 + (t − 4)` = `t`.

A plotted point lies "to the right of" a line when the actual dilatation is
**less** than that line's expected dilatation for the elapsed time.

| Progress classification | Condition | Meaning |
| --- | --- | --- |
| **Normal** | dilatation ≥ `4 + t` | On or left of the alert line — satisfactory progress |
| **Alert-line crossed** | `t < dilatation < 4 + t` | Right of the alert line, left of the action line — slow progress; review, reassess, consider amniotomy and transfer if in a peripheral unit |
| **Action-line crossed** | dilatation ≤ `t` | On or right of the action line — obstetric review required; consider augmentation or operative delivery |

**Threshold flags** (raised independently of the progress classification, from
any observation in the series):

| Flag | Trigger | Priority |
| --- | --- | --- |
| Action line crossed | latest dilatation on / right of the action line | high |
| Fetal heart rate abnormal | FHR < 110 or > 160 bpm | high |
| Meconium-stained liquor | liquor state = meconium-stained | high |
| Maternal fever | temperature ≥ 37.5 °C | high |
| Maternal hypertension | systolic ≥ 140 or diastolic ≥ 90 mmHg | high |
| Alert line crossed | latest dilatation between the alert and action lines | medium |
| Poor progress / prolonged labour | no increase in dilatation across ≥ 4 h of active labour | medium |
| Maternal tachycardia | pulse ≥ 120 bpm | medium |
| Maternal hypotension | systolic < 90 mmHg | medium |
| Ketonuria | urine ketones present | low |
| Proteinuria | urine protein present | low |
| Incomplete observation | a plotted row missing dilatation or time | low |

## Assessment steps

Completed on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Labour context | recording clinician name and role, care setting, date and time active phase began |
| 2 | Patient identification | patient identifier, age band, parity, gestation (weeks) |
| 3 | Admission findings | membranes status on admission, risk factors, planned care |
| 4 | Observation series | repeatable timed rows: dilatation, descent, contractions, FHR, liquor, moulding, BP, pulse, temperature, urine, drugs / oxytocin |
| 5 | Summary and progress | computed progress classification, fired reference lines, flagged issues, escalation recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The progress / flag engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support tool; the output classifies progress and prompts review
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- World Health Organization. *WHO Labour Care Guide: user's manual.* Geneva: WHO,
  2020.
- World Health Organization. *WHO recommendations: intrapartum care for a
  positive childbirth experience.* 2018.
- Philpott R.H., Castle W.M. Cervicographs in the management of labour in
  primigravidae. *J Obstet Gynaecol Br Commonw* 1972; 79:592–598.
- Lavender T. *et al.* Effect of partograph use on outcomes for women in
  spontaneous labour at term. *Cochrane Database Syst Rev* 2018.
- NICE NG235. *Intrapartum care* (2023).

## Verify

```sh
bin/test-form partogram
```
