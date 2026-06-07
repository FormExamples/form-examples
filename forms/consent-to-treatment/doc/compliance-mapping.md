# Compliance Mapping

This document maps each wizard step to the legal and professional standard
it satisfies, and shows where the form's completeness engine checks each
element.

## Step-by-step compliance map

| Step | Form section | Legal / professional hook | Why captured |
| --- | --- | --- | --- |
| 1 | Patient Information | s.4 MCA 2005 reference; UK GDPR Art. 13 identity | Identifies the patient and links to the clinical record. |
| 2 | Procedure Details | *Montgomery* para. 87 — "nature of the procedure"; GMC *DMC* para. 13 | Records the specific procedure being consented to. |
| 3 | Risks & Benefits | *Montgomery* materiality test; GMC *DMC* paras. 24–32 | Captures the material risks disclosed and the patient's understanding. |
| 4 | Alternative Treatments | *Montgomery* para. 87 — "reasonable alternative or variant treatments"; GMC *DMC* para. 21 | Records that alternatives (including no treatment) were discussed. |
| 5 | Anesthesia Information | RCoA / AAGBI consent guidance; *Montgomery* materiality | Captures consent to the anaesthesia plan separately from the surgical procedure. |
| 6 | Questions & Understanding | GMC *DMC* paras. 19–20 (giving time) | Records that the patient had opportunity to ask questions. |
| 7 | Patient Rights | UK GDPR Art. 13; right to withdraw consent at any time (GMC *DMC* para. 45) | Records that the patient was told of the right to withdraw. |
| 8 | Signature & Consent | Common-law consent; GMC *DMC* paras. 41–46 | Captures the patient's signature, witness signature, and date. |

## Capacity check

Step 1 records the clinician's brief MCA capacity assessment (the four
functional questions from MCA 2005 s.3(1)):

| Functional question | Statute reference |
| --- | --- |
| Understand the information relevant to the decision | s.3(1)(a) |
| Retain the information | s.3(1)(b) |
| Use or weigh the information as part of the decision | s.3(1)(c) |
| Communicate the decision | s.3(1)(d) |

A failed functional question routes the workflow to a best-interests
process (s.4) outside this form.

## Materiality of risk

Step 3 prompts for risks **as the reasonable patient in this position
would attach significance to them**, per *Montgomery* paragraph 87.
Generic "consent boilerplates" that list only common surgical risks are
not sufficient: the clinician must tailor the disclosure to:

- The patient's circumstances (age, comorbidities, occupation).
- The patient's expressed concerns (recorded in Step 6).
- Any risk the doctor knows or ought reasonably to know the patient
  would attach significance to.

## Completeness engine

The completeness engine returns:

| Verdict | Trigger |
| --- | --- |
| `complete` | All eight steps have required fields populated, capacity declared, and Step 8 signed. |
| `incomplete` | One or more required fields blank, signature missing, or capacity declaration missing. |

The form does not adjudicate the substantive validity of the consent
(that is a clinical-legal judgment); it adjudicates only completeness of
the record.

## Withdrawal of consent

Per GMC *DMC* 2020 paragraph 45, patients may withdraw consent at any
time before the procedure. The form's audit trail accommodates a
post-signature withdrawal entry, marked with the withdrawer's identity,
timestamp, and reason. Withdrawal is recorded but does not change the
original `complete` verdict — instead a `flag_consent_withdrawn` is
emitted.

## Information governance

| Field group | UK GDPR Article | Lawful basis | Special category basis |
| --- | --- | --- | --- |
| Health information (Steps 2–5) | Art. 9(1) | Art. 6(1)(e) public interest | Art. 9(2)(h) health care |
| Signature block (Step 8) | Art. 6 | Art. 6(1)(c) legal obligation under MCA / common law | n/a |

## ISO/IEC/IEEE 26514:2022

The wizard structure (one question per concept, plain English, opportunity
to revisit prior steps) follows the standard's §7 content design rules so
the printed consent record is comprehensible to the patient.
