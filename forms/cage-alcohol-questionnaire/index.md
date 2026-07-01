# CAGE Alcohol Questionnaire

A brief four-item screening questionnaire for alcohol misuse and dependence in
adults. It asks four lifetime yes/no questions — remembered by the mnemonic
**CAGE** (**C**ut down, **A**nnoyed, **G**uilty, **E**ye-opener) — scores each
answer 0 or 1, sums a total of **0–4**, and flags a **clinically significant**
result when the score is **≥ 2**. A positive screen is a prompt for further
assessment of drinking, not a diagnosis of an alcohol-use disorder.

CAGE was described by Ewing (*JAMA* 1984) and derived from earlier work by Mayfield
*et al.* It is short, memorisable, and requires no equipment, which makes it well
suited to opportunistic screening in primary and general clinical care. Because
its questions concern lifetime experience and the consequences of drinking, CAGE
is more sensitive to established problem drinking and dependence than to earlier
hazardous consumption; where the goal is to detect at-risk drinking sooner, a
consumption-focused tool such as **AUDIT-C** is more sensitive. A widely used
variant, **CAGE-AID** (Adapted to Include Drugs), broadens each question to cover
alcohol and other drug use.

## Scope and intended users

- **Setting:** primary care, general practice, general medical and surgical
  clinics, emergency and acute settings, antenatal and mental-health services —
  any setting where a rapid, equipment-light alcohol screen is useful.
- **Users:** general practitioners, nurses, physicians, midwives, and other
  clinicians conducting patient intake or opportunistic screening.
- **Patients:** adults (≥ 16 years).
- **Not for:** a diagnostic assessment of alcohol dependence, quantification of
  consumption, paediatric screening, or as a substitute for clinical judgement.
  A CAGE below 2 does not exclude hazardous or harmful drinking; consider
  AUDIT-C or a full AUDIT where earlier risk detection is the goal.

## Scoring system

**Primary instrument:** CAGE — four lifetime questions, each scoring **1** point
for a "yes" answer and **0** for "no". Total score 0–4.

| # | Letter | Question (scores 1 when answered "yes") | Points |
| --- | --- | --- | --- |
| 1 | **C** — Cut down | Have you ever felt you should cut down on your drinking? | 0 or 1 |
| 2 | **A** — Annoyed | Have people annoyed you by criticising your drinking? | 0 or 1 |
| 3 | **G** — Guilty | Have you ever felt bad or guilty about your drinking? | 0 or 1 |
| 4 | **E** — Eye-opener | Have you ever had a drink first thing in the morning to steady your nerves or get rid of a hangover (an "eye-opener")? | 0 or 1 |

**Interpretation.**

| Total score | Result band | Recommended action |
| --- | --- | --- |
| 0 | Negative | No positive items. Provide brief advice as appropriate; a zero does not exclude hazardous use. |
| 1 | Low | One positive item. Warrants further inquiry into drinking patterns even though it is below the standard cut-off. |
| 2–4 | Positive | Clinically significant. Suggests problematic use or dependence: undertake a fuller assessment of consumption, dependence, and harm, and consider a brief intervention or referral. |

The threshold for a positive screen is **CAGE ≥ 2**. A "yes" to the
**eye-opener** question is a particularly strong marker of physical dependence
(morning drinking to relieve withdrawal) and warrants attention even when the
total is below 2.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | screening clinician name and role, date and time of assessment, care setting |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Cut down | criterion 1 (yes/no) |
| 4 | Annoyed | criterion 2 (yes/no) |
| 5 | Guilty | criterion 3 (yes/no) |
| 6 | Eye-opener | criterion 4 (yes/no) |
| 7 | Summary and score | computed CAGE total, result band, positive items, red-flag issues, recommendation, free-text clinical note |

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
  decision-support screening tool; the output prompts further assessment rather
  than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Ewing J.A. Detecting Alcoholism: The CAGE Questionnaire. *JAMA* 1984;
  252(14):1905–1907.
- Mayfield D., McLeod G., Hall P. The CAGE questionnaire: validation of a new
  alcoholism screening instrument. *Am J Psychiatry* 1974; 131(10):1121–1123.
- Brown R.L., Rounds L.A. Conjoint screening questionnaires for alcohol and other
  drug abuse (CAGE-AID). *Wis Med J* 1995; 94(3):135–140.
- Bush K. *et al.* The AUDIT Alcohol Consumption Questions (AUDIT-C). *Arch Intern
  Med* 1998; 158(16):1789–1795.

## Verify

```sh
bin/test-form cage-alcohol-questionnaire
```
