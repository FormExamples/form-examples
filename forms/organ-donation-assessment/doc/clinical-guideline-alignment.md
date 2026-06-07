# Clinical Guideline Alignment

The organ donation assessment is grounded in NHSBT, WHO, EDQM and BTS
guidance. The following sources informed the field set and rule
catalogue.

## NHS Blood and Transplant (NHSBT)

NHSBT publishes UK clinical policies for all organ-donation and
transplantation activity. Policy library:

- NHSBT Organ Donation and Transplantation policy library.
  https://www.odt.nhs.uk/transplantation/tools-policies-and-guidance/policies-and-guidance/

Policy categories relevant to this assessment:

- POL — Patient selection (organ-specific).
- POL — Donor selection and acceptance.
- POL — Allocation policies (kidney, liver, cardiothoracic, pancreas,
  intestine).

The exact policy numbers (e.g. POL188, POL232) are periodically revised;
the engine refers to the policy by category rather than pinning a
specific revision number.

## WHO

- WHO Guiding Principles on Human Cell, Tissue and Organ
  Transplantation. Endorsed by WHA 63.22 (2010).
  https://www.who.int/transplantation/Guiding_PrinciplesTransplantation_WHA63.22en.pdf
- WHO Critical Pathway for Deceased Donation.
  https://www.who.int/transplantation/donation/en/

The WHO guiding principles (especially Principle 5 on no commercial
exploitation and Principle 9 on traceability) inform the consent and
ethical-review fields on Steps 9 and 10.

## EU Directive 2010/53/EU

- Directive 2010/53/EU of the European Parliament and of the Council
  on standards of quality and safety of human organs intended for
  transplantation.
  https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32010L0053
- EDQM Guide to the Quality and Safety of Organs for Transplantation.
  https://www.edqm.eu

## British Transplantation Society (BTS)

BTS clinical guidelines: https://bts.org.uk/guidelines-standards/

Examples:

- BTS / Renal Association *Guidelines for Living Donor Kidney
  Transplantation* (4th edition).
- BTS guidelines for the use of HCV-positive organs.
- BTS / NHSBT Joint Working Party guidelines on Organ Donation after
  Circulatory Death.

## Maastricht classification of DCD

- Kootstra G, Daemen JH, Oomen AP. *Categories of non-heart-beating
  donors.* Transplantation Proceedings 1995; 27(5): 2893-2894. PMID:
  7482956.

## US OPTN / UNOS (informative)

- OPTN policy library.
  https://optn.transplant.hrsa.gov/policies-bylaws/policies/

OPTN policies are not authoritative in the UK but are widely referenced
in international transplantation literature. The engine does not bind
to OPTN-specific scoring (e.g. KDPI for deceased kidney donors); the
risk band is a generic categorical descriptor only.

## Ethical and legal

- Human Tissue Act 2004 (England, Wales, Northern Ireland).
  https://www.legislation.gov.uk/ukpga/2004/30/contents
- Human Tissue (Scotland) Act 2006.
  https://www.legislation.gov.uk/asp/2006/4/contents
- Human Tissue Authority (HTA) codes of practice.
  https://www.hta.gov.uk/guidance-professionals/codes-practice
- Organ Donation (Deemed Consent) Act 2019 (England).
  https://www.legislation.gov.uk/ukpga/2019/7/contents

## What this engine does NOT compute

- We do not compute the Donor Risk Index (Feng et al. 2006) for liver
  donors.
- We do not compute the Kidney Donor Profile Index (KDPI) used by
  OPTN.
- We do not perform HLA cross-matching or virtual cross-matching.
- We do not allocate organs to recipients — the eligibility field on
  Step 10 is a decision support, not an allocation algorithm.

## Patient self-report caveats

Living donors complete demographic and psychosocial sub-sections.
Medical-history fields are clinician-verified against laboratory and
imaging data. Deceased-donor records are clinician-completed only.
