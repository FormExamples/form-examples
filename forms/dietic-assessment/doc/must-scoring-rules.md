# MUST scoring rules

The Malnutrition Universal Screening Tool (MUST) is published by BAPEN. It is a
five-step tool; steps 1–3 produce the numeric score this form computes, and
steps 4–5 map the score to a management pathway.

MUST total = BMI score + unplanned-weight-loss score + acute-disease-effect
score, range 0–6.

## Step 1 — BMI score

| Rule ID | Predicate | Score | Category |
| --- | --- | --- | --- |
| `R-MUST-BMI-0` | `bmi > 20.0` | 0 | anthropometry |
| `R-MUST-BMI-1` | `18.5 <= bmi <= 20.0` | 1 | anthropometry |
| `R-MUST-BMI-2` | `bmi < 18.5` | 2 | anthropometry |

BMI is computed as `weight_as_kg / (height_as_cm / 100)²` and rounded to one
decimal place before banding. Obesity (`bmi > 30`) scores 0 for MUST: MUST
screens for malnutrition risk, not for obesity. Obesity is surfaced separately
in the report and does not suppress the weight-loss component — an obese
patient losing weight unintentionally still scores on step 2.

### MUAC fallback

When height or weight is unavailable — including when the patient declines to
be weighed — the BMI component is estimated from mid-upper-arm circumference
per the BAPEN *'MUST' Explanatory Booklet*:

| Rule ID | Predicate | Implied BMI | Score |
| --- | --- | --- | --- |
| `R-MUST-MUAC-2` | `muac_cm < 20.0` | likely < 18.5 | 2 |
| `R-MUST-MUAC-1` | `20.0 <= muac_cm < 23.5` | likely < 20.0 | 1 |
| `R-MUST-MUAC-0` | `muac_cm > 32.0` | likely > 30.0 | 0 |
| `R-MUST-MUAC-0B` | `23.5 <= muac_cm <= 32.0` | likely > 20.0 | 0 |

Any MUAC-derived result sets `estimated = true` on the grading output, and the
rendered report states that the score is an estimate.

### Oedema and ascites

Where oedema or ascites is recorded on the nutrition-focused physical
examination, the dietitian enters a weight adjustment in kilograms. The engine
subtracts the adjustment before computing BMI and records the adjustment amount
in the fired-rule audit trail (`R-MUST-BMI-ADJ`), so the report shows both the
measured and the adjusted weight.

### Amputation

Where an amputation is recorded, weight is interpreted against the recorded
residual-limb adjustment; the engine records `R-MUST-BMI-AMP` and marks the
result estimated rather than silently scoring an unadjusted BMI.

## Step 2 — Unplanned weight loss score

Percentage weight loss is computed over the last **3–6 months**:

```
pct = (usual_weight_kg - current_weight_kg) / usual_weight_kg * 100
```

| Rule ID | Predicate | Score | Category |
| --- | --- | --- | --- |
| `R-MUST-WL-0` | `pct < 5` | 0 | weight history |
| `R-MUST-WL-1` | `5 <= pct <= 10` | 1 | weight history |
| `R-MUST-WL-2` | `pct > 10` | 2 | weight history |

Only **unplanned** loss counts. Where the patient reports intentional weight
loss (a supervised programme, bariatric follow-up), the loss is recorded but
scored 0, and `R-MUST-WL-PLANNED` is added to the audit trail so the reason is
visible in the report.

When no usual weight is available, the score falls back to the subjective
criteria in the MUST booklet: clothes or jewellery become loose, or the
patient reports a history of decreased intake with reduced appetite; the
resulting score is marked estimated.

## Step 3 — Acute disease effect score

| Rule ID | Predicate | Score | Category |
| --- | --- | --- | --- |
| `R-MUST-ACUTE-2` | `acutely_ill = yes` **and** `no_intake_over_5_days = yes` | 2 | acute illness |

Both conditions must hold. This component applies almost exclusively to
inpatients; in an outpatient clinic it is normally 0.

## Steps 4–5 — Risk category and management

| MUST total | Risk | Management (BAPEN) |
| --- | --- | --- |
| 0 | Low | Routine clinical care. Repeat screening: weekly in hospital, monthly in a care home, annually in the community for at-risk groups. |
| 1 | Medium | Observe. Document dietary intake for three days; if adequate, little concern and repeat screening; if inadequate, set goals and follow local policy. |
| ≥ 2 | High | Treat. Refer to the dietitian or nutrition support team, improve and increase overall nutritional intake, monitor and review the care plan. |

## Composite risk contribution

The MUST risk category maps into the composite nutrition risk as follows,
before the max-grade rule combines it with the other instruments:

| MUST risk | Composite contribution |
| --- | --- |
| low | `low` |
| medium | `moderate` |
| high | `high` |

A composite of `critical` is never reached by MUST alone; it requires a GLIM
severe diagnosis, a refeeding-syndrome high risk, an unsafe swallow, BMI < 16,
or weight loss > 15 %.

## Attribution

MUST is a BAPEN tool, free for non-commercial use with attribution. Reproduce
the tool unaltered and cite *The 'MUST' Explanatory Booklet*. See
<https://www.bapen.org.uk/screening-and-must/must/introducing-must/>.
