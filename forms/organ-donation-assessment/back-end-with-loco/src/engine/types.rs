//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Eligibility.
pub type Eligibility = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Ethnicity.
    pub ethnicity: String,
}

/// Step 2 — Donor Type & Registration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorTypeRegistration {
    /// Donor type.
    pub donor_type: String,
    /// Registered on donor register.
    pub registered_on_donor_register: YesNo,
    /// Registry name.
    pub registry_name: String,
    /// Registration date.
    pub registration_date: String,
    /// Recipient relationship.
    pub recipient_relationship: String,
    /// Recipient name.
    pub recipient_name: String,
    /// Previous donation.
    pub previous_donation: YesNo,
    /// Previous donation details.
    pub previous_donation_details: String,
    /// Intended organs.
    pub intended_organs: String,
}

/// Step 3 — Medical History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Has malignancy.
    pub has_malignancy: YesNo,
    /// Malignancy details.
    pub malignancy_details: String,
    /// Has cns malignancy.
    pub has_cns_malignancy: YesNo,
    /// Has autoimmune disease.
    pub has_autoimmune_disease: YesNo,
    /// Autoimmune details.
    pub autoimmune_details: String,
    /// Has diabetes.
    pub has_diabetes: YesNo,
    /// Diabetes details.
    pub diabetes_details: String,
    /// Has hypertension.
    pub has_hypertension: YesNo,
    /// Hypertension details.
    pub hypertension_details: String,
    /// Has cardiovascular disease.
    pub has_cardiovascular_disease: YesNo,
    /// Cardiovascular details.
    pub cardiovascular_details: String,
    /// Has active infection.
    pub has_active_infection: YesNo,
    /// Active infection details.
    pub active_infection_details: String,
    /// Has uncontrolled sepsis.
    pub has_uncontrolled_sepsis: YesNo,
    /// Has cjd risk.
    pub has_cjd_risk: YesNo,
    /// Cjd details.
    pub cjd_details: String,
    /// IV drug use history.
    pub iv_drug_use_history: YesNo,
    /// Current medications.
    pub current_medications: String,
    /// Previous surgery.
    pub previous_surgery: YesNo,
    /// Surgery details.
    pub surgery_details: String,
}

/// Step 4 — Organ Function Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrganFunction {
    /// Creatinine.
    pub creatinine: Option<f64>,
    /// Egfr.
    pub egfr: Option<f64>,
    /// Kidney imaging.
    pub kidney_imaging: String,
    /// Kidney notes.
    pub kidney_notes: String,
    /// Alt.
    pub alt: Option<f64>,
    /// Ast.
    pub ast: Option<f64>,
    /// Bilirubin.
    pub bilirubin: Option<f64>,
    /// Liver imaging.
    pub liver_imaging: String,
    /// Liver notes.
    pub liver_notes: String,
    /// Ejection fraction.
    pub ejection_fraction: Option<f64>,
    /// Echocardiogram.
    pub echocardiogram: String,
    /// Cardiac notes.
    pub cardiac_notes: String,
    /// Pao2 fio2 ratio.
    pub pao2_fio2_ratio: Option<f64>,
    /// Chest imaging.
    pub chest_imaging: String,
    /// Pulmonary notes.
    pub pulmonary_notes: String,
    /// Fasting glucose.
    pub fasting_glucose: Option<f64>,
    /// Hba1c.
    pub hba1c: Option<f64>,
    /// Pancreatic notes.
    pub pancreatic_notes: String,
    /// Severe organ failure.
    pub severe_organ_failure: YesNo,
    /// Severe organ failure details.
    pub severe_organ_failure_details: String,
}

/// Step 5 — Infectious Disease Screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfectiousDiseaseScreening {
    /// Hiv status.
    pub hiv_status: String,
    /// Hbs ag.
    pub hbs_ag: String,
    /// Hbc ab.
    pub hbc_ab: String,
    /// Hcv ab.
    pub hcv_ab: String,
    /// Htlv status.
    pub htlv_status: String,
    /// Cmv status.
    pub cmv_status: String,
    /// Ebv status.
    pub ebv_status: String,
    /// Syphilis screen.
    pub syphilis_screen: String,
    /// Toxoplasma status.
    pub toxoplasma_status: String,
    /// Tuberculosis screen.
    pub tuberculosis_screen: String,
    /// Recent travel.
    pub recent_travel: YesNo,
    /// Travel details.
    pub travel_details: String,
    /// Recent infection.
    pub recent_infection: YesNo,
    /// Infection details.
    pub infection_details: String,
}

