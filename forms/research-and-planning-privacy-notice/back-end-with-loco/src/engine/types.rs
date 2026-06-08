//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// `'Complete'` / `'Incomplete'`. Mirrors the TypeScript union.
pub type ValidationStatus = String;

/// Recipient identity captured at Step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipientDetails {
    /// Organisation name.
    pub organisation_name: String,
    /// Recipient name.
    pub recipient_name: String,
    /// Recipient NHS number.
    pub recipient_nhs_number: String,
    /// Recipient DOB.
    pub recipient_dob: String,
}

/// Step 3 — opt-out preferences, acknowledgement, and typed signature.
///
/// Field semantics:
/// - `agreed`: acknowledgement checkbox (`false` counts as unanswered).
/// - `type1OptOut` / `nationalDataOptOut`: `'opt-in'` / `'opt-out'` / `''`.
/// - `recipientTypedFullName` and `recipientTypedDate`: free text /
///   YYYY-MM-DD; empty `''` indicates unanswered.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgementSignature {
    /// Agreed.
    pub agreed: bool,
    /// Type1 opt out.
    pub type1_opt_out: String,
    /// National data opt out.
    pub national_data_opt_out: String,
    /// Recipient typed full name.
    pub recipient_typed_full_name: String,
    /// Recipient typed date.
    pub recipient_typed_date: String,
}

/// Full research-and-planning privacy notice acknowledgement record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Recipient details.
    pub recipient_details: RecipientDetails,
    /// Acknowledgement signature.
    pub acknowledgement_signature: AcknowledgementSignature,
}

/// A required-field rule that fired (i.e. the field is unanswered).
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

/// An information-governance flag highlighted on the report (independent
/// of completion).
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

/// Grading output for an acknowledgement record.
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
