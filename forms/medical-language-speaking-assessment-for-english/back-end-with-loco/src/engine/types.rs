//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// `OETGrade` is one of `A`, `B`, `C+`, `C`, `D`, `E`, or `''` (unrated).
pub type OETGrade = String;

/// Candidate (sitter) details.
#[derive(Debug, Clone, Serialize, Deserialize)]
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
    /// Scenario title.
    pub scenario_title: String,
    /// Scenario summary.
    pub scenario_summary: String,
    /// Patient role.
    pub patient_role: String,
    /// Setting.
    pub setting: String,
    /// `low` / `standard` / `high` / `''`.
    pub safety_criticality: String,
    /// Examiner notes.
    pub examiner_notes: String,
}

/// Linguistic ratings (0-6) for a single role-play.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinguisticRating {
    /// Intelligibility.
    pub intelligibility: Option<f64>,
    /// Fluency.
    pub fluency: Option<f64>,
    /// Appropriateness of language.
    pub appropriateness_of_language: Option<f64>,
    /// Resources of grammar and expression.
    pub resources_of_grammar_and_expression: Option<f64>,
}

/// Clinical communication indicators (0-3) for the whole sub-test.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalIndicators {
    /// Relationship building.
    pub relationship_building: Option<f64>,
    /// Understanding patient perspective.
    pub understanding_patient_perspective: Option<f64>,
    /// Providing structure.
    pub providing_structure: Option<f64>,
    /// Information gathering.
    pub information_gathering: Option<f64>,
    /// Information giving.
    pub information_giving: Option<f64>,
    /// Examiner notes.
    pub examiner_notes: String,
}

/// Full OET Medicine speaking-assessment record.
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

/// Per-criterion audit row (matches the JS `CriterionScore`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CriterionScore {
    /// ID.
    pub id: String,
    /// `linguistic` or `clinical`.
    pub domain: String,
    /// Label.
    pub label: String,
    /// Max score.
    pub max_score: u32,
    /// Role play1 score.
    pub role_play1_score: Option<f64>,
    /// Role play2 score.
    pub role_play2_score: Option<f64>,
    /// Mean score.
    pub mean_score: Option<f64>,
}

/// A rule that fired during grading (one per rated criterion).
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

/// Safety / examiner flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
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
    /// Grade.
    pub grade: OETGrade,
    /// Per criterion scores.
    pub per_criterion_scores: Vec<CriterionScore>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
