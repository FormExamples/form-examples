# Regulatory framework — Maternity Certificate (MAT B1)

The MAT B1 ("Maternity Certificate") is the form used by a registered
medical practitioner or registered midwife in the United Kingdom to
certify the expected week of confinement (EWC) of a pregnant patient.
It is the statutory evidence required by employers and the Department
for Work and Pensions (DWP) to determine entitlement to maternity pay
and maternity allowance.

## Primary statute

- **Social Security Contributions and Benefits Act 1992** (c. 4),
  Part XII (statutory maternity pay) and Part II (maternity allowance).
  <https://www.legislation.gov.uk/ukpga/1992/4/contents>
- **Statutory Maternity Pay (General) Regulations 1986** (SI 1986/1960),
  regulation 22 (medical evidence).
  <https://www.legislation.gov.uk/uksi/1986/1960/contents>
- **Social Security (Maternity Allowance) (Earnings) Regulations 2000**
  (SI 2000/688).
  <https://www.legislation.gov.uk/uksi/2000/688/contents>

## Purpose of MAT B1

The MAT B1 confirms the expected week of childbirth (or the actual date
of childbirth when issued after delivery). It is used to:

- Claim **Statutory Maternity Pay (SMP)** from the employer.
- Claim **Maternity Allowance (MA)** from DWP for those not entitled to
  SMP (self-employed, recently changed jobs, etc.).
- Support a request for **statutory maternity leave** (Employment Rights
  Act 1996, Part VIII).
- Claim **Sure Start Maternity Grant** (qualifying benefits required).

## Issuer

Only a **registered medical practitioner** (GMC register) or a
**registered midwife** (NMC register) may issue a MAT B1. It must not be
issued earlier than the start of the 20th week before the expected week
of confinement (i.e. no earlier than 20 weeks before EWC).

- GMC register: <https://www.gmc-uk.org/registration-and-licensing>
- NMC register: <https://www.nmc.org.uk/registration/search-the-register/>

## Authoritative guidance

- HMRC — **Maternity Certificate (MAT B1)** stationery and guidance.
  <https://www.gov.uk/government/publications/maternity-certificate-form-mat-b1>
- DWP — **Maternity Allowance (MA1) claim form** and notes.
  <https://www.gov.uk/maternity-allowance>
- HMRC — **Statutory Maternity Pay: employee circumstances that affect
  payment**. <https://www.gov.uk/employers-maternity-pay-leave>
- NHS Business Services Authority — overview of free prescriptions and
  related entitlements during pregnancy.
  <https://www.nhsbsa.nhs.uk/exemption-certificates>

## Form composition

The paper MAT B1 captures:

1. Patient name and (optional) NHS number.
2. Expected week of confinement (EWC), expressed as a single date or week.
3. Date of issue.
4. Practitioner's name, registration number, and address.
5. Practitioner's signature.

The digital implementation persists the same fields with the additional
identifying data (`gen_random_uuid()` primary key, `created_at` /
`updated_at` / `deleted_at` timestamps).

## Data protection

- UK GDPR Article 9(2)(h) — provision of health or social care.
- Data Protection Act 2018, Schedule 1, Part 1, paragraph 2.
- NHS Records Management Code of Practice (2023): retain maternity
  records for 25 years.
  <https://transform.england.nhs.uk/information-governance/guidance/records-management-code/>
