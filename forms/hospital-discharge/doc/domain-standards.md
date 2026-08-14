# Domain standards — hospital discharge

## PRSB Standards for the structure and content of health records

The UK **Professional Record Standards Body (PRSB)** publishes the
*eDischarge Summary Standard*, the canonical record-structure standard
for NHS inpatient discharge summaries. NHS Digital adopted it as the
basis for the *Transfer of Care* standardization programme; it is the
upstream source for the field set used by this form.

- PRSB *eDischarge summary standard*.
  <https://theprsb.org/standards/edischargesummary/>
- PRSB Information Standards Notice (ISN) reference (NHS England):
  *DCB1577 Transfer of Care: Inpatient Discharge*.
  <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb1577-transfer-of-care-inpatient-discharge>

PRSB defines the headings the discharge summary must carry. The most
recent published heading set is the source of truth; the broad groups
are:

- Patient demographics
- GP practice / community team
- Admission details
- Diagnoses (primary, secondary)
- Procedures
- Clinical summary
- Investigation results
- Medications and medical devices
- Allergies and adverse reactions
- Plan and requested actions (community / GP follow-up)
- Information given to patient and authorized representatives
- Person completing record

This form's 10 steps map onto these PRSB headings; the *Warning Signs
& When to Seek Help* step corresponds to the PRSB *Information given to
patient* heading.

## HL7 FHIR — discharge summary composition

- The international FHIR resource for a discharge summary is
  `Composition` with `type` coded to **LOINC 18842-5** — *Discharge
  summary*. <https://loinc.org/18842-5/>
- The *International Patient Summary* IG is not the discharge
  equivalent, but its `Composition` profile is the closest reference
  pattern for cross-border discharge exchange.
  <http://hl7.org/fhir/uv/ips/>
- Care Connect (NHS UK FHIR profiles) — Care Connect API is the
  legacy NHS R4 profile set; the current NHS standard is the **UK Core
  FHIR Implementation Guide** published by NHS England.
  <https://digital.nhs.uk/services/fhir-uk-core>

## NICE guidance

- **NICE NG27** — *Transition between inpatient hospital settings and
  community or care home settings for adults with social care needs*
  (2015, updated). The clinical authority for the discharge
  completeness and community-handover sections of this form.
  <https://www.nice.org.uk/guidance/ng27>
- **NICE NG94** — *Emergency and acute medical care in over 16s:
  service delivery and organisation* (2018) §1.7 covers transfer to
  community settings and is complementary to NG27.
  <https://www.nice.org.uk/guidance/ng94>
- **NICE QS136** — *Transition between inpatient hospital settings and
  community or care home settings for adults with social care needs*
  quality standard (2016).
  <https://www.nice.org.uk/guidance/qs136>

## Diagnosis and procedure coding

- **ICD-10** — diagnoses coded with the *International Classification
  of Diseases, 10th revision*. WHO maintains the international
  version; in the UK the *ICD-10 5th edition* is the in-use clinical
  classification.
  <https://icd.who.int/browse10/2019/en>
- **OPCS-4** — procedure coding standard for NHS Hospital Episode
  Statistics, maintained by NHS Digital / TRUD.
  <https://isd.digital.nhs.uk/trud/users/guest/filters/0/categories/10/items/119/releases>
- **SNOMED CT** — the mandated UK NHS clinical terminology since
  2020; problem and free-text findings should be coded with SNOMED CT
  where available. <https://www.snomed.org/>

## Medication reconciliation

- **NICE NG5** — *Medicines optimisation: the safe and effective use
  of medicines to enable the best possible outcomes* (2015).
  <https://www.nice.org.uk/guidance/ng5>
- **Royal Pharmaceutical Society** — *Keeping patients safe when they
  transfer between care providers — getting the medicines right*
  (2012). <https://www.rpharms.com/resources/reports/getting-the-medicines-right>
- **NHS England Electronic Prescription Service (EPS)** for discharge
  prescription transmission.
  <https://digital.nhs.uk/services/electronic-prescription-service>
