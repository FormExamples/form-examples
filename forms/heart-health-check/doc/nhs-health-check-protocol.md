# NHS Health Check protocol

The NHS Health Check is a free systematic vascular risk-assessment programme
in England, offered to people aged 40–74 without a pre-existing
cardiovascular condition once every five years. The programme is
commissioned by local authorities under Section 7A of the NHS Act 2006 and
delivered through general practice and community providers.

## Programme reference materials

- *NHS Health Check Programme: Best Practice Guidance.* Public Health
  England / Office for Health Improvement and Disparities.
  <https://www.gov.uk/government/publications/nhs-health-check-implementation-review-and-action-plan>
- NHS Health Check programme overview.
  <https://www.healthcheck.nhs.uk/>
- Programme guidance index (.gov.uk).
  <https://www.gov.uk/government/collections/nhs-health-check-detailed-information>

## Eligibility

- Age 40–74 years.
- Not on a pre-existing register for any of: CHD, chronic kidney disease,
  diabetes, hypertension, atrial fibrillation, transient ischaemic attack,
  hypercholesterolaemia (familial), heart failure, peripheral arterial
  disease, stroke.
- Not prescribed a statin or antihypertensive.

## Core measurements

The programme specifies a minimum dataset which this form captures:

1. Age, sex, ethnicity, family history of premature CHD.
2. Smoking status.
3. Alcohol use (AUDIT-C in many implementations).
4. Physical activity (GPPAQ in many implementations).
5. Body Mass Index (height, weight).
6. Blood pressure (sitting, after 5 minutes' rest; repeat if elevated).
7. Cholesterol (total cholesterol, HDL-C).
8. (Where indicated) Random or fasting blood glucose / HbA1c.

## Risk calculation

The programme requires that a validated 10-year CVD risk score be calculated
and discussed. In England the recommended tool is **QRISK** (currently
QRISK3, per NICE CG181) for adults aged 25–84 years without prior CVD and
without familial hypercholesterolaemia.

This form implements a *simplified QRISK3-style* point system suitable for
demonstration and prototype use. It is **not** the QRISK3 algorithm and
must not be used for clinical decision-making in place of the validated
QRISK3 calculator hosted at <https://qrisk.org/>.

## QRISK3 inputs

The published QRISK3 model (Hippisley-Cox 2017, BMJ) includes:

- Age, sex, ethnicity (16-category).
- Townsend deprivation score (UK postcode-derived).
- Smoking status (5-level).
- Diabetes (none / type 1 / type 2).
- Family history of CHD < 60 y in first-degree relative.
- Chronic kidney disease stage 3, 4, or 5.
- Atrial fibrillation.
- Treated hypertension.
- Migraine, rheumatoid arthritis, systemic lupus erythematosus, severe
  mental illness, atypical antipsychotic use, regular corticosteroid use.
- BMI, systolic blood pressure mean and standard deviation, total
  cholesterol / HDL-C ratio.
- Erectile dysfunction (men only).

Reference: Hippisley-Cox J, Coupland C, Brindle P. *Development and
validation of QRISK3 risk prediction algorithms to estimate future risk of
cardiovascular disease.* BMJ 2017;357:j2099. DOI: 10.1136/bmj.j2099.
Open-source implementation: <https://qrisk.org/src.php>.

## Risk bands and management

NICE CG181 recommendations (England):

- **10-year QRISK3 < 10 %** — lifestyle advice; reassess in 5 years.
- **10-year QRISK3 ≥ 10 %** — offer atorvastatin 20 mg for primary
  prevention after shared decision-making (CG181 §1.3).
- **10-year QRISK3 ≥ 20 %** — strong recommendation for statin and
  intensified risk-factor management.

Patients with eGFR < 60 mL/min/1.73 m², type 1 diabetes, or familial
hypercholesterolaemia are managed under disease-specific guidelines.

## Heart age

The NHS Heart Age tool (<https://www.nhs.uk/health-assessment-tools/calculate-your-heart-age>)
expresses risk as the age at which an "average" person matches the patient's
modelled risk. The form computes a heart-age estimate using the same
simplified model as the risk percentage. It is a communication device, not a
clinical metric.
