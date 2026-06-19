# DEXA Bone Density Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
DEXA (dual-energy X-ray absorptiometry) bone-density examinations. These sources
anchor the quantitative findings (BMD, T-score, Z-score), the WHO densitometric
classification carried in the four-axis interpretation grade, and the
critical-result alerting rules used by this form.

## Densitometric classification

### WHO densitometric classification of osteoporosis

The World Health Organization classifies bone status from the **T-score** — the
number of standard deviations a patient's bone mineral density (BMD) lies from
the **young-adult** reference mean. The classification uses the **lowest**
(most negative) T-score at the lumbar spine, total hip, or femoral neck:

| Lowest T-score | WHO category |
| --- | --- |
| T ≥ −1.0 | Normal |
| −1.0 > T > −2.5 | Osteopenia (low bone mass) |
| T ≤ −2.5 | Osteoporosis |
| T ≤ −2.5 with one or more fragility fractures | Severe (established) osteoporosis |

This classification populates the form's `who_classification` field and is
carried into the grade's `reporting_category` (Axis B). It also drives the
result-classification and follow-up-urgency axes.

- International Osteoporosis Foundation — Diagnosis (WHO classification summary).
  <https://www.osteoporosis.foundation/health-professionals/diagnosis>
- Osteopenia — StatPearls, NCBI Bookshelf (T-score thresholds).
  <https://www.ncbi.nlm.nih.gov/books/NBK499878/>

### ISCD Official Positions

The International Society for Clinical Densitometry (ISCD) Official Positions
state that **T-scores are preferred and the WHO densitometric classification is
applicable** in postmenopausal women and men aged 50 or older; that osteoporosis
may be diagnosed when the T-score is **−2.5 or lower at the lumbar spine, total
hip, or femoral neck** (and, in selected situations, the 33 % / one-third
radius); and that the **Z-score**, not the T-score, should be used in
premenopausal women, men under 50, and children, with a Z-score ≤ −2.0
described as "below the expected range for age". This grounds the form's
distinct T-score and Z-score fields per site, the `lowest_t_score`
classification driver, and the choice of reference sites.

- ISCD — 2023 Official Adult Positions.
  <https://iscd.org/official-positions-2023/>

## Fracture-risk–based management

### NOGG / UK clinical guideline

The UK National Osteoporosis Guideline Group (NOGG) guideline frames management
on the concept of **fracture risk** rather than BMD readings in isolation. An
initial **FRAX** assessment provides the 10-year probability of a major
osteoporotic fracture and of hip fracture, stratifying patients into low,
intermediate, high, or very high risk; BMD/DEXA refines that estimate near the
intervention threshold. This underpins the form's `frax_major_fracture_percent`
and `frax_hip_fracture_percent` fields and the follow-up-urgency and
recommendation outputs (e.g. urgent treatment review for osteoporosis or severe
osteoporosis).

- NOGG — UK clinical guideline for the prevention and treatment of osteoporosis
  (2021).
  <https://www.nogg.org.uk/sites/nogg/download/NOGG-Guideline-2021-g.pdf>
- The 2024 UK clinical guideline for the prevention and treatment of
  osteoporosis (NOGG update), PMC.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12417299/>

## Vertebral fracture and severe osteoporosis

A vertebral or other fragility fracture in the presence of a T-score ≤ −2.5
defines **severe (established) osteoporosis** and materially raises future
fracture risk, warranting an urgent treatment review. This grounds the form's
`vertebral_fracture_identified` structured finding and the escalation invariant
that drives Axis D to *urgent / critical-alert*.

- Osteoporosis: Clinical Evaluation — Endotext, NCBI Bookshelf.
  <https://www.ncbi.nlm.nih.gov/books/NBK279049/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| WHO densitometric classification | `who_classification`, `lowest_t_score`, `reporting_category` (Axis B), result-classification axis |
| ISCD T-score / Z-score positions | per-site `*_t_score` / `*_z_score`, `bone_mineral_density_g_cm2`, reference-site choice |
| NOGG fracture-risk management / FRAX | `frax_major_fracture_percent`, `frax_hip_fracture_percent`, follow-up-urgency axis, `recommendation` |
| Severe osteoporosis / vertebral fracture | `vertebral_fracture_identified`, escalation invariant, `critical-result-alert` / `urgent-referral` flags |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
