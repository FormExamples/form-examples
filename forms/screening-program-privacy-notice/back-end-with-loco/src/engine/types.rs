//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered text / enum / date field.
// `bool` is `false` when the patient has not yet ticked the confirmation box.
/// Acknowledgment status.
pub type AcknowledgmentStatus = String;

/// Patient demographic identification fields (denormalized into the JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    /// Name.
    pub name: String,
    /// Birth date.
    pub birth_date: String,
    /// Email.
    pub email: String,
    /// Phone.
    pub phone: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: String,
    /// Country as iso 3166 1 alpha 2.
    pub country_as_iso_3166_1_alpha_2: String,
    /// Postcode.
    pub postcode: String,
    /// United kingdom NHS number.
    pub united_kingdom_nhs_number: String,
}

/// The acknowledgment itself: tick, signature, and date.
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

/// Practice-customizable fields rendered into the privacy notice.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PracticeConfig {
    /// Practice name.
    pub practice_name: String,
    /// Data controller address.
    pub data_controller_address: String,
    /// Data protection officer.
    pub data_protection_officer: String,
    /// Research organisations.
    pub research_organisations: String,
    /// Planning organisations.
    pub planning_organisations: String,
    /// Audit body.
    pub audit_body: String,
    /// Subject access request link.
    pub subject_access_request_link: String,
    /// Gdpr basis.
    pub gdpr_basis: String, // "consent" or "research"
}

/// Full screening-program-privacy-notice acknowledgment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient.
    pub patient: Patient,
    /// Acknowledgment.
    pub acknowledgment: Acknowledgment,
    /// Practice config.
    pub practice_config: PracticeConfig,
}

/// A rule that fired during grading (i.e. a required item was unanswered).
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

/// A privacy flag computed independently of completion.
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

/// Grading output for an acknowledgment record.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Acknowledgment status.
    pub acknowledgment_status: AcknowledgmentStatus,
    /// Answered.
    pub answered: u32,
    /// Total.
    pub total: u32,
    /// Overall percent.
    pub overall_percent: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
