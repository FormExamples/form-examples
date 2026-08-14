# Optimization domains

The eight domains, their triggers, their interventions, and their lead times.
This table is the clinical justification for `DOMAIN_DEFINITIONS` in the engine;
the code must not diverge from it without this file changing first.

Rule IDs follow `R-<DOMAIN>-<N>`.

---

## 1. Anaemia and iron deficiency — `anaemia`

**Lead time: 4 weeks** (intravenous iron) or **8 weeks** (oral iron). The engine
uses 4 weeks when the recorded or planned route is intravenous, otherwise 8.

Preoperative anaemia is common, independently associated with transfusion,
morbidity, and longer stay, and is often correctable. CPOC and the British
Society for Haematology recommend screening early enough to treat.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-ANAEMIA-1` | `sex = male` and `haemoglobin_g_per_l < 130` | anaemia (WHO threshold, men) |
| `R-ANAEMIA-2` | `sex = female` and `haemoglobin_g_per_l < 120` | anaemia (WHO threshold, women) |
| `R-ANAEMIA-3` | `ferritin_ug_per_l < 30` | absolute iron deficiency |
| `R-ANAEMIA-4` | `30 <= ferritin_ug_per_l <= 100` and `transferrin_saturation_percent < 20` | functional iron deficiency |
| `R-ANAEMIA-5` | `haemoglobin_g_per_l < 80` | severe anaemia — forces `defer-surgery` and a high-priority flag |

Intervention: oral iron where tolerated and time allows; intravenous iron where
oral is not tolerated, absorption is impaired, or the window is under eight
weeks. Investigate the cause — iron deficiency in an adult may indicate
gastrointestinal blood loss and warrants its own pathway.

The engine treats the domain as `optimised` when the trigger is absent, and as
`in-progress` when `anaemia_treatment_started = yes` and there is time.

---

## 2. Glycaemic control — `glycaemic-control`

**Lead time: 12 weeks.** HbA1c reflects roughly three months of glycaemia, so a
shorter window cannot move the number. This is honest rather than convenient;
see `plan.md` §Risks.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-GLYC-1` | `hba1c_mmol_per_mol >= 48` | glycaemia above the optimization threshold |
| `R-GLYC-2` | `hba1c_mmol_per_mol >= 69` | above the CPOC deferral threshold (8.5 %) — forces `defer-surgery` and a high-priority flag |
| `R-GLYC-3` | `hba1c_mmol_per_mol >= 48` and `diabetes_type = none` | previously undiagnosed diabetes — flag and refer |

48 mmol/mol is the diagnostic threshold for diabetes; 69 mmol/mol (8.5 %) is the
figure CPOC uses for deferring elective surgery where the delay will not itself
cause harm. Hyperglycaemia is associated with surgical-site infection, and the
association is dose-dependent.

Intervention: diabetes-team review, medication adjustment, structured education,
and a documented day-of-surgery plan. The perioperative medication rules for
SGLT2 inhibitors and GLP-1 agonists are in
[`medication-hold-rules.md`](./medication-hold-rules.md) and belong to the
`medication` domain, not this one.

---

## 3. Smoking — `smoking`

**Lead time: 4 weeks.** Shorter periods still help wound healing, but four weeks
is the point at which respiratory complication rates fall measurably. Stopping
at any time before surgery is beneficial; the engine never discourages a late
quit attempt, it only reports that the four-week benefit will not be realized.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-SMOKE-1` | `smoking_status = current` | current smoker |
| `R-SMOKE-2` | `smoking_status = current` and `surgical_severity` in (`major`, `major-plus`) | current smoker listed for major surgery — high-priority flag |

Intervention: very brief advice, referral to a stop-smoking service, nicotine
replacement therapy or pharmacotherapy. Record the quit date so
`weeks_quit_before_surgery` can be computed.

The domain is `in-progress` when `smoking_cessation_accepted = yes`.

---

## 4. Alcohol — `alcohol`

**Lead time: 4 weeks.** Four weeks of abstinence improves immune and haemostatic
function and reduces postoperative complications in heavy drinkers.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-ALCOHOL-1` | `alcohol_units_per_week > 14` | above the United Kingdom low-risk guideline |
| `R-ALCOHOL-2` | `sex = male` and `audit_c_score >= 5` | AUDIT-C positive (men) |
| `R-ALCOHOL-3` | `sex = female` and `audit_c_score >= 4` | AUDIT-C positive (women) |
| `R-ALCOHOL-4` | `audit_c_score >= 8` or `alcohol_dependence_features = yes` | dependence risk — withdrawal may occur in hospital; high-priority flag |

AUDIT-C is the three-item consumption subset of AUDIT: frequency of drinking,
typical quantity, and frequency of six-or-more drinks, each scored 0–4 for a
total of 0–12.

Intervention: brief intervention and a reduction plan; referral to alcohol
services and a withdrawal-prevention plan where dependence is suspected.

---

## 5. Nutrition — `nutrition`

