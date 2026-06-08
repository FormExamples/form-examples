//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no unknown.
pub type YesNoUnknown = String;
/// Sex.
pub type Sex = String;
/// Transfer urgency.
pub type TransferUrgency = String;
/// Transfer type.
pub type TransferType = String;
/// Transport mode.
pub type TransportMode = String;
/// Conscious level.
pub type ConsciousLevel = String;
/// Flag priority.
pub type FlagPriority = String;
/// Completeness level.
pub type CompletenessLevel = String;

/// Requesting / receiving provider details (Steps 1 & 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderDetails {
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
    /// Organisation.
    pub organisation: String,
    /// Ward.
    pub ward: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// Registration body.
    pub registration_body: String,
    /// Registration number.
    pub registration_number: String,
}

/// Patient demographics (Step 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDemographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// NHS number.
    pub nhs_number: String,
    /// Hospital number.
    pub hospital_number: String,
    /// Address line.
    pub address_line: String,
    /// Postcode.
    pub postcode: String,
    /// Next of kin name.
    pub next_of_kin_name: String,
    /// Next of kin phone.
    pub next_of_kin_phone: String,
}

/// Situation (Step 4) — Reason for transfer.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Situation {
    /// Reason for transfer.
    pub reason_for_transfer: String,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Urgency.
    pub urgency: TransferUrgency,
    /// Transfer type.
    pub transfer_type: TransferType,
    /// Requested date time.
    pub requested_date_time: String,
}

/// Background (Step 5) — Relevant history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    /// Presenting complaint.
    pub presenting_complaint: String,
    /// Relevant history.
    pub relevant_history: String,
    /// Past medical history.
    pub past_medical_history: String,
    /// Current medications.
    pub current_medications: String,
    /// Allergies.
    pub allergies: String,
    /// Recent investigations.
    pub recent_investigations: String,
    /// Infection status.
    pub infection_status: String,
}

/// Vital signs sub-object (Step 6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    /// Heart rate.
    pub heart_rate: Option<f64>,
    /// Respiratory rate.
    pub respiratory_rate: Option<f64>,
    /// Systolic blood pressure.
    pub systolic_blood_pressure: Option<f64>,
    /// Diastolic blood pressure.
    pub diastolic_blood_pressure: Option<f64>,
    /// Temperature celsius.
    pub temperature_celsius: Option<f64>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<f64>,
    /// News score.
    pub news_score: Option<f64>,
}

/// Assessment (Step 6) — Current clinical status.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assessment {
    /// Current clinical status.
    pub current_clinical_status: String,
    /// Conscious level.
    pub conscious_level: ConsciousLevel,
    /// Vital signs.
    pub vital_signs: VitalSigns,
    /// Clinically stable.
    pub clinically_stable: YesNoUnknown,
    /// Stability notes.
    pub stability_notes: String,
}

/// Recommendation (Step 7) — Requested action.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendation {
    /// Requested action.
    pub requested_action: String,
    /// Expected outcomes.
    pub expected_outcomes: String,
    /// Ongoing care plan.
    pub ongoing_care_plan: String,
    /// Pending results.
    pub pending_results: String,
}

/// Transfer logistics (Step 8).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferLogistics {
    /// Transport mode.
    pub transport_mode: TransportMode,
    /// Departure date time.
    pub departure_date_time: String,
    /// Estimated arrival date time.
    pub estimated_arrival_date_time: String,
    /// Escort required.
    pub escort_required: bool,
    /// Escort details.
    pub escort_details: String,
    /// Oxygen required.
    pub oxygen_required: bool,
    /// Cardiac monitoring required.
    pub cardiac_monitoring_required: bool,
    /// Infectious precautions.
    pub infectious_precautions: bool,
    /// Infectious precautions details.
    pub infectious_precautions_details: String,
    /// Falls risk.
    pub falls_risk: bool,
    /// Mental capacity concerns.
    pub mental_capacity_concerns: bool,
    /// Equipment required.
    pub equipment_required: String,
}

/// Sign-off & acknowledgement (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignoffAcknowledgement {
    /// Requesting provider signature.
    pub requesting_provider_signature: String,
    /// Requesting provider signature date.
    pub requesting_provider_signature_date: String,
    /// Receiving provider name.
    pub receiving_provider_name: String,
    /// Receiving provider signature.
    pub receiving_provider_signature: String,
    /// Receiving provider signature date.
    pub receiving_provider_signature_date: String,
    /// Acknowledgement received.
    pub acknowledgement_received: bool,
    /// Acknowledgement notes.
    pub acknowledgement_notes: String,
}

/// Full Provider Transfer Request assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Requesting provider.
    pub requesting_provider: ProviderDetails,
    /// Receiving provider.
    pub receiving_provider: ProviderDetails,
    /// Patient demographics.
    pub patient_demographics: PatientDemographics,
    /// Situation.
    pub situation: Situation,
    /// Background.
    pub background: Background,
    /// Assessment.
    pub assessment: Assessment,
    /// Recommendation.
    pub recommendation: Recommendation,
    /// Transfer logistics.
    pub transfer_logistics: TransferLogistics,
    /// Signoff acknowledgement.
    pub signoff_acknowledgement: SignoffAcknowledgement,
}

/// A rule that fired during grading (i.e. a required item was unsatisfied).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Section.
    pub section: String,
    /// Description.
    pub description: String,
    /// Mandatory.
    pub mandatory: bool,
}

/// Per-section completeness summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    /// Section.
    pub section: String,
    /// Required.
    pub required: u32,
    /// Satisfied.
    pub satisfied: u32,
    /// Mandatory required.
    pub mandatory_required: u32,
    /// Mandatory satisfied.
    pub mandatory_satisfied: u32,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// Output of `validate_transfer`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Completeness.
    pub completeness: CompletenessLevel,
    /// Total required.
    pub total_required: u32,
    /// Total satisfied.
    pub total_satisfied: u32,
    /// Mandatory required.
    pub mandatory_required: u32,
    /// Mandatory satisfied.
    pub mandatory_satisfied: u32,
    /// Sections.
    pub sections: Vec<SectionCompleteness>,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// A clinically significant flag raised by the flagged-issues engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: FlagPriority,
}

/// Grading output assembled from the validator + flagged issues + timestamp.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Validation.
    pub validation: ValidationResult,
    /// Flags.
    pub flags: Vec<FlaggedIssue>,
    /// Timestamp.
    pub timestamp: String,
}
