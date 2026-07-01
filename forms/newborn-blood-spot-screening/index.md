# Newborn Blood Spot Screening

A record of the newborn blood spot (heel-prick) screening test offered to every
baby in the UK, normally taken around **day 5** of life (counting the day of
birth as day 0). A few drops of blood are collected onto a filter-paper card and
screened for **nine conditions**: **sickle cell disease (SCD)**, **cystic
fibrosis (CF)**, **congenital hypothyroidism (CHT)**, and six **inherited
metabolic diseases (IMDs)** — **phenylketonuria (PKU)**, **medium-chain
acyl-CoA dehydrogenase deficiency (MCADD)**, **maple syrup urine disease
(MSUD)**, **isovaleric acidaemia (IVA)**, **glutaric aciduria type 1 (GA1)**,
and **homocystinuria (pyridoxine unresponsive) (HCU)**.

This is a **documentation and result-classification** form. It captures the
sample event (date, baby's age at sample, sample adequacy and quality),
eligibility and consent, and the per-condition result. A classification engine
records each condition's result class, derives the overall screening outcome and
referral status, validates completeness and sample quality / timing, and raises
flags — most importantly, any **suspected** result triggers an **urgent
referral** to the relevant specialist service.

The form supports the NHS Newborn Blood Spot (NBS) Screening Programme, whose
aim is to identify affected babies early so that treatment can begin before
irreversible harm occurs.

## Scope and intended users

- **Setting:** community midwifery, health-visiting and neonatal services who
  take the sample; newborn screening laboratories who report results; and the
  specialist referral centres (haemoglobinopathy / haematology, cystic fibrosis,
  paediatric endocrinology, inherited metabolic disease) who receive positive
  screens.
- **Users:** midwives and other sample-takers recording the heel-prick event;
  screening laboratory and child-health-record-department staff recording
  results and outcomes; specialist teams reviewing referrals.
- **Subjects:** newborn babies, normally screened at day 5 (acceptable day 5 to
  day 8); older babies up to one year may be screened for some conditions on
  movement into the UK or if not previously screened.
- **Not for:** diagnosis. A positive (**suspected**) screen is not a diagnosis;
  it identifies a baby who needs urgent diagnostic assessment. A negative
  (**not-suspected**) screen reduces but does not eliminate the chance of a
  condition. The form does not replace clinical or laboratory judgement.

## Conditions and result-classification model

**The nine screened conditions.**

| # | Condition | Code | Category | Suspected result refers to |
| --- | --- | --- | --- | --- |
| 1 | Sickle cell disease | `scd` | Haemoglobinopathy | Haemoglobinopathy / haematology service |
| 2 | Cystic fibrosis | `cf` | Respiratory / exocrine | Cystic fibrosis centre |
| 3 | Congenital hypothyroidism | `cht` | Endocrine | Paediatric endocrinology |
| 4 | Phenylketonuria | `pku` | Inherited metabolic disease | Inherited metabolic disease centre |
| 5 | Medium-chain acyl-CoA dehydrogenase deficiency | `mcadd` | Inherited metabolic disease | Inherited metabolic disease centre |
| 6 | Maple syrup urine disease | `msud` | Inherited metabolic disease | Inherited metabolic disease centre |
| 7 | Isovaleric acidaemia | `iva` | Inherited metabolic disease | Inherited metabolic disease centre |
| 8 | Glutaric aciduria type 1 | `ga1` | Inherited metabolic disease | Inherited metabolic disease centre |
| 9 | Homocystinuria (pyridoxine unresponsive) | `hcu` | Inherited metabolic disease | Inherited metabolic disease centre |

**Per-condition result classes.** Each condition is recorded with exactly one
result class:

| Result class | Meaning | Applies to |
| --- | --- | --- |
| `not-suspected` | Condition **not suspected** — screen negative. | all 9 |
| `suspected` | Condition **suspected** — screen positive; urgent referral required. | all 9 |
| `carrier` | Baby is a **genetic carrier** (e.g. sickle cell / other haemoglobin variant); not affected, but a family result to communicate. | SCD only |
| `repeat-required` | Result inconclusive or borderline; a **repeat sample** is needed to complete screening. | all 9 |
| `declined` | Screening for this condition was **declined** by the person with parental responsibility. | all 9 |
| `pending` | Result **not yet available** (sample in the laboratory). | all 9 |

The `carrier` class is meaningful only for sickle cell / haemoglobinopathy
screening; for all other conditions a carrier state is not a reportable screen
result and the class is invalid.

**Overall screening outcome.** Derived from the nine per-condition results:

| Overall outcome | Condition when | Referral status |
| --- | --- | --- |
| `all-not-suspected` | every screened (non-declined) condition is `not-suspected` (SCD may be `carrier`). | routine — no referral; inform parents of result. |
| `referral-required` | **any** condition is `suspected`. | **urgent referral** to each relevant specialist service. |
| `repeat-required` | no `suspected`, but **any** condition is `repeat-required`. | arrange repeat sample; screening incomplete. |
| `incomplete` | no `suspected` or `repeat-required`, but any condition is `pending`. | await outstanding results. |
| `declined-only-outstanding` | remaining conditions are `declined`; the rest are `not-suspected` / `carrier`. | document decline; no referral. |

`referral-required` takes precedence over every other outcome: a single
`suspected` condition sets the overall outcome to `referral-required` regardless
of the other eight.

**Sample-quality and timing rules.** Independent of the condition results:

- **Age at sample.** Optimal sample age is **day 5** (day of birth = day 0),
  acceptable **day 5 to day 8**. A sample taken **before day 5** or **after day
  8** is out of the optimal window and is flagged.
- **Sample adequacy.** The card must have sufficient, evenly saturated blood
  spots. An **inadequate** sample (insufficient, compressed, layered,
  contaminated, or incompletely filled circles) cannot be reliably screened and
  requires a repeat.
- **Avoidable repeat.** A repeat caused by poor sampling technique or a card
  fault (rather than a genuinely borderline result) is an **avoidable repeat**
  and is flagged for quality monitoring.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Sample-taker and setting | sample-taker name and role, care setting, date of the record |
| 2 | Baby identification | NHS number, name, date and time of birth, sex, gestation at birth |
| 3 | Eligibility and consent | previously screened, parental consent given, conditions declined (if any), reason for decline |
| 4 | Sample event | date and time of sample, computed age at sample (days), sampling site, sample-taker notes |
| 5 | Sample quality | sample adequacy, spot quality issues, whether this is a repeat and its reason |
| 6 | Condition results | per-condition result class for all nine conditions (SCD, CF, CHT, PKU, MCADD, MSUD, IVA, GA1, HCU) |
| 7 | Summary and outcome | computed overall outcome, referral status, per-service referrals, flagged issues, free-text clinical note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a
  screening-result documentation and classification tool; the output records and
  routes results rather than establishing a diagnosis.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NHS Newborn Blood Spot Screening Programme — programme handbook and standards
  (UK National Screening Committee).
- NHS *Screening tests for you and your baby* — newborn blood spot information
  for parents.
- UK National Screening Committee — recommended newborn screening conditions.

## Verify

```sh
bin/test-form newborn-blood-spot-screening
```
</content>
