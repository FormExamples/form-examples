use serde::{Deserialize, Serialize};

/// `OETGrade` is one of `A`, `B`, `C+`, `C`, `D`, `E`, or `''` (unrated).
pub type OETGrade = String;

/// Candidate (sitter) details.
#[derive(Debug, Clone, Serialize, Deserialize)]
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

impl Default for CandidateDetails {
    fn default() -> Self {
        Self {
            candidate_id: String::new(),
            candidate_name: String::new(),
            examiner_name: String::new(),
            test_centre: String::new(),
            test_date: String::new(),
            // Always `medicine` for this form (per JS engine).
            profession: "medicine".to_string(),
            first_language: String::new(),
            country_of_training: String::new(),
            years_of_experience: String::new(),
        }
    }
}

/// Context describing a single role-played clinical scenario.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RolePlayContext {
    pub scenario_title: String,
    pub scenario_summary: String,
    pub patient_role: String,
    pub setting: String,
    /// `low` / `standard` / `high` / `''`.
    pub safety_criticality: String,
    pub examiner_notes: String,
}

/// Linguistic ratings (0-6) for a single role-play.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinguisticRating {
    pub intelligibility: Option<f64>,
    pub fluency: Option<f64>,
    pub appropriateness_of_language: Option<f64>,
    pub resources_of_grammar_and_expression: Option<f64>,
}

/// Clinical communication indicators (0-3) for the whole sub-test.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalIndicators {
    pub relationship_building: Option<f64>,
    pub understanding_patient_perspective: Option<f64>,
    pub providing_structure: Option<f64>,
    pub information_gathering: Option<f64>,
    pub information_giving: Option<f64>,
    pub examiner_notes: String,
}

/// Full OET Medicine speaking-assessment record.
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

/// Per-criterion audit row (matches the JS `CriterionScore`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CriterionScore {
    pub id: String,
    /// `linguistic` or `clinical`.
    pub domain: String,
    pub label: String,
    pub max_score: u32,
    pub role_play1_score: Option<f64>,
    pub role_play2_score: Option<f64>,
    pub mean_score: Option<f64>,
}

/// A rule that fired during grading (one per rated criterion).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: f64,
}

/// Safety / examiner flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// `high` / `medium` / `low`.
    pub priority: String,
}

/// OET scoring result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// 0-24 (mean across role-plays).
    pub linguistic_total: f64,
    /// 0-15.
    pub clinical_total: f64,
    /// 0-39.
    pub raw_total: f64,
    /// 0-500.
    pub scaled_score: u32,
    pub grade: OETGrade,
    pub per_criterion_scores: Vec<CriterionScore>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
