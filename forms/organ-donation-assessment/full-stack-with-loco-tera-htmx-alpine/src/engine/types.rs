use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type Eligibility = String;
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub ethnicity: String,
}

/// Step 2 — Donor Type & Registration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorTypeRegistration {
    pub donor_type: String,
    pub registered_on_donor_register: YesNo,
    pub registry_name: String,
    pub registration_date: String,
    pub recipient_relationship: String,
    pub recipient_name: String,
    pub previous_donation: YesNo,
    pub previous_donation_details: String,
    pub intended_organs: String,
}

/// Step 3 — Medical History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    pub has_malignancy: YesNo,
    pub malignancy_details: String,
    pub has_cns_malignancy: YesNo,
    pub has_autoimmune_disease: YesNo,
    pub autoimmune_details: String,
    pub has_diabetes: YesNo,
    pub diabetes_details: String,
    pub has_hypertension: YesNo,
    pub hypertension_details: String,
    pub has_cardiovascular_disease: YesNo,
    pub cardiovascular_details: String,
    pub has_active_infection: YesNo,
    pub active_infection_details: String,
    pub has_uncontrolled_sepsis: YesNo,
    pub has_cjd_risk: YesNo,
    pub cjd_details: String,
    pub iv_drug_use_history: YesNo,
    pub current_medications: String,
    pub previous_surgery: YesNo,
    pub surgery_details: String,
}

/// Step 4 — Organ Function Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrganFunction {
    pub creatinine: Option<f64>,
    pub egfr: Option<f64>,
    pub kidney_imaging: String,
    pub kidney_notes: String,
    pub alt: Option<f64>,
    pub ast: Option<f64>,
    pub bilirubin: Option<f64>,
    pub liver_imaging: String,
    pub liver_notes: String,
    pub ejection_fraction: Option<f64>,
    pub echocardiogram: String,
    pub cardiac_notes: String,
    pub pao2_fio2_ratio: Option<f64>,
    pub chest_imaging: String,
    pub pulmonary_notes: String,
    pub fasting_glucose: Option<f64>,
    pub hba1c: Option<f64>,
    pub pancreatic_notes: String,
    pub severe_organ_failure: YesNo,
    pub severe_organ_failure_details: String,
}

/// Step 5 — Infectious Disease Screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfectiousDiseaseScreening {
    pub hiv_status: String,
    pub hbs_ag: String,
    pub hbc_ab: String,
    pub hcv_ab: String,
    pub htlv_status: String,
    pub cmv_status: String,
    pub ebv_status: String,
    pub syphilis_screen: String,
    pub toxoplasma_status: String,
    pub tuberculosis_screen: String,
    pub recent_travel: YesNo,
    pub travel_details: String,
    pub recent_infection: YesNo,
    pub infection_details: String,
}

/// Step 6 — Immunological Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImmunologicalAssessment {
    pub donor_blood_group: String,
    pub recipient_blood_group: String,
    pub abo_compatibility: String,
    pub hla_a: String,
    pub hla_b: String,
    pub hla_c: String,
    pub hla_dr: String,
    pub hla_dq: String,
    pub hla_dp: String,
    pub hla_match_level: String,
    pub crossmatch_result: String,
    pub pra: Option<f64>,
    pub donor_specific_antibodies: YesNo,
    pub dsa_details: String,
}

/// Step 7 — Surgical Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalAssessment {
    pub asa_grade: String,
    pub previous_anaesthetic: YesNo,
    pub anaesthetic_complications: YesNo,
    pub complication_details: String,
    pub mallampati_score: String,
    pub airway_concerns: YesNo,
    pub airway_details: String,
    pub surgical_fitness: String,
    pub surgical_fitness_notes: String,
    pub planned_procedure: String,
    pub smoking_status: String,
    pub alcohol_use: String,
}

/// Step 8 — Psychological Assessment (Living Donor).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalAssessment {
    pub mental_capacity_confirmed: YesNo,
    pub understands_procedure: YesNo,
    pub understands_risks: YesNo,
    pub voluntary_decision: YesNo,
    pub coercion_concerns: YesNo,
    pub coercion_details: String,
    pub ambivalence: YesNo,
    pub ambivalence_details: String,
    pub anxiety_about_procedure: String,
    pub previous_psychological_issues: YesNo,
    pub psychological_issue_details: String,
    pub support_network: YesNo,
    pub willing_to_proceed: YesNo,
}

/// Step 9 — Ethical & Legal Requirements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EthicalLegalRequirements {
    pub hta_act_2004_compliant: YesNo,
    pub independent_assessor_review: YesNo,
    pub independent_assessor_name: String,
    pub independent_assessor_date: String,
    pub informed_consent_given: YesNo,
    pub consent_form_signed: YesNo,
    pub consent_date: String,
    pub witness_name: String,
    pub witness_role: String,
    pub information_leaflet_provided: YesNo,
    pub questions_answered: YesNo,
    pub financial_reward_check: YesNo,
    pub ethics_committee_approval: YesNo,
    pub ethics_approval_reference: String,
}

/// Step 10 — Eligibility & Allocation Decision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EligibilityAllocation {
    pub eligibility_decision: String,
    pub eligibility_conditions: String,
    pub deferral_reason: String,
    pub deferral_duration: String,
    pub allocated_organs: String,
    pub intended_recipient_centre: String,
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessment_date: String,
    pub additional_notes: String,
}

/// Full Organ Donation Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub donor_type_registration: DonorTypeRegistration,
    pub medical_history: MedicalHistory,
    pub organ_function: OrganFunction,
    pub infectious_disease_screening: InfectiousDiseaseScreening,
    pub immunological_assessment: ImmunologicalAssessment,
    pub surgical_assessment: SurgicalAssessment,
    pub psychological_assessment: PsychologicalAssessment,
    pub ethical_legal_requirements: EthicalLegalRequirements,
    pub eligibility_allocation: EligibilityAllocation,
}

/// A donor rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: u32,
}

/// A safety flag for the clinician.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an organ-donation assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub eligibility: Eligibility,
    pub risk_level: RiskLevel,
    pub suggested_eligibility: Eligibility,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
