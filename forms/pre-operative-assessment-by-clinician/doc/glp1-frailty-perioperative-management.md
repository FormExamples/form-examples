# GLP-1 Receptor Agonist Management and Expanded Frailty Assessment

This document is the clinical reference for two intersecting fields added to
step 13 (Medications and allergies) and step 14 (Functional capacity and
frailty): perioperative management of GLP-1 receptor agonists, and expanded
frailty screening beyond the Clinical Frailty Scale (CFS). See
[`../spec/glp-frailty/index.md`](../spec/glp-frailty/index.md) for the source
brief this was built from.

Combining GLP-1 receptor agonist (GLP-1 RA) management with frailty
assessment matters because the two risks compound: a frail patient on a
GLP-1 RA is more vulnerable to pulmonary aspiration, postoperative delirium,
and functional decline than either risk factor alone.

## 1. GLP-1 receptor agonist management

GLP-1 receptor agonists (semaglutide, tirzepatide, dulaglutide, liraglutide,
exenatide) delay gastric emptying, which raises the risk of a "full stomach"
and pulmonary aspiration under general anaesthesia or deep sedation, even
after a standard fast.

**Fields:** `glp1Management.onGlp1ReceptorAgonist`, `glp1AgonistName`,
`glp1Formulation`, `glp1LastDoseAt`, `glp1HeldPerGuideline`,
`glp1ExtendedClearFluidsConfirmed`, `glp1GiSymptoms`,
`glp1GiSymptomsDetails`, `glp1GastricUltrasoundPerformed`,
`glp1GastricUltrasoundFindings`, `glp1FullStomachPrecautionsPlanned`,
`glp1Notes`.

### Preoperative fasting options

Two accepted strategies, per the ASA consensus-based guidance and Yale's
perioperative GLP-1 management protocol:

1. **Extended fasting** — a 24-hour solid-food fast combined with a 4–8 hour
   clear-liquid fast before the procedure, used when the medication itself
   is not held.
2. **Holding the medication** — hold daily formulations on the day of
   surgery; hold weekly formulations exactly one week before the procedure.

### Symptom screening

Active gastrointestinal symptoms (severe nausea, vomiting, bloating,
abdominal pain) signal a significantly elevated risk of a full stomach. If
present, discuss delaying elective surgery with the surgical team.

### Anaesthetic strategy

If the medication was not held per guideline, or the patient remains
symptomatic, apply full-stomach precautions: rapid-sequence induction,
point-of-care gastric ultrasound to assess residual gastric content, or a
regional-anaesthesia technique where appropriate, in preference to a
standard-risk general anaesthetic approach.

### Sources

- Springer, *Perioperative Management of Patients on GLP-1 Receptor
  Agonists* (2025). <https://link.springer.com/article/10.1007/s42399-025-02079-9>
- British Journal of Anaesthesia, GLP-1 receptor agonists and anaesthesia.
  <https://www.bjanaesthesia.org.uk/article/S0007-0912%2825%2900214-4/fulltext>
- UK gov.uk MHRA Drug Safety Update — GLP-1 and dual GIP/GLP-1 receptor
  agonists: potential risk of pulmonary aspiration during general
  anaesthesia or deep sedation.
  <https://www.gov.uk/drug-safety-update/glp-1-and-dual-gip-slash-glp-1-receptor-agonists-potential-risk-of-pulmonary-aspiration-during-general-anaesthesia-or-deep-sedation>
- Medscape, *New guidance: GLP-1 users should fast 24 hours before
  anesthesia* (2025).
  <https://www.medscape.com/viewarticle/new-rec-glp-1-users-should-fast-24-hours-before-anesthesia-2025a1000f6d>
- Yale School of Medicine, *Guidelines for Perioperative GLP-1 Receptor
  Agonist Management*.
  <https://medicine.yale.edu/publication-details/guidelines-for-perioperative-glp-1-receptor-agonist-management/>
- American Society of Anesthesiologists, *Consensus-Based Guidance on
  Preoperative* (GLP-1 receptor agonists) (2023).
  <https://www.asahq.org/about-asa/newsroom/news-releases/2023/06/american-society-of-anesthesiologists-consensus-based-guidance-on-preoperative>
