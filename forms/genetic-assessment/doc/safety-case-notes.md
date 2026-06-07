# Safety case notes

Working safety log for the genetic-assessment software.

## Intended purpose

A triage questionnaire that supports primary-care or specialty-MDT referral
decisions to clinical genetics services, aligned with NICE, NCCN, and ESC
guidance.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device. The form does
not interpret variants and does not deliver counselling.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Family history under-collected (patient does not know diagnoses or ages) | Form explicitly captures uncertainty per pedigree slot; downstream genetics service confirms |
| H2 | Wrong-side or wrong-degree relative recorded | UI shows pedigree schematic with maternal and paternal lineage colour coding |
| H3 | Misinterpretation of direct-to-consumer (23andMe) results | Form records the report but never uses it to drive clinical decisions; the report is flagged "consumer test — not diagnostic" |
| H4 | Anxiety in patient | Form provides signposting to NHS clinical genetics patient information and to genetics counsellor support; questions worded carefully |
| H5 | Discrimination concern (insurance) | Form signposts the UK Code on Genetic Testing and Insurance (ABI / DHSC) |
| H6 | Children's genetic data | Form's age check redirects under-16 referrals to paediatric clinical genetics with parental consent and Gillick competence considerations |
| H7 | Cultural / consanguinity sensitivity | Consanguinity question framed neutrally with multi-language support and explanation of why it matters genetically |
| H8 | Confidentiality of family data | Form prompts the patient to confirm willingness to share family history; back-end follows NHS DSPT controls |
| H9 | Pathway delays for time-sensitive cases | Pregnancy with carrier status flagged for 4-week referral target |

## Verification artefacts

- `risk-grader.test.ts` — unit tests for band logic
- `rules.ts` tests — coverage of CG164, CG71, NG127, NCCN criteria
- Reference vignettes per band

## Outstanding work

- Annual review against current NICE CG164/CG71/NG127, NCCN, ESC guidelines
- Update against new versions of the NHS National Genomic Test Directory
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Expert review of pedigree capture flow

## Code on Genetic Testing and Insurance

The form signposts the UK Code on Genetic Testing and Insurance (DHSC /
ABI agreement). Latest published version is at:
<https://www.gov.uk/government/publications/code-on-genetic-testing-and-insurance>
