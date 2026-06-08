//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Combined severity.
pub type CombinedSeverity = String;
/// Spaq band.
pub type SpaqBand = String;
/// Phq9 band.
pub type Phq9Band = String;

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
    /// Latitude.
    pub latitude: String,
    /// Country.
    pub country: String,
    /// Years at current latitude.
    pub years_at_current_latitude: Option<i32>,
}

/// Step 2 — Seasonal Pattern History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SeasonalPatternHistory {
    /// Symptoms recur annually.
    pub symptoms_recur_annually: YesNo,
    /// Worst months.
    pub worst_months: String,
    /// Best months.
    pub best_months: String,
    /// Years affected.
    pub years_affected: Option<i32>,
    /// Family history sad.
    pub family_history_sad: YesNo,
    /// First onset age.
    pub first_onset_age: String,
}

/// PHQ-9 items (each scored 0-3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Phq9Items {
    /// Q1.
    pub q1: Option<i32>,
    /// Q2.
    pub q2: Option<i32>,
    /// Q3.
    pub q3: Option<i32>,
    /// Q4.
    pub q4: Option<i32>,
    /// Q5.
    pub q5: Option<i32>,
    /// Q6.
    pub q6: Option<i32>,
    /// Q7.
    pub q7: Option<i32>,
    /// Q8.
    pub q8: Option<i32>,
    /// Q9.
    pub q9: Option<i32>,
}

/// Step 3 — Current Mood (PHQ-9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMood {
    /// Phq9.
    pub phq9: Phq9Items,
    /// Difficulty level.
    pub difficulty_level: String,
}

/// SPAQ sleep / energy sub-block.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaqSleep {
    /// Sleep length.
    pub sleep_length: Option<i32>,
    /// Energy level.
    pub energy_level: Option<i32>,
}

/// Step 4 — Sleep & Energy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SleepEnergy {
    /// Spaq.
    pub spaq: SpaqSleep,
    /// Hours slept winter.
    pub hours_slept_winter: Option<f64>,
    /// Hours slept summer.
    pub hours_slept_summer: Option<f64>,
    /// Hypersomnia.
    pub hypersomnia: YesNo,
    /// Morning fatigue.
    pub morning_fatigue: YesNo,
    /// Energy notes.
    pub energy_notes: String,
}

/// SPAQ appetite / weight sub-block.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaqAppetite {
    /// Appetite.
    pub appetite: Option<i32>,
    /// Weight.
    pub weight: Option<i32>,
}

/// Step 5 — Appetite & Weight.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppetiteWeight {
    /// Spaq.
    pub spaq: SpaqAppetite,
    /// Carbohydrate craving.
    pub carbohydrate_craving: YesNo,
    /// Winter weight change kg.
    pub winter_weight_change_kg: Option<f64>,
    /// Eating pattern changes.
    pub eating_pattern_changes: String,
}

/// SPAQ social / mood sub-block.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaqSocial {
    /// Mood.
    pub mood: Option<i32>,
    /// Social activity.
    pub social_activity: Option<i32>,
}

/// Step 6 — Social & Occupational Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialOccupational {
    /// Spaq.
    pub spaq: SpaqSocial,
    /// Work impaired.
    pub work_impaired: YesNo,
    /// Relationships impaired.
    pub relationships_impaired: YesNo,
    /// Social withdrawal.
    pub social_withdrawal: YesNo,
    /// Occupational notes.
    pub occupational_notes: String,
}

/// Step 7 — Light Exposure.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LightExposure {
    /// Daily outdoor minutes.
    pub daily_outdoor_minutes: Option<i32>,
    /// Work indoors.
    pub work_indoors: YesNo,
    /// Curtains closed daytime.
    pub curtains_closed_daytime: YesNo,
    /// Sunrise exposure.
    pub sunrise_exposure: YesNo,
    /// Uses light therapy box.
    pub uses_light_therapy_box: YesNo,
    /// Light therapy details.
    pub light_therapy_details: String,
    /// Light therapy access.
    pub light_therapy_access: YesNo,
}

/// Step 8 — Previous Treatments.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatments {
    /// Antidepressants.
    pub antidepressants: YesNo,
    /// Antidepressant details.
    pub antidepressant_details: String,
    /// Psychotherapy.
    pub psychotherapy: YesNo,
    /// Psychotherapy details.
    pub psychotherapy_details: String,
    /// Light therapy history.
    pub light_therapy_history: YesNo,
    /// Light therapy history details.
    pub light_therapy_history_details: String,
    /// Current treatment.
    pub current_treatment: YesNo,
    /// Current treatment details.
    pub current_treatment_details: String,
}

/// Step 9 — Risk Assessment (Self-harm).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskAssessment {
    /// Suicidal ideation.
    pub suicidal_ideation: YesNo,
    /// Suicidal intent.
    pub suicidal_intent: YesNo,
    /// Suicidal plan.
    pub suicidal_plan: String,
    /// Self harm.
    pub self_harm: YesNo,
    /// Self harm details.
    pub self_harm_details: String,
    /// Previous attempt.
    pub previous_attempt: YesNo,
    /// Protective factors.
    pub protective_factors: String,
    /// Safety plan in place.
    pub safety_plan_in_place: YesNo,
}

/// Step 10 — Treatment Plan & Monitoring.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentPlan {
    /// Plan light therapy.
    pub plan_light_therapy: YesNo,
    /// Plan antidepressant.
    pub plan_antidepressant: YesNo,
    /// Plan psychotherapy.
    pub plan_psychotherapy: YesNo,
    /// Plan lifestyle.
    pub plan_lifestyle: YesNo,
    /// Plan crisis referral.
    pub plan_crisis_referral: YesNo,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Clinician notes.
    pub clinician_notes: String,
}

/// Full Seasonal Affective Disorder Assessment data record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Seasonal pattern history.
    pub seasonal_pattern_history: SeasonalPatternHistory,
    /// Current mood.
    pub current_mood: CurrentMood,
    /// Sleep energy.
    pub sleep_energy: SleepEnergy,
    /// Appetite weight.
    pub appetite_weight: AppetiteWeight,
    /// Social occupational.
    pub social_occupational: SocialOccupational,
    /// Light exposure.
    pub light_exposure: LightExposure,
    /// Previous treatments.
    pub previous_treatments: PreviousTreatments,
    /// Risk assessment.
    pub risk_assessment: RiskAssessment,
    /// Treatment plan.
    pub treatment_plan: TreatmentPlan,
}

/// A SPAQ or PHQ-9 item that fired during grading (i.e. was answered).
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

/// A safety flag computed independently of numeric grading.
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
    pub priority: String,
}

/// Grading output for an assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Spaq score.
    pub spaq_score: i32,
    /// Spaq band.
    pub spaq_band: SpaqBand,
    /// Phq9 score.
    pub phq9_score: i32,
    /// Phq9 band.
    pub phq9_band: Phq9Band,
    /// Combined severity.
    pub combined_severity: CombinedSeverity,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
