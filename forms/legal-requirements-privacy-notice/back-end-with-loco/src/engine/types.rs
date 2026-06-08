//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend.
// Empty string `''` indicates an unanswered text / enum field.
/// Acknowledgment status.
pub type AcknowledgmentStatus = String;

/// Patient identification captured alongside the acknowledgment (denormalized
/// for the JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// NHS number.
    pub nhs_number: String,
}

/// The acknowledgment record itself. Mirrors the front-end form fields:
/// the confirmation checkbox, the typed full name, and the acknowledged date.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Acknowledgment {
    /// Confirmed.
    pub confirmed: bool,
    /// Full name.
    pub full_name: String,
    /// Acknowledged date.
    pub acknowledged_date: String,
}

/// Full Legal Requirements Privacy Notice acknowledgment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient.
    pub patient: Patient,
    /// Acknowledgment.
    pub acknowledgment: Acknowledgment,
}

/// A rule that fired during grading (i.e. a required acknowledgment item was
/// missing when it should have been provided).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Severity.
    pub severity: String,
}

/// A safety flag computed independently of completion (real-time alert).
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

/// Per-section completion summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgmentProgress {
    /// Answered.
    pub answered: u32,
    /// Total.
    pub total: u32,
    /// Percent.
    pub percent: u32,
}

/// Grading output for the acknowledgment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Acknowledgment status.
    pub acknowledgment_status: AcknowledgmentStatus,
    /// Progress.
    pub progress: AcknowledgmentProgress,
    /// Overall percent.
    pub overall_percent: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
