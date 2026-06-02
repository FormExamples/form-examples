use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type Sex = String;
pub type CombinedSeverity = String;
pub type SpaqBand = String;
pub type Phq9Band = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub latitude: String,
    pub country: String,
    pub years_at_current_latitude: Option<i32>,
}

/// Step 2 — Seasonal Pattern History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SeasonalPatternHistory {
    pub symptoms_recur_annually: YesNo,
    pub worst_months: String,
    pub best_months: String,
    pub years_affected: Option<i32>,
    pub family_history_sad: YesNo,
    pub first_onset_age: String,
}

/// PHQ-9 items (each scored 0-3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Phq9Items {
    pub q1: Option<i32>,
    pub q2: Option<i32>,
    pub q3: Option<i32>,
    pub q4: Option<i32>,
    pub q5: Option<i32>,
    pub q6: Option<i32>,
    pub q7: Option<i32>,
    pub q8: Option<i32>,
    pub q9: Option<i32>,
}

/// Step 3 — Current Mood (PHQ-9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMood {
    pub phq9: Phq9Items,
    pub difficulty_level: String,
}

/// SPAQ sleep / energy sub-block.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaqSleep {
    pub sleep_length: Option<i32>,
    pub energy_level: Option<i32>,
}

/// Step 4 — Sleep & Energy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SleepEnergy {
    pub spaq: SpaqSleep,
    pub hours_slept_winter: Option<f64>,
    pub hours_slept_summer: Option<f64>,
    pub hypersomnia: YesNo,
    pub morning_fatigue: YesNo,
    pub energy_notes: String,
}

/// SPAQ appetite / weight sub-block.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaqAppetite {
    pub appetite: Option<i32>,
    pub weight: Option<i32>,
}

/// Step 5 — Appetite & Weight.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppetiteWeight {
    pub spaq: SpaqAppetite,
    pub carbohydrate_craving: YesNo,
    pub winter_weight_change_kg: Option<f64>,
    pub eating_pattern_changes: String,
}

/// SPAQ social / mood sub-block.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaqSocial {
    pub mood: Option<i32>,
    pub social_activity: Option<i32>,
}

/// Step 6 — Social & Occupational Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialOccupational {
    pub spaq: SpaqSocial,
    pub work_impaired: YesNo,
    pub relationships_impaired: YesNo,
    pub social_withdrawal: YesNo,
    pub occupational_notes: String,
}

/// Step 7 — Light Exposure.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LightExposure {
    pub daily_outdoor_minutes: Option<i32>,
    pub work_indoors: YesNo,
    pub curtains_closed_daytime: YesNo,
    pub sunrise_exposure: YesNo,
    pub uses_light_therapy_box: YesNo,
    pub light_therapy_details: String,
    pub light_therapy_access: YesNo,
}

/// Step 8 — Previous Treatments.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatments {
    pub antidepressants: YesNo,
    pub antidepressant_details: String,
    pub psychotherapy: YesNo,
    pub psychotherapy_details: String,
    pub light_therapy_history: YesNo,
    pub light_therapy_history_details: String,
    pub current_treatment: YesNo,
    pub current_treatment_details: String,
}

/// Step 9 — Risk Assessment (Self-harm).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskAssessment {
    pub suicidal_ideation: YesNo,
    pub suicidal_intent: YesNo,
    pub suicidal_plan: String,
    pub self_harm: YesNo,
    pub self_harm_details: String,
    pub previous_attempt: YesNo,
    pub protective_factors: String,
    pub safety_plan_in_place: YesNo,
}

/// Step 10 — Treatment Plan & Monitoring.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentPlan {
    pub plan_light_therapy: YesNo,
    pub plan_antidepressant: YesNo,
    pub plan_psychotherapy: YesNo,
    pub plan_lifestyle: YesNo,
    pub plan_crisis_referral: YesNo,
    pub follow_up_interval: String,
    pub clinician_notes: String,
}

/// Full Seasonal Affective Disorder Assessment data record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub seasonal_pattern_history: SeasonalPatternHistory,
    pub current_mood: CurrentMood,
    pub sleep_energy: SleepEnergy,
    pub appetite_weight: AppetiteWeight,
    pub social_occupational: SocialOccupational,
    pub light_exposure: LightExposure,
    pub previous_treatments: PreviousTreatments,
    pub risk_assessment: RiskAssessment,
    pub treatment_plan: TreatmentPlan,
}

/// A SPAQ or PHQ-9 item that fired during grading (i.e. was answered).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// A safety flag computed independently of numeric grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub spaq_score: i32,
    pub spaq_band: SpaqBand,
    pub phq9_score: i32,
    pub phq9_band: Phq9Band,
    pub combined_severity: CombinedSeverity,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
