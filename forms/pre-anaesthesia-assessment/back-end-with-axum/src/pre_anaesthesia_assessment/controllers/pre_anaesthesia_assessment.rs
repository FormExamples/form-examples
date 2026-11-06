#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pre_anaesthesia_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub planned_procedure: String,
    pub surgical_specialty: String,
    pub urgency: String,
    pub laterality: String,
    pub surgical_severity: String,
    pub anticipated_blood_loss_ml: Option<i32>,
    pub anticipated_duration_minutes: Option<i32>,
    pub consultant_surgeon: String,
    pub planned_date: Option<Date>,
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub heart_rate: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub spo2_percent: Option<f64>,
    pub temperature_celsius: Option<f64>,
    pub capillary_refill_seconds: Option<f64>,
    pub pain_score_0_10: Option<i32>,
    pub on_room_air: String,
    pub supplemental_oxygen_litres: Option<f64>,
    pub mallampati_class: String,
    pub thyromental_distance_cm: Option<f64>,
    pub mouth_opening_cm: Option<f64>,
    pub inter_incisor_gap_cm: Option<f64>,
    pub neck_rom: String,
    pub cervical_spine_stability: String,
    pub dentition: String,
    pub beard: String,
    pub upper_lip_bite_test: String,
    pub prior_difficult_intubation: String,
    pub stopbang_snoring: String,
    pub stopbang_tired: String,
    pub stopbang_observed_apnoea: String,
    pub stopbang_pressure: String,
    pub stopbang_bmi_gt35: String,
    pub stopbang_age_gt50: String,
    pub stopbang_neck_gt40: String,
    pub stopbang_male: String,
    pub airway_notes: String,
    pub heart_rhythm: String,
    pub murmur_present: String,
    pub murmur_description: String,
    pub peripheral_pulses: String,
    pub jvp_raised: String,
    pub peripheral_oedema: String,
    pub ecg_performed: String,
    pub ecg_rhythm: String,
    pub ecg_rate_bpm: Option<i32>,
    pub ecg_axis: String,
    pub ecg_ischaemic_changes: String,
    pub ecg_notes: String,
    pub echo_performed: String,
    pub echo_ef_percent: Option<i32>,
    pub echo_notes: String,
    pub history_ihd: String,
    pub history_chf: String,
    pub history_stroke_tia: String,
    pub recent_mi_within_3_months: String,
    pub pacemaker_or_icd: String,
    pub severe_valve_dysfunction: String,
    pub active_angina: String,
    pub breath_sounds: String,
    pub wheeze: String,
    pub crackles: String,
    pub crepitations: String,
    pub chest_wall_deformity: String,
    pub asthma: String,
    pub copd: String,
    pub cxr_performed: String,
    pub cxr_findings: String,
    pub pft_performed: String,
    pub pft_fev1_percent_predicted: Option<f64>,
    pub pft_fev1_fvc_ratio: Option<f64>,
    pub smoking_status: String,
    pub pack_years: Option<f64>,
    pub covid_history: String,
    pub days_since_covid: Option<i32>,
    pub covid_unresolved_symptoms: String,
    pub gcs_total: Option<i32>,
    pub gcs_eye: Option<i32>,
    pub gcs_verbal: Option<i32>,
    pub gcs_motor: Option<i32>,
    pub cognition_tool: String,
    pub cognition_score: Option<i32>,
    pub cognitive_impairment: String,
    pub capacity_concern: String,
    pub cranial_nerves_notes: String,
    pub motor_power: String,
    pub sensory_notes: String,
    pub reflexes: String,
    pub recent_stroke_tia: String,
    pub days_since_stroke_tia: Option<i32>,
    pub seizure_disorder: String,
    pub creatinine_umol_l: Option<i32>,
    pub egfr_ml_min_1_73m2: Option<i32>,
    pub urea_mmol_l: Option<f64>,
    pub potassium_mmol_l: Option<f64>,
    pub sodium_mmol_l: Option<f64>,
    pub dialysis_status: String,
    pub ckd_stage: String,
    pub bilirubin_umol_l: Option<i32>,
    pub alt_u_l: Option<i32>,
    pub ast_u_l: Option<i32>,
    pub alp_u_l: Option<i32>,
    pub albumin_g_l: Option<f64>,
    pub chronic_liver_disease: String,
    pub child_pugh_class: String,
    pub hb_g_l: Option<i32>,
    pub wcc_10_9_l: Option<f64>,
    pub platelets_10_9_l: Option<i32>,
    pub mcv_fl: Option<f64>,
    pub ferritin_ug_l: Option<i32>,
    pub transferrin_saturation_percent: Option<f64>,
    pub inr: Option<f64>,
    pub aptt_seconds: Option<f64>,
    pub fibrinogen_g_l: Option<f64>,
    pub on_anticoagulant: String,
    pub anticoagulant_type: String,
    pub anticoagulant_hold_plan: String,
    pub group_and_save: String,
    pub crossmatch_units: Option<i32>,
    pub last_transfusion_date: Option<Date>,
    pub anaemia_severity: String,
    pub diabetes_type: String,
    pub diabetes_on_insulin: String,
    pub hba1c_mmol_mol: Option<i32>,
    pub fasting_glucose_mmol_l: Option<f64>,
    pub random_glucose_mmol_l: Option<f64>,
    pub diabetes_control: String,
    pub diabetes_complications: String,
    pub thyroid_status: String,
    pub tsh_mu_l: Option<f64>,
    pub adrenal_status: String,
    pub on_long_term_steroids: String,
    pub steroid_dose_mg: Option<f64>,
    pub steroid_cover_plan: String,
    pub abdominal_exam: String,
    pub abdominal_notes: String,
    pub reflux_symptoms: String,
    pub hiatus_hernia: String,
    pub previous_gastric_surgery: String,
    pub ng_tube: String,
    pub stoma: String,
    pub fasting_confirmed: String,
    pub last_solid_food_at: Option<DateTimeWithTimeZone>,
    pub last_clear_fluid_at: Option<DateTimeWithTimeZone>,
    pub rapid_sequence_induction_needed: String,
    pub spine_exam: String,
    pub spine_notes: String,
    pub neuraxial_suitable: String,
    pub joint_rom_hip: String,
    pub joint_rom_shoulder: String,
    pub joint_rom_neck: String,
    pub skin_iv_access: String,
    pub skin_block_site: String,
    pub pressure_ulcer_risk: String,
    pub name: String,
    pub dose: String,
    pub route: String,
    pub frequency: String,
    pub indication: String,
    pub class: String,
    pub perioperative_action: String,
    pub perioperative_notes: String,
    pub last_dose_at: Option<DateTimeWithTimeZone>,
    pub allergen: String,
    pub category: String,
    pub reaction_type: String,
    pub reaction_severity: String,
    pub reaction_notes: String,
    pub verified: String,
    pub mets_estimate: Option<f64>,
    pub dasi_score: Option<f64>,
    pub ecog_performance_status: Option<i32>,
    pub clinical_frailty_scale: Option<i32>,
    pub six_minute_walk_metres: Option<i32>,
    pub sts_one_minute_reps: Option<i32>,
    pub tug_seconds: Option<f64>,
    pub cpet_performed: String,
    pub cpet_vo2_peak_ml_kg_min: Option<f64>,
    pub cpet_anaerobic_threshold_ml_kg_min: Option<f64>,
    pub cpet_notes: String,
    pub malnutrition_risk: String,
    pub unintentional_weight_loss_kg: Option<f64>,
    pub technique: String,
    pub airway_plan: String,
    pub rsi_planned: String,
    pub monitoring_level: String,
    pub analgesia_plan: String,
    pub regional_block_planned: String,
    pub dvt_prophylaxis: String,
    pub antibiotic_prophylaxis: String,
    pub post_op_disposition: String,
    pub anticipated_length_of_stay_days: Option<i32>,
    pub special_equipment: String,
    pub blood_products_required: String,
    pub proforma_header_department: String,
    pub proforma_header_registration_date: String,
    pub proforma_header_pre_op_diagnosis: String,
    pub prev_anaes_anaesthetic_difficulty: bool,
    pub prev_anaes_abnormal_reaction: bool,
    pub prev_anaes_ponv: bool,
    pub prev_anaes_malignant_hyperpyrexia: bool,
    pub prev_anaes_difficult_intubation: bool,
    pub prev_anaes_difficult_spinal_or_epidural: bool,
    pub addiction_alcohol: bool,
    pub addiction_smoking: bool,
    pub addiction_fast_score3_or_more: bool,
    pub addiction_betel: bool,
    pub addiction_drugs: bool,
    pub addiction_other: bool,
    pub addiction_other_details: String,
    pub pmh_proforma_hypertension: bool,
    pub pmh_proforma_mi: bool,
    pub pmh_proforma_mi_within_past6_months: bool,
    pub pmh_proforma_angina_or_chest_pain: bool,
    pub pmh_proforma_angina_triggers: String,
    pub pmh_proforma_heart_failure: bool,
    pub pmh_proforma_dyspnoea: bool,
    pub pmh_proforma_dyspnoea_subtypes: String,
    pub pmh_proforma_palpitation: bool,
    pub pmh_proforma_arrhythmia: bool,
    pub pmh_proforma_syncope_or_fainting: bool,
    pub pmh_proforma_heart_murmur: bool,
    pub pmh_proforma_rheumatic_fever: bool,
    pub pmh_proforma_pacemaker: bool,
    pub pmh_proforma_pacemaker_last_check_within6_months: bool,
    pub pmh_proforma_implanted_icd_crtd: bool,
    pub pmh_proforma_angioplasty: bool,
    pub pmh_proforma_stenting: bool,
    pub pmh_proforma_stenting_within_past6_months: bool,
    pub pmh_proforma_stent_type: String,
    pub pmh_proforma_valve_disease: bool,
    pub pmh_proforma_cardiac_surgery: bool,
    pub pmh_proforma_cardiac_surgery_within_past_year: bool,
    pub pmh_proforma_peripheral_vascular_disease: bool,
    pub pmh_proforma_ischemic_heart_disease: bool,
    pub pmh_proforma_asthma: bool,
    pub pmh_proforma_copd: bool,
    pub pmh_proforma_tb: bool,
    pub pmh_proforma_bronchiectasis: bool,
    pub pmh_proforma_previous_hospital_admission: bool,
    pub pmh_proforma_icu_admission: bool,
    pub pmh_proforma_on_home_oxygen_or_nebulizers: bool,
    pub pmh_proforma_uses_inhaler_daily_or_more: bool,
    pub pmh_proforma_flu_cough_sputum: bool,
    pub pmh_proforma_haemoptysis: bool,
    pub pmh_proforma_sleep_apnoea: bool,
    pub pmh_proforma_sleep_apnoea_using_cpap: bool,
    pub pmh_proforma_stop_bang_risk: String,
    pub pmh_proforma_other_respiratory_disease: bool,
    pub pmh_proforma_diabetes_mellitus: bool,
    pub pmh_proforma_diabetes_diet_controlled: bool,
    pub pmh_proforma_diabetes_drug_controlled: bool,
    pub pmh_proforma_diabetes_insulin_controlled: bool,
    pub pmh_proforma_diabetes_hba1c_over69: bool,
    pub pmh_proforma_hypothyroid: bool,
    pub pmh_proforma_hyperthyroid: bool,
    pub pmh_proforma_stroke_or_tia: bool,
    pub pmh_proforma_stroke_within3_months: bool,
    pub pmh_proforma_stroke_residual_disability: String,
    pub pmh_proforma_epilepsy_or_seizures: bool,
    pub pmh_proforma_epilepsy_control: String,
    pub pmh_proforma_ms: bool,
    pub pmh_proforma_muscular_dystrophy: bool,
    pub pmh_proforma_other_neurological_disease: bool,
    pub pmh_proforma_other_neurological_disease_details: String,
    pub pmh_proforma_dementia: bool,
    pub pmh_proforma_creutzfeldt_jakob_disease: bool,
    pub pmh_proforma_growth_hormone_or_gonadotrophin: bool,
    pub pmh_proforma_brain_or_spinal_cord_surgery: bool,
    pub pmh_proforma_four_at_score: Option<i32>,
    pub pmh_proforma_complex_needs: bool,
    pub pmh_proforma_renal_impairment: bool,
    pub pmh_proforma_ckd_stage3: bool,
    pub pmh_proforma_ckd_stage4_or_hemodialysis: bool,
    pub pmh_proforma_liver_disease: bool,
    pub pmh_proforma_clotting_disorders_haemophilia: bool,
    pub pmh_proforma_easy_bruising_prolonged_bleeding: bool,
    pub pmh_proforma_dvt_or_pe: bool,
    pub pmh_proforma_dvt_or_pe_within_past3_months: bool,
    pub pmh_proforma_gord: bool,
    pub pmh_proforma_any_other_disease: bool,
    pub pmh_proforma_chronic_pain: bool,
    pub pmh_proforma_duke_activity_status_index: Option<i32>,
    pub pmh_proforma_mets_score: Option<f64>,
    pub pmh_proforma_ongoing_medications: String,
    pub pmh_proforma_cortisone_prednisone_steroid: bool,
    pub pmh_proforma_blood_transfusion_history: bool,
    pub pmh_proforma_chemotherapy_drugs: bool,
    pub pmh_proforma_radiotherapy: bool,
    pub airway_exam_proforma_mouth_opening: bool,
    pub airway_exam_proforma_loose_teeth: bool,
    pub airway_exam_proforma_denture_missing: bool,
    pub airway_exam_proforma_mp_grade: String,
    pub airway_exam_proforma_micrognathia: bool,
    pub airway_exam_proforma_tm_distance_over65: bool,
    pub airway_exam_proforma_mo_distance: bool,
    pub airway_exam_proforma_tm_joint: bool,
    pub airway_exam_proforma_short_neck_rom: bool,
    pub airway_exam_proforma_difficult_airway: bool,
    pub airway_exam_proforma_obesity_scoring: bool,
    pub airway_exam_proforma_spine_back: bool,
    pub airway_exam_proforma_scoliosis: bool,
    pub airway_exam_proforma_vitals_examination: bool,
    pub vitals_proforma_height_cm: Option<f64>,
    pub vitals_proforma_weight_kg: Option<f64>,
    pub vitals_proforma_hr: Option<i32>,
    pub vitals_proforma_bp: String,
    pub vitals_proforma_resp_rate: Option<i32>,
    pub vitals_proforma_spo2: Option<f64>,
    pub vitals_proforma_temp: Option<f64>,
    pub vitals_proforma_bmi: Option<f64>,
    pub gen_exam_proforma_pallor: bool,
    pub gen_exam_proforma_icterus: bool,
    pub gen_exam_proforma_cyanosis: bool,
    pub gen_exam_proforma_clubbing: bool,
    pub gen_exam_proforma_koilonychia: bool,
    pub gen_exam_proforma_lymphadenopathy: bool,
    pub gen_exam_proforma_edema: bool,
    pub gen_exam_proforma_jvp: bool,
    pub invest_proforma_blood_group_haemoglobin: String,
    pub invest_proforma_differential_n: String,
    pub invest_proforma_differential_l: String,
    pub invest_proforma_differential_e: String,
    pub invest_proforma_differential_m: String,
    pub invest_proforma_differential_b: String,
    pub invest_proforma_absolute: String,
    pub invest_proforma_nc: String,
    pub invest_proforma_tlc: String,
    pub invest_proforma_tpc: String,
    pub invest_proforma_esr: String,
    pub invest_proforma_crp: String,
    pub invest_proforma_pcv: String,
    pub invest_proforma_latex_rast: String,
    pub invest_proforma_fbs: String,
    pub invest_proforma_ppbs: String,
    pub invest_proforma_hba1c: String,
    pub invest_proforma_na: String,
    pub invest_proforma_k: String,
    pub invest_proforma_urea: String,
    pub invest_proforma_creatinine: String,
    pub invest_proforma_bilirubin_total: String,
    pub invest_proforma_bilirubin_direct: String,
    pub invest_proforma_alk_phosphatase: String,
    pub invest_proforma_sgpt_alt: String,
    pub invest_proforma_sgot_ast: String,
    pub invest_proforma_bt: String,
    pub invest_proforma_ct: String,
    pub invest_proforma_pt: String,
    pub invest_proforma_aptt: String,
    pub invest_proforma_inr: String,
    pub invest_proforma_ft3: String,
    pub invest_proforma_ft4: String,
    pub invest_proforma_tsh: String,
    pub invest_proforma_ecg: String,
    pub invest_proforma_chest_xray: String,
    pub invest_proforma_pft: String,
    pub invest_proforma_abg: String,
    pub invest_proforma_two_d_echo: String,
    pub invest_proforma_lvef_percent: Option<f64>,
    pub invest_proforma_tmt: String,
    pub invest_proforma_ct_scan: String,
    pub invest_proforma_mri: String,
    pub risk_factors_cardiac: bool,
    pub risk_factors_respiratory: bool,
    pub risk_factors_diabetes: bool,
    pub risk_factors_insulin: bool,
    pub risk_factors_bmi_over40: bool,
    pub risk_factors_anticoagulants: bool,
    pub risk_factors_allergies: bool,
    pub risk_factors_antiplatelets: bool,
    pub risk_factors_egfr_under30: bool,
    pub risk_factors_egfr30_to60: bool,
    pub risk_factors_age_over70: bool,
    pub risk_factors_pvd: bool,
    pub risk_factors_liver_disease: bool,
    pub risk_factors_vte_risk: bool,
    pub risk_factors_complex_needs: bool,
    pub risk_factors_anaemia: bool,
    pub risk_factors_neuromuscular_disorders: bool,
    pub risk_factors_others: bool,
    pub risk_factors_others_details: String,
    pub anaes_plan_proforma_anaesthetic_concerns: String,
    pub anaes_plan_proforma_plan_tiva: bool,
    pub anaes_plan_proforma_plan_ra: bool,
    pub anaes_plan_proforma_plan_other: bool,
    pub anaes_plan_proforma_plan_other_details: String,
    pub anaes_plan_proforma_list_for_ot_defer_not_fit: String,
    pub anaes_plan_proforma_nil_orally_after: String,
    pub anaes_plan_proforma_informed_written_consent: bool,
    pub anaes_plan_proforma_risks_benefits_alternatives_discussed: bool,
    pub anaes_plan_proforma_arrange_units_of_blood: String,
    pub anaes_plan_proforma_arrange_post_op_icu: bool,
    pub anaes_plan_proforma_backup: bool,
    pub anaes_plan_proforma_do_investigations: String,
    pub anaes_plan_proforma_do_special_orders: String,
    pub anaes_plan_proforma_reviewed_high_risk_anaesthesia: bool,
    pub anaes_plan_proforma_reviewed_consent: bool,
    pub anaes_plan_proforma_consultant_anaesthesiologist_name: String,
    pub anaes_plan_proforma_consultant_anaesthesiologist_signature: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pre_anaesthesia_assessments (deleted_at, patient_id, clinician_id, \
            status, site_name, assessment_date, assessment_time, planned_procedure, \
            surgical_specialty, urgency, laterality, surgical_severity, \
            anticipated_blood_loss_ml, anticipated_duration_minutes, consultant_surgeon, \
            planned_date, systolic_bp, diastolic_bp, heart_rate, respiratory_rate, \
            spo2_percent, temperature_celsius, capillary_refill_seconds, pain_score_0_10, \
            on_room_air, supplemental_oxygen_litres, mallampati_class, \
            thyromental_distance_cm, mouth_opening_cm, inter_incisor_gap_cm, neck_rom, \
            cervical_spine_stability, dentition, beard, upper_lip_bite_test, \
            prior_difficult_intubation, stopbang_snoring, stopbang_tired, \
            stopbang_observed_apnoea, stopbang_pressure, stopbang_bmi_gt35, \
            stopbang_age_gt50, stopbang_neck_gt40, stopbang_male, airway_notes, heart_rhythm, \
            murmur_present, murmur_description, peripheral_pulses, jvp_raised, \
            peripheral_oedema, ecg_performed, ecg_rhythm, ecg_rate_bpm, ecg_axis, \
            ecg_ischaemic_changes, ecg_notes, echo_performed, echo_ef_percent, echo_notes, \
            history_ihd, history_chf, history_stroke_tia, recent_mi_within_3_months, \
            pacemaker_or_icd, severe_valve_dysfunction, active_angina, breath_sounds, wheeze, \
            crackles, crepitations, chest_wall_deformity, asthma, copd, cxr_performed, \
            cxr_findings, pft_performed, pft_fev1_percent_predicted, pft_fev1_fvc_ratio, \
            smoking_status, pack_years, covid_history, days_since_covid, \
            covid_unresolved_symptoms, gcs_total, gcs_eye, gcs_verbal, gcs_motor, \
            cognition_tool, cognition_score, cognitive_impairment, capacity_concern, \
            cranial_nerves_notes, motor_power, sensory_notes, reflexes, recent_stroke_tia, \
            days_since_stroke_tia, seizure_disorder, creatinine_umol_l, egfr_ml_min_1_73m2, \
            urea_mmol_l, potassium_mmol_l, sodium_mmol_l, dialysis_status, ckd_stage, \
            bilirubin_umol_l, alt_u_l, ast_u_l, alp_u_l, albumin_g_l, chronic_liver_disease, \
            child_pugh_class, hb_g_l, wcc_10_9_l, platelets_10_9_l, mcv_fl, ferritin_ug_l, \
            transferrin_saturation_percent, inr, aptt_seconds, fibrinogen_g_l, \
            on_anticoagulant, anticoagulant_type, anticoagulant_hold_plan, group_and_save, \
            crossmatch_units, last_transfusion_date, anaemia_severity, diabetes_type, \
            diabetes_on_insulin, hba1c_mmol_mol, fasting_glucose_mmol_l, \
            random_glucose_mmol_l, diabetes_control, diabetes_complications, thyroid_status, \
            tsh_mu_l, adrenal_status, on_long_term_steroids, steroid_dose_mg, \
            steroid_cover_plan, abdominal_exam, abdominal_notes, reflux_symptoms, \
            hiatus_hernia, previous_gastric_surgery, ng_tube, stoma, fasting_confirmed, \
            last_solid_food_at, last_clear_fluid_at, rapid_sequence_induction_needed, \
            spine_exam, spine_notes, neuraxial_suitable, joint_rom_hip, joint_rom_shoulder, \
            joint_rom_neck, skin_iv_access, skin_block_site, pressure_ulcer_risk, name, dose, \
            route, frequency, indication, class, perioperative_action, perioperative_notes, \
            last_dose_at, allergen, category, reaction_type, reaction_severity, \
            reaction_notes, verified, mets_estimate, dasi_score, ecog_performance_status, \
            clinical_frailty_scale, six_minute_walk_metres, sts_one_minute_reps, tug_seconds, \
            cpet_performed, cpet_vo2_peak_ml_kg_min, cpet_anaerobic_threshold_ml_kg_min, \
            cpet_notes, malnutrition_risk, unintentional_weight_loss_kg, technique, \
            airway_plan, rsi_planned, monitoring_level, analgesia_plan, \
            regional_block_planned, dvt_prophylaxis, antibiotic_prophylaxis, \
            post_op_disposition, anticipated_length_of_stay_days, special_equipment, \
            blood_products_required, proforma_header_department, \
            proforma_header_registration_date, proforma_header_pre_op_diagnosis, \
            prev_anaes_anaesthetic_difficulty, prev_anaes_abnormal_reaction, prev_anaes_ponv, \
            prev_anaes_malignant_hyperpyrexia, prev_anaes_difficult_intubation, \
            prev_anaes_difficult_spinal_or_epidural, addiction_alcohol, addiction_smoking, \
            addiction_fast_score3_or_more, addiction_betel, addiction_drugs, addiction_other, \
            addiction_other_details, pmh_proforma_hypertension, pmh_proforma_mi, \
            pmh_proforma_mi_within_past6_months, pmh_proforma_angina_or_chest_pain, \
            pmh_proforma_angina_triggers, pmh_proforma_heart_failure, pmh_proforma_dyspnoea, \
            pmh_proforma_dyspnoea_subtypes, pmh_proforma_palpitation, \
            pmh_proforma_arrhythmia, pmh_proforma_syncope_or_fainting, \
            pmh_proforma_heart_murmur, pmh_proforma_rheumatic_fever, pmh_proforma_pacemaker, \
            pmh_proforma_pacemaker_last_check_within6_months, \
            pmh_proforma_implanted_icd_crtd, pmh_proforma_angioplasty, pmh_proforma_stenting, \
            pmh_proforma_stenting_within_past6_months, pmh_proforma_stent_type, \
            pmh_proforma_valve_disease, pmh_proforma_cardiac_surgery, \
            pmh_proforma_cardiac_surgery_within_past_year, \
            pmh_proforma_peripheral_vascular_disease, pmh_proforma_ischemic_heart_disease, \
            pmh_proforma_asthma, pmh_proforma_copd, pmh_proforma_tb, \
            pmh_proforma_bronchiectasis, pmh_proforma_previous_hospital_admission, \
            pmh_proforma_icu_admission, pmh_proforma_on_home_oxygen_or_nebulizers, \
            pmh_proforma_uses_inhaler_daily_or_more, pmh_proforma_flu_cough_sputum, \
            pmh_proforma_haemoptysis, pmh_proforma_sleep_apnoea, \
            pmh_proforma_sleep_apnoea_using_cpap, pmh_proforma_stop_bang_risk, \
            pmh_proforma_other_respiratory_disease, pmh_proforma_diabetes_mellitus, \
            pmh_proforma_diabetes_diet_controlled, pmh_proforma_diabetes_drug_controlled, \
            pmh_proforma_diabetes_insulin_controlled, pmh_proforma_diabetes_hba1c_over69, \
            pmh_proforma_hypothyroid, pmh_proforma_hyperthyroid, pmh_proforma_stroke_or_tia, \
            pmh_proforma_stroke_within3_months, pmh_proforma_stroke_residual_disability, \
            pmh_proforma_epilepsy_or_seizures, pmh_proforma_epilepsy_control, \
            pmh_proforma_ms, pmh_proforma_muscular_dystrophy, \
            pmh_proforma_other_neurological_disease, \
            pmh_proforma_other_neurological_disease_details, pmh_proforma_dementia, \
            pmh_proforma_creutzfeldt_jakob_disease, \
            pmh_proforma_growth_hormone_or_gonadotrophin, \
            pmh_proforma_brain_or_spinal_cord_surgery, pmh_proforma_four_at_score, \
            pmh_proforma_complex_needs, pmh_proforma_renal_impairment, \
            pmh_proforma_ckd_stage3, pmh_proforma_ckd_stage4_or_hemodialysis, \
            pmh_proforma_liver_disease, pmh_proforma_clotting_disorders_haemophilia, \
            pmh_proforma_easy_bruising_prolonged_bleeding, pmh_proforma_dvt_or_pe, \
            pmh_proforma_dvt_or_pe_within_past3_months, pmh_proforma_gord, \
            pmh_proforma_any_other_disease, pmh_proforma_chronic_pain, \
            pmh_proforma_duke_activity_status_index, pmh_proforma_mets_score, \
            pmh_proforma_ongoing_medications, pmh_proforma_cortisone_prednisone_steroid, \
            pmh_proforma_blood_transfusion_history, pmh_proforma_chemotherapy_drugs, \
            pmh_proforma_radiotherapy, airway_exam_proforma_mouth_opening, \
            airway_exam_proforma_loose_teeth, airway_exam_proforma_denture_missing, \
            airway_exam_proforma_mp_grade, airway_exam_proforma_micrognathia, \
            airway_exam_proforma_tm_distance_over65, airway_exam_proforma_mo_distance, \
            airway_exam_proforma_tm_joint, airway_exam_proforma_short_neck_rom, \
            airway_exam_proforma_difficult_airway, airway_exam_proforma_obesity_scoring, \
            airway_exam_proforma_spine_back, airway_exam_proforma_scoliosis, \
            airway_exam_proforma_vitals_examination, vitals_proforma_height_cm, \
            vitals_proforma_weight_kg, vitals_proforma_hr, vitals_proforma_bp, \
            vitals_proforma_resp_rate, vitals_proforma_spo2, vitals_proforma_temp, \
            vitals_proforma_bmi, gen_exam_proforma_pallor, gen_exam_proforma_icterus, \
            gen_exam_proforma_cyanosis, gen_exam_proforma_clubbing, \
            gen_exam_proforma_koilonychia, gen_exam_proforma_lymphadenopathy, \
            gen_exam_proforma_edema, gen_exam_proforma_jvp, \
            invest_proforma_blood_group_haemoglobin, invest_proforma_differential_n, \
            invest_proforma_differential_l, invest_proforma_differential_e, \
            invest_proforma_differential_m, invest_proforma_differential_b, \
            invest_proforma_absolute, invest_proforma_nc, invest_proforma_tlc, \
            invest_proforma_tpc, invest_proforma_esr, invest_proforma_crp, \
            invest_proforma_pcv, invest_proforma_latex_rast, invest_proforma_fbs, \
            invest_proforma_ppbs, invest_proforma_hba1c, invest_proforma_na, \
            invest_proforma_k, invest_proforma_urea, invest_proforma_creatinine, \
            invest_proforma_bilirubin_total, invest_proforma_bilirubin_direct, \
            invest_proforma_alk_phosphatase, invest_proforma_sgpt_alt, \
            invest_proforma_sgot_ast, invest_proforma_bt, invest_proforma_ct, \
            invest_proforma_pt, invest_proforma_aptt, invest_proforma_inr, \
            invest_proforma_ft3, invest_proforma_ft4, invest_proforma_tsh, \
            invest_proforma_ecg, invest_proforma_chest_xray, invest_proforma_pft, \
            invest_proforma_abg, invest_proforma_two_d_echo, invest_proforma_lvef_percent, \
            invest_proforma_tmt, invest_proforma_ct_scan, invest_proforma_mri, \
            risk_factors_cardiac, risk_factors_respiratory, risk_factors_diabetes, \
            risk_factors_insulin, risk_factors_bmi_over40, risk_factors_anticoagulants, \
            risk_factors_allergies, risk_factors_antiplatelets, risk_factors_egfr_under30, \
            risk_factors_egfr30_to60, risk_factors_age_over70, risk_factors_pvd, \
            risk_factors_liver_disease, risk_factors_vte_risk, risk_factors_complex_needs, \
            risk_factors_anaemia, risk_factors_neuromuscular_disorders, risk_factors_others, \
            risk_factors_others_details, anaes_plan_proforma_anaesthetic_concerns, \
            anaes_plan_proforma_plan_tiva, anaes_plan_proforma_plan_ra, \
            anaes_plan_proforma_plan_other, anaes_plan_proforma_plan_other_details, \
            anaes_plan_proforma_list_for_ot_defer_not_fit, \
            anaes_plan_proforma_nil_orally_after, \
            anaes_plan_proforma_informed_written_consent, \
            anaes_plan_proforma_risks_benefits_alternatives_discussed, \
            anaes_plan_proforma_arrange_units_of_blood, \
            anaes_plan_proforma_arrange_post_op_icu, anaes_plan_proforma_backup, \
            anaes_plan_proforma_do_investigations, anaes_plan_proforma_do_special_orders, \
            anaes_plan_proforma_reviewed_high_risk_anaesthesia, \
            anaes_plan_proforma_reviewed_consent, \
            anaes_plan_proforma_consultant_anaesthesiologist_name, \
            anaes_plan_proforma_consultant_anaesthesiologist_signature) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, \
            $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, \
            $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, \
            $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, \
            $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, \
            $101, $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, $113, \
            $114, $115, $116, $117, $118, $119, $120, $121, $122, $123, $124, $125, $126, \
            $127, $128, $129, $130, $131, $132, $133, $134, $135, $136, $137, $138, $139, \
            $140, $141, $142, $143, $144, $145, $146, $147, $148, $149, $150, $151, $152, \
            $153, $154, $155, $156, $157, $158, $159, $160, $161, $162, $163, $164, $165, \
            $166, $167, $168, $169, $170, $171, $172, $173, $174, $175, $176, $177, $178, \
            $179, $180, $181, $182, $183, $184, $185, $186, $187, $188, $189, $190, $191, \
            $192, $193, $194, $195, $196, $197, $198, $199, $200, $201, $202, $203, $204, \
            $205, $206, $207, $208, $209, $210, $211, $212, $213, $214, $215, $216, $217, \
            $218, $219, $220, $221, $222, $223, $224, $225, $226, $227, $228, $229, $230, \
            $231, $232, $233, $234, $235, $236, $237, $238, $239, $240, $241, $242, $243, \
            $244, $245, $246, $247, $248, $249, $250, $251, $252, $253, $254, $255, $256, \
            $257, $258, $259, $260, $261, $262, $263, $264, $265, $266, $267, $268, $269, \
            $270, $271, $272, $273, $274, $275, $276, $277, $278, $279, $280, $281, $282, \
            $283, $284, $285, $286, $287, $288, $289, $290, $291, $292, $293, $294, $295, \
            $296, $297, $298, $299, $300, $301, $302, $303, $304, $305, $306, $307, $308, \
            $309, $310, $311, $312, $313, $314, $315, $316, $317, $318, $319, $320, $321, \
            $322, $323, $324, $325, $326, $327, $328, $329, $330, $331, $332, $333, $334, \
            $335, $336, $337, $338, $339, $340, $341, $342, $343, $344, $345, $346, $347, \
            $348, $349, $350, $351, $352, $353, $354, $355, $356, $357, $358, $359, $360, \
            $361, $362, $363, $364, $365, $366, $367, $368, $369, $370, $371, $372, $373, \
            $374, $375, $376, $377, $378, $379, $380, $381, $382, $383, $384, $385, $386, \
            $387, $388, $389, $390, $391, $392, $393, $394, $395, $396, $397, $398, $399, \
            $400, $401, $402, $403, $404, $405, $406, $407) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.planned_procedure)
        .bind(&self.surgical_specialty)
        .bind(&self.urgency)
        .bind(&self.laterality)
        .bind(&self.surgical_severity)
        .bind(self.anticipated_blood_loss_ml)
        .bind(self.anticipated_duration_minutes)
        .bind(&self.consultant_surgeon)
        .bind(self.planned_date)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.heart_rate)
        .bind(self.respiratory_rate)
        .bind(self.spo2_percent)
        .bind(self.temperature_celsius)
        .bind(self.capillary_refill_seconds)
        .bind(self.pain_score_0_10)
        .bind(&self.on_room_air)
        .bind(self.supplemental_oxygen_litres)
        .bind(&self.mallampati_class)
        .bind(self.thyromental_distance_cm)
        .bind(self.mouth_opening_cm)
        .bind(self.inter_incisor_gap_cm)
        .bind(&self.neck_rom)
        .bind(&self.cervical_spine_stability)
        .bind(&self.dentition)
        .bind(&self.beard)
        .bind(&self.upper_lip_bite_test)
        .bind(&self.prior_difficult_intubation)
        .bind(&self.stopbang_snoring)
        .bind(&self.stopbang_tired)
        .bind(&self.stopbang_observed_apnoea)
        .bind(&self.stopbang_pressure)
        .bind(&self.stopbang_bmi_gt35)
        .bind(&self.stopbang_age_gt50)
        .bind(&self.stopbang_neck_gt40)
        .bind(&self.stopbang_male)
        .bind(&self.airway_notes)
        .bind(&self.heart_rhythm)
        .bind(&self.murmur_present)
        .bind(&self.murmur_description)
        .bind(&self.peripheral_pulses)
        .bind(&self.jvp_raised)
        .bind(&self.peripheral_oedema)
        .bind(&self.ecg_performed)
        .bind(&self.ecg_rhythm)
        .bind(self.ecg_rate_bpm)
        .bind(&self.ecg_axis)
        .bind(&self.ecg_ischaemic_changes)
        .bind(&self.ecg_notes)
        .bind(&self.echo_performed)
        .bind(self.echo_ef_percent)
        .bind(&self.echo_notes)
        .bind(&self.history_ihd)
        .bind(&self.history_chf)
        .bind(&self.history_stroke_tia)
        .bind(&self.recent_mi_within_3_months)
        .bind(&self.pacemaker_or_icd)
        .bind(&self.severe_valve_dysfunction)
        .bind(&self.active_angina)
        .bind(&self.breath_sounds)
        .bind(&self.wheeze)
        .bind(&self.crackles)
        .bind(&self.crepitations)
        .bind(&self.chest_wall_deformity)
        .bind(&self.asthma)
        .bind(&self.copd)
        .bind(&self.cxr_performed)
        .bind(&self.cxr_findings)
        .bind(&self.pft_performed)
        .bind(self.pft_fev1_percent_predicted)
        .bind(self.pft_fev1_fvc_ratio)
        .bind(&self.smoking_status)
        .bind(self.pack_years)
        .bind(&self.covid_history)
        .bind(self.days_since_covid)
        .bind(&self.covid_unresolved_symptoms)
        .bind(self.gcs_total)
        .bind(self.gcs_eye)
        .bind(self.gcs_verbal)
        .bind(self.gcs_motor)
        .bind(&self.cognition_tool)
        .bind(self.cognition_score)
        .bind(&self.cognitive_impairment)
        .bind(&self.capacity_concern)
        .bind(&self.cranial_nerves_notes)
        .bind(&self.motor_power)
        .bind(&self.sensory_notes)
        .bind(&self.reflexes)
        .bind(&self.recent_stroke_tia)
        .bind(self.days_since_stroke_tia)
        .bind(&self.seizure_disorder)
        .bind(self.creatinine_umol_l)
        .bind(self.egfr_ml_min_1_73m2)
        .bind(self.urea_mmol_l)
        .bind(self.potassium_mmol_l)
        .bind(self.sodium_mmol_l)
        .bind(&self.dialysis_status)
        .bind(&self.ckd_stage)
        .bind(self.bilirubin_umol_l)
        .bind(self.alt_u_l)
        .bind(self.ast_u_l)
        .bind(self.alp_u_l)
        .bind(self.albumin_g_l)
        .bind(&self.chronic_liver_disease)
        .bind(&self.child_pugh_class)
        .bind(self.hb_g_l)
        .bind(self.wcc_10_9_l)
        .bind(self.platelets_10_9_l)
        .bind(self.mcv_fl)
        .bind(self.ferritin_ug_l)
        .bind(self.transferrin_saturation_percent)
        .bind(self.inr)
        .bind(self.aptt_seconds)
        .bind(self.fibrinogen_g_l)
        .bind(&self.on_anticoagulant)
        .bind(&self.anticoagulant_type)
        .bind(&self.anticoagulant_hold_plan)
        .bind(&self.group_and_save)
        .bind(self.crossmatch_units)
        .bind(self.last_transfusion_date)
        .bind(&self.anaemia_severity)
        .bind(&self.diabetes_type)
        .bind(&self.diabetes_on_insulin)
        .bind(self.hba1c_mmol_mol)
        .bind(self.fasting_glucose_mmol_l)
        .bind(self.random_glucose_mmol_l)
        .bind(&self.diabetes_control)
        .bind(&self.diabetes_complications)
        .bind(&self.thyroid_status)
        .bind(self.tsh_mu_l)
        .bind(&self.adrenal_status)
        .bind(&self.on_long_term_steroids)
        .bind(self.steroid_dose_mg)
        .bind(&self.steroid_cover_plan)
        .bind(&self.abdominal_exam)
        .bind(&self.abdominal_notes)
        .bind(&self.reflux_symptoms)
        .bind(&self.hiatus_hernia)
        .bind(&self.previous_gastric_surgery)
        .bind(&self.ng_tube)
        .bind(&self.stoma)
        .bind(&self.fasting_confirmed)
        .bind(self.last_solid_food_at)
        .bind(self.last_clear_fluid_at)
        .bind(&self.rapid_sequence_induction_needed)
        .bind(&self.spine_exam)
        .bind(&self.spine_notes)
        .bind(&self.neuraxial_suitable)
        .bind(&self.joint_rom_hip)
        .bind(&self.joint_rom_shoulder)
        .bind(&self.joint_rom_neck)
        .bind(&self.skin_iv_access)
        .bind(&self.skin_block_site)
        .bind(&self.pressure_ulcer_risk)
        .bind(&self.name)
        .bind(&self.dose)
        .bind(&self.route)
        .bind(&self.frequency)
        .bind(&self.indication)
        .bind(&self.class)
        .bind(&self.perioperative_action)
        .bind(&self.perioperative_notes)
        .bind(self.last_dose_at)
        .bind(&self.allergen)
        .bind(&self.category)
        .bind(&self.reaction_type)
        .bind(&self.reaction_severity)
        .bind(&self.reaction_notes)
        .bind(&self.verified)
        .bind(self.mets_estimate)
        .bind(self.dasi_score)
        .bind(self.ecog_performance_status)
        .bind(self.clinical_frailty_scale)
        .bind(self.six_minute_walk_metres)
        .bind(self.sts_one_minute_reps)
        .bind(self.tug_seconds)
        .bind(&self.cpet_performed)
        .bind(self.cpet_vo2_peak_ml_kg_min)
        .bind(self.cpet_anaerobic_threshold_ml_kg_min)
        .bind(&self.cpet_notes)
        .bind(&self.malnutrition_risk)
        .bind(self.unintentional_weight_loss_kg)
        .bind(&self.technique)
        .bind(&self.airway_plan)
        .bind(&self.rsi_planned)
        .bind(&self.monitoring_level)
        .bind(&self.analgesia_plan)
        .bind(&self.regional_block_planned)
        .bind(&self.dvt_prophylaxis)
        .bind(&self.antibiotic_prophylaxis)
        .bind(&self.post_op_disposition)
        .bind(self.anticipated_length_of_stay_days)
        .bind(&self.special_equipment)
        .bind(&self.blood_products_required)
        .bind(&self.proforma_header_department)
        .bind(&self.proforma_header_registration_date)
        .bind(&self.proforma_header_pre_op_diagnosis)
        .bind(self.prev_anaes_anaesthetic_difficulty)
        .bind(self.prev_anaes_abnormal_reaction)
        .bind(self.prev_anaes_ponv)
        .bind(self.prev_anaes_malignant_hyperpyrexia)
        .bind(self.prev_anaes_difficult_intubation)
        .bind(self.prev_anaes_difficult_spinal_or_epidural)
        .bind(self.addiction_alcohol)
        .bind(self.addiction_smoking)
        .bind(self.addiction_fast_score3_or_more)
        .bind(self.addiction_betel)
        .bind(self.addiction_drugs)
        .bind(self.addiction_other)
        .bind(&self.addiction_other_details)
        .bind(self.pmh_proforma_hypertension)
        .bind(self.pmh_proforma_mi)
        .bind(self.pmh_proforma_mi_within_past6_months)
        .bind(self.pmh_proforma_angina_or_chest_pain)
        .bind(&self.pmh_proforma_angina_triggers)
        .bind(self.pmh_proforma_heart_failure)
        .bind(self.pmh_proforma_dyspnoea)
        .bind(&self.pmh_proforma_dyspnoea_subtypes)
        .bind(self.pmh_proforma_palpitation)
        .bind(self.pmh_proforma_arrhythmia)
        .bind(self.pmh_proforma_syncope_or_fainting)
        .bind(self.pmh_proforma_heart_murmur)
        .bind(self.pmh_proforma_rheumatic_fever)
        .bind(self.pmh_proforma_pacemaker)
        .bind(self.pmh_proforma_pacemaker_last_check_within6_months)
        .bind(self.pmh_proforma_implanted_icd_crtd)
        .bind(self.pmh_proforma_angioplasty)
        .bind(self.pmh_proforma_stenting)
        .bind(self.pmh_proforma_stenting_within_past6_months)
        .bind(&self.pmh_proforma_stent_type)
        .bind(self.pmh_proforma_valve_disease)
        .bind(self.pmh_proforma_cardiac_surgery)
        .bind(self.pmh_proforma_cardiac_surgery_within_past_year)
        .bind(self.pmh_proforma_peripheral_vascular_disease)
        .bind(self.pmh_proforma_ischemic_heart_disease)
        .bind(self.pmh_proforma_asthma)
        .bind(self.pmh_proforma_copd)
        .bind(self.pmh_proforma_tb)
        .bind(self.pmh_proforma_bronchiectasis)
        .bind(self.pmh_proforma_previous_hospital_admission)
        .bind(self.pmh_proforma_icu_admission)
        .bind(self.pmh_proforma_on_home_oxygen_or_nebulizers)
        .bind(self.pmh_proforma_uses_inhaler_daily_or_more)
        .bind(self.pmh_proforma_flu_cough_sputum)
        .bind(self.pmh_proforma_haemoptysis)
        .bind(self.pmh_proforma_sleep_apnoea)
        .bind(self.pmh_proforma_sleep_apnoea_using_cpap)
        .bind(&self.pmh_proforma_stop_bang_risk)
        .bind(self.pmh_proforma_other_respiratory_disease)
        .bind(self.pmh_proforma_diabetes_mellitus)
        .bind(self.pmh_proforma_diabetes_diet_controlled)
        .bind(self.pmh_proforma_diabetes_drug_controlled)
        .bind(self.pmh_proforma_diabetes_insulin_controlled)
        .bind(self.pmh_proforma_diabetes_hba1c_over69)
        .bind(self.pmh_proforma_hypothyroid)
        .bind(self.pmh_proforma_hyperthyroid)
        .bind(self.pmh_proforma_stroke_or_tia)
        .bind(self.pmh_proforma_stroke_within3_months)
        .bind(&self.pmh_proforma_stroke_residual_disability)
        .bind(self.pmh_proforma_epilepsy_or_seizures)
        .bind(&self.pmh_proforma_epilepsy_control)
        .bind(self.pmh_proforma_ms)
        .bind(self.pmh_proforma_muscular_dystrophy)
        .bind(self.pmh_proforma_other_neurological_disease)
        .bind(&self.pmh_proforma_other_neurological_disease_details)
        .bind(self.pmh_proforma_dementia)
        .bind(self.pmh_proforma_creutzfeldt_jakob_disease)
        .bind(self.pmh_proforma_growth_hormone_or_gonadotrophin)
        .bind(self.pmh_proforma_brain_or_spinal_cord_surgery)
        .bind(self.pmh_proforma_four_at_score)
        .bind(self.pmh_proforma_complex_needs)
        .bind(self.pmh_proforma_renal_impairment)
        .bind(self.pmh_proforma_ckd_stage3)
        .bind(self.pmh_proforma_ckd_stage4_or_hemodialysis)
        .bind(self.pmh_proforma_liver_disease)
        .bind(self.pmh_proforma_clotting_disorders_haemophilia)
        .bind(self.pmh_proforma_easy_bruising_prolonged_bleeding)
        .bind(self.pmh_proforma_dvt_or_pe)
        .bind(self.pmh_proforma_dvt_or_pe_within_past3_months)
        .bind(self.pmh_proforma_gord)
        .bind(self.pmh_proforma_any_other_disease)
        .bind(self.pmh_proforma_chronic_pain)
        .bind(self.pmh_proforma_duke_activity_status_index)
        .bind(self.pmh_proforma_mets_score)
        .bind(&self.pmh_proforma_ongoing_medications)
        .bind(self.pmh_proforma_cortisone_prednisone_steroid)
        .bind(self.pmh_proforma_blood_transfusion_history)
        .bind(self.pmh_proforma_chemotherapy_drugs)
        .bind(self.pmh_proforma_radiotherapy)
        .bind(self.airway_exam_proforma_mouth_opening)
        .bind(self.airway_exam_proforma_loose_teeth)
        .bind(self.airway_exam_proforma_denture_missing)
        .bind(&self.airway_exam_proforma_mp_grade)
        .bind(self.airway_exam_proforma_micrognathia)
        .bind(self.airway_exam_proforma_tm_distance_over65)
        .bind(self.airway_exam_proforma_mo_distance)
        .bind(self.airway_exam_proforma_tm_joint)
        .bind(self.airway_exam_proforma_short_neck_rom)
        .bind(self.airway_exam_proforma_difficult_airway)
        .bind(self.airway_exam_proforma_obesity_scoring)
        .bind(self.airway_exam_proforma_spine_back)
        .bind(self.airway_exam_proforma_scoliosis)
        .bind(self.airway_exam_proforma_vitals_examination)
        .bind(self.vitals_proforma_height_cm)
        .bind(self.vitals_proforma_weight_kg)
        .bind(self.vitals_proforma_hr)
        .bind(&self.vitals_proforma_bp)
        .bind(self.vitals_proforma_resp_rate)
        .bind(self.vitals_proforma_spo2)
        .bind(self.vitals_proforma_temp)
        .bind(self.vitals_proforma_bmi)
        .bind(self.gen_exam_proforma_pallor)
        .bind(self.gen_exam_proforma_icterus)
        .bind(self.gen_exam_proforma_cyanosis)
        .bind(self.gen_exam_proforma_clubbing)
        .bind(self.gen_exam_proforma_koilonychia)
        .bind(self.gen_exam_proforma_lymphadenopathy)
        .bind(self.gen_exam_proforma_edema)
        .bind(self.gen_exam_proforma_jvp)
        .bind(&self.invest_proforma_blood_group_haemoglobin)
        .bind(&self.invest_proforma_differential_n)
        .bind(&self.invest_proforma_differential_l)
        .bind(&self.invest_proforma_differential_e)
        .bind(&self.invest_proforma_differential_m)
        .bind(&self.invest_proforma_differential_b)
        .bind(&self.invest_proforma_absolute)
        .bind(&self.invest_proforma_nc)
        .bind(&self.invest_proforma_tlc)
        .bind(&self.invest_proforma_tpc)
        .bind(&self.invest_proforma_esr)
        .bind(&self.invest_proforma_crp)
        .bind(&self.invest_proforma_pcv)
        .bind(&self.invest_proforma_latex_rast)
        .bind(&self.invest_proforma_fbs)
        .bind(&self.invest_proforma_ppbs)
        .bind(&self.invest_proforma_hba1c)
        .bind(&self.invest_proforma_na)
        .bind(&self.invest_proforma_k)
        .bind(&self.invest_proforma_urea)
        .bind(&self.invest_proforma_creatinine)
        .bind(&self.invest_proforma_bilirubin_total)
        .bind(&self.invest_proforma_bilirubin_direct)
        .bind(&self.invest_proforma_alk_phosphatase)
        .bind(&self.invest_proforma_sgpt_alt)
        .bind(&self.invest_proforma_sgot_ast)
        .bind(&self.invest_proforma_bt)
        .bind(&self.invest_proforma_ct)
        .bind(&self.invest_proforma_pt)
        .bind(&self.invest_proforma_aptt)
        .bind(&self.invest_proforma_inr)
        .bind(&self.invest_proforma_ft3)
        .bind(&self.invest_proforma_ft4)
        .bind(&self.invest_proforma_tsh)
        .bind(&self.invest_proforma_ecg)
        .bind(&self.invest_proforma_chest_xray)
        .bind(&self.invest_proforma_pft)
        .bind(&self.invest_proforma_abg)
        .bind(&self.invest_proforma_two_d_echo)
        .bind(self.invest_proforma_lvef_percent)
        .bind(&self.invest_proforma_tmt)
        .bind(&self.invest_proforma_ct_scan)
        .bind(&self.invest_proforma_mri)
        .bind(self.risk_factors_cardiac)
        .bind(self.risk_factors_respiratory)
        .bind(self.risk_factors_diabetes)
        .bind(self.risk_factors_insulin)
        .bind(self.risk_factors_bmi_over40)
        .bind(self.risk_factors_anticoagulants)
        .bind(self.risk_factors_allergies)
        .bind(self.risk_factors_antiplatelets)
        .bind(self.risk_factors_egfr_under30)
        .bind(self.risk_factors_egfr30_to60)
        .bind(self.risk_factors_age_over70)
        .bind(self.risk_factors_pvd)
        .bind(self.risk_factors_liver_disease)
        .bind(self.risk_factors_vte_risk)
        .bind(self.risk_factors_complex_needs)
        .bind(self.risk_factors_anaemia)
        .bind(self.risk_factors_neuromuscular_disorders)
        .bind(self.risk_factors_others)
        .bind(&self.risk_factors_others_details)
        .bind(&self.anaes_plan_proforma_anaesthetic_concerns)
        .bind(self.anaes_plan_proforma_plan_tiva)
        .bind(self.anaes_plan_proforma_plan_ra)
        .bind(self.anaes_plan_proforma_plan_other)
        .bind(&self.anaes_plan_proforma_plan_other_details)
        .bind(&self.anaes_plan_proforma_list_for_ot_defer_not_fit)
        .bind(&self.anaes_plan_proforma_nil_orally_after)
        .bind(self.anaes_plan_proforma_informed_written_consent)
        .bind(self.anaes_plan_proforma_risks_benefits_alternatives_discussed)
        .bind(&self.anaes_plan_proforma_arrange_units_of_blood)
        .bind(self.anaes_plan_proforma_arrange_post_op_icu)
        .bind(self.anaes_plan_proforma_backup)
        .bind(&self.anaes_plan_proforma_do_investigations)
        .bind(&self.anaes_plan_proforma_do_special_orders)
        .bind(self.anaes_plan_proforma_reviewed_high_risk_anaesthesia)
        .bind(self.anaes_plan_proforma_reviewed_consent)
        .bind(&self.anaes_plan_proforma_consultant_anaesthesiologist_name)
        .bind(&self.anaes_plan_proforma_consultant_anaesthesiologist_signature)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pre_anaesthesia_assessments SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, site_name = $6, assessment_date = $7, \
            assessment_time = $8, planned_procedure = $9, surgical_specialty = $10, urgency = \
            $11, laterality = $12, surgical_severity = $13, anticipated_blood_loss_ml = $14, \
            anticipated_duration_minutes = $15, consultant_surgeon = $16, planned_date = $17, \
            systolic_bp = $18, diastolic_bp = $19, heart_rate = $20, respiratory_rate = $21, \
            spo2_percent = $22, temperature_celsius = $23, capillary_refill_seconds = $24, \
            pain_score_0_10 = $25, on_room_air = $26, supplemental_oxygen_litres = $27, \
            mallampati_class = $28, thyromental_distance_cm = $29, mouth_opening_cm = $30, \
            inter_incisor_gap_cm = $31, neck_rom = $32, cervical_spine_stability = $33, \
            dentition = $34, beard = $35, upper_lip_bite_test = $36, \
            prior_difficult_intubation = $37, stopbang_snoring = $38, stopbang_tired = $39, \
            stopbang_observed_apnoea = $40, stopbang_pressure = $41, stopbang_bmi_gt35 = $42, \
            stopbang_age_gt50 = $43, stopbang_neck_gt40 = $44, stopbang_male = $45, \
            airway_notes = $46, heart_rhythm = $47, murmur_present = $48, murmur_description \
            = $49, peripheral_pulses = $50, jvp_raised = $51, peripheral_oedema = $52, \
            ecg_performed = $53, ecg_rhythm = $54, ecg_rate_bpm = $55, ecg_axis = $56, \
            ecg_ischaemic_changes = $57, ecg_notes = $58, echo_performed = $59, \
            echo_ef_percent = $60, echo_notes = $61, history_ihd = $62, history_chf = $63, \
            history_stroke_tia = $64, recent_mi_within_3_months = $65, pacemaker_or_icd = \
            $66, severe_valve_dysfunction = $67, active_angina = $68, breath_sounds = $69, \
            wheeze = $70, crackles = $71, crepitations = $72, chest_wall_deformity = $73, \
            asthma = $74, copd = $75, cxr_performed = $76, cxr_findings = $77, pft_performed \
            = $78, pft_fev1_percent_predicted = $79, pft_fev1_fvc_ratio = $80, smoking_status \
            = $81, pack_years = $82, covid_history = $83, days_since_covid = $84, \
            covid_unresolved_symptoms = $85, gcs_total = $86, gcs_eye = $87, gcs_verbal = \
            $88, gcs_motor = $89, cognition_tool = $90, cognition_score = $91, \
            cognitive_impairment = $92, capacity_concern = $93, cranial_nerves_notes = $94, \
            motor_power = $95, sensory_notes = $96, reflexes = $97, recent_stroke_tia = $98, \
            days_since_stroke_tia = $99, seizure_disorder = $100, creatinine_umol_l = $101, \
            egfr_ml_min_1_73m2 = $102, urea_mmol_l = $103, potassium_mmol_l = $104, \
            sodium_mmol_l = $105, dialysis_status = $106, ckd_stage = $107, bilirubin_umol_l \
            = $108, alt_u_l = $109, ast_u_l = $110, alp_u_l = $111, albumin_g_l = $112, \
            chronic_liver_disease = $113, child_pugh_class = $114, hb_g_l = $115, wcc_10_9_l \
            = $116, platelets_10_9_l = $117, mcv_fl = $118, ferritin_ug_l = $119, \
            transferrin_saturation_percent = $120, inr = $121, aptt_seconds = $122, \
            fibrinogen_g_l = $123, on_anticoagulant = $124, anticoagulant_type = $125, \
            anticoagulant_hold_plan = $126, group_and_save = $127, crossmatch_units = $128, \
            last_transfusion_date = $129, anaemia_severity = $130, diabetes_type = $131, \
            diabetes_on_insulin = $132, hba1c_mmol_mol = $133, fasting_glucose_mmol_l = $134, \
            random_glucose_mmol_l = $135, diabetes_control = $136, diabetes_complications = \
            $137, thyroid_status = $138, tsh_mu_l = $139, adrenal_status = $140, \
            on_long_term_steroids = $141, steroid_dose_mg = $142, steroid_cover_plan = $143, \
            abdominal_exam = $144, abdominal_notes = $145, reflux_symptoms = $146, \
            hiatus_hernia = $147, previous_gastric_surgery = $148, ng_tube = $149, stoma = \
            $150, fasting_confirmed = $151, last_solid_food_at = $152, last_clear_fluid_at = \
            $153, rapid_sequence_induction_needed = $154, spine_exam = $155, spine_notes = \
            $156, neuraxial_suitable = $157, joint_rom_hip = $158, joint_rom_shoulder = $159, \
            joint_rom_neck = $160, skin_iv_access = $161, skin_block_site = $162, \
            pressure_ulcer_risk = $163, name = $164, dose = $165, route = $166, frequency = \
            $167, indication = $168, class = $169, perioperative_action = $170, \
            perioperative_notes = $171, last_dose_at = $172, allergen = $173, category = \
            $174, reaction_type = $175, reaction_severity = $176, reaction_notes = $177, \
            verified = $178, mets_estimate = $179, dasi_score = $180, ecog_performance_status \
            = $181, clinical_frailty_scale = $182, six_minute_walk_metres = $183, \
            sts_one_minute_reps = $184, tug_seconds = $185, cpet_performed = $186, \
            cpet_vo2_peak_ml_kg_min = $187, cpet_anaerobic_threshold_ml_kg_min = $188, \
            cpet_notes = $189, malnutrition_risk = $190, unintentional_weight_loss_kg = $191, \
            technique = $192, airway_plan = $193, rsi_planned = $194, monitoring_level = \
            $195, analgesia_plan = $196, regional_block_planned = $197, dvt_prophylaxis = \
            $198, antibiotic_prophylaxis = $199, post_op_disposition = $200, \
            anticipated_length_of_stay_days = $201, special_equipment = $202, \
            blood_products_required = $203, proforma_header_department = $204, \
            proforma_header_registration_date = $205, proforma_header_pre_op_diagnosis = \
            $206, prev_anaes_anaesthetic_difficulty = $207, prev_anaes_abnormal_reaction = \
            $208, prev_anaes_ponv = $209, prev_anaes_malignant_hyperpyrexia = $210, \
            prev_anaes_difficult_intubation = $211, prev_anaes_difficult_spinal_or_epidural = \
            $212, addiction_alcohol = $213, addiction_smoking = $214, \
            addiction_fast_score3_or_more = $215, addiction_betel = $216, addiction_drugs = \
            $217, addiction_other = $218, addiction_other_details = $219, \
            pmh_proforma_hypertension = $220, pmh_proforma_mi = $221, \
            pmh_proforma_mi_within_past6_months = $222, pmh_proforma_angina_or_chest_pain = \
            $223, pmh_proforma_angina_triggers = $224, pmh_proforma_heart_failure = $225, \
            pmh_proforma_dyspnoea = $226, pmh_proforma_dyspnoea_subtypes = $227, \
            pmh_proforma_palpitation = $228, pmh_proforma_arrhythmia = $229, \
            pmh_proforma_syncope_or_fainting = $230, pmh_proforma_heart_murmur = $231, \
            pmh_proforma_rheumatic_fever = $232, pmh_proforma_pacemaker = $233, \
            pmh_proforma_pacemaker_last_check_within6_months = $234, \
            pmh_proforma_implanted_icd_crtd = $235, pmh_proforma_angioplasty = $236, \
            pmh_proforma_stenting = $237, pmh_proforma_stenting_within_past6_months = $238, \
            pmh_proforma_stent_type = $239, pmh_proforma_valve_disease = $240, \
            pmh_proforma_cardiac_surgery = $241, \
            pmh_proforma_cardiac_surgery_within_past_year = $242, \
            pmh_proforma_peripheral_vascular_disease = $243, \
            pmh_proforma_ischemic_heart_disease = $244, pmh_proforma_asthma = $245, \
            pmh_proforma_copd = $246, pmh_proforma_tb = $247, pmh_proforma_bronchiectasis = \
            $248, pmh_proforma_previous_hospital_admission = $249, pmh_proforma_icu_admission \
            = $250, pmh_proforma_on_home_oxygen_or_nebulizers = $251, \
            pmh_proforma_uses_inhaler_daily_or_more = $252, pmh_proforma_flu_cough_sputum = \
            $253, pmh_proforma_haemoptysis = $254, pmh_proforma_sleep_apnoea = $255, \
            pmh_proforma_sleep_apnoea_using_cpap = $256, pmh_proforma_stop_bang_risk = $257, \
            pmh_proforma_other_respiratory_disease = $258, pmh_proforma_diabetes_mellitus = \
            $259, pmh_proforma_diabetes_diet_controlled = $260, \
            pmh_proforma_diabetes_drug_controlled = $261, \
            pmh_proforma_diabetes_insulin_controlled = $262, \
            pmh_proforma_diabetes_hba1c_over69 = $263, pmh_proforma_hypothyroid = $264, \
            pmh_proforma_hyperthyroid = $265, pmh_proforma_stroke_or_tia = $266, \
            pmh_proforma_stroke_within3_months = $267, \
            pmh_proforma_stroke_residual_disability = $268, pmh_proforma_epilepsy_or_seizures \
            = $269, pmh_proforma_epilepsy_control = $270, pmh_proforma_ms = $271, \
            pmh_proforma_muscular_dystrophy = $272, pmh_proforma_other_neurological_disease = \
            $273, pmh_proforma_other_neurological_disease_details = $274, \
            pmh_proforma_dementia = $275, pmh_proforma_creutzfeldt_jakob_disease = $276, \
            pmh_proforma_growth_hormone_or_gonadotrophin = $277, \
            pmh_proforma_brain_or_spinal_cord_surgery = $278, pmh_proforma_four_at_score = \
            $279, pmh_proforma_complex_needs = $280, pmh_proforma_renal_impairment = $281, \
            pmh_proforma_ckd_stage3 = $282, pmh_proforma_ckd_stage4_or_hemodialysis = $283, \
            pmh_proforma_liver_disease = $284, pmh_proforma_clotting_disorders_haemophilia = \
            $285, pmh_proforma_easy_bruising_prolonged_bleeding = $286, \
            pmh_proforma_dvt_or_pe = $287, pmh_proforma_dvt_or_pe_within_past3_months = $288, \
            pmh_proforma_gord = $289, pmh_proforma_any_other_disease = $290, \
            pmh_proforma_chronic_pain = $291, pmh_proforma_duke_activity_status_index = $292, \
            pmh_proforma_mets_score = $293, pmh_proforma_ongoing_medications = $294, \
            pmh_proforma_cortisone_prednisone_steroid = $295, \
            pmh_proforma_blood_transfusion_history = $296, pmh_proforma_chemotherapy_drugs = \
            $297, pmh_proforma_radiotherapy = $298, airway_exam_proforma_mouth_opening = \
            $299, airway_exam_proforma_loose_teeth = $300, \
            airway_exam_proforma_denture_missing = $301, airway_exam_proforma_mp_grade = \
            $302, airway_exam_proforma_micrognathia = $303, \
            airway_exam_proforma_tm_distance_over65 = $304, airway_exam_proforma_mo_distance \
            = $305, airway_exam_proforma_tm_joint = $306, airway_exam_proforma_short_neck_rom \
            = $307, airway_exam_proforma_difficult_airway = $308, \
            airway_exam_proforma_obesity_scoring = $309, airway_exam_proforma_spine_back = \
            $310, airway_exam_proforma_scoliosis = $311, \
            airway_exam_proforma_vitals_examination = $312, vitals_proforma_height_cm = $313, \
            vitals_proforma_weight_kg = $314, vitals_proforma_hr = $315, vitals_proforma_bp = \
            $316, vitals_proforma_resp_rate = $317, vitals_proforma_spo2 = $318, \
            vitals_proforma_temp = $319, vitals_proforma_bmi = $320, gen_exam_proforma_pallor \
            = $321, gen_exam_proforma_icterus = $322, gen_exam_proforma_cyanosis = $323, \
            gen_exam_proforma_clubbing = $324, gen_exam_proforma_koilonychia = $325, \
            gen_exam_proforma_lymphadenopathy = $326, gen_exam_proforma_edema = $327, \
            gen_exam_proforma_jvp = $328, invest_proforma_blood_group_haemoglobin = $329, \
            invest_proforma_differential_n = $330, invest_proforma_differential_l = $331, \
            invest_proforma_differential_e = $332, invest_proforma_differential_m = $333, \
            invest_proforma_differential_b = $334, invest_proforma_absolute = $335, \
            invest_proforma_nc = $336, invest_proforma_tlc = $337, invest_proforma_tpc = \
            $338, invest_proforma_esr = $339, invest_proforma_crp = $340, invest_proforma_pcv \
            = $341, invest_proforma_latex_rast = $342, invest_proforma_fbs = $343, \
            invest_proforma_ppbs = $344, invest_proforma_hba1c = $345, invest_proforma_na = \
            $346, invest_proforma_k = $347, invest_proforma_urea = $348, \
            invest_proforma_creatinine = $349, invest_proforma_bilirubin_total = $350, \
            invest_proforma_bilirubin_direct = $351, invest_proforma_alk_phosphatase = $352, \
            invest_proforma_sgpt_alt = $353, invest_proforma_sgot_ast = $354, \
            invest_proforma_bt = $355, invest_proforma_ct = $356, invest_proforma_pt = $357, \
            invest_proforma_aptt = $358, invest_proforma_inr = $359, invest_proforma_ft3 = \
            $360, invest_proforma_ft4 = $361, invest_proforma_tsh = $362, invest_proforma_ecg \
            = $363, invest_proforma_chest_xray = $364, invest_proforma_pft = $365, \
            invest_proforma_abg = $366, invest_proforma_two_d_echo = $367, \
            invest_proforma_lvef_percent = $368, invest_proforma_tmt = $369, \
            invest_proforma_ct_scan = $370, invest_proforma_mri = $371, risk_factors_cardiac \
            = $372, risk_factors_respiratory = $373, risk_factors_diabetes = $374, \
            risk_factors_insulin = $375, risk_factors_bmi_over40 = $376, \
            risk_factors_anticoagulants = $377, risk_factors_allergies = $378, \
            risk_factors_antiplatelets = $379, risk_factors_egfr_under30 = $380, \
            risk_factors_egfr30_to60 = $381, risk_factors_age_over70 = $382, risk_factors_pvd \
            = $383, risk_factors_liver_disease = $384, risk_factors_vte_risk = $385, \
            risk_factors_complex_needs = $386, risk_factors_anaemia = $387, \
            risk_factors_neuromuscular_disorders = $388, risk_factors_others = $389, \
            risk_factors_others_details = $390, anaes_plan_proforma_anaesthetic_concerns = \
            $391, anaes_plan_proforma_plan_tiva = $392, anaes_plan_proforma_plan_ra = $393, \
            anaes_plan_proforma_plan_other = $394, anaes_plan_proforma_plan_other_details = \
            $395, anaes_plan_proforma_list_for_ot_defer_not_fit = $396, \
            anaes_plan_proforma_nil_orally_after = $397, \
            anaes_plan_proforma_informed_written_consent = $398, \
            anaes_plan_proforma_risks_benefits_alternatives_discussed = $399, \
            anaes_plan_proforma_arrange_units_of_blood = $400, \
            anaes_plan_proforma_arrange_post_op_icu = $401, anaes_plan_proforma_backup = \
            $402, anaes_plan_proforma_do_investigations = $403, \
            anaes_plan_proforma_do_special_orders = $404, \
            anaes_plan_proforma_reviewed_high_risk_anaesthesia = $405, \
            anaes_plan_proforma_reviewed_consent = $406, \
            anaes_plan_proforma_consultant_anaesthesiologist_name = $407, \
            anaes_plan_proforma_consultant_anaesthesiologist_signature = $408, updated_at = \
            now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.planned_procedure)
        .bind(&self.surgical_specialty)
        .bind(&self.urgency)
        .bind(&self.laterality)
        .bind(&self.surgical_severity)
        .bind(self.anticipated_blood_loss_ml)
        .bind(self.anticipated_duration_minutes)
        .bind(&self.consultant_surgeon)
        .bind(self.planned_date)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.heart_rate)
        .bind(self.respiratory_rate)
        .bind(self.spo2_percent)
        .bind(self.temperature_celsius)
        .bind(self.capillary_refill_seconds)
        .bind(self.pain_score_0_10)
        .bind(&self.on_room_air)
        .bind(self.supplemental_oxygen_litres)
        .bind(&self.mallampati_class)
        .bind(self.thyromental_distance_cm)
        .bind(self.mouth_opening_cm)
        .bind(self.inter_incisor_gap_cm)
        .bind(&self.neck_rom)
        .bind(&self.cervical_spine_stability)
        .bind(&self.dentition)
        .bind(&self.beard)
        .bind(&self.upper_lip_bite_test)
        .bind(&self.prior_difficult_intubation)
        .bind(&self.stopbang_snoring)
        .bind(&self.stopbang_tired)
        .bind(&self.stopbang_observed_apnoea)
        .bind(&self.stopbang_pressure)
        .bind(&self.stopbang_bmi_gt35)
        .bind(&self.stopbang_age_gt50)
        .bind(&self.stopbang_neck_gt40)
        .bind(&self.stopbang_male)
        .bind(&self.airway_notes)
        .bind(&self.heart_rhythm)
        .bind(&self.murmur_present)
        .bind(&self.murmur_description)
        .bind(&self.peripheral_pulses)
        .bind(&self.jvp_raised)
        .bind(&self.peripheral_oedema)
        .bind(&self.ecg_performed)
        .bind(&self.ecg_rhythm)
        .bind(self.ecg_rate_bpm)
        .bind(&self.ecg_axis)
        .bind(&self.ecg_ischaemic_changes)
        .bind(&self.ecg_notes)
        .bind(&self.echo_performed)
        .bind(self.echo_ef_percent)
        .bind(&self.echo_notes)
        .bind(&self.history_ihd)
        .bind(&self.history_chf)
        .bind(&self.history_stroke_tia)
        .bind(&self.recent_mi_within_3_months)
        .bind(&self.pacemaker_or_icd)
        .bind(&self.severe_valve_dysfunction)
        .bind(&self.active_angina)
        .bind(&self.breath_sounds)
        .bind(&self.wheeze)
        .bind(&self.crackles)
        .bind(&self.crepitations)
        .bind(&self.chest_wall_deformity)
        .bind(&self.asthma)
        .bind(&self.copd)
        .bind(&self.cxr_performed)
        .bind(&self.cxr_findings)
        .bind(&self.pft_performed)
        .bind(self.pft_fev1_percent_predicted)
        .bind(self.pft_fev1_fvc_ratio)
        .bind(&self.smoking_status)
        .bind(self.pack_years)
        .bind(&self.covid_history)
        .bind(self.days_since_covid)
        .bind(&self.covid_unresolved_symptoms)
        .bind(self.gcs_total)
        .bind(self.gcs_eye)
        .bind(self.gcs_verbal)
        .bind(self.gcs_motor)
        .bind(&self.cognition_tool)
        .bind(self.cognition_score)
        .bind(&self.cognitive_impairment)
        .bind(&self.capacity_concern)
        .bind(&self.cranial_nerves_notes)
        .bind(&self.motor_power)
        .bind(&self.sensory_notes)
        .bind(&self.reflexes)
        .bind(&self.recent_stroke_tia)
        .bind(self.days_since_stroke_tia)
        .bind(&self.seizure_disorder)
        .bind(self.creatinine_umol_l)
        .bind(self.egfr_ml_min_1_73m2)
        .bind(self.urea_mmol_l)
        .bind(self.potassium_mmol_l)
        .bind(self.sodium_mmol_l)
        .bind(&self.dialysis_status)
        .bind(&self.ckd_stage)
        .bind(self.bilirubin_umol_l)
        .bind(self.alt_u_l)
        .bind(self.ast_u_l)
        .bind(self.alp_u_l)
        .bind(self.albumin_g_l)
        .bind(&self.chronic_liver_disease)
        .bind(&self.child_pugh_class)
        .bind(self.hb_g_l)
        .bind(self.wcc_10_9_l)
        .bind(self.platelets_10_9_l)
        .bind(self.mcv_fl)
        .bind(self.ferritin_ug_l)
        .bind(self.transferrin_saturation_percent)
        .bind(self.inr)
        .bind(self.aptt_seconds)
        .bind(self.fibrinogen_g_l)
        .bind(&self.on_anticoagulant)
        .bind(&self.anticoagulant_type)
        .bind(&self.anticoagulant_hold_plan)
        .bind(&self.group_and_save)
        .bind(self.crossmatch_units)
        .bind(self.last_transfusion_date)
        .bind(&self.anaemia_severity)
        .bind(&self.diabetes_type)
        .bind(&self.diabetes_on_insulin)
        .bind(self.hba1c_mmol_mol)
        .bind(self.fasting_glucose_mmol_l)
        .bind(self.random_glucose_mmol_l)
        .bind(&self.diabetes_control)
        .bind(&self.diabetes_complications)
        .bind(&self.thyroid_status)
        .bind(self.tsh_mu_l)
        .bind(&self.adrenal_status)
        .bind(&self.on_long_term_steroids)
        .bind(self.steroid_dose_mg)
        .bind(&self.steroid_cover_plan)
        .bind(&self.abdominal_exam)
        .bind(&self.abdominal_notes)
        .bind(&self.reflux_symptoms)
        .bind(&self.hiatus_hernia)
        .bind(&self.previous_gastric_surgery)
        .bind(&self.ng_tube)
        .bind(&self.stoma)
        .bind(&self.fasting_confirmed)
        .bind(self.last_solid_food_at)
        .bind(self.last_clear_fluid_at)
        .bind(&self.rapid_sequence_induction_needed)
        .bind(&self.spine_exam)
        .bind(&self.spine_notes)
        .bind(&self.neuraxial_suitable)
        .bind(&self.joint_rom_hip)
        .bind(&self.joint_rom_shoulder)
        .bind(&self.joint_rom_neck)
        .bind(&self.skin_iv_access)
        .bind(&self.skin_block_site)
        .bind(&self.pressure_ulcer_risk)
        .bind(&self.name)
        .bind(&self.dose)
        .bind(&self.route)
        .bind(&self.frequency)
        .bind(&self.indication)
        .bind(&self.class)
        .bind(&self.perioperative_action)
        .bind(&self.perioperative_notes)
        .bind(self.last_dose_at)
        .bind(&self.allergen)
        .bind(&self.category)
        .bind(&self.reaction_type)
        .bind(&self.reaction_severity)
        .bind(&self.reaction_notes)
        .bind(&self.verified)
        .bind(self.mets_estimate)
        .bind(self.dasi_score)
        .bind(self.ecog_performance_status)
        .bind(self.clinical_frailty_scale)
        .bind(self.six_minute_walk_metres)
        .bind(self.sts_one_minute_reps)
        .bind(self.tug_seconds)
        .bind(&self.cpet_performed)
        .bind(self.cpet_vo2_peak_ml_kg_min)
        .bind(self.cpet_anaerobic_threshold_ml_kg_min)
        .bind(&self.cpet_notes)
        .bind(&self.malnutrition_risk)
        .bind(self.unintentional_weight_loss_kg)
        .bind(&self.technique)
        .bind(&self.airway_plan)
        .bind(&self.rsi_planned)
        .bind(&self.monitoring_level)
        .bind(&self.analgesia_plan)
        .bind(&self.regional_block_planned)
        .bind(&self.dvt_prophylaxis)
        .bind(&self.antibiotic_prophylaxis)
        .bind(&self.post_op_disposition)
        .bind(self.anticipated_length_of_stay_days)
        .bind(&self.special_equipment)
        .bind(&self.blood_products_required)
        .bind(&self.proforma_header_department)
        .bind(&self.proforma_header_registration_date)
        .bind(&self.proforma_header_pre_op_diagnosis)
        .bind(self.prev_anaes_anaesthetic_difficulty)
        .bind(self.prev_anaes_abnormal_reaction)
        .bind(self.prev_anaes_ponv)
        .bind(self.prev_anaes_malignant_hyperpyrexia)
        .bind(self.prev_anaes_difficult_intubation)
        .bind(self.prev_anaes_difficult_spinal_or_epidural)
        .bind(self.addiction_alcohol)
        .bind(self.addiction_smoking)
        .bind(self.addiction_fast_score3_or_more)
        .bind(self.addiction_betel)
        .bind(self.addiction_drugs)
        .bind(self.addiction_other)
        .bind(&self.addiction_other_details)
        .bind(self.pmh_proforma_hypertension)
        .bind(self.pmh_proforma_mi)
        .bind(self.pmh_proforma_mi_within_past6_months)
        .bind(self.pmh_proforma_angina_or_chest_pain)
        .bind(&self.pmh_proforma_angina_triggers)
        .bind(self.pmh_proforma_heart_failure)
        .bind(self.pmh_proforma_dyspnoea)
        .bind(&self.pmh_proforma_dyspnoea_subtypes)
        .bind(self.pmh_proforma_palpitation)
        .bind(self.pmh_proforma_arrhythmia)
        .bind(self.pmh_proforma_syncope_or_fainting)
        .bind(self.pmh_proforma_heart_murmur)
        .bind(self.pmh_proforma_rheumatic_fever)
        .bind(self.pmh_proforma_pacemaker)
        .bind(self.pmh_proforma_pacemaker_last_check_within6_months)
        .bind(self.pmh_proforma_implanted_icd_crtd)
        .bind(self.pmh_proforma_angioplasty)
        .bind(self.pmh_proforma_stenting)
        .bind(self.pmh_proforma_stenting_within_past6_months)
        .bind(&self.pmh_proforma_stent_type)
        .bind(self.pmh_proforma_valve_disease)
        .bind(self.pmh_proforma_cardiac_surgery)
        .bind(self.pmh_proforma_cardiac_surgery_within_past_year)
        .bind(self.pmh_proforma_peripheral_vascular_disease)
        .bind(self.pmh_proforma_ischemic_heart_disease)
        .bind(self.pmh_proforma_asthma)
        .bind(self.pmh_proforma_copd)
        .bind(self.pmh_proforma_tb)
        .bind(self.pmh_proforma_bronchiectasis)
        .bind(self.pmh_proforma_previous_hospital_admission)
        .bind(self.pmh_proforma_icu_admission)
        .bind(self.pmh_proforma_on_home_oxygen_or_nebulizers)
        .bind(self.pmh_proforma_uses_inhaler_daily_or_more)
        .bind(self.pmh_proforma_flu_cough_sputum)
        .bind(self.pmh_proforma_haemoptysis)
        .bind(self.pmh_proforma_sleep_apnoea)
        .bind(self.pmh_proforma_sleep_apnoea_using_cpap)
        .bind(&self.pmh_proforma_stop_bang_risk)
        .bind(self.pmh_proforma_other_respiratory_disease)
        .bind(self.pmh_proforma_diabetes_mellitus)
        .bind(self.pmh_proforma_diabetes_diet_controlled)
        .bind(self.pmh_proforma_diabetes_drug_controlled)
        .bind(self.pmh_proforma_diabetes_insulin_controlled)
        .bind(self.pmh_proforma_diabetes_hba1c_over69)
        .bind(self.pmh_proforma_hypothyroid)
        .bind(self.pmh_proforma_hyperthyroid)
        .bind(self.pmh_proforma_stroke_or_tia)
        .bind(self.pmh_proforma_stroke_within3_months)
        .bind(&self.pmh_proforma_stroke_residual_disability)
        .bind(self.pmh_proforma_epilepsy_or_seizures)
        .bind(&self.pmh_proforma_epilepsy_control)
        .bind(self.pmh_proforma_ms)
        .bind(self.pmh_proforma_muscular_dystrophy)
        .bind(self.pmh_proforma_other_neurological_disease)
        .bind(&self.pmh_proforma_other_neurological_disease_details)
        .bind(self.pmh_proforma_dementia)
        .bind(self.pmh_proforma_creutzfeldt_jakob_disease)
        .bind(self.pmh_proforma_growth_hormone_or_gonadotrophin)
        .bind(self.pmh_proforma_brain_or_spinal_cord_surgery)
        .bind(self.pmh_proforma_four_at_score)
        .bind(self.pmh_proforma_complex_needs)
        .bind(self.pmh_proforma_renal_impairment)
        .bind(self.pmh_proforma_ckd_stage3)
        .bind(self.pmh_proforma_ckd_stage4_or_hemodialysis)
        .bind(self.pmh_proforma_liver_disease)
        .bind(self.pmh_proforma_clotting_disorders_haemophilia)
        .bind(self.pmh_proforma_easy_bruising_prolonged_bleeding)
        .bind(self.pmh_proforma_dvt_or_pe)
        .bind(self.pmh_proforma_dvt_or_pe_within_past3_months)
        .bind(self.pmh_proforma_gord)
        .bind(self.pmh_proforma_any_other_disease)
        .bind(self.pmh_proforma_chronic_pain)
        .bind(self.pmh_proforma_duke_activity_status_index)
        .bind(self.pmh_proforma_mets_score)
        .bind(&self.pmh_proforma_ongoing_medications)
        .bind(self.pmh_proforma_cortisone_prednisone_steroid)
        .bind(self.pmh_proforma_blood_transfusion_history)
        .bind(self.pmh_proforma_chemotherapy_drugs)
        .bind(self.pmh_proforma_radiotherapy)
        .bind(self.airway_exam_proforma_mouth_opening)
        .bind(self.airway_exam_proforma_loose_teeth)
        .bind(self.airway_exam_proforma_denture_missing)
        .bind(&self.airway_exam_proforma_mp_grade)
        .bind(self.airway_exam_proforma_micrognathia)
        .bind(self.airway_exam_proforma_tm_distance_over65)
        .bind(self.airway_exam_proforma_mo_distance)
        .bind(self.airway_exam_proforma_tm_joint)
        .bind(self.airway_exam_proforma_short_neck_rom)
        .bind(self.airway_exam_proforma_difficult_airway)
        .bind(self.airway_exam_proforma_obesity_scoring)
        .bind(self.airway_exam_proforma_spine_back)
        .bind(self.airway_exam_proforma_scoliosis)
        .bind(self.airway_exam_proforma_vitals_examination)
        .bind(self.vitals_proforma_height_cm)
        .bind(self.vitals_proforma_weight_kg)
        .bind(self.vitals_proforma_hr)
        .bind(&self.vitals_proforma_bp)
        .bind(self.vitals_proforma_resp_rate)
        .bind(self.vitals_proforma_spo2)
        .bind(self.vitals_proforma_temp)
        .bind(self.vitals_proforma_bmi)
        .bind(self.gen_exam_proforma_pallor)
        .bind(self.gen_exam_proforma_icterus)
        .bind(self.gen_exam_proforma_cyanosis)
        .bind(self.gen_exam_proforma_clubbing)
        .bind(self.gen_exam_proforma_koilonychia)
        .bind(self.gen_exam_proforma_lymphadenopathy)
        .bind(self.gen_exam_proforma_edema)
        .bind(self.gen_exam_proforma_jvp)
        .bind(&self.invest_proforma_blood_group_haemoglobin)
        .bind(&self.invest_proforma_differential_n)
        .bind(&self.invest_proforma_differential_l)
        .bind(&self.invest_proforma_differential_e)
        .bind(&self.invest_proforma_differential_m)
        .bind(&self.invest_proforma_differential_b)
        .bind(&self.invest_proforma_absolute)
        .bind(&self.invest_proforma_nc)
        .bind(&self.invest_proforma_tlc)
        .bind(&self.invest_proforma_tpc)
        .bind(&self.invest_proforma_esr)
        .bind(&self.invest_proforma_crp)
        .bind(&self.invest_proforma_pcv)
        .bind(&self.invest_proforma_latex_rast)
        .bind(&self.invest_proforma_fbs)
        .bind(&self.invest_proforma_ppbs)
        .bind(&self.invest_proforma_hba1c)
        .bind(&self.invest_proforma_na)
        .bind(&self.invest_proforma_k)
        .bind(&self.invest_proforma_urea)
        .bind(&self.invest_proforma_creatinine)
        .bind(&self.invest_proforma_bilirubin_total)
        .bind(&self.invest_proforma_bilirubin_direct)
        .bind(&self.invest_proforma_alk_phosphatase)
        .bind(&self.invest_proforma_sgpt_alt)
        .bind(&self.invest_proforma_sgot_ast)
        .bind(&self.invest_proforma_bt)
        .bind(&self.invest_proforma_ct)
        .bind(&self.invest_proforma_pt)
        .bind(&self.invest_proforma_aptt)
        .bind(&self.invest_proforma_inr)
        .bind(&self.invest_proforma_ft3)
        .bind(&self.invest_proforma_ft4)
        .bind(&self.invest_proforma_tsh)
        .bind(&self.invest_proforma_ecg)
        .bind(&self.invest_proforma_chest_xray)
        .bind(&self.invest_proforma_pft)
        .bind(&self.invest_proforma_abg)
        .bind(&self.invest_proforma_two_d_echo)
        .bind(self.invest_proforma_lvef_percent)
        .bind(&self.invest_proforma_tmt)
        .bind(&self.invest_proforma_ct_scan)
        .bind(&self.invest_proforma_mri)
        .bind(self.risk_factors_cardiac)
        .bind(self.risk_factors_respiratory)
        .bind(self.risk_factors_diabetes)
        .bind(self.risk_factors_insulin)
        .bind(self.risk_factors_bmi_over40)
        .bind(self.risk_factors_anticoagulants)
        .bind(self.risk_factors_allergies)
        .bind(self.risk_factors_antiplatelets)
        .bind(self.risk_factors_egfr_under30)
        .bind(self.risk_factors_egfr30_to60)
        .bind(self.risk_factors_age_over70)
        .bind(self.risk_factors_pvd)
        .bind(self.risk_factors_liver_disease)
        .bind(self.risk_factors_vte_risk)
        .bind(self.risk_factors_complex_needs)
        .bind(self.risk_factors_anaemia)
        .bind(self.risk_factors_neuromuscular_disorders)
        .bind(self.risk_factors_others)
        .bind(&self.risk_factors_others_details)
        .bind(&self.anaes_plan_proforma_anaesthetic_concerns)
        .bind(self.anaes_plan_proforma_plan_tiva)
        .bind(self.anaes_plan_proforma_plan_ra)
        .bind(self.anaes_plan_proforma_plan_other)
        .bind(&self.anaes_plan_proforma_plan_other_details)
        .bind(&self.anaes_plan_proforma_list_for_ot_defer_not_fit)
        .bind(&self.anaes_plan_proforma_nil_orally_after)
        .bind(self.anaes_plan_proforma_informed_written_consent)
        .bind(self.anaes_plan_proforma_risks_benefits_alternatives_discussed)
        .bind(&self.anaes_plan_proforma_arrange_units_of_blood)
        .bind(self.anaes_plan_proforma_arrange_post_op_icu)
        .bind(self.anaes_plan_proforma_backup)
        .bind(&self.anaes_plan_proforma_do_investigations)
        .bind(&self.anaes_plan_proforma_do_special_orders)
        .bind(self.anaes_plan_proforma_reviewed_high_risk_anaesthesia)
        .bind(self.anaes_plan_proforma_reviewed_consent)
        .bind(&self.anaes_plan_proforma_consultant_anaesthesiologist_name)
        .bind(&self.anaes_plan_proforma_consultant_anaesthesiologist_signature)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/pre_anaesthesia_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
