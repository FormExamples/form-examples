//! Core types for the WHO Counter-Referral Form data-collection engine.
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
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// "" | "male" | "female" | "unknown"
    pub sex: String,
    /// Patient contact.
    pub patient_contact: String,
    /// Emergency contact.
    pub emergency_contact: EmergencyContact,
}

// ──────────────────────────────────────────────
// Step 2 — Facility Details
// ──────────────────────────────────────────────

/// Facility contact.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityContact {
    /// Name.
    pub name: String,
    /// Focal point.
    pub focal_point: String,
    /// Phone number.
    pub phone_number: String,
}

/// Facility communication.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityCommunication {
    /// Discussed with primary care provider.
    pub discussed_with_primary_care_provider: bool,
    /// Discussed with initiating facility.
    pub discussed_with_initiating_facility: bool,
}

/// Facility details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FacilityDetails {
    /// Initiating facility.
    pub initiating_facility: FacilityContact,
    /// Referral date.
    pub referral_date: String,
    /// Referral reason.
    pub referral_reason: String,
    /// "" | "acute" | "non-acute"
    pub acuity: String,
    /// Referral facility.
    pub referral_facility: FacilityContact,
    /// Communication.
    pub communication: FacilityCommunication,
    /// Primary care facility.
    pub primary_care_facility: FacilityContact,
    /// "" | "urgent-within-24-hours" | "2-to-6-days" | "1-to-2-weeks" | "more-than-2-weeks"
    pub follow_up_timeframe: String,
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
    /// Treatments initiated.
    pub treatments_initiated: String,
    /// Icu stay.
    pub icu_stay: bool,
    /// Surgery.
    pub surgery: bool,
    /// Hospitalized.
    pub hospitalized: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Background
// ──────────────────────────────────────────────

/// Background.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    /// History of present illness.
    pub history_of_present_illness: String,
    /// Past medical history.
    pub past_medical_history: String,
    /// Significant events.
    pub significant_events: String,
}

// ──────────────────────────────────────────────
// Step 5 — Assessment
// ──────────────────────────────────────────────

/// Assessment.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assessment {
    /// Final diagnoses.
    pub final_diagnoses: String,
    /// Prognosis and goals of care.
    pub prognosis_and_goals_of_care: String,
    /// "" | "yes" | "no"
    pub patient_family_informed: String,
    /// Informed explanation.
    pub informed_explanation: String,
}

// ──────────────────────────────────────────────
// Step 6 — Recommendations
// ──────────────────────────────────────────────

/// Status flags.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusFlags {
    /// Cognitive impairment.
    pub cognitive_impairment: bool,
    /// Carer dependent.
    pub carer_dependent: bool,
    /// Spinal precautions.
    pub spinal_precautions: bool,
    /// Weight bearing restrictions.
    pub weight_bearing_restrictions: bool,
    /// Palliative care.
    pub palliative_care: bool,
}

/// Recommendations.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendations {
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Pending investigations.
    pub pending_investigations: String,
    /// Follow up arrangements.
    pub follow_up_arrangements: String,
    /// Deterioration instructions.
    pub deterioration_instructions: String,
    /// Contact name.
    pub contact_name: String,
    /// Contact information.
    pub contact_information: String,
    /// Status flags.
    pub status_flags: StatusFlags,
}

// ──────────────────────────────────────────────
// Step 7 — Provider Sign-off
// ──────────────────────────────────────────────

/// Provider sign off.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderSignOff {
    /// Provider name.
    pub provider_name: String,
    /// Signature.
    pub signature: String,
    /// Signature date.
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Full counter-referral data model
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient identification.
    pub patient_identification: PatientIdentification,
    /// Facility details.
    pub facility_details: FacilityDetails,
    /// Situation.
    pub situation: Situation,
    /// Background.
    pub background: Background,
    /// Assessment.
    pub assessment: Assessment,
    /// Recommendations.
    pub recommendations: Recommendations,
    /// Provider sign off.
    pub provider_sign_off: ProviderSignOff,
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

/// Grading output for a counter-referral form. Wraps the validation result,
/// flagged issues, and a timestamp for the report view.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Validation.
    pub validation: ValidationResult,
    /// Flagged issues.
    pub flagged_issues: Vec<FlaggedIssue>,
    /// Overall percent.
    pub overall_percent: u32,
    /// Form status.
    pub form_status: String,
    /// Timestamp.
    pub timestamp: String,
}
