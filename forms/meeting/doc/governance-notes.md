# Governance notes — meeting record implementation

## Regulatory classification

The Meeting record is an organizational / governance information
system. It is **not** a medical device.

For UK companies, board and general-meeting minutes are statutory
records under the Companies Act 2006, ss.248 and 355. The
implementation supports those retention and access requirements.

## Retention

- **UK company board minutes**: minimum 10 years (CA 2006 s.248(2)).
  <https://www.legislation.gov.uk/ukpga/2006/46/section/248>
- **UK company general meeting minutes**: minimum 10 years (CA 2006
  s.355(2)).
- **Charity trustee minutes**: 6 years from the end of the financial
  year (Charities Act 2011 and Charity Commission guidance) is the
  pragmatic minimum.
- **Public sector minutes**: per the body's records management policy
  and the Public Records Act 1958 where applicable.
- **Operational team minutes**: per the organization's records
  schedule; typically 1–7 years.

## Data protection

| Processing | Lawful basis |
| --- | --- |
| Internal meeting record | UK GDPR Art. 6(1)(f) — legitimate interests |
| Statutory minute record (UK companies) | UK GDPR Art. 6(1)(c) — legal obligation |
| Recording (audio / video) | UK GDPR Art. 6(1)(a) — explicit consent of participants; transparency notice |
| Action-item tracking | UK GDPR Art. 6(1)(f) — legitimate interests |

References:

- UK GDPR. <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Recording calls (transparency guidance applies by analogy):
  <https://ico.org.uk/for-organizations/uk-gdpr-guidance-and-resources/employment-information/monitoring-workers-at-work/>

## Confidentiality

- Board minutes default to Confidential.
- AGM / EGM minutes default to Internal (members) and may be made
  Public by board decision.
- 1:1 meeting notes default to Confidential between participants.
- The implementation honours per-record confidentiality flags in all
  search, export, and notification paths.

## Audit

- Append-only history of every edit to minutes (Robert's Rules and
  Companies Act both require the approved minute to be the canonical
  record; subsequent corrections happen by approved amendment minute).
- Soft delete only; `created_at` / `updated_at` / `deleted_at`.
- Signed export to PDF preserves the cryptographic integrity of the
  approved minute.

## Equality and accessibility

- Live captioning supported for video meetings (per Equality Act 2010
  reasonable-adjustment duty for participants with hearing impairment).
- WCAG 2.2 AA for the minute viewer.
- Plain-language summaries optional.

## Out of scope

- Video conferencing (delegated to Zoom / Teams / Meet).
- Calendar scheduling (delegated to Google Calendar / Outlook).
- Voting machines for AGMs (separate regulated system).
