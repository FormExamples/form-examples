//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

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
}

/// Step 2 — Donor Registration & HLA Typing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorRegistrationHlaTyping {
    /// Donor registry.
    pub donor_registry: String,
    /// Donor registry ID.
    pub donor_registry_id: String,
    /// Registration date.
    pub registration_date: String,
    /// Donation type.
    pub donation_type: String,
    /// Recipient relationship.
    pub recipient_relationship: String,
    /// Hla a.
    pub hla_a: String,
    /// Hla b.
    pub hla_b: String,
    /// Hla c.
    pub hla_c: String,
    /// Hla drb1.
    pub hla_drb1: String,
    /// Hla dqb1.
    pub hla_dqb1: String,
    /// Hla dpb1.
    pub hla_dpb1: String,
    /// Hla match level.
    pub hla_match_level: String,
    /// Crossmatch result.
    pub crossmatch_result: String,
    /// Previous donation.
    pub previous_donation: YesNo,
    /// Previous donation details.
    pub previous_donation_details: String,
}

/// Step 3 — Medical History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Has autoimmune disease.
    pub has_autoimmune_disease: YesNo,
    /// Autoimmune details.
    pub autoimmune_details: String,
    /// Has malignancy.
    pub has_malignancy: YesNo,
    /// Malignancy details.
    pub malignancy_details: String,
    /// Has cardiovascular disease.
    pub has_cardiovascular_disease: YesNo,
    /// Cardiovascular details.
    pub cardiovascular_details: String,
    /// Has respiratory disease.
    pub has_respiratory_disease: YesNo,
    /// Respiratory details.
    pub respiratory_details: String,
    /// Has renal disease.
    pub has_renal_disease: YesNo,
    /// Renal details.
    pub renal_details: String,
    /// Has hepatic disease.
    pub has_hepatic_disease: YesNo,
    /// Hepatic details.
    pub hepatic_details: String,
    /// Has bleeding disorder.
    pub has_bleeding_disorder: YesNo,
    /// Bleeding disorder details.
    pub bleeding_disorder_details: String,
    /// Has neurological condition.
    pub has_neurological_condition: YesNo,
    /// Neurological details.
    pub neurological_details: String,
    /// Current medications.
    pub current_medications: String,
    /// Drug allergies.
    pub drug_allergies: String,
    /// Previous surgery.
    pub previous_surgery: YesNo,
    /// Surgery details.
    pub surgery_details: String,
}

/// Step 4 — Physical Examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    /// BP systolic.
    pub bp_systolic: Option<i32>,
    /// BP diastolic.
    pub bp_diastolic: Option<i32>,
    /// Heart rate.
    pub heart_rate: Option<i32>,
    /// Temperature.
    pub temperature: Option<f64>,
    /// Respiratory rate.
    pub respiratory_rate: Option<i32>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<i32>,
    /// General appearance.
    pub general_appearance: String,
    /// Cardiovascular examination.
    pub cardiovascular_examination: String,
    /// Cardiovascular findings.
    pub cardiovascular_findings: String,
    /// Respiratory examination.
    pub respiratory_examination: String,
    /// Respiratory findings.
    pub respiratory_findings: String,
    /// Abdominal examination.
    pub abdominal_examination: String,
    /// Abdominal findings.
    pub abdominal_findings: String,
    /// Venous access assessment.
    pub venous_access_assessment: String,
    /// Posterior iliac crest assessment.
    pub posterior_iliac_crest_assessment: String,
}

/// Step 5 — Haematological Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HaematologicalAssessment {
    /// Haemoglobin.
    pub haemoglobin: Option<f64>,
    /// White cell count.
    pub white_cell_count: Option<f64>,
    /// Platelet count.
    pub platelet_count: Option<f64>,
    /// Neutrophil count.
    pub neutrophil_count: Option<f64>,
    /// Lymphocyte count.
    pub lymphocyte_count: Option<f64>,
    /// Haematocrit.
    pub haematocrit: Option<f64>,
    /// Mcv.
    pub mcv: Option<f64>,
    /// Blood group.
    pub blood_group: String,
    /// Coagulation screen.
    pub coagulation_screen: String,
    /// Coagulation details.
    pub coagulation_details: String,
    /// Ferritin.
    pub ferritin: Option<f64>,
    /// Creatinine.
    pub creatinine: Option<f64>,
    /// Liver function.
    pub liver_function: String,
    /// Liver function details.
    pub liver_function_details: String,
}

