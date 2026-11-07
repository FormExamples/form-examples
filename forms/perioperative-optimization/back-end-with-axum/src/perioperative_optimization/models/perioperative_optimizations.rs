//! perioperative_optimizations model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM perioperative_optimizations WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM perioperative_optimizations WHERE deleted_at IS NULL",
        )
        .fetch_one(db)
        .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as(
            "SELECT * FROM perioperative_optimizations WHERE id = $1 AND deleted_at IS \
            NULL",
        )
        .bind(id)
        .fetch_optional(db)
        .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query(
            "WITH target AS (UPDATE perioperative_optimizations SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE perioperative_optimization_grades SET deleted_at = now(), \
            updated_at = now() WHERE perioperative_optimization_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            perioperative_optimization_grade_domains SET deleted_at = now(), updated_at \
            = now() WHERE perioperative_optimization_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            perioperative_optimization_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE perioperative_optimization_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
