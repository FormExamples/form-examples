# Organ Donor Suitability Grading Rules

The organ donation assessment captures donor-specific data for living
and deceased organ donors and computes a composite suitability
(Suitable / Conditionally suitable / Unsuitable) plus a risk band
(Low / Moderate / High / Critical) using organ-specific criteria.

Donor selection in the UK is governed by NHS Blood and Transplant
(NHSBT) clinical policies; in the EU by Directive 2010/53/EU and
EDQM Guide; in the US by OPTN policies. The criteria pinned in this
engine are read from those policies — see references for live links.

## Donor type

| Type | Source | Examples |
| --- | --- | --- |
| Living | Healthy living donor | Living kidney, living liver lobe |
| Deceased — DBD | Donation after brain death | Donor meeting brainstem-death criteria |
| Deceased — DCD | Donation after circulatory death | Maastricht categories I-V |
| Domino | Recipient also a donor | Familial amyloidosis liver chain |

For deceased donors, the Maastricht classification of DCD donors is
recorded on Step 2:

- Maastricht I — Dead on arrival (uncontrolled)
- Maastricht II — Unsuccessful resuscitation (uncontrolled)
- Maastricht III — Awaiting cardiac arrest after withdrawal of treatment (controlled)
- Maastricht IV — Cardiac arrest in brain-dead donor (controlled)
- Maastricht V — Cardiac arrest in an in-patient (uncontrolled)

Source: Kootstra G, Daemen JH, Oomen AP. *Categories of non-heart-beating
donors.* Transplantation Proceedings 1995; 27(5): 2893-2894. PMID: 7482956.
Updated WHO definitions: WHO Critical Pathway for Deceased Donation.

## Absolute contraindications (Unsuitable)

Per NHSBT clinical policies POL188 (organ acceptance) and POL232 (organ
donor selection) — exact policy numbers and content evolve; the live
policy library is the canonical reference:

- NHSBT clinical policy library.
  https://www.odt.nhs.uk/transplantation/tools-policies-and-guidance/policies-and-guidance/

Examples of absolute contraindications (any one → Unsuitable):

| Domain | Example |
| --- | --- |
| Malignancy | Active untreated systemic malignancy (excluding non-melanoma skin and certain CNS tumours) |
| Infection | Untreated TB / HIV / CJD / rabies / TSE / sepsis (case-by-case for HIV+ to HIV+ programmes) |
| Behavioural | Prion-disease exposure |
| Organ-specific | Organ function below salvage threshold |

WHO guidance on living and deceased donor selection:

- WHO Guiding Principles on Human Cell, Tissue and Organ Transplantation,
  endorsed by WHA 63.22 (2010).
  https://www.who.int/transplantation/Guiding_PrinciplesTransplantation_WHA63.22en.pdf

## Conditionally suitable (Expanded criteria donor)

Conditions that move a donor from "Suitable" to "Conditionally suitable"
without making them "Unsuitable":

| Domain | Example |
| --- | --- |
| Age | Donor age outside ideal range (deceased kidney > 60, > 50 with comorbidity) |
| Cardiovascular | Hypertension, diabetes |
| Lifestyle | Past IV drug use within 12 months |
| Infection | Hepatitis B or C with cleared virus / treatable status |
| Organ-specific | Marginal organ function within transplantable range |

Source: NHSBT Donor Optimization Extended Care Bundle and the Eurotransplant /
US OPTN expanded-criteria donor definitions.

## Risk banding

The engine emits a 4-level risk band:

| Risk | Trigger |
| --- | --- |
| Low | All organs ideal; no risk factors |
| Moderate | Expanded criteria donor with manageable risk factors |
| High | Marginal organ function; significant comorbidities |
| Critical | Any absolute contraindication → also "Unsuitable" |

## Living donor — psychological assessment

For living donors, the Psychosocial Evaluation of Living Donors
(PELD-LD or equivalent psychosocial assessment) is recommended by:

- BTS / RA *Guidelines for Living Donor Kidney Transplantation*, 4th
  edition.
  https://bts.org.uk/wp-content/uploads/2018/07/FINAL_LDKT-guidelines_June-2018.pdf

This is a clinician judgement field; Step 8 captures a structured
psychosocial review but does not auto-score a psychometric instrument.

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-DON-ABS-CI | Any absolute contraindication → suitability = Unsuitable, risk = Critical. |
| R-DON-EXPANDED | One or more expanded-criteria factors → suitability = Conditionally suitable, risk ≥ Moderate. |
| R-DON-LIVING-PSY | Living donor with psychosocial concerns → flag "MDT psychosocial review required". |
| R-DON-CONSENT | Missing or invalid consent → submission blocked. |
| R-DON-AGE | Donor age > 80 → flag for case-by-case review. |
