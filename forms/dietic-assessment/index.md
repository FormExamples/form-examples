# Dietetic Assessment

A UK-aligned, dietitian-driven **dietetic assessment**: a comprehensive
evaluation of a patient's nutritional status, eating patterns, medical history,
and food environment, conducted by a registered dietitian. The form records
objective findings and patient-reported intake, computes a **MUST**
(Malnutrition Universal Screening Tool) score with a **GLIM** malnutrition
diagnosis, a composite nutrition risk level, and a set of safety-critical
flags. The output is a signed dietetic report with a nutrition care plan
suitable for the clinical record.

> **Naming.** The directory slug is `dietic-assessment` as requested. The
> conventional clinical spelling of the profession's adjective is *dietetic*;
> the prose, table names, and report titles in this form use **Dietetic
> Assessment**, while the directory slug, SQL table names, and generated
> artefact names use the `dietic` / `dietic_assessment` stem so that every
> derived representation stays keyed to the directory.

Initial appointments typically last **45–60 minutes** for a general clinical or
outpatient visit, and up to **90 minutes** for a specialized programme (for
example home enteral feeding, bariatric surgery, inherited metabolic disease,
or intestinal failure). The form records the appointment type and planned
duration so the wizard can be worked through at the pace of the consultation.

## Relationship to `nutrition-assessment`

The monorepo already has [`nutrition-assessment`](../nutrition-assessment),
which is a **MUST screening** form: it establishes a malnutrition risk score
with supporting dietary, swallowing, and gastrointestinal detail. This form is
the **full dietitian consultation** that a positive screen leads to. The two
are complementary, not duplicates:

| | `nutrition-assessment` | `dietic-assessment` |
| --- | --- | --- |
| Purpose | screen for malnutrition risk | assess, diagnose, and plan |
| Operator | any clinician or nurse | registered dietitian |
| Instrument | MUST | MUST + GLIM + NRS-2002 + SARC-F + refeeding risk |
| Model | screening score | BDA Nutrition Care Process (ADIME) |
| Output | risk score and referral trigger | nutrition diagnosis (PES statement) and signed care plan |
| Duration | minutes | 45–60 minutes, up to 90 for a specialist programme |

A high-risk MUST score from `nutrition-assessment` is the usual referral
trigger into this form.

## Scope and intended users

- **Setting:** NHS outpatient dietetic clinic, acute inpatient dietetic review,
  community and home-visit dietetics, GP-practice-attached dietetic service,
  care-home nutrition review, or a specialist programme clinic.
- **Users:** registered dietitians (HCPC-registered), dietetic assistants and
  assistant practitioners working under supervision, dietetic students under
  supervision, specialist nutrition nurses, and nutrition-support team members.
- **Patients:** adults (≥ 16 years). Paediatric patients raise a `paediatric`
  flag directing the user to a paediatric-specific pathway, because MUST is not
  validated below 16 years of age.

## Scoring system

- **Primary instrument:** **MUST** — the Malnutrition Universal Screening Tool
  (BAPEN), a 0–6 score summing three components.

  | Component | 0 | 1 | 2 |
  | --- | --- | --- | --- |
  | BMI (kg/m²) | > 20.0 (> 30 obese) | 18.5–20.0 | < 18.5 |
  | Unplanned weight loss in 3–6 months | < 5 % | 5–10 % | > 10 % |
  | Acute disease effect: acutely ill **and** no/likely no nutritional intake for > 5 days | — | — | 2 |

  MUST risk category: **0 = low**, **1 = medium**, **≥ 2 = high**.

- **Secondary instruments:**
  - **GLIM** (Global Leadership Initiative on Malnutrition) — malnutrition
    diagnosis requiring ≥ 1 phenotypic criterion (unintentional weight loss,
    low BMI, reduced muscle mass) **and** ≥ 1 etiologic criterion (reduced
    intake or assimilation, inflammation/disease burden), then staged as
    moderate or severe malnutrition.
  - **NRS-2002** (Nutritional Risk Screening 2002, 0–7) for the acute
    inpatient setting, with the ≥ 3 at-risk threshold.
  - **SARC-F** (0–10) sarcopenia case-finding, with the ≥ 4 at-risk threshold.
  - **Refeeding-syndrome risk** per NICE CG32 (high-risk and highest-risk
    criteria).
  - **Bristol Stool Form Scale** (1–7) and **IDDSI** framework levels (0–7)
    for stool form and texture-modified diet / thickened fluids.

