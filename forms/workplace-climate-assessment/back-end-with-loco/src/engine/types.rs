//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered Likert numeric field.
/// Likert value.
pub type LikertValue = Option<i32>;
/// Climate category.
pub type ClimateCategory = String;

/// Demographics — anonymised banding only; NOT graded into the composite.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// Department.
    pub department: String,
    /// Tenure band.
    pub tenure_band: String,
    /// Hours band.
    pub hours_band: String,
    /// Role level.
    pub role_level: String,
    /// Work location.
    pub work_location: String,
}

/// Leadership & Management (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Leadership {
    /// Ld1.
    pub ld1: LikertValue,
    /// Ld2.
    pub ld2: LikertValue,
    /// Ld3.
    pub ld3: LikertValue,
    /// Ld4.
    pub ld4: LikertValue,
    /// Ld5.
    pub ld5: LikertValue,
}

/// Psychological Safety (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychSafety {
    /// Ps1.
    pub ps1: LikertValue,
    /// Ps2.
    pub ps2: LikertValue,
    /// Ps3.
    pub ps3: LikertValue,
    /// Ps4.
    pub ps4: LikertValue,
    /// Ps5.
    pub ps5: LikertValue,
}

/// Inclusion & Belonging (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Inclusion {
    /// In1.
    pub in1: LikertValue,
    /// In2.
    pub in2: LikertValue,
    /// In3.
    pub in3: LikertValue,
    /// In4.
    pub in4: LikertValue,
    /// In5.
    pub in5: LikertValue,
}

/// Communication (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Communication {
    /// Co1.
    pub co1: LikertValue,
    /// Co2.
    pub co2: LikertValue,
    /// Co3.
    pub co3: LikertValue,
    /// Co4.
    pub co4: LikertValue,
}

/// Collaboration & Teamwork (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Collaboration {
    /// Cl1.
    pub cl1: LikertValue,
    /// Cl2.
    pub cl2: LikertValue,
    /// Cl3.
    pub cl3: LikertValue,
    /// Cl4.
    pub cl4: LikertValue,
}

/// Recognition & Reward (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recognition {
    /// Re1.
    pub re1: LikertValue,
    /// Re2.
    pub re2: LikertValue,
    /// Re3.
    pub re3: LikertValue,
    /// Re4.
    pub re4: LikertValue,
}

/// Wellbeing (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Wellbeing {
    /// We1.
    pub we1: LikertValue,
    /// We2.
    pub we2: LikertValue,
    /// We3.
    pub we3: LikertValue,
    /// We4.
    pub we4: LikertValue,
    /// We5.
    pub we5: LikertValue,
}

/// Career Development (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Career {
    /// Ca1.
    pub ca1: LikertValue,
    /// Ca2.
    pub ca2: LikertValue,
    /// Ca3.
    pub ca3: LikertValue,
    /// Ca4.
    pub ca4: LikertValue,
}

/// Overall Climate & Recommendations — 3 Likert items (NOT graded into composite),
/// a recommend-as-place-to-work choice, and free-text feedback.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallClimate {
    /// Oc1.
    pub oc1: LikertValue,
    /// Oc2.
    pub oc2: LikertValue,
    /// Oc3.
    pub oc3: LikertValue,
    /// Recommend as place to work.
    pub recommend_as_place_to_work: String,
    /// Biggest strength.
    pub biggest_strength: String,
    /// Biggest improvement.
    pub biggest_improvement: String,
    /// Other comments.
    pub other_comments: String,
}

/// Full Workplace Climate Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Leadership.
    pub leadership: Leadership,
    /// Psych safety.
    pub psych_safety: PsychSafety,
    /// Inclusion.
    pub inclusion: Inclusion,
    /// Communication.
    pub communication: Communication,
    /// Collaboration.
    pub collaboration: Collaboration,
    /// Recognition.
    pub recognition: Recognition,
    /// Wellbeing.
    pub wellbeing: Wellbeing,
    /// Career.
    pub career: Career,
    /// Overall.
    pub overall: OverallClimate,
}

/// Per-item answered record (preserved verbatim for the fired-rules list).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Domain.
    pub domain: String,
    /// Label.
    pub label: String,
    /// Raw value.
    pub raw_value: i32,
}

/// A flag emitted by `flagged_issues` after grading.
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

/// Per-domain score.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScore {
    /// Mean.
    pub mean: Option<f64>,
    /// Score.
    pub score: Option<f64>,
    /// Answered count.
    pub answered_count: u32,
    /// Total count.
    pub total_count: u32,
    /// Category.
    pub category: ClimateCategory,
}

/// All eight graded domain scores.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScores {
    /// Leadership.
    pub leadership: DomainScore,
    /// Psych safety.
    pub psych_safety: DomainScore,
    /// Inclusion.
    pub inclusion: DomainScore,
    /// Communication.
    pub communication: DomainScore,
    /// Collaboration.
    pub collaboration: DomainScore,
    /// Recognition.
    pub recognition: DomainScore,
    /// Wellbeing.
    pub wellbeing: DomainScore,
    /// Career.
    pub career: DomainScore,
}

/// Grading output for the entire Workplace Climate Assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Composite score.
    pub composite_score: Option<f64>,
    /// Category.
    pub category: ClimateCategory,
    /// Domain scores.
    pub domain_scores: DomainScores,
    /// Answered count.
    pub answered_count: u32,
    /// Total count.
    pub total_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
