use serde::{Deserialize, Serialize};

// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type Sex = String;
pub type ProblemStatus = String;
pub type ClinicalSeverity = String;
pub type AllergyCriticality = String;
pub type ResultInterpretation = String;
pub type AuthoringStatus = String;
pub type CompletenessLevel = String;

/// IPS Section 1 — Patient demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientDemographics {
    pub given_name: String,
    pub family_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub national_identifier: String,
    pub address_line: String,
    pub city: String,
    pub postal_code: String,
    pub country: String,
    pub preferred_language: String,
    pub contact_phone: String,
}

/// Single problem-list entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Problem {
    pub description: String,
    pub icd10_code: String,
    pub onset_date: String,
    pub status: ProblemStatus,
}

/// Single medication-summary entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub atc_code: String,
    pub dose: String,
    pub frequency: String,
    pub route: String,
}

/// Single allergy / intolerance entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    pub substance: String,
    pub reaction: String,
    pub severity: ClinicalSeverity,
    pub criticality: AllergyCriticality,
}

/// Single immunisation entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Immunisation {
    pub vaccine: String,
    pub date: String,
    pub lot_number: String,
}

/// Single procedure entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Procedure {
    pub description: String,
    pub date: String,
    pub performer: String,
}

/// Single result / investigation entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResultEntry {
    pub test_name: String,
    pub value: String,
    pub unit: String,
    pub interpretation: ResultInterpretation,
    pub date: String,
}

/// Medical device / implant.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Device {
    pub description: String,
    pub udi: String,
    pub implant_date: String,
}

/// Advance directives & consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdvanceDirective {
    pub dnr_in_place: YesNo,
    pub living_will_in_place: YesNo,
    pub consent_to_share_eu: YesNo,
    pub directive_notes: String,
}

/// Authoring clinician & signoff.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthoringClinician {
    pub clinician_name: String,
    pub clinician_role: String,
    pub organisation: String,
    pub country: String,
    pub email: String,
    pub phone: String,
    pub signoff_date: String,
    pub authoring_status: AuthoringStatus,
}

/// Full IPS record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_demographics: PatientDemographics,
    pub problem_list: Vec<Problem>,
    pub medication_summary: Vec<Medication>,
    pub allergies_intolerances: Vec<Allergy>,
    pub immunisations: Vec<Immunisation>,
    pub procedures: Vec<Procedure>,
    pub results_investigations: Vec<ResultEntry>,
    pub medical_devices: Vec<Device>,
    pub advance_directives: AdvanceDirective,
    pub authoring_clinician: AuthoringClinician,
}

/// Per-section validation rule outcome.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    /// `ok` / `empty` / `optional`.
    pub status: String,
    pub mandatory: bool,
}

/// Clinician-facing flag computed independently of completeness.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// `urgent` / `high` / `medium` / `low`.
    pub priority: String,
}

/// Grading output for an IPS record.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub completeness_level: CompletenessLevel,
    pub mandatory_populated: u32,
    pub mandatory_total: u32,
    pub optional_populated: u32,
    pub optional_total: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
