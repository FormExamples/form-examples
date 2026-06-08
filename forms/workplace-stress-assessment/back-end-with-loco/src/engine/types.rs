//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases for the HSE Management Standards Indicator Tool.
//
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric (Likert) field.
/// Likert value.
pub type LikertValue = Option<i32>;
/// Risk level.
pub type RiskLevel = String;

/// Anonymous demographic banding (Step 1). Broad bands chosen so a single
/// employee cannot be identified from their answers.
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

/// HSE Domain 1 — Demands (8 items, all reverse-scored).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demands {
    /// Dem1.
    pub dem1: LikertValue,
    /// Dem2.
    pub dem2: LikertValue,
    /// Dem3.
    pub dem3: LikertValue,
    /// Dem4.
    pub dem4: LikertValue,
    /// Dem5.
    pub dem5: LikertValue,
    /// Dem6.
    pub dem6: LikertValue,
    /// Dem7.
    pub dem7: LikertValue,
    /// Dem8.
    pub dem8: LikertValue,
}

/// HSE Domain 2 — Control (6 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Control {
    /// Ctrl1.
    pub ctrl1: LikertValue,
    /// Ctrl2.
    pub ctrl2: LikertValue,
    /// Ctrl3.
    pub ctrl3: LikertValue,
    /// Ctrl4.
    pub ctrl4: LikertValue,
    /// Ctrl5.
    pub ctrl5: LikertValue,
    /// Ctrl6.
    pub ctrl6: LikertValue,
}

/// HSE Domain 3 — Manager Support (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManagerSupport {
    /// Ms1.
    pub ms1: LikertValue,
    /// Ms2.
    pub ms2: LikertValue,
    /// Ms3.
    pub ms3: LikertValue,
    /// Ms4.
    pub ms4: LikertValue,
    /// Ms5.
    pub ms5: LikertValue,
}

/// HSE Domain 4 — Peer Support (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PeerSupport {
    /// Ps1.
    pub ps1: LikertValue,
    /// Ps2.
    pub ps2: LikertValue,
    /// Ps3.
    pub ps3: LikertValue,
    /// Ps4.
    pub ps4: LikertValue,
}

/// HSE Domain 5 — Relationships (4 items, all reverse-scored).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Relationships {
    /// Rel1.
    pub rel1: LikertValue,
    /// Rel2.
    pub rel2: LikertValue,
    /// Rel3.
    pub rel3: LikertValue,
    /// Rel4.
    pub rel4: LikertValue,
}

/// HSE Domain 6 — Role Clarity (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Role {
    /// Role1.
    pub role1: LikertValue,
    /// Role2.
    pub role2: LikertValue,
    /// Role3.
    pub role3: LikertValue,
    /// Role4.
    pub role4: LikertValue,
    /// Role5.
    pub role5: LikertValue,
}

/// HSE Domain 7 — Organisational Change (3 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Change {
    /// Chg1.
    pub chg1: LikertValue,
    /// Chg2.
    pub chg2: LikertValue,
    /// Chg3.
    pub chg3: LikertValue,
}

/// Step 9 — free-text comments (optional).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalComments {
    /// Most stressful aspect.
    pub most_stressful_aspect: String,
    /// Suggestions for improvement.
    pub suggestions_for_improvement: String,
    /// Other comments.
    pub other_comments: String,
}

/// Full Workplace Stress Assessment record (HSE Management Standards
/// Indicator Tool, 35 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Demands.
    pub demands: Demands,
    /// Control.
    pub control: Control,
    /// Manager support.
    pub manager_support: ManagerSupport,
    /// Peer support.
    pub peer_support: PeerSupport,
    /// Relationships.
    pub relationships: Relationships,
    /// Role.
    pub role: Role,
    /// Change.
    pub change: Change,
    /// Additional comments.
    pub additional_comments: AdditionalComments,
}

/// Per-domain scoring result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainResult {
    /// Mean (1.00 .. 5.00) of reverse-coded answered items, or None if
    /// no items in the domain have been answered.
    pub mean: Option<f64>,
    /// Answered count.
    pub answered_count: u32,
    /// Total count.
    pub total_count: u32,
    /// HSE concern category — `low`, `moderate`, `high`, `very-high`, or `''`.
    pub category: RiskLevel,
}

/// All seven HSE domain results.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainResults {
    /// Demands.
    pub demands: DomainResult,
    /// Control.
    pub control: DomainResult,
    /// Manager support.
    pub manager_support: DomainResult,
    /// Peer support.
    pub peer_support: DomainResult,
    /// Relationships.
    pub relationships: DomainResult,
    /// Role.
    pub role: DomainResult,
    /// Change.
    pub change: DomainResult,
}

/// Per-item audit trail row.
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
    /// Effective value.
    pub effective_value: i32,
    /// Reverse scored.
    pub reverse_scored: bool,
}

/// Domain-level / free-text safety flag.
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

/// Grading output for a workplace-stress assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Domains.
    pub domains: DomainResults,
    /// Worst of the seven HSE domain categories. `''` if no items answered.
    pub overall_risk: RiskLevel,
    /// Answered count.
    pub answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredItem>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
