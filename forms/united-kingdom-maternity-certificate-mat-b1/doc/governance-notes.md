# Governance notes — MAT B1 implementation

## Statutory weight of the certificate

The MAT B1 is statutory evidence within the meaning of regulation 22 of
the Statutory Maternity Pay (General) Regulations 1986 (SI 1986/1960).
Its issue carries a duty of accuracy on the issuing practitioner; mis-
certification could be a fitness-to-practise matter for the GMC or NMC.

## Regulatory classification of this software

Under MDCG 2019-11 Rev.1 and UK Medical Devices Regulations 2002:

- A faithful digital replica of MAT B1 that captures, stores, and
  outputs the same fields as the paper form, without diagnostic or
  treatment logic, is generally outside the medical-device definition.
- The MAT B1 is administrative evidence; it does not direct treatment.
- This implementation is therefore an information system, not a medical
  device.

## Information governance

- **UK GDPR Article 9(2)(h)** — provision of health or social care.
- **Data Protection Act 2018**, Schedule 1, Part 1, paragraph 2 (health
  and social care purposes).
- **NHS Records Management Code of Practice (2023)**: maternity records
  retained 25 years.
  <https://transform.england.nhs.uk/information-governance/guidance/records-management-code/>
- **NHS Data Security and Protection Toolkit (DSPT)** — annual self-
  assessment for any organisation handling NHS data.
  <https://www.dsptoolkit.nhs.uk/>

## Audit and assurance

- Append-only audit log of issue events, amendments, and duplicate
  reissues.
- Issuer authentication via GMC PIN or NMC PIN (validated against the
  public register where possible).
- All amendments recorded with the original value, new value, and
  amending practitioner ID.

## Anti-fraud controls

The MAT B1 underpins SMP and MA payments and is therefore a fraud
target. Controls include:

1. **Issuer authentication** — only authenticated GMC- or NMC-registered
   practitioners can issue.
2. **Single canonical per-pregnancy record** — duplicates explicitly
   flagged.
3. **No editing of EWC after submission** — amendments require a new
   superseding record with audit trail.
4. **Transport-layer integrity** — TLS 1.2+; payload signed.

## Out of scope

- Calculation of SMP or MA amounts (HMRC and DWP back-office systems).
- Maternity leave start-date scheduling (employer HR systems).
- Antenatal record management (separate NHS Maternity Information
  System).

## References

- HMRC — MAT B1 stationery and guidance.
  <https://www.gov.uk/government/publications/maternity-certificate-form-mat-b1>
- DWP — Maternity Allowance.
  <https://www.gov.uk/maternity-allowance>
- HMRC — Employer's statutory maternity pay.
  <https://www.gov.uk/employers-maternity-pay-leave>
