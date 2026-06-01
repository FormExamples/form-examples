//! Core types for the WHO Emergency First Aid Form data-collection engine.
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
pub struct ContactPerson {
    pub name: String,
    pub contact_information: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientIdentification {
    pub patient_name: String,
    pub date_of_birth: String,
    pub age: Option<f64>,
    /// "" | "male" | "female" | "unknown"
    pub sex: String,
    pub patient_contact_information: String,
    pub contact_person: ContactPerson,
}

// ──────────────────────────────────────────────
// Step 2 — Referral & Transport
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralFacility {
    pub name: String,
    pub focal_point: String,
    pub phone_number: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AmbulanceService {
    pub name: String,
    pub focal_point: String,
    pub phone_number: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralTransport {
    pub referral_facility: ReferralFacility,
    pub ambulance: AmbulanceService,
    pub event_date_time: String,
    pub departure_date_time: String,
}

// ──────────────────────────────────────────────
// Step 3 — Situation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Situation {
    pub medical: bool,
    pub trauma: bool,
    /// "" | "yes" | "no" | "unknown"
    pub pregnant: String,
    pub what_happened: String,
}

// ──────────────────────────────────────────────
// Step 4 — Background
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    pub past_medical_and_surgical_history: String,
    pub current_medications_or_allergies: String,
}

// ──────────────────────────────────────────────
// Step 5 — Major Bleeding (C)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MajorBleedingInterventions {
    pub direct_pressure: bool,
    pub deep_wound_packing: bool,
    pub tourniquet: bool,
    pub tourniquet_application_time: String,
    pub uterine_massage: bool,
    pub none: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MajorBleeding {
    pub assessment_normal: bool,
    pub assessment_findings: String,
    pub interventions: MajorBleedingInterventions,
}

// ──────────────────────────────────────────────
// Step 6 — Airway (A)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AirwayInterventions {
    pub neck_immobilization: bool,
    pub head_tilt_chin_lift: bool,
    pub jaw_thrust: bool,
    pub choking_care: bool,
    pub none: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    pub assessment_normal: bool,
    pub assessment_findings: String,
    pub interventions: AirwayInterventions,
}

// ──────────────────────────────────────────────
// Step 7 — Breathing (B)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BreathingInterventions {
    pub maintained_position_of_comfort: bool,
    pub none: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Breathing {
    pub assessment_normal: bool,
    pub assessment_findings: String,
    pub interventions: BreathingInterventions,
}

// ──────────────────────────────────────────────
// Step 8 — Circulation (C)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CirculationInterventions {
    pub pelvic_binder: bool,
    pub control_minor_bleeding: bool,
    pub fracture_care: bool,
    pub oral_hydration: bool,
    pub left_lateral_position: bool,
    pub none: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Circulation {
    pub assessment_normal: bool,
    pub assessment_findings: String,
    pub interventions: CirculationInterventions,
}

// ──────────────────────────────────────────────
// Step 9 — Disability (D)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DisabilityInterventions {
    pub spinal_immobilisation: bool,
    pub glucose_given: bool,
    pub seizure_care: bool,
    pub high_temperature_care: bool,
    pub low_temperature_care: bool,
    pub none: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    pub assessment_normal: bool,
    pub assessment_findings: String,
    pub interventions: DisabilityInterventions,
}

// ──────────────────────────────────────────────
// Step 10 — Exposure / Other (E)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExposureInterventions {
    pub recovery_position: bool,
    pub burn_care: bool,
    pub wound_care: bool,
    pub drowning_care: bool,
    pub snakebite_care: bool,
    pub none: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Exposure {
    pub assessment_normal: bool,
    pub assessment_findings: String,
    pub interventions: ExposureInterventions,
    pub medication_taken_none: bool,
    pub medication_taken_details: String,
}

// ──────────────────────────────────────────────
// Step 11 — Recommendations
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Precautions {
    pub highly_infectious_disease: bool,
    pub spinal_immobilization: bool,
    pub possible_fracture: bool,
    pub fall_risk: bool,
    pub altered_mental_status: bool,
    pub other: bool,
    pub other_details: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendations {
    pub transport_plan: String,
    pub problems_anticipated: String,
    pub other_concerns: String,
    pub precautions: Precautions,
}

// ──────────────────────────────────────────────
// Step 12 — Responder Details (CFAR)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponderDetails {
    pub name: String,
    pub signature: String,
    pub contact_information: String,
    pub cfar_organization: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_identification: PatientIdentification,
    pub referral_transport: ReferralTransport,
    pub situation: Situation,
    pub background: Background,
    pub major_bleeding: MajorBleeding,
    pub airway: Airway,
    pub breathing: Breathing,
    pub circulation: Circulation,
    pub disability: Disability,
    pub exposure: Exposure,
    pub recommendations: Recommendations,
    pub responder_details: ResponderDetails,
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

/// Top-level grading result persisted to the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub validation: ValidationResult,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}
