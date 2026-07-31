# Clinical record standards

The structural basis for the twelve completeness components.

## Academy of Medical Royal Colleges — record structure standards

*Standards for the Clinical Structure and Content of Patient Records*, Health
and Social Care Information Centre / AoMRC, July 2013. These standards define
the headings a UK clinical record should carry. The relevant generic headings
for an inpatient entry, and their mapping onto this form's components:

| AoMRC heading | Component |
| --- | --- |
| Patient demographics; admission details | `header`, and step 2 |
| History; presenting complaint and history of it | `interval-history` |
| Observations and measurements | `observations` |
| Examination findings | `examination` |
| Investigations and results | `investigations` |
| Problems and issues; diagnoses | `problems` |
| Medications and medical devices; allergies and adverse reactions | `medications` |
| Risks; safety alerts | `risk-assessments` |
| Clinical summary; assessment | `impression` |
| Plan and requested actions | `plan` |
| Legal information; resuscitation status; treatment escalation | `escalation` |
| Person completing record; distribution list; information given | `communication` |

Every AoMRC generic heading relevant to an inpatient episode has a home in the
model. The mapping is deliberately one-directional: the form does not claim to
implement the standard in full, only to carry the headings the standard defines
for this record type.

## General Medical Council — record-keeping

*Good Medical Practice*, GMC, effective January 2024. Paragraph 20 requires that
clinical records be **clear, accurate, contemporaneous, and legible**, and that
they include:

- relevant clinical findings;
- the decisions made and actions agreed, and who is making the decisions and
  agreeing the actions;
- the information given to patients;
- any drugs prescribed or other investigation or treatment;
- who is making the record and when.

Each of these maps directly onto a required component: clinical findings onto
`observations` / `examination`, decisions and actions onto `impression` /
`plan`, information given onto `communication`, drugs onto `medications`, and
authorship onto `header`. This is why `header`, `impression`, and `plan` are the
three components whose absence forces an `incomplete` grade regardless of the
rest: without them the entry fails the GMC duty outright.

## Contemporaneity and amendment

A clinical record entry is a legal document. The form treats notes as
append-only:

- Notes are soft-deleted (`deleted_at`), never removed.
- A correction is a new note with `status = 'amended'`, not an edit in place.
- `note_at` records when the clinical events occurred; `created_at` records when
  the entry was written. A large gap between them is itself clinically
  meaningful and is preserved rather than hidden.

## Explicit negatives count as documented

A deliberate negative — "no overnight events", "no medication changes", "nil
outstanding" — is a valid and clinically useful record. It distinguishes "the
clinician considered this and there was nothing" from "the clinician did not
consider this". The completeness predicates therefore accept an explicit
negative flag as documentation, rather than requiring prose. This mirrors the
approach in [`ward-round-note`](../../ward-round-note).
