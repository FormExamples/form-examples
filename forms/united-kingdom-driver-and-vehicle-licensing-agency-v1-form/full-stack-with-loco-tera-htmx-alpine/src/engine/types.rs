//! Core types for the DVLA V1 (vision) data-collection engine.
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
// Step 1 — Personal Details (Part A)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalDetails {
    pub title: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub address: String,
    pub postcode: String,
    pub email: String,
    pub contact_number: String,
    pub change_of_details: String,
}

// ──────────────────────────────────────────────
// Step 2 — Healthcare Professionals (Part B)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    pub name: String,
    pub surgery_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    pub name: String,
    pub speciality: String,
    pub department: String,
    pub hospital_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    pub gp: GpDetails,
    pub consultant: ConsultantDetails,
}

// ──────────────────────────────────────────────
// Step 3 — Q1 Eyesight Standards
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EyesightStandards {
    /// "" | "yes-without-correction" | "yes-with-correction" | "no"
    pub meets_standard: String,
}

// ──────────────────────────────────────────────
// Step 4 — Q2 Vision in Both Eyes / Monocular
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionInBothEyes {
    /// "" | "yes" | "no"
    pub has_vision_in_both_eyes: String,
    /// "" | "left" | "right"
    pub which_eye: String,
    /// "" | "since-birth-or-childhood" | "health-or-injury"
    pub duration: String,
    /// "" | "adapted-advised" | "adapted-self" | "not-adapted"
    pub adaptation: String,
    pub monocular_declaration_confirmed: bool,
}

// ──────────────────────────────────────────────
// Step 5 — Q3 Field of Vision
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldOfVision {
    pub has_problem: String,
    pub caused_solely_by_eye_condition: String,
    /// "" | "brain-tumour" | "head-injury" | "stroke" | "other"
    pub cause: String,
    pub cause_other_details: String,
}

// ──────────────────────────────────────────────
// Step 6 — Q4 Glaucoma
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Glaucoma {
    pub has_condition: String,
    /// "" | "both" | "left" | "right"
    pub which_eyes: String,
}

// ──────────────────────────────────────────────
// Step 7 — Q5 Retinitis Pigmentosa
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RetinitisPigmentosa {
    pub has_condition: String,
    pub which_eyes: String,
}

// ──────────────────────────────────────────────
// Step 8 — Q6 Laser Treatment
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaserTreatment {
    pub has_had_treatment: String,
    pub left_eye_first_date: String,
    pub right_eye_first_date: String,
    pub left_eye_last_date: String,
    pub right_eye_last_date: String,
}

// ──────────────────────────────────────────────
// Step 9 — Q7 Blepharospasm
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blepharospasm {
    pub has_condition: String,
    pub which_eyes: String,
    pub has_had_treatment: String,
    pub adequately_controlled: String,
}

// ──────────────────────────────────────────────
// Step 10 — Q8 Night Blindness
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NightBlindness {
    pub has_condition: String,
    pub which_eyes: String,
}

// ──────────────────────────────────────────────
// Step 11 — Q9 Double Vision
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoubleVision {
    pub has_condition: String,
    pub controlled: String,
    pub same_for_six_months_or_more: String,
    pub double_vision_declaration_confirmed: bool,
    pub declaration_signature_name: String,
    pub declaration_date: String,
}

// ──────────────────────────────────────────────
// Step 12 — Q10 Other Vision Conditions
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtherVisionConditions {
    pub has_other: String,
    pub details: String,
}

// ──────────────────────────────────────────────
// Step 13 — Q11 Recent Contact
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentContact {
    pub had_contact: String,
    pub date_of_contact: String,
}

// ──────────────────────────────────────────────
// Step 14 — Authorisation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    pub declaration_confirmed: bool,
    pub name: String,
    pub signature: String,
    pub date: String,
    /// "" | "yes" | "no"
    pub authorise_electronic_correspondence: String,
    /// "" | "email" | "sms"
    pub contact_preference_from_healthcare_professional: String,
    /// "" | "email" | "sms"
    pub contact_preference_from_dvla: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub personal_details: PersonalDetails,
    pub healthcare_professionals: HealthcareProfessionals,
    pub eyesight_standards: EyesightStandards,
    pub vision_in_both_eyes: VisionInBothEyes,
    pub field_of_vision: FieldOfVision,
    pub glaucoma: Glaucoma,
    pub retinitis_pigmentosa: RetinitisPigmentosa,
    pub laser_treatment: LaserTreatment,
    pub blepharospasm: Blepharospasm,
    pub night_blindness: NightBlindness,
    pub double_vision: DoubleVision,
    pub other_vision_conditions: OtherVisionConditions,
    pub recent_contact: RecentContact,
    pub authorisation: Authorisation,
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
    pub message: String,
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
