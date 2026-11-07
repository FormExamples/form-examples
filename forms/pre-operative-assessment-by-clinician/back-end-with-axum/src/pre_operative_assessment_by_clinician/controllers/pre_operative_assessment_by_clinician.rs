#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pre_operative_assessment_by_clinicians::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
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
    pub on_glp1_receptor_agonist: String,
    pub glp1_agonist_name: String,
    pub glp1_formulation: String,
    pub glp1_last_dose_at: Option<DateTimeWithTimeZone>,
    pub glp1_held_per_guideline: String,
    pub glp1_extended_clear_fluids_confirmed: String,
    pub glp1_gi_symptoms: String,
    pub glp1_gi_symptoms_details: String,
    pub glp1_gastric_ultrasound_performed: String,
    pub glp1_gastric_ultrasound_findings: String,
    pub glp1_full_stomach_precautions_planned: String,
    pub glp1_notes: String,
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
    pub fried_weakness: String,
    pub fried_slowness: String,
    pub fried_low_physical_activity: String,
    pub fried_exhaustion: String,
    pub fried_unintentional_weight_loss: String,
    pub risk_analysis_index_score: Option<i32>,
    pub mini_cog_performed: String,
    pub mini_cog_score: Option<i32>,
    pub prehabilitation_indicated: String,
    pub prehabilitation_type: String,
    pub prehabilitation_start_date: Option<Date>,
    pub protein_supplementation_recommended: String,
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
    pub hospital_number: String,
    pub indication_for_surgery: String,
    pub anaesthetist_name: String,
    pub previous_surgeries: String,
    pub previous_anaesthetic_issues: String,
    pub previous_anaesthetic_issues_details: String,
    pub family_history_anaesthetic_complications: String,
    pub family_history_anaesthetic_complications_details: String,
    pub urinalysis_findings: String,
    pub living_situation: String,
    pub support_at_home: String,
    pub mobility_status: String,
    pub falls_risk_within_year: String,
    pub vte_risk_level: String,
    pub covid_screening_result: String,
    pub discharge_destination: String,
    pub follow_up_requirements: String,
    pub social_services_involvement: String,
    pub reablement_physiotherapy_needs: String,
    pub consent_status: String,
    pub interpreter_required: String,
    pub discussion_procedure: String,
    pub discussion_anaesthetic: String,
    pub discussion_risks_benefits: String,
    pub discussion_alternatives: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pre_operative_assessment_by_clinicians (patient_id, \
            clinician_id, status, site_name, assessment_date, assessment_time, \
            planned_procedure, surgical_specialty, urgency, laterality, \
            surgical_severity, anticipated_blood_loss_ml, anticipated_duration_minutes, \
            consultant_surgeon, planned_date, systolic_bp, diastolic_bp, heart_rate, \
            respiratory_rate, spo2_percent, temperature_celsius, \
            capillary_refill_seconds, pain_score_0_10, on_room_air, \
            supplemental_oxygen_litres, mallampati_class, thyromental_distance_cm, \
            mouth_opening_cm, inter_incisor_gap_cm, neck_rom, cervical_spine_stability, \
            dentition, beard, upper_lip_bite_test, prior_difficult_intubation, \
            stopbang_snoring, stopbang_tired, stopbang_observed_apnoea, \
            stopbang_pressure, stopbang_bmi_gt35, stopbang_age_gt50, stopbang_neck_gt40, \
            stopbang_male, airway_notes, heart_rhythm, murmur_present, \
            murmur_description, peripheral_pulses, jvp_raised, peripheral_oedema, \
            ecg_performed, ecg_rhythm, ecg_rate_bpm, ecg_axis, ecg_ischaemic_changes, \
            ecg_notes, echo_performed, echo_ef_percent, echo_notes, history_ihd, \
            history_chf, history_stroke_tia, recent_mi_within_3_months, \
            pacemaker_or_icd, severe_valve_dysfunction, active_angina, breath_sounds, \
            wheeze, crackles, crepitations, chest_wall_deformity, asthma, copd, \
            cxr_performed, cxr_findings, pft_performed, pft_fev1_percent_predicted, \
            pft_fev1_fvc_ratio, smoking_status, pack_years, covid_history, \
            days_since_covid, covid_unresolved_symptoms, gcs_total, gcs_eye, gcs_verbal, \
            gcs_motor, cognition_tool, cognition_score, cognitive_impairment, \
            capacity_concern, cranial_nerves_notes, motor_power, sensory_notes, \
            reflexes, recent_stroke_tia, days_since_stroke_tia, seizure_disorder, \
            creatinine_umol_l, egfr_ml_min_1_73m2, urea_mmol_l, potassium_mmol_l, \
            sodium_mmol_l, dialysis_status, ckd_stage, bilirubin_umol_l, alt_u_l, \
            ast_u_l, alp_u_l, albumin_g_l, chronic_liver_disease, child_pugh_class, \
            hb_g_l, wcc_10_9_l, platelets_10_9_l, mcv_fl, ferritin_ug_l, \
            transferrin_saturation_percent, inr, aptt_seconds, fibrinogen_g_l, \
            on_anticoagulant, anticoagulant_type, anticoagulant_hold_plan, \
            group_and_save, crossmatch_units, last_transfusion_date, anaemia_severity, \
            diabetes_type, diabetes_on_insulin, hba1c_mmol_mol, fasting_glucose_mmol_l, \
            random_glucose_mmol_l, diabetes_control, diabetes_complications, \
            thyroid_status, tsh_mu_l, adrenal_status, on_long_term_steroids, \
            steroid_dose_mg, steroid_cover_plan, abdominal_exam, abdominal_notes, \
            reflux_symptoms, hiatus_hernia, previous_gastric_surgery, ng_tube, stoma, \
            fasting_confirmed, last_solid_food_at, last_clear_fluid_at, \
            rapid_sequence_induction_needed, spine_exam, spine_notes, \
            neuraxial_suitable, joint_rom_hip, joint_rom_shoulder, joint_rom_neck, \
            skin_iv_access, skin_block_site, pressure_ulcer_risk, name, dose, route, \
            frequency, indication, class, perioperative_action, perioperative_notes, \
            last_dose_at, on_glp1_receptor_agonist, glp1_agonist_name, glp1_formulation, \
            glp1_last_dose_at, glp1_held_per_guideline, \
            glp1_extended_clear_fluids_confirmed, glp1_gi_symptoms, \
            glp1_gi_symptoms_details, glp1_gastric_ultrasound_performed, \
            glp1_gastric_ultrasound_findings, glp1_full_stomach_precautions_planned, \
            glp1_notes, allergen, category, reaction_type, reaction_severity, \
            reaction_notes, verified, mets_estimate, dasi_score, \
            ecog_performance_status, clinical_frailty_scale, six_minute_walk_metres, \
            sts_one_minute_reps, tug_seconds, cpet_performed, cpet_vo2_peak_ml_kg_min, \
            cpet_anaerobic_threshold_ml_kg_min, cpet_notes, malnutrition_risk, \
            unintentional_weight_loss_kg, fried_weakness, fried_slowness, \
            fried_low_physical_activity, fried_exhaustion, \
            fried_unintentional_weight_loss, risk_analysis_index_score, \
            mini_cog_performed, mini_cog_score, prehabilitation_indicated, \
            prehabilitation_type, prehabilitation_start_date, \
            protein_supplementation_recommended, technique, airway_plan, rsi_planned, \
            monitoring_level, analgesia_plan, regional_block_planned, dvt_prophylaxis, \
            antibiotic_prophylaxis, post_op_disposition, \
            anticipated_length_of_stay_days, special_equipment, blood_products_required, \
            hospital_number, indication_for_surgery, anaesthetist_name, \
            previous_surgeries, previous_anaesthetic_issues, \
            previous_anaesthetic_issues_details, \
            family_history_anaesthetic_complications, \
            family_history_anaesthetic_complications_details, urinalysis_findings, \
            living_situation, support_at_home, mobility_status, falls_risk_within_year, \
            vte_risk_level, covid_screening_result, discharge_destination, \
            follow_up_requirements, social_services_involvement, \
            reablement_physiotherapy_needs, consent_status, interpreter_required, \
            discussion_procedure, discussion_anaesthetic, discussion_risks_benefits, \
            discussion_alternatives) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, \
            $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, \
            $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, \
            $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, \
            $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, \
            $101, $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, \
            $113, $114, $115, $116, $117, $118, $119, $120, $121, $122, $123, $124, \
            $125, $126, $127, $128, $129, $130, $131, $132, $133, $134, $135, $136, \
            $137, $138, $139, $140, $141, $142, $143, $144, $145, $146, $147, $148, \
            $149, $150, $151, $152, $153, $154, $155, $156, $157, $158, $159, $160, \
            $161, $162, $163, $164, $165, $166, $167, $168, $169, $170, $171, $172, \
            $173, $174, $175, $176, $177, $178, $179, $180, $181, $182, $183, $184, \
            $185, $186, $187, $188, $189, $190, $191, $192, $193, $194, $195, $196, \
            $197, $198, $199, $200, $201, $202, $203, $204, $205, $206, $207, $208, \
            $209, $210, $211, $212, $213, $214, $215, $216, $217, $218, $219, $220, \
            $221, $222, $223, $224, $225, $226, $227, $228, $229, $230, $231, $232, \
            $233, $234, $235, $236, $237, $238, $239, $240, $241, $242, $243, $244, \
            $245, $246, $247, $248, $249, $250) RETURNING *",
        )
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
        .bind(&self.on_glp1_receptor_agonist)
        .bind(&self.glp1_agonist_name)
        .bind(&self.glp1_formulation)
        .bind(self.glp1_last_dose_at)
        .bind(&self.glp1_held_per_guideline)
        .bind(&self.glp1_extended_clear_fluids_confirmed)
        .bind(&self.glp1_gi_symptoms)
        .bind(&self.glp1_gi_symptoms_details)
        .bind(&self.glp1_gastric_ultrasound_performed)
        .bind(&self.glp1_gastric_ultrasound_findings)
        .bind(&self.glp1_full_stomach_precautions_planned)
        .bind(&self.glp1_notes)
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
        .bind(&self.fried_weakness)
        .bind(&self.fried_slowness)
        .bind(&self.fried_low_physical_activity)
        .bind(&self.fried_exhaustion)
        .bind(&self.fried_unintentional_weight_loss)
        .bind(self.risk_analysis_index_score)
        .bind(&self.mini_cog_performed)
        .bind(self.mini_cog_score)
        .bind(&self.prehabilitation_indicated)
        .bind(&self.prehabilitation_type)
        .bind(self.prehabilitation_start_date)
        .bind(&self.protein_supplementation_recommended)
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
        .bind(&self.hospital_number)
        .bind(&self.indication_for_surgery)
        .bind(&self.anaesthetist_name)
        .bind(&self.previous_surgeries)
        .bind(&self.previous_anaesthetic_issues)
        .bind(&self.previous_anaesthetic_issues_details)
        .bind(&self.family_history_anaesthetic_complications)
        .bind(&self.family_history_anaesthetic_complications_details)
        .bind(&self.urinalysis_findings)
        .bind(&self.living_situation)
        .bind(&self.support_at_home)
        .bind(&self.mobility_status)
        .bind(&self.falls_risk_within_year)
        .bind(&self.vte_risk_level)
        .bind(&self.covid_screening_result)
        .bind(&self.discharge_destination)
        .bind(&self.follow_up_requirements)
        .bind(&self.social_services_involvement)
        .bind(&self.reablement_physiotherapy_needs)
        .bind(&self.consent_status)
        .bind(&self.interpreter_required)
        .bind(&self.discussion_procedure)
        .bind(&self.discussion_anaesthetic)
        .bind(&self.discussion_risks_benefits)
        .bind(&self.discussion_alternatives)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pre_operative_assessment_by_clinicians SET patient_id = $2, \
            clinician_id = $3, status = $4, site_name = $5, assessment_date = $6, \
            assessment_time = $7, planned_procedure = $8, surgical_specialty = $9, \
            urgency = $10, laterality = $11, surgical_severity = $12, \
            anticipated_blood_loss_ml = $13, anticipated_duration_minutes = $14, \
            consultant_surgeon = $15, planned_date = $16, systolic_bp = $17, \
            diastolic_bp = $18, heart_rate = $19, respiratory_rate = $20, spo2_percent = \
            $21, temperature_celsius = $22, capillary_refill_seconds = $23, \
            pain_score_0_10 = $24, on_room_air = $25, supplemental_oxygen_litres = $26, \
            mallampati_class = $27, thyromental_distance_cm = $28, mouth_opening_cm = \
            $29, inter_incisor_gap_cm = $30, neck_rom = $31, cervical_spine_stability = \
            $32, dentition = $33, beard = $34, upper_lip_bite_test = $35, \
            prior_difficult_intubation = $36, stopbang_snoring = $37, stopbang_tired = \
            $38, stopbang_observed_apnoea = $39, stopbang_pressure = $40, \
            stopbang_bmi_gt35 = $41, stopbang_age_gt50 = $42, stopbang_neck_gt40 = $43, \
            stopbang_male = $44, airway_notes = $45, heart_rhythm = $46, murmur_present \
            = $47, murmur_description = $48, peripheral_pulses = $49, jvp_raised = $50, \
            peripheral_oedema = $51, ecg_performed = $52, ecg_rhythm = $53, ecg_rate_bpm \
            = $54, ecg_axis = $55, ecg_ischaemic_changes = $56, ecg_notes = $57, \
            echo_performed = $58, echo_ef_percent = $59, echo_notes = $60, history_ihd = \
            $61, history_chf = $62, history_stroke_tia = $63, recent_mi_within_3_months \
            = $64, pacemaker_or_icd = $65, severe_valve_dysfunction = $66, active_angina \
            = $67, breath_sounds = $68, wheeze = $69, crackles = $70, crepitations = \
            $71, chest_wall_deformity = $72, asthma = $73, copd = $74, cxr_performed = \
            $75, cxr_findings = $76, pft_performed = $77, pft_fev1_percent_predicted = \
            $78, pft_fev1_fvc_ratio = $79, smoking_status = $80, pack_years = $81, \
            covid_history = $82, days_since_covid = $83, covid_unresolved_symptoms = \
            $84, gcs_total = $85, gcs_eye = $86, gcs_verbal = $87, gcs_motor = $88, \
            cognition_tool = $89, cognition_score = $90, cognitive_impairment = $91, \
            capacity_concern = $92, cranial_nerves_notes = $93, motor_power = $94, \
            sensory_notes = $95, reflexes = $96, recent_stroke_tia = $97, \
            days_since_stroke_tia = $98, seizure_disorder = $99, creatinine_umol_l = \
            $100, egfr_ml_min_1_73m2 = $101, urea_mmol_l = $102, potassium_mmol_l = \
            $103, sodium_mmol_l = $104, dialysis_status = $105, ckd_stage = $106, \
            bilirubin_umol_l = $107, alt_u_l = $108, ast_u_l = $109, alp_u_l = $110, \
            albumin_g_l = $111, chronic_liver_disease = $112, child_pugh_class = $113, \
            hb_g_l = $114, wcc_10_9_l = $115, platelets_10_9_l = $116, mcv_fl = $117, \
            ferritin_ug_l = $118, transferrin_saturation_percent = $119, inr = $120, \
            aptt_seconds = $121, fibrinogen_g_l = $122, on_anticoagulant = $123, \
            anticoagulant_type = $124, anticoagulant_hold_plan = $125, group_and_save = \
            $126, crossmatch_units = $127, last_transfusion_date = $128, \
            anaemia_severity = $129, diabetes_type = $130, diabetes_on_insulin = $131, \
            hba1c_mmol_mol = $132, fasting_glucose_mmol_l = $133, random_glucose_mmol_l \
            = $134, diabetes_control = $135, diabetes_complications = $136, \
            thyroid_status = $137, tsh_mu_l = $138, adrenal_status = $139, \
            on_long_term_steroids = $140, steroid_dose_mg = $141, steroid_cover_plan = \
            $142, abdominal_exam = $143, abdominal_notes = $144, reflux_symptoms = $145, \
            hiatus_hernia = $146, previous_gastric_surgery = $147, ng_tube = $148, stoma \
            = $149, fasting_confirmed = $150, last_solid_food_at = $151, \
            last_clear_fluid_at = $152, rapid_sequence_induction_needed = $153, \
            spine_exam = $154, spine_notes = $155, neuraxial_suitable = $156, \
            joint_rom_hip = $157, joint_rom_shoulder = $158, joint_rom_neck = $159, \
            skin_iv_access = $160, skin_block_site = $161, pressure_ulcer_risk = $162, \
            name = $163, dose = $164, route = $165, frequency = $166, indication = $167, \
            class = $168, perioperative_action = $169, perioperative_notes = $170, \
            last_dose_at = $171, on_glp1_receptor_agonist = $172, glp1_agonist_name = \
            $173, glp1_formulation = $174, glp1_last_dose_at = $175, \
            glp1_held_per_guideline = $176, glp1_extended_clear_fluids_confirmed = $177, \
            glp1_gi_symptoms = $178, glp1_gi_symptoms_details = $179, \
            glp1_gastric_ultrasound_performed = $180, glp1_gastric_ultrasound_findings = \
            $181, glp1_full_stomach_precautions_planned = $182, glp1_notes = $183, \
            allergen = $184, category = $185, reaction_type = $186, reaction_severity = \
            $187, reaction_notes = $188, verified = $189, mets_estimate = $190, \
            dasi_score = $191, ecog_performance_status = $192, clinical_frailty_scale = \
            $193, six_minute_walk_metres = $194, sts_one_minute_reps = $195, tug_seconds \
            = $196, cpet_performed = $197, cpet_vo2_peak_ml_kg_min = $198, \
            cpet_anaerobic_threshold_ml_kg_min = $199, cpet_notes = $200, \
            malnutrition_risk = $201, unintentional_weight_loss_kg = $202, \
            fried_weakness = $203, fried_slowness = $204, fried_low_physical_activity = \
            $205, fried_exhaustion = $206, fried_unintentional_weight_loss = $207, \
            risk_analysis_index_score = $208, mini_cog_performed = $209, mini_cog_score \
            = $210, prehabilitation_indicated = $211, prehabilitation_type = $212, \
            prehabilitation_start_date = $213, protein_supplementation_recommended = \
            $214, technique = $215, airway_plan = $216, rsi_planned = $217, \
            monitoring_level = $218, analgesia_plan = $219, regional_block_planned = \
            $220, dvt_prophylaxis = $221, antibiotic_prophylaxis = $222, \
            post_op_disposition = $223, anticipated_length_of_stay_days = $224, \
            special_equipment = $225, blood_products_required = $226, hospital_number = \
            $227, indication_for_surgery = $228, anaesthetist_name = $229, \
            previous_surgeries = $230, previous_anaesthetic_issues = $231, \
            previous_anaesthetic_issues_details = $232, \
            family_history_anaesthetic_complications = $233, \
            family_history_anaesthetic_complications_details = $234, urinalysis_findings \
            = $235, living_situation = $236, support_at_home = $237, mobility_status = \
            $238, falls_risk_within_year = $239, vte_risk_level = $240, \
            covid_screening_result = $241, discharge_destination = $242, \
            follow_up_requirements = $243, social_services_involvement = $244, \
            reablement_physiotherapy_needs = $245, consent_status = $246, \
            interpreter_required = $247, discussion_procedure = $248, \
            discussion_anaesthetic = $249, discussion_risks_benefits = $250, \
            discussion_alternatives = $251, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
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
        .bind(&self.on_glp1_receptor_agonist)
        .bind(&self.glp1_agonist_name)
        .bind(&self.glp1_formulation)
        .bind(self.glp1_last_dose_at)
        .bind(&self.glp1_held_per_guideline)
        .bind(&self.glp1_extended_clear_fluids_confirmed)
        .bind(&self.glp1_gi_symptoms)
        .bind(&self.glp1_gi_symptoms_details)
        .bind(&self.glp1_gastric_ultrasound_performed)
        .bind(&self.glp1_gastric_ultrasound_findings)
        .bind(&self.glp1_full_stomach_precautions_planned)
        .bind(&self.glp1_notes)
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
        .bind(&self.fried_weakness)
        .bind(&self.fried_slowness)
        .bind(&self.fried_low_physical_activity)
        .bind(&self.fried_exhaustion)
        .bind(&self.fried_unintentional_weight_loss)
        .bind(self.risk_analysis_index_score)
        .bind(&self.mini_cog_performed)
        .bind(self.mini_cog_score)
        .bind(&self.prehabilitation_indicated)
        .bind(&self.prehabilitation_type)
        .bind(self.prehabilitation_start_date)
        .bind(&self.protein_supplementation_recommended)
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
        .bind(&self.hospital_number)
        .bind(&self.indication_for_surgery)
        .bind(&self.anaesthetist_name)
        .bind(&self.previous_surgeries)
        .bind(&self.previous_anaesthetic_issues)
        .bind(&self.previous_anaesthetic_issues_details)
        .bind(&self.family_history_anaesthetic_complications)
        .bind(&self.family_history_anaesthetic_complications_details)
        .bind(&self.urinalysis_findings)
        .bind(&self.living_situation)
        .bind(&self.support_at_home)
        .bind(&self.mobility_status)
        .bind(&self.falls_risk_within_year)
        .bind(&self.vte_risk_level)
        .bind(&self.covid_screening_result)
        .bind(&self.discharge_destination)
        .bind(&self.follow_up_requirements)
        .bind(&self.social_services_involvement)
        .bind(&self.reablement_physiotherapy_needs)
        .bind(&self.consent_status)
        .bind(&self.interpreter_required)
        .bind(&self.discussion_procedure)
        .bind(&self.discussion_anaesthetic)
        .bind(&self.discussion_risks_benefits)
        .bind(&self.discussion_alternatives)
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
        .prefix("api/pre_operative_assessment_by_clinicians/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
