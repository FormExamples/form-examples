use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered Likert (1-5) or eNPS (0-10).
pub type LikertValue = Option<i32>;
pub type ENpsValue = Option<i32>;
pub type SatisfactionCategory = String;
pub type ENpsClassification = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub department: String,
    pub tenure_band: String,
    pub hours_band: String,
}

/// Step 2 — Role & Tenure.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleTenure {
    pub role_level: String,
    pub work_location: String,
    pub rt1: LikertValue,
    pub rt2: LikertValue,
}

/// Step 3 — Workload & Work-Life Balance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Workload {
    pub wl1: LikertValue,
    pub wl2: LikertValue,
    pub wl3: LikertValue,
    pub wl4: LikertValue,
    pub wl5: LikertValue,
}

/// Step 4 — Management & Leadership.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Management {
    pub mg1: LikertValue,
    pub mg2: LikertValue,
    pub mg3: LikertValue,
    pub mg4: LikertValue,
    pub mg5: LikertValue,
}

/// Step 5 — Growth & Development.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Growth {
    pub gr1: LikertValue,
    pub gr2: LikertValue,
    pub gr3: LikertValue,
    pub gr4: LikertValue,
}

/// Step 6 — Compensation & Benefits.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Compensation {
    pub cb1: LikertValue,
    pub cb2: LikertValue,
    pub cb3: LikertValue,
    pub cb4: LikertValue,
}

/// Step 7 — Culture & Inclusion.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Culture {
    pub cu1: LikertValue,
    pub cu2: LikertValue,
    pub cu3: LikertValue,
    pub cu4: LikertValue,
    pub cu5: LikertValue,
}

/// Step 8 — Environment & Resources.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Environment {
    pub en1: LikertValue,
    pub en2: LikertValue,
    pub en3: LikertValue,
    pub en4: LikertValue,
}

/// Step 9 — Recognition & Engagement.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recognition {
    pub rc1: LikertValue,
    pub rc2: LikertValue,
    pub rc3: LikertValue,
    pub rc4: LikertValue,
}

/// Step 10 — Overall Experience & Retention Intent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallExperience {
    pub ov1: LikertValue,
    pub ov2: LikertValue,
    pub ov3: LikertValue,
    pub ov4: LikertValue,
    pub recommend_score: ENpsValue,
    pub retention_intent: String,
    pub suggestions_for_improvement: String,
    pub other_comments: String,
}

/// Full Employee Satisfaction Survey assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub role_tenure: RoleTenure,
    pub workload: Workload,
    pub management: Management,
    pub growth: Growth,
    pub compensation: Compensation,
    pub culture: Culture,
    pub environment: Environment,
    pub recognition: Recognition,
    pub overall: OverallExperience,
}

/// Per-domain scoring summary.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScore {
    pub mean: Option<f64>,
    pub score: Option<f64>,
    pub answered_count: u32,
    pub total_count: u32,
    pub category: SatisfactionCategory,
}

/// Per-domain scoring across all eight graded domains.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScores {
    pub workload: DomainScore,
    pub management: DomainScore,
    pub growth: DomainScore,
    pub compensation: DomainScore,
    pub culture: DomainScore,
    pub environment: DomainScore,
    pub recognition: DomainScore,
    pub overall: DomainScore,
}

/// eNPS scoring outcome.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ENpsResult {
    pub score: ENpsValue,
    pub classification: ENpsClassification,
}

/// A rule that fired during grading — every answered Likert item produces
/// one FiredItem so reviewers can see exactly what was rated.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredItem {
    pub id: String,
    pub domain: String,
    pub label: String,
    pub raw_value: i32,
}

/// A flagged issue surfaced to HR / engagement reviewers.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a survey response.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub composite_score: Option<f64>,
    pub category: SatisfactionCategory,
    pub domain_scores: DomainScores,
    #[serde(rename = "eNPS")]
    pub enps: ENpsResult,
    pub answered_count: u32,
    pub total_count: u32,
    pub fired_rules: Vec<FiredItem>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
