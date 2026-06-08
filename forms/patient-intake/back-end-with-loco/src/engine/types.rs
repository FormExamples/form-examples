//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching frontend union types.
// Empty string means unanswered.
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Urgency level.
pub type UrgencyLevel = String;
/// Smoking status.
pub type SmokingStatus = String;
/// Alcohol frequency.
pub type AlcoholFrequency = String;
/// Drug use frequency.
pub type DrugUseFrequency = String;
/// Exercise frequency.
pub type ExerciseFrequency = String;
/// Diet quality.
pub type DietQuality = String;
/// Allergy severity.
pub type AllergySeverity = String;
/// Allergy type.
pub type AllergyType = String;
/// Communication preference.
pub type CommunicationPreference = String;

/// Personal information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalInformation {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Address line1.
    pub address_line1: String,
    /// Address line2.
    pub address_line2: String,
    /// City.
    pub city: String,
    /// Postcode.
    pub postcode: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// Emergency contact name.
    pub emergency_contact_name: String,
    /// Emergency contact phone.
    pub emergency_contact_phone: String,
    /// Emergency contact relationship.
    pub emergency_contact_relationship: String,
}

/// Insurance and ID.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InsuranceAndId {
    /// Insurance provider.
    pub insurance_provider: String,
    /// Policy number.
    pub policy_number: String,
    /// NHS number.
    pub nhs_number: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice name.
    pub gp_practice_name: String,
    /// GP phone.
    pub gp_phone: String,
}

/// Reason for visit.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonForVisit {
    /// Primary reason.
    pub primary_reason: String,
    /// Urgency level.
    pub urgency_level: UrgencyLevel,
    /// Referring provider.
    pub referring_provider: String,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Additional details.
    pub additional_details: String,
}

/// Medical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Chronic conditions.
    pub chronic_conditions: Vec<String>,
    /// Previous surgeries.
    pub previous_surgeries: String,
    /// Previous hospitalizations.
    pub previous_hospitalizations: String,
    /// Ongoing treatments.
    pub ongoing_treatments: String,
}

/// Medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
    /// Prescriber.
    pub prescriber: String,
}

/// Allergy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    /// Allergen.
    pub allergen: String,
    /// Allergy type.
    pub allergy_type: AllergyType,
    /// Reaction.
    pub reaction: String,
    /// Severity.
    pub severity: AllergySeverity,
}

/// Family history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FamilyHistory {
    /// Heart disease.
    pub heart_disease: YesNo,
    /// Heart disease details.
    pub heart_disease_details: String,
    /// Cancer.
    pub cancer: YesNo,
    /// Cancer details.
    pub cancer_details: String,
    /// Diabetes.
    pub diabetes: YesNo,
    /// Diabetes details.
    pub diabetes_details: String,
    /// Stroke.
    pub stroke: YesNo,
    /// Stroke details.
    pub stroke_details: String,
    /// Mental illness.
    pub mental_illness: YesNo,
    /// Mental illness details.
    pub mental_illness_details: String,
    /// Genetic conditions.
    pub genetic_conditions: YesNo,
    /// Genetic conditions details.
    pub genetic_conditions_details: String,
}

/// Social history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialHistory {
    /// Smoking status.
    pub smoking_status: SmokingStatus,
    /// Smoking pack years.
    pub smoking_pack_years: Option<f64>,
    /// Alcohol frequency.
    pub alcohol_frequency: AlcoholFrequency,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<f64>,
    /// Drug use.
    pub drug_use: DrugUseFrequency,
    /// Drug details.
    pub drug_details: String,
    /// Occupation.
    pub occupation: String,
    /// Exercise frequency.
    pub exercise_frequency: ExerciseFrequency,
    /// Diet quality.
    pub diet_quality: DietQuality,
}

/// Review of systems.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewOfSystems {
    /// Constitutional.
    pub constitutional: String,
    /// Heent.
    pub heent: String,
    /// Cardiovascular.
    pub cardiovascular: String,
    /// Respiratory.
    pub respiratory: String,
    /// Gastrointestinal.
    pub gastrointestinal: String,
    /// Genitourinary.
    pub genitourinary: String,
    /// Musculoskeletal.
    pub musculoskeletal: String,
    /// Neurological.
    pub neurological: String,
    /// Psychiatric.
    pub psychiatric: String,
    /// Skin.
    pub skin: String,
}

/// Consent and preferences.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsentAndPreferences {
    /// Consent to treatment.
    pub consent_to_treatment: YesNo,
    /// Privacy acknowledgement.
    pub privacy_acknowledgement: YesNo,
    /// Communication preference.
    pub communication_preference: CommunicationPreference,
    /// Advance directives.
    pub advance_directives: YesNo,
    /// Advance directive details.
    pub advance_directive_details: String,
}

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Personal information.
    pub personal_information: PersonalInformation,
    /// Insurance and ID.
    pub insurance_and_id: InsuranceAndId,
    /// Reason for visit.
    pub reason_for_visit: ReasonForVisit,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Medications.
    pub medications: Vec<Medication>,
    /// Allergies.
    pub allergies: Vec<Allergy>,
    /// Family history.
    pub family_history: FamilyHistory,
    /// Social history.
    pub social_history: SocialHistory,
    /// Review of systems.
    pub review_of_systems: ReviewOfSystems,
    /// Consent and preferences.
    pub consent_and_preferences: ConsentAndPreferences,
}

/// Risk level: low, medium, high
pub type RiskLevel = String;

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Risk level.
    pub risk_level: RiskLevel,
}

/// Additional flag.
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
    pub priority: String,
}

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
