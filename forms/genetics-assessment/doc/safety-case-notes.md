# Safety case notes

Working safety log for the genetics-assessment software.

## Intended purpose

Clinical-genetics intake questionnaire that captures pedigree, applies
validated risk-scoring instruments, and supports testing and counselling
decisions. The form does not perform variant interpretation.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Pedigree errors (patient does not know diagnoses or ages) | Uncertainty explicitly captured per pedigree slot; engine excludes uncertain data from numerical scores; counsellor reviews |
| H2 | Manchester score mis-computed | Engine implements both 2004 and 2009 published rules; covered by unit tests against published worked examples |
| H3 | Lynch-syndrome criteria mis-applied to non-CRC cancers | Form requires Lynch-associated cancer type (CRC, endometrial, ovarian, gastric, small-bowel, ureter/renal pelvis, biliary, glioblastoma, sebaceous adenoma) before Bethesda points awarded |
| H4 | Insurance / discrimination concern | Form signposts the UK Code on Genetic Testing and Insurance and offers literature explaining the moratorium |
| H5 | Misinterpretation of commercial test report | Form records DTC results as "consumer test — not diagnostic" and never uses them to drive recommendations |
| H6 | Children's genetic data | Paediatric pathway invoked for under-16 referrals; testing of children for adult-onset conditions follows published professional guidance |
| H7 | Reproductive-genetics urgency | Pregnancy with positive carrier status flagged for 4-week referral target |
| H8 | Sensitive ancestry / consanguinity questions | Framed neutrally; multi-language; explanation of why it matters genetically |
| H9 | Confidentiality | Family-history data is implicitly third-party data; consent question included; back-end follows NHS DSPT controls |

## Verification artefacts

- `genetics-grader.test.ts` — unit tests for Manchester, Bethesda,
  Amsterdam, PREMM5 calculations against published worked examples
- `rules.ts` tests — coverage of cancer-genetics, neurogenetics, and
  reproductive-genetics referral triggers
- Reference pedigrees per scoring instrument

## Outstanding work

- Annual review against NHS National Genomic Test Directory updates
- Review against current Manchester / Bethesda / Amsterdam / PREMM5
  literature
- BOADICEA / CanRisk integration (currently external link)
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Expert review of pedigree capture flow

## Code on Genetic Testing and Insurance

DHSC / ABI Code: <https://www.gov.uk/government/publications/code-on-genetic-testing-and-insurance>
