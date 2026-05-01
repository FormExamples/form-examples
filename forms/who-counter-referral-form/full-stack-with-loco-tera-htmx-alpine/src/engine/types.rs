//! Core types for the WHO Counter-Referral Form data-collection engine.
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
    pub patient_name: String,
    pub date_of_birth: String,
    /// "" | "male" | "female" | "unknown"
    pub sex: String,
    pub patient_contact: String,
    pub emergency_contact: EmergencyContact,
}

// ──────────────────────────────────────────────
// Step 2 — Facility Details
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityContact {
    pub name: String,
    pub focal_point: String,
    pub phone_number: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityCommunication {
    pub discussed_with_primary_care_provider: bool,
    pub discussed_with_initiating_facility: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityDetails {
    pub initiating_facility: FacilityContact,
    pub referral_date: String,
    pub referral_reason: String,
    /// "" | "acute" | "non-acute"
    pub acuity: String,
    pub referral_facility: FacilityContact,
    pub communication: FacilityCommunication,
    pub primary_care_facility: FacilityContact,
    /// "" | "urgent-within-24-hours" | "2-to-6-days" | "1-to-2-weeks" | "more-than-2-weeks"
    pub follow_up_timeframe: String,
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
    pub treatments_initiated: String,
    pub icu_stay: bool,
    pub surgery: bool,
    pub hospitalized: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Background
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    pub history_of_present_illness: String,
    pub past_medical_history: String,
    pub significant_events: String,
}

// ──────────────────────────────────────────────
// Step 5 — Assessment
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assessment {
    pub final_diagnoses: String,
    pub prognosis_and_goals_of_care: String,
    /// "" | "yes" | "no"
    pub patient_family_informed: String,
    pub informed_explanation: String,
}

// ──────────────────────────────────────────────
// Step 6 — Recommendations
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusFlags {
    pub cognitive_impairment: bool,
    pub carer_dependent: bool,
    pub spinal_precautions: bool,
    pub weight_bearing_restrictions: bool,
    pub palliative_care: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendations {
    pub follow_up_plan: String,
    pub pending_investigations: String,
    pub follow_up_arrangements: String,
    pub deterioration_instructions: String,
    pub contact_name: String,
    pub contact_information: String,
    pub status_flags: StatusFlags,
}

// ──────────────────────────────────────────────
// Step 7 — Provider Sign-off
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderSignOff {
    pub provider_name: String,
    pub signature: String,
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Full counter-referral data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_identification: PatientIdentification,
    pub facility_details: FacilityDetails,
    pub situation: Situation,
    pub background: Background,
    pub assessment: Assessment,
    pub recommendations: Recommendations,
    pub provider_sign_off: ProviderSignOff,
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
