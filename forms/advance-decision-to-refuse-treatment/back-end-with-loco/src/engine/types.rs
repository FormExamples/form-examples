//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching frontend union types.
// Empty string means unanswered.
/// Yes no.
pub type YesNo = String;
/// Validity status.
pub type ValidityStatus = String;

/// Personal information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalInformation {
    /// Full legal name.
    pub full_legal_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Postcode.
    pub postcode: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
    /// GP address.
    pub gp_address: String,
    /// GP telephone.
    pub gp_telephone: String,
}

/// Capacity declaration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CapacityDeclaration {
    /// Confirms capacity.
    pub confirms_capacity: YesNo,
    /// Understands consequences.
    pub understands_consequences: YesNo,
    /// No undue influence.
    pub no_undue_influence: YesNo,
    /// Professional capacity assessment.
    pub professional_capacity_assessment: YesNo,
    /// Assessed by name.
    pub assessed_by_name: String,
    /// Assessed by role.
    pub assessed_by_role: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Assessment details.
    pub assessment_details: String,
}

/// Circumstances.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Circumstances {
    /// Specific circumstances.
    pub specific_circumstances: String,
    /// Medical conditions.
    pub medical_conditions: String,
    /// Situations description.
    pub situations_description: String,
}

/// Treatment refusal.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentRefusal {
    /// Treatment.
    pub treatment: String,
    /// Refused.
    pub refused: YesNo,
    /// Specification.
    pub specification: String,
}

/// Treatments refused general.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentsRefusedGeneral {
    /// Antibiotics.
    pub antibiotics: TreatmentRefusal,
    /// Blood transfusion.
    pub blood_transfusion: TreatmentRefusal,
    /// IV fluids.
    pub iv_fluids: TreatmentRefusal,
    /// Tube feeding.
    pub tube_feeding: TreatmentRefusal,
    /// Dialysis.
    pub dialysis: TreatmentRefusal,
    /// Ventilation.
    pub ventilation: TreatmentRefusal,
    /// Other treatments.
    pub other_treatments: Vec<TreatmentRefusal>,
}

/// Life sustaining refusal.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifeSustainingRefusal {
    /// Treatment.
    pub treatment: String,
    /// Refused.
    pub refused: YesNo,
    /// Even if life at risk.
    pub even_if_life_at_risk: YesNo,
    /// Specification.
    pub specification: String,
}

/// Treatments refused life sustaining.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentsRefusedLifeSustaining {
    /// Cpr.
    pub cpr: LifeSustainingRefusal,
    /// Mechanical ventilation.
    pub mechanical_ventilation: LifeSustainingRefusal,
    /// Artificial nutrition hydration.
    pub artificial_nutrition_hydration: LifeSustainingRefusal,
    /// Other life sustaining.
    pub other_life_sustaining: Vec<LifeSustainingRefusal>,
}

/// Exceptions conditions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExceptionsConditions {
    /// Has exceptions.
    pub has_exceptions: YesNo,
    /// Exceptions description.
    pub exceptions_description: String,
    /// Has time limitations.
    pub has_time_limitations: YesNo,
    /// Time limitations description.
    pub time_limitations_description: String,
    /// Invalidating conditions.
    pub invalidating_conditions: String,
}

/// Other wishes.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtherWishes {
    /// Preferred care setting.
    pub preferred_care_setting: String,
    /// Comfort measures.
    pub comfort_measures: String,
    /// Spiritual religious wishes.
    pub spiritual_religious_wishes: String,
    /// Other preferences.
    pub other_preferences: String,
}

/// Lasting power of attorney.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LastingPowerOfAttorney {
    /// Has LPA.
    pub has_lpa: YesNo,
    /// LPA type.
    pub lpa_type: String,
    /// LPA registered.
    pub lpa_registered: YesNo,
    /// LPA registration date.
    pub lpa_registration_date: String,
    /// Donee names.
    pub donee_names: String,
    /// Relationship between adrt and LPA.
    pub relationship_between_adrt_and_lpa: String,
}

/// Healthcare professional review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionalReview {
    /// Reviewed by clinician name.
    pub reviewed_by_clinician_name: String,
    /// Reviewed by clinician role.
    pub reviewed_by_clinician_role: String,
    /// Review date.
    pub review_date: String,
    /// Clinical opinion on capacity.
    pub clinical_opinion_on_capacity: String,
    /// Any concerns.
    pub any_concerns: YesNo,
    /// Concerns details.
    pub concerns_details: String,
}

/// Legal signatures.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LegalSignatures {
    /// Patient signature.
    pub patient_signature: YesNo,
    /// Patient statement of understanding.
    pub patient_statement_of_understanding: YesNo,
    /// Patient signature date.
    pub patient_signature_date: String,
    /// Witness signature.
    pub witness_signature: YesNo,
    /// Witness name.
    pub witness_name: String,
    /// Witness address.
    pub witness_address: String,
    /// Witness signature date.
    pub witness_signature_date: String,
    /// Life sustaining written statement.
    pub life_sustaining_written_statement: YesNo,
    /// Life sustaining statement text.
    pub life_sustaining_statement_text: String,
    /// Life sustaining signature.
    pub life_sustaining_signature: YesNo,
    /// Life sustaining witness signature.
    pub life_sustaining_witness_signature: YesNo,
    /// Life sustaining witness name.
    pub life_sustaining_witness_name: String,
    /// Life sustaining witness address.
    pub life_sustaining_witness_address: String,
}

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Personal information.
    pub personal_information: PersonalInformation,
    /// Capacity declaration.
    pub capacity_declaration: CapacityDeclaration,
    /// Circumstances.
    pub circumstances: Circumstances,
    /// Treatments refused general.
    pub treatments_refused_general: TreatmentsRefusedGeneral,
    /// Treatments refused life sustaining.
    pub treatments_refused_life_sustaining: TreatmentsRefusedLifeSustaining,
    /// Exceptions conditions.
    pub exceptions_conditions: ExceptionsConditions,
    /// Other wishes.
    pub other_wishes: OtherWishes,
    /// Lasting power of attorney.
    pub lasting_power_of_attorney: LastingPowerOfAttorney,
    /// Healthcare professional review.
    pub healthcare_professional_review: HealthcareProfessionalReview,
    /// Legal signatures.
    pub legal_signatures: LegalSignatures,
}

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
    /// Severity.
    pub severity: String,
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
    /// Validity status.
    pub validity_status: ValidityStatus,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
