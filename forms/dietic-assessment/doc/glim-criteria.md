# GLIM criteria for the diagnosis of malnutrition

The Global Leadership Initiative on Malnutrition (GLIM) consensus defines a
two-step diagnostic flow: **screen** with a validated tool (this form uses
MUST), then **assess** against the GLIM criteria. Diagnosis requires at least
one phenotypic criterion **and** at least one etiologic criterion.

Reference: Cederholm T, Jensen GL, Correia MITD, et al. *GLIM criteria for the
diagnosis of malnutrition — a consensus report from the global clinical
nutrition community.* Clinical Nutrition 2019;38(1):1–9.

## Step 1 — Screening

A positive MUST screen (score ≥ 1) triggers GLIM assessment. A MUST of 0 does
not preclude assessment where clinical suspicion is high; the form allows GLIM
criteria to be recorded regardless of the MUST score.

## Step 2 — Phenotypic criteria

At least one must be present.

| Rule ID | Criterion | Moderate malnutrition | Severe malnutrition |
| --- | --- | --- | --- |
| `R-GLIM-P-WL` | Unintentional weight loss | 5–10 % within 6 months, or 10–20 % beyond 6 months | > 10 % within 6 months, or > 20 % beyond 6 months |
| `R-GLIM-P-BMI` | Low BMI (kg/m²) | < 20 if age < 70; < 22 if age ≥ 70 | < 18.5 if age < 70; < 20 if age ≥ 70 |
| `R-GLIM-P-MM` | Reduced muscle mass | mild-to-moderate deficit by validated body-composition measure or physical examination | severe deficit |

Where body-composition measurement (DXA, BIA) is unavailable — the usual case
in an outpatient clinic — the reduced-muscle-mass criterion is satisfied by the
nutrition-focused physical examination: temporal, clavicular, or quadriceps
wasting, supported by calf circumference or hand-grip strength where recorded.
The form captures each of these as an explicit field rather than a single
subjective judgement, so the basis of the criterion is auditable.

## Step 3 — Etiologic criteria

At least one must be present.

| Rule ID | Criterion | Threshold |
| --- | --- | --- |
| `R-GLIM-E-INTAKE` | Reduced food intake or assimilation | ≤ 50 % of energy requirement for > 1 week, any reduction for > 2 weeks, or any chronic gastrointestinal condition adversely affecting assimilation or absorption |
| `R-GLIM-E-INFLAM` | Inflammation / disease burden | acute illness or injury, or a chronic disease with inflammation (for example cancer, COPD, chronic kidney disease, rheumatoid arthritis, chronic infection); supported by CRP where available |

Malabsorptive conditions captured by the form and satisfying
`R-GLIM-E-INTAKE`: coeliac disease, inflammatory bowel disease, short-bowel
syndrome, pancreatic insufficiency, bariatric surgery, and a high-output stoma
or fistula.

## Step 4 — Severity grading

Severity is set by the **phenotypic** criteria only; etiologic criteria
establish causation, not stage.

| GLIM diagnosis | Requirement |
| --- | --- |
| `none` | no phenotypic criterion, or no etiologic criterion |
| `moderate` | ≥ 1 phenotypic criterion at the moderate threshold **and** ≥ 1 etiologic criterion |
| `severe` | ≥ 1 phenotypic criterion at the severe threshold **and** ≥ 1 etiologic criterion |

Where different phenotypic criteria fall in different bands, the **worst** band
sets the severity — the max-grade rule used throughout this form.

## Composite risk contribution

| GLIM diagnosis | Composite contribution |
| --- | --- |
| `none` | no contribution |
| `moderate` | `high` |
| `severe` | `critical` |

## PES statement

GLIM produces the *problem* half of the PES (problem / etiology / signs and
symptoms) statement recorded on step 15. The etiologic criterion supplies the
*etiology*, and the phenotypic criterion plus the physical examination supply
the *signs and symptoms*. Example:

> Severe malnutrition (GLIM) **related to** reduced oral intake secondary to
> post-operative nausea and disease-related inflammation **as evidenced by**
> 14 % unintentional weight loss in four months, BMI 17.2 kg/m², and moderate
> temporal and quadriceps wasting on physical examination.