**Lead time: 3 weeks.** Two to four weeks of oral nutritional supplementation is
the usual preoperative course; immunonutrition is typically given for 5–7 days
before major gastrointestinal surgery.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-NUTRITION-1` | `must_score >= 2` | high malnutrition risk — high-priority flag |
| `R-NUTRITION-2` | `weight_loss_percent > 10` | significant unintentional weight loss |

MUST is computed here exactly as in the sibling nutrition forms: BMI score
(> 20.0 → 0, 18.5–20.0 → 1, < 18.5 → 2) plus unplanned weight-loss score
(< 5 % → 0, 5–10 % → 1, > 10 % → 2) plus the acute disease effect (2 when
acutely ill with no intake likely for more than five days).

Intervention: dietitian referral, food fortification, oral nutritional
supplements, immunonutrition where indicated. For a full dietetic workup, refer
to [`forms/dietic-assessment`](../../dietic-assessment).

---

## 6. Physical fitness — `physical-fitness`

**Lead time: 6 weeks.** Four weeks is the minimum at which measurable
improvement in functional capacity is seen; six or more is preferred, and
prehabilitation programmes are commonly four to six weeks.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-FITNESS-1` | `metabolic_equivalents < 4` | cannot achieve 4 METs — the classic threshold below which perioperative risk rises |
| `R-FITNESS-2` | `duke_activity_status_index < 34` | low Duke Activity Status Index |
| `R-FITNESS-3` | `six_minute_walk_metres < 400` | reduced six-minute walk distance |
| `R-FITNESS-4` | `cpet_anaerobic_threshold < 11` | anaerobic threshold below 11 ml/kg/min on cardiopulmonary exercise testing |

Four METs is the ability to climb a flight of stairs or walk up a hill without
stopping — the question step 11 asks in plain language alongside the numeric
fields, because most patients have no CPET result.

Intervention: a tailored prehabilitation exercise programme combining aerobic
and resistance work, ideally multimodal alongside the nutrition and psychology
domains.

---

## 7. Medication — `medication`

**Lead time: 1 week.** The intervention is a *decision*, not a physiological
change, but it must be agreed and communicated before admission. See
[`medication-hold-rules.md`](./medication-hold-rules.md) for the per-drug rules.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-MEDICATION-1` | any hold-requiring medicine in use and `medication_hold_plan_agreed != yes` | no agreed hold-and-restart plan |
| `R-MEDICATION-2` | `takes_sglt2_inhibitor = yes` and no hold plan | euglycaemic diabetic ketoacidosis risk — high-priority flag |
| `R-MEDICATION-3` | `takes_glp1_agonist = yes` | delayed gastric emptying and aspiration risk — high-priority flag |
| `R-MEDICATION-4` | (`takes_anticoagulant = yes` or `takes_antiplatelet = yes`) and no hold plan | bleeding or thrombosis risk — high-priority flag |

Hold-requiring medicines tracked by the form: anticoagulants, antiplatelets,
ACE inhibitors and ARBs, SGLT2 inhibitors, GLP-1 agonists, systemic
corticosteroids, immunosuppressants, and hormone therapy.

---

## 8. Cardiorespiratory — `cardiorespiratory`

**Lead time: 4 weeks**, though the true figure depends on the finding: an
inhaler-technique review is immediate, a sleep study or echocardiogram may take
longer. Four weeks is the planning default.

| Rule ID | Predicate | Finding |
| --- | --- | --- |
| `R-CARDIORESP-1` | `systolic_bp >= 180` or `diastolic_bp >= 110` | uncontrolled hypertension — high-priority flag |
| `R-CARDIORESP-2` | `asthma_control = uncontrolled` or `copd_control = uncontrolled` | uncontrolled airways disease — high-priority flag |
| `R-CARDIORESP-3` | `ejection_fraction_percent < 40` | impaired left ventricular function — high-priority flag |
| `R-CARDIORESP-4` | `stop_bang_score >= 5` and `sleep_apnoea_diagnosis != yes` | high probability of unassessed obstructive sleep apnoea |
| `R-CARDIORESP-5` | `oxygen_saturation_percent < 92` | hypoxaemia on room air |

The 180/110 threshold is the NICE NG45 / perioperative convention for deferring
elective surgery on blood pressure alone; lower readings are treated as ordinary
optimization rather than a gate.

Intervention: specialty referral, antihypertensive review, inhaler technique and
adherence review, rescue steroids, spirometry, sleep study, echocardiogram.

---

## Domains assessed but not gated

**Frailty, cognition, and falls** (step 12) and **psychological readiness and
social support** (step 14) are assessed, reported, and can raise safety flags,
but are not optimization domains: they are rarely reversible in a
weeks-long window, and treating them as gates would generate `defer-surgery`
results the team cannot act on. They modify the plan instead — a Clinical
Frailty Scale of 7 changes what prehabilitation looks like and what shared
decision-making has to cover, rather than stopping the clock.

## Licensing

| Instrument | Licence |
| --- | --- |
| MUST | Free for non-commercial use with attribution to BAPEN. |
| AUDIT-C | Derived from the WHO AUDIT; freely usable with citation. |
| Duke Activity Status Index | Published Am J Cardiol 1989; freely usable with citation. |
| STOP-BANG | Free for non-commercial and educational use; commercial use requires a licence from the University Health Network, Toronto. **Confirm before any commercial distribution.** |
| Clinical Frailty Scale | Free for non-commercial, education, research, and clinical use with permission from Dalhousie University; commercial use requires a licence. |

## References

See [`index.md`](./index.md) for the full citation list.
