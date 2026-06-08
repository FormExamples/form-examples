//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Problem status.
pub type ProblemStatus = String;
/// Clinical severity.
pub type ClinicalSeverity = String;
/// Allergy criticality.
pub type AllergyCriticality = String;
/// Result interpretation.
pub type ResultInterpretation = String;
/// Authoring status.
pub type AuthoringStatus = String;
/// Completeness level.
pub type CompletenessLevel = String;

/// IPS Section 1 — Patient demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDemographics {
    /// Given name.
    pub given_name: String,
    /// Family name.
    pub family_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// National identifier.
    pub national_identifier: String,
    /// Address line.
    pub address_line: String,
    /// City.
    pub city: String,
    /// Postal code.
    pub postal_code: String,
    /// Country.
    pub country: String,
    /// Preferred language.
    pub preferred_language: String,
    /// Contact phone.
    pub contact_phone: String,
}

/// Single problem-list entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Problem {
    /// Description.
    pub description: String,
    /// Icd10 code.
    pub icd10_code: String,
    /// Onset date.
    pub onset_date: String,
    /// Status.
    pub status: ProblemStatus,
}

/// Single medication-summary entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Atc code.
    pub atc_code: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
    /// Route.
    pub route: String,
}

/// Single allergy / intolerance entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    /// Substance.
    pub substance: String,
    /// Reaction.
    pub reaction: String,
    /// Severity.
    pub severity: ClinicalSeverity,
    /// Criticality.
    pub criticality: AllergyCriticality,
}

/// Single immunisation entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Immunisation {
    /// Vaccine.
    pub vaccine: String,
    /// Date.
    pub date: String,
    /// Lot number.
    pub lot_number: String,
}

/// Single procedure entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Procedure {
    /// Description.
    pub description: String,
    /// Date.
    pub date: String,
    /// Performer.
    pub performer: String,
}

/// Single result / investigation entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResultEntry {
    /// Test name.
    pub test_name: String,
    /// Value.
    pub value: String,
    /// Unit.
    pub unit: String,
    /// Interpretation.
    pub interpretation: ResultInterpretation,
    /// Date.
    pub date: String,
}

/// Medical device / implant.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Device {
    /// Description.
    pub description: String,
    /// Udi.
    pub udi: String,
    /// Implant date.
    pub implant_date: String,
}

/// Advance directives & consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdvanceDirective {
    /// Dnr in place.
    pub dnr_in_place: YesNo,
    /// Living will in place.
    pub living_will_in_place: YesNo,
    /// Consent to share eu.
    pub consent_to_share_eu: YesNo,
    /// Directive notes.
    pub directive_notes: String,
}

/// Authoring clinician & signoff.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthoringClinician {
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
    /// Organisation.
    pub organisation: String,
    /// Country.
    pub country: String,
    /// Email.
    pub email: String,
    /// Phone.
    pub phone: String,
    /// Signoff date.
    pub signoff_date: String,
    /// Authoring status.
    pub authoring_status: AuthoringStatus,
}

/// Full IPS record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient demographics.
    pub patient_demographics: PatientDemographics,
    /// Problem list.
    pub problem_list: Vec<Problem>,
    /// Medication summary.
    pub medication_summary: Vec<Medication>,
    /// Allergies intolerances.
    pub allergies_intolerances: Vec<Allergy>,
    /// Immunisations.
    pub immunisations: Vec<Immunisation>,
    /// Procedures.
    pub procedures: Vec<Procedure>,
    /// Results investigations.
    pub results_investigations: Vec<ResultEntry>,
    /// Medical devices.
    pub medical_devices: Vec<Device>,
    /// Advance directives.
    pub advance_directives: AdvanceDirective,
    /// Authoring clinician.
    pub authoring_clinician: AuthoringClinician,
}

/// Per-section validation rule outcome.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// `ok` / `empty` / `optional`.
    pub status: String,
    /// Mandatory.
    pub mandatory: bool,
}

/// Clinician-facing flag computed independently of completeness.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// `urgent` / `high` / `medium` / `low`.
    pub priority: String,
}

/// Grading output for an IPS record.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Completeness level.
    pub completeness_level: CompletenessLevel,
    /// Mandatory populated.
    pub mandatory_populated: u32,
    /// Mandatory total.
    pub mandatory_total: u32,
    /// Optional populated.
    pub optional_populated: u32,
    /// Optional total.
    pub optional_total: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
