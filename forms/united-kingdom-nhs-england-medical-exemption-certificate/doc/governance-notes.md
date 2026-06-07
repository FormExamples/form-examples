# Governance notes — FP92A implementation

## Statutory weight

The FP92A is the statutory route to a Medical Exemption Certificate
under regulation 4 of the NHS (Charges for Drugs and Appliances)
Regulations 2015 (SI 2015/570). Mis-certification by a registered
medical practitioner is both a regulatory matter (NHS fraud) and a
professional matter (GMC fitness to practise).

## Regulatory classification of this software

Under MDCG 2019-11 Rev.1 and UK Medical Devices Regulations 2002:

- A faithful digital replica of FP92A, capturing patient details and
  practitioner certification of an SI 2015/570 Sch. 1 condition, is
  administrative software, not a medical device.
- The implementation does not diagnose, treat, or alter clinical
  pathways.

## Information governance

- **UK GDPR Article 9(2)(h)** — provision of health or social care.
- **Data Protection Act 2018**, Schedule 1, Part 1, paragraph 2.
- **NHS Records Management Code of Practice (2023)**: entitlement and
  exemption records are retained per the Code's administrative-records
  schedule.
- **NHSBSA processing notice**:
  <https://www.nhsbsa.nhs.uk/our-policies/privacy-notice>
- **NHS Data Security and Protection Toolkit**:
  <https://www.dsptoolkit.nhs.uk/>

## Anti-fraud

NHSBSA operate the **NHS Counter Fraud Authority** prescription-charge
checking service. The FP92A field set is designed to support fraud
detection:

- Practitioner authentication (GMC PIN against the public register).
- One active certificate per patient (de-duplication at submission).
- Audit trail of issuance, renewal, and revocation.
- Penalty charge under SI 1999/2794 for false claims.

NHS Counter Fraud Authority:
<https://cfa.nhs.uk/>

## Penalty framework

- NHS (Penalty Charge) Regulations 1999 (SI 1999/2794) — penalty up to
  £100 plus recovery of charges wrongly avoided.
  <https://www.legislation.gov.uk/uksi/1999/2794/contents>

## Out of scope

- Prescription dispensing logic (pharmacy systems).
- Income-based exemption (HC2 / HC3 — administered separately by NHSBSA
  Low Income Scheme).
- Welsh, Scottish, and Northern Irish prescription regimes (free at the
  point of dispense; no FP92A equivalent).

## References

- NHS Business Services Authority — Medical exemption certificates.
  <https://www.nhsbsa.nhs.uk/exemption-certificates/medical-exemption-certificates>
- NHSBSA — HC11 booklet (Help with health costs).
  <https://www.nhsbsa.nhs.uk/help-nhs-costs-hc11>
- NHS Counter Fraud Authority. <https://cfa.nhs.uk/>