- **Composite nutrition risk:** Low / Moderate / High / Critical, driven by the
  worst-band finding across instruments (max-grade algorithm), so that a single
  critical finding — for example a refeeding-syndrome risk or an unsafe swallow
  — cannot be diluted by otherwise reassuring scores.

  | Category | Drivers |
  | --- | --- |
  | Low | MUST 0, no GLIM criteria, adequate intake — routine dietary advice, rescreen per local policy |
  | Moderate | MUST 1, single mid-band finding, SARC-F ≥ 4 — observe, document intake for 3 days, repeat screen |
  | High | MUST ≥ 2, GLIM moderate malnutrition, NRS-2002 ≥ 3, oral intake < 50 % of requirements — dietetic treatment plan, consider oral nutritional supplements |
  | Critical | GLIM severe malnutrition, refeeding-syndrome high risk, unsafe swallow with aspiration risk, BMI < 16, weight loss > 15 % — urgent nutrition-support team referral, biochemical monitoring before feeding |

## 16-step dietitian wizard

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Dietitian identification | name, role, HCPC/other registration body and number, assessment date and time, site, service, appointment type (initial / review / specialist programme), planned duration in minutes, interpreter required |
| 2 | Patient identification & referral | NHS number, name, DOB, sex, referral source, referral date, referral reason, primary presenting condition, consent to record, accompanying person |
| 3 | Medical history review | diagnosed conditions (diabetes, coeliac disease, inflammatory bowel disease, chronic kidney disease, liver disease, cancer, cardiovascular disease, respiratory disease, stroke, dementia, eating disorder), recent surgery and date, gastrointestinal surgery type, current symptoms, relevant family history, pregnancy / lactation status |
| 4 | Medication & supplement check | prescription medicines, over-the-counter medicines, vitamin and mineral supplements, herbal and complementary products, oral nutritional supplements already prescribed, enteral or parenteral nutrition in place, drug–nutrient interaction review, adherence |
| 5 | Anthropometry & physical measurements | height, weight, BMI (auto-computed), measurement method (measured / self-reported / estimated / **declined**), mid-upper-arm circumference, calf circumference, waist circumference, usual weight, weight 3 and 6 months ago, unplanned weight-loss percentage (auto-computed), weight trend, amputation or oedema adjustment |
| 6 | Biochemistry & clinical monitoring | albumin, CRP, haemoglobin, ferritin, vitamin B12, folate, vitamin D, HbA1c, sodium, potassium, magnesium, phosphate, corrected calcium, urea, creatinine, eGFR, liver enzymes, lipid profile, sample date |
| 7 | Nutrition-focused physical examination | subcutaneous fat loss, muscle wasting (temples, clavicles, quadriceps), oedema, ascites, oral health and dentition, chewing ability, tongue and mucosa, skin, hair, nails, pressure-ulcer presence and category, hand-grip strength |
| 8 | Dietary recall | 24-hour recall by eating occasion, typical daily intake, meal frequency, portion-size description, snacking pattern, meals eaten out or takeaway per week, food-diary completed, estimated energy intake, estimated protein intake, appetite score, proportion of usual intake |
| 9 | Fluid intake & hydration | usual daily fluid volume, drink types, caffeine, alcohol units per week, thickened fluids and IDDSI level, hydration signs, fluid restriction in place and target |
| 10 | Food preferences, allergies & cultural requirements | food allergies with reaction and severity, intolerances, foods avoided and why, dislikes, therapeutic diet in place, vegetarian / vegan / other pattern, religious or cultural requirements, fasting practices, texture-modified diet and IDDSI level |
| 11 | Gastrointestinal & swallowing | appetite change, early satiety, nausea, vomiting, dysphagia and screen outcome, speech-and-language-therapy involvement, reflux, abdominal pain, bloating, bowel frequency, Bristol stool type, constipation, diarrhoea, stoma or fistula output, malabsorption signs |
| 12 | Lifestyle & environment | living situation, who shops, who cooks, cooking skills and confidence, kitchen facilities (cooker, fridge, freezer, microwave), food budget per week, food insecurity screen, access to shops, transport, work pattern and shift work, meal support (meals on wheels, care worker, family), social support |
| 13 | Physical activity & function | activity level, exercise type and minutes per week, sedentary hours, mobility, falls in last 12 months, SARC-F components, functional independence for eating and drinking, feeding assistance required |
| 14 | Behavioural, psychological & readiness to change | motivation, stage of change, self-efficacy, previous dietary changes attempted, barriers, disordered-eating screen (SCOFF), mood and anxiety, cognitive impairment, health literacy, preferred learning style, goals in the patient's own words |
| 15 | Screening scores & nutrition diagnosis | MUST components and total, MUST risk category, GLIM phenotypic and etiologic criteria and severity, NRS-2002, SARC-F, refeeding-syndrome risk, estimated energy and protein requirements, PES statement (problem / etiology / signs and symptoms) |
| 16 | Nutrition care plan, monitoring & sign-off | intervention type (dietary counselling, food fortification, oral nutritional supplements, enteral, parenteral, texture modification), prescribed supplement and dose, SMART goals, education provided, resources given, monitoring plan and indicators, review interval and date, onward referrals, computed scores + fired rules + safety flags, dietitian override and reason, overall recommendation, additional notes, electronic signature |

