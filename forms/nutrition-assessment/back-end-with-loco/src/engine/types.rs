//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Allergy severity.
pub type AllergySeverity = String;
/// Must risk.
pub type MustRisk = String;
/// Severity level.
pub type SeverityLevel = String;
/// Flag priority.
pub type FlagPriority = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Ethnicity.
    pub ethnicity: String,
    /// Primary language.
    pub primary_language: String,
}

/// Step 2 — Anthropometric Measurements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnthropometricMeasurements {
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Usual weight kg.
    pub usual_weight_kg: Option<f64>,
    /// Weight loss kg.
    pub weight_loss_kg: Option<f64>,
    /// Weight loss percent.
    pub weight_loss_percent: Option<f64>,
    /// Mid upper arm circumference cm.
    pub mid_upper_arm_circumference_cm: Option<f64>,
    /// Triceps skinfold mm.
    pub triceps_skinfold_mm: Option<f64>,
    /// Measurement date.
    pub measurement_date: String,
}

/// Step 3 — Dietary History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DietaryHistory {
    /// Typical diet.
    pub typical_diet: String,
    /// Diet pattern.
    pub diet_pattern: String,
    /// Diet pattern other.
    pub diet_pattern_other: String,
    /// Meals per day.
    pub meals_per_day: Option<i32>,
    /// Snacks per day.
    pub snacks_per_day: Option<i32>,
    /// Appetite decreased.
    pub appetite_decreased: YesNo,
    /// Appetite change notes.
    pub appetite_change_notes: String,
    /// Food intake reduced.
    pub food_intake_reduced: YesNo,
    /// Reduced intake days.
    pub reduced_intake_days: Option<i32>,
    /// Fluid intake adequate.
    pub fluid_intake_adequate: YesNo,
    /// Fluid intake ml per day.
    pub fluid_intake_ml_per_day: Option<i32>,
    /// Alcohol use.
    pub alcohol_use: YesNo,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<i32>,
    /// Cultural religious restrictions.
    pub cultural_religious_restrictions: YesNo,
    /// Cultural religious details.
    pub cultural_religious_details: String,
}

/// Step 4 — Nutritional Screening (MUST).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NutritionalScreening {
    /// BMI category.
    pub bmi_category: String,
    /// Weight loss category.
    pub weight_loss_category: String,
    /// Acute disease.
    pub acute_disease: String,
    /// Unintentional weight loss.
    pub unintentional_weight_loss: YesNo,
    /// Reduced appetite7 days.
    pub reduced_appetite7_days: YesNo,
    /// Additional screening notes.
    pub additional_screening_notes: String,
}

/// Step 5 — Swallowing & Oral Health.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SwallowingOralHealth {
    /// Swallowing difficulty.
    pub swallowing_difficulty: YesNo,
    /// Coughing while eating.
    pub coughing_while_eating: YesNo,
    /// Choking episodes.
    pub choking_episodes: YesNo,
    /// Denture use.
    pub denture_use: YesNo,
    /// Dentures fit well.
    pub dentures_fit_well: YesNo,
    /// Dental pain.
    pub dental_pain: YesNo,
    /// Mouth sores.
    pub mouth_sores: YesNo,
    /// Dry mouth.
    pub dry_mouth: YesNo,
    /// Taste changes.
    pub taste_changes: YesNo,
    /// Swallowing notes.
    pub swallowing_notes: String,
}

/// Step 6 — Gastrointestinal Function.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GastrointestinalFunction {
    /// Nausea.
    pub nausea: YesNo,
    /// Vomiting.
    pub vomiting: YesNo,
    /// Diarrhea.
    pub diarrhea: YesNo,
    /// Constipation.
    pub constipation: YesNo,
    /// Abdominal pain.
    pub abdominal_pain: YesNo,
    /// Bloating.
    pub bloating: YesNo,
    /// Reflux.
    pub reflux: YesNo,
    /// Earlysatiety.
    pub earlysatiety: YesNo,
    /// Bowel habit notes.
    pub bowel_habit_notes: String,
}

