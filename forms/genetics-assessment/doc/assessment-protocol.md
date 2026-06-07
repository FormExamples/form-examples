# Assessment protocol

## Intended use

A clinical-genetics intake questionnaire that captures a three-generation
pedigree, applies the validated risk scores (Manchester, Bethesda, Amsterdam,
PREMM5, Tyrer-Cuzick, BOADICEA/CanRisk) appropriate to the presenting
concern, and produces a stratified recommendation for testing and
counselling.

## Intended users

- Clinical genetics service intake clinicians and genetic counsellors
- Cancer-genetics MDT clinicians
- Specialty MDT consultants requesting genetics opinion (cardiology,
  neurology, paediatrics)

## Setting

UK regional Clinical Genetics service or affiliated cancer-genetics clinic.

## Workflow

1. **Proband demographics** — name, DOB, address, GP, ethnicity, preferred
   language.
2. **Presenting concern** — referrer's question, patient's question, prior
   testing carried out.
3. **Personal medical history** — cancers (type, age, treatment),
   congenital anomalies, neurodevelopmental disorders, cardiomyopathy,
   inherited metabolic disease.
4. **Three-generation family pedigree** — proband, parents, siblings,
   children, grandparents on both sides, uncles/aunts, first cousins; for
   each: name (initials), relationship, year of birth or age, current
   health status, diagnoses, ages at diagnosis, ages and causes of death.
5. **Consanguinity and ancestry** — degree of consanguinity (cousin grade),
   self-reported ancestry, founder-population context (Ashkenazi Jewish,
   French-Canadian, Finnish, etc.).
6. **Targeted risk scoring** — engine applies the relevant model(s) to the
   presenting concern: Manchester for BRCA, Bethesda + Amsterdam +
   PREMM5 for Lynch, Tyrer-Cuzick / BOADICEA / CanRisk for breast cancer.
7. **Prior genetic testing** — NHS testing dates and results; commercial
   testing; known familial variants.
8. **Patient understanding and concerns** — what the patient wants to
   achieve, fears, family implications, insurance concerns.
9. **Recommendation and referral plan** — engine outputs the band, the
   recommended next test, and the clinician's documented plan.

## Output

- Per-instrument numerical result
- Overall risk band (Low / Moderate / High)
- Recommended pathway: GP letter, surveillance pathway, predictive testing
  pathway, cancer-genetics MDT discussion
- Structured PDF for the clinical-genetics record and the referrer

## Safety-net behaviour

- Known pathogenic familial variant → direct to predictive-testing pathway
- Manchester score ≥ 15, or Amsterdam II met → confirm against NHS National
  Genomic Test Directory eligibility and discuss diagnostic testing
- Suspected hereditary cancer with very high pedigree burden → urgent MDT
  discussion
- Reproductive-genetics question with planned pregnancy < 12 months → urgent
  prenatal-genetics referral

## Out of scope

- Variant interpretation (clinical-genetics laboratory)
- Pre- and post-test counselling delivery (counsellor consultation)
- Direct interpretation of commercial test reports
- Pre-implantation genetic testing decisions (HFEA pathway)
