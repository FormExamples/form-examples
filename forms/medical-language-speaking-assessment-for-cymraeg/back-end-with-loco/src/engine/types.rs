use serde::{Deserialize, Serialize};

/// CEFR-mapped overall grade.
/// Empty string `''` means "ungraded" (no submission yet); for completed
/// assessments the grade is always one of "A", "B", "C+", "C", "D", "E".
pub type OetGrade = String;

/// Candidate details captured in Step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateDetails {
    pub candidate_id: String,
    pub candidate_name: String,
    pub examiner_name: String,
    pub test_centre: String,
    pub test_date: String,
    pub profession: String,
    pub first_language: String,
    pub country_of_training: String,
    pub years_of_experience: String,
}

/// Per-role-play scenario context (Steps 2 and 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RolePlayContext {
    pub scenario_title: String,
    pub scenario_summary: String,
    pub patient_role: String,
    pub setting: String,
    pub safety_criticality: String,
    pub examiner_notes: String,
}

/// Linguistic ratings 0-6, captured separately for each role-play.
/// Null means not yet rated.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinguisticRating {
    pub fluency: Option<i32>,
    pub grammar: Option<i32>,
    pub pronunciation: Option<i32>,
    pub clinical_appropriateness: Option<i32>,
}

/// Clinical communication indicators 0-3, across the whole assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalIndicators {
    pub relationship_building: Option<i32>,
    pub understanding_patient_perspective: Option<i32>,
    pub providing_structure: Option<i32>,
    pub information_gathering: Option<i32>,
    pub information_giving: Option<i32>,
    pub examiner_notes: String,
}

/// Complete clinical Welsh-language speaking assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub candidate: CandidateDetails,
    pub role_play1: RolePlayContext,
    pub role_play2: RolePlayContext,
    pub linguistic_role_play1: LinguisticRating,
    pub linguistic_role_play2: LinguisticRating,
    pub clinical_indicators: ClinicalIndicators,
}

/// Per-criterion audit-trail row in the grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CriterionScore {
    pub id: String,
    /// "linguistic" or "clinical".
    pub domain: String,
    pub label: String,
    pub max_score: i32,
    pub role_play1_score: Option<f64>,
    pub role_play2_score: Option<f64>,
    pub mean_score: Option<f64>,
}

/// A rule that "fired" during grading. For this form, each rated criterion
/// emits one FiredRule recording the criterion id, category, label, and
/// score actually used in the total.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: f64,
}

/// Examiner-facing safety / improvement flag (priority high|medium|low).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Pure scoring output from `cymraeg_grader::grade`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub linguistic_total: f64,
    pub clinical_total: f64,
    pub raw_total: f64,
    pub scaled_score: i32,
    pub grade: OetGrade,
    pub per_criterion_scores: Vec<CriterionScore>,
    pub fired_rules: Vec<FiredRule>,
}

/// Full grading + flags + timestamp persisted to the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingReport {
    pub grading: GradingResult,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