/// Step 6 — Infectious Disease Screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfectiousDiseaseScreening {
    /// Hiv status.
    pub hiv_status: String,
    /// Hepatitis b surface antigen.
    pub hepatitis_b_surface_antigen: String,
    /// Hepatitis b core antibody.
    pub hepatitis_b_core_antibody: String,
    /// Hepatitis c abntibody.
    pub hepatitis_c_abntibody: String,
    /// Htlv status.
    pub htlv_status: String,
    /// Syphilis screen.
    pub syphilis_screen: String,
    /// Cmv status.
    pub cmv_status: String,
    /// Ebv status.
    pub ebv_status: String,
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
    /// Vaccination up to date.
    pub vaccination_up_to_date: YesNo,
}

/// Step 7 — Anaesthetic Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnaestheticAssessment {
    /// Asa grade.
    pub asa_grade: String,
    /// Previous anaesthetic.
    pub previous_anaesthetic: YesNo,
    /// Anaesthetic complications.
    pub anaesthetic_complications: YesNo,
    /// Complication details.
    pub complication_details: String,
    /// Family anaesthetic problems.
    pub family_anaesthetic_problems: YesNo,
    /// Family problem details.
    pub family_problem_details: String,
    /// Mallampati score.
    pub mallampati_score: String,
    /// Airway concerns.
    pub airway_concerns: YesNo,
    /// Airway details.
    pub airway_details: String,
    /// Nil by mouth confirmed.
    pub nil_by_mouth_confirmed: YesNo,
    /// Smoking status.
    pub smoking_status: String,
    /// Alcohol use.
    pub alcohol_use: String,
    /// Anaesthetic plan.
    pub anaesthetic_plan: String,
}

/// Step 8 — Collection Method Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CollectionMethodAssessment {
    /// Preferred method.
    pub preferred_method: String,
    /// Recipient preference.
    pub recipient_preference: String,
    /// Final collection method.
    pub final_collection_method: String,
    /// Gcsf eligible.
    pub gcsf_eligible: String,
    /// Gcsf contraindications.
    pub gcsf_contraindications: String,
    /// Venous access suitable for apheresis.
    pub venous_access_suitable_for_apheresis: String,
    /// Central line required.
    pub central_line_required: YesNo,
    /// Estimated donor weight kg.
    pub estimated_donor_weight_kg: Option<f64>,
    /// Target cd34 dose.
    pub target_cd34_dose: Option<f64>,
    /// Estimated collection days.
    pub estimated_collection_days: Option<i32>,
    /// Bone marrow harvest volume ml.
    pub bone_marrow_harvest_volume_ml: Option<f64>,
    /// Autologous blood donation.
    pub autologous_blood_donation: YesNo,
}

/// Step 9 — Psychological Readiness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalReadiness {
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
    /// Anxiety about procedure.
    pub anxiety_about_procedure: String,
    /// Previous psychological issues.
    pub previous_psychological_issues: YesNo,
    /// Psychological issue details.
    pub psychological_issue_details: String,
    /// Support network.
    pub support_network: YesNo,
    /// Time off work arranged.
    pub time_off_work_arranged: YesNo,
    /// Donor advocate consulted.
    pub donor_advocate_consulted: YesNo,
    /// Willing to proceed.
    pub willing_to_proceed: String,
}

/// Step 10 — Consent & Eligibility Decision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsentEligibility {
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
    /// Eligibility decision.
    pub eligibility_decision: String,
    /// Eligibility conditions.
    pub eligibility_conditions: String,
    /// Deferral reason.
    pub deferral_reason: String,
    /// Deferral duration.
    pub deferral_duration: String,
    /// Assessor name.
    pub assessor_name: String,
    /// Assessor role.
    pub assessor_role: String,
    /// Assessment date.
    pub assessment_date: String,
}

/// Full bone marrow donor assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Donor registration hla typing.
    pub donor_registration_hla_typing: DonorRegistrationHlaTyping,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Physical examination.
    pub physical_examination: PhysicalExamination,
    /// Haematological assessment.
    pub haematological_assessment: HaematologicalAssessment,
    /// Infectious disease screening.
    pub infectious_disease_screening: InfectiousDiseaseScreening,
    /// Anaesthetic assessment.
    pub anaesthetic_assessment: AnaestheticAssessment,
    /// Collection method assessment.
    pub collection_method_assessment: CollectionMethodAssessment,
    /// Psychological readiness.
    pub psychological_readiness: PsychologicalReadiness,
    /// Consent eligibility.
    pub consent_eligibility: ConsentEligibility,
}

/// A rule that fired during grading.
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

/// A flagged issue (independent of rule firing).
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

/// Grading output for a donor assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Eligibility.
    pub eligibility: Eligibility,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Suggested eligibility.
    pub suggested_eligibility: Eligibility,
    /// Hla match level.
    pub hla_match_level: String,
    /// Collection method.
    pub collection_method: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
