use serde::{Deserialize, Serialize};

/// Validation status — either Complete (all required fields filled and
/// acknowledgement checkbox ticked) or Incomplete (one or more missing).
pub type ValidationStatus = String;

/// Recipient details — Step 1 of the wizard.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecipientDetails {
    pub organisation_name: String,
    pub recipient_name: String,
    pub recipient_role: String,
    pub recipient_employee_id: String,
}

/// Acknowledgement & signature — Step 3 of the wizard.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgementSignature {
    pub agreed: bool,
    pub recipient_typed_full_name: String,
    pub recipient_typed_date: String,
}

/// Full Code of Conduct Notice acknowledgement record. Step 2 (the read-only
/// twelve principles) has no captured data — it is a display-only screen the
/// recipient scrolls through before signing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub recipient_details: RecipientDetails,
    pub acknowledgement_signature: AcknowledgementSignature,
}

/// A required-field validation rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub field: &'static str,
    pub message: &'static str,
}

/// A rule that fired during validation (the corresponding required field
/// was missing or the acknowledgement checkbox was unticked).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub section: String,
    pub description: String,
    pub field: String,
}

/// A compliance-officer-facing flag computed independently of completion.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a Code of Conduct Notice acknowledgement.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub completeness_percent: u32,
    pub status: ValidationStatus,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
