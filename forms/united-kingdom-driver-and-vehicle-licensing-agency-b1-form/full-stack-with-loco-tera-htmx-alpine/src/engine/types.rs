//! Core types for the DVLA B1 (neurological) data-collection engine.
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
    pub address_line1: String,
    pub address_line2: String,
    pub address_line3: String,
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
    pub gp_name: String,
    pub surgery_name: String,
    pub address_line1: String,
    pub address_line2: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    pub consultant_name: String,
    pub speciality: String,
    pub department: String,
    pub hospital_name: String,
    pub address_line1: String,
    pub address_line2: String,
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
// Step 3 — Q1 Condition History
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConditionHistory {
    pub brain_haemorrhage: bool,
    pub brain_haemorrhage_date: String,
    pub brain_haemorrhage_details: String,
    pub severe_head_injury: bool,
    pub severe_head_injury_date: String,
    pub severe_head_injury_details: String,
    pub other_condition: bool,
    pub other_condition_date: String,
    pub other_condition_details: String,
    pub brain_surgery_date: String,
    pub brain_surgery_not_applicable: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Q2 Treatment Provider
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentProvider {
    /// "" | "gp" | "consultant"
    pub last_seen: String,
    pub gp_last_contact_date: String,
    pub gp_next_contact_date: String,
    pub consultant_last_contact_date: String,
    pub consultant_next_contact_date: String,
}

// ──────────────────────────────────────────────
// Step 5 — Q3 Blackouts
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blackouts {
    /// "" | "yes" | "no"
    pub had_blackouts: String,
    pub blackout_date: String,
}

// ──────────────────────────────────────────────
// Step 6 — Q4–Q6 Seizures
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FirstEverSeizure {
    pub date: String,
    pub details: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MultipleSeizureDetails {
    pub two_or_more_within_five_years: String,
    pub first_awake_seizure_date: String,
    pub first_asleep_seizure_date: String,
    pub last_two_awake_seizure_date1: String,
    pub last_two_awake_seizure_date2: String,
    pub last_two_asleep_seizure_date1: String,
    pub last_two_asleep_seizure_date2: String,
    pub first_sleep_attack_after_last_awake_attack_date: String,
    pub affected_consciousness: String,
    pub would_have_affected_driving: String,
    pub attack_description: String,
    pub result_of_medication_advice: String,
    pub date_medication_started_to_reduce: String,
    pub previous_medication_restarted: String,
    pub date_previous_medication_restarted: String,
    pub date_of_last_seizure_prior_to_withdrawal: String,
    pub provoked_seizure_details: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EpilepsyDeclaration {
    pub declaration_accepted: bool,
    pub signed_name: String,
    pub signature_date: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Seizures {
    pub had_seizures: String,
    /// "" | "first-ever" | "more-than-one-or-epilepsy"
    pub diagnosis: String,
    pub first_ever: FirstEverSeizure,
    pub multiple: MultipleSeizureDetails,
    pub epilepsy_declaration: EpilepsyDeclaration,
}

// ──────────────────────────────────────────────
// Step 7 — Q7 Medication
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationEntry {
    pub name: String,
    pub start_date: String,
    pub end_date: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub no_medication_taken: bool,
    pub entries: Vec<MedicationEntry>,
    pub makes_drowsy_or_confused: String,
}

// ──────────────────────────────────────────────
// Step 8 — Q8 VP Shunt
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VpShunt {
    pub had_vp_shunt_or_drain: String,
    pub procedure_date: String,
}

// ──────────────────────────────────────────────
// Step 9 — Q9 Daily Living
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DailyLiving {
    pub needs_help: String,
    pub help_details: String,
}

// ──────────────────────────────────────────────
// Step 10 — Q10 Double Vision
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoubleVision {
    pub has_double_vision: String,
    pub suppressed_or_controlled: String,
    /// "" | "patch" | "prism" | "glasses-or-lenses" | "other"
    pub correction_method: String,
    pub correction_method_other: String,
}

// ──────────────────────────────────────────────
// Step 11 — Q11 Eyesight
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Eyesight {
    pub has_eyesight_problems: String,
    pub details: String,
}

// ──────────────────────────────────────────────
// Step 12 — Q12 Vehicle Adaptations
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VehicleAdaptations {
    pub needs_adaptations: String,
    pub previously_declared: String,
    pub additional_controls_fitted: String,
}

// ──────────────────────────────────────────────
// Step 13 — Authorisation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    pub declaration_accepted: bool,
    pub name: String,
    pub signature_date: String,
    pub electronic_correspondence_consent: String,
    /// "" | "email" | "sms"
    pub dvla_contact_preference: String,
    pub healthcare_contact_preference: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub personal_details: PersonalDetails,
    pub healthcare_professionals: HealthcareProfessionals,
    pub condition_history: ConditionHistory,
    pub treatment_provider: TreatmentProvider,
    pub blackouts: Blackouts,
    pub seizures: Seizures,
    pub medication: Medication,
    pub vp_shunt: VpShunt,
    pub daily_living: DailyLiving,
    pub double_vision: DoubleVision,
    pub eyesight: Eyesight,
    pub vehicle_adaptations: VehicleAdaptations,
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
