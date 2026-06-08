//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
/// Yes no.
pub type YesNo = String;
/// Priority level.
pub type PriorityLevel = String;
/// Route of administration.
pub type RouteOfAdministration = String;

/// Section 1 — Patient Information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// NHS number.
    pub nhs_number: String,
}

/// Section 2 — Clinician Information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicianInformation {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// NHS employee number.
    pub nhs_employee_number: String,
}

/// Section 3 — Prescription Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrescriptionDetails {
    /// Request date.
    pub request_date: String,
    /// Medication name.
    pub medication_name: String,
    /// Dosage.
    pub dosage: String,
    /// Frequency.
    pub frequency: String,
    /// Route of administration.
    pub route_of_administration: RouteOfAdministration,
    /// Treatment instructions.
    pub treatment_instructions: String,
}

/// Section 4 — Substitution Options.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstitutionOptions {
    /// Allow brand substitution.
    pub allow_brand_substitution: YesNo,
    /// Allow generic substitution.
    pub allow_generic_substitution: YesNo,
    /// Allow dosage adjustment.
    pub allow_dosage_adjustment: YesNo,
    /// Substitution notes.
    pub substitution_notes: String,
}

/// Section 5 — Request Type.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestType {
    /// Is new prescription.
    pub is_new_prescription: YesNo,
    /// Is emergency.
    pub is_emergency: YesNo,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full prescription-request assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Clinician information.
    pub clinician_information: ClinicianInformation,
    /// Prescription details.
    pub prescription_details: PrescriptionDetails,
    /// Substitution options.
    pub substitution_options: SubstitutionOptions,
    /// Request type.
    pub request_type: RequestType,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Priority level.
    pub priority_level: PriorityLevel,
}

/// An additional flag for clinician review, independent of priority level.
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

/// Grading output for a prescription request.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Priority level.
    pub priority_level: PriorityLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
