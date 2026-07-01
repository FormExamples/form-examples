# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C)

A brief, three-item alcohol screening questionnaire for adults. It records the
three consumption items of the World Health Organization's Alcohol Use Disorders
Identification Test — **frequency of drinking**, **typical quantity** (in UK
units), and **frequency of heavy episodic drinking** — scores each **0–4**, and
sums a total of **0–12**. A total of **≥ 5** indicates increasing- or
higher-risk drinking and prompts a full 10-item AUDIT and a brief intervention.

AUDIT-C is the consumption subset (questions 1–3) of the full AUDIT developed by
Saunders *et al.* for the WHO (1993) and validated as a standalone screen by
Bush *et al.* (*Arch Intern Med* 1998). It is designed to identify hazardous
drinking and active alcohol use disorders quickly, without laboratory tests, in
routine practice. A raised score is not a diagnosis of alcohol dependence; it is
a prompt to assess further and to offer advice or referral.

## Scope and intended users

- **Setting:** primary care and general practice, emergency departments, NHS
  Health Checks and other health-promotion reviews, hospital admission clerking,
  and community or occupational health services — any setting where brief
  opportunistic alcohol screening is appropriate.
- **Users:** general practitioners, practice and hospital nurses, healthcare
  assistants, emergency and acute-medicine clinicians, health-check assessors,
  and other frontline staff.
- **Patients:** adults (≥ 16 years) able to self-report their alcohol
  consumption, whether by self-completion or clinician-administered interview.
- **Not for:** definitive diagnosis of alcohol dependence, assessment of
  withdrawal severity (use CIWA-Ar), children, or as a substitute for clinical
  judgement. A low AUDIT-C score does not exclude an alcohol problem where other
  concerns exist.

## Scoring system

**Primary instrument:** AUDIT-C — three questions, each scored on a 0–4 ordinal
scale. Total score 0–12.

| # | Question | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | How often do you have a drink containing alcohol? | Never | Monthly or less | 2–4 times a month | 2–3 times a week | 4+ times a week |
| 2 | How many units of alcohol do you drink on a typical day when you are drinking? | 1–2 | 3–4 | 5–6 | 7–9 | 10+ |
| 3 | How often have you had 6 or more units (female) / 8 or more units (male) on a single occasion in the last year? | Never | Less than monthly | Monthly | Weekly | Daily or almost daily |

A **unit** is 8 g / 10 mL of pure alcohol (UK definition). Question 1 answered
"Never" scores 0; a lifetime abstainer scores 0 overall.

**Interpretation.**

| Total score | Risk band | Recommended action |
| --- | --- | --- |
| 0–4 | Lower risk | Reinforce low-risk drinking guidance (UK Chief Medical Officers' ≤ 14 units/week, spread over 3+ days). No further action from this screen. |
| 5–7 | Increasing risk | Positive screen. Deliver brief structured advice on reducing consumption; complete the full 10-item AUDIT to characterise risk. |
| 8–10 | Higher risk | Positive screen. Brief advice plus offer of an extended brief intervention; complete the full AUDIT. |
| 11–12 | Possible dependence | Positive screen. Complete the full AUDIT; a full-AUDIT score ≥ 20 or clinical features of dependence warrant referral to specialist alcohol services. |

The threshold for a **positive screen is AUDIT-C ≥ 5**, per UK guidance (NICE
PH24; Public Health England). Some validations apply a lower, sex-specific cut
(≥ 4 for women, ≥ 5 for men) to improve sensitivity in women; the sex-specific
nuance is recorded but the default UK cut of **≥ 5 for both sexes** is used.
Escalation: a positive AUDIT-C prompts the full **10-item AUDIT**, where **≥ 8**
indicates harmful or hazardous drinking and higher bands suggest **dependence**.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one self-reported item.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, administration mode (self-completed / interview) |
| 2 | Patient identification | patient identifier, age band, sex (used for the Q3 heavy-episode threshold) |
| 3 | Frequency of drinking | Q1 response (0–4) |
| 4 | Typical quantity | Q2 response (0–4), in UK units |
| 5 | Heavy episodic drinking | Q3 response (0–4), frequency of ≥ 6 units (female) / ≥ 8 units (male) in one session |
| 6 | Summary and score | computed AUDIT-C total, risk band, fired items, red-flag issues, escalation recommendation, free-text clinical note |

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
  decision-support screening tool; the output prompts assessment and advice
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Saunders J.B. *et al.* Development of the Alcohol Use Disorders Identification
  Test (AUDIT). *Addiction* 1993; 88(6):791–804.
- Bush K. *et al.* The AUDIT Alcohol Consumption Questions (AUDIT-C). *Arch
  Intern Med* 1998; 158(16):1789–1795.
- NICE PH24. *Alcohol-use disorders: prevention* (2010).
- Public Health England. *Alcohol use screening tests* (AUDIT / AUDIT-C).
- UK Chief Medical Officers' *Low Risk Drinking Guidelines* (2016).

## Verify

```sh
bin/test-form alcohol-use-disorders-identification-test-consumption
```
