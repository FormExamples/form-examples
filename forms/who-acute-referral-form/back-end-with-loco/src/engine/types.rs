//! Core types for the WHO Acute Referral Form data-collection engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority {
    /// Urgent.
    Urgent,
    /// High.
    High,
    /// Medium.
    Medium,
    /// Low.
    Low,
}

impl FlagPriority {
    /// Label.
    #[allow(dead_code)]
    pub fn label(self) -> &'static str {
        match self {
            FlagPriority::Urgent => "Urgent",
            FlagPriority::High => "High",
            FlagPriority::Medium => "Medium",
            FlagPriority::Low => "Low",
        }
    }
}

// ──────────────────────────────────────────────
// Step 1 — Patient Identification
// ──────────────────────────────────────────────

/// Emergency contact.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmergencyContact {
    /// Name.
    pub name: String,
    /// Contact information.
    pub contact_information: String,
}

/// Patient identification.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientIdentification {
    /// Patient last name.
    pub patient_last_name: String,
    /// Patient first name.
    pub patient_first_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// "" | "male" | "female" | "unknown"
    pub sex: String,
    /// Patient contact information.
    pub patient_contact_information: String,
    /// Emergency contact.
    pub emergency_contact: EmergencyContact,
}

// ──────────────────────────────────────────────
// Step 2 — Facility & Transport
// ──────────────────────────────────────────────

/// Facility details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityDetails {
    /// Name.
    pub name: String,
    /// Focal point.
    pub focal_point: String,
    /// Phone number.
    pub phone_number: String,
}

/// Ambulance details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AmbulanceDetails {
    /// Name.
    pub name: String,
    /// Focal point.
    pub focal_point: String,
    /// Phone number.
    pub phone_number: String,
}

/// Facility and transport.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityAndTransport {
    /// Initiating facility.
    pub initiating_facility: FacilityDetails,
    /// Reason for referral.
    pub reason_for_referral: String,
    /// Referral facility contacted.
    pub referral_facility_contacted: bool,
    /// Referral facility.
    pub referral_facility: FacilityDetails,
    /// Ambulance.
    pub ambulance: AmbulanceDetails,
    /// Transfer decision date time.
    pub transfer_decision_date_time: String,
    /// Departure date time.
    pub departure_date_time: String,
    /// "" | "ground" | "air" | "sea"
    pub mode_of_transfer: String,
}

// ──────────────────────────────────────────────
// Step 3 — Situation
// ──────────────────────────────────────────────

/// Situation.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Situation {
    /// Chief complaint.
    pub chief_complaint: String,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// "" | "yes" | "no" | "unknown"
    pub pregnant: String,
    /// Other acute diagnoses.
    pub other_acute_diagnoses: String,
    /// Treatments initiated.
    pub treatments_initiated: String,
}

// ──────────────────────────────────────────────
// Step 4 — Background (history + ABCDE)
// ──────────────────────────────────────────────

/// Abcde entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AbcdeEntry {
    /// Finding normal.
    pub finding_normal: bool,
    /// Finding details.
    pub finding_details: String,
    /// Intervention none.
    pub intervention_none: bool,
    /// Intervention details.
    pub intervention_details: String,
}

/// Background.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    /// History of present illness.
    pub history_of_present_illness: String,
    /// Past medical and surgical history.
    pub past_medical_and_surgical_history: String,
    /// Airway.
    pub airway: AbcdeEntry,
    /// Breathing.
    pub breathing: AbcdeEntry,
    /// Circulation.
    pub circulation: AbcdeEntry,
    /// Disability.
    pub disability: AbcdeEntry,
    /// Exposure.
    pub exposure: AbcdeEntry,
    /// Other significant treatments.
    pub other_significant_treatments: String,
}

// ──────────────────────────────────────────────
// Step 5 — Assessment (clinical assessment + vital signs)
// ──────────────────────────────────────────────

/// Vital signs.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
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
    /// Glasgow coma scale.
    pub glasgow_coma_scale: Option<f64>,
}

/// Assessment.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assessment {
    /// Clinical assessment.
    pub clinical_assessment: String,
    /// Vital signs.
    pub vital_signs: VitalSigns,
}

// ──────────────────────────────────────────────
// Step 6 — Recommendations
// ──────────────────────────────────────────────

/// Precautions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Precautions {
    /// Highly infectious disease.
    pub highly_infectious_disease: bool,
    /// Spinal precautions.
    pub spinal_precautions: bool,
    /// Weight bearing restrictions.
    pub weight_bearing_restrictions: bool,
    /// Fall risk.
    pub fall_risk: bool,
    /// Aspiration risk.
    pub aspiration_risk: bool,
    /// Other.
    pub other: bool,
    /// Other details.
    pub other_details: String,
}

/// Recommendations.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendations {
    /// Treatment plan during transport.
    pub treatment_plan_during_transport: String,
    /// Potential worsening of condition.
    pub potential_worsening_of_condition: String,
    /// Cautions regarding prior therapies.
    pub cautions_regarding_prior_therapies: String,
    /// Precautions.
    pub precautions: Precautions,
}

// ──────────────────────────────────────────────
// Step 7 — Provider Sign-off (initiating facility)
// ──────────────────────────────────────────────

/// Initiating provider signoff.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitiatingProviderSignoff {
    /// Provider name.
    pub provider_name: String,
    /// Signature.
    pub signature: String,
    /// Signature date.
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Step 8 — Referral Facility Receipt
// ──────────────────────────────────────────────

/// Referral facility receipt.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralFacilityReceipt {
    /// Patient arrival date time.
    pub patient_arrival_date_time: String,
    /// Receiving provider name.
    pub receiving_provider_name: String,
    /// Receiving provider signature.
    pub receiving_provider_signature: String,
    /// Feedback provided to initiating facility.
    pub feedback_provided_to_initiating_facility: bool,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient identification.
    pub patient_identification: PatientIdentification,
    /// Facility and transport.
    pub facility_and_transport: FacilityAndTransport,
    /// Situation.
    pub situation: Situation,
    /// Background.
    pub background: Background,
    /// Assessment.
    pub assessment: Assessment,
    /// Recommendations.
    pub recommendations: Recommendations,
    /// Initiating provider signoff.
    pub initiating_provider_signoff: InitiatingProviderSignoff,
    /// Referral facility receipt.
    pub referral_facility_receipt: ReferralFacilityReceipt,
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/// A fired rule: a required field that has not been satisfied.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Section.
    pub section: String,
    /// Description.
    pub description: String,
}

/// Per-section completeness summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    /// Section.
    pub section: String,
    /// Section label.
    pub section_label: String,
    /// Required.
    pub required: u32,
    /// Satisfied.
    pub satisfied: u32,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// Validation result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Complete.
    pub complete: bool,
    /// Total required.
    pub total_required: u32,
    /// Total satisfied.
    pub total_satisfied: u32,
    /// Sections.
    pub sections: Vec<SectionCompleteness>,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// Flagged issue.
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

/// The full report result persisted into the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportResult {
    /// Validation.
    pub validation: ValidationResult,
    /// Flagged issues.
    pub flagged_issues: Vec<FlaggedIssue>,
    /// Timestamp.
    pub timestamp: String,
}
