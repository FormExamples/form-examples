# Newborn and Infant Physical Examination (NIPE)

A UK national screening-programme examination that records a systematic
head-to-toe physical assessment of a baby and classifies **four key screening
components** — **eyes**, **heart**, **hips**, and **testes** (in boys) — as
**Satisfactory**, **Refer**, or **Not examined**. It is performed **within 72
hours of birth** and repeated at the **6–8 week** infant review. The form is a
structured **documentation and classification** instrument: it captures each
observation, records a result per component, and computes an overall screening
outcome together with the referral pathway and safety flags.

NIPE is one of the UK National Screening Committee's newborn screening
programmes. Its purpose is early detection of conditions of the eyes
(e.g. congenital cataract), heart (e.g. critical congenital heart disease),
hips (developmental dysplasia of the hip, DDH), and testes (undescended
testes), so that timely referral and treatment can be arranged. A satisfactory
screen is not a diagnosis of health; a *Refer* result is a prompt to escalate
along a defined pathway within a defined timeframe.

## Scope and intended users

- **Setting:** maternity ward, neonatal unit, midwife-led unit, community
  clinic, GP surgery, or home visit.
- **Users:** NIPE-trained practitioners — midwives, neonatal nurses,
  paediatricians and neonatologists, GPs and nurse practitioners performing the
  6–8 week infant review.
- **Subjects:** newborns (first examination within 72 hours of birth) and
  infants at the 6–8 week review.
- **Not for:** definitive diagnosis, gestational-age scoring, growth charting,
  or as a substitute for clinical judgement. It does not replace the newborn
  hearing or bloodspot screening programmes, which run separately.

## Screening components and results model

The examination records a full systematic head-to-toe assessment and, from it,
classifies each of the **four key screening components**. Every key component is
recorded with one of three **result classes**:

| Result class | Meaning |
| --- | --- |
| **Satisfactory** | Examined; findings within normal limits; no referral. |
| **Refer** | Examined; abnormal or uncertain finding; referral required. |
| **Not examined** | Component could not be examined (e.g. baby unsettled, unavailable); must be completed or re-attempted. |

**The four key screening components.**

| # | Component | Key observations | *Refer* triggers | Referral pathway and timeframe |
| --- | --- | --- | --- | --- |
| 1 | **Eyes** | Red reflex (both eyes), external appearance | Absent or abnormal red reflex, abnormal appearance | Urgent ophthalmology — seen within **2 weeks** (suspected congenital cataract) |
| 2 | **Heart** | Heart sounds and murmurs, femoral pulses (both), central cyanosis, pre-/post-ductal oxygen saturations | Murmur, absent or weak femoral pulses, cyanosis, low or discordant saturations | Cardiac / neonatal referral — **urgent same-day** if critical (cyanosis, absent pulses, low sats); otherwise local pathway |
| 3 | **Hips** | Barlow and Ortolani manoeuvres, hip abduction, risk factors (breech, first-degree family history of hip problems) | Positive Barlow/Ortolani, limited abduction, or risk factor present | Hip ultrasound — abnormal exam imaged **within 2 weeks**; risk-factor-only imaged **by 6 weeks** of age |
| 4 | **Testes** (boys) | Both testes descended and palpable | Uni- or bilateral undescended / not palpable | Unilateral: review at **6–8 weeks**, refer if persistent; bilateral undescended: **same-day** senior / endocrine review |

**Overall screening outcome** (computed from the four components):

| Outcome | Condition |
| --- | --- |
| **Satisfactory** | All applicable key components examined and Satisfactory. |
| **Refer** | Any key component classed Refer — one or more referral pathways triggered. |
| **Incomplete** | No component classed Refer, but one or more applicable key components Not examined — the screen must be completed. |

For a girl, the **testes** component is **not applicable** and is excluded from
the outcome.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
**objective examination findings**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Examination context | practitioner name and role, date and time, examination context (newborn-72h / infant-6-8-week), care setting |
| 2 | Baby identification | NHS number, name, date of birth, sex, gestational age, birth weight |
| 3 | Risk factors | breech presentation, first-degree family history of hip problems, antenatal concerns |
| 4 | Eyes (key component) | red reflex right and left, external appearance → eyes result |
| 5 | Heart (key component) | heart sounds / murmur, femoral pulses right and left, central cyanosis, pre-/post-ductal saturations → heart result |
| 6 | Hips (key component) | Barlow, Ortolani, hip abduction → hips result |
| 7 | Testes (key component, boys) | right and left testis position → testes result (not applicable for girls) |
| 8 | Head-to-toe systematic examination | general appearance, skin, head and fontanelles, face and palate, neck and clavicles, chest and lungs, abdomen, genitalia, anus and spine, limbs and digits, feet, tone and movement, measurements (weight, head circumference, length) |
| 9 | Summary and outcome | computed per-component results, overall outcome, referral pathways, flagged issues, free-text clinical note |

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
  decision-support documentation and screening tool; the output records findings
  and prompts referral rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Public Health England / NHS England. *Newborn and Infant Physical Examination
  (NIPE) Screening Programme Handbook* and programme standards.
- UK National Screening Committee. *NIPE programme overview and pathways.*
- NICE NG194. *Postnatal care* (2021).

## Verify

```sh
bin/test-form newborn-and-infant-physical-examination
```
</content>
