# Safety case notes

Safety considerations for the SCORE2-Diabetes risk calculator.

## Intended purpose

To estimate 10-year risk of fatal and non-fatal CVD in adults aged 40–69
with type 2 diabetes and without prior CVD using the SCORE2-Diabetes
algorithm (Hageman 2023), recalibrated to the ESC European risk regions.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software providing information used for
treatment decisions (statin intensity, SGLT2i/GLP-1RA initiation) is
**Class IIa**.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| Wrong region recalibration (e.g. high-risk patient computed against low-risk table) | Region picker mandatory at step 1; default region configurable; PDF report names the region |
| Coefficients diverge from Hageman 2023 | Implementation references supplemental tables; unit tests against published worked examples |
| Use in patient < 40 or ≥ 70 y | Age check at step 1; explicit warning and suggestion to use SCORE2 (< 40 management is rare) or SCORE2-OP (70–89 y) |
| Use in type 1 diabetes | Diabetes-type field at step 2; switching to T1D shows "Use Steno T1 Risk Engine instead" |
| Prior CVD missed → spurious primary-prevention recommendation | Step 3 mandatory CVD-history items; affirmative answer reroutes to secondary-prevention pathway |
| Target-organ damage missed | Step 9 mandatory; eGFR < 45 / albuminuria triggers automatic very-high-risk classification per ESC 2023 |
| HbA1c units (mmol/mol vs %) confused | Input control accepts both; on-screen conversion; SCORE2-Diabetes coefficients use mmol/mol |
| Non-HDL miscomputed (total − HDL) | Engine derives non-HDL server-side; lipid input collects total + HDL separately |

## Equation provenance

SCORE2-Diabetes was derived by Hageman et al. (Eur Heart J 2023) on >
229,000 individuals with type 2 diabetes pooled across four European
cohorts (UK Biobank, Scottish Care Information – Diabetes Collaboration,
CPRD, Emerging Risk Factors Collaboration), with external validation on >
217,000 participants in eight further cohorts. The model is endorsed by
the 2023 ESC Diabetes/CVD Guidelines (DOI 10.1093/eurheartj/ehad192).

## Limitations communicated to operator

- Validated only for type 2 diabetes; T1D should use Steno T1 RE.
- Validated only for ages 40–69; SCORE2-OP covers 70–89.
- European recalibration only; for the US use ADA *Standards of Care
  2025* with PREVENT or PCE.
- The model does not include obesity (BMI), family history of CVD, or
  inflammatory markers. These may add information but are not part of the
  validated equation.

## Out of scope

- Patients with established CVD — automatic very-high-risk classification.
- Type 1 diabetes — use Steno T1 RE.
- Gestational diabetes.
- Acute glycaemic emergencies (DKA, HHS).

## Post-market surveillance

UK operators report performance issues via MHRA Yellow Card:
<https://yellowcard.mhra.gov.uk/>.

## References

- Hageman SHJ et al. *SCORE2-Diabetes.* Eur Heart J 2023;44(28):2544-2556.
  DOI: 10.1093/eurheartj/ehad260.
- 2023 ESC Diabetes/CVD Guidelines.
  DOI: 10.1093/eurheartj/ehad192.
- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
