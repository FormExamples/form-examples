# Safety case notes — DCB0129 / DCB0160

Placeholder notes for the NHS Digital clinical-safety standards. Required
only if this form is deployed inside an NHS organization; not required
for a citizen-facing standalone tool, since the form is administrative
(legal document drafting) rather than clinical-decision-support.

## Classification

- **MDCG 2019-11 Rev.1** — administrative tool, *not* a medical device.
  The validity engine produces a legal-document validity result, not a
  clinical recommendation.
- **UK Medical Devices Regulations 2002** — out of scope.
- **NHS DCB0129 / DCB0160** — applies only when an NHS trust deploys
  this software in its IT estate. The standards require, in summary:
  - DCB0129 — manufacturer (or maintainer) safety case
  - DCB0160 — deploying organization safety case

## DCB0129 placeholder

| Section | Status |
| --- | --- |
| Clinical Safety Officer | TBD when first NHS deployment is planned |
| Hazard log | TBD |
| Top-level hazards | drafted below |
| Risk assessment | TBD |
| Risk control measures | TBD |
| Clinical safety case report | TBD |

### Drafted top-level hazards

| Hazard ID | Description | Mitigation |
| --- | --- | --- |
| HAZ-LPA-001 | Engine reports `ready-to-register` for an LPA that is in fact invalid (false negative) | exhaustive Vitest unit tests on every rule; engine version pinned in `lpa_validity.engine_version` for re-test on catalogue change |
| HAZ-LPA-002 | Engine reports `invalid` for a valid LPA (false positive) | conservative rule semantics; rules surface a `suggested_correction` so the donor can confirm the engine's reading |
| HAZ-LPA-003 | ADRT cross-check missed (orphan ADRT not surfaced) | server-side cross-check on submit; informational flag `adrt-recommended` |
| HAZ-LPA-004 | Donor mis-classified as having capacity at signing | the form does *not* assess capacity; it only records the donor's self-declaration and surfaces a flag for human review |
| HAZ-LPA-005 | Sign-order timestamps falsified | timestamps are server-generated, not client-supplied; signature method `electronic` requires a PKCS#7 envelope |
| HAZ-LPA-006 | Welsh-language donor served only English form | informational rule `R-MCA-WALES` flags Welsh donors |

## DCB0160 placeholder

The deploying NHS trust must produce its own DCB0160 safety case before
go-live. This document feeds into that artefact but does not replace it.

## Information governance

- **UK GDPR Article 9** — donor and attorney personal data is
  special-category (health data). The form classifies all PII columns
  as Article 9 in the data-protection impact assessment.
- **Data minimization** — NHS number is optional. The form runs without
  it; the cross-form ADRT check is the only feature that benefits from
  it.
- **Retention** — LPA records are kept indefinitely. The OPG keeps
  registered LPAs on its register. Drafts not progressed to registration
  may be deleted after the donor's death.

## Out of scope

- Clinical-decision-support frameworks (e.g. NHS Digital's CDS standards).
- ISO 14971 medical-device risk management (form is not a medical device).
- ISO 13485 quality management (form is not a medical device).
- The form does *not* attempt to comply with any clinical-trial
  governance framework.
