# Validity Protocol

This document specifies the operational protocol that the validity engine
applies to an Advance Decision to Refuse Treatment ("ADRT"). It is derived
from sections 24–26 of the Mental Capacity Act 2005 ("MCA 2005") and from
the Mental Capacity Act 2005 Code of Practice, Chapter 9.

## Inputs

The engine consumes the assessment object emitted by the 10-step wizard and
returns one of three categorical verdicts:

- `valid` — the decision is binding and must be honoured under s.26 MCA 2005.
- `invalid` — the decision fails one of the validity tests in s.25 MCA 2005.
- `incomplete` — the engine cannot evaluate the s.25 tests because required
  inputs are missing.

## Step 1 — Capacity at time of making (s.24(1))

The engine first checks the maker's explicit declaration of capacity at the
time the ADRT was made (Step 2 of the wizard). Per s.1(2) MCA 2005 there is a
statutory presumption of capacity, but the Code of Practice (9.7–9.8)
expects the declaration to be present in the document itself.

| Condition | Outcome |
| --- | --- |
| Declaration of capacity present | continue to next check |
| Declaration absent | `incomplete` |
| Maker is under 18 (from Step 1 DOB) | `invalid` (s.24(1) bar) |

## Step 2 — Identification of treatment (s.24(1)(a))

The engine requires at least one non-empty treatment item in Step 4
(general) or Step 5 (life-sustaining). The Code of Practice 9.11 says the
decision must specify "the particular treatment to be refused"; an open-ended
refusal of "all treatment" cannot be evaluated and is flagged.

## Step 3 — Identification of circumstances (s.24(1)(b))

The engine requires at least one non-empty circumstances item in Step 3.
Per s.25(2)(c), if the actual circumstances differ from those specified, the
decision is not applicable; the engine therefore records the circumstances
verbatim so the clinician applying the ADRT can compare them with the
patient's present situation.

## Step 4 — Life-sustaining treatment formalities (s.25(5)–(6))

If the Step 5 selection includes any life-sustaining treatment (for example
artificial nutrition, hydration, ventilation, CPR, or specified antibiotics),
the engine enforces the additional formalities of s.25(5)–(6):

| Formality | Where captured | If missing |
| --- | --- | --- |
| Written form | The submission itself is written | n/a |
| Express "even if life is at risk" statement | Step 5 mandatory checkbox | `invalid` |
| Maker signature | Step 10 | `invalid` |
| Witness signature | Step 10 | `invalid` |
| Witness in the presence of the maker | Step 10 attestation | `invalid` |

## Step 5 — Later Lasting Power of Attorney override (s.25(7))

If Step 8 records a Lasting Power of Attorney for Health and Welfare ("LPA
HW") under s.9 MCA 2005 that was created **after** the ADRT and that grants
the attorney authority over the same treatment, the engine downgrades the
verdict to `invalid` and emits the `flag_lpa_overrides_adrt` flag.

The donor can preserve the ADRT by including an express reservation in the
LPA per the Code of Practice 9.30; the engine therefore checks the wizard's
"LPA preserves this ADRT" boolean before applying the override.

## Step 6 — Clearly inconsistent later behaviour (s.25(2)(c))

The engine does not adjudicate this test (it is fact-specific and must be
applied by the clinician at the relevant time). Step 9's Healthcare
Professional Review captures the clinician's findings on this point.

## Verdict assembly

The engine returns the first failing test it encounters, in the order
above. If all tests pass, the verdict is `valid` and the engine emits a
`flag_valid_adrt_binding` flag that the clinical decision-support layer
surfaces in the chart banner.

## Code of Practice cross-reference

The protocol matches the Code of Practice Chapter 9 checklist:

- 9.5 — when an advance decision applies
- 9.7–9.9 — establishing capacity at the time of making
- 9.10–9.13 — specifying the treatment refused
- 9.18–9.23 — life-sustaining treatment formalities
- 9.24–9.30 — interaction with LPA HW and subsequent inconsistent conduct
- 9.61–9.70 — what to do if there is doubt about validity

Code of Practice index: <https://www.gov.uk/government/publications/mental-capacity-act-code-of-practice>
