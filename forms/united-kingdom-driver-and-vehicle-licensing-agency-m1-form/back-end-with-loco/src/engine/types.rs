//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// Unanswered date fields default to `''`.
/// Yes no.
pub type YesNo = String;
/// Contact preference.
pub type ContactPreference = String;
/// Rule priority.
pub type RulePriority = String;
/// Rule category.
pub type RuleCategory = String;

/// Part A — Personal Details (current driving licence details and change of details).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalDetails {
    /// Title.
    pub title: String,
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Address.
    pub address: String,
    /// Postcode.
    pub postcode: String,
    /// Email.
    pub email: String,
    /// Contact number.
    pub contact_number: String,
    /// Change of details.
    pub change_of_details: String,
}

/// Part B — GP details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    /// GP name.
    pub gp_name: String,
    /// Surgery name.
    pub surgery_name: String,
    /// Address.
    pub address: String,
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

/// Part B — Consultant details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
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
    /// Address.
    pub address: String,
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

/// Part B — Healthcare professionals (GP + Consultant).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    /// GP.
    pub gp: GpDetails,
    /// Consultant.
    pub consultant: ConsultantDetails,
}

/// Q1 — Diagnosis confirmation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosisConfirmation {
    /// Has mental health diagnosis.
    pub has_mental_health_diagnosis: YesNo,
}

/// Q2 — Mental health conditions diagnosed (Yes/No per condition).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthConditions {
    /// Anxiety depression without impairment.
    pub anxiety_depression_without_impairment: YesNo,
    /// Anxiety depression with impairment.
    pub anxiety_depression_with_impairment: YesNo,
    /// Bipolar affective disorder.
    pub bipolar_affective_disorder: YesNo,
    /// Eating disorder.
    pub eating_disorder: YesNo,
    /// Ocd or ptsd.
    pub ocd_or_ptsd: YesNo,
    /// Personality disorder.
    pub personality_disorder: YesNo,
    /// Schizophrenia or psychosis.
    pub schizophrenia_or_psychosis: YesNo,
    /// Other.
    pub other: YesNo,
    /// Other details.
    pub other_details: String,
}

/// Q3 — Recent contact with healthcare professional in the last 12 months.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentContact {
    /// Had recent contact.
    pub had_recent_contact: YesNo,
    /// Doctor last date.
    pub doctor_last_date: String,
    /// Consultant last date.
    pub consultant_last_date: String,
    /// Community psychiatric nurse last date.
    pub community_psychiatric_nurse_last_date: String,
}

/// Applicant's Authorisation (declaration, signatory, contact preferences).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    /// Declaration confirmed.
    pub declaration_confirmed: YesNo,
    /// Signatory name.
    pub signatory_name: String,
    /// Signature text.
    pub signature_text: String,
    /// Signature date.
    pub signature_date: String,
    /// Electronic correspondence consent.
    pub electronic_correspondence_consent: YesNo,
    /// Dvla contact preference.
    pub dvla_contact_preference: ContactPreference,
    /// Healthcare professional contact preference.
    pub healthcare_professional_contact_preference: ContactPreference,
}

/// Full DVLA M1 assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Personal details.
    pub personal_details: PersonalDetails,
    /// Healthcare professionals.
    pub healthcare_professionals: HealthcareProfessionals,
    /// Diagnosis confirmation.
    pub diagnosis_confirmation: DiagnosisConfirmation,
    /// Mental health conditions.
    pub mental_health_conditions: MentalHealthConditions,
    /// Recent contact.
    pub recent_contact: RecentContact,
    /// Authorisation.
    pub authorisation: Authorisation,
}

/// A rule that fired during validation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: RuleCategory,
    /// Priority.
    pub priority: RulePriority,
    /// Description.
    pub description: String,
    /// Message.
    pub message: String,
}

/// A clinical or safety flag raised independently of completeness validation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: RulePriority,
}

/// Validation output for a DVLA M1 assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Complete.
    pub complete: bool,
    /// Stopped at q1.
    pub stopped_at_q1: bool,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Condition count.
    pub condition_count: u32,
    /// Timestamp.
    pub timestamp: String,
}
