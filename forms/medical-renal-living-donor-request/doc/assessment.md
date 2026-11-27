# Assessment and advice: Medical Renal Living Donor Request

Basis: a published two-page paper request form from a transplantation / histocompatibility laboratory, read in full on 2026-11-27. This document is jurisdiction-neutral; regional names, units, contact details and addresses on the source are deliberately not carried over.

## 1. What the source form does

One page of data entry plus one page of instructions. Nine sections: donor identity, recipient identity, relationship, recipient transplant centre, ABO groups, tests required (seven tick boxes with donor sample volumes), requester, sample collector, laboratory-use box. Instructions are the shared labelling, storage and transport rules.

## 2. Strengths worth keeping

- A separate form per person is mandated, preventing sample mix-ups.
- Minimum 3 identifiers on form and sample, and a "samples not labelled correctly will be discarded" rule.
- The requester owns consent and identification.
- Sample tubes and volumes are tied to the request, with a colour guide.
- Donor and recipient ABO groups are asked together (the recipient form lacks this).
- "Specify transplant centre if recipient elsewhere" supports cross-centre donation.

## 3. Gaps and risks found

| # | Finding | Why it matters | Fix in this form |
| --- | --- | --- | --- |
| 1 | **Contradiction:** the form identifies donor and recipient, yet the instructions require a separate form for each person, and samples are donor-only. | Recipient details may be mistaken for a second sample set, or a recipient sample sent on a donor form. | Donor-only sample; recipient referenced by ID; flag `donor-and-recipient-on-one-form`. |
| 2 | "Altruistic donor" is listed as a test. | It is a donation pathway, not a test; an altruistic donor has no recipient to crossmatch. | `donation_pathway` enum (directed / altruistic / paired-exchange); recipient optional. |
| 3 | Relationship is free text with no pathway. | Cannot be audited or reported. | Free-text relationship kept, plus the pathway enum. |
| 4 | No donor-privacy handling. | A living donor is entitled to independent, confidential assessment; the recipient team should not see all donor data. | Donor and recipient are separate tables; see advice. |
| 5 | "Day of transplant samples" has no linkage to the earlier crossmatch. | The laboratory cannot confirm a prior full crossmatch exists. | Axis A and open question. |
| 6 | No urgency field. | Day-of-transplant work is time-critical but unmarked. | Urgent flag + reason; stat tier for day-of-transplant. |
| 7 | Collection time is a free date and time. | Sample age affects viability. | `sample_collected_at` timestamp. |
| 8 | Fixed organization email domain; paper signature. | Not portable; no audit. | Free email; signed-at timestamp. |
| 9 | Recipient ABO group is asked here but not on the recipient form. | Inconsistent across the paired forms. | Both ABO groups here; recipient form adds its own. |
| 10 | Transport rule names a regional dangerous-goods regime. | Not generic. | "Applicable carriage regulations." |

## 4. Advice

1. **Split donor and recipient clearly**: one request per donor sample, recipient by reference.
2. **Model pathway explicitly** (directed, altruistic, paired exchange) and drop "altruistic donor" from the test list.
3. **Protect the donor**: the donor is a healthy volunteer; keep donor health data separate from recipient records and share only what the matching decision needs.
4. **Flag ABO-incompatible pairs** rather than blocking; they may proceed via desensitization or paired exchange.
5. **Do not hard-code turnaround times**; they are local policy.
6. **Make consent explicit** and donor-specific, separate from recipient consent.
7. **Data minimization:** contact details optional.
8. **Privacy:** special-category health data; keep storage local by default and send only through an authorized channel.
9. **Before clinical use**, have a histocompatibility specialist confirm the test list, tube volumes and the 1-9 anchoring. They were transcribed from one laboratory's form and may not match another's.

## 5. Open questions for the maintainer

- Should the donor request link to the recipient request (cross-form foreign key) once both forms have back-ends?
- Should paired-exchange cycles be modelled (several donors and recipients)?
- Is independent-assessor sign-off part of this request or a separate form?
