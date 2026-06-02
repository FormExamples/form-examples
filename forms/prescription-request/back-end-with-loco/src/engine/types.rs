use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
pub type YesNo = String;
pub type PriorityLevel = String;
pub type RouteOfAdministration = String;

/// Section 1 — Patient Information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub email: String,
    pub nhs_number: String,
}

/// Section 2 — Clinician Information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicianInformation {
    pub first_name: String,
    pub last_name: String,
    pub phone: String,
    pub email: String,
    pub nhs_employee_number: String,
}

/// Section 3 — Prescription Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrescriptionDetails {
    pub request_date: String,
    pub medication_name: String,
    pub dosage: String,
    pub frequency: String,
    pub route_of_administration: RouteOfAdministration,
    pub treatment_instructions: String,
}

/// Section 4 — Substitution Options.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstitutionOptions {
    pub allow_brand_substitution: YesNo,
    pub allow_generic_substitution: YesNo,
    pub allow_dosage_adjustment: YesNo,
    pub substitution_notes: String,
}

/// Section 5 — Request Type.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestType {
    pub is_new_prescription: YesNo,
    pub is_emergency: YesNo,
    pub additional_notes: String,
}

/// Full prescription-request assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_information: PatientInformation,
    pub clinician_information: ClinicianInformation,
    pub prescription_details: PrescriptionDetails,
    pub substitution_options: SubstitutionOptions,
    pub request_type: RequestType,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub priority_level: PriorityLevel,
}

/// An additional flag for clinician review, independent of priority level.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a prescription request.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub priority_level: PriorityLevel,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
