# Audit Trail Rules

Because the lawful basis for the Legal Requirements Privacy Notice is UK
GDPR Article 6(1)(c) (legal obligation), the audit trail must demonstrate
two things: (1) the patient was informed under Article 13, and (2) the
controller met the underlying statutory disclosure obligation. This
document specifies the retention, re-issue, and access rules that satisfy
both.

## Retention period

The acknowledgment record forms part of the GP patient record and is
retained per the NHS Records Management Code of Practice 2021: lifetime of
the patient plus 10 years (GP electronic patient record).

- NHS England — Records Management Code of Practice:
  <https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>

The underlying disclosure event (the actual share with NHS England, CQC,
or UKHSA) is logged separately by the originating system; this form's
record is the **information-provision** audit, not the share-event log.

## Re-issue triggers

| Trigger | Why |
| --- | --- |
| New statutory recipient added to the notice | Art. 13(1)(e) recipients changed |
| Statutory instrument amended (e.g. new SI) | Art. 13(1)(c) basis changed |
| Practice merger or list dispersal | Art. 13(1)(a) controller identity changed |
| Patient registers with the practice | Art. 13 trigger event |

The `practice_config` block carries a notice version number. The dashboard
emits `flag_acknowledgment_outdated` when a patient's acknowledgment
version differs from the current notice version.

## Demonstrating accountability (Article 5(2))

The controller demonstrates compliance with the data-protection principles
by retaining:

- The acknowledgment record (patient identity, version of notice, date).
- The versioned notice text itself.
- A cross-reference to the statutory instrument cited for each flow.
- An export of the dashboard showing acknowledgment coverage across the
  patient list — used in the annual Data Security and Protection Toolkit
  return.

## Rights handling

Because rights to erasure, restriction, and objection do **not** apply
where the lawful basis is Article 6(1)(c) and the relevant carve-outs are
engaged, the dashboard provides a "rights status" panel that explains, on
a per-flow basis, which rights the patient can exercise:

| Flow | Right available |
| --- | --- |
| NHS England statutory submission | Access, Rectification |
| CQC inspection | Access, Rectification |
| UKHSA notifiable disease | Access, Rectification |

ICO guidance: <https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/>

## Disclosure log requirement

While outside this form, the practice's clinical system must log every
statutory disclosure with at least the following fields:

- Patient identifier (NHS number).
- Recipient organisation (statutory body).
- Date of disclosure.
- Statutory instrument cited.
- Data items disclosed.
- Operator identity (the practice user who triggered or authorised the
  disclosure, even where automated).

This log is the controller's primary evidence that the disclosure was
lawful and proportionate, and it is the basis for any Subject Access
Request response.

## Access controls

The acknowledgment record sits inside the patient record and inherits its
RBAC. Read access is restricted to:

- The patient's registered GP and clinical staff with a legitimate
  relationship.
- The practice Information Governance Lead and Caldicott Guardian for
  compliance auditing.

External regulators do **not** access the acknowledgment record itself;
they access only the disclosed clinical data through their own statutory
authority.