- Association of Anaesthetists, perioperative care of the patient on a
  GLP-1 receptor agonist.
  <https://associationofanaesthetists-publications.onlinelibrary.wiley.com/doi/10.1111/anae.16541>

## 2. Expanded frailty assessment

Frailty reflects a decline in physical and physiological reserve, making
patients exceptionally vulnerable to surgical stressors. The British
Geriatrics Society (BGS) recommends systematic frailty screening for all
surgical patients over 65.

**Fields:** `functionalCapacity.friedWeakness`, `friedSlowness`,
`friedLowPhysicalActivity`, `friedExhaustion`,
`friedUnintentionalWeightLoss`, `riskAnalysisIndexScore`,
`miniCogPerformed`, `miniCogScore`, `prehabilitationIndicated`,
`prehabilitationType`, `prehabilitationStartDate`,
`proteinSupplementationRecommended`. These sit alongside the existing
`clinicalFrailtyScale` field (step 14).

### Screening tools

- **Clinical Frailty Scale (CFS)** — the existing 9-point clinician-rated
  scale evaluating baseline functional status and independence (already
  implemented; see [`asa-grading-rules.md`](asa-grading-rules.md)).
- **Fried Frailty Phenotype** — measures 5 objective physical criteria:
  weakness, slowness, low physical activity, exhaustion, and unintentional
  weight loss. Score = count of criteria met; 0 = robust, 1–2 = pre-frail,
  3–5 = frail. Computed by `computeFriedPhenotypeScore()` in
  `frailty-rules.ts` (mirrored in `composite-grader.js`) and reported in
  `GradingResult.friedPhenotypeScore` / `friedFrailtyCategory`.
- **Risk Analysis Index (RAI)** — a 14-variable deficit-accumulation tool
  widely validated for predicting postoperative complications, recorded as
  a single `riskAnalysisIndexScore`; higher scores indicate greater
  frailty.

### Triggering interventions

- **CFS ≥ 5** directly triggers a formal cognitive assessment (Mini-Cog) to
  evaluate delirium risk, alongside a Comprehensive Geriatric Assessment
  (CGA). The `cognitive-assessment-indicated` safety flag fires when CFS is
  5 or above and `miniCogPerformed` is not yet `'yes'`.
- **Prehabilitation** — multimodal programmes (high-protein nutrition,
  aerobic training, resistance exercise) started 2–6 weeks before surgery
  mitigate functional decline. Recorded via `prehabilitationIndicated`,
  `prehabilitationType`, and `prehabilitationStartDate`.

### Sources

- British Geriatrics Society, *Guideline for the care of people living with
  frailty undergoing elective and emergency surgery*.
  <https://www.bgs.org.uk/guideline-for-the-care-of-people-living-with-frailty-undergoing-elective-and-emergency-surgery>
- British Geriatrics Society, *Identification of frailty in the
  perioperative care setting using the Clinical Frailty Scale*.
  <https://www.bgs.org.uk/identification-of-frailty-in-the-perioperative-care-setting-using-the-clinical-frailty-scale-a>
- PMC, systematic review of perioperative frailty screening tools.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC12400007/>
- JAMA Surgery, *Risk Analysis Index* validation.
  <https://jamanetwork.com/journals/jamasurgery/fullarticle/2755273>
- PMC, Risk Analysis Index and postoperative outcomes.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC7536652/>
- PMC, prehabilitation before major surgery.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC8688225/>
- PMC, multimodal prehabilitation programmes.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10125297/>

## 3. Intersecting risks: the frail patient on a GLP-1 receptor agonist

When a frail patient (Fried Phenotype "frail", or CFS ≥ 5) is also taking a
GLP-1 receptor agonist, three additional safety flags fire in
`flagged-issues.ts` (mirrored in `flagged-issues.js`):

1. **`sarcopenia-risk`** (medium) — GLP-1 receptor agonists can induce
   muscle-mass loss alongside fat loss. Frail patients require protein
   supplementation and resistance-exercise prehabilitation to avoid
   worsening baseline weakness.
