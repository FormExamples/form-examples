# QRISK3 equation summary

This form implements a *simplified* QRISK3-inspired point system. The real
QRISK3 algorithm is a fractional-polynomial Cox proportional-hazards model
with sex-stratified coefficients. The full source is published by the
QResearch group and ClinRisk Ltd under an open licence.

## Authoritative sources

- Hippisley-Cox J, Coupland C, Brindle P. *Development and validation of
  QRISK3 risk prediction algorithms to estimate future risk of
  cardiovascular disease in primary care: prospective cohort study.*
  BMJ 2017;357:j2099. DOI: 10.1136/bmj.j2099.
- QRISK3 algorithm web page: <https://qrisk.org/>
- QRISK3 open-source code (C and SAS): <https://qrisk.org/src.php>
- ClinRisk QRISK3 algorithm description PDF.
  <https://qrisk.org/QRISK3-2017-FullPaper.pdf>

## Model structure

Separate equations for men and women. Each follows the form:

```
risk_10y = 1 - S0(age)^exp(Σ βi · (xi − mean_xi))
```

with:

- `S0(age)` — sex- and age-specific baseline survival in the QResearch
  derivation cohort.
- `xi` — continuous and categorical predictors after fractional-polynomial
  transformation of age, BMI, SBP, and SBP standard deviation.
- `βi` — published Cox coefficients (see Hippisley-Cox 2017 Table 3).

The full coefficients are listed in the BMJ paper's Appendix and replicated
in the open-source code. They are not reproduced here to avoid drift; use
the official source directly when implementing the real model.

## Predictors used by QRISK3

| Predictor | Type | Coding |
| --- | --- | --- |
| Age | continuous | years (25–84) |
| Sex | categorical | male / female |
| Ethnicity | categorical | 16 ONS-style groups |
| Townsend score | continuous | UK postcode-derived |
| Smoking | ordinal | non / ex / light / moderate / heavy |
| Diabetes | categorical | none / type 1 / type 2 |
| Family CHD < 60 | binary | yes/no |
| CKD stage 3/4/5 | binary | yes/no |
| Atrial fibrillation | binary | yes/no |
| Treated hypertension | binary | yes/no |
| Migraine | binary | yes/no |
| Rheumatoid arthritis | binary | yes/no |
| SLE | binary | yes/no |
| Severe mental illness | binary | yes/no |
| Atypical antipsychotic | binary | yes/no |
| Regular corticosteroids | binary | yes/no |
| Erectile dysfunction (men) | binary | yes/no |
| BMI | continuous | kg/m² |
| SBP mean | continuous | mmHg |
| SBP SD | continuous | mmHg |
| TC/HDL ratio | continuous | unitless |

## What this form's simplified scoring does

The form computes a point total from the inputs above using a transparent
linear weighting (documented in AGENTS.md "Risk factor point contributions"
section) and maps the total to a 10-year risk percentage. This is
adequate for prototype demonstration and is **explicitly identified in the
UI as a teaching implementation** rather than QRISK3.

For production use, integrate the QRISK3 algorithm via
<https://qrisk.org/src.php> (C source under GNU GPL/AGPL hybrid licence —
see ClinRisk licence page) or use the validated QRISK3 web calculator.

## References

- Hippisley-Cox J, Coupland C, Brindle P. BMJ 2017;357:j2099.
  DOI: 10.1136/bmj.j2099.
- ClinRisk QRISK3 source code. <https://qrisk.org/src.php>
- NICE CG181. <https://www.nice.org.uk/guidance/cg181>
