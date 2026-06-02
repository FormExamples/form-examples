use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type Sex = String;
pub type AllergySeverity = String;
pub type MustRisk = String;
pub type SeverityLevel = String;
pub type FlagPriority = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub ethnicity: String,
    pub primary_language: String,
}

/// Step 2 — Anthropometric Measurements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnthropometricMeasurements {
    pub weight_kg: Option<f64>,
    pub height_cm: Option<f64>,
    pub bmi: Option<f64>,
    pub usual_weight_kg: Option<f64>,
    pub weight_loss_kg: Option<f64>,
    pub weight_loss_percent: Option<f64>,
    pub mid_upper_arm_circumference_cm: Option<f64>,
    pub triceps_skinfold_mm: Option<f64>,
    pub measurement_date: String,
}

/// Step 3 — Dietary History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DietaryHistory {
    pub typical_diet: String,
    pub diet_pattern: String,
    pub diet_pattern_other: String,
    pub meals_per_day: Option<i32>,
    pub snacks_per_day: Option<i32>,
    pub appetite_decreased: YesNo,
    pub appetite_change_notes: String,
    pub food_intake_reduced: YesNo,
    pub reduced_intake_days: Option<i32>,
    pub fluid_intake_adequate: YesNo,
    pub fluid_intake_ml_per_day: Option<i32>,
    pub alcohol_use: YesNo,
    pub alcohol_units_per_week: Option<i32>,
    pub cultural_religious_restrictions: YesNo,
    pub cultural_religious_details: String,
}

/// Step 4 — Nutritional Screening (MUST).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NutritionalScreening {
    pub bmi_category: String,
    pub weight_loss_category: String,
    pub acute_disease: String,
    pub unintentional_weight_loss: YesNo,
    pub reduced_appetite7_days: YesNo,
    pub additional_screening_notes: String,
}

/// Step 5 — Swallowing & Oral Health.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SwallowingOralHealth {
    pub swallowing_difficulty: YesNo,
    pub coughing_while_eating: YesNo,
    pub choking_episodes: YesNo,
    pub denture_use: YesNo,
    pub dentures_fit_well: YesNo,
    pub dental_pain: YesNo,
    pub mouth_sores: YesNo,
    pub dry_mouth: YesNo,
    pub taste_changes: YesNo,
    pub swallowing_notes: String,
}

/// Step 6 — Gastrointestinal Function.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GastrointestinalFunction {
    pub nausea: YesNo,
    pub vomiting: YesNo,
    pub diarrhea: YesNo,
    pub constipation: YesNo,
    pub abdominal_pain: YesNo,
    pub bloating: YesNo,
    pub reflux: YesNo,
    pub earlysatiety: YesNo,
    pub bowel_habit_notes: String,
}

/// One food allergy entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FoodAllergy {
    pub allergen: String,
    pub reaction: String,
    pub severity: AllergySeverity,
}

/// Step 7 — Food Allergies & Intolerances.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FoodAllergiesIntolerances {
    pub food_allergies: Vec<FoodAllergy>,
    pub food_intolerances: Vec<String>,
    pub lactose_intolerance: YesNo,
    pub gluten_intolerance: YesNo,
    pub allergy_testing_done: YesNo,
    pub allergy_test_results: String,
}

/// Step 8 — Nutritional Requirements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NutritionalRequirements {
    pub estimated_energy_kcal: Option<i32>,
    pub estimated_protein_g: Option<f64>,
    pub estimated_fluid_ml: Option<i32>,
    pub requirements_basis: String,
    pub increased_requirements: YesNo,
    pub increased_requirements_reason: String,
}

/// A supplement entry (oral nutritional supplement or vitamin/mineral).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Supplement {
    pub name: String,
    pub dose: String,
    pub frequency: String,
}

/// Step 9 — Current Nutritional Support.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentNutritionalSupport {
    pub oral_supplements: YesNo,
    pub oral_supplement_list: Vec<Supplement>,
    pub enteral_feeding: YesNo,
    pub enteral_route: String,
    pub enteral_formula: String,
    pub parenteral_nutrition: YesNo,
    pub parenteral_details: String,
    pub vitamin_mineral_supplements: YesNo,
    pub vitamin_mineral_list: Vec<Supplement>,
    pub dietician_involvement: YesNo,
    pub last_dietician_review_date: String,
}

/// Step 10 — Care Plan & Monitoring.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarePlanMonitoring {
    pub nutrition_goals: String,
    pub interventions_planned: String,
    pub weight_monitoring_planned: YesNo,
    pub weight_monitoring_frequency: String,
    pub food_intake_monitoring_planned: YesNo,
    pub referral_required: YesNo,
    pub referral_details: String,
    pub follow_up_date: String,
    pub additional_notes: String,
}

/// Full Nutrition Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub anthropometric_measurements: AnthropometricMeasurements,
    pub dietary_history: DietaryHistory,
    pub nutritional_screening: NutritionalScreening,
    pub swallowing_oral_health: SwallowingOralHealth,
    pub gastrointestinal_function: GastrointestinalFunction,
    pub food_allergies_intolerances: FoodAllergiesIntolerances,
    pub nutritional_requirements: NutritionalRequirements,
    pub current_nutritional_support: CurrentNutritionalSupport,
    pub care_plan_monitoring: CarePlanMonitoring,
}

/// A MUST rule that fired during grading. Score is the contribution to the
/// total MUST score (0-2 per rule).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// A clinician-facing safety flag computed independently of MUST score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: FlagPriority,
}

/// Grading output for a nutrition assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub must_score: i32,
    pub must_risk: MustRisk,
    pub severity: SeverityLevel,
    pub answered_count: i32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
