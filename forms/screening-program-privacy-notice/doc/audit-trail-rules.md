# Audit Trail Rules

The Screening Program Privacy Notice produces an Article-13 acknowledgment.
The acknowledgment is part of the patient record and is the evidence base
for the controller's accountability under Article 5(2).

## Retention period

The acknowledgment record is retained as part of the GP patient record per
the NHS Records Management Code of Practice 2021 (lifetime of the patient
plus 10 years).

- NHS England — Records Management Code of Practice:
  <https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>

The underlying screening attendance and result records are retained per
the programme-specific schedules in the same Code.

## Re-issue triggers

| Trigger | Why |
| --- | --- |
| Practice merger or list dispersal | Art. 13(1)(a) controller identity changed |
| New screening recipient added (e.g. new research consortium) | Art. 13(1)(e) recipients changed |
| Lawful basis cited in notice is amended | Art. 13(1)(c) basis changed |
| Statutory instrument cited is amended | Art. 13(1)(c) basis changed |
| Patient registers with the practice | Art. 13 trigger |
| Practice-customisable `practice_config` block is updated | Art. 13 trigger |

The dashboard emits `flag_acknowledgment_outdated` when the patient's
acknowledgment version differs from the current notice version.

## Demonstrating accountability

The controller retains:

- The versioned notice text (with the `practice_config` block as bound at
  the time of issue).
- The per-patient acknowledgment record.
- Evidence of s.251 CAG approval for any audit / research re-use flow.
- Evidence that any patient who has opted out via the National Data Opt-
  Out has been suppressed from in-scope downstream extracts (this is
  outside the form's storage but is part of the same accountability
  envelope).

NHS Data Security and Protection Toolkit:
<https://www.dsptoolkit.nhs.uk/>

## Subject access

Article 15 UK GDPR access requests are fulfilled by exporting:

- The acknowledgment record (notice version, date, full name).
- The list of screening programmes the patient is currently in.
- The history of any opt-out election.

ICO subject access guidance:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/>

## Access controls

The acknowledgment record sits inside the patient record and inherits its
role-based access controls. Read access is restricted to:

- The patient's registered GP and clinical staff with a legitimate
  relationship.
- The practice Information Governance Lead and Caldicott Guardian for
  compliance auditing.
- Programme administrators (e.g. national screening service teams) only
  for the metadata fields required to confirm transparency-duty
  compliance, not the patient's clinical record.

## Rights status panel

The dashboard surfaces, per patient:

- Acknowledgment status (Complete / Incomplete / Outdated).
- National Data Opt-Out status (where the practice has integrated the
  central register).
- Statutory disclosures applicable to that patient's screening cohort
  (UKHSA notification, audit returns).

Statutory disclosures override an opt-out election; the panel labels each
flow accordingly.
