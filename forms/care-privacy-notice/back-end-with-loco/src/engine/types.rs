//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered text / enum field.
// `Option<...>::None` indicates an unanswered numeric / date / time field.
/// Overall status.
pub type OverallStatus = String;

/// Practice configuration filled in by admin / clinical staff in Step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PracticeConfig {
    /// Practice name.
    pub practice_name: String,
    /// Practice address.
    pub practice_address: String,
    /// Dpo name.
    pub dpo_name: String,
    /// Dpo contact details.
    pub dpo_contact_details: String,
    /// Research organisations.
    pub research_organisations: String,
    /// Data sharing partners.
    pub data_sharing_partners: String,
}

/// Patient acknowledgement captured in Step 3.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Acknowledgment {
    /// Checked.
    pub checked: bool,
    /// Patient name.
    pub patient_name: String,
    /// Date.
    pub date: String,
}

/// Full Care Privacy Notice acknowledgement record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Config.
    pub config: PracticeConfig,
    /// Acknowledgment.
    pub acknowledgment: Acknowledgment,
    /// Submitted at.
    pub submitted_at: Option<String>,
}

/// A rule that fired during grading (an acknowledgement field is missing).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Message.
    pub message: String,
}

/// A safety / completeness flag computed independently of rule firing.
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

/// Grading output for a Care Privacy Notice acknowledgement.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Overall status.
    pub overall_status: OverallStatus,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
