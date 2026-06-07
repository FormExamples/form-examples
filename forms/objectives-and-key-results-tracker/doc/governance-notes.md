# Governance notes — OKR tracker implementation

## Regulatory classification

The OKR Tracker is a management / planning information system. It is
**not** a medical device.

OKRs may carry sensitive performance information about identifiable
individuals; the implementation therefore treats per-individual OKRs as
HR records.

## Data protection

| Processing | Lawful basis |
| --- | --- |
| Team and company OKRs | UK GDPR Art. 6(1)(f) — legitimate interests |
| Individual OKRs linked to performance review | UK GDPR Art. 6(1)(b) — contract |
| Visibility to leadership | per organisation's people policy |
| External investor reporting (aggregate only) | UK GDPR Art. 6(1)(f) — legitimate interests; or Art. 6(1)(c) where SEC / FCA reporting applies |

References:

- UK GDPR. <https://www.legislation.gov.uk/eur/2016/679/contents>
- Data Protection Act 2018.
  <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- ICO — Employment practices.
  <https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment-information/>

## Visibility model

OKRs are conventionally **transparent** within an organisation
(Doerr 2018). The implementation defaults to org-wide visibility for
team and company OKRs and to limited visibility for individual OKRs
(owner + line manager + skip + HR), with explicit override.

Confidential OKRs (e.g. M&A, restructuring) carry a separate flag and
encryption-at-rest.

## Audit

- Append-only history of every OKR create / edit / re-forecast / score
  event.
- Soft delete only; `created_at` / `updated_at` / `deleted_at`.
- End-of-cycle scores are immutable once leadership signs off.

## Retention

- Active cycle: indefinite while active.
- Past cycles: minimum 6 years for organisational learning and to
  support tax / audit defensibility of any tied compensation; longer
  per organisational policy.
- Individual OKRs follow HR record retention.

## Equality and accessibility

- WCAG 2.2 AA for the OKR UI.
- Reasonable adjustments for goal-setting conversations recorded
  separately under the Equality Act 2010, ss.20-22.

## Anti-patterns to guard against

- **Reverse-engineering performance ratings from OKR scores**.
  OKRs (especially aspirational ones) are explicitly **not** the basis
  for compensation per Doerr 2018 and Klau 2013. The implementation
  flags any attempt to derive compensation scores directly from KR
  scores.
- **Backdating OKR scores after results are known**: scores must be
  recorded at end-of-cycle with timestamp.

## Out of scope

- Performance review / compensation calculation systems.
- Investor reporting tools (XBRL, etc.).
- Capacity planning (resource management systems).
