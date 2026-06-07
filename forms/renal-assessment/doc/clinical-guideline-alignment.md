# Clinical Guideline Alignment

The renal assessment is built around the KDIGO CKD classification and
NICE NG203, supplemented by Renal Association / UK Kidney Association
guidance and the KDIGO AKI guideline.

## KDIGO

KDIGO publishes international consensus guidelines for CKD, AKI,
dialysis, transplantation, and CKD-associated mineral and bone
disorder.

Index: https://kdigo.org/guidelines/

Guidelines referenced in this assessment:

- KDIGO 2012 CKD Guideline (and 2024 update).
- KDIGO AKI Guideline 2012.
- KDIGO Diabetes in CKD Guideline (most recent edition).
- KDIGO Blood Pressure in CKD Guideline 2021.

## NICE

| Code | Title | URL |
| --- | --- | --- |
| NG203 | Chronic kidney disease: assessment and management | https://www.nice.org.uk/guidance/ng203 |
| NG148 | Acute kidney injury: prevention, detection and management | https://www.nice.org.uk/guidance/ng148 |
| NG28 | Type 2 diabetes in adults: management | https://www.nice.org.uk/guidance/ng28 |
| NG136 | Hypertension in adults | https://www.nice.org.uk/guidance/ng136 |
| CKS | Clinical Knowledge Summaries — Renal & urological topics | https://cks.nice.org.uk/specialities/renal-and-urological |

NG203 adopts the KDIGO grid; the engine's composite risk grid maps
1-to-1 to NG203.

## UK Kidney Association (formerly the Renal Association)

UKKA clinical guidelines: https://ukkidney.org/health-professionals/guidelines

The UKKA publishes UK-specific clinical practice guidelines on
peritoneal dialysis, haemodialysis, transplantation, anaemia, mineral
and bone disorder, vascular access, and AKI.

## Drug dose-adjustment references

Step 8 prompts the clinician to review the patient's medications for
renal dose-adjustment. The engine does not auto-calculate doses;
acceptable reference sources include:

- UK Renal Pharmacy Group (UKRPG) *The Renal Drug Database*.
  https://renaldrugdatabase.com
- BNF (British National Formulary) renal-impairment monographs.
  https://bnf.nice.org.uk

## What this engine does NOT compute

- We do not compute the Kidney Failure Risk Equation (KFRE) (Tangri
  et al. 2011). The 4-variable and 8-variable KFRE could be added in a
  future iteration to support 2-year and 5-year RRT-risk projection.
- We do not compute eGFR from creatinine — the laboratory-supplied
  eGFR is recorded verbatim. If the supplied value uses a non-CKD-EPI
  equation, the report carries this provenance.
- We do not compute CKD-EPI cystatin-C or combined equations.
- We do not recommend dialysis modality or transplantation listing.

## Patient self-report caveats

The renal assessment is clinician-administered (laboratory values are
required). Patient-reported symptoms on Step 2 are explicitly labelled
as such in the printed report.
