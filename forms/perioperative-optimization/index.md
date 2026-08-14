# Perioperative Optimization

A UK NHS–aligned **perioperative optimisation and prehabilitation** intake: the
screening questionnaire a surgical or anaesthetic team uses to identify
**reversible** health problems before surgery, decide what can be treated in the
time available, and build a personalised prehabilitation plan.

The engine grades each of eight optimisation domains as **optimised**,
**in progress**, **action required**, or **insufficient time**, computes a
composite **surgical readiness** band, and produces a domain-by-domain plan with
target values, referrals, and start dates. The goal is the one NHS England
states for the perioperative pathway: fewer complications, shorter stays, and a
body better able to handle the physical stress of surgery.

> **Naming.** The directory slug is `perioperative-optimization` (US spelling,
> as requested). Prose uses the UK spelling **optimisation**, matching NHS
> England and CPOC. The slug, SQL table names
> (`perioperative_optimization`, `perioperative_optimization_grade`, …), and
> every generated artefact keep the `optimization` stem so derived
> representations stay keyed to the directory.

## What makes this form different

The monorepo already has three pre-operative forms, and all three answer
*"how risky is this patient?"* by computing an ASA Physical Status grade. This
form answers a different question: **"what can we still fix, and is there time
to fix it?"**

| | This form | The ASA-grading pre-op forms |
| --- | --- | --- |
| Question | what is modifiable, and is there time? | how risky is this patient? |
| Primary output | per-domain optimisation status + surgical readiness | ASA grade + composite risk |
| Driver | **time to surgery** versus each domain's lead time | severity of findings |
| Result | a prehabilitation plan with start dates | an anaesthesia plan |
| Sibling | [`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician), [`pre-operative-assessment-by-patient`](../pre-operative-assessment-by-patient), [`pre-anaesthesia-assessment`](../pre-anaesthesia-assessment) | each other |

A patient can be ASA III and fully optimised, or ASA II with an untreated iron
deficiency that a four-week course of intravenous iron would fix. Only this form
distinguishes those two.

## Scope and intended users

- **Setting:** NHS pre-operative assessment clinic, surgical school or
  prehabilitation service, high-risk perioperative clinic, day-surgery unit, or
  an online portal such as MyPreOp completed before the clinic appointment.
- **Users:** pre-operative assessment nurses, perioperative physicians,
  anaesthetists, surgeons, prehabilitation therapists, specialist nurses,
  clinical pharmacists, and dietitians working to a perioperative pathway.
- **Patients:** adults (≥ 16 years) listed for elective or scheduled surgery.
  Emergency surgery is out of scope: there is no lead time to optimise in, so
  the form records the urgency and directs the user to the assessment forms
  above instead.

## The eight optimisation domains

Each domain carries a **screening threshold**, an **intervention**, and a
**lead time** — the minimum number of weeks before surgery the intervention
needs in order to work. The lead time is what turns a finding into a decision.

| # | Domain | Screening threshold | Intervention | Lead time |
| --- | --- | --- | --- | --- |
| 1 | **Anaemia and iron deficiency** | Hb < 130 g/L (men), < 120 g/L (women); ferritin < 30 µg/L, or 30–100 µg/L with TSAT < 20 % | oral iron, or intravenous iron where oral is not tolerated or time is short | 4 weeks (IV) / 8 weeks (oral) |
| 2 | **Glycaemic control** | HbA1c ≥ 69 mmol/mol (8.5 %) defer; 48–68 optimise | diabetes-team review, medication adjustment, education | 12 weeks (HbA1c reflects ~3 months) |
| 3 | **Smoking** | any current smoker | cessation support, nicotine replacement, referral | 4 weeks |
| 4 | **Alcohol** | > 14 units/week, or AUDIT-C ≥ 5 (men) / ≥ 4 (women) | brief intervention, reduction plan, alcohol-services referral | 4 weeks |
| 5 | **Nutrition** | MUST ≥ 2, or unintentional weight loss > 10 % | dietitian referral, oral nutritional supplements, immunonutrition | 2–4 weeks |
| 6 | **Physical fitness** | DASI < 34, METs < 4, 6-minute walk < 400 m, or CPET anaerobic threshold < 11 ml/kg/min | prehabilitation exercise programme | 4 weeks minimum, 6+ preferred |
| 7 | **Medication** | anticoagulant, antiplatelet, SGLT2 inhibitor, GLP-1 agonist, ACE inhibitor / ARB, steroid, or immunosuppressant in use | documented hold-and-restart plan agreed with the prescriber | days, but must be agreed before admission |
| 8 | **Cardiorespiratory** | uncontrolled hypertension, uncontrolled asthma or COPD, unassessed obstructive sleep apnoea (STOP-BANG ≥ 5), ejection fraction < 40 % | specialty referral, inhaler review, sleep study, echocardiogram | 2–8 weeks by finding |

Frailty, cognition, and psychological readiness are assessed and reported but
are treated as **context that modifies the plan** rather than as optimisation
domains in their own right, because they are rarely reversible in the available
window.

## Time-to-surgery gating

This is the engine's distinctive computation. For each domain that needs action:

```
weeksAvailable = (plannedSurgeryDate - assessmentDate) / 7

if      domain not triggered            -> 'optimised' or 'not-applicable'
else if intervention already started
        and weeksAvailable >= leadTime  -> 'in-progress'
else if weeksAvailable >= leadTime      -> 'action-required'
else                                    -> 'insufficient-time'
```

`insufficient-time` is the finding that changes management: it means the
intervention cannot work before the listed date, so the team must either **defer
the surgery** to create the window or **accept the unoptimised risk** and record
that decision. The form makes the team say which.

Where no surgery date is recorded, every triggered domain reports
`action-required` and the report notes that gating could not be applied.

## Surgical readiness

The composite band, by max-grade across the eight domains — the worst domain
sets the band, so one unoptimised domain cannot be averaged away by seven good
ones.

| Band | Drivers | Meaning |
| --- | --- | --- |
| **Ready** | every domain optimised or not applicable | proceed as listed |
| **Optimisation in progress** | one or more domains in progress, none requiring action | proceed, and continue the plan up to the date |
| **Optimisation required** | one or more domains action-required, all within their lead time | proceed with prehabilitation, or re-date if the plan slips |
| **Defer surgery** | any domain `insufficient-time`, or HbA1c ≥ 69 mmol/mol, or Hb < 80 g/L | defer and optimise, or record an explicit accept-risk decision |

## 16-step wizard

One continuous single page, in the order a clinic actually works through it.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessor name, role, registration, assessment date, site, service, pathway stage, assessment mode (clinic / telephone / online portal), referral source |
| 2 | Patient and procedural demographics | NHS number, name, DOB, sex, contact details, interpreter, planned procedure, surgical specialty, consultant surgeon, planned surgery date, urgency, surgical severity, anticipated blood loss, anticipated length of stay |
| 3 | Medical and surgical history | cardiac, respiratory, renal, hepatic, diabetes, stroke, cancer, rheumatological and other active diagnoses, previous surgery, previous anaesthetic complications, postoperative nausea and vomiting, difficult airway, malignant hyperthermia, venous thromboembolism, family history |
| 4 | Medications | prescription, over-the-counter, herbal and complementary products, anticoagulant, antiplatelet, ACE inhibitor / ARB, SGLT2 inhibitor, GLP-1 agonist, steroid, immunosuppressant, hormone therapy, adherence, hold-and-restart plan agreed |
| 5 | Allergies and intolerances | drug allergies, food allergies, latex, adhesive, contrast, reaction and severity, adrenaline auto-injector |
| 6 | Anaemia and iron studies | haemoglobin, mean cell volume, ferritin, transferrin saturation, B12, folate, C-reactive protein, creatinine, eGFR, sample date, known cause, treatment started, route, previous transfusion, group and save |
| 7 | Glycaemic control | diabetes type and duration, HbA1c and sample date, capillary glucose, treatment, insulin regimen, hypoglycaemia awareness, diabetes-team review, foot check |
| 8 | Smoking and tobacco | smoking status, cigarettes per day, pack-years, quit date, weeks quit before surgery, cessation support offered and accepted, nicotine replacement, vaping, second-hand exposure |
| 9 | Alcohol and other substances | units per week, AUDIT-C components and score, dependence features, reduction plan agreed, alcohol-services referral, recreational drug use |
| 10 | Nutritional screening | height, weight, BMI, unintentional weight loss and percentage, acute disease effect, MUST components and score, appetite, oral nutritional supplements, immunonutrition, dietitian referral |
| 11 | Functional capacity and physical fitness | usual activity level, stairs without stopping, estimated METs, Duke Activity Status Index, 6-minute walk distance, CPET anaerobic threshold and peak VO₂, grip strength, prehabilitation offered, enrolled, sessions per week |
| 12 | Frailty, cognition and falls | Clinical Frailty Scale, 4AT or AMT score, falls in 12 months, mobility aid, living situation, care package |
| 13 | Cardiorespiratory optimisation | blood pressure, heart rate, rhythm, murmur, exercise tolerance, ejection fraction, asthma and COPD control, inhaler technique, rescue steroids, spirometry, STOP-BANG score, obstructive sleep apnoea diagnosis and CPAP use, oxygen saturation |
| 14 | Psychological readiness and social support | anxiety, depression, expectations, understanding of the procedure, shared decision-making discussion, carer, transport home, home circumstances, support after discharge, health literacy |
| 15 | Optimisation plan by domain | for each triggered domain: intervention, referral made, target value, start date, weeks required, responsible clinician, patient agreement |
| 16 | Readiness summary and sign-off | computed domain statuses and fired rules, surgical readiness band, safety flags, weeks to surgery, clinician override with reason, gate decision (proceed / proceed with prehabilitation / defer and optimise / accept unoptimised risk / MDT review), notes, electronic signature |

## Safety flags

Computed independently of the readiness band and never suppressed by an
override. Priority: high / medium / low.

| Category | Fires when |
| --- | --- |
| `severe-anaemia` | haemoglobin < 80 g/L |
| `iron-deficiency-untreated` | iron deficiency present with no treatment started |
| `hba1c-above-threshold` | HbA1c ≥ 69 mmol/mol (8.5 %) |
| `undiagnosed-diabetes` | HbA1c ≥ 48 mmol/mol with no diabetes diagnosis recorded |
| `sglt2-inhibitor-not-held` | SGLT2 inhibitor in use with no hold plan — euglycaemic diabetic ketoacidosis risk |
| `glp1-agonist-aspiration-risk` | GLP-1 agonist in use — delayed gastric emptying and aspiration risk |
| `anticoagulation-plan-missing` | anticoagulant or antiplatelet in use with no agreed hold-and-restart plan |
| `insufficient-time-to-optimise` | any triggered domain cannot be optimised before the listed date |
| `active-smoker-major-surgery` | current smoker listed for major or major-plus surgery |
| `alcohol-dependence-risk` | AUDIT-C ≥ 8, or dependence features recorded — withdrawal risk in hospital |
| `high-malnutrition-risk` | MUST ≥ 2 |
| `poor-functional-capacity` | METs < 4, DASI < 34, 6-minute walk < 400 m, or CPET anaerobic threshold < 11 ml/kg/min |
| `severe-frailty` | Clinical Frailty Scale ≥ 7 |
| `uncontrolled-hypertension` | systolic ≥ 180 or diastolic ≥ 110 mmHg |
| `cardiac-optimisation-required` | ejection fraction < 40 %, new murmur, or poor exercise tolerance |
| `respiratory-optimisation-required` | uncontrolled asthma or COPD, or oxygen saturation < 92 % on air |
| `osa-unassessed` | STOP-BANG ≥ 5 with no sleep-apnoea diagnosis or CPAP |
| `renal-optimisation-required` | eGFR < 30 ml/min |
| `prior-anaesthetic-complication` | previous anaesthetic complication or malignant-hyperthermia history |
| `psychological-support-required` | significant anxiety or depression recorded |
| `social-support-gap` | no transport home, or no support after discharge, for a procedure that needs it |
| `capacity-concern` | cognitive impairment or a documented capacity concern |
| `pregnancy` | pregnant — elective surgery normally deferred |
| `paediatric` | age < 16 — use a paediatric perioperative pathway |

Two further categories, `safeguarding` and `other`, are permitted by the schema
but are **not emitted by the shipped rule set**. There is deliberately no
safeguarding field on this form: a safeguarding concern in a pre-operative
clinic is routed through the organisation's own safeguarding pathway, not
through an optimisation score. The categories exist so a deployment that adds a
local field can record against them without a schema change.

## Clinician override

The engine produces a **computed** surgical readiness band. The responsible
clinician may override it on step 16 with a mandatory reason — most often to
record an explicit *accept unoptimised risk* decision when surgery cannot wait.
Both the computed and final bands are stored and printed, so the decision is
auditable rather than silent. Safety flags are unaffected by the override.

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML**, **JSON**, **CSV**, and **TSV** for import and export.
- A **prehabilitation plan** suitable to give the patient and to file in the
  pre-operative record.

## Directory structure

```
perioperative-optimization/
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

- NHS England. *Earlier screening, risk assessment and health optimisation in
  perioperative pathways.*
  <https://www.england.nhs.uk/long-read/earlier-screening-risk-assessment-and-health-optimisation-in-perioperative-pathways/>
- Centre for Perioperative Care (CPOC). *Preoperative Assessment and
  Optimisation for Adult Surgery* (June 2021).
  <https://cpoc.org.uk/guidelines-resources-guidelines/preoperative-assessment-and-optimisation>
- CPOC / British Society for Haematology. *Guideline for the Management of
  Anaemia in the Perioperative Pathway.*
- CPOC / Centre for Perioperative Care. *Guideline for Perioperative Care for
  People with Diabetes Mellitus Undergoing Elective and Emergency Surgery.*
- Agency for Clinical Innovation (NSW). *Perioperative Toolkit — Optimisation.*
  <https://aci.health.nsw.gov.au/projects/perioperative-toolkit/journey/optimisation>
- NHS Inform Scotland. *Waiting Well — getting fit for surgery.*
  <https://www.nhsinform.scot/waiting-well/getting-fit-for-surgery/>
- Kettering General Hospital NHS Trust. *Pre-operative assessment online
  questionnaire (MyPreOp).*
  <https://www.kgh.nhs.uk/pre-operative-assessment-online-questionnaire/>
- Dartford and Gravesham NHS Trust. *Preparing for surgery — completing your
  online pre-operative questionnaire.*
  <https://www.dgt.nhs.uk/patients-and-visitors/outpatients-transformation/pkb/preparing-surgery-completing-your-online-pre-operative-questionnaire>
- BAPEN. *Malnutrition Universal Screening Tool ('MUST').*
  <https://www.bapen.org.uk/screening-and-must/must/introducing-must/>
- Hlatky MA, Boineau RE, Higginbotham MB, et al. *A brief self-administered
  questionnaire to determine functional capacity (the Duke Activity Status
  Index).* Am J Cardiol 1989;64(10):651–4.
- Bush K, Kivlahan DR, McDonell MB, et al. *The AUDIT alcohol consumption
  questions (AUDIT-C).* Arch Intern Med 1998;158(16):1789–95.
- Chung F, Abdullah HR, Liao P. *STOP-Bang questionnaire: a practical approach
  to screen for obstructive sleep apnea.* Chest 2016;149(3):631–8.
- Rockwood K, Song X, MacKnight C, et al. *A global clinical measure of fitness
  and frailty in elderly people (Clinical Frailty Scale).* CMAJ
  2005;173(5):489–95.
- NICE. *Routine preoperative tests for elective surgery* (NG45).
  <https://www.nice.org.uk/guidance/ng45>
- NICE. *Perioperative care in adults* (NG180).
  <https://www.nice.org.uk/guidance/ng180>
- Prehabilitation evidence review.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10552833/>

## Compliance

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)

This form is a **decision-support** tool. It does not make a diagnosis, does not
decide whether surgery goes ahead, and does not replace the clinical judgement
of the responsible surgical and anaesthetic team.
