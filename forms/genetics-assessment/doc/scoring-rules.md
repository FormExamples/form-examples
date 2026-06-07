# Scoring rules

The genetics-assessment form is the clinical-genetics analogue of the
referral-triage genetic-assessment form. It combines a three-generation
family pedigree with targeted validated risk scores (Manchester Score for
BRCA, Bethesda criteria for Lynch syndrome, Tyrer-Cuzick / IBIS for
breast cancer, PREMM5 for Lynch) to stratify genetic risk and inform
testing decisions.

## Overall risk band

| Band | Definition |
| ---- | ---------- |
| Low | No referral criteria met; reassurance and family-history record |
| Moderate | Family history meets criteria for specialist genetics input but does not meet diagnostic-testing thresholds |
| High | Meets a published testing threshold (e.g. Manchester Score ≥ 15, BOADICEA / CanRisk BRCA carrier probability ≥ 10%, Amsterdam II for Lynch) or a known pathogenic family variant |

## Manchester Score (BRCA1/BRCA2)

Primary reference:

- Evans DGR, Eccles DM, Rahman N, et al. *A new scoring system for the
  chances of identifying a BRCA1/2 mutation outperforms existing models
  including BRCAPRO.* J Med Genet. 2004;41(6):474–480. DOI:
  <https://doi.org/10.1136/jmg.2003.017996>
- Evans DGR, Lalloo F, Cramer A, et al. *Addition of pathology and biomarker
  information significantly improves the performance of the Manchester
  scoring system for BRCA1 and BRCA2 testing.* J Med Genet. 2009;46(12):811–
  817. DOI: <https://doi.org/10.1136/jmg.2009.067850>

The Manchester score sums per-cancer points by age at diagnosis and by
BRCA1 vs BRCA2 cancer profile. Total scores ≥ 15 for either BRCA1 or
BRCA2 traditionally indicated the threshold for diagnostic testing in the
NHS.

The form captures all per-relative cancer ages and types and computes the
score; it does **not** make a testing decision, which remains a Clinical
Genetics responsibility per NICE CG164 and the NHS National Genomic Test
Directory.

## Bethesda criteria (Lynch syndrome — colorectal cancer)

- Umar A, Boland CR, Terdiman JP, et al. *Revised Bethesda Guidelines for
  hereditary nonpolyposis colorectal cancer (Lynch syndrome) and
  microsatellite instability.* J Natl Cancer Inst. 2004;96(4):261–268. DOI:
  <https://doi.org/10.1093/jnci/djh034>

Revised Bethesda criteria (any one of):

1. CRC diagnosed before age 50
2. Synchronous or metachronous CRC or other Lynch-associated tumour at any
   age
3. CRC with MSI-H histology in a person aged < 60
4. CRC in a person with one or more first-degree relatives with a
   Lynch-associated tumour, with one diagnosed before age 50
5. CRC in a person with two or more first- or second-degree relatives with
   Lynch-associated tumours, at any age

## Amsterdam II criteria (Lynch syndrome)

- Vasen HFA, Watson P, Mecklin J-P, Lynch HT. *New clinical criteria for
  hereditary nonpolyposis colorectal cancer (HNPCC, Lynch syndrome)
  proposed by the International Collaborative Group on HNPCC.*
  Gastroenterology. 1999;116(6):1453–1456. DOI:
  <https://doi.org/10.1016/s0016-5085(99)70510-x>

All three required:

1. At least three relatives with a Lynch-associated cancer, one of whom is
   a first-degree relative of the other two
2. At least two successive generations affected
3. At least one cancer diagnosed before age 50; FAP excluded; tumours
   verified by pathology

## PREMM5 (Lynch syndrome)

- Kastrinos F, Uno H, Ukaegbu C, et al. *Development and validation of the
  PREMM5 model for comprehensive risk assessment of Lynch syndrome.*
  J Clin Oncol. 2017;35(19):2165–2172. DOI:
  <https://doi.org/10.1200/JCO.2016.69.6120>
- PREMM5 calculator: <https://premm.dfci.harvard.edu/>

## Tyrer-Cuzick (IBIS) for breast cancer

- Tyrer J, Duffy SW, Cuzick J. *A breast cancer prediction model
  incorporating familial and personal risk factors.* Stat Med.
  2004;23(7):1111–1130. DOI: <https://doi.org/10.1002/sim.1668>
- IBIS Breast Cancer Risk Evaluation Tool:
  <https://ibis-risk-calculator.magview.com/>

## BOADICEA / CanRisk

- Lee A, Mavaddat N, Wilcox AN, et al. *BOADICEA: a comprehensive breast
  cancer risk prediction model incorporating genetic and nongenetic risk
  factors.* Genet Med. 2019;21(8):1708–1718. DOI:
  <https://doi.org/10.1038/s41436-018-0406-9>
- CanRisk tool (University of Cambridge): <https://www.canrisk.org/>

## NHS testing pathways

Final eligibility for diagnostic testing under the NHS is determined by
the NHS National Genomic Test Directory:

- <https://www.england.nhs.uk/publication/national-genomic-test-directories/>

## Output

- Per-instrument numerical result
- Overall risk band (Low/Moderate/High)
- Recommended pathway: GP letter, regional genetics, cancer-genetics MDT
- Structured PDF referral letter

## Notes

- The form computes scores using published algorithms but does not perform
  variant interpretation.
- Cancer-genetics testing pathways evolve regularly; the form's references
  must be reviewed annually against the current NHS National Genomic Test
  Directory.
