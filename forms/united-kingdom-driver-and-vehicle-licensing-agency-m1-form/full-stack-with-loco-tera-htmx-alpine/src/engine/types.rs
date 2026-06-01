use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// Unanswered date fields default to `''`.
pub type YesNo = String;
pub type ContactPreference = String;
pub type RulePriority = String;
pub type RuleCategory = String;

/// Part A — Personal Details (current driving licence details and change of details).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
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

/// Part B — GP details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    pub gp_name: String,
    pub surgery_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

/// Part B — Consultant details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    pub consultant_name: String,
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

/// Part B — Healthcare professionals (GP + Consultant).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    pub gp: GpDetails,
    pub consultant: ConsultantDetails,
}

/// Q1 — Diagnosis confirmation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosisConfirmation {
    pub has_mental_health_diagnosis: YesNo,
}

/// Q2 — Mental health conditions diagnosed (Yes/No per condition).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthConditions {
    pub anxiety_depression_without_impairment: YesNo,
    pub anxiety_depression_with_impairment: YesNo,
    pub bipolar_affective_disorder: YesNo,
    pub eating_disorder: YesNo,
    pub ocd_or_ptsd: YesNo,
    pub personality_disorder: YesNo,
    pub schizophrenia_or_psychosis: YesNo,
    pub other: YesNo,
    pub other_details: String,
}

/// Q3 — Recent contact with healthcare professional in the last 12 months.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentContact {
    pub had_recent_contact: YesNo,
    pub doctor_last_date: String,
    pub consultant_last_date: String,
    pub community_psychiatric_nurse_last_date: String,
}

/// Applicant's Authorisation (declaration, signatory, contact preferences).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    pub declaration_confirmed: YesNo,
    pub signatory_name: String,
    pub signature_text: String,
    pub signature_date: String,
    pub electronic_correspondence_consent: YesNo,
    pub dvla_contact_preference: ContactPreference,
    pub healthcare_professional_contact_preference: ContactPreference,
}

/// Full DVLA M1 assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub personal_details: PersonalDetails,
    pub healthcare_professionals: HealthcareProfessionals,
    pub diagnosis_confirmation: DiagnosisConfirmation,
    pub mental_health_conditions: MentalHealthConditions,
    pub recent_contact: RecentContact,
    pub authorisation: Authorisation,
}

/// A rule that fired during validation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: RuleCategory,
    pub priority: RulePriority,
    pub description: String,
    pub message: String,
}

/// A clinical or safety flag raised independently of completeness validation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: RulePriority,
}

/// Validation output for a DVLA M1 assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    pub complete: bool,
    pub stopped_at_q1: bool,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub condition_count: u32,
    pub timestamp: String,
}
