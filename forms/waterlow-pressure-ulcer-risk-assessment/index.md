# Waterlow Pressure Ulcer Risk Assessment

A bedside screening tool that estimates an adult patient's risk of developing a
pressure ulcer (pressure sore, bedsore, decubitus ulcer). It records a set of
weighted risk categories — build / weight for height (BMI), skin type and visual
risk areas, sex and age, continence, and mobility — plus four groups of special
risk factors (tissue malnutrition, neurological deficit, major surgery or trauma,
and medication), **sums** the points into a single total, and places the patient
in a risk band. A **higher total means higher risk**: the band drives escalation
of pressure-relieving support surfaces, repositioning frequency, and skin-care
review.

The instrument is the Waterlow score, devised by Judy Waterlow (1985, revised
2005). It is the most widely used pressure-ulcer risk tool in United Kingdom
nursing. Unlike the Braden Scale (used in this repository's
[integumentary assessment](../integumentary-assessment/index.md)), which is an
**inverse** scale where a *lower* total means *worse* risk, the Waterlow score is
a **summed weighted score** in which a *higher* total means *worse* risk.

## Scope and intended users

- **Setting:** acute and community hospital wards, nursing and residential care
  homes, hospices, and community nursing — any setting where an adult patient may
  be at risk of pressure damage from immobility, poor perfusion, or moisture.
- **Users:** registered nurses, healthcare assistants under supervision, and
  tissue-viability specialists performing admission and ongoing skin-risk
  assessment.
- **Patients:** adults (≥ 16 years) at possible risk of pressure ulceration.
- **Not for:** definitive diagnosis or staging of an existing pressure ulcer
  (use a validated grading category such as EPUAP/NPIAP), paediatric or neonatal
  patients (use a paediatric tool such as the Braden Q or Glamorgan scale), or as
  a substitute for clinical judgement and holistic skin inspection. A low score
  does not remove the need for regular skin checks.

## Scoring system

**Primary instrument:** the Waterlow score — a sum of weighted category points
plus special-risk-factor points. Higher total = higher risk. Each category
contributes the points of the **single** selected option; each special-risk
group contributes the points of the highest applicable option within that group.

### Core categories

**Build / weight for height (BMI).**

| Option | Points |
| --- | --- |
| Average (BMI 20–24.9) | 0 |
| Above average (BMI 25–29.9) | 1 |
| Obese (BMI ≥ 30) | 2 |
| Below average (BMI < 20) | 3 |

**Skin type / visual risk areas.**

| Option | Points |
| --- | --- |
| Healthy | 0 |
| Tissue paper (thin / fragile) | 1 |
| Dry | 1 |
| Oedematous | 1 |
| Clammy / pyrexial | 1 |
| Discoloured (category 1) | 2 |
| Broken / spot (category 2–4) | 3 |

**Sex and age.** Contributes the sex points **plus** the age-band points.

| Sex | Points | | Age band | Points |
| --- | --- | --- | --- | --- |
| Male | 1 | | 14–49 | 1 |
| Female | 2 | | 50–64 | 2 |
| | | | 65–74 | 3 |
| | | | 75–80 | 4 |
| | | | 81+ | 5 |

**Continence.**

| Option | Points |
| --- | --- |
| Complete / catheterised | 0 |
| Incontinent of urine | 1 |
| Incontinent of faeces | 2 |
| Doubly incontinent | 3 |

**Mobility.**

| Option | Points |
| --- | --- |
| Fully mobile | 0 |
| Restless / fidgety | 1 |
| Apathetic | 2 |
| Restricted | 3 |
| Bedbound (e.g. traction) | 4 |
| Chairbound (e.g. wheelchair) | 5 |

### Special risk factors

Each group contributes the points of its **highest** applicable option.

**Tissue malnutrition.**

| Option | Points |
| --- | --- |
| Terminal cachexia | 8 |
| Multiple organ failure | 8 |
| Single organ failure (cardiac, renal, respiratory) | 5 |
| Peripheral vascular disease | 5 |
| Anaemia (Hb < 8 g/dL) | 2 |
| Smoking | 1 |

**Neurological deficit** (e.g. diabetes, multiple sclerosis, stroke, motor /
sensory deficit, paraplegia): **4–6** points depending on severity.

**Major surgery or trauma.**

| Option | Points |
| --- | --- |
| Orthopaedic / spinal (below waist) | 5 |
| On table > 2 hours | 5 |
| On table > 6 hours | 8 |

**Medication** — high-dose steroids, cytotoxics, or long-term anti-inflammatory:
up to **4** points.

### Total and risk bands

The total is the sum of every category and special-risk contribution. Higher =
higher risk.

| Total | Risk band | Recommended prevention action |
| --- | --- | --- |
| < 10 | Low risk | Routine skin inspection; reassess if condition changes. |
| 10–14 | At risk | Introduce a pressure-redistributing foam mattress and cushion; document a repositioning schedule; review nutrition and continence. |
| 15–19 | High risk | Escalate to an alternating-pressure / dynamic support surface; increase repositioning frequency; refer to tissue viability; formal skin-care plan. |
| ≥ 20 | Very high risk | High-specification dynamic mattress; frequent repositioning; urgent tissue-viability review; treat reversible factors (nutrition, moisture, perfusion). |

The score is **cumulative**: reassess whenever the patient's condition, mobility,
continence, or nutrition changes, and after any procedure that adds special-risk
points.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one weighted category or special-risk group.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing nurse name and role, date and time, care setting, reason for assessment (admission / routine / change in condition) |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Build / weight for height | BMI band → build points |
| 4 | Skin type / visual risk | skin condition option; note any existing pressure damage |
| 5 | Continence | continence option |
| 6 | Mobility | mobility option |
| 7 | Tissue malnutrition | highest applicable option (cachexia, organ failure, PVD, anaemia, smoking) |
| 8 | Neurological deficit | presence and severity (4–6) |
| 9 | Major surgery or trauma | orthopaedic/spinal, time on table |
| 10 | Medication | steroids / cytotoxics / anti-inflammatory |
| 11 | Summary and score | computed Waterlow total, risk band, contributing categories, red-flag issues, prevention recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- British English throughout (oedematous, faeces, anaemia, paediatric).

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support screening tool; the output prompts preventive escalation
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Waterlow J. *Pressure sores: a risk assessment card.* Nursing Times 1985;
  81(48):49–55; revised card 2005.
- NICE CG179 and quality standard QS89. *Pressure ulcers: prevention and
  management.*
- European Pressure Ulcer Advisory Panel (EPUAP), NPIAP, PPPIA. *Prevention and
  Treatment of Pressure Ulcers/Injuries: Clinical Practice Guideline* (2019).

## Verify

```sh
bin/test-form waterlow-pressure-ulcer-risk-assessment
```
