# Completion Protocol

The completeness engine grades an Advance Statement against the eight
substantive domains expected by the Mental Capacity Act 2005 s.4(6)–(7)
best-interests checklist (read with Code of Practice Chapter 5) and by the
Compassion in Dying template. It emits a three-level categorical verdict
(`complete` / `partial` / `incomplete`) and a per-section breakdown so the
clinician can see exactly which domains are evidenced.

## Section-by-section map

| Wizard step | Section captured | Source of expectation | Required? |
| --- | --- | --- | --- |
| 1 | Personal Information | s.4(6) referent identification | yes |
| 2 | Statement Context | Code of Practice 5.13 — date and circumstances of making | yes |
| 3 | Values & Beliefs | s.4(6)(b) — beliefs and values | yes |
| 4 | Care Preferences | Code of Practice 5.41–5.43 — preferences of care setting and routine | recommended |
| 5 | Medical Treatment Wishes | s.4(6)(a) — past and present wishes and feelings | recommended |
| 6 | Communication Preferences | Code of Practice 5.45 — supported decision-making | recommended |
| 7 | People Important to Me | s.4(7) — persons to be consulted | yes |
| 8 | Practical Matters | Code of Practice 5.42 — domestic and financial concerns | optional |
| 9 | Signatures & Witnesses | Code of Practice 5.42 — proof of authorship and date | yes |

## Verdict assembly

The completeness engine returns:

| Verdict | Trigger |
| --- | --- |
| `complete` | All "yes" sections above are populated, signatures present, dated within the past 5 years. |
| `partial` | One or more "recommended" or "optional" sections are populated and all "yes" sections are populated. (Used when the statement is fit to read but light on detail.) |
| `incomplete` | One or more "yes" sections are blank, or the signature block is unsigned, or the statement is undated. |

## Currency check

The Code of Practice 5.42 recommends advance statements be reviewed
regularly. The engine emits a `flag_review_overdue` warning where the
statement is dated more than 5 years before the assessment date but does
not downgrade an otherwise complete verdict.

## Audit fields

The audit trail records, for every submission:

- The original signature timestamp (Step 9).
- The healthcare professional who logged the statement into the patient
  record.
- Any later amendment, with the amending professional's identity and
  rationale.

These fields satisfy the GMC *Confidentiality* (2017) requirement that
sensitive entries in the patient record be attributable.

## Status when the patient has lost capacity

The engine returns the same verdict regardless of the patient's current
capacity; the form is read-only once the patient has lost capacity. The
clinician applying the best-interests checklist consumes the statement
under MCA 2005 s.4 but does **not** treat it as binding.

## Relationship to an ADRT

Where a patient has both an advance statement and an Advance Decision to
Refuse Treatment, the engine surfaces a cross-link `flag_adrt_exists` so
the clinician can verify validity of the ADRT under MCA 2005 s.25 before
acting on the broader statement.
