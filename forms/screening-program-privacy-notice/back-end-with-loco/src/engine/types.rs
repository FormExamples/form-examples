use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered text / enum / date field.
// `bool` is `false` when the patient has not yet ticked the confirmation box.
pub type AcknowledgmentStatus = String;

/// Patient demographic identification fields (denormalized into the JSONB blob).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    pub name: String,
    pub birth_date: String,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub country_as_iso_3166_1_alpha_2: String,
    pub postcode: String,
    pub united_kingdom_nhs_number: String,
}

/// The acknowledgment itself: tick, signature, and date.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Acknowledgment {
    pub confirmed: bool,
    pub full_name: String,
    pub acknowledged_date: String,
}

/// Practice-customizable fields rendered into the privacy notice.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PracticeConfig {
    pub practice_name: String,
    pub data_controller_address: String,
    pub data_protection_officer: String,
    pub research_organisations: String,
    pub planning_organisations: String,
    pub audit_body: String,
    pub subject_access_request_link: String,
    pub gdpr_basis: String, // "consent" or "research"
}

/// Full screening-program-privacy-notice acknowledgment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient: Patient,
    pub acknowledgment: Acknowledgment,
    pub practice_config: PracticeConfig,
}

/// A rule that fired during grading (i.e. a required item was unanswered).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub severity: String,
}

/// A privacy flag computed independently of completion.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an acknowledgment record.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub acknowledgment_status: AcknowledgmentStatus,
    pub answered: u32,
    pub total: u32,
    pub overall_percent: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
