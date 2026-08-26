# Governance notes — issue tracker

## Regulatory classification

The Issue Tracker is an IT service-management information system. It
is **not** a medical device. Where the issues being tracked concern a
medical-device product, the artefacts produced (bug reports,
post-incident reviews) may form part of the device's technical
documentation under MDR / UK MDR 2002 and must be retained accordingly.

## ITIL / ISO 20000 alignment

The implementation maps to the ITIL 4 service-management practices and
to ISO/IEC 20000-1:2018 clauses:

| ITIL 4 practice | ISO/IEC 20000-1:2018 clause | Implementation feature |
| --- | --- | --- |
| Incident management | 8.6 | Type=incident; SLA clock; status page |
| Problem management | 8.7 | Type=problem; root-cause linkage |
| Service request management | 8.5 | Type=service-request |
| Change enablement | 8.5 | Type=change; CAB review hook |
| Knowledge management | 8.4 | linked knowledge-base articles |

References:

- ISO/IEC 20000-1:2018.
  <https://www.iso.org/standard/70636.html>
- ITIL 4 Foundation. AXELOS / PeopleCert.

## Data protection

| Processing | Lawful basis |
| --- | --- |
| Issue capture from internal users | UK GDPR Art. 6(1)(f) — legitimate interests |
| Issue capture from external customers | UK GDPR Art. 6(1)(b) — contract |
| Audit log retention | UK GDPR Art. 6(1)(c) — legal obligation where applicable; Art. 6(1)(f) otherwise |

Personally identifying content embedded by users in descriptions or
attachments (e.g. screenshots containing PII) is handled per the
organization's PII redaction policy.

## Retention

- Active issue records: indefinite during the product's supported life.
- Archived issue records: retain as part of product technical
  documentation per ISO 13485:2016 / MDR Annex II for regulated medical
  devices.
- Post-incident review records: at least 7 years for SaaS providers,
  consistent with ISO/IEC 20000 and ISO/IEC 27001 norms.

## Audit and assurance

- Append-only audit log of every issue create / transition / edit.
- Soft delete only; `created_at` / `updated_at` / `deleted_at`.
- Per-project retention overrides.
- Annual reconciliation of high-severity incidents against the post-
  incident review register.

## Access control

- Reporters can see their own issues.
- Project members can see all project issues.
- Cross-project search is gated by role.
- Confidential issues (security vulnerabilities, customer-specific
  data) are flagged and limited to a named group; GitLab-style
  "confidentiality" model.

## Out of scope

- Change Advisory Board scheduling (CAB tooling).
- On-call paging (PagerDuty / OpsGenie).
- Source-control integration (handled by GitHub / GitLab webhooks).
