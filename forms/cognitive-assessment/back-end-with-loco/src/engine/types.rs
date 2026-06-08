//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Impairment level.
pub type ImpairmentLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Education level.
    pub education_level: String,
    /// Primary language.
    pub primary_language: String,
    /// Handedness.
    pub handedness: String,
    /// Assessment date.
    pub assessment_date: String,
}

// ─── Cognitive History (Step 2) ─────────────────────────────

/// Cognitive history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveHistory {
    /// Reason for referral.
    pub reason_for_referral: String,
    /// Onset of symptoms.
    pub onset_of_symptoms: String,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Rate of decline.
    pub rate_of_decline: String,
    /// Family history dementia.
    pub family_history_dementia: String,
    /// Previous cognitive testing.
    pub previous_cognitive_testing: String,
    /// Relevant medical conditions.
    pub relevant_medical_conditions: String,
    /// Current medications.
    pub current_medications: String,
}

// ─── Orientation (Step 3) ───────────────────────────────────

/// Orientation.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Orientation {
    /// Orientation year.
    pub orientation_year: Option<u8>,
    /// Orientation season.
    pub orientation_season: Option<u8>,
    /// Orientation date.
    pub orientation_date: Option<u8>,
    /// Orientation day.
    pub orientation_day: Option<u8>,
    /// Orientation month.
    pub orientation_month: Option<u8>,
    /// Orientation country.
    pub orientation_country: Option<u8>,
    /// Orientation county.
    pub orientation_county: Option<u8>,
    /// Orientation city.
    pub orientation_city: Option<u8>,
    /// Orientation building.
    pub orientation_building: Option<u8>,
    /// Orientation floor.
    pub orientation_floor: Option<u8>,
}

// ─── Registration & Attention (Step 4) ──────────────────────

/// Registration attention.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RegistrationAttention {
    /// Registration word1.
    pub registration_word1: Option<u8>,
    /// Registration word2.
    pub registration_word2: Option<u8>,
    /// Registration word3.
    pub registration_word3: Option<u8>,
    /// Serial sevens 1.
    pub serial_sevens_1: Option<u8>,
    /// Serial sevens 2.
    pub serial_sevens_2: Option<u8>,
    /// Serial sevens 3.
    pub serial_sevens_3: Option<u8>,
    /// Serial sevens 4.
    pub serial_sevens_4: Option<u8>,
    /// Serial sevens 5.
    pub serial_sevens_5: Option<u8>,
}

// ─── Recall (Step 5) ───────────────────────────────────────

/// Recall.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Recall {
    /// Recall word1.
    pub recall_word1: Option<u8>,
    /// Recall word2.
    pub recall_word2: Option<u8>,
    /// Recall word3.
    pub recall_word3: Option<u8>,
    /// Recall strategy.
    pub recall_strategy: String,
    /// Recall delay minutes.
    pub recall_delay_minutes: String,
}

// ─── Language (Step 6) ──────────────────────────────────────

/// Language.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Language {
    /// Naming pencil.
    pub naming_pencil: Option<u8>,
    /// Naming watch.
    pub naming_watch: Option<u8>,
    /// Repetition.
    pub repetition: Option<u8>,
    /// Three stage command.
    pub three_stage_command: Option<u8>,
    /// Reading command.
    pub reading_command: Option<u8>,
    /// Writing sentence.
    pub writing_sentence: Option<u8>,
}

// ─── Visuospatial (Step 7) ──────────────────────────────────

/// Visuospatial.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Visuospatial {
    /// Copy pentagons.
    pub copy_pentagons: Option<u8>,
    /// Clock drawing contour.
    pub clock_drawing_contour: Option<u8>,
    /// Clock drawing numbers.
    pub clock_drawing_numbers: Option<u8>,
    /// Clock drawing hands.
    pub clock_drawing_hands: Option<u8>,
    /// Cube copy.
    pub cube_copy: Option<u8>,
    /// Trail making.
    pub trail_making: Option<u8>,
}

// ─── Executive Function (Step 8) ────────────────────────────

/// Executive function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ExecutiveFunction {
    /// Verbal fluency score.
    pub verbal_fluency_score: Option<u8>,
    /// Abstraction 1.
    pub abstraction_1: Option<u8>,
    /// Abstraction 2.
    pub abstraction_2: Option<u8>,
    /// Digit span forward.
    pub digit_span_forward: Option<u8>,
    /// Digit span backward.
    pub digit_span_backward: Option<u8>,
    /// Inhibition task.
    pub inhibition_task: Option<u8>,
}

// ─── Functional Assessment (Step 9) ─────────────────────────

/// Functional assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalAssessment {
    /// Medication management.
    pub medication_management: Option<u8>,
    /// Financial management.
    pub financial_management: Option<u8>,
    /// Meal preparation.
    pub meal_preparation: Option<u8>,
    /// Transport ability.
    pub transport_ability: Option<u8>,
    /// Housekeeping.
    pub housekeeping: Option<u8>,
    /// Personal hygiene.
    pub personal_hygiene: Option<u8>,
    /// Safety awareness.
    pub safety_awareness: Option<u8>,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Assessor name.
    pub assessor_name: String,
    /// Assessor role.
    pub assessor_role: String,
    /// Assessment environment.
    pub assessment_environment: String,
    /// Patient cooperation.
    pub patient_cooperation: String,
    /// Sensory impairments.
    pub sensory_impairments: String,
    /// Clinical impression.
    pub clinical_impression: String,
    /// Recommended follow up.
    pub recommended_follow_up: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Cognitive history.
    pub cognitive_history: CognitiveHistory,
    /// Orientation.
    pub orientation: Orientation,
    /// Registration attention.
    pub registration_attention: RegistrationAttention,
    /// Recall.
    pub recall: Recall,
    /// Language.
    pub language: Language,
    /// Visuospatial.
    pub visuospatial: Visuospatial,
    /// Executive function.
    pub executive_function: ExecutiveFunction,
    /// Functional assessment.
    pub functional_assessment: FunctionalAssessment,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
}

/// Additional flag.
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

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Impairment level.
    pub impairment_level: ImpairmentLevel,
    /// Mmse score.
    pub mmse_score: u8,
    /// Moca score.
    pub moca_score: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
