# Assessment and advice: renal transplant recipient request form

Basis: a published two-page paper request form for a transplant immunology laboratory (recipient side),
read in full on 2026-11-27. This document is jurisdiction-neutral; regional names, units, contact
details and addresses on the source are deliberately not carried over.

## 1. What the source form does

One page of data entry plus one page of instructions. Ten sections: recipient identity, organ required,
sensitization history, clinical information, mode of dialysis, dialysis unit, tests required (17 tick
boxes, each paired with the tubes it needs), requester, sample collector, laboratory-use box. Instructions
cover labelling (3 identifiers, hand-labelled vs addressograph tubes), storage and transport (ambient,
within 24 hours, pre-arrange HLA typing, crossmatch and urgent samples).

## 2. Strengths worth keeping

- Sample volumes sit beside each test, so the requester collects the right tubes.
- Sensitization history is captured by event type with counts and dates. This is the right model.
- Urgency is explicit and its turnaround stated; rejection work-up has its own stated turnaround.
- Separate requester and collector blocks create a two-person accountability trail.
- A separate form per person is mandated, preventing donor/recipient sample mix-ups.
- The requester carries responsibility for consent and identification.

## 3. Gaps and risks found

| # | Finding | Why it matters | Fix in this form |
| --- | --- | --- | --- |
| 1 | **Recipient ABO group is not asked.** | ABO compatibility is the first crossmatch gate; ABO-incompatible monitoring is offered without it. | `recipient_abo_group` field; flag `missing-abo-group`. |
| 2 | Sensitization boxes have no "unknown" or "none". | A blank cannot distinguish zero from not asked. | Counts are nullable integers: `NULL` = unknown, `0` = none. |
| 3 | Dialysis unit is a regional tick list. | Not portable; unit names change. | Free-text `dialysis_unit_name`. |
| 4 | Dialysis mode mixes treatment state with transplant state ("failing transplant"). | Hard to analyze. | Kept as one enum, documented; candidate to split. |
| 5 | No place for a donor reference on a deceased-donor or day-of-transplant request. | Laboratory must trace the donor by phone. | `donor_reference`. |
| 6 | Urgent is a red tick with no reason. | Abused urgency erodes triage. | `urgent_testing_reason` plus flag `urgent-without-reason`. |
| 7 | Test selection is unchecked: a virtual crossmatch can be ticked with no antibody monitoring history. | Virtual crossmatch relies on a current antibody profile. | Axis A rule and flag. |
| 8 | Ethnicity is free text. | HLA frequency interpretation benefits from a coded value. | Free text kept; coded value is an open question. |
| 9 | Sex only, no gender or sex-at-birth distinction. | Pregnancy history and identity matching. | `sex` enum incl. other and unknown. |
| 10 | The requester's email carries a fixed organization domain; the signature is a paper signature. | Not portable; no audit. | Free email; `requested_by_signed_at` timestamp. |
| 11 | Tube colour guide is on the reverse. | Easy to miss. | Derived sample summary on the review step. |
| 12 | Printed addressograph label is the only identity step. | No electronic check that form and tube match. | Identifier counts and match attestation on both. |
| 13 | Laboratory-use identifiers (donor and recipient) are on the requester's form. | Mixed audiences and workflows. | Kept as clearly labelled laboratory-only fields. |
| 14 | Tests that need no recipient sample are indistinguishable from those that do. | Unneeded draws. | Derived sample summary per test. |
| 15 | Transport rule cites a regional dangerous-goods regime. | Not generic. | Reworded to "applicable carriage regulations". |

## 4. Advice

1. **Keep the tube-per-test pairing**; make it computed, not printed.
2. **Add recipient ABO group** (and, for living-donor pairs, a link to the donor request).
3. **Make nulls meaningful** for sensitization: unknown vs none.
4. **Gate dangerous combinations** (virtual crossmatch without profile, ABO-incompatible without DFPP status)
   with flags that query rather than block; the laboratory keeps the final say.
5. **Do not hard-code turnaround times.** They are local policy; the source states 1 working day for
   urgent and 3-5 working days for rejection investigation, which is one laboratory's policy.
6. **Treat identity as a first-class axis.** Rejected, mislabelled samples are the commonest avoidable delay.
7. **Plan consent explicitly**: a boolean attestation by the requester, matching the source's instruction.
8. **Data minimization:** address, email and phone are optional; the laboratory needs identifiers, not contact data.
9. **Privacy:** this is special-category health data. Keep storage local by default (as the repo's other forms do) and send only through an authorized channel.
10. **Before clinical use**, have a histocompatibility specialist confirm the test list, tube volumes
    and the 1-9 anchoring. Volumes and rules were transcribed from one laboratory's form and may not match another's.

## 5. Open questions for the maintainer

- Should the donor reference link to the companion living-donor form (a cross-form foreign key)? Today it is free text.
- Should dialysis mode and transplant status be separate fields?
- Should ethnicity be coded (e.g. an agreed national list)?
- Who owns the laboratory-use block: the same record, or a separate laboratory form?
