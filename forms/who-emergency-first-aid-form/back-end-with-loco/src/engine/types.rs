//! Core types for the WHO Emergency First Aid Form data-collection engine.
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

/// Contact person.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContactPerson {
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
    /// Age.
    pub age: Option<f64>,
    /// "" | "male" | "female" | "unknown"
    pub sex: String,
    /// Patient contact information.
    pub patient_contact_information: String,
    /// Contact person.
    pub contact_person: ContactPerson,
}

// ──────────────────────────────────────────────
// Step 2 — Referral & Transport
// ──────────────────────────────────────────────

/// Referral facility.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralFacility {
    /// Name.
    pub name: String,
    /// Focal point.
    pub focal_point: String,
    /// Phone number.
    pub phone_number: String,
}

/// Ambulance service.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AmbulanceService {
    /// Name.
    pub name: String,
    /// Focal point.
    pub focal_point: String,
    /// Phone number.
    pub phone_number: String,
}

/// Referral transport.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralTransport {
    /// Referral facility.
    pub referral_facility: ReferralFacility,
    /// Ambulance.
    pub ambulance: AmbulanceService,
    /// Event date time.
    pub event_date_time: String,
    /// Departure date time.
    pub departure_date_time: String,
}

// ──────────────────────────────────────────────
// Step 3 — Situation
// ──────────────────────────────────────────────

/// Situation.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Situation {
    /// Medical.
    pub medical: bool,
    /// Trauma.
    pub trauma: bool,
    /// "" | "yes" | "no" | "unknown"
    pub pregnant: String,
    /// What happened.
    pub what_happened: String,
}

// ──────────────────────────────────────────────
// Step 4 — Background
// ──────────────────────────────────────────────

/// Background.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Background {
    /// Past medical and surgical history.
    pub past_medical_and_surgical_history: String,
    /// Current medications or allergies.
    pub current_medications_or_allergies: String,
}

// ──────────────────────────────────────────────
// Step 5 — Major Bleeding (C)
// ──────────────────────────────────────────────

/// Major bleeding interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MajorBleedingInterventions {
    /// Direct pressure.
    pub direct_pressure: bool,
    /// Deep wound packing.
    pub deep_wound_packing: bool,
    /// Tourniquet.
    pub tourniquet: bool,
    /// Tourniquet application time.
    pub tourniquet_application_time: String,
    /// Uterine massage.
    pub uterine_massage: bool,
    /// None.
    pub none: bool,
}

/// Major bleeding.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MajorBleeding {
    /// Assessment normal.
    pub assessment_normal: bool,
    /// Assessment findings.
    pub assessment_findings: String,
    /// Interventions.
    pub interventions: MajorBleedingInterventions,
}

// ──────────────────────────────────────────────
// Step 6 — Airway (A)
// ──────────────────────────────────────────────

/// Airway interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AirwayInterventions {
    /// Neck immobilization.
    pub neck_immobilization: bool,
    /// Head tilt chin lift.
    pub head_tilt_chin_lift: bool,
    /// Jaw thrust.
    pub jaw_thrust: bool,
    /// Choking care.
    pub choking_care: bool,
    /// None.
    pub none: bool,
}

/// Airway.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    /// Assessment normal.
    pub assessment_normal: bool,
    /// Assessment findings.
    pub assessment_findings: String,
    /// Interventions.
    pub interventions: AirwayInterventions,
}

// ──────────────────────────────────────────────
// Step 7 — Breathing (B)
// ──────────────────────────────────────────────

/// Breathing interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BreathingInterventions {
    /// Maintained position of comfort.
    pub maintained_position_of_comfort: bool,
    /// None.
    pub none: bool,
}

/// Breathing.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Breathing {
    /// Assessment normal.
    pub assessment_normal: bool,
    /// Assessment findings.
    pub assessment_findings: String,
    /// Interventions.
    pub interventions: BreathingInterventions,
}

// ──────────────────────────────────────────────
// Step 8 — Circulation (C)
// ──────────────────────────────────────────────