2. **`dehydration-aki-risk`** (high) — prolonged preoperative fasting
   combined with active GLP-1 side effects (nausea, diarrhoea) can rapidly
   trigger acute kidney injury or delirium in a frail system. Fires when
   the patient is frail, on a GLP-1 receptor agonist, and reporting active
   GI symptoms.
3. **`rebound-glycaemic-risk`** (medium) — if a GLP-1 receptor agonist is
   held, or fasting is extended, strict blood-glucose tracking is required
   to prevent rebound hyperglycaemia or hypoglycaemia when combined with
   insulin. Fires for any patient (not only frail patients) on a GLP-1
   receptor agonist that was held or fasting-extended, who is also on
   insulin.

A fourth flag, **`glp1-aspiration-risk`** (high), fires independently of
frailty whenever a patient is on a GLP-1 receptor agonist with active GI
symptoms, or the medication was neither held per guideline nor the
extended clear-fluid fast confirmed — see §1 above.

### Sources

- PMC, intersecting risk of frailty and GLP-1 receptor agonist use in
  perioperative patients.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC12943638/>
- ScienceDirect, GLP-1 receptor agonists and sarcopenia risk.
  <https://www.sciencedirect.com/science/article/pii/S1472029926001062>
- Healio, *Balance the benefits, risks of GLP-1 medications in orthopedic
  surgery* (2025).
  <https://www.healio.com/news/orthopedics/20250415/balance-the-benefits-risks-of-glp1-medications-in-orthopedic-surgery>
- Ubie Health, GLP-1 medications and muscle loss in seniors.
  <https://ubiehealth.com/doctors-note/seniors-muscle-loss-glp1-prone>
- Bolt Pharmacy, GLP-1 safety considerations for seniors.
  <https://www.boltpharmacy.co.uk/guide/is-glp-1-safe-for-seniors>
- PMC, dehydration and acute kidney injury risk in frail surgical
  patients. <https://pmc.ncbi.nlm.nih.gov/articles/PMC5726428/>
- British Journal of Anaesthesia, perioperative glycaemic management on
  GLP-1 receptor agonists.
  <https://www.bjanaesthesia.org.uk/article/S0007-0912%2826%2900054-1/fulltext>
- Bolt Pharmacy, GLP-1 monitoring tools for home use.
  <https://www.boltpharmacy.co.uk/guide/glp1-monitoring-tools-for-home-use>

## Safety flag categories added

Added to the `pre_operative_assessment_by_clinician_grade_flag.category`
CHECK constraint, `AdditionalFlag.category` in `types.ts`, and detected in
`flagged-issues.ts` / `flagged-issues.js`:

| Category | Priority | Fires when |
| --- | --- | --- |
| `glp1-aspiration-risk` | high | On a GLP-1 receptor agonist with active GI symptoms, or not held/fasting-extended per guideline |
| `cognitive-assessment-indicated` | medium | CFS ≥ 5 and Mini-Cog not yet performed |
| `sarcopenia-risk` | medium | Frail (Fried "frail" or CFS ≥ 5) and on a GLP-1 receptor agonist |
| `dehydration-aki-risk` | high | Frail, on a GLP-1 receptor agonist, and reporting active GI symptoms |
| `rebound-glycaemic-risk` | medium | On a GLP-1 receptor agonist that was held or fasting-extended, and on insulin |

## Data model changes

- `sql/08_create_table_pre_operative_assessment_by_clinician.sql` — 12
  `glp1_*` columns and 12 frailty-extension columns (`fried_*`,
  `risk_analysis_index_score`, `mini_cog_*`, `prehabilitation_*`,
  `protein_supplementation_recommended`).
- `sql/09_create_table_pre_operative_assessment_by_clinician_grade.sql` —
  `fried_phenotype_score`, `fried_frailty_category`.
- `sql/11_create_table_pre_operative_assessment_by_clinician_grade_flag.sql`
  — the five new `category` values above.
- `back-end-with-loco/migration/src/m20260814_090000_add_glp1_and_frailty_fields_to_pre_operative_assessment_by_clinicians.rs`
  mirrors the same columns onto the Loco entities and controller `Params`.
