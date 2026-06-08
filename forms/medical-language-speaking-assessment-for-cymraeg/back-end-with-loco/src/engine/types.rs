//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// CEFR-mapped overall grade.
/// Empty string `''` means "ungraded" (no submission yet); for completed
/// assessments the grade is always one of "A", "B", "C+", "C", "D", "E".
pub type OetGrade = String;

/// Candidate details captured in Step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateDetails {
    /// Candidate ID.
    pub candidate_id: String,
    /// Candidate name.
    pub candidate_name: String,
    /// Examiner name.
    pub examiner_name: String,
    /// Test centre.
    pub test_centre: String,
    /// Test date.
    pub test_date: String,
    /// Profession.
    pub profession: String,
    /// First language.
    pub first_language: String,
    /// Country of training.
    pub country_of_training: String,
    /// Years of experience.
    pub years_of_experience: String,
}

/// Per-role-play scenario context (Steps 2 and 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RolePlayContext {
    /// Scenario title.
    pub scenario_title: String,
    /// Scenario summary.
    pub scenario_summary: String,
    /// Patient role.
    pub patient_role: String,
    /// Setting.
    pub setting: String,
    /// Safety criticality.
    pub safety_criticality: String,
    /// Examiner notes.
    pub examiner_notes: String,
}

/// Linguistic ratings 0-6, captured separately for each role-play.
/// Null means not yet rated.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinguisticRating {
    /// Fluency.
    pub fluency: Option<i32>,
    /// Grammar.
    pub grammar: Option<i32>,
    /// Pronunciation.
    pub pronunciation: Option<i32>,
    /// Clinical appropriateness.
    pub clinical_appropriateness: Option<i32>,
}

/// Clinical communication indicators 0-3, across the whole assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalIndicators {
    /// Relationship building.
    pub relationship_building: Option<i32>,
    /// Understanding patient perspective.
    pub understanding_patient_perspective: Option<i32>,
    /// Providing structure.
    pub providing_structure: Option<i32>,
    /// Information gathering.
    pub information_gathering: Option<i32>,
    /// Information giving.
    pub information_giving: Option<i32>,
    /// Examiner notes.
    pub examiner_notes: String,
}

/// Complete clinical Welsh-language speaking assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Candidate.
    pub candidate: CandidateDetails,
    /// Role play1.
    pub role_play1: RolePlayContext,
    /// Role play2.
    pub role_play2: RolePlayContext,
    /// Linguistic role play1.
    pub linguistic_role_play1: LinguisticRating,
    /// Linguistic role play2.
    pub linguistic_role_play2: LinguisticRating,
    /// Clinical indicators.
    pub clinical_indicators: ClinicalIndicators,
}

/// Per-criterion audit-trail row in the grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CriterionScore {
    /// ID.
    pub id: String,
    /// "linguistic" or "clinical".
    pub domain: String,
    /// Label.
    pub label: String,
    /// Max score.
    pub max_score: i32,
    /// Role play1 score.
    pub role_play1_score: Option<f64>,
    /// Role play2 score.
    pub role_play2_score: Option<f64>,
    /// Mean score.
    pub mean_score: Option<f64>,
}

/// A rule that "fired" during grading. For this form, each rated criterion
/// emits one FiredRule recording the criterion id, category, label, and
/// score actually used in the total.
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
    pub score: f64,
}

/// Examiner-facing safety / improvement flag (priority high|medium|low).
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

/// Pure scoring output from `cymraeg_grader::grade`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Linguistic total.
    pub linguistic_total: f64,
    /// Clinical total.
    pub clinical_total: f64,
    /// Raw total.
    pub raw_total: f64,
    /// Scaled score.
    pub scaled_score: i32,
    /// Grade.
    pub grade: OetGrade,
    /// Per criterion scores.
    pub per_criterion_scores: Vec<CriterionScore>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
}

/// Full grading + flags + timestamp persisted to the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingReport {
    /// Grading.
    pub grading: GradingResult,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
