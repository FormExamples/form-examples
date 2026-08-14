# Genetic Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
genetic / genomic test results. These sources anchor the four-axis
interpretation grade, the ACMG/AMP (ACGS) variant-classification categories, and
the critical-result / actionable-finding alerting rules used by this form.

## Variant classification

### ACMG/AMP — Standards and guidelines for the interpretation of sequence variants (2015)

The joint consensus recommendation of the American College of Medical Genetics
and Genomics (ACMG) and the Association for Molecular Pathology (AMP) is the
internationally adopted framework for classifying sequence variants. It defines a
systematic scoring process over ~28 weighted criteria (population, computational,
functional, segregation, and de novo evidence) that resolves to a **five-tier
classification**:

- **Pathogenic (P)**
- **Likely pathogenic (LP)**
- **Variant of uncertain significance (VUS)**
- **Likely benign (LB)**
- **Benign (B)**

(plus **no variant detected** for a negative result). More than 95 % of surveyed
clinical laboratories use the ACMG/AMP five tiers for Mendelian-disease genes.
This maps directly to the form's `variant_classification` field and the
`reporting_category` ACMG class label, and drives Axis A (result classification)
and Axis B (severity).

- Richards S, et al. Standards and guidelines for the interpretation of sequence
  variants: a joint consensus recommendation of the ACMG and the AMP. *Genetics
  in Medicine*, 2015. <https://pubmed.ncbi.nlm.nih.gov/25741868/>
- Standards and Guidelines for the Interpretation and Reporting of Sequence
  Variants in Cancer (AMP/ASCO/CAP). *The Journal of Molecular Diagnostics*,
  2017. <https://www.jmdjournal.org/article/s1525-1578(16)30223-9/fulltext>

### ACGS — UK best-practice guidelines for variant classification

The Association for Clinical Genomic Science (ACGS) publishes the UK
specialization of the ACMG/AMP framework, used across NHS Genomic Laboratory
Hubs to achieve accurate and consistent classification. The 2024 edition adds
recommendations such as: variants should not be classified as likely pathogenic
on in-silico (PP3_str) and rarity (PM2_mod) evidence alone; a single missense
predictor should be used to avoid bias; and meta-predictors such as REVEL
(ACGS-recommended threshold ≥0.7) or BayesDel are preferred.

- ACGS — Best Practice Guidelines for Variant Classification in Rare Disease 2024.
  <https://www.genomicseducation.hee.nhs.uk/wp-content/uploads/2024/08/ACGS-2024_UK-practice-guidelines-for-variant-classification.pdf>
- ACGS variant-classification guidelines index.
  <https://www.acgs.uk.com/quality/best-practice-guidelines/>

### CanVIG-UK — cancer-susceptibility gene specifications

The Cancer Variant Interpretation Group UK (CanVIG-UK) provides consensus
specifications of the ACGS/ACMG-AMP guidelines for cancer-susceptibility genes,
combining evidence for and against pathogenicity. Relevant where the test type is
a familial-cancer panel.

- CanVIG-UK consensus guidance.
  <https://www.cangene-canvaruk.org/canvig-uk-guidance>
- Garrett A, et al. Combining evidence for and against pathogenicity for variants
  in cancer susceptibility genes: CanVIG-UK consensus recommendations.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8086256/>

## Reporting, actionability and cascade testing

### NHS Genomic Medicine Service / National Genomic Test Directory

The NHS Genomic Medicine Service (GMS), delivered through Genomic Laboratory
Hubs, sets out which genomic tests are commissioned and the eligibility criteria
in the National Genomic Test Directory. An actionable pathogenic / likely
pathogenic result triggers downstream management and **cascade (predictive)
testing** of at-risk relatives — underpinning the form's
`recommended_cascade_testing` field, the `cascade-testing-recommended` flag, and
the follow-up-urgency axis.

- NHS England — The National Genomic Test Directory.
  <https://www.england.nhs.uk/genomics/the-national-genomic-test-directory/>
- NHS Genomics Education Programme — The National Genomic Test Directory.
  <https://www.genomicseducation.hee.nhs.uk/genotes/knowledge-hub/the-national-genomic-test-directory/>

### Critical / actionable result communication

A pathogenic or likely-pathogenic actionable variant, or a secondary actionable
finding, must be communicated to the referring team and documented; this drives
the `critical_result_communicated` / `reported_to` fields and the
`critical-result-alert` / `pathogenic-variant-found` safety flags.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| ACMG/AMP five-tier classification | `variant_classification`, `reporting_category` (Axis A / Axis B) |
| ACGS UK best-practice classification | `variant_classification`, severity axis |
| CanVIG-UK cancer-gene specifications | `variant_classification` for familial-cancer panels |
| Actionable-result management | `interpretation`, `impression`, `recommended_follow_up`, follow-up-urgency axis |
| Cascade testing of relatives | `recommended_cascade_testing`, `cascade-testing-recommended` flag |
| Critical-result communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| Mandatory report sections | report-completeness axis (`report_completeness_percent`) |
