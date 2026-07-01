# Edinburgh Postnatal Depression Scale (EPDS)

A 10-item self-report screening questionnaire for **perinatal depression** —
covering both the **antenatal** (during pregnancy) and **postnatal** (after
birth) periods. The person completing it rates how they have felt **in the past
seven days** across ten statements. Each item scores **0–3**, giving a total of
**0–30**. A higher total indicates a greater likelihood of depression. A total
of **≥ 10** suggests possible depression and **≥ 13** is a more specific
threshold for likely depressive illness; either prompts **further clinical
assessment**, not a diagnosis. Separately, **any positive response to item 10**
(thoughts of self-harm) is a mandatory safety flag that requires **immediate
risk assessment regardless of the total score**.

The EPDS was developed by Cox, Holden and Sagovsky (*British Journal of
Psychiatry* 1987) as a brief, acceptable screen for postnatal depression that
avoids somatic items (such as tiredness or changes in appetite) that overlap
with normal experiences of pregnancy and new parenthood. It has since been
validated for antenatal use and is one of the most widely used perinatal
mental-health screens internationally.

## Scope and intended users

- **Setting:** antenatal (maternity) and postnatal community and hospital
  services, health-visiting contacts, general practice, and specialist
  perinatal mental-health services.
- **Users:** midwives, health visitors, general practitioners, obstetricians,
  perinatal mental-health nurses and practitioners, and other clinicians who
  administer and interpret the screen. The questionnaire itself is
  **self-completed** by the pregnant or postnatal person.
- **Respondents:** pregnant people and people in the postnatal period (typically
  screened at booking, later in pregnancy, and at defined postnatal contacts).
- **Not for:** diagnosing depression, measuring severity for treatment decisions
  on its own, or replacing clinical judgement, a diagnostic interview, or a
  suicide-risk assessment. A total below the threshold does **not** exclude
  depression, and item 10 must always be reviewed regardless of the total.

## Scoring system

**Primary instrument:** EPDS — ten items, each with four ordered response
options scored **0, 1, 2 or 3**. The response wording differs per item; the
score reflects increasing symptom burden, not the printed order of the options.

**Reverse-scored items.** For seven items the response options are printed in
descending order, so they are **reverse-scored** (top option = 3, bottom = 0):
items **3, 5, 6, 7, 8, 9 and 10**. The remaining items (**1, 2 and 4**) are
scored in normal order (top option = 0, bottom = 3).

| # | Item (past 7 days) | Scoring |
| --- | --- | --- |
| 1 | I have been able to laugh and see the funny side of things | normal (0–3) |
| 2 | I have looked forward with enjoyment to things | normal (0–3) |
| 3 | I have blamed myself unnecessarily when things went wrong | reverse (3–0) |
| 4 | I have been anxious or worried for no good reason | normal (0–3) |
| 5 | I have felt scared or panicky for no very good reason | reverse (3–0) |
| 6 | Things have been getting on top of me | reverse (3–0) |
| 7 | I have been so unhappy that I have had difficulty sleeping | reverse (3–0) |
| 8 | I have felt sad or miserable | reverse (3–0) |
| 9 | I have been so unhappy that I have been crying | reverse (3–0) |
| 10 | The thought of harming myself has occurred to me | reverse (3–0) |

**Total.** Sum of all ten item scores, range **0–30**.

**Interpretation.**

| Total score | Band | Recommended action |
| --- | --- | --- |
| 0–9 | Lower likelihood | Depression less likely. Continue routine care and re-screen at the next scheduled contact; a low score does not exclude depression, and clinical concern overrides the number. |
| 10–12 | Possible depression | Positive screen at the sensitive threshold. Arrange further assessment / clinical review and repeat the EPDS in 2–4 weeks or refer per local pathway. |
| 13–30 | Likely depression | Positive screen at the specific threshold. Likely depressive illness — arrange assessment by an appropriately qualified clinician and refer per local perinatal mental-health pathway. |

**Item-10 safety rule (overrides the total).** If item 10 (*"The thought of
harming myself has occurred to me"*) scores **greater than 0** — i.e. any
response other than *"Never"* — this is a **mandatory red flag** requiring an
**immediate suicide / self-harm risk assessment and appropriate safeguarding
action**, irrespective of the total score or the band above.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | administering clinician name and role, care setting, date and time, perinatal stage (antenatal / postnatal), gestational or postnatal week |
| 2 | Respondent identification | respondent identifier, age band, preferred language, whether help was needed to complete |
| 3 | Items 1–4 | enjoyment / laughter (1), looking forward (2), self-blame (3), anxiety (4) — each 0–3 |
| 4 | Items 5–9 | panic (5), feeling overwhelmed (6), sleep difficulty (7), sadness (8), crying (9) — each 0–3 |
| 5 | Item 10 (self-harm) | thoughts of self-harm (10) — 0–3; any score > 0 triggers the safety flag |
| 6 | Summary and score | computed total 0–30, band, item-10 safety flag, flagged issues, recommended action, free-text clinical note |

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

- Cox J.L., Holden J.M., Sagovsky R. Detection of postnatal depression:
  development of the 10-item Edinburgh Postnatal Depression Scale.
  *British Journal of Psychiatry* 1987; 150:782–786.
- Cox J.L., Chapman G., Murray D., Jones P. Validation of the EPDS in
  non-postnatal women. *Journal of Affective Disorders* 1996; 39:185–189.
- NICE CG192. *Antenatal and postnatal mental health: clinical management and
  service guidance* (2014, updated 2020).
- Royal College of Psychiatrists / Royal College of Obstetricians and
  Gynaecologists — perinatal mental-health guidance.

## Verify

```sh
bin/test-form edinburgh-postnatal-depression-scale
```
