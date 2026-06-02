use serde::{Deserialize, Serialize};

/// `'Complete'` / `'Incomplete'`. Mirrors the TypeScript union.
pub type ValidationStatus = String;

/// Recipient identity captured at Step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipientDetails {
    pub organisation_name: String,
    pub recipient_name: String,
    pub recipient_nhs_number: String,
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
    pub agreed: bool,
    pub type1_opt_out: String,
    pub national_data_opt_out: String,
    pub recipient_typed_full_name: String,
    pub recipient_typed_date: String,
}

/// Full research-and-planning privacy notice acknowledgement record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub recipient_details: RecipientDetails,
    pub acknowledgement_signature: AcknowledgementSignature,
}

/// A required-field rule that fired (i.e. the field is unanswered).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub section: String,
    pub description: String,
    pub field: String,
}

/// An information-governance flag highlighted on the report (independent
/// of completion).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an acknowledgement record.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub completeness_percent: u32,
    pub status: ValidationStatus,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
