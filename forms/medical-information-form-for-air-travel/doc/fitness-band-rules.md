# Fitness-band rules — predicate table

Authoritative predicate table for every rule the MEDIF fitness-to-fly engine
fires. Mirrors the *Airline-aligned rules* section in `../AGENTS.md`. The
engine evaluates each rule and applies max-grade: the worst band wins.

The `instrument` column matches the `instrument` enum in
`../sql/06_create_table_medical_information_form_for_air_travel_grade_rule.sql`.

The `predicate` column references column names from the
`medical_information_form_for_air_travel` table. Dates are compared against
the form's `outbound_date`.

## Cardiovascular rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-CARDIAC-ACUTE-MI-7D | cardiovascular | `recent_mi_date` within 7 d of `outbound_date` | unfit-to-fly | high | Do not fly; reassess in ≥ 7 days. |
| R-CARDIAC-MI-COMPLICATED-6W | cardiovascular | `recent_mi_date` 7 d–6 wk of `outbound_date` AND `nyha_class` IN ('III','IV') | requires-review | medium | Submit to airline medical desk; senior physician review. |
| R-CARDIAC-STENT-5D | cardiovascular | `recent_stent_date` within 5 d of `outbound_date` | requires-review | medium | Medical-desk clearance; document antiplatelet therapy. |
| R-CARDIAC-UNSTABLE-ANGINA | cardiovascular | `unstable_angina` = 'yes' | unfit-to-fly | high | Stabilise before travel; cardiologist review. |
| R-CARDIAC-NYHA-IV | cardiovascular | `nyha_class` = 'IV' | requires-review | medium | Medical-desk clearance; consider escort. |
| R-CARDIAC-HEART-FAILURE | cardiovascular | `nyha_class` = 'III' AND `exercise_tolerance_metres` < 50 | requires-review | medium | Document supplemental oxygen need. |

## Respiratory rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-RESP-PNEUMOTHORAX-14D | respiratory | `recent_pneumothorax_date` within 14 d of `outbound_date` | unfit-to-fly | high | Do not fly; gas-expansion risk. |
| R-RESP-HYPOXIA-SEVERE | respiratory | `resting_spo2_percent` < 85 | unfit-to-fly | high | Do not fly without supplemental O2 + medical clearance. |
| R-RESP-HYPOXIA-MODERATE | respiratory | `resting_spo2_percent` 85–92 | requires-review | medium | Supplemental O2 likely required; hypoxic challenge test. |
| R-RESP-HCT-FAIL | respiratory | `hypoxic_challenge_result` = 'fail' | unfit-to-fly | high | Do not fly without supplemental O2 + medical clearance. |
| R-RESP-HCT-BORDERLINE | respiratory | `hypoxic_challenge_result` = 'borderline' | requires-review | medium | Document predicted in-flight SpO2; arrange O2. |
| R-RESP-COPD-SEVERE | respiratory | `copd_severity` = 'severe' | requires-review | medium | Senior physician review. |
| R-RESP-ASTHMA-UNCONTROLLED | respiratory | `asthma_severity` = 'severe-uncontrolled' | requires-review | medium | Stabilise before travel; rescue inhaler in cabin. |
| R-RESP-PE-6W | respiratory | `recent_pulmonary_embolism_date` within 6 wk of `outbound_date` | requires-review | medium | Confirm anticoagulation stable for ≥ 7 d. |

## Recent-event rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-EVENT-LAPAROTOMY-14D | recent-event | `last_surgery_date` within 14 d AND `last_surgery_site` references abdomen | requires-review | medium | Document wound closure; gas-expansion risk. |
| R-EVENT-THORACIC-21D | recent-event | `last_surgery_date` within 21 d AND `last_surgery_site` references thorax | requires-review | medium | Senior physician review. |
| R-EVENT-STROKE-14D | recent-event | `recent_stroke_date` within 14 d of `outbound_date` | requires-review | medium | Medical-desk clearance; document mobility status. |
| R-EVENT-DVT-6W | recent-event | `recent_dvt_date` within 6 wk of `outbound_date` | requires-review | medium | Confirm anticoagulation; compression hose. |
| R-EVENT-SCUBA-24H | recent-event | `scuba_diving_within_24h` = 'yes' | unfit-to-fly | high | Wait ≥ 24 h after last dive (≥ 48 h if decompression). |
| R-EVENT-FRACTURE-CAST | recent-event | `recent_fracture_cast` = 'yes' AND `last_surgery_date` within 48 h | requires-review | medium | Split cast or bivalved; gas-expansion risk. |

## Gas-expansion rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-GAS-INTRA-OCULAR | gas-expansion | `cabin_gas_risk` = 'intra-ocular-gas' | unfit-to-fly | high | Do not fly until gas reabsorbed (typically 2–6 wk). |
| R-GAS-INTRA-CRANIAL-7D | gas-expansion | `cabin_gas_risk` = 'intra-cranial-gas' AND `last_surgery_date` within 7 d | unfit-to-fly | high | Confirm radiology shows no residual gas. |
| R-GAS-INTRA-ABDOMINAL-7D | gas-expansion | `cabin_gas_risk` = 'intra-abdominal-gas' AND `last_surgery_date` within 7 d | unfit-to-fly | high | Confirm radiology shows no residual gas. |
| R-GAS-PNEUMOTHORAX-PRESENT | gas-expansion | `cabin_gas_risk` = 'pneumothorax' | unfit-to-fly | high | Definitive resolution required. |

