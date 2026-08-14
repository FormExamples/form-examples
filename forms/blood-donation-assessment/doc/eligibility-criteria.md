# Eligibility criteria

The blood-donation-assessment form implements the **JPAC Donor Selection
Guidelines (DSG)**, the UK's combined whole-blood and component-donor
selection rules maintained by the Joint United Kingdom Blood Transfusion
and Tissue Transplantation Services Professional Advisory Committee
(JPAC). The DSG is used operationally by NHS Blood and Transplant (NHSBT)
in England, the Scottish National Blood Transfusion Service (SNBTS), the
Welsh Blood Service, and the Northern Ireland Blood Transfusion Service.

Canonical reference: *Whole Blood and Components Donor Selection
Guidelines* — JPAC. The DSG is hosted at the Transfusion Guidelines
portal: <https://www.transfusionguidelines.org/dsg>

## Three-level eligibility decision

| Decision | Definition |
| -------- | ---------- |
| Eligible | No deferral criteria triggered; donor may proceed today |
| Temporarily Deferred | Time-limited deferral with a defined return date |
| Permanently Deferred | Lifelong deferral, no return date |

## Donor demographic limits

The form's demographic checks apply the DSG age and physical-criterion
rules:

- Minimum age: 17 years (16 with Gillick-equivalent assessment in some
  programmes — local rule applies)
- Upper age: no formal upper limit; rules vary for first-time donors
- Minimum weight: 50 kg (110 lb)
- Minimum haemoglobin: 125 g/L for females, 135 g/L for males (whole-blood)
- Blood pressure: systolic 90–180 mmHg, diastolic 50–100 mmHg
- Pulse: 50–100 beats/min and regular (DSG ranges)

## Selected deferral categories (illustrative, not exhaustive)

The following list highlights commonly used deferrals to show the form's
coverage. The DSG remains the canonical source for definitive criteria.

### Permanent deferrals

- History of transmissible disease: HIV, HTLV-I/II, chronic hepatitis B or
  C, syphilis (current)
- Receipt of human pituitary-derived hormones (CJD risk)
- Receipt of dura mater or corneal graft (CJD risk)
- Diagnosis of Creutzfeldt-Jakob disease or related TSE in patient or
  blood relative
- Receipt of a blood transfusion in the UK since 1980 (currently under
  policy review; consult the DSG)
- Some malignancies (haematological, others per DSG)
- Insulin-treated diabetes treated with bovine insulin in the past
- Intravenous drug use (current or past)
- Some occupational exposures (specific high-risk roles)

### Temporary deferrals

- Recent illness: 14 days symptom-free
- Recent dental work: time-bound deferral per DSG
- Recent travel to malaria-endemic areas: 6 months or per DSG schedule
- Travel to areas with West Nile Virus risk: per DSG schedule (typically
  28 days)
- Travel to areas with chikungunya, dengue, Zika, or other vector-borne
  risk: per DSG schedule
- Recent vaccinations: variable, see DSG vaccine matrix
- Recent surgery, endoscopy with biopsy, body-piercing or tattoo: per DSG
- Pregnancy: deferred during pregnancy and for a defined postpartum
  period
- Recent sexual contact with higher-risk partner: DSG-specified deferral

## Recent eligibility changes

The UK introduced an **individualized risk assessment for sexual behaviours
(IRA)** in June 2021, replacing categorical deferrals based on sex of
partner. The IRA is applied at the donor session per the current DSG:

- Joint statement on IRA implementation:
  <https://www.nhsbt.nhs.uk/news/landmark-changes-to-blood-donation-criteria-come-into-effect/>

The form embeds the IRA question set as published in the DSG.

## Geographic risk

The form applies the DSG geographic risk matrix for malaria, West Nile
Virus, vCJD/BSE, Chagas disease, HTLV-I, and other regional infections.
The matrix is updated quarterly; the form must be revalidated against the
most recent DSG version.

## Output

- Eligibility decision (Eligible / Temporarily Deferred / Permanently
  Deferred)
- For temporary deferrals: defined return date
- Reason codes referencing the DSG section
- Flagged-issues list for clinician sign-off
- Structured PDF donor record

## Notes

- The DSG is the canonical operational document. Where this form's wording
  differs from the DSG, the DSG takes precedence.
- The form is operationally a screening instrument; a session clinician
  reviews any flagged-issue case before donation proceeds.
- The form does not perform donor-typing, infectious-disease testing, or
  component-quality decisions.
