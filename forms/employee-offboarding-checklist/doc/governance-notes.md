# Governance notes — offboarding checklist implementation

## Regulatory classification

The Employee Offboarding Checklist is an HR information system. It is
**not** a medical device.

## Data-protection grounds

| Processing | Lawful basis |
| --- | --- |
| Final pay administration | UK GDPR Art. 6(1)(b) — contract |
| Statutory payroll and pension records | UK GDPR Art. 6(1)(c) — legal obligation |
| Settlement agreement | UK GDPR Art. 6(1)(b) — contract; UK GDPR Art. 9(2)(b) where health data is referenced |
| Exit interview aggregation | UK GDPR Art. 6(1)(f) — legitimate interests; anonymized |
| Reference administration | UK GDPR Art. 6(1)(f) — legitimate interests (giver) and Art. 6(1)(c) for FCA-regulated firms |

References:

- UK GDPR. <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Employment practices guidance.
  <https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment-information/>

## Retention

HR records retention follows the organization's published schedule.
Typical UK practice:

- **Payroll records**: 6 years after end of tax year (HMRC).
- **Working-time / holiday records**: 2 years (Working Time
  Regulations 1998 reg. 9).
- **Right-to-work evidence**: duration of employment plus 2 years
  (Home Office).
- **Pension records**: 6 years (Pensions Regulator guidance) and
  longer where benefits remain payable.
- **Disciplinary records**: typically 6 months to 5 years depending on
  the ACAS Code recommendation and severity.

## Access revocation integrity

Access revocation is the most security-sensitive step. The
implementation:

- Maintains a target system list per leaver.
- Records both **request** and **confirmation** of revocation per
  system.
- Flags any system not confirmed revoked within 24 hours of last
  working day.
- Integrates with the IT joiner-mover-leaver (JML) workflow (out of
  scope for this form, but the contract is defined).

## Audit and assurance

- Append-only audit log.
- Soft delete only; timestamps on every table.
- Annual reconciliation between HR leaver records and IT access
  revocation log.

## Equality and accessibility

- Reasonable adjustments continue for the duration of the offboarding
  process under the Equality Act 2010, ss.20-22.
- The web UI conforms to WCAG 2.2 AA.
  <https://www.w3.org/TR/WCAG22/>

## Out of scope

- Final pay calculation (payroll system).
- Pension scheme administration.
- Legal drafting of settlement agreements (legal team / outside
  counsel).
- Litigation support (separate disclosure process under CPR Part 31).
