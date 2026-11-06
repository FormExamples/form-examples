#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::perioperative_optimizations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub site_name: String,
    pub service_name: String,
    pub pathway_stage: String,
    pub assessment_mode: String,
    pub referral_source: String,
    pub planned_procedure: String,
    pub surgical_specialty: String,
    pub consultant_surgeon: String,
    pub planned_surgery_date: Option<Date>,
    pub urgency: String,
    pub surgical_severity: String,
    pub laterality: String,
    pub anticipated_blood_loss_ml: Option<i32>,
    pub anticipated_length_of_stay_days: Option<i32>,
    pub interpreter_required: String,
    pub interpreter_language: String,
    pub condition_cardiac: String,
    pub condition_respiratory: String,
    pub condition_renal: String,
    pub condition_hepatic: String,
    pub condition_stroke: String,
    pub condition_cancer: String,
    pub condition_rheumatological: String,
    pub condition_thyroid: String,
    pub condition_other: String,
    pub previous_surgery: String,
    pub previous_surgery_detail: String,
    pub previous_anaesthetic_complication: String,
    pub previous_anaesthetic_complication_detail: String,
    pub postoperative_nausea_history: String,
    pub difficult_airway_history: String,
    pub malignant_hyperthermia_history: String,
    pub venous_thromboembolism_history: String,
    pub family_history: String,
    pub pregnancy_status: String,
    pub takes_prescription_medicines: String,
    pub takes_over_the_counter_medicines: String,
    pub takes_herbal_products: String,
    pub takes_anticoagulant: String,
    pub takes_antiplatelet: String,
    pub takes_ace_inhibitor_or_arb: String,
    pub takes_sglt2_inhibitor: String,
    pub takes_glp1_agonist: String,
    pub glp1_formulation: String,
    pub glp1_held_per_guideline: String,
    pub glp1_extended_clear_fluids_confirmed: String,
    pub glp1_gi_symptoms: String,
    pub glp1_gi_symptoms_details: String,
    pub glp1_gastric_ultrasound_performed: String,
    pub glp1_gastric_ultrasound_findings: String,
    pub takes_corticosteroid: String,
    pub takes_immunosuppressant: String,
    pub takes_hormone_therapy: String,
    pub medication_hold_plan_agreed: String,
    pub medication_hold_plan_agreed_by: String,
    pub medication_adherence: String,
    pub medication_notes: String,
    pub has_drug_allergy: String,
    pub drug_allergy_detail: String,
    pub has_food_allergy: String,
    pub food_allergy_detail: String,
    pub has_latex_allergy: String,
    pub has_adhesive_allergy: String,
    pub has_contrast_allergy: String,
    pub allergy_severity: String,
    pub adrenaline_auto_injector: String,
    pub allergy_notes: String,
    pub bloods_sample_date: Option<Date>,
    pub haemoglobin_g_per_l: Option<f64>,
    pub mean_cell_volume_fl: Option<f64>,
    pub ferritin_ug_per_l: Option<f64>,
    pub transferrin_saturation_percent: Option<f64>,
    pub vitamin_b12_ng_per_l: Option<f64>,
    pub folate_ug_per_l: Option<f64>,
    pub c_reactive_protein_mg_per_l: Option<f64>,
    pub creatinine_umol_per_l: Option<f64>,
    pub egfr_ml_per_min: Option<f64>,
    pub anaemia_known_cause: String,
    pub anaemia_treatment_started: String,
    pub anaemia_treatment_route: String,
    pub anaemia_treatment_start_date: Option<Date>,
    pub previous_transfusion: String,
    pub group_and_save_done: String,
    pub anaemia_notes: String,
    pub diabetes_type: String,
    pub diabetes_duration_years: Option<f64>,
    pub hba1c_mmol_per_mol: Option<f64>,
    pub hba1c_sample_date: Option<Date>,
    pub capillary_glucose_mmol_per_l: Option<f64>,
    pub diabetes_treatment: String,
    pub insulin_regimen: String,
    pub hypoglycaemia_awareness: String,
    pub diabetes_team_review: String,
    pub diabetes_team_review_date: Option<Date>,
    pub foot_check_done: String,
    pub glycaemic_notes: String,
    pub smoking_status: String,
    pub cigarettes_per_day: Option<i32>,
    pub pack_years: Option<f64>,
    pub quit_date: Option<Date>,
    pub smoking_cessation_offered: String,
    pub smoking_cessation_accepted: String,
    pub nicotine_replacement: String,
    pub vaping: String,
    pub smoking_notes: String,
    pub alcohol_units_per_week: Option<f64>,
    pub audit_c_frequency: Option<i32>,
    pub audit_c_typical_quantity: Option<i32>,
    pub audit_c_binge_frequency: Option<i32>,
    pub alcohol_dependence_features: String,
    pub alcohol_reduction_plan_agreed: String,
    pub alcohol_services_referral: String,
    pub recreational_drug_use: String,
    pub recreational_drug_detail: String,
    pub alcohol_notes: String,
    pub height_as_cm: Option<f64>,
    pub weight_as_kg: Option<f64>,
    pub body_mass_index: Option<f64>,
    pub usual_weight_as_kg: Option<f64>,
    pub weight_loss_percent: Option<f64>,
    pub weight_loss_is_intentional: String,
    pub acutely_ill: String,
    pub no_nutritional_intake_over_5_days: String,
    pub appetite: String,
    pub oral_nutritional_supplements: String,
    pub immunonutrition: String,
    pub dietitian_referral: String,
    pub nutrition_notes: String,
    pub usual_activity_level: String,
    pub climbs_flight_of_stairs: String,
    pub metabolic_equivalents: Option<f64>,
    pub duke_activity_status_index: Option<f64>,
    pub six_minute_walk_metres: Option<i32>,
    pub cpet_anaerobic_threshold: Option<f64>,
    pub cpet_peak_vo2: Option<f64>,
    pub grip_strength_kg: Option<f64>,
    pub prehabilitation_offered: String,
    pub prehabilitation_enrolled: String,
    pub prehabilitation_sessions_per_week: Option<i32>,
    pub prehabilitation_start_date: Option<Date>,
    pub protein_supplementation_recommended: String,
    pub fitness_notes: String,
    pub clinical_frailty_scale: Option<i32>,
    pub fried_weakness: String,
    pub fried_slowness: String,
    pub fried_low_physical_activity: String,
    pub fried_exhaustion: String,
    pub fried_unintentional_weight_loss: String,
    pub risk_analysis_index_score: Option<i32>,
    pub mini_cog_performed: String,
    pub mini_cog_score: Option<i32>,
    pub cognitive_screen_tool: String,
    pub cognitive_screen_score: Option<f64>,
    pub cognitive_impairment: String,
    pub capacity_concern: String,
    pub falls_in_last_12_months: Option<i32>,
    pub mobility_aid: String,
    pub living_situation: String,
    pub care_package: String,
    pub frailty_notes: String,
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub heart_rate: Option<i32>,
    pub heart_rhythm: String,
    pub murmur_present: String,
    pub exercise_tolerance: String,
    pub ejection_fraction_percent: Option<i32>,
    pub echo_date: Option<Date>,
    pub asthma_control: String,
    pub copd_control: String,
    pub inhaler_technique_checked: String,
    pub rescue_steroids: String,
    pub spirometry_fev1_percent: Option<f64>,
    pub stop_bang_score: Option<i32>,
    pub sleep_apnoea_diagnosis: String,
    pub cpap_use: String,
    pub oxygen_saturation_percent: Option<f64>,
    pub cardiorespiratory_notes: String,
    pub anxiety_level: String,
    pub depression_screen: String,
    pub understands_procedure: String,
    pub expectations_realistic: String,
    pub shared_decision_making_discussed: String,
    pub has_carer: String,
    pub transport_home_arranged: String,
    pub support_after_discharge: String,
    pub health_literacy: String,
    pub psychological_support_offered: String,
    pub social_notes: String,
    pub plan_anaemia: String,
    pub referral_anaemia: String,
    pub plan_glycaemic_control: String,
    pub referral_glycaemic_control: String,
    pub plan_smoking: String,
    pub referral_smoking: String,
    pub plan_alcohol: String,
    pub referral_alcohol: String,
    pub plan_nutrition: String,
    pub referral_nutrition: String,
    pub plan_physical_fitness: String,
    pub referral_physical_fitness: String,
    pub plan_medication: String,
    pub referral_medication: String,
    pub plan_cardiorespiratory: String,
    pub referral_cardiorespiratory: String,
    pub responsible_clinician: String,
    pub plan_agreed_with_patient: String,
    pub plan_shared_with_patient: String,
    pub next_review_date: Option<Date>,
    pub plan_notes: String,
    pub gate_decision: String,
    pub additional_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO perioperative_optimizations (deleted_at, patient_id, clinician_id, \
            status, assessment_date, assessment_time, site_name, service_name, pathway_stage, \
            assessment_mode, referral_source, planned_procedure, surgical_specialty, \
            consultant_surgeon, planned_surgery_date, urgency, surgical_severity, laterality, \
            anticipated_blood_loss_ml, anticipated_length_of_stay_days, interpreter_required, \
            interpreter_language, condition_cardiac, condition_respiratory, condition_renal, \
            condition_hepatic, condition_stroke, condition_cancer, condition_rheumatological, \
            condition_thyroid, condition_other, previous_surgery, previous_surgery_detail, \
            previous_anaesthetic_complication, previous_anaesthetic_complication_detail, \
            postoperative_nausea_history, difficult_airway_history, \
            malignant_hyperthermia_history, venous_thromboembolism_history, family_history, \
            pregnancy_status, takes_prescription_medicines, takes_over_the_counter_medicines, \
            takes_herbal_products, takes_anticoagulant, takes_antiplatelet, \
            takes_ace_inhibitor_or_arb, takes_sglt2_inhibitor, takes_glp1_agonist, \
            glp1_formulation, glp1_held_per_guideline, glp1_extended_clear_fluids_confirmed, \
            glp1_gi_symptoms, glp1_gi_symptoms_details, glp1_gastric_ultrasound_performed, \
            glp1_gastric_ultrasound_findings, takes_corticosteroid, takes_immunosuppressant, \
            takes_hormone_therapy, medication_hold_plan_agreed, \
            medication_hold_plan_agreed_by, medication_adherence, medication_notes, \
            has_drug_allergy, drug_allergy_detail, has_food_allergy, food_allergy_detail, \
            has_latex_allergy, has_adhesive_allergy, has_contrast_allergy, allergy_severity, \
            adrenaline_auto_injector, allergy_notes, bloods_sample_date, haemoglobin_g_per_l, \
            mean_cell_volume_fl, ferritin_ug_per_l, transferrin_saturation_percent, \
            vitamin_b12_ng_per_l, folate_ug_per_l, c_reactive_protein_mg_per_l, \
            creatinine_umol_per_l, egfr_ml_per_min, anaemia_known_cause, \
            anaemia_treatment_started, anaemia_treatment_route, anaemia_treatment_start_date, \
            previous_transfusion, group_and_save_done, anaemia_notes, diabetes_type, \
            diabetes_duration_years, hba1c_mmol_per_mol, hba1c_sample_date, \
            capillary_glucose_mmol_per_l, diabetes_treatment, insulin_regimen, \
            hypoglycaemia_awareness, diabetes_team_review, diabetes_team_review_date, \
            foot_check_done, glycaemic_notes, smoking_status, cigarettes_per_day, pack_years, \
            quit_date, smoking_cessation_offered, smoking_cessation_accepted, \
            nicotine_replacement, vaping, smoking_notes, alcohol_units_per_week, \
            audit_c_frequency, audit_c_typical_quantity, audit_c_binge_frequency, \
            alcohol_dependence_features, alcohol_reduction_plan_agreed, \
            alcohol_services_referral, recreational_drug_use, recreational_drug_detail, \
            alcohol_notes, height_as_cm, weight_as_kg, body_mass_index, usual_weight_as_kg, \
            weight_loss_percent, weight_loss_is_intentional, acutely_ill, \
            no_nutritional_intake_over_5_days, appetite, oral_nutritional_supplements, \
            immunonutrition, dietitian_referral, nutrition_notes, usual_activity_level, \
            climbs_flight_of_stairs, metabolic_equivalents, duke_activity_status_index, \
            six_minute_walk_metres, cpet_anaerobic_threshold, cpet_peak_vo2, \
            grip_strength_kg, prehabilitation_offered, prehabilitation_enrolled, \
            prehabilitation_sessions_per_week, prehabilitation_start_date, \
            protein_supplementation_recommended, fitness_notes, clinical_frailty_scale, \
            fried_weakness, fried_slowness, fried_low_physical_activity, fried_exhaustion, \
            fried_unintentional_weight_loss, risk_analysis_index_score, mini_cog_performed, \
            mini_cog_score, cognitive_screen_tool, cognitive_screen_score, \
            cognitive_impairment, capacity_concern, falls_in_last_12_months, mobility_aid, \
            living_situation, care_package, frailty_notes, systolic_bp, diastolic_bp, \
            heart_rate, heart_rhythm, murmur_present, exercise_tolerance, \
            ejection_fraction_percent, echo_date, asthma_control, copd_control, \
            inhaler_technique_checked, rescue_steroids, spirometry_fev1_percent, \
            stop_bang_score, sleep_apnoea_diagnosis, cpap_use, oxygen_saturation_percent, \
            cardiorespiratory_notes, anxiety_level, depression_screen, understands_procedure, \
            expectations_realistic, shared_decision_making_discussed, has_carer, \
            transport_home_arranged, support_after_discharge, health_literacy, \
            psychological_support_offered, social_notes, plan_anaemia, referral_anaemia, \
            plan_glycaemic_control, referral_glycaemic_control, plan_smoking, \
            referral_smoking, plan_alcohol, referral_alcohol, plan_nutrition, \
            referral_nutrition, plan_physical_fitness, referral_physical_fitness, \
            plan_medication, referral_medication, plan_cardiorespiratory, \
            referral_cardiorespiratory, responsible_clinician, plan_agreed_with_patient, \
            plan_shared_with_patient, next_review_date, plan_notes, gate_decision, \
            additional_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, \
            $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, \
            $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, \
            $94, $95, $96, $97, $98, $99, $100, $101, $102, $103, $104, $105, $106, $107, \
            $108, $109, $110, $111, $112, $113, $114, $115, $116, $117, $118, $119, $120, \
            $121, $122, $123, $124, $125, $126, $127, $128, $129, $130, $131, $132, $133, \
            $134, $135, $136, $137, $138, $139, $140, $141, $142, $143, $144, $145, $146, \
            $147, $148, $149, $150, $151, $152, $153, $154, $155, $156, $157, $158, $159, \
            $160, $161, $162, $163, $164, $165, $166, $167, $168, $169, $170, $171, $172, \
            $173, $174, $175, $176, $177, $178, $179, $180, $181, $182, $183, $184, $185, \
            $186, $187, $188, $189, $190, $191, $192, $193, $194, $195, $196, $197, $198, \
            $199, $200, $201, $202, $203, $204, $205, $206, $207, $208, $209, $210, $211, \
            $212, $213, $214, $215, $216, $217, $218) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.service_name)
        .bind(&self.pathway_stage)
        .bind(&self.assessment_mode)
        .bind(&self.referral_source)
        .bind(&self.planned_procedure)
        .bind(&self.surgical_specialty)
        .bind(&self.consultant_surgeon)
        .bind(self.planned_surgery_date)
        .bind(&self.urgency)
        .bind(&self.surgical_severity)
        .bind(&self.laterality)
        .bind(self.anticipated_blood_loss_ml)
        .bind(self.anticipated_length_of_stay_days)
        .bind(&self.interpreter_required)
        .bind(&self.interpreter_language)
        .bind(&self.condition_cardiac)
        .bind(&self.condition_respiratory)
        .bind(&self.condition_renal)
        .bind(&self.condition_hepatic)
        .bind(&self.condition_stroke)
        .bind(&self.condition_cancer)
        .bind(&self.condition_rheumatological)
        .bind(&self.condition_thyroid)
        .bind(&self.condition_other)
        .bind(&self.previous_surgery)
        .bind(&self.previous_surgery_detail)
        .bind(&self.previous_anaesthetic_complication)
        .bind(&self.previous_anaesthetic_complication_detail)
        .bind(&self.postoperative_nausea_history)
        .bind(&self.difficult_airway_history)
        .bind(&self.malignant_hyperthermia_history)
        .bind(&self.venous_thromboembolism_history)
        .bind(&self.family_history)
        .bind(&self.pregnancy_status)
        .bind(&self.takes_prescription_medicines)
        .bind(&self.takes_over_the_counter_medicines)
        .bind(&self.takes_herbal_products)
        .bind(&self.takes_anticoagulant)
        .bind(&self.takes_antiplatelet)
        .bind(&self.takes_ace_inhibitor_or_arb)
        .bind(&self.takes_sglt2_inhibitor)
        .bind(&self.takes_glp1_agonist)
        .bind(&self.glp1_formulation)
        .bind(&self.glp1_held_per_guideline)
        .bind(&self.glp1_extended_clear_fluids_confirmed)
        .bind(&self.glp1_gi_symptoms)
        .bind(&self.glp1_gi_symptoms_details)
        .bind(&self.glp1_gastric_ultrasound_performed)
        .bind(&self.glp1_gastric_ultrasound_findings)
        .bind(&self.takes_corticosteroid)
        .bind(&self.takes_immunosuppressant)
        .bind(&self.takes_hormone_therapy)
        .bind(&self.medication_hold_plan_agreed)
        .bind(&self.medication_hold_plan_agreed_by)
        .bind(&self.medication_adherence)
        .bind(&self.medication_notes)
        .bind(&self.has_drug_allergy)
        .bind(&self.drug_allergy_detail)
        .bind(&self.has_food_allergy)
        .bind(&self.food_allergy_detail)
        .bind(&self.has_latex_allergy)
        .bind(&self.has_adhesive_allergy)
        .bind(&self.has_contrast_allergy)
        .bind(&self.allergy_severity)
        .bind(&self.adrenaline_auto_injector)
        .bind(&self.allergy_notes)
        .bind(self.bloods_sample_date)
        .bind(self.haemoglobin_g_per_l)
        .bind(self.mean_cell_volume_fl)
        .bind(self.ferritin_ug_per_l)
        .bind(self.transferrin_saturation_percent)
        .bind(self.vitamin_b12_ng_per_l)
        .bind(self.folate_ug_per_l)
        .bind(self.c_reactive_protein_mg_per_l)
        .bind(self.creatinine_umol_per_l)
        .bind(self.egfr_ml_per_min)
        .bind(&self.anaemia_known_cause)
        .bind(&self.anaemia_treatment_started)
        .bind(&self.anaemia_treatment_route)
        .bind(self.anaemia_treatment_start_date)
        .bind(&self.previous_transfusion)
        .bind(&self.group_and_save_done)
        .bind(&self.anaemia_notes)
        .bind(&self.diabetes_type)
        .bind(self.diabetes_duration_years)
        .bind(self.hba1c_mmol_per_mol)
        .bind(self.hba1c_sample_date)
        .bind(self.capillary_glucose_mmol_per_l)
        .bind(&self.diabetes_treatment)
        .bind(&self.insulin_regimen)
        .bind(&self.hypoglycaemia_awareness)
        .bind(&self.diabetes_team_review)
        .bind(self.diabetes_team_review_date)
        .bind(&self.foot_check_done)
        .bind(&self.glycaemic_notes)
        .bind(&self.smoking_status)
        .bind(self.cigarettes_per_day)
        .bind(self.pack_years)
        .bind(self.quit_date)
        .bind(&self.smoking_cessation_offered)
        .bind(&self.smoking_cessation_accepted)
        .bind(&self.nicotine_replacement)
        .bind(&self.vaping)
        .bind(&self.smoking_notes)
        .bind(self.alcohol_units_per_week)
        .bind(self.audit_c_frequency)
        .bind(self.audit_c_typical_quantity)
        .bind(self.audit_c_binge_frequency)
        .bind(&self.alcohol_dependence_features)
        .bind(&self.alcohol_reduction_plan_agreed)
        .bind(&self.alcohol_services_referral)
        .bind(&self.recreational_drug_use)
        .bind(&self.recreational_drug_detail)
        .bind(&self.alcohol_notes)
        .bind(self.height_as_cm)
        .bind(self.weight_as_kg)
        .bind(self.body_mass_index)
        .bind(self.usual_weight_as_kg)
        .bind(self.weight_loss_percent)
        .bind(&self.weight_loss_is_intentional)
        .bind(&self.acutely_ill)
        .bind(&self.no_nutritional_intake_over_5_days)
        .bind(&self.appetite)
        .bind(&self.oral_nutritional_supplements)
        .bind(&self.immunonutrition)
        .bind(&self.dietitian_referral)
        .bind(&self.nutrition_notes)
        .bind(&self.usual_activity_level)
        .bind(&self.climbs_flight_of_stairs)
        .bind(self.metabolic_equivalents)
        .bind(self.duke_activity_status_index)
        .bind(self.six_minute_walk_metres)
        .bind(self.cpet_anaerobic_threshold)
        .bind(self.cpet_peak_vo2)
        .bind(self.grip_strength_kg)
        .bind(&self.prehabilitation_offered)
        .bind(&self.prehabilitation_enrolled)
        .bind(self.prehabilitation_sessions_per_week)
        .bind(self.prehabilitation_start_date)
        .bind(&self.protein_supplementation_recommended)
        .bind(&self.fitness_notes)
        .bind(self.clinical_frailty_scale)
        .bind(&self.fried_weakness)
        .bind(&self.fried_slowness)
        .bind(&self.fried_low_physical_activity)
        .bind(&self.fried_exhaustion)
        .bind(&self.fried_unintentional_weight_loss)
        .bind(self.risk_analysis_index_score)
        .bind(&self.mini_cog_performed)
        .bind(self.mini_cog_score)
        .bind(&self.cognitive_screen_tool)
        .bind(self.cognitive_screen_score)
        .bind(&self.cognitive_impairment)
        .bind(&self.capacity_concern)
        .bind(self.falls_in_last_12_months)
        .bind(&self.mobility_aid)
        .bind(&self.living_situation)
        .bind(&self.care_package)
        .bind(&self.frailty_notes)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.heart_rate)
        .bind(&self.heart_rhythm)
        .bind(&self.murmur_present)
        .bind(&self.exercise_tolerance)
        .bind(self.ejection_fraction_percent)
        .bind(self.echo_date)
        .bind(&self.asthma_control)
        .bind(&self.copd_control)
        .bind(&self.inhaler_technique_checked)
        .bind(&self.rescue_steroids)
        .bind(self.spirometry_fev1_percent)
        .bind(self.stop_bang_score)
        .bind(&self.sleep_apnoea_diagnosis)
        .bind(&self.cpap_use)
        .bind(self.oxygen_saturation_percent)
        .bind(&self.cardiorespiratory_notes)
        .bind(&self.anxiety_level)
        .bind(&self.depression_screen)
        .bind(&self.understands_procedure)
        .bind(&self.expectations_realistic)
        .bind(&self.shared_decision_making_discussed)
        .bind(&self.has_carer)
        .bind(&self.transport_home_arranged)
        .bind(&self.support_after_discharge)
        .bind(&self.health_literacy)
        .bind(&self.psychological_support_offered)
        .bind(&self.social_notes)
        .bind(&self.plan_anaemia)
        .bind(&self.referral_anaemia)
        .bind(&self.plan_glycaemic_control)
        .bind(&self.referral_glycaemic_control)
        .bind(&self.plan_smoking)
        .bind(&self.referral_smoking)
        .bind(&self.plan_alcohol)
        .bind(&self.referral_alcohol)
        .bind(&self.plan_nutrition)
        .bind(&self.referral_nutrition)
        .bind(&self.plan_physical_fitness)
        .bind(&self.referral_physical_fitness)
        .bind(&self.plan_medication)
        .bind(&self.referral_medication)
        .bind(&self.plan_cardiorespiratory)
        .bind(&self.referral_cardiorespiratory)
        .bind(&self.responsible_clinician)
        .bind(&self.plan_agreed_with_patient)
        .bind(&self.plan_shared_with_patient)
        .bind(self.next_review_date)
        .bind(&self.plan_notes)
        .bind(&self.gate_decision)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE perioperative_optimizations SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, assessment_date = $6, assessment_time = $7, \
            site_name = $8, service_name = $9, pathway_stage = $10, assessment_mode = $11, \
            referral_source = $12, planned_procedure = $13, surgical_specialty = $14, \
            consultant_surgeon = $15, planned_surgery_date = $16, urgency = $17, \
            surgical_severity = $18, laterality = $19, anticipated_blood_loss_ml = $20, \
            anticipated_length_of_stay_days = $21, interpreter_required = $22, \
            interpreter_language = $23, condition_cardiac = $24, condition_respiratory = $25, \
            condition_renal = $26, condition_hepatic = $27, condition_stroke = $28, \
            condition_cancer = $29, condition_rheumatological = $30, condition_thyroid = $31, \
            condition_other = $32, previous_surgery = $33, previous_surgery_detail = $34, \
            previous_anaesthetic_complication = $35, previous_anaesthetic_complication_detail \
            = $36, postoperative_nausea_history = $37, difficult_airway_history = $38, \
            malignant_hyperthermia_history = $39, venous_thromboembolism_history = $40, \
            family_history = $41, pregnancy_status = $42, takes_prescription_medicines = $43, \
            takes_over_the_counter_medicines = $44, takes_herbal_products = $45, \
            takes_anticoagulant = $46, takes_antiplatelet = $47, takes_ace_inhibitor_or_arb = \
            $48, takes_sglt2_inhibitor = $49, takes_glp1_agonist = $50, glp1_formulation = \
            $51, glp1_held_per_guideline = $52, glp1_extended_clear_fluids_confirmed = $53, \
            glp1_gi_symptoms = $54, glp1_gi_symptoms_details = $55, \
            glp1_gastric_ultrasound_performed = $56, glp1_gastric_ultrasound_findings = $57, \
            takes_corticosteroid = $58, takes_immunosuppressant = $59, takes_hormone_therapy \
            = $60, medication_hold_plan_agreed = $61, medication_hold_plan_agreed_by = $62, \
            medication_adherence = $63, medication_notes = $64, has_drug_allergy = $65, \
            drug_allergy_detail = $66, has_food_allergy = $67, food_allergy_detail = $68, \
            has_latex_allergy = $69, has_adhesive_allergy = $70, has_contrast_allergy = $71, \
            allergy_severity = $72, adrenaline_auto_injector = $73, allergy_notes = $74, \
            bloods_sample_date = $75, haemoglobin_g_per_l = $76, mean_cell_volume_fl = $77, \
            ferritin_ug_per_l = $78, transferrin_saturation_percent = $79, \
            vitamin_b12_ng_per_l = $80, folate_ug_per_l = $81, c_reactive_protein_mg_per_l = \
            $82, creatinine_umol_per_l = $83, egfr_ml_per_min = $84, anaemia_known_cause = \
            $85, anaemia_treatment_started = $86, anaemia_treatment_route = $87, \
            anaemia_treatment_start_date = $88, previous_transfusion = $89, \
            group_and_save_done = $90, anaemia_notes = $91, diabetes_type = $92, \
            diabetes_duration_years = $93, hba1c_mmol_per_mol = $94, hba1c_sample_date = $95, \
            capillary_glucose_mmol_per_l = $96, diabetes_treatment = $97, insulin_regimen = \
            $98, hypoglycaemia_awareness = $99, diabetes_team_review = $100, \
            diabetes_team_review_date = $101, foot_check_done = $102, glycaemic_notes = $103, \
            smoking_status = $104, cigarettes_per_day = $105, pack_years = $106, quit_date = \
            $107, smoking_cessation_offered = $108, smoking_cessation_accepted = $109, \
            nicotine_replacement = $110, vaping = $111, smoking_notes = $112, \
            alcohol_units_per_week = $113, audit_c_frequency = $114, audit_c_typical_quantity \
            = $115, audit_c_binge_frequency = $116, alcohol_dependence_features = $117, \
            alcohol_reduction_plan_agreed = $118, alcohol_services_referral = $119, \
            recreational_drug_use = $120, recreational_drug_detail = $121, alcohol_notes = \
            $122, height_as_cm = $123, weight_as_kg = $124, body_mass_index = $125, \
            usual_weight_as_kg = $126, weight_loss_percent = $127, weight_loss_is_intentional \
            = $128, acutely_ill = $129, no_nutritional_intake_over_5_days = $130, appetite = \
            $131, oral_nutritional_supplements = $132, immunonutrition = $133, \
            dietitian_referral = $134, nutrition_notes = $135, usual_activity_level = $136, \
            climbs_flight_of_stairs = $137, metabolic_equivalents = $138, \
            duke_activity_status_index = $139, six_minute_walk_metres = $140, \
            cpet_anaerobic_threshold = $141, cpet_peak_vo2 = $142, grip_strength_kg = $143, \
            prehabilitation_offered = $144, prehabilitation_enrolled = $145, \
            prehabilitation_sessions_per_week = $146, prehabilitation_start_date = $147, \
            protein_supplementation_recommended = $148, fitness_notes = $149, \
            clinical_frailty_scale = $150, fried_weakness = $151, fried_slowness = $152, \
            fried_low_physical_activity = $153, fried_exhaustion = $154, \
            fried_unintentional_weight_loss = $155, risk_analysis_index_score = $156, \
            mini_cog_performed = $157, mini_cog_score = $158, cognitive_screen_tool = $159, \
            cognitive_screen_score = $160, cognitive_impairment = $161, capacity_concern = \
            $162, falls_in_last_12_months = $163, mobility_aid = $164, living_situation = \
            $165, care_package = $166, frailty_notes = $167, systolic_bp = $168, diastolic_bp \
            = $169, heart_rate = $170, heart_rhythm = $171, murmur_present = $172, \
            exercise_tolerance = $173, ejection_fraction_percent = $174, echo_date = $175, \
            asthma_control = $176, copd_control = $177, inhaler_technique_checked = $178, \
            rescue_steroids = $179, spirometry_fev1_percent = $180, stop_bang_score = $181, \
            sleep_apnoea_diagnosis = $182, cpap_use = $183, oxygen_saturation_percent = $184, \
            cardiorespiratory_notes = $185, anxiety_level = $186, depression_screen = $187, \
            understands_procedure = $188, expectations_realistic = $189, \
            shared_decision_making_discussed = $190, has_carer = $191, \
            transport_home_arranged = $192, support_after_discharge = $193, health_literacy = \
            $194, psychological_support_offered = $195, social_notes = $196, plan_anaemia = \
            $197, referral_anaemia = $198, plan_glycaemic_control = $199, \
            referral_glycaemic_control = $200, plan_smoking = $201, referral_smoking = $202, \
            plan_alcohol = $203, referral_alcohol = $204, plan_nutrition = $205, \
            referral_nutrition = $206, plan_physical_fitness = $207, \
            referral_physical_fitness = $208, plan_medication = $209, referral_medication = \
            $210, plan_cardiorespiratory = $211, referral_cardiorespiratory = $212, \
            responsible_clinician = $213, plan_agreed_with_patient = $214, \
            plan_shared_with_patient = $215, next_review_date = $216, plan_notes = $217, \
            gate_decision = $218, additional_notes = $219, updated_at = now() WHERE id = $1 \
            RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.service_name)
        .bind(&self.pathway_stage)
        .bind(&self.assessment_mode)
        .bind(&self.referral_source)
        .bind(&self.planned_procedure)
        .bind(&self.surgical_specialty)
        .bind(&self.consultant_surgeon)
        .bind(self.planned_surgery_date)
        .bind(&self.urgency)
        .bind(&self.surgical_severity)
        .bind(&self.laterality)
        .bind(self.anticipated_blood_loss_ml)
        .bind(self.anticipated_length_of_stay_days)
        .bind(&self.interpreter_required)
        .bind(&self.interpreter_language)
        .bind(&self.condition_cardiac)
        .bind(&self.condition_respiratory)
        .bind(&self.condition_renal)
        .bind(&self.condition_hepatic)
        .bind(&self.condition_stroke)
        .bind(&self.condition_cancer)
        .bind(&self.condition_rheumatological)
        .bind(&self.condition_thyroid)
        .bind(&self.condition_other)
        .bind(&self.previous_surgery)
        .bind(&self.previous_surgery_detail)
        .bind(&self.previous_anaesthetic_complication)
        .bind(&self.previous_anaesthetic_complication_detail)
        .bind(&self.postoperative_nausea_history)
        .bind(&self.difficult_airway_history)
        .bind(&self.malignant_hyperthermia_history)
        .bind(&self.venous_thromboembolism_history)
        .bind(&self.family_history)
        .bind(&self.pregnancy_status)
        .bind(&self.takes_prescription_medicines)
        .bind(&self.takes_over_the_counter_medicines)
        .bind(&self.takes_herbal_products)
        .bind(&self.takes_anticoagulant)
        .bind(&self.takes_antiplatelet)
        .bind(&self.takes_ace_inhibitor_or_arb)
        .bind(&self.takes_sglt2_inhibitor)
        .bind(&self.takes_glp1_agonist)
        .bind(&self.glp1_formulation)
        .bind(&self.glp1_held_per_guideline)
        .bind(&self.glp1_extended_clear_fluids_confirmed)
        .bind(&self.glp1_gi_symptoms)
        .bind(&self.glp1_gi_symptoms_details)
        .bind(&self.glp1_gastric_ultrasound_performed)
        .bind(&self.glp1_gastric_ultrasound_findings)
        .bind(&self.takes_corticosteroid)
        .bind(&self.takes_immunosuppressant)
        .bind(&self.takes_hormone_therapy)
        .bind(&self.medication_hold_plan_agreed)
        .bind(&self.medication_hold_plan_agreed_by)
        .bind(&self.medication_adherence)
        .bind(&self.medication_notes)
        .bind(&self.has_drug_allergy)
        .bind(&self.drug_allergy_detail)
        .bind(&self.has_food_allergy)
        .bind(&self.food_allergy_detail)
        .bind(&self.has_latex_allergy)
        .bind(&self.has_adhesive_allergy)
        .bind(&self.has_contrast_allergy)
        .bind(&self.allergy_severity)
        .bind(&self.adrenaline_auto_injector)
        .bind(&self.allergy_notes)
        .bind(self.bloods_sample_date)
        .bind(self.haemoglobin_g_per_l)
        .bind(self.mean_cell_volume_fl)
        .bind(self.ferritin_ug_per_l)
        .bind(self.transferrin_saturation_percent)
        .bind(self.vitamin_b12_ng_per_l)
        .bind(self.folate_ug_per_l)
        .bind(self.c_reactive_protein_mg_per_l)
        .bind(self.creatinine_umol_per_l)
        .bind(self.egfr_ml_per_min)
        .bind(&self.anaemia_known_cause)
        .bind(&self.anaemia_treatment_started)
        .bind(&self.anaemia_treatment_route)
        .bind(self.anaemia_treatment_start_date)
        .bind(&self.previous_transfusion)
        .bind(&self.group_and_save_done)
        .bind(&self.anaemia_notes)
        .bind(&self.diabetes_type)
        .bind(self.diabetes_duration_years)
        .bind(self.hba1c_mmol_per_mol)
        .bind(self.hba1c_sample_date)
        .bind(self.capillary_glucose_mmol_per_l)
        .bind(&self.diabetes_treatment)
        .bind(&self.insulin_regimen)
        .bind(&self.hypoglycaemia_awareness)
        .bind(&self.diabetes_team_review)
        .bind(self.diabetes_team_review_date)
        .bind(&self.foot_check_done)
        .bind(&self.glycaemic_notes)
        .bind(&self.smoking_status)
        .bind(self.cigarettes_per_day)
        .bind(self.pack_years)
        .bind(self.quit_date)
        .bind(&self.smoking_cessation_offered)
        .bind(&self.smoking_cessation_accepted)
        .bind(&self.nicotine_replacement)
        .bind(&self.vaping)
        .bind(&self.smoking_notes)
        .bind(self.alcohol_units_per_week)
        .bind(self.audit_c_frequency)
        .bind(self.audit_c_typical_quantity)
        .bind(self.audit_c_binge_frequency)
        .bind(&self.alcohol_dependence_features)
        .bind(&self.alcohol_reduction_plan_agreed)
        .bind(&self.alcohol_services_referral)
        .bind(&self.recreational_drug_use)
        .bind(&self.recreational_drug_detail)
        .bind(&self.alcohol_notes)
        .bind(self.height_as_cm)
        .bind(self.weight_as_kg)
        .bind(self.body_mass_index)
        .bind(self.usual_weight_as_kg)
        .bind(self.weight_loss_percent)
        .bind(&self.weight_loss_is_intentional)
        .bind(&self.acutely_ill)
        .bind(&self.no_nutritional_intake_over_5_days)
        .bind(&self.appetite)
        .bind(&self.oral_nutritional_supplements)
        .bind(&self.immunonutrition)
        .bind(&self.dietitian_referral)
        .bind(&self.nutrition_notes)
        .bind(&self.usual_activity_level)
        .bind(&self.climbs_flight_of_stairs)
        .bind(self.metabolic_equivalents)
        .bind(self.duke_activity_status_index)
        .bind(self.six_minute_walk_metres)
        .bind(self.cpet_anaerobic_threshold)
        .bind(self.cpet_peak_vo2)
        .bind(self.grip_strength_kg)
        .bind(&self.prehabilitation_offered)
        .bind(&self.prehabilitation_enrolled)
        .bind(self.prehabilitation_sessions_per_week)
        .bind(self.prehabilitation_start_date)
        .bind(&self.protein_supplementation_recommended)
        .bind(&self.fitness_notes)
        .bind(self.clinical_frailty_scale)
        .bind(&self.fried_weakness)
        .bind(&self.fried_slowness)
        .bind(&self.fried_low_physical_activity)
        .bind(&self.fried_exhaustion)
        .bind(&self.fried_unintentional_weight_loss)
        .bind(self.risk_analysis_index_score)
        .bind(&self.mini_cog_performed)
        .bind(self.mini_cog_score)
        .bind(&self.cognitive_screen_tool)
        .bind(self.cognitive_screen_score)
        .bind(&self.cognitive_impairment)
        .bind(&self.capacity_concern)
        .bind(self.falls_in_last_12_months)
        .bind(&self.mobility_aid)
        .bind(&self.living_situation)
        .bind(&self.care_package)
        .bind(&self.frailty_notes)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.heart_rate)
        .bind(&self.heart_rhythm)
        .bind(&self.murmur_present)
        .bind(&self.exercise_tolerance)
        .bind(self.ejection_fraction_percent)
        .bind(self.echo_date)
        .bind(&self.asthma_control)
        .bind(&self.copd_control)
        .bind(&self.inhaler_technique_checked)
        .bind(&self.rescue_steroids)
        .bind(self.spirometry_fev1_percent)
        .bind(self.stop_bang_score)
        .bind(&self.sleep_apnoea_diagnosis)
        .bind(&self.cpap_use)
        .bind(self.oxygen_saturation_percent)
        .bind(&self.cardiorespiratory_notes)
        .bind(&self.anxiety_level)
        .bind(&self.depression_screen)
        .bind(&self.understands_procedure)
        .bind(&self.expectations_realistic)
        .bind(&self.shared_decision_making_discussed)
        .bind(&self.has_carer)
        .bind(&self.transport_home_arranged)
        .bind(&self.support_after_discharge)
        .bind(&self.health_literacy)
        .bind(&self.psychological_support_offered)
        .bind(&self.social_notes)
        .bind(&self.plan_anaemia)
        .bind(&self.referral_anaemia)
        .bind(&self.plan_glycaemic_control)
        .bind(&self.referral_glycaemic_control)
        .bind(&self.plan_smoking)
        .bind(&self.referral_smoking)
        .bind(&self.plan_alcohol)
        .bind(&self.referral_alcohol)
        .bind(&self.plan_nutrition)
        .bind(&self.referral_nutrition)
        .bind(&self.plan_physical_fitness)
        .bind(&self.referral_physical_fitness)
        .bind(&self.plan_medication)
        .bind(&self.referral_medication)
        .bind(&self.plan_cardiorespiratory)
        .bind(&self.referral_cardiorespiratory)
        .bind(&self.responsible_clinician)
        .bind(&self.plan_agreed_with_patient)
        .bind(&self.plan_shared_with_patient)
        .bind(self.next_review_date)
        .bind(&self.plan_notes)
        .bind(&self.gate_decision)
        .bind(&self.additional_notes)
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
        .prefix("api/perioperative_optimizations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
