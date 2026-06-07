# Completion Protocol

The completeness engine consumes the assessment object emitted by the
8-step wizard and returns a two-level categorical verdict (`complete` or
`incomplete`) plus a per-section breakdown. This document specifies the
exact protocol.

## Inputs

The engine receives:

- `patient` — identity block.
- `procedure` — procedure name, date, lead clinician.
- `risks` — material risks disclosed and the patient's recorded
  understanding.
- `alternatives` — reasonable alternative or variant treatments discussed.
- `anaesthesia` — separate anaesthesia consent block where applicable.
- `questions` — record of the patient's questions and answers.
- `rights` — record that the patient was told of the right to withdraw.
- `signature` — patient signature, witness signature, and date.

## Verdict assembly — required fields

The verdict is `complete` only if **all** of the following are present:

| Required field | Why |
| --- | --- |
| Patient identity (name + DOB or hospital number) | Identifies the consenter |
| Capacity declaration | s.1(2) MCA 2005 presumption applied |
| Procedure name | *Montgomery* para. 87 — nature of the procedure |
| At least one material risk explicitly recorded | *Montgomery* materiality test |
| Alternatives discussed (including "no treatment") | *Montgomery* para. 87 — reasonable alternatives |
| Anaesthesia plan discussed (if applicable) | Where anaesthesia is administered, separate consent |
| Opportunity to ask questions recorded | GMC *DMC* paras. 19–20 |
| Right to withdraw recorded | GMC *DMC* para. 45 |
| Patient signature | Common-law evidence of consent |
| Date | Evidence the consent is contemporaneous |

A missing element returns `incomplete` and surfaces the specific field
in the dashboard's "missing items" list.

## Witness signature

Witness signature is **recommended** but not statutorily required for
elective consent in most jurisdictions. The engine emits
`flag_witness_signature_missing` where the witness block is blank but
does not downgrade an otherwise `complete` verdict.

For procedures that engage specific statutory consent regimes (for
example, Mental Health Act 1983 s.57/s.58 treatments, or Human
Fertilisation and Embryology Act 1990 consents), witness signatures **are**
mandatory; those forms exist elsewhere in the monorepo and apply their own
witness requirement.

## Currency check

A consent is generally treated as valid for the planned procedure if
signed within the past 90 days, subject to the clinician's judgment about
whether material new information has emerged. The engine emits
`flag_consent_stale` if the signature date is more than 90 days before
the engine evaluation date but does not downgrade an otherwise `complete`
verdict.

## Withdrawal

The engine accepts a post-signature withdrawal entry containing:

- Withdrawer identity.
- Timestamp.
- Reason (free text).

A withdrawal results in `flag_consent_withdrawn` being raised; the
original `complete` verdict is preserved (the form was complete at the
time of signing) but the dashboard banner instructs that the consent must
not be relied on.

## Mental Capacity Act flow

If the Step 1 capacity declaration records a failed functional question
(per MCA 2005 s.3(1)), the engine returns `incomplete` and surfaces
`flag_capacity_failed`. The workflow is routed to a best-interests
process (s.4 MCA 2005) outside this form.

## Children and young people

If the patient DOB indicates age under 18:

- 16–17: form proceeds under Family Law Reform Act 1969 s.8 with no
  additional capture.
- Under 16: the engine prompts for the clinician's Gillick competence
  assessment (a free-text rationale) and notes the parental responsibility
  holder.

## Output

The engine returns:

- `verdict`: `complete` | `incomplete`
- `missing`: array of field identifiers
- `flags`: array of `flag_*` strings
- `summary`: human-readable summary suitable for the printed record

The printed record reproduces the patient's responses verbatim alongside
the clinician's notes for each step. Per GMC *DMC* 2020 paragraph 46,
the printed record is filed with the patient's clinical notes.
