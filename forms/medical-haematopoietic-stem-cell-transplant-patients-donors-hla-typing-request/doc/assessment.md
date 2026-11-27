# Assessment and advice: Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request

Basis: a published two-page paper request form from a transplantation / histocompatibility laboratory, read in full on 2026-11-27. This document is jurisdiction-neutral; regional names, units, contact details and addresses on the source are deliberately not carried over.

## 1. What the source form does

One page of data entry plus one page of instructions. Six sections: sample details (a patient or potential donor, with starred mandatory fields), consultant / GP details, clinical details with a recipient block for relatives, requester, sample collector, laboratory-use box. The reverse gives sample requirements by role and the shared labelling, storage and transport rules; urgent requests are arranged by telephone.

## 2. Strengths worth keeping

- A separate form per person is mandated, preventing sample mix-ups.
- Minimum 3 identifiers on form and sample, and a "samples not labelled correctly will be discarded" rule.
- The requester owns consent and identification.
- Sample tubes and volumes are tied to the request, with a colour guide.
- Mandatory fields are starred.
- A linked-recipient block lets the laboratory pair donor and recipient samples.
- Sample requirements are given per role.

## 3. Gaps and risks found

| # | Finding | Why it matters | Fix in this form |
| --- | --- | --- | --- |
| 1 | No test menu: the test (HLA typing) and its resolution are implicit. | The laboratory cannot tell low- from high-resolution typing, or which loci. | `hla_typing_resolution` enum added. |
| 2 | No role field; role is inferred from the clinical-details text. | Wrong tubes are sent; vetting cannot be automated. | `subject_role` enum; derived sample requirements. |
| 3 | No donor type (matched sibling, haploidentical, unrelated). | Drives how many relatives and which loci are tested. | `donor_type` enum. |
| 4 | Urgency is not on the form; it is arranged by phone. | No audit; informal triage. | `urgent_testing` + reason; triage axis. |
| 5 | The linked-recipient block uses name, record number and birth date only, with free-text relationship. | No stable recipient reference. | Kept; open question on cross-form link. |
| 6 | Donor consent and recipient consent are not distinguished. | Donors must consent independently of the recipient. | Consent attestation worded for the person sampled. |
| 7 | Sample volumes are printed only on the reverse. | Under-filled tubes force re-draws. | Volumes entered and checked against role. |
| 8 | Ethnicity is mandatory but free text. | Inconsistent entries. | Free text kept; coded value is an open question. |
| 9 | Fixed organization email domain; paper signature. | Not portable; no audit. | Free email; signed-at timestamp. |
| 10 | No CMV status, ABO or weight. | Relevant to donor selection but outside HLA typing. | Out of scope; open question. |

## 4. Advice

1. **Add role, donor type and resolution** so the request states what is wanted.
2. **Derive tubes from role**, and check entered volumes.
3. **One request per person**; link a relative to the recipient by reference.
4. **Make urgency explicit** and recorded; keep the phone call, but log it.
5. **Protect donor autonomy**: donor consent is separate, and donor data should not flow to the recipient record beyond the matching result.
6. **Data minimization:** contact details optional.
7. **Privacy:** special-category health data; keep storage local by default and send reports only to authorized addresses.
8. **Name length:** the schema name exceeds 63 bytes (see `sql/00_create_schema.sql`); tables use a short prefix, as the fleet's other two long-named forms do.
9. **Before clinical use**, have a histocompatibility specialist confirm the test list, tube volumes and the 1-9 anchoring. They were transcribed from one laboratory's form and may not match another's.

## 5. Open questions for the maintainer

- Should a potential donor's request reference the recipient's request instead of repeating recipient details?
- Should the form support registry / unrelated-donor work-up (a different workflow)?
- Should ethnicity be coded?
