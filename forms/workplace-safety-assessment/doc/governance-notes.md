# Governance notes — workplace safety assessment

## Regulatory classification

The Workplace Safety Assessment is a health and safety management
record. It supports the employer's statutory duty under HSWA 1974 and
the Management of Health and Safety at Work Regulations 1999, but it
is **not** a medical device.

## Recordkeeping duty

- Employers with **five or more employees** must record the
  significant findings of risk assessments (SI 1999/3242 reg. 3(6)).
- The Working Time Regulations 1998 and DSE Regulations 1992 also
  carry record-keeping requirements.
- RIDDOR records must be retained for at least three years from the
  date the record was made (SI 2013/1471 reg. 12).
  <https://www.legislation.gov.uk/uksi/2013/1471/contents>

The implementation enforces append-only retention with `created_at`,
`updated_at`, `deleted_at` and soft delete.

## Data protection

| Processing | Lawful basis |
| --- | --- |
| Employee accident / injury data | UK GDPR Art. 6(1)(c) — legal obligation (RIDDOR); Art. 9(2)(h) — provision of health or social care |
| Risk-assessment of persons (e.g. pregnant workers) | UK GDPR Art. 9(2)(b) — employment law |
| Contractor and visitor records | UK GDPR Art. 6(1)(c) — HSWA 1974 |

References:

- UK GDPR. <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Employment practices and data protection.
  <https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/employment-information/>

## Equality Act 2010 alignment

Risk assessments must consider the needs of workers with protected
characteristics, in particular:

- Disability (Equality Act 2010 ss.20-22) — reasonable adjustments.
- Pregnancy and maternity (Equality Act 2010 s.18) — specific
  assessment under SI 1999/3242 reg. 16.

## Worker consultation

Two statutory consultation regimes apply:

- **Safety Representatives and Safety Committees Regulations 1977**
  (SI 1977/500) — for workplaces with a recognized trade union.
- **Health and Safety (Consultation with Employees) Regulations 1996**
  (SI 1996/1513) — for workplaces without recognized union
  representation.

The implementation records consultation events as linked Meeting
records.

## Audit and assurance

- Append-only audit log of every assessment create / edit / review /
  close.
- Linked incident register with RIDDOR-reportability flag and F2508
  reference.
- Annual review window enforced.
- Soft delete only.

## Enforcement context

- HSE enforcement notices: improvement notice (HSWA s.21), prohibition
  notice (HSWA s.22).
- Fee for Intervention (FFI) recovers HSE costs from duty-holders in
  material breach.
- Sentencing Council Definitive Guideline (2016) governs sanctions.

## Out of scope

- Occupational health surveillance results (separate clinical system).
- Workers' compensation claim handling (insurer system).
- Plant operating logs (asset management system).

## References

- HSWA 1974. <https://www.legislation.gov.uk/ukpga/1974/37/contents>
- Management of Health and Safety at Work Regulations 1999
  (SI 1999/3242).
  <https://www.legislation.gov.uk/uksi/1999/3242/contents>
- RIDDOR 2013 (SI 2013/1471).
  <https://www.legislation.gov.uk/uksi/2013/1471/contents>
- Equality Act 2010 (c. 15).
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- HSE — HSG65 *Managing for health and safety*.
  <https://www.hse.gov.uk/pubns/books/hsg65.htm>