/// Circulation interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CirculationInterventions {
    /// Pelvic binder.
    pub pelvic_binder: bool,
    /// Control minor bleeding.
    pub control_minor_bleeding: bool,
    /// Fracture care.
    pub fracture_care: bool,
    /// Oral hydration.
    pub oral_hydration: bool,
    /// Left lateral position.
    pub left_lateral_position: bool,
    /// None.
    pub none: bool,
}

/// Circulation.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Circulation {
    /// Assessment normal.
    pub assessment_normal: bool,
    /// Assessment findings.
    pub assessment_findings: String,
    /// Interventions.
    pub interventions: CirculationInterventions,
}

// ──────────────────────────────────────────────
// Step 9 — Disability (D)
// ──────────────────────────────────────────────

/// Disability interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DisabilityInterventions {
    /// Spinal immobilisation.
    pub spinal_immobilisation: bool,
    /// Glucose given.
    pub glucose_given: bool,
    /// Seizure care.
    pub seizure_care: bool,
    /// High temperature care.
    pub high_temperature_care: bool,
    /// Low temperature care.
    pub low_temperature_care: bool,
    /// None.
    pub none: bool,
}

/// Disability.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    /// Assessment normal.
    pub assessment_normal: bool,
    /// Assessment findings.
    pub assessment_findings: String,
    /// Interventions.
    pub interventions: DisabilityInterventions,
}

// ──────────────────────────────────────────────
// Step 10 — Exposure / Other (E)
// ──────────────────────────────────────────────

/// Exposure interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExposureInterventions {
    /// Recovery position.
    pub recovery_position: bool,
    /// Burn care.
    pub burn_care: bool,
    /// Wound care.
    pub wound_care: bool,
    /// Drowning care.
    pub drowning_care: bool,
    /// Snakebite care.
    pub snakebite_care: bool,
    /// None.
    pub none: bool,
}

/// Exposure.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Exposure {
    /// Assessment normal.
    pub assessment_normal: bool,
    /// Assessment findings.
    pub assessment_findings: String,
    /// Interventions.
    pub interventions: ExposureInterventions,
    /// Medication taken none.
    pub medication_taken_none: bool,
    /// Medication taken details.
    pub medication_taken_details: String,
}

// ──────────────────────────────────────────────
// Step 11 — Recommendations
// ──────────────────────────────────────────────

/// Precautions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Precautions {
    /// Highly infectious disease.
    pub highly_infectious_disease: bool,
    /// Spinal immobilization.
    pub spinal_immobilization: bool,
    /// Possible fracture.
    pub possible_fracture: bool,
    /// Fall risk.
    pub fall_risk: bool,
    /// Altered mental status.
    pub altered_mental_status: bool,
    /// Other.
    pub other: bool,
    /// Other details.
    pub other_details: String,
}

/// Recommendations.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendations {
    /// Transport plan.
    pub transport_plan: String,
    /// Problems anticipated.
    pub problems_anticipated: String,
    /// Other concerns.
    pub other_concerns: String,
    /// Precautions.
    pub precautions: Precautions,
}

// ──────────────────────────────────────────────
// Step 12 — Responder Details (CFAR)
// ──────────────────────────────────────────────

/// Responder details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponderDetails {
    /// Name.
    pub name: String,
    /// Signature.
    pub signature: String,
    /// Contact information.
    pub contact_information: String,
    /// Cfar organization.
    pub cfar_organization: String,
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
    /// Referral transport.
    pub referral_transport: ReferralTransport,
    /// Situation.
    pub situation: Situation,
    /// Background.
    pub background: Background,
    /// Major bleeding.
    pub major_bleeding: MajorBleeding,
    /// Airway.
    pub airway: Airway,
    /// Breathing.
    pub breathing: Breathing,
    /// Circulation.
    pub circulation: Circulation,
    /// Disability.
    pub disability: Disability,
    /// Exposure.
    pub exposure: Exposure,
    /// Recommendations.
    pub recommendations: Recommendations,
    /// Responder details.
    pub responder_details: ResponderDetails,
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

/// Top-level grading result persisted to the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Validation.
    pub validation: ValidationResult,
    /// Flagged issues.
    pub flagged_issues: Vec<FlaggedIssue>,
    /// Timestamp.
    pub timestamp: String,
}
