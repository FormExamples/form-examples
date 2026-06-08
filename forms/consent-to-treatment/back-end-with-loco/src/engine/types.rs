//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Consent status.
pub type ConsentStatus = String;

// ─── Patient Information (Step 1) ─────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact email.
    pub contact_email: String,
    /// Next of kin name.
    pub next_of_kin_name: String,
    /// Next of kin relationship.
    pub next_of_kin_relationship: String,
    /// Next of kin phone.
    pub next_of_kin_phone: String,
}

// ─── Procedure Details (Step 2) ───────────────────────────

/// Procedure details.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureDetails {
    /// Procedure name.
    pub procedure_name: String,
    /// Procedure type.
    pub procedure_type: String,
    /// Procedure description.
    pub procedure_description: String,
    /// Surgeon name.
    pub surgeon_name: String,
    /// Surgeon role.
    pub surgeon_role: String,
    /// Planned date.
    pub planned_date: String,
    /// Planned location.
    pub planned_location: String,
    /// Anaesthesia type.
    pub anaesthesia_type: String,
    /// Estimated duration.
    pub estimated_duration: String,
    /// Laterality.
    pub laterality: String,
}

// ─── Risks and Benefits (Step 3) ──────────────────────────

/// Risks and benefits.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RisksAndBenefits {
    /// Specific risks.
    pub specific_risks: String,
    /// General risks.
    pub general_risks: String,
    /// Risk of no treatment.
    pub risk_of_no_treatment: String,
    /// Expected benefits.
    pub expected_benefits: String,
    /// Success rate.
    pub success_rate: String,
    /// Risks explained verbally.
    pub risks_explained_verbally: Option<u8>,
    /// Risks understood.
    pub risks_understood: Option<u8>,
    /// Benefits understood.
    pub benefits_understood: Option<u8>,
}

// ─── Alternatives (Step 4) ────────────────────────────────

/// Alternatives.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Alternatives {
    /// Alternative treatments.
    pub alternative_treatments: String,
    /// No treatment option.
    pub no_treatment_option: String,
    /// Alternatives explained.
    pub alternatives_explained: Option<u8>,
    /// Alternatives understood.
    pub alternatives_understood: Option<u8>,
    /// Reason for chosen treatment.
    pub reason_for_chosen_treatment: String,
}

// ─── Capacity Assessment (Step 5) ─────────────────────────

/// Capacity assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CapacityAssessment {
    /// Patient has capacity.
    pub patient_has_capacity: String,
    /// Can understand information.
    pub can_understand_information: Option<u8>,
    /// Can retain information.
    pub can_retain_information: Option<u8>,
    /// Can weigh information.
    pub can_weigh_information: Option<u8>,
    /// Can communicate decision.
    pub can_communicate_decision: Option<u8>,
    /// Capacity assessed by.
    pub capacity_assessed_by: String,
    /// Capacity assessment date.
    pub capacity_assessment_date: String,
    /// Capacity notes.
    pub capacity_notes: String,
}

// ─── Patient Understanding (Step 6) ───────────────────────

/// Patient understanding.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientUnderstanding {
    /// Can explain procedure.
    pub can_explain_procedure: Option<u8>,
    /// Can explain risks.
    pub can_explain_risks: Option<u8>,
    /// Can explain alternatives.
    pub can_explain_alternatives: Option<u8>,
    /// Questions asked.
    pub questions_asked: String,
    /// Questions answered satisfactorily.
    pub questions_answered_satisfactorily: Option<u8>,
    /// Information leaflet provided.
    pub information_leaflet_provided: String,
    /// Time to consider.
    pub time_to_consider: String,
    /// Second opinion offered.
    pub second_opinion_offered: String,
}

// ─── Additional Considerations (Step 7) ───────────────────

/// Additional considerations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalConsiderations {
    /// Blood product consent.
    pub blood_product_consent: String,
    /// Photography consent.
    pub photography_consent: String,
    /// Teaching consent.
    pub teaching_consent: String,
    /// Tissue storage consent.
    pub tissue_storage_consent: String,
    /// Advance directive exists.
    pub advance_directive_exists: String,
    /// Advance directive details.
    pub advance_directive_details: String,
    /// Religious cultural considerations.
    pub religious_cultural_considerations: String,
    /// Additional requests.
    pub additional_requests: String,
}

// ─── Interpreter Requirements (Step 8) ────────────────────

/// Interpreter requirements.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InterpreterRequirements {
    /// Interpreter needed.
    pub interpreter_needed: String,
    /// Interpreter language.
    pub interpreter_language: String,
    /// Interpreter name.
    pub interpreter_name: String,
    /// Interpreter service.
    pub interpreter_service: String,
    /// Communication aids needed.
    pub communication_aids_needed: String,
    /// Communication aids details.
    pub communication_aids_details: String,
}

// ─── Signatures (Step 9) ──────────────────────────────────

/// Signatures.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Signatures {
    /// Patient signature.
    pub patient_signature: String,
    /// Patient signature date.
    pub patient_signature_date: String,
    /// Consent voluntary.
    pub consent_voluntary: String,
    /// Right to withdraw understood.
    pub right_to_withdraw_understood: String,
    /// Witness name.
    pub witness_name: String,
    /// Witness signature.
    pub witness_signature: String,
    /// Witness signature date.
    pub witness_signature_date: String,
    /// Parent guardian name.
    pub parent_guardian_name: String,
    /// Parent guardian relationship.
    pub parent_guardian_relationship: String,
    /// Parent guardian signature.
    pub parent_guardian_signature: String,
    /// Parent guardian signature date.
    pub parent_guardian_signature_date: String,
}

// ─── Clinical Verification (Step 10) ──────────────────────

/// Clinical verification.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalVerification {
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
    /// Clinician gmc number.
    pub clinician_gmc_number: String,
    /// Clinician signature.
    pub clinician_signature: String,
    /// Clinician signature date.
    pub clinician_signature_date: String,
    /// Consent confirmed on day.
    pub consent_confirmed_on_day: String,
    /// Patient condition changed.
    pub patient_condition_changed: String,
    /// Condition change details.
    pub condition_change_details: String,
    /// Verification notes.
    pub verification_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Procedure details.
    pub procedure_details: ProcedureDetails,
    /// Risks and benefits.
    pub risks_and_benefits: RisksAndBenefits,
    /// Alternatives.
    pub alternatives: Alternatives,
    /// Capacity assessment.
    pub capacity_assessment: CapacityAssessment,
    /// Patient understanding.
    pub patient_understanding: PatientUnderstanding,
    /// Additional considerations.
    pub additional_considerations: AdditionalConsiderations,
    /// Interpreter requirements.
    pub interpreter_requirements: InterpreterRequirements,
    /// Signatures.
    pub signatures: Signatures,
    /// Clinical verification.
    pub clinical_verification: ClinicalVerification,
}

// ─── Grading types ──────────────────────────────────────

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
    /// Concern level.
    pub concern_level: String,
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
    /// Consent status.
    pub consent_status: ConsentStatus,
    /// Completeness score.
    pub completeness_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