## Safety flags

Computed independently of the MUST score. Priority: high / medium / low.
Categories:

| Category | Fires when |
| --- | --- |
| `high-malnutrition-risk` | MUST ≥ 2 |
| `severe-underweight` | BMI < 16.0 |
| `severe-weight-loss` | unplanned weight loss > 15 % in 3–6 months |
| `refeeding-syndrome-risk` | NICE CG32 high-risk or highest-risk criteria met |
| `dysphagia-aspiration-risk` | dysphagia reported and no speech-and-language-therapy assessment recorded |
| `inadequate-oral-intake` | oral intake < 50 % of estimated requirements, or negligible intake for > 5 days |
| `micronutrient-deficiency` | ferritin, B12, folate, or vitamin D below the reference range |
| `electrolyte-derangement` | potassium, magnesium, or phosphate below the reference range |
| `dehydration-risk` | fluid intake well below requirement, or clinical hydration signs present |
| `food-insecurity` | food-insecurity screen positive, or budget-driven skipped meals |
| `disordered-eating-concern` | SCOFF ≥ 2, or a recorded eating-disorder diagnosis |
| `pressure-ulcer` | pressure ulcer category 2 or above present |
| `sarcopenia-risk` | SARC-F ≥ 4, or low hand-grip strength |
| `uncontrolled-diabetes` | HbA1c > 75 mmol/mol (9 %) |
| `renal-dietary-conflict` | eGFR < 30 with a high-protein or high-potassium plan |
| `drug-nutrient-interaction` | a medication on the interaction list conflicts with the plan |
| `allergy-anaphylaxis-risk` | a food allergy with anaphylaxis is recorded |
| `enteral-tube-complication` | enteral feeding in place with a reported tube or tolerance problem |
| `alcohol-excess` | > 14 units per week |
| `pregnancy-lactation` | pregnant or breastfeeding — requirements differ |
| `paediatric` | age < 16 years — MUST is not validated; use a paediatric tool |
| `capacity-concern` | cognitive impairment or a documented capacity concern |
| `safeguarding` | a safeguarding concern is recorded (self-neglect, malnutrition in a care setting) |
| `other` | free-text clinician-raised concern |

## Dietitian override

The engine produces a **computed** MUST score, risk category, and composite
risk. The dietitian may override the risk category on step 16 with a documented
reason. Both the computed and the final values are stored, and both appear in
the report, the PDF, and the FHIR Bundle, so the audit trail is preserved.

## Weighing and dignity

