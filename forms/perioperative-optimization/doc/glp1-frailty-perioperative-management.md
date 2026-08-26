# GLP-1 Receptor Agonist Management and Expanded Frailty Assessment

This document is the clinical reference for the expanded GLP-1 receptor
agonist fields (step 4, the medication domain), the Fried Frailty
Phenotype / Risk Analysis Index / Mini-Cog fields (step 12, frailty), and the
protein-supplementation field (step 11, physical fitness). See the sibling
form's
[`../../pre-operative-assessment-by-clinician/spec/glp-frailty/index.md`](../../pre-operative-assessment-by-clinician/spec/glp-frailty/index.md)
for the source brief this was built from, and
[`medication-hold-rules.md`](medication-hold-rules.md) for the GLP-1
medication-hold discussion this document extends.

A frail patient on a GLP-1 receptor agonist compounds two risks that are
each modest alone: pulmonary aspiration and functional decline. This form's
whole purpose — matching modifiable risk against the time available — makes
it a natural home for the frailty-intersecting risks below, since
prehabilitation (protein, resistance exercise) is already this form's
primary output for the physical-fitness domain.

## GLP-1 receptor agonist management (medication domain)

See [`medication-hold-rules.md`](medication-hold-rules.md) for the fasting
and hold-plan discussion. This form does not gate GLP-1 receptor agonist use
through a dedicated domain; it uses the existing generic `medication` domain
(any hold-requiring class in use without an agreed plan triggers
`R-MEDICATION-1`, one week's lead time) plus a dedicated, more specific
safety flag, `glp1-agonist-aspiration-risk`, that reasons about the GLP-1
fields directly rather than the generic hold-plan checkbox.

## Expanded frailty assessment (step 12)

The Clinical Frailty Scale (CFS) is reported and flagged (`severe-frailty`
at CFS ≥ 7) but never gated, because frailty is rarely reversible in a
weeks-long window. The same applies to the three new instruments:

- **Fried Frailty Phenotype** (Fried et al. 2001) — 5 objective criteria:
  weakness, slowness, low physical activity, exhaustion, unintentional
  weight loss. Score = count met; 0 = robust, 1–2 = pre-frail, 3–5 = frail.
  Computed by `computeFriedPhenotypeScore()` in `domain-rules.ts` (mirrored
  in `js/domain-rules.js`) alongside the form's other derived instrument
  scores (MUST, AUDIT-C), and reported in
  `GradingResult.friedPhenotypeScore` / `friedFrailtyCategory`.
- **Risk Analysis Index (RAI)** — a 14-variable deficit-accumulation tool
  widely validated for predicting postoperative complications, recorded as
  a single `riskAnalysisIndexScore`.
- **Mini-Cog** — indicated when CFS is 5 or above. The
  `cognitive-assessment-indicated` flag fires at that threshold when
  `miniCogPerformed` is not yet `'yes'`.

## Intersecting risks: frailty x GLP-1 receptor agonist

Three flags fire in `flagged-issues.ts` (mirrored in `js/flagged-issues.js`)
for a patient who is both frail (Fried "frail" or CFS ≥ 5) and on a GLP-1
receptor agonist:

1. **`sarcopenia-risk`** (medium) — GLP-1 receptor agonists can induce
   muscle-mass loss alongside fat loss. The new `proteinSupplementationRecommended`
   field on the fitness section (step 11) closes the loop with this form's
   existing prehabilitation plan.
2. **`dehydration-aki-risk`** (high) — prolonged preoperative fasting
   combined with active GLP-1 side effects (nausea, diarrhoea) can rapidly
   trigger acute kidney injury or delirium in a frail system. Fires when
   the patient is frail, on a GLP-1 receptor agonist, and reporting active
   GI symptoms.
3. **`rebound-glycaemic-risk`** (medium) — if a GLP-1 receptor agonist is
   held, or fasting is extended, strict blood-glucose tracking is required
   to prevent rebound hyperglycaemia or hypoglycaemia when combined with
   insulin (`glycaemic.insulinRegimen` non-empty). Not gated on frailty —
   this risk applies to any patient on insulin.

## Safety flag categories added

Added to the `perioperative_optimization_grade_flag.category` CHECK
constraint, `FlagCategory` in `types.ts`, and detected in
`flagged-issues.ts` / `js/flagged-issues.js` (`glp1-agonist-aspiration-risk`
and `severe-frailty` already existed and are unchanged in category, though
the GLP-1 flag's firing condition is now more specific — see
[`medication-hold-rules.md`](medication-hold-rules.md)):

| Category | Priority | Fires when |
| --- | --- | --- |
| `cognitive-assessment-indicated` | medium | CFS ≥ 5 and Mini-Cog not yet performed |
| `sarcopenia-risk` | medium | Frail (Fried "frail" or CFS ≥ 5) and on a GLP-1 receptor agonist |
| `dehydration-aki-risk` | high | Frail, on a GLP-1 receptor agonist, and reporting active GI symptoms |
| `rebound-glycaemic-risk` | medium | On a GLP-1 receptor agonist that was held or fasting-extended, and on insulin |

## Sources

- Springer, *Perioperative Management of Patients on GLP-1 Receptor
  Agonists* (2025). <https://link.springer.com/article/10.1007/s42399-025-02079-9>
- British Journal of Anaesthesia, GLP-1 receptor agonists and anaesthesia.
  <https://www.bjanaesthesia.org.uk/article/S0007-0912%2825%2900214-4/fulltext>
- UK gov.uk MHRA Drug Safety Update — GLP-1 and dual GIP/GLP-1 receptor
  agonists: potential risk of pulmonary aspiration.
  <https://www.gov.uk/drug-safety-update/glp-1-and-dual-gip-slash-glp-1-receptor-agonists-potential-risk-of-pulmonary-aspiration-during-general-anaesthesia-or-deep-sedation>
- Yale School of Medicine, *Guidelines for Perioperative GLP-1 Receptor
  Agonist Management*.
  <https://medicine.yale.edu/publication-details/guidelines-for-perioperative-glp-1-receptor-agonist-management/>
- American Society of Anesthesiologists, *Consensus-Based Guidance on
  Preoperative* (GLP-1 receptor agonists) (2023).
  <https://www.asahq.org/about-asa/newsroom/news-releases/2023/06/american-society-of-anesthesiologists-consensus-based-guidance-on-preoperative>
- British Geriatrics Society, *Guideline for the care of people living with
  frailty undergoing elective and emergency surgery*.
  <https://www.bgs.org.uk/guideline-for-the-care-of-people-living-with-frailty-undergoing-elective-and-emergency-surgery>
- JAMA Surgery, *Risk Analysis Index* validation.
  <https://jamanetwork.com/journals/jamasurgery/fullarticle/2755273>
- PMC, intersecting risk of frailty and GLP-1 receptor agonist use in
  perioperative patients. <https://pmc.ncbi.nlm.nih.gov/articles/PMC12943638/>
- PMC, dehydration and acute kidney injury risk in frail surgical
  patients. <https://pmc.ncbi.nlm.nih.gov/articles/PMC5726428/>
