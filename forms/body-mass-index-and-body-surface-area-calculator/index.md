# Body Mass Index and Body Surface Area Calculator

An anthropometric calculator that converts a patient's **height** and **weight**
into two derived measurements used throughout clinical practice:

- **Body Mass Index (BMI)** — weight relative to height, banded into the World
  Health Organization (WHO) weight-status categories to screen for underweight,
  overweight, and obesity.
- **Body Surface Area (BSA)** — the total surface area of the body in square
  metres, used to normalize physiological parameters and, most importantly, to
  calculate weight-and-size-appropriate drug doses (notably cytotoxic
  chemotherapy).

The calculator takes two inputs (height and weight), applies the validated BMI
and BSA formulae, and produces the numeric results together with the BMI
category and a set of flagged issues (for example obesity class III,
underweight, or physiologically extreme values that warrant re-measurement). It
is a **formula calculator with classification**, not a diagnostic instrument: a
BMI category is a screening prompt, not a diagnosis of malnutrition or obesity.

## Scope and intended users

- **Setting:** any clinical or administrative setting where height and weight
  are recorded — primary care, outpatient clinics, inpatient wards, oncology and
  chemotherapy day units, anaesthetics and pre-operative assessment, paediatrics
  (with age-appropriate caveats), dietetics, and nursing.
- **Users:** all clinicians and clinical support staff — doctors, nurses,
  pharmacists, dietitians, healthcare assistants — as well as anyone computing a
  BSA-normalized drug dose.
- **Patients:** primarily adults. The BMI category thresholds below are the WHO
  adult thresholds; paediatric BMI must be interpreted against age-and-sex
  centile charts, not the fixed adult bands.
- **Not for:** diagnosis of malnutrition or obesity in isolation,
  body-composition assessment (BMI does not distinguish muscle from fat), or
  paediatric weight-status classification against the adult bands. BMI and BSA
  are screening and dosing aids that support — never replace — clinical
  judgement.

## Calculation and classification

### Body Mass Index (BMI)

BMI is weight in kilograms divided by the square of height in metres:

```
BMI (kg/m²) = weight (kg) / height (m)²
```

Height is normally captured in centimetres and converted to metres
(`height_m = height_cm / 100`) before squaring.

**WHO adult BMI categories.**

| BMI (kg/m²) | WHO category |
| --- | --- |
| < 18.5 | Underweight |
| 18.5 – 24.9 | Normal (healthy) weight |
| 25.0 – 29.9 | Overweight (pre-obesity) |
| 30.0 – 34.9 | Obese class I |
| 35.0 – 39.9 | Obese class II |
| ≥ 40.0 | Obese class III |

**Lower Asian thresholds.** For people of South-Asian, Chinese, and other Asian
ancestry the WHO expert consultation identifies additional public-health action
points at **BMI ≥ 23** (increased risk) and **BMI ≥ 27.5** (high risk), because
cardiometabolic risk rises at a lower BMI than in European-ancestry populations.
The calculator records an ethnicity-aware flag when these lower thresholds are
crossed; the primary category always uses the standard WHO bands.

### Body Surface Area (BSA)

BSA is reported in square metres. The default engine uses the **Mosteller**
formula, which is simple, well validated, and the most widely used at the
bedside:

```
BSA (m²) = √( (height (cm) × weight (kg)) / 3600 )
```

The **Du Bois and Du Bois** formula is provided as an alternative and is the
historical reference standard for BSA:

```
BSA (m²) = 0.007184 × height (cm)^0.725 × weight (kg)^0.425
```

**Use.** BSA normalizes cardiac index, glomerular filtration rate, and — most
significantly — cytotoxic and other drug dosing. Many chemotherapy regimens are
prescribed in mg/m², so an accurate BSA is directly dose-determining; the
calculator therefore flags extreme heights or weights that could produce a
mis-dose if entered in error.

## Assessment steps

Completed in order on a single continuous single-page wizard. The calculator is
deliberately short: two measured inputs plus context.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | recording clinician name and role, date and time, care setting, purpose (screening / drug dosing / monitoring) |
| 2 | Patient identification | patient identifier, age band, sex, ancestry (for the Asian-threshold flag) |
| 3 | Height | measured height (cm) |
| 4 | Weight | measured weight (kg) |
| 5 | Summary and results | computed BMI and WHO category, BSA (Mosteller; Du Bois shown for comparison), fired thresholds, flagged issues, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The calculation engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — an
  anthropometric calculator that informs screening and drug dosing; the output
  supports clinical decisions rather than determining treatment autonomously.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- World Health Organization. *Obesity: preventing and managing the global
  epidemic.* WHO Technical Report Series 894 (2000).
- WHO Expert Consultation. Appropriate body-mass index for Asian populations and
  its implications for policy and intervention strategies. *Lancet* 2004;
  363(9403):157–163.
- Mosteller R.D. Simplified calculation of body-surface area. *N Engl J Med*
  1987; 317(17):1098.
- Du Bois D., Du Bois E.F. A formula to estimate the approximate surface area if
  height and weight be known. *Arch Intern Med* 1916; 17:863–871.
- NICE CG189. *Obesity: identification, assessment and management* (2014,
  updated 2023).

## Verify

```sh
bin/test-form body-mass-index-and-body-surface-area-calculator
```
