//! dietic_assessments model.

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
    pub setting: String,
    pub appointment_type: String,
    pub planned_duration_minutes: Option<i32>,
    pub interpreter_required: String,
    pub interpreter_language: String,
    pub referral_source: String,
    pub referral_date: Option<Date>,
    pub referral_reason: String,
    pub primary_condition: String,
    pub consent_to_record: String,
    pub accompanied_by: String,
    pub condition_diabetes: String,
    pub condition_coeliac: String,
    pub condition_inflammatory_bowel_disease: String,
    pub condition_chronic_kidney_disease: String,
    pub condition_liver_disease: String,
    pub condition_cancer: String,
    pub condition_cardiovascular_disease: String,
    pub condition_respiratory_disease: String,
    pub condition_stroke: String,
    pub condition_dementia: String,
    pub condition_eating_disorder: String,
    pub condition_other: String,
    pub recent_surgery: String,
    pub recent_surgery_type: String,
    pub recent_surgery_date: Option<Date>,
    pub gastrointestinal_surgery: String,
    pub current_symptoms: String,
    pub family_history: String,
    pub pregnancy_status: String,
    pub takes_prescription_medicines: String,
    pub takes_over_the_counter_medicines: String,
    pub takes_vitamin_supplements: String,
    pub takes_mineral_supplements: String,
    pub takes_herbal_products: String,
    pub takes_oral_nutritional_supplements: String,
    pub oral_nutritional_supplement_detail: String,
    pub enteral_nutrition: String,
    pub enteral_route: String,
    pub enteral_tube_problem: String,
    pub parenteral_nutrition: String,
    pub drug_nutrient_interaction: String,
    pub drug_nutrient_interaction_detail: String,
    pub medication_adherence: String,
    pub medication_notes: String,
    pub measurement_method: String,
    pub height_as_cm: Option<f64>,
    pub weight_as_kg: Option<f64>,
    pub body_mass_index: Option<f64>,
    pub mid_upper_arm_circumference_as_cm: Option<f64>,
    pub calf_circumference_as_cm: Option<f64>,
    pub waist_as_cm: Option<f64>,
    pub usual_weight_as_kg: Option<f64>,
    pub weight_3_months_ago_as_kg: Option<f64>,
    pub weight_6_months_ago_as_kg: Option<f64>,
    pub weight_loss_percent: Option<f64>,
    pub weight_loss_is_intentional: String,
    pub weight_trend: String,
    pub clothes_or_jewellery_looser: String,
    pub oedema_present: String,
    pub oedema_adjustment_kg: Option<f64>,
    pub ascites_present: String,
    pub amputation_present: String,
    pub amputation_adjustment_percent: Option<f64>,
    pub anthropometry_notes: String,
    pub bloods_sample_date: Option<Date>,
    pub albumin_g_per_l: Option<f64>,
    pub c_reactive_protein_mg_per_l: Option<f64>,
    pub haemoglobin_g_per_l: Option<f64>,
    pub ferritin_ug_per_l: Option<f64>,
    pub vitamin_b12_ng_per_l: Option<f64>,
    pub folate_ug_per_l: Option<f64>,
    pub vitamin_d_nmol_per_l: Option<f64>,
    pub hba1c_mmol_per_mol: Option<f64>,
    pub sodium_mmol_per_l: Option<f64>,
    pub potassium_mmol_per_l: Option<f64>,
    pub magnesium_mmol_per_l: Option<f64>,
    pub phosphate_mmol_per_l: Option<f64>,
    pub corrected_calcium_mmol_per_l: Option<f64>,
    pub urea_mmol_per_l: Option<f64>,
    pub creatinine_umol_per_l: Option<f64>,
    pub egfr_ml_per_min: Option<f64>,
    pub alanine_aminotransferase_u_per_l: Option<f64>,
    pub bilirubin_umol_per_l: Option<f64>,
    pub total_cholesterol_mmol_per_l: Option<f64>,
    pub triglycerides_mmol_per_l: Option<f64>,
    pub biochemistry_notes: String,
    pub subcutaneous_fat_loss: String,
    pub muscle_wasting_temples: String,
    pub muscle_wasting_clavicles: String,
    pub muscle_wasting_quadriceps: String,
    pub muscle_wasting_severity: String,
    pub peripheral_oedema_severity: String,
    pub oral_health: String,
    pub dentition: String,
    pub chewing_ability: String,
    pub tongue_and_mucosa: String,
    pub skin_condition: String,
    pub hair_condition: String,
    pub nail_condition: String,
    pub pressure_ulcer_present: String,
    pub pressure_ulcer_category: String,
    pub hand_grip_strength_kg: Option<f64>,
    pub physical_exam_notes: String,
    pub meals_per_day: Option<i32>,
    pub snacks_per_day: Option<i32>,
    pub recall_breakfast: String,
    pub recall_mid_morning: String,
    pub recall_lunch: String,
    pub recall_afternoon: String,
    pub recall_dinner: String,
    pub recall_evening: String,
    pub portion_size: String,
    pub appetite: String,
    pub appetite_score_0_10: Option<i32>,
    pub proportion_of_usual_intake_percent: Option<i32>,
    pub meals_out_per_week: Option<i32>,
    pub takeaways_per_week: Option<i32>,
    pub food_diary_completed: String,
    pub estimated_energy_intake_kcal: Option<i32>,
    pub estimated_protein_intake_g: Option<i32>,
    pub eats_alone: String,
    pub dietary_recall_notes: String,
    pub fluid_intake_ml_per_day: Option<i32>,
    pub fluid_types: String,
    pub caffeinated_drinks_per_day: Option<i32>,
    pub alcohol_units_per_week: Option<f64>,
    pub thickened_fluids: String,
    pub thickened_fluids_iddsi_level: String,
    pub hydration_signs: String,
    pub fluid_restriction: String,
    pub fluid_restriction_ml_per_day: Option<i32>,
    pub hydration_notes: String,
    pub has_food_allergy: String,
    pub has_food_intolerance: String,
    pub foods_avoided: String,
    pub avoidance_reason: String,
    pub dislikes: String,
    pub therapeutic_diet: String,
    pub dietary_pattern: String,
    pub religious_or_cultural_requirement: String,
    pub fasting_practice: String,
    pub texture_modified_diet: String,
    pub texture_modified_iddsi_level: String,
    pub preferences_notes: String,
    pub appetite_change: String,
    pub early_satiety: String,
    pub nausea: String,
    pub vomiting: String,
    pub dysphagia: String,
    pub dysphagia_screen_outcome: String,
    pub speech_and_language_therapy: String,
    pub reflux: String,
    pub abdominal_pain: String,
    pub bloating: String,
    pub bowel_frequency_per_week: Option<i32>,
    pub bristol_stool_type: String,
    pub constipation: String,
    pub diarrhoea: String,
    pub stoma_present: String,
    pub stoma_output_ml_per_day: Option<i32>,
    pub malabsorption_signs: String,
    pub gastrointestinal_notes: String,
    pub living_situation: String,
    pub who_shops: String,
    pub who_cooks: String,
    pub cooking_skills: String,
    pub cooking_confidence_0_10: Option<i32>,
    pub has_cooker: String,
    pub has_fridge: String,
    pub has_freezer: String,
    pub has_microwave: String,
    pub food_budget_per_week: Option<f64>,
    pub worried_food_would_run_out: String,
    pub skipped_meals_for_money: String,
    pub uses_food_bank: String,
    pub access_to_shops: String,
    pub has_transport: String,
    pub work_pattern: String,
    pub meal_support: String,
    pub social_support: String,
    pub environment_notes: String,
    pub activity_level: String,
    pub exercise_type: String,
    pub exercise_minutes_per_week: Option<i32>,
    pub sedentary_hours_per_day: Option<f64>,
    pub mobility: String,
    pub falls_in_last_12_months: Option<i32>,
    pub sarcf_strength: Option<i32>,
    pub sarcf_walking: Option<i32>,
    pub sarcf_rising_from_chair: Option<i32>,
    pub sarcf_climbing_stairs: Option<i32>,
    pub sarcf_falls: Option<i32>,
    pub eats_independently: String,
    pub feeding_assistance_required: String,
    pub function_notes: String,
    pub motivation_0_10: Option<i32>,
    pub stage_of_change: String,
    pub self_efficacy_0_10: Option<i32>,
    pub previous_attempts: String,
    pub barriers: String,
    pub scoff_make_yourself_sick: String,
    pub scoff_lost_control: String,
    pub scoff_lost_one_stone: String,
    pub scoff_believe_yourself_fat: String,
    pub scoff_food_dominates: String,
    pub mood: String,
    pub anxiety: String,
    pub cognitive_impairment: String,
    pub capacity_concern: String,
    pub safeguarding_concern: String,
    pub health_literacy: String,
    pub preferred_learning_style: String,
    pub patient_goal_in_own_words: String,
    pub acutely_ill: String,
    pub no_nutritional_intake_over_5_days: String,
    pub days_of_negligible_intake: Option<i32>,
    pub nrs_2002_score: Option<i32>,
    pub energy_requirement_kcal: Option<i32>,
    pub protein_requirement_g: Option<i32>,
    pub fluid_requirement_ml: Option<i32>,
    pub requirement_equation: String,
    pub pes_problem: String,
    pub pes_etiology: String,
    pub pes_signs_symptoms: String,
    pub intervention_type: String,
    pub prescribed_supplement: String,
    pub prescribed_supplement_dose: String,
    pub texture_modification_plan: String,
    pub goal_1: String,
    pub goal_2: String,
    pub goal_3: String,
    pub education_provided: String,
    pub resources_given: String,
    pub monitoring_indicators: String,
    pub review_interval_weeks: Option<i32>,
    pub review_date: Option<Date>,
    pub onward_referral: String,
    pub additional_notes: String,
    pub patient_id: Uuid,
    pub dietitian_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM dietic_assessments WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM dietic_assessments WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM dietic_assessments WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE dietic_assessments SET deleted_at = now(), updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS \
            (UPDATE dietic_assessment_grades SET deleted_at = now(), updated_at = now() \
            WHERE dietic_assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE dietic_assessment_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE dietic_assessment_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE dietic_assessment_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE dietic_assessment_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
