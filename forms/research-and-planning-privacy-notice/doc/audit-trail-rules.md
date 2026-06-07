# Audit Trail Rules

The Research and Planning Privacy Notice produces two audit signals: an
Article-13 acknowledgment, and a National Data Opt-Out election. Both must
be retained, versioned, and accessible to the patient on request.

## Retention period

The acknowledgment + opt-out record forms part of the GP patient record
and is retained per the NHS Records Management Code of Practice 2021
(lifetime of the patient plus 10 years for the GP electronic patient
record).

- NHS England — Records Management Code of Practice:
  <https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>

The opt-out election also lives in the National Data Opt-Out service for
the patient's lifetime.

## Re-issue triggers

| Trigger | Why |
| --- | --- |
| New research / planning recipient added | Art. 13(1)(e) recipients changed |
| Lawful basis cited in notice is amended | Art. 13(1)(c) basis changed |
| Controller identity changes | Art. 13(1)(a) controller identity changed |
| Patient registers with the practice | Art. 13 trigger |
| Patient withdraws or changes opt-out | New election must be recorded |

The dashboard surfaces `flag_acknowledgment_outdated` when the patient's
acknowledgment version differs from the current notice version.

## Patient opt-out election lifecycle

| State | Effect |
| --- | --- |
| `opt-out` | Patient has chosen to opt out — controller must suppress data from in-scope flows. |
| `opt-in` | Patient has explicitly chosen to allow research / planning use. |
| `unspecified` | Patient has acknowledged the notice but not made an election; default behaviour follows the National Data Opt-Out applied at the central service. |

The form is the **point of capture** only. The controller propagates the
election to the National Data Opt-Out service (or local register) by
out-of-band integration.

## Subject access

Under UK GDPR Article 15 the patient is entitled to know what processing
is happening. The dashboard supports a per-patient export of:

- The acknowledgment record (notice version, date, full name).
- The current opt-out election.
- The history of changes to the opt-out election with timestamps.

ICO subject access guidance:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/>

## Demonstrating accountability (Article 5(2))

The controller demonstrates compliance with the data-protection principles
by retaining:

- The versioned notice text.
- Per-patient acknowledgment + opt-out records.
- Evidence of propagation of opt-outs to in-scope downstream flows.
- Evidence of s.251 CAG approval (or HRA approval) for any flow that
  relies on it.

NHS Data Security and Protection Toolkit:
<https://www.dsptoolkit.nhs.uk/>

## Rights status panel

The dashboard provides a "rights status" per patient summarising:

- Acknowledgment status (Complete / Incomplete / Outdated).
- Opt-out status (opt-out / opt-in / unspecified).
- Article 21 (objection) interaction with Article 89 research safeguards.

Where the patient has opted out, the panel surfaces a `flag_patient_opted_out`
banner that must be respected by any downstream research / planning
extract.
