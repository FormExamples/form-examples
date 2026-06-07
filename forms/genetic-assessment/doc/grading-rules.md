# Grading rules

The genetic-assessment form is a referral-triage questionnaire for genetic
counselling. It maps a small set of weighted risk factors across cancer,
cardiovascular, neurological, and reproductive genetics onto a
three-level risk band:

| Band | Composite weight | Action |
| ---- | ---------------- | ------ |
| Low | 0–2 | Reassurance and family history record; no referral required |
| Moderate | 3–5 | Refer to community genetics service or specialty MDT |
| High | ≥ 6 | Refer to regional Clinical Genetics service for formal counselling and consideration of diagnostic testing |

The bands are presentational; the underlying weighting is a simple count of
canonical referral-criterion matches across the domains below.

## Cancer genetics weighting

Cancer-genetics referral criteria follow NICE CG164 *Familial breast
cancer* and NCCN family-history guidance:

- NICE CG164 — *Familial breast cancer*: <https://www.nice.org.uk/guidance/cg164>
- NCCN Clinical Practice Guidelines portal:
  <https://www.nccn.org/guidelines/category_2>

For each cancer below, the form awards +1 weight per qualifying family
feature drawn from CG164 §1.2 and NCCN family-history criteria. Higher
weights drive a higher overall band.

Examples of qualifying features (not exhaustive):

- Two or more first-degree or one first-degree and one second-degree relative
  with breast cancer where average age at diagnosis is < 50
- One first-degree relative with ovarian cancer plus one first-degree or
  second-degree relative with breast cancer
- A first-degree male relative with breast cancer
- Bilateral breast cancer in a first-degree relative
- A first-degree relative with triple-negative breast cancer aged < 50
- Three or more relatives with colorectal cancer in a single lineage, one
  diagnosed under 50 (Lynch syndrome consideration)
- Known pathogenic BRCA1/BRCA2/Lynch syndrome variant in the family

The form's weighting is conservative; final eligibility for diagnostic
testing is determined by Clinical Genetics following formal counselling.

## Cardiovascular genetics

References:

- ESC *Guidelines on the management of cardiomyopathies* (2023):
  <https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Cardiomyopathies-Guidelines>
- ESC *Guidelines for the diagnosis and management of patients with
  inherited arrhythmias* (most recent edition):
  <https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines>

Weighted features include:

- Sudden cardiac death in first-degree relative aged < 40
- Inherited cardiomyopathy in family
- Channelopathy diagnosed in family (LQTS, Brugada, CPVT)
- Familial hypercholesterolaemia per NICE CG71:
  <https://www.nice.org.uk/guidance/cg71>

## Neurogenetics

References:

- NICE NG127 — *Suspected neurological conditions* (referral pathway):
  <https://www.nice.org.uk/guidance/ng127>
- NHS National Genomic Test Directory:
  <https://www.england.nhs.uk/publication/national-genomic-test-directories/>

Weighted features:

- Family history of Huntington's disease, hereditary ataxia, hereditary
  motor and sensory neuropathy, hereditary spastic paraparesis, familial
  motor neuron disease, mitochondrial disease
- Early-onset dementia in family
- Suspected genetic epilepsy syndrome

## Reproductive genetics

References:

- RCOG Green-top Guideline No. 17 — *Recurrent miscarriage*
- ESHRE Guideline portal: <https://www.eshre.eu/Guidelines-and-Legal/Guidelines>
- Genetic carrier screening pathways are detailed in the NHS National
  Genomic Test Directory.

Weighted features:

- Two or more first-trimester miscarriages with parental karyotype
  consideration
- Consanguineous union (first cousin or closer)
- Known carrier status in patient or partner for a recessive condition
  (CF, SMA, sickle cell, thalassaemia, Tay-Sachs, etc.)
- Personal or family history of congenital anomaly with possible genetic
  basis

## Output

- Composite weight and band (Low/Moderate/High)
- Per-domain finding with the specific qualifying features identified
- Recommended referral pathway: community genetics, regional Clinical
  Genetics, specialty cancer-genetics MDT, paediatric clinical genetics
- Structured PDF for the GP referral letter

## Notes

- The form is a triage instrument; final eligibility for genetic testing is
  determined by formal genetic counselling and the NHS National Genomic
  Test Directory: <https://www.england.nhs.uk/publication/national-genomic-test-directories/>
- The form does not assign clinical likelihood scores (e.g. Manchester
  Score, BOADICEA / CanRisk). For those see the related genetics-assessment
  form.
- Direct-to-consumer genetic test results (23andMe etc.) are recorded as
  information but not used to drive recommendations.
