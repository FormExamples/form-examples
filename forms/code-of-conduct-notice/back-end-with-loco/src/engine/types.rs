//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Validation status — either Complete (all required fields filled and
/// acknowledgement checkbox ticked) or Incomplete (one or more missing).
pub type ValidationStatus = String;

/// Recipient details — Step 1 of the wizard.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipientDetails {
    /// Organisation name.
    pub organisation_name: String,
    /// Recipient name.
    pub recipient_name: String,
    /// Recipient role.
    pub recipient_role: String,
    /// Recipient employee ID.
    pub recipient_employee_id: String,
}

/// Acknowledgement & signature — Step 3 of the wizard.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgementSignature {
    /// Agreed.
    pub agreed: bool,
    /// Recipient typed full name.
    pub recipient_typed_full_name: String,
    /// Recipient typed date.
    pub recipient_typed_date: String,
}

/// Full Code of Conduct Notice acknowledgement record. Step 2 (the read-only
/// twelve principles) has no captured data — it is a display-only screen the
/// recipient scrolls through before signing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Recipient details.
    pub recipient_details: RecipientDetails,
    /// Acknowledgement signature.
    pub acknowledgement_signature: AcknowledgementSignature,
}

/// A required-field validation rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationRule {
    /// ID.
    pub id: &'static str,
    /// Section.
    pub section: &'static str,
    /// Field.
    pub field: &'static str,
    /// Message.
    pub message: &'static str,
}

/// A rule that fired during validation (the corresponding required field
/// was missing or the acknowledgement checkbox was unticked).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Section.
    pub section: String,
    /// Description.
    pub description: String,
    /// Field.
    pub field: String,
}

/// A compliance-officer-facing flag computed independently of completion.
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

/// Grading output for a Code of Conduct Notice acknowledgement.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Completeness percent.
    pub completeness_percent: u32,
    /// Status.
    pub status: ValidationStatus,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
