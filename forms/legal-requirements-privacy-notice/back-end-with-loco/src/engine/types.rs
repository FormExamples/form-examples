use serde::{Deserialize, Serialize};

// Type aliases matching the frontend.
// Empty string `''` indicates an unanswered text / enum field.
pub type AcknowledgmentStatus = String;

/// Patient identification captured alongside the acknowledgment (denormalized
/// for the JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    pub first_name: String,
    pub last_name: String,
    pub nhs_number: String,
}

/// The acknowledgment record itself. Mirrors the front-end form fields:
/// the confirmation checkbox, the typed full name, and the acknowledged date.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Acknowledgment {
    pub confirmed: bool,
    pub full_name: String,
    pub acknowledged_date: String,
}

/// Full Legal Requirements Privacy Notice acknowledgment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient: Patient,
    pub acknowledgment: Acknowledgment,
}

/// A rule that fired during grading (i.e. a required acknowledgment item was
/// missing when it should have been provided).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub severity: String,
}

/// A safety flag computed independently of completion (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Per-section completion summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgmentProgress {
    pub answered: u32,
    pub total: u32,
    pub percent: u32,
}

/// Grading output for the acknowledgment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub acknowledgment_status: AcknowledgmentStatus,
    pub progress: AcknowledgmentProgress,
    pub overall_percent: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
