# Grading rules

The gerontology-assessment form implements the **Clinical Frailty Scale
(CFS)** as the primary frailty stratification instrument, with supporting
scales for functional ability, cognition, mobility, nutrition, and
polypharmacy. The output is a CFS score (1–9) plus a Comprehensive
Geriatric Assessment-style summary of identified problems.

## Clinical Frailty Scale (CFS)

Primary source:

- Rockwood K, Song X, MacKnight C, et al. *A global clinical measure of
  fitness and frailty in elderly people.* CMAJ. 2005;173(5):489–495. DOI:
  <https://doi.org/10.1503/cmaj.050051>
- CFS, version 2.0 (2020 update with consistent terminology and revised
  visuals). Dalhousie University Geriatric Medicine Research:
  <https://www.dal.ca/sites/gmr/our-tools/clinical-frailty-scale.html>

CFS levels:

| Score | Label | Brief description |
| ----: | ----- | ----------------- |
| 1 | Very Fit | Robust, active, energetic, motivated; exercise regularly |
| 2 | Fit | No active disease; less active than category 1 |
| 3 | Managing Well | Medical problems well controlled; not regularly active beyond walking |
| 4 | Living with Very Mild Frailty (formerly "Vulnerable") | Not dependent for daily help but symptoms limit activities |
| 5 | Living with Mild Frailty | Evident slowing; need help with high-order IADLs |
| 6 | Living with Moderate Frailty | Need help with all outside activities and with bathing |
| 7 | Living with Severe Frailty | Completely dependent for personal care, from whatever cause |
| 8 | Living with Very Severe Frailty | Completely dependent and approaching end of life |
| 9 | Terminally Ill | Life expectancy < 6 months, not otherwise evidently frail |

The form uses CFS v2.0 labels and the published descriptive vignettes. The
CFS score is assigned by the clinician based on clinical judgement; the
form does not algorithmically compute it.

## Supporting instruments

The form's individual step graders cite the published instruments below.
Where multiple instruments are validated, the form presents the most widely
used in UK NHS practice.

### Functional ability

- Katz S. *Studies of illness in the aged. The Index of ADL.* JAMA.
  1963;185:914–919. DOI:
  <https://doi.org/10.1001/jama.1963.03060120024016>
- Lawton MP, Brody EM. *Assessment of older people: self-maintaining and
  instrumental activities of daily living.* Gerontologist. 1969;9(3):179–186.
  DOI: <https://doi.org/10.1093/geront/9.3_part_1.179>

### Cognition

- Folstein MF, Folstein SE, McHugh PR. *"Mini-mental state". A practical
  method for grading the cognitive state of patients for the clinician.*
  J Psychiatr Res. 1975;12(3):189–198. DOI:
  <https://doi.org/10.1016/0022-3956(75)90026-6>
- Nasreddine ZS, Phillips NA, Bédirian V, et al. *The Montreal Cognitive
  Assessment, MoCA: a brief screening tool for mild cognitive impairment.*
  J Am Geriatr Soc. 2005;53(4):695–699. DOI:
  <https://doi.org/10.1111/j.1532-5415.2005.53221.x>
- 4AT (rapid clinical test for delirium and cognitive impairment):
  <https://www.the4at.com/>

### Mobility and falls

- Podsiadlo D, Richardson S. *The Timed "Up & Go": a test of basic
  functional mobility for frail elderly persons.* J Am Geriatr Soc.
  1991;39(2):142–148. DOI: <https://doi.org/10.1111/j.1532-5415.1991.tb01616.x>
- NICE CG161 — *Falls in older people: assessing risk and prevention*:
  <https://www.nice.org.uk/guidance/cg161>

### Nutrition

- Malnutrition Universal Screening Tool (MUST), BAPEN:
  <https://www.bapen.org.uk/screening-and-must/must/>
- NICE CG32 — *Nutrition support for adults*:
  <https://www.nice.org.uk/guidance/cg32>

### Polypharmacy

- American Geriatrics Society. *2023 American Geriatrics Society Beers
  Criteria® for Potentially Inappropriate Medication Use in Older Adults.*
  J Am Geriatr Soc. 2023;71(7):2052–2081. DOI:
  <https://doi.org/10.1111/jgs.18372>
- STOPP/START criteria, version 3:
  O'Mahony D, Cherubini A, Guiteras AR, et al. *STOPP/START criteria for
  potentially inappropriate prescribing in older people: version 3.*
  Eur Geriatr Med. 2023;14(4):625–632. DOI:
  <https://doi.org/10.1007/s41999-023-00777-y>

### Mood

- Geriatric Depression Scale (GDS-15):
  Sheikh JI, Yesavage JA. *Geriatric Depression Scale (GDS): recent
  evidence and development of a shorter version.* Clin Gerontol.
  1986;5(1–2):165–173. DOI: <https://doi.org/10.1300/J018v05n01_09>

### Continence

- NICE NG123 — *Urinary incontinence and pelvic organ prolapse in women*
  (also relevant for older male patients):
  <https://www.nice.org.uk/guidance/ng123>

## Output

- CFS score and label
- Per-domain finding (functional, cognitive, mobility, nutrition,
  polypharmacy, mood, continence)
- Flagged-issues list (e.g. ≥ 2 falls in 12 months, MUST ≥ 2, suspected
  delirium, polypharmacy with Beers/STOPP hits)
- Recommended CGA actions and onward referrals
- Structured PDF for the patient record

## Notes

- The form is not a replacement for clinician-led Comprehensive Geriatric
  Assessment; it is a structured supporting tool.
- The form does not predict mortality.
- The CFS is intended for use in patients aged 65+ and is not validated
  for younger adults with stable single-system disease.
