# Governance notes — onboarding checklist implementation

## Regulatory classification

The Employee Onboarding Checklist is an HR information system. It does
not handle clinical, diagnostic, or treatment data and is therefore
**not** a medical device under MDR or UK MDR 2002.

## Data-protection grounds

| Processing | Lawful basis |
| --- | --- |
| Contract administration | UK GDPR Art. 6(1)(b) — contract |
| Statutory right-to-work records | UK GDPR Art. 6(1)(c) — legal obligation |
| Auto-enrolment pension | UK GDPR Art. 6(1)(c) — legal obligation |
| Equality monitoring (if collected) | UK GDPR Art. 9(2)(b) — employment law |
| Buddy / mentor pairings | UK GDPR Art. 6(1)(f) — legitimate interests |

References:

- UK GDPR — retained Regulation (EU) 2016/679.
  <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Employment practices and data protection.
  <https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/employment-information/>

## Right-to-work records retention

Home Office guidance requires the employer to retain right-to-work
evidence for the **duration of employment plus two years**. The
implementation stores only the metadata (document type, date checked,
checker identity, list A/B classification) — not document images. Image
storage, if any, is delegated to the organization's identity-document
store, which has its own retention controls.

- Home Office — Right to work checks: an employer's guide.
  <https://www.gov.uk/government/publications/right-to-work-checks-employers-guide>

## Equality and accessibility

The implementation supports the Equality Act 2010 duty to make
reasonable adjustments by:

- Allowing the new hire to declare reasonable-adjustment needs at any
  point in the process.
- Recording adjustments and the manager's response in an auditable
  trail.
- Conforming to WCAG 2.2 AA for the web user interface.

References:

- Equality Act 2010, ss.20-22.
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- WCAG 2.2 (W3C Recommendation, 5 October 2023).
  <https://www.w3.org/TR/WCAG22/>

## Audit and assurance

- Append-only audit log of every item state change.
- Timestamps on every record (`created_at`, `updated_at`, `deleted_at`).
- Soft delete only.
- Annual review of checklist content against current CIPD induction
  guidance and HSE induction guidance.

## Out of scope

- Background screening (BPSS, DBS, security clearance) — these run in
  separate vetting systems whose outputs are referenced.
- Payroll calculation.
- Workplace pension fund management.
