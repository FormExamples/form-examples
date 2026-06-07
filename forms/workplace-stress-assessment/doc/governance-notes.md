# Governance notes — workplace stress assessment

## Regulatory classification

The Workplace Stress Assessment supports an employer's statutory duty
under HSWA 1974 and the Management of Health and Safety at Work
Regulations 1999. It is **not** a medical device.

However, because items relate to mental health and may surface
distress, the implementation treats responses as health data and
applies the same controls as NHS-grade patient data.

## Data protection — special category

Stress-related responses are Article 9 UK GDPR special-category data.
Lawful processing depends on:

| Processing | Lawful basis |
| --- | --- |
| Aggregate Management Standards reporting | UK GDPR Art. 6(1)(c) + Art. 9(2)(b) — employment law obligation under MHSWR 1999 |
| Individual stress risk assessment | UK GDPR Art. 6(1)(c) + Art. 9(2)(h) — provision of occupational medicine |
| Reasonable adjustments record | UK GDPR Art. 6(1)(c) + Art. 9(2)(b) — Equality Act 2010 obligations |
| Sickness-absence linkage | UK GDPR Art. 6(1)(c) + Art. 9(2)(b) — employment law |

References:

- UK GDPR. <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018, Schedule 1, Part 1, paragraphs 1 and 2.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Employment practices: health and disability.
  <https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment-information/>

## Anonymity model

Indicator Tool responses are anonymous by default. Demographics are
stored separately and joined only when the resulting cohort is ≥ 10
respondents. Free-text comments are reviewed for personally
identifying content before any release.

Individual stress risk assessments are **not** anonymous; they are
clinical / occupational health records with restricted access.

## Audit and assurance

- Append-only audit log of every survey instance, cohort report, and
  individual assessment.
- Soft delete only; `created_at`, `updated_at`, `deleted_at`.
- Retention follows NHS Records Management Code of Practice for
  occupational health records.

## Safeguarding

The implementation includes safeguarding triggers:

- A respondent who indicates current suicidal ideation in any free-text
  field is presented with crisis-line information (e.g. NHS 111,
  Samaritans) and an option to speak to occupational health.
- A clear pathway to employee assistance programmes (EAP) where the
  employer operates one.
- A signposting record is captured (not the content of the disclosure)
  for audit.

## Worker representation

Solutions must be co-designed with workers. The implementation records
consultation events under:

- Health and Safety (Consultation with Employees) Regulations 1996
  (SI 1996/1513).
  <https://www.legislation.gov.uk/uksi/1996/1513/contents>
- Safety Representatives and Safety Committees Regulations 1977
  (SI 1977/500).
  <https://www.legislation.gov.uk/uksi/1977/500/contents>

## ISO alignment

- ISO 45003:2021 — Psychological health and safety at work — Guidelines
  for managing psychosocial risks. The HSE Management Standards
  approach is fully compatible with ISO 45003.
  <https://www.iso.org/standard/64283.html>

## Equality Act 2010

Stress-related illness can amount to a disability where it has a
substantial and long-term adverse effect on day-to-day activities. The
implementation supports the reasonable-adjustments duty (Equality Act
2010 ss.20-22) by capturing adjustments alongside the assessment.

## Out of scope

- Clinical treatment of stress, anxiety, or depression (NHS / private
  occupational health).
- Counselling sessions (EAP system).
- Sickness-absence triggers and case management (HR case-management
  system).