Being weighed causes distress for some patients. Step 5 therefore records a
`measurement_method` of `declined` and supports MUST estimation from
**mid-upper-arm circumference** (MUAC < 23.5 cm suggests BMI < 20; MUAC
> 32.0 cm suggests BMI > 30) and from subjective criteria, per the BAPEN MUST
Explanatory Booklet. A declined weight never blocks completion of the form; it
records the alternative measurement instead and notes the reduced confidence in
the score.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.
- **Nutrition care plan** suitable to include in the clinical record and to
  share with the patient, the GP, and the ward or care-home team.

## Directory structure

```
dietic-assessment/
  index.md                     # this file
  README.md -> index.md        # symlink for GitHub rendering
  AGENTS.md                    # agent instructions
  CLAUDE.md                    # Claude Code project instructions
  spec/                        # living domain spec
  plan.md                      # implementation roadmap
  tasks.md                     # task tracking
  CHANGELOG.md                 # Keep a Changelog 1.1.0 + SemVer
  doc/                         # clinical reference documentation
  examples/                    # filled-form JSON fixture + FHIR R5 Bundle
  sql/                         # PostgreSQL migrations (source of truth)
  xml/                         # generated XML + DTD per SQL table
  fhir/r5/                     # generated FHIR HL7 R5 JSON per SQL entity
  protobuf/                    # generated Protocol Buffers schemas
  openapi/                     # generated OpenAPI 3.1 specifications
  front-end-with-html/         # single-page wizard + dashboard (Lily, no build)
  front-end-with-svelte/       # SvelteKit wizard + dashboard
  back-end-with-loco/          # Rust axum + Loco JSON API
  back-end-with-loco-setup     # generated scaffold script
```

## Clinical references

- BAPEN. *Nutritional Assessment* and *The 'MUST' Explanatory Booklet*.
  <https://www.bapen.org.uk/education/nutrition-support/assessment-planning/nutritional-assessment/>
- BAPEN. *Malnutrition Universal Screening Tool ('MUST')*.
  <https://www.bapen.org.uk/screening-and-must/must/introducing-must/>
- Cederholm T, Jensen GL, Correia MITD, et al. *GLIM criteria for the diagnosis
  of malnutrition — a consensus report from the global clinical nutrition
  community.* Clinical Nutrition 2019;38(1):1–9.
- Kondrup J, Rasmussen HH, Hamberg O, Stanga Z. *Nutritional risk screening
  (NRS 2002).* Clinical Nutrition 2003;22(3):321–36.
- Malmstrom TK, Morley JE. *SARC-F: a simple questionnaire to rapidly diagnose
  sarcopenia.* JAMDA 2013;14(8):531–2.
- NICE. *Nutrition support for adults* (CG32), including refeeding-syndrome
  risk criteria. <https://www.nice.org.uk/guidance/cg32>
- NICE. *Obesity: identification, assessment and management* (CG189).
- British Dietetic Association. *Model and Process for Nutrition and Dietetic
  Practice* (Nutrition Care Process / ADIME).
  <https://www.bda.uk.com/practice-and-education/professional-guidance.html>
- BANT. *What to expect from a nutritionist consultation.*
  <https://bant.org.uk/what-to-expect-from-a-nutritionist-consultation/>
- Dietitians of Canada / UnlockFood. *What can I expect when I go and see a
  dietitian?*
  <https://www.unlockfood.ca/en/Articles/About-Dietitians/What-can-I-expect-when-I-go-and-see-a-dietitian.aspx>
- StatPearls / NCBI Bookshelf. *Nutritional Assessment.*
  <https://www.ncbi.nlm.nih.gov/books/NBK580496/>
- IDDSI. *International Dysphagia Diet Standardisation Initiative framework.*
  <https://iddsi.org/framework>
- Lewis SJ, Heaton KW. *Stool form scale as a useful guide to intestinal
  transit time.* Scand J Gastroenterol 1997;32(9):920–4.
- Morgan JF, Reid F, Lacey JH. *The SCOFF questionnaire.* BMJ 1999;319:1467–8.
- Elia M, Stratton RJ. *An analytic appraisal of nutrition screening tools.*
  European Journal of Clinical Nutrition. <https://www.nature.com/articles/6601089>

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis and does
not replace the clinical judgement of a registered dietitian.
