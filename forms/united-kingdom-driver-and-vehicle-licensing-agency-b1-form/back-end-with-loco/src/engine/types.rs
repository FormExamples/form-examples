//! Core types for the DVLA B1 (neurological) data-collection engine.
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
// Step 1 — Personal Details (Part A)
// ──────────────────────────────────────────────

/// Personal details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalDetails {
    /// Title.
    pub title: String,
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Address line1.
    pub address_line1: String,
    /// Address line2.
    pub address_line2: String,
    /// Address line3.
    pub address_line3: String,
    /// Postcode.
    pub postcode: String,
    /// Email.
    pub email: String,
    /// Contact number.
    pub contact_number: String,
    /// Change of details.
    pub change_of_details: String,
}

// ──────────────────────────────────────────────
// Step 2 — Healthcare Professionals (Part B)
// ──────────────────────────────────────────────

/// GP details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    /// GP name.
    pub gp_name: String,
    /// Surgery name.
    pub surgery_name: String,
    /// Address line1.
    pub address_line1: String,
    /// Address line2.
    pub address_line2: String,
    /// Town.
    pub town: String,
    /// Postcode.
    pub postcode: String,
    /// Contact number.
    pub contact_number: String,
    /// Email.
    pub email: String,
    /// Date last seen.
    pub date_last_seen: String,
}

/// Consultant details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    /// Consultant name.
    pub consultant_name: String,
    /// Speciality.
    pub speciality: String,
    /// Department.
    pub department: String,
    /// Hospital name.
    pub hospital_name: String,
    /// Address line1.
    pub address_line1: String,
    /// Address line2.
    pub address_line2: String,
    /// Town.
    pub town: String,
    /// Postcode.
    pub postcode: String,
    /// Contact number.
    pub contact_number: String,
    /// Email.
    pub email: String,
    /// Date last seen.
    pub date_last_seen: String,
}

/// Healthcare professionals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    /// GP.
    pub gp: GpDetails,
    /// Consultant.
    pub consultant: ConsultantDetails,
}

// ──────────────────────────────────────────────
// Step 3 — Q1 Condition History
// ──────────────────────────────────────────────

/// Condition history.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConditionHistory {
    /// Brain haemorrhage.
    pub brain_haemorrhage: bool,
    /// Brain haemorrhage date.
    pub brain_haemorrhage_date: String,
    /// Brain haemorrhage details.
    pub brain_haemorrhage_details: String,
    /// Severe head injury.
    pub severe_head_injury: bool,
    /// Severe head injury date.
    pub severe_head_injury_date: String,
    /// Severe head injury details.
    pub severe_head_injury_details: String,
    /// Other condition.
    pub other_condition: bool,
    /// Other condition date.
    pub other_condition_date: String,
    /// Other condition details.
    pub other_condition_details: String,
    /// Brain surgery date.
    pub brain_surgery_date: String,
    /// Brain surgery not applicable.
    pub brain_surgery_not_applicable: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Q2 Treatment Provider
// ──────────────────────────────────────────────

/// Treatment provider.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentProvider {
    /// "" | "gp" | "consultant"
    pub last_seen: String,
    /// GP last contact date.
    pub gp_last_contact_date: String,
    /// GP next contact date.
    pub gp_next_contact_date: String,
    /// Consultant last contact date.
    pub consultant_last_contact_date: String,
    /// Consultant next contact date.
    pub consultant_next_contact_date: String,
}

// ──────────────────────────────────────────────
// Step 5 — Q3 Blackouts
// ──────────────────────────────────────────────

/// Blackouts.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blackouts {
    /// "" | "yes" | "no"
    pub had_blackouts: String,
    /// Blackout date.
    pub blackout_date: String,
}

// ──────────────────────────────────────────────
// Step 6 — Q4–Q6 Seizures
// ──────────────────────────────────────────────

/// First ever seizure.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FirstEverSeizure {
    /// Date.
    pub date: String,
    /// Details.
    pub details: String,
}

/// Multiple seizure details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MultipleSeizureDetails {
    /// Two or more within five years.
    pub two_or_more_within_five_years: String,
    /// First awake seizure date.
    pub first_awake_seizure_date: String,
    /// First asleep seizure date.
    pub first_asleep_seizure_date: String,
    /// Last two awake seizure date1.
    pub last_two_awake_seizure_date1: String,
    /// Last two awake seizure date2.
    pub last_two_awake_seizure_date2: String,
    /// Last two asleep seizure date1.
    pub last_two_asleep_seizure_date1: String,
    /// Last two asleep seizure date2.
    pub last_two_asleep_seizure_date2: String,
    /// First sleep attack after last awake attack date.
    pub first_sleep_attack_after_last_awake_attack_date: String,
    /// Affected consciousness.
    pub affected_consciousness: String,
    /// Would have affected driving.
    pub would_have_affected_driving: String,
    /// Attack description.
    pub attack_description: String,
    /// Result of medication advice.
    pub result_of_medication_advice: String,
    /// Date medication started to reduce.
    pub date_medication_started_to_reduce: String,
    /// Previous medication restarted.
    pub previous_medication_restarted: String,
    /// Date previous medication restarted.
    pub date_previous_medication_restarted: String,
    /// Date of last seizure prior to withdrawal.
    pub date_of_last_seizure_prior_to_withdrawal: String,
    /// Provoked seizure details.
    pub provoked_seizure_details: String,
}

