# Safety case notes

Safety considerations for the Heart Health Check form, framed for the UK
Medical Devices Regulations 2002 and MDCG 2019-11 Rev.1 software
classification.

## Intended purpose

To estimate 10-year cardiovascular risk and a heart-age communication value
to support the NHS Health Check programme conversation about lifestyle and
medication decisions in adults aged 40–74 without established CVD.

## Intended users

NHS Health Check practitioners (healthcare assistants, practice nurses,
GPs, pharmacists) operating in a primary-care or community setting.

## Important limitation: simplified algorithm

The implementation is a **simplified QRISK3-inspired** point system suitable
for prototype and teaching use. It is **not the validated QRISK3 algorithm**
and must not be substituted for QRISK3 in production primary care. NICE
CG181 §1.2.1 specifies QRISK3 (now QRISK4 in some implementations) as the
recommended tool for adults 25–84. Production deployments should integrate
the QResearch / ClinRisk QRISK3 source code from <https://qrisk.org/src.php>
or use a validated, regulated calculator.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, the calculator is **Class IIa** in
production (drives statin / antihypertensive decisions). The simplified
demonstrator is **Class I** for educational and prototype use only,
provided the UI clearly states "Demonstration only — not for clinical
decision-making".

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| Practitioner treats simplified score as QRISK3 | UI banner identifies the simplified algorithm; result page links to <https://qrisk.org/> for the real calculator |
| Misclassified ethnicity reducing QRISK3 fidelity | Form uses 16-category ethnicity matching ONS 2021 + QRISK3 |
| Single elevated BP reading triggers over-treatment | NICE NG136 requirement for ABPM / HBPM confirmation is surfaced in step 3 helper text |
| Patient outside intended age range (<40 or >74) | Eligibility check at step 1; warning before calculation |
| Statin decision without shared decision-making | Result page advises CG181 §1.3 shared-decision conversation |
| Type 1 diabetes, CKD, FH not differentiated | Step 5 captures these; results page redirects to NG17 / CG71 pathway |
| Privacy of postcode → Townsend → deprivation | Townsend field is optional in the demonstrator; production deployment must follow UK GDPR data-minimisation |
| BMI / SBP outside model validation range | Output flags extreme values (BMI < 18.5 or > 50; SBP < 90 or > 220) |

## Safe communication

- The PDF report frames the result as a *probability over 10 years* rather
  than a certainty.
- The heart-age value is labelled as a communication device.
- The report lists the modifiable factors (smoking, BP, lipids, weight,
  alcohol, physical activity) and quantifies their relative contribution
  using the point system.

## Out of scope

- Familial hypercholesterolaemia screening (use NICE CG71 / Simon Broome
  or Dutch Lipid Clinic criteria).
- Secondary prevention in established CVD.
- Risk stratification of type 1 diabetes (use Steno T1 Risk Engine).
- Risk stratification with type 2 diabetes and the SCORE2-Diabetes age
  range (use the *systematic-coronary-risk-evaluation-2-diabetes* form).

## Post-market surveillance

Report misclassification or workflow incidents via MHRA Yellow Card:
<https://yellowcard.mhra.gov.uk/>.

## References

- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- NICE CG181. <https://www.nice.org.uk/guidance/cg181>
- NICE NG136. <https://www.nice.org.uk/guidance/ng136>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- Hippisley-Cox J et al. BMJ 2017;357:j2099. DOI: 10.1136/bmj.j2099.