/// One food allergy entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FoodAllergy {
    /// Allergen.
    pub allergen: String,
    /// Reaction.
    pub reaction: String,
    /// Severity.
    pub severity: AllergySeverity,
}

/// Step 7 — Food Allergies & Intolerances.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FoodAllergiesIntolerances {
    /// Food allergies.
    pub food_allergies: Vec<FoodAllergy>,
    /// Food intolerances.
    pub food_intolerances: Vec<String>,
    /// Lactose intolerance.
    pub lactose_intolerance: YesNo,
    /// Gluten intolerance.
    pub gluten_intolerance: YesNo,
    /// Allergy testing done.
    pub allergy_testing_done: YesNo,
    /// Allergy test results.
    pub allergy_test_results: String,
}

/// Step 8 — Nutritional Requirements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NutritionalRequirements {
    /// Estimated energy kcal.
    pub estimated_energy_kcal: Option<i32>,
    /// Estimated protein g.
    pub estimated_protein_g: Option<f64>,
    /// Estimated fluid ml.
    pub estimated_fluid_ml: Option<i32>,
    /// Requirements basis.
    pub requirements_basis: String,
    /// Increased requirements.
    pub increased_requirements: YesNo,
    /// Increased requirements reason.
    pub increased_requirements_reason: String,
}

/// A supplement entry (oral nutritional supplement or vitamin/mineral).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Supplement {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
}

/// Step 9 — Current Nutritional Support.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentNutritionalSupport {
    /// Oral supplements.
    pub oral_supplements: YesNo,
    /// Oral supplement list.
    pub oral_supplement_list: Vec<Supplement>,
    /// Enteral feeding.
    pub enteral_feeding: YesNo,
    /// Enteral route.
    pub enteral_route: String,
    /// Enteral formula.
    pub enteral_formula: String,
    /// Parenteral nutrition.
    pub parenteral_nutrition: YesNo,
    /// Parenteral details.
    pub parenteral_details: String,
    /// Vitamin mineral supplements.
    pub vitamin_mineral_supplements: YesNo,
    /// Vitamin mineral list.
    pub vitamin_mineral_list: Vec<Supplement>,
    /// Dietician involvement.
    pub dietician_involvement: YesNo,
    /// Last dietician review date.
    pub last_dietician_review_date: String,
}

/// Step 10 — Care Plan & Monitoring.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarePlanMonitoring {
    /// Nutrition goals.
    pub nutrition_goals: String,
    /// Interventions planned.
    pub interventions_planned: String,
    /// Weight monitoring planned.
    pub weight_monitoring_planned: YesNo,
    /// Weight monitoring frequency.
    pub weight_monitoring_frequency: String,
    /// Food intake monitoring planned.
    pub food_intake_monitoring_planned: YesNo,
    /// Referral required.
    pub referral_required: YesNo,
    /// Referral details.
    pub referral_details: String,
    /// Follow up date.
    pub follow_up_date: String,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full Nutrition Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Anthropometric measurements.
    pub anthropometric_measurements: AnthropometricMeasurements,
    /// Dietary history.
    pub dietary_history: DietaryHistory,
    /// Nutritional screening.
    pub nutritional_screening: NutritionalScreening,
    /// Swallowing oral health.
    pub swallowing_oral_health: SwallowingOralHealth,
    /// Gastrointestinal function.
    pub gastrointestinal_function: GastrointestinalFunction,
    /// Food allergies intolerances.
    pub food_allergies_intolerances: FoodAllergiesIntolerances,
    /// Nutritional requirements.
    pub nutritional_requirements: NutritionalRequirements,
    /// Current nutritional support.
    pub current_nutritional_support: CurrentNutritionalSupport,
    /// Care plan monitoring.
    pub care_plan_monitoring: CarePlanMonitoring,
}

/// A MUST rule that fired during grading. Score is the contribution to the
/// total MUST score (0-2 per rule).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
}

/// A clinician-facing safety flag computed independently of MUST score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: FlagPriority,
}

/// Grading output for a nutrition assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Must score.
    pub must_score: i32,
    /// Must risk.
    pub must_risk: MustRisk,
    /// Severity.
    pub severity: SeverityLevel,
    /// Answered count.
    pub answered_count: i32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