/// Epilepsy declaration.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EpilepsyDeclaration {
    /// Declaration accepted.
    pub declaration_accepted: bool,
    /// Signed name.
    pub signed_name: String,
    /// Signature date.
    pub signature_date: String,
}

/// Seizures.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Seizures {
    /// Had seizures.
    pub had_seizures: String,
    /// "" | "first-ever" | "more-than-one-or-epilepsy"
    pub diagnosis: String,
    /// First ever.
    pub first_ever: FirstEverSeizure,
    /// Multiple.
    pub multiple: MultipleSeizureDetails,
    /// Epilepsy declaration.
    pub epilepsy_declaration: EpilepsyDeclaration,
}

// ──────────────────────────────────────────────
// Step 7 — Q7 Medication
// ──────────────────────────────────────────────

/// Medication entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationEntry {
    /// Name.
    pub name: String,
    /// Start date.
    pub start_date: String,
    /// End date.
    pub end_date: String,
}

/// Medication.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// No medication taken.
    pub no_medication_taken: bool,
    /// Entries.
    pub entries: Vec<MedicationEntry>,
    /// Makes drowsy or confused.
    pub makes_drowsy_or_confused: String,
}

// ──────────────────────────────────────────────
// Step 8 — Q8 VP Shunt
// ──────────────────────────────────────────────

/// Vp shunt.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VpShunt {
    /// Had vp shunt or drain.
    pub had_vp_shunt_or_drain: String,
    /// Procedure date.
    pub procedure_date: String,
}

// ──────────────────────────────────────────────
// Step 9 — Q9 Daily Living
// ──────────────────────────────────────────────

/// Daily living.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DailyLiving {
    /// Needs help.
    pub needs_help: String,
    /// Help details.
    pub help_details: String,
}

// ──────────────────────────────────────────────
// Step 10 — Q10 Double Vision
// ──────────────────────────────────────────────

/// Double vision.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoubleVision {
    /// Has double vision.
    pub has_double_vision: String,
    /// Suppressed or controlled.
    pub suppressed_or_controlled: String,
    /// "" | "patch" | "prism" | "glasses-or-lenses" | "other"
    pub correction_method: String,
    /// Correction method other.
    pub correction_method_other: String,
}

// ──────────────────────────────────────────────
// Step 11 — Q11 Eyesight
// ──────────────────────────────────────────────

/// Eyesight.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Eyesight {
    /// Has eyesight problems.
    pub has_eyesight_problems: String,
    /// Details.
    pub details: String,
}

// ──────────────────────────────────────────────
// Step 12 — Q12 Vehicle Adaptations
// ──────────────────────────────────────────────

/// Vehicle adaptations.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VehicleAdaptations {
    /// Needs adaptations.
    pub needs_adaptations: String,
    /// Previously declared.
    pub previously_declared: String,
    /// Additional controls fitted.
    pub additional_controls_fitted: String,
}

// ──────────────────────────────────────────────
// Step 13 — Authorisation
// ──────────────────────────────────────────────

/// Authorisation.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    /// Declaration accepted.
    pub declaration_accepted: bool,
    /// Name.
    pub name: String,
    /// Signature date.
    pub signature_date: String,
    /// Electronic correspondence consent.
    pub electronic_correspondence_consent: String,
    /// "" | "email" | "sms"
    pub dvla_contact_preference: String,
    /// Healthcare contact preference.
    pub healthcare_contact_preference: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Personal details.
    pub personal_details: PersonalDetails,
    /// Healthcare professionals.
    pub healthcare_professionals: HealthcareProfessionals,
    /// Condition history.
    pub condition_history: ConditionHistory,
    /// Treatment provider.
    pub treatment_provider: TreatmentProvider,
    /// Blackouts.
    pub blackouts: Blackouts,
    /// Seizures.
    pub seizures: Seizures,
    /// Medication.
    pub medication: Medication,
    /// Vp shunt.
    pub vp_shunt: VpShunt,
    /// Daily living.
    pub daily_living: DailyLiving,
    /// Double vision.
    pub double_vision: DoubleVision,
    /// Eyesight.
    pub eyesight: Eyesight,
    /// Vehicle adaptations.
    pub vehicle_adaptations: VehicleAdaptations,
    /// Authorisation.
    pub authorisation: Authorisation,
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
