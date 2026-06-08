//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered Likert (1-5) or eNPS (0-10).
/// Likert value.
pub type LikertValue = Option<i32>;
/// E nps value.
pub type ENpsValue = Option<i32>;
/// Satisfaction category.
pub type SatisfactionCategory = String;
/// E nps classification.
pub type ENpsClassification = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// Department.
    pub department: String,
    /// Tenure band.
    pub tenure_band: String,
    /// Hours band.
    pub hours_band: String,
}

/// Step 2 — Role & Tenure.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleTenure {
    /// Role level.
    pub role_level: String,
    /// Work location.
    pub work_location: String,
    /// Rt1.
    pub rt1: LikertValue,
    /// Rt2.
    pub rt2: LikertValue,
}

/// Step 3 — Workload & Work-Life Balance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Workload {
    /// Wl1.
    pub wl1: LikertValue,
    /// Wl2.
    pub wl2: LikertValue,
    /// Wl3.
    pub wl3: LikertValue,
    /// Wl4.
    pub wl4: LikertValue,
    /// Wl5.
    pub wl5: LikertValue,
}

/// Step 4 — Management & Leadership.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Management {
    /// Mg1.
    pub mg1: LikertValue,
    /// Mg2.
    pub mg2: LikertValue,
    /// Mg3.
    pub mg3: LikertValue,
    /// Mg4.
    pub mg4: LikertValue,
    /// Mg5.
    pub mg5: LikertValue,
}

/// Step 5 — Growth & Development.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Growth {
    /// Gr1.
    pub gr1: LikertValue,
    /// Gr2.
    pub gr2: LikertValue,
    /// Gr3.
    pub gr3: LikertValue,
    /// Gr4.
    pub gr4: LikertValue,
}

/// Step 6 — Compensation & Benefits.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Compensation {
    /// Cb1.
    pub cb1: LikertValue,
    /// Cb2.
    pub cb2: LikertValue,
    /// Cb3.
    pub cb3: LikertValue,
    /// Cb4.
    pub cb4: LikertValue,
}

/// Step 7 — Culture & Inclusion.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Culture {
    /// Cu1.
    pub cu1: LikertValue,
    /// Cu2.
    pub cu2: LikertValue,
    /// Cu3.
    pub cu3: LikertValue,
    /// Cu4.
    pub cu4: LikertValue,
    /// Cu5.
    pub cu5: LikertValue,
}

/// Step 8 — Environment & Resources.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Environment {
    /// En1.
    pub en1: LikertValue,
    /// En2.
    pub en2: LikertValue,
    /// En3.
    pub en3: LikertValue,
    /// En4.
    pub en4: LikertValue,
}

/// Step 9 — Recognition & Engagement.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recognition {
    /// Rc1.
    pub rc1: LikertValue,
    /// Rc2.
    pub rc2: LikertValue,
    /// Rc3.
    pub rc3: LikertValue,
    /// Rc4.
    pub rc4: LikertValue,
}

/// Step 10 — Overall Experience & Retention Intent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallExperience {
    /// Ov1.
    pub ov1: LikertValue,
    /// Ov2.
    pub ov2: LikertValue,
    /// Ov3.
    pub ov3: LikertValue,
    /// Ov4.
    pub ov4: LikertValue,
    /// Recommend score.
    pub recommend_score: ENpsValue,
    /// Retention intent.
    pub retention_intent: String,
    /// Suggestions for improvement.
    pub suggestions_for_improvement: String,
    /// Other comments.
    pub other_comments: String,
}

/// Full Employee Satisfaction Survey assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Role tenure.
    pub role_tenure: RoleTenure,
    /// Workload.
    pub workload: Workload,
    /// Management.
    pub management: Management,
    /// Growth.
    pub growth: Growth,
    /// Compensation.
    pub compensation: Compensation,
    /// Culture.
    pub culture: Culture,
    /// Environment.
    pub environment: Environment,
    /// Recognition.
    pub recognition: Recognition,
    /// Overall.
    pub overall: OverallExperience,
}

/// Per-domain scoring summary.
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
    pub category: SatisfactionCategory,
}

/// Per-domain scoring across all eight graded domains.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScores {
    /// Workload.
    pub workload: DomainScore,
    /// Management.
    pub management: DomainScore,
    /// Growth.
    pub growth: DomainScore,
    /// Compensation.
    pub compensation: DomainScore,
    /// Culture.
    pub culture: DomainScore,
    /// Environment.
    pub environment: DomainScore,
    /// Recognition.
    pub recognition: DomainScore,
    /// Overall.
    pub overall: DomainScore,
}

/// eNPS scoring outcome.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ENpsResult {
    /// Score.
    pub score: ENpsValue,
    /// Classification.
    pub classification: ENpsClassification,
}

/// A rule that fired during grading — every answered Likert item produces
/// one FiredItem so reviewers can see exactly what was rated.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredItem {
    /// ID.
    pub id: String,
    /// Domain.
    pub domain: String,
    /// Label.
    pub label: String,
    /// Raw value.
    pub raw_value: i32,
}

/// A flagged issue surfaced to HR / engagement reviewers.
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

/// Grading output for a survey response.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Composite score.
    pub composite_score: Option<f64>,
    /// Category.
    pub category: SatisfactionCategory,
    /// Domain scores.
    pub domain_scores: DomainScores,
    /// Enps.
    #[serde(rename = "eNPS")]
    pub enps: ENpsResult,
    /// Answered count.
    pub answered_count: u32,
    /// Total count.
    pub total_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredItem>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
