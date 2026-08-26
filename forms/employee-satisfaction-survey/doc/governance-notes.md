# Governance notes — employee satisfaction survey

## Regulatory classification

The Employee Satisfaction Survey is an HR / engagement instrument. It
is **not** a medical device and does not collect clinical data.

Where survey items touch on mental well-being (e.g. UWES dedication
items, free-text comments about stress), responses should be treated
with the same care as health information even though they are not
formally health data.

## Data protection

| Processing | Lawful basis |
| --- | --- |
| Aggregate engagement reporting to leadership | UK GDPR Art. 6(1)(f) — legitimate interests |
| Demographic split analysis | UK GDPR Art. 6(1)(f); Art. 9(2)(b) where special-category data is collected (e.g. for equality monitoring) |
| Individual response handling | UK GDPR Art. 6(1)(a) — explicit consent at submission |

The implementation requires explicit consent at the start of the survey
and explains:

- who will see aggregates;
- the minimum cohort size for reporting;
- how long responses will be retained;
- how to withdraw consent (which becomes impossible once a response is
  fully anonymized, in which case withdrawal is a removal from future
  invitation lists only).

References:

- UK GDPR. <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Anonymization code of practice.
  <https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/anonymization/>
- ICO — Employment practices and data protection.
  <https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/employment-information/>

## Anonymization strategy

- Submission identifier is opaque and not linked to user identity at
  rest.
- Demographics are stored separately and only joined for cohort
  analytics with cohort size ≥10.
- Free text is reviewed for personally identifying content before
  release.
- The implementation does **not** support re-identification by
  leadership; the database design and access controls make it
  technically difficult.

## Licensing of scales

- **UWES**: free for non-commercial use per Wilmar Schaufeli's
  published licence terms. <https://www.wilmarschaufeli.nl/tests/>
- **Job Diagnostic Survey items**: out of copyright for the original
  Hackman/Oldham 1975 instrument; modern reprints carry the publisher's
  terms.
- **eNPS**: derived from public Reichheld 2003 article; no licence
  fee.
- **Gallup Q12**: proprietary; this implementation does not embed Q12
  item text and instead uses the alternative free scales above. Q12
  is referenced for benchmarking only.

## Equality and accessibility

- Multi-language item bundles supported.
- 7-point Likert scales with explicit anchor labels for screen reader
  accessibility.
- WCAG 2.2 AA conformance for the survey UI.

## Audit

- Append-only audit log of survey instance design, distribution events,
  reminder events, close events.
- Soft delete only at the per-response level.
- Annual review of scale validity and licensing.

## Out of scope

- Diagnostic interpretation of individual responses (these are not
  clinical scales even where they touch well-being).
- Performance management of identified individuals.
- Workforce planning decisions based on individual response data.
