//! Core types for the WHO Acute Referral Form data-collection engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority {
    Urgent,
    High,
    Medium,
    Low,
}

impl FlagPriority {
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

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmergencyContact {
    pub name: String,
    pub contact_information: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientIdentification {
    pub patient_last_name: String,
    pub patient_first_name: String,
    pub date_of_birth: String,
    /// "" | "male" | "female" | "unknown"
    pub sex: String,
    pub patient_contact_information: String,
    pub emergency_contact: EmergencyContact,
}

// ──────────────────────────────────────────────
// Step 2 — Facility & Transport
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityDetails {
    pub name: String,
    pub focal_point: String,
    pub phone_number: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AmbulanceDetails {
    pub name: String,
    pub focal_point: String,
    pub phone_number: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityAndTransport {
    pub initiating_facility: FacilityDetails,
    pub reason_for_referral: String,
    pub referral_facility_contacted: bool,
    pub referral_facility: FacilityDetails,
    pub ambulance: AmbulanceDetails,
    pub transfer_decision_date_time: String,
    pub departure_date_time: String,
    /// "" | "ground" | "air" | "sea"
    pub mode_of_transfer: String,
}

// ──────────────────────────────────────────────
// Step 3 — Situation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Situation {
    pub chief_complaint: String,
    pub primary_diagnosis: String,
    /// "" | "yes" | "no" | "unknown"
    pub pregnant: String,
    pub other_acute_diagnoses: String,
    pub treatments_initiated: String,
}

// ──────────────────────────────────────────────
// Step 4 — Background (history + ABCDE)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AbcdeEntry {
    pub finding_normal: bool,
    pub finding_details: String,
    pub intervention_none: bool,
    pub intervention_details: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    pub history_of_present_illness: String,
    pub past_medical_and_surgical_history: String,
    pub airway: AbcdeEntry,
    pub breathing: AbcdeEntry,
    pub circulation: AbcdeEntry,
    pub disability: AbcdeEntry,
    pub exposure: AbcdeEntry,
    pub other_significant_treatments: String,
}

// ──────────────────────────────────────────────
// Step 5 — Assessment (clinical assessment + vital signs)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    pub heart_rate: Option<f64>,
    pub respiratory_rate: Option<f64>,
    pub systolic_blood_pressure: Option<f64>,
    pub diastolic_blood_pressure: Option<f64>,
    pub temperature_celsius: Option<f64>,
    pub oxygen_saturation: Option<f64>,
    pub glasgow_coma_scale: Option<f64>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assessment {
    pub clinical_assessment: String,
    pub vital_signs: VitalSigns,
}

// ──────────────────────────────────────────────
// Step 6 — Recommendations
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Precautions {
    pub highly_infectious_disease: bool,
    pub spinal_precautions: bool,
    pub weight_bearing_restrictions: bool,
    pub fall_risk: bool,
    pub aspiration_risk: bool,
    pub other: bool,
    pub other_details: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendations {
    pub treatment_plan_during_transport: String,
    pub potential_worsening_of_condition: String,
    pub cautions_regarding_prior_therapies: String,
    pub precautions: Precautions,
}

// ──────────────────────────────────────────────
// Step 7 — Provider Sign-off (initiating facility)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitiatingProviderSignoff {
    pub provider_name: String,
    pub signature: String,
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Step 8 — Referral Facility Receipt
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralFacilityReceipt {
    pub patient_arrival_date_time: String,
    pub receiving_provider_name: String,
    pub receiving_provider_signature: String,
    pub feedback_provided_to_initiating_facility: bool,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_identification: PatientIdentification,
    pub facility_and_transport: FacilityAndTransport,
    pub situation: Situation,
    pub background: Background,
    pub assessment: Assessment,
    pub recommendations: Recommendations,
    pub initiating_provider_signoff: InitiatingProviderSignoff,
    pub referral_facility_receipt: ReferralFacilityReceipt,
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/// A fired rule: a required field that has not been satisfied.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub section: String,
    pub description: String,
}

/// Per-section completeness summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    pub section: String,
    pub section_label: String,
    pub required: u32,
    pub satisfied: u32,
    pub missing: Vec<FiredRule>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub sections: Vec<SectionCompleteness>,
    pub missing: Vec<FiredRule>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: FlagPriority,
}