## Pregnancy rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-PREG-SINGLETON-36W | pregnancy | `is_pregnant` = 'yes' AND `pregnancy_type` = 'singleton' AND `gestation_weeks` > 36 | unfit-to-fly | high | Do not fly; reassess after delivery. |
| R-PREG-SINGLETON-28-36W | pregnancy | `is_pregnant` = 'yes' AND `pregnancy_type` = 'singleton' AND `gestation_weeks` 28–36 | requires-review | medium | Carrier certificate required. |
| R-PREG-MULTIPLE-32W | pregnancy | `is_pregnant` = 'yes' AND `pregnancy_type` IN ('twins','multiple') AND `gestation_weeks` > 32 | unfit-to-fly | high | Do not fly. |
| R-PREG-MULTIPLE-24-32W | pregnancy | `is_pregnant` = 'yes' AND `pregnancy_type` IN ('twins','multiple') AND `gestation_weeks` 24–32 | requires-review | medium | Carrier certificate required. |
| R-PREG-COMPLICATIONS | pregnancy | `pregnancy_complications` non-empty | requires-review | medium | Obstetrician sign-off; medical-desk review. |

## Communicable-disease rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-COMM-ACTIVE | communicable | `communicable_disease_status` = 'infectious' | unfit-to-fly | high | Do not fly; passenger is in infectious period. |
| R-COMM-ISOLATION | communicable | `isolation_required` = 'yes' | unfit-to-fly | high | Do not fly until isolation lifted. |
| R-COMM-CONVALESCENT | communicable | `communicable_disease_status` = 'convalescent' AND `last_symptom_date` within 7 d | requires-review | medium | Document negative test / clearance. |

## Haematology rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-HAEM-SEVERE-ANAEMIA | haematology | `haemoglobin_g_per_l` < 75 | unfit-to-fly | high | Transfuse / treat; reassess after recovery. |
| R-HAEM-MODERATE-ANAEMIA | haematology | `haemoglobin_g_per_l` 75–90 | requires-review | medium | Senior physician review; supplemental O2 may help. |

## Equipment rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-EQUIP-O2-HIGH-FLOW | equipment | `requires_supplemental_oxygen` = 'yes' AND `oxygen_flow_rate_lpm` > 4 | requires-review | high | Dangerous-goods declaration mandatory. |
| R-EQUIP-O2-LOW-FLOW | equipment | `requires_supplemental_oxygen` = 'yes' AND `oxygen_flow_rate_lpm` ≤ 4 | fit-with-conditions | low | Document flow rate on booking. |
| R-EQUIP-POC-BATTERY | equipment | `requires_poc` = 'yes' AND `poc_battery_hours` × 60 < `sector_duration_minutes` × 1.5 | requires-review | high | Provide additional batteries to meet 150 % margin. |
| R-EQUIP-STRETCHER | equipment | `requires_stretcher` = 'yes' | requires-review | medium | Sector-specific approval. |
| R-EQUIP-INCUBATOR | equipment | `requires_incubator` = 'yes' | requires-review | medium | Sector-specific approval. |
| R-EQUIP-IV-PUMP | equipment | `requires_iv_pump` = 'yes' | requires-review | medium | Dangerous-goods clearance for battery. |
| R-EQUIP-BATTERY-DEVICE | equipment | `dangerous_goods_battery_declaration` = 'yes' | requires-review | medium | IATA DGR PI 967 / 970 compliance. |

## Composite rules

| Rule id | Instrument | Predicate | Band | Priority | Suggested action |
| --- | --- | --- | --- | --- | --- |
| R-COMP-PSYCHIATRIC | composite | `reason_psychiatric` = 'yes' | requires-review | medium | Document escort arrangement; sedation plan. |
| R-COMP-PHYSICIAN-UNFIT | composite | `physician_declaration` = 'unfit' | unfit-to-fly | high | Defer to physician declaration. |
| R-COMP-PHYSICIAN-CONDITIONAL | composite | `physician_declaration` = 'fit-with-conditions' | fit-with-conditions | low | Defer to physician declaration. |
| R-COMP-FORM-EXPIRED | composite | `valid_until_date` < `outbound_date` | requires-review | medium | Re-sign MEDIF closer to travel. |

## Notes

- Every rule has a stable `rule_id` written into
  `medical_information_form_for_air_travel_grade_rule.rule_id`.
- Multiple rules can fire for one form; the engine applies max-grade.
- Flags fire independently of the band; see the `flag_id` column of
  `medical_information_form_for_air_travel_grade_flag` and the *Safety
  flags* section in `../index.md`.
