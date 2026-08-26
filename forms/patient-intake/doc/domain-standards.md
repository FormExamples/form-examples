# Domain standards — patient intake

## US — HIPAA / Privacy Rule

Patient demographic and clinical-history intake in the US is governed
by the HIPAA Privacy Rule and Security Rule.

- US Department of Health and Human Services. *HIPAA for
  Professionals.* <https://www.hhs.gov/hipaa/for-professionals/index.html>
- 45 CFR Parts 160 and 164 — *HIPAA Administrative Simplification:
  Standards for Privacy of Individually Identifiable Health
  Information.*
  <https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164>

## UK — UK GDPR / Data Protection Act 2018

- *Data Protection Act 2018.*
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- Information Commissioner's Office. *Health and social care
  guidance.*
  <https://ico.org.uk/for-organizations/sector-specific-guidance/health/>
- NHS England. *Records management code of practice.*
  <https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>

## Family history

- US Surgeon General. *My Family Health Portrait* — the US national
  family-history tool.
  <https://phgkb.cdc.gov/FHH/html/index.html>
- HL7 FHIR. *FamilyMemberHistory resource.*
  <http://hl7.org/fhir/familymemberhistory.html>

## Allergies and intolerances

- HL7 FHIR. *AllergyIntolerance resource.*
  <http://hl7.org/fhir/allergyintolerance.html>
- NICE CG183. *Drug allergy: diagnosis and management.*
  <https://www.nice.org.uk/guidance/cg183>
- SNOMED CT international value sets for allergens and reaction
  manifestations. <https://www.snomed.org/>

## Review of systems and presenting complaint

- HL7 FHIR. *Encounter.reasonCode* and the *Reason for Visit* value
  set bound to SNOMED CT or LOINC 8661-1.
  <https://loinc.org/8661-1/>

## Social history

- HL7 *Gravity Project* — social determinants of health value sets
  and terminology bindings for SDOH capture in FHIR.
  <https://confluence.hl7.org/spaces/GRAV/overview>
- NHS Data Dictionary. *Person Stated Gender Code* and other
  demographic data items.
  <https://www.datadictionary.nhs.uk/>

## Risk stratification

The form's *Low / Medium / High* risk level is an implementation-
specific composite — not a validated clinical risk score. It is
intended only to flag intake records that warrant additional
clinician review before the encounter.

Validated risk tools that may be referenced in the receiving clinical
record include:

- **Framingham Risk Score** (cardiovascular).
  <https://framinghamheartstudy.org/risk-functions/>
- **QRISK3** (UK cardiovascular).
  <https://qrisk.org/>
- **FRAX** (fracture risk).
  <https://www.sheffield.ac.uk/FRAX/>

## Coding for downstream interoperability

- **SNOMED CT** — clinical problems, allergies, procedures.
- **ICD-10** — diagnoses for billing and statistical reporting.
- **RxNorm** (US) / **dm+d** (UK) — medications.
  - RxNorm: <https://www.nlm.nih.gov/research/umls/rxnorm/>
  - dm+d: <https://services.nhsbsa.nhs.uk/dmd-browser/>
- **CVX** — vaccine codes (US CDC) when capturing immunization
  history. <https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp>
