ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "proforma_header_department" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "proforma_header_registration_date" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "proforma_header_pre_op_diagnosis" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "prev_anaes_anaesthetic_difficulty" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "prev_anaes_abnormal_reaction" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "prev_anaes_ponv" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "prev_anaes_malignant_hyperpyrexia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "prev_anaes_difficult_intubation" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "prev_anaes_difficult_spinal_or_epidural" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_alcohol" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_smoking" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_fast_score3_or_more" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_betel" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_drugs" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_other" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "addiction_other_details" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_hypertension" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_mi" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_mi_within_past6_months" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_angina_or_chest_pain" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_angina_triggers" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_heart_failure" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_dyspnoea" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_dyspnoea_subtypes" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_palpitation" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_arrhythmia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_syncope_or_fainting" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_heart_murmur" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_rheumatic_fever" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_pacemaker" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_pacemaker_last_check_within6_months" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_implanted_icd_crtd" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_angioplasty" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stenting" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stenting_within_past6_months" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stent_type" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_valve_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_cardiac_surgery" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_cardiac_surgery_within_past_year" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_peripheral_vascular_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_ischemic_heart_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_asthma" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_copd" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_tb" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_bronchiectasis" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_previous_hospital_admission" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_icu_admission" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_on_home_oxygen_or_nebulizers" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_uses_inhaler_daily_or_more" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_flu_cough_sputum" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_haemoptysis" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_sleep_apnoea" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_sleep_apnoea_using_cpap" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stop_bang_risk" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_other_respiratory_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_diabetes_mellitus" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_diabetes_diet_controlled" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_diabetes_drug_controlled" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_diabetes_insulin_controlled" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_diabetes_hba1c_over69" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_hypothyroid" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_hyperthyroid" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stroke_or_tia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stroke_within3_months" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_stroke_residual_disability" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_epilepsy_or_seizures" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_epilepsy_control" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_ms" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_muscular_dystrophy" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_other_neurological_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_other_neurological_disease_details" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_dementia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_creutzfeldt_jakob_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_growth_hormone_or_gonadotrophin" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_brain_or_spinal_cord_surgery" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_four_at_score" integer;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_complex_needs" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_renal_impairment" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_ckd_stage3" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_ckd_stage4_or_hemodialysis" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_liver_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_clotting_disorders_haemophilia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_easy_bruising_prolonged_bleeding" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_dvt_or_pe" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_dvt_or_pe_within_past3_months" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_gord" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_any_other_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_chronic_pain" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_duke_activity_status_index" integer;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_mets_score" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_ongoing_medications" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_cortisone_prednisone_steroid" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_blood_transfusion_history" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_chemotherapy_drugs" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "pmh_proforma_radiotherapy" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_mouth_opening" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_loose_teeth" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_denture_missing" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_mp_grade" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_micrognathia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_tm_distance_over65" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_mo_distance" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_tm_joint" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_short_neck_rom" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_difficult_airway" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_obesity_scoring" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_spine_back" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_scoliosis" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "airway_exam_proforma_vitals_examination" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_height_cm" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_weight_kg" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_hr" integer;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_bp" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_resp_rate" integer;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_spo2" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_temp" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "vitals_proforma_bmi" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_pallor" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_icterus" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_cyanosis" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_clubbing" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_koilonychia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_lymphadenopathy" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_edema" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "gen_exam_proforma_jvp" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_blood_group_haemoglobin" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_differential_n" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_differential_l" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_differential_e" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_differential_m" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_differential_b" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_absolute" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_nc" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_tlc" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_tpc" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_esr" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_crp" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_pcv" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_latex_rast" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_fbs" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_ppbs" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_hba1c" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_na" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_k" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_urea" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_creatinine" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_bilirubin_total" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_bilirubin_direct" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_alk_phosphatase" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_sgpt_alt" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_sgot_ast" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_bt" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_ct" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_pt" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_aptt" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_inr" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_ft3" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_ft4" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_tsh" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_ecg" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_chest_xray" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_pft" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_abg" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_two_d_echo" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_lvef_percent" double precision;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_tmt" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_ct_scan" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "invest_proforma_mri" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_cardiac" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_respiratory" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_diabetes" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_insulin" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_bmi_over40" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_anticoagulants" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_allergies" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_antiplatelets" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_egfr_under30" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_egfr30_to60" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_age_over70" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_pvd" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_liver_disease" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_vte_risk" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_complex_needs" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_anaemia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_neuromuscular_disorders" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_others" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "risk_factors_others_details" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_anaesthetic_concerns" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_plan_tiva" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_plan_ra" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_plan_other" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_plan_other_details" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_list_for_ot_defer_not_fit" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_nil_orally_after" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_informed_written_consent" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_risks_benefits_alternatives_discussed" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_arrange_units_of_blood" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_arrange_post_op_icu" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_backup" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_do_investigations" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_do_special_orders" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_reviewed_high_risk_anaesthesia" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_reviewed_consent" boolean NOT NULL DEFAULT false;

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_consultant_anaesthesiologist_name" text NOT NULL DEFAULT '';

ALTER TABLE "pre_anaesthesia_assessments" ADD COLUMN "anaes_plan_proforma_consultant_anaesthesiologist_signature" text NOT NULL DEFAULT '';
