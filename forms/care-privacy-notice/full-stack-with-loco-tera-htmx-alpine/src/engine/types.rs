use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered text / enum field.
// `Option<...>::None` indicates an unanswered numeric / date / time field.
pub type OverallStatus = String;

/// Practice configuration filled in by admin / clinical staff in Step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PracticeConfig {
    pub practice_name: String,
    pub practice_address: String,
    pub dpo_name: String,
    pub dpo_contact_details: String,
    pub research_organisations: String,
    pub data_sharing_partners: String,
}

/// Patient acknowledgement captured in Step 3.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Acknowledgment {
    pub checked: bool,
    pub patient_name: String,
    pub date: String,
}

/// Full Care Privacy Notice acknowledgement record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub config: PracticeConfig,
    pub acknowledgment: Acknowledgment,
    pub submitted_at: Option<String>,
}

/// A rule that fired during grading (an acknowledgement field is missing).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub message: String,
}

/// A safety / completeness flag computed independently of rule firing.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a Care Privacy Notice acknowledgement.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub overall_status: OverallStatus,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
