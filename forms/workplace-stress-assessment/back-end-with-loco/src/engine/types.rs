use serde::{Deserialize, Serialize};

// Type aliases for the HSE Management Standards Indicator Tool.
//
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric (Likert) field.
pub type LikertValue = Option<i32>;
pub type RiskLevel = String;

/// Anonymous demographic banding (Step 1). Broad bands chosen so a single
/// employee cannot be identified from their answers.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub department: String,
    pub tenure_band: String,
    pub hours_band: String,
}

/// HSE Domain 1 — Demands (8 items, all reverse-scored).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demands {
    pub dem1: LikertValue,
    pub dem2: LikertValue,
    pub dem3: LikertValue,
    pub dem4: LikertValue,
    pub dem5: LikertValue,
    pub dem6: LikertValue,
    pub dem7: LikertValue,
    pub dem8: LikertValue,
}

/// HSE Domain 2 — Control (6 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Control {
    pub ctrl1: LikertValue,
    pub ctrl2: LikertValue,
    pub ctrl3: LikertValue,
    pub ctrl4: LikertValue,
    pub ctrl5: LikertValue,
    pub ctrl6: LikertValue,
}

/// HSE Domain 3 — Manager Support (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManagerSupport {
    pub ms1: LikertValue,
    pub ms2: LikertValue,
    pub ms3: LikertValue,
    pub ms4: LikertValue,
    pub ms5: LikertValue,
}

/// HSE Domain 4 — Peer Support (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PeerSupport {
    pub ps1: LikertValue,
    pub ps2: LikertValue,
    pub ps3: LikertValue,
    pub ps4: LikertValue,
}

/// HSE Domain 5 — Relationships (4 items, all reverse-scored).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Relationships {
    pub rel1: LikertValue,
    pub rel2: LikertValue,
    pub rel3: LikertValue,
    pub rel4: LikertValue,
}

/// HSE Domain 6 — Role Clarity (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Role {
    pub role1: LikertValue,
    pub role2: LikertValue,
    pub role3: LikertValue,
    pub role4: LikertValue,
    pub role5: LikertValue,
}

/// HSE Domain 7 — Organisational Change (3 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Change {
    pub chg1: LikertValue,
    pub chg2: LikertValue,
    pub chg3: LikertValue,
}

/// Step 9 — free-text comments (optional).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalComments {
    pub most_stressful_aspect: String,
    pub suggestions_for_improvement: String,
    pub other_comments: String,
}

/// Full Workplace Stress Assessment record (HSE Management Standards
/// Indicator Tool, 35 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub demands: Demands,
    pub control: Control,
    pub manager_support: ManagerSupport,
    pub peer_support: PeerSupport,
    pub relationships: Relationships,
    pub role: Role,
    pub change: Change,
    pub additional_comments: AdditionalComments,
}

/// Per-domain scoring result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainResult {
    /// Mean (1.00 .. 5.00) of reverse-coded answered items, or None if
    /// no items in the domain have been answered.
    pub mean: Option<f64>,
    pub answered_count: u32,
    pub total_count: u32,
    /// HSE concern category — `low`, `moderate`, `high`, `very-high`, or `''`.
    pub category: RiskLevel,
}

/// All seven HSE domain results.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainResults {
    pub demands: DomainResult,
    pub control: DomainResult,
    pub manager_support: DomainResult,
    pub peer_support: DomainResult,
    pub relationships: DomainResult,
    pub role: DomainResult,
    pub change: DomainResult,
}

/// Per-item audit trail row.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredItem {
    pub id: String,
    pub domain: String,
    pub label: String,
    pub raw_value: i32,
    pub effective_value: i32,
    pub reverse_scored: bool,
}

/// Domain-level / free-text safety flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a workplace-stress assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub domains: DomainResults,
    /// Worst of the seven HSE domain categories. `''` if no items answered.
    pub overall_risk: RiskLevel,
    pub answered_count: u32,
    pub fired_rules: Vec<FiredItem>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