/// Step 6 — Immunological Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImmunologicalAssessment {
    /// Donor blood group.
    pub donor_blood_group: String,
    /// Recipient blood group.
    pub recipient_blood_group: String,
    /// Abo compatibility.
    pub abo_compatibility: String,
    /// Hla a.
    pub hla_a: String,
    /// Hla b.
    pub hla_b: String,
    /// Hla c.
    pub hla_c: String,
    /// Hla dr.
    pub hla_dr: String,
    /// Hla dq.
    pub hla_dq: String,
    /// Hla dp.
    pub hla_dp: String,
    /// Hla match level.
    pub hla_match_level: String,
    /// Crossmatch result.
    pub crossmatch_result: String,
    /// Pra.
    pub pra: Option<f64>,
    /// Donor specific antibodies.
    pub donor_specific_antibodies: YesNo,
    /// Dsa details.
    pub dsa_details: String,
}

/// Step 7 — Surgical Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalAssessment {
    /// Asa grade.
    pub asa_grade: String,
    /// Previous anaesthetic.
    pub previous_anaesthetic: YesNo,
    /// Anaesthetic complications.
    pub anaesthetic_complications: YesNo,
    /// Complication details.
    pub complication_details: String,
    /// Mallampati score.
    pub mallampati_score: String,
    /// Airway concerns.
    pub airway_concerns: YesNo,
    /// Airway details.
    pub airway_details: String,
    /// Surgical fitness.
    pub surgical_fitness: String,
    /// Surgical fitness notes.
    pub surgical_fitness_notes: String,
    /// Planned procedure.
    pub planned_procedure: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Alcohol use.
    pub alcohol_use: String,
}

/// Step 8 — Psychological Assessment (Living Donor).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalAssessment {
    /// Mental capacity confirmed.
    pub mental_capacity_confirmed: YesNo,
    /// Understands procedure.
    pub understands_procedure: YesNo,
    /// Understands risks.
    pub understands_risks: YesNo,
    /// Voluntary decision.
    pub voluntary_decision: YesNo,
    /// Coercion concerns.
    pub coercion_concerns: YesNo,
    /// Coercion details.
    pub coercion_details: String,
    /// Ambivalence.
    pub ambivalence: YesNo,
    /// Ambivalence details.
    pub ambivalence_details: String,
    /// Anxiety about procedure.
    pub anxiety_about_procedure: String,
    /// Previous psychological issues.
    pub previous_psychological_issues: YesNo,
    /// Psychological issue details.
    pub psychological_issue_details: String,
    /// Support network.
    pub support_network: YesNo,
    /// Willing to proceed.
    pub willing_to_proceed: YesNo,
}

/// Step 9 — Ethical & Legal Requirements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EthicalLegalRequirements {
    /// Hta act 2004 compliant.
    pub hta_act_2004_compliant: YesNo,
    /// Independent assessor review.
    pub independent_assessor_review: YesNo,
    /// Independent assessor name.
    pub independent_assessor_name: String,
    /// Independent assessor date.
    pub independent_assessor_date: String,
    /// Informed consent given.
    pub informed_consent_given: YesNo,
    /// Consent form signed.
    pub consent_form_signed: YesNo,
    /// Consent date.
    pub consent_date: String,
    /// Witness name.
    pub witness_name: String,
    /// Witness role.
    pub witness_role: String,
    /// Information leaflet provided.
    pub information_leaflet_provided: YesNo,
    /// Questions answered.
    pub questions_answered: YesNo,
    /// Financial reward check.
    pub financial_reward_check: YesNo,
    /// Ethics committee approval.
    pub ethics_committee_approval: YesNo,
    /// Ethics approval reference.
    pub ethics_approval_reference: String,
}

/// Step 10 — Eligibility & Allocation Decision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EligibilityAllocation {
    /// Eligibility decision.
    pub eligibility_decision: String,
    /// Eligibility conditions.
    pub eligibility_conditions: String,
    /// Deferral reason.
    pub deferral_reason: String,
    /// Deferral duration.
    pub deferral_duration: String,
    /// Allocated organs.
    pub allocated_organs: String,
    /// Intended recipient centre.
    pub intended_recipient_centre: String,
    /// Assessor name.
    pub assessor_name: String,
    /// Assessor role.
    pub assessor_role: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full Organ Donation Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Donor type registration.
    pub donor_type_registration: DonorTypeRegistration,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Organ function.
    pub organ_function: OrganFunction,
    /// Infectious disease screening.
    pub infectious_disease_screening: InfectiousDiseaseScreening,
    /// Immunological assessment.
    pub immunological_assessment: ImmunologicalAssessment,
    /// Surgical assessment.
    pub surgical_assessment: SurgicalAssessment,
    /// Psychological assessment.
    pub psychological_assessment: PsychologicalAssessment,
    /// Ethical legal requirements.
    pub ethical_legal_requirements: EthicalLegalRequirements,
    /// Eligibility allocation.
    pub eligibility_allocation: EligibilityAllocation,
}

/// A donor rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: u32,
}

/// A safety flag for the clinician.
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

/// Grading output for an organ-donation assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Eligibility.
    pub eligibility: Eligibility,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Suggested eligibility.
    pub suggested_eligibility: Eligibility,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
