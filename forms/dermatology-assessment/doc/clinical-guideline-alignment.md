# Clinical Guideline Alignment

The dermatology assessment captures DLQI as the primary quality-of-life
instrument and a lesion characterisation history. The following
authoritative sources informed which structured fields are collected and
which red-flag rules are applied.

## NICE guidelines

| Code | Title | URL |
| --- | --- | --- |
| NG198 | Acne vulgaris: management | https://www.nice.org.uk/guidance/ng198 |
| CG153 | Psoriasis: assessment and management | https://www.nice.org.uk/guidance/cg153 |
| NG10 | Atopic eczema in under 12s: diagnosis and management | https://www.nice.org.uk/guidance/ng10 (formerly CG57) |
| NG12 | Suspected cancer: recognition and referral | https://www.nice.org.uk/guidance/ng12 (Section 1.10 — skin cancer) |
| CKS | Clinical Knowledge Summaries — Dermatology topics | https://cks.nice.org.uk/specialities/skin-and-nail-disorders |

The Suspected Cancer NG12 referral criteria for melanoma (weighted
7-point checklist) and squamous cell carcinoma (non-healing keratinising
or crusted lesion) drive the lesion red-flag fields.

## British Association of Dermatologists (BAD)

BAD publishes UK national clinical guidelines for individual skin
conditions. Index: https://www.bad.org.uk/healthcare-professionals/clinical-standards/clinical-guidelines

Guidelines that map to fields in this assessment include:

- BAD guidelines for the management of psoriasis (most recent revision
  applicable at time of clinical use).
- BAD guidelines for the management of cutaneous squamous cell carcinoma.
- BAD guidelines for the management of melanoma (joint with British
  Society of Dermatological Surgery).

The exact issue year for each guideline is BAD's current published
version — see the BAD index for the live version. We deliberately do
not pin a year here to avoid drift.

## American Academy of Dermatology (AAD)

AAD clinical guidelines index:
https://www.aad.org/member/clinical-quality/guidelines

Guidelines relevant to this assessment:

- AAD-NPF guidelines for the management and treatment of psoriasis.
- AAD guidelines for the management of acne vulgaris.
- AAD guidelines for the management of atopic dermatitis.
- AAD guidelines for the care of cutaneous melanoma.

## Weighted 7-point checklist for pigmented lesions

The NICE NG12 referral rule for melanoma uses a weighted 7-point
checklist originally described by:

- MacKie RM, Doherty VR. "Seven-point checklist for melanoma." Clinical
  and Experimental Dermatology, 1991. (Referenced in NG12 Section 1.10.)

Major features (2 points each): change in size, irregular shape,
irregular colour. Minor features (1 point each): largest diameter ≥ 7 mm,
inflammation, oozing, change in sensation. Referral threshold: ≥ 3 points
or any single concerning feature.

## ABCDE rule (clinician aide-mémoire)

The ABCDE rule (Asymmetry, Border, Colour, Diameter > 6 mm, Evolution)
is a widely taught aide-mémoire popularised by Friedman et al. 1985 and
endorsed by AAD. It is not a scoring rule in our engine but is the basis
of the lesion-feature checkboxes on Step 4.

## What this engine does NOT score

- We do not compute PASI (Psoriasis Area and Severity Index). PASI
  requires a body-surface-area examination not collected by the patient
  questionnaire.
- We do not compute EASI (Eczema Area and Severity Index) for the same
  reason.
- We do not produce a melanoma diagnosis — only a referral flag.
- We do not give treatment recommendations. The patient remains under
  the care of a registered clinician.
