# OPG LP12 / LP13 alignment

The **Office of the Public Guardian** publishes practice notes that
supplement the statute and regulations. The two most relevant for this
form are:

- **LP12** — *Make and register your lasting power of attorney: a guide*
- **LP13** — *Life-sustaining treatment and lasting power of attorney*

This document records where each practice note shapes the form.

## LP12 — Make and register your LPA

| LP12 topic | Form realization |
| --- | --- |
| Choosing attorneys | Step 3 guidance text quotes LP12's "people you trust" criteria |
| Joint vs. several decision-making | Step 4 surfaces LP12's example scenarios; rule `R-MCA-JOINT-COLLAPSE` flags the "all-collapses-if-one-drops-out" risk LP12 warns about |
| Replacement attorneys | Step 5 prompts the donor to consider what should happen if a primary attorney becomes unable to act |
| People to notify | Step 9 limits to 5 per LP12 |
| Certificate provider | Step 10 implements the LP12 decision tree (see `certificate-provider-decision-tree.md`) |
| Preferences vs. instructions | Steps 7 and 8 split into two distinct screens, mirroring LP12's emphasis that *preferences* are guidance and *instructions* are binding |
| Registration fee | Step 13 fee field reflects the LP12 £82 (2026) figure and the remission grades |

## LP13 — Life-sustaining treatment and LPA

| LP13 topic | Form realization |
| --- | --- |
| Mandatory Option A / B election | Step 6 forces a choice; rule `R-MCA-LST-CHOICE` fires fatal until set |
| Donor initials | LP13 requires the donor to *initial* the chosen option, not merely tick a box; the `donor_initialled` column captures this |
| Effect of selecting Option B | Step 6 explains that attorneys cannot consent to or refuse life-sustaining treatment — the decision falls to the doctor under the Mental Capacity Act 2005 s.4 best-interests test, or to an ADRT if one exists |
| Effect of selecting Option A | Step 6 explains that attorneys can consent to or refuse life-sustaining treatment but must still act in the donor's best interests |
| Interaction with ADRT | Step 8 surfaces the ADRT cross-check (`R-MCA-INSTR-ADRT`); see `adrt-cross-check.md` |

## Other OPG sources

- **OPG Forms Library** — canonical LP1H, LP1F, LP3 (notice of intention
  to register), LPA117 (certificate of registration) forms. Our PDF
  export targets the LP1H 2024 template layout.
- **OPG digital LPA channel** — pending commencement of the Powers of
  Attorney Act 2023. When commenced, the form will submit JSON via the
  digital channel; until then, the PDF is posted.
- **OPG practice direction on rejections** — common reasons for OPG
  rejection (incorrect sign-order, missing initials, ineligible
  certificate provider, conflicting instructions) are encoded as fatal
  rules in the catalogue so they fail validation before submission.

## Audit trail

When the OPG rejects a submitted LPA, the rejection reason should be
recorded against the validity row (`lpa_validity.notes`) and the
informational flag `opg-historical-rejection` raised on any future LPA
attempt by the same donor.
