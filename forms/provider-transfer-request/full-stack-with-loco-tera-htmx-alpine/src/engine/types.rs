use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNoUnknown = String;
pub type Sex = String;
pub type TransferUrgency = String;
pub type TransferType = String;
pub type TransportMode = String;
pub type ConsciousLevel = String;
pub type FlagPriority = String;
pub type CompletenessLevel = String;

/// Requesting / receiving provider details (Steps 1 & 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderDetails {
    pub clinician_name: String,
    pub clinician_role: String,
    pub organisation: String,
    pub ward: String,
    pub phone: String,
    pub email: String,
    pub registration_body: String,
    pub registration_number: String,
}

/// Patient demographics (Step 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDemographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub nhs_number: String,
    pub hospital_number: String,
    pub address_line: String,
    pub postcode: String,
    pub next_of_kin_name: String,
    pub next_of_kin_phone: String,
}

/// Situation (Step 4) — Reason for transfer.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Situation {
    pub reason_for_transfer: String,
    pub primary_diagnosis: String,
    pub urgency: TransferUrgency,
    pub transfer_type: TransferType,
    pub requested_date_time: String,
}

/// Background (Step 5) — Relevant history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    pub presenting_complaint: String,
    pub relevant_history: String,
    pub past_medical_history: String,
    pub current_medications: String,
    pub allergies: String,
    pub recent_investigations: String,
    pub infection_status: String,
}

/// Vital signs sub-object (Step 6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    pub heart_rate: Option<f64>,
    pub respiratory_rate: Option<f64>,
    pub systolic_blood_pressure: Option<f64>,
    pub diastolic_blood_pressure: Option<f64>,
    pub temperature_celsius: Option<f64>,
    pub oxygen_saturation: Option<f64>,
    pub news_score: Option<f64>,
}

/// Assessment (Step 6) — Current clinical status.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assessment {
    pub current_clinical_status: String,
    pub conscious_level: ConsciousLevel,
    pub vital_signs: VitalSigns,
    pub clinically_stable: YesNoUnknown,
    pub stability_notes: String,
}

/// Recommendation (Step 7) — Requested action.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendation {
    pub requested_action: String,
    pub expected_outcomes: String,
    pub ongoing_care_plan: String,
    pub pending_results: String,
}

/// Transfer logistics (Step 8).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferLogistics {
    pub transport_mode: TransportMode,
    pub departure_date_time: String,
    pub estimated_arrival_date_time: String,
    pub escort_required: bool,
    pub escort_details: String,
    pub oxygen_required: bool,
    pub cardiac_monitoring_required: bool,
    pub infectious_precautions: bool,
    pub infectious_precautions_details: String,
    pub falls_risk: bool,
    pub mental_capacity_concerns: bool,
    pub equipment_required: String,
}

/// Sign-off & acknowledgement (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignoffAcknowledgement {
    pub requesting_provider_signature: String,
    pub requesting_provider_signature_date: String,
    pub receiving_provider_name: String,
    pub receiving_provider_signature: String,
    pub receiving_provider_signature_date: String,
    pub acknowledgement_received: bool,
    pub acknowledgement_notes: String,
}

/// Full Provider Transfer Request assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub requesting_provider: ProviderDetails,
    pub receiving_provider: ProviderDetails,
    pub patient_demographics: PatientDemographics,
    pub situation: Situation,
    pub background: Background,
    pub assessment: Assessment,
    pub recommendation: Recommendation,
    pub transfer_logistics: TransferLogistics,
    pub signoff_acknowledgement: SignoffAcknowledgement,
}

/// A rule that fired during grading (i.e. a required item was unsatisfied).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub section: String,
    pub description: String,
    pub mandatory: bool,
}

/// Per-section completeness summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    pub section: String,
    pub required: u32,
    pub satisfied: u32,
    pub mandatory_required: u32,
    pub mandatory_satisfied: u32,
    pub missing: Vec<FiredRule>,
}

/// Output of `validate_transfer`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    pub completeness: CompletenessLevel,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub mandatory_required: u32,
    pub mandatory_satisfied: u32,
    pub sections: Vec<SectionCompleteness>,
    pub missing: Vec<FiredRule>,
}

/// A clinically significant flag raised by the flagged-issues engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: FlagPriority,
}

/// Grading output assembled from the validator + flagged issues + timestamp.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub validation: ValidationResult,
    pub flags: Vec<FlaggedIssue>,
    pub timestamp: String,
}
