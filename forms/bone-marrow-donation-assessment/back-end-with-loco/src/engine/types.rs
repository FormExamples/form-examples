use serde::{Deserialize, Serialize};

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
}

/// Step 2 — Donor Registration & HLA Typing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorRegistrationHlaTyping {
    pub donor_registry: String,
    pub donor_registry_id: String,
    pub registration_date: String,
    pub donation_type: String,
    pub recipient_relationship: String,
    pub hla_a: String,
    pub hla_b: String,
    pub hla_c: String,
    pub hla_drb1: String,
    pub hla_dqb1: String,
    pub hla_dpb1: String,
    pub hla_match_level: String,
    pub crossmatch_result: String,
    pub previous_donation: YesNo,
    pub previous_donation_details: String,
}

/// Step 3 — Medical History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    pub has_autoimmune_disease: YesNo,
    pub autoimmune_details: String,
    pub has_malignancy: YesNo,
    pub malignancy_details: String,
    pub has_cardiovascular_disease: YesNo,
    pub cardiovascular_details: String,
    pub has_respiratory_disease: YesNo,
    pub respiratory_details: String,
    pub has_renal_disease: YesNo,
    pub renal_details: String,
    pub has_hepatic_disease: YesNo,
    pub hepatic_details: String,
    pub has_bleeding_disorder: YesNo,
    pub bleeding_disorder_details: String,
    pub has_neurological_condition: YesNo,
    pub neurological_details: String,
    pub current_medications: String,
    pub drug_allergies: String,
    pub previous_surgery: YesNo,
    pub surgery_details: String,
}

/// Step 4 — Physical Examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    pub bp_systolic: Option<i32>,
    pub bp_diastolic: Option<i32>,
    pub heart_rate: Option<i32>,
    pub temperature: Option<f64>,
    pub respiratory_rate: Option<i32>,
    pub oxygen_saturation: Option<i32>,
    pub general_appearance: String,
    pub cardiovascular_examination: String,
    pub cardiovascular_findings: String,
    pub respiratory_examination: String,
    pub respiratory_findings: String,
    pub abdominal_examination: String,
    pub abdominal_findings: String,
    pub venous_access_assessment: String,
    pub posterior_iliac_crest_assessment: String,
}

/// Step 5 — Haematological Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HaematologicalAssessment {
    pub haemoglobin: Option<f64>,
    pub white_cell_count: Option<f64>,
    pub platelet_count: Option<f64>,
    pub neutrophil_count: Option<f64>,
    pub lymphocyte_count: Option<f64>,
    pub haematocrit: Option<f64>,
    pub mcv: Option<f64>,
    pub blood_group: String,
    pub coagulation_screen: String,
    pub coagulation_details: String,
    pub ferritin: Option<f64>,
    pub creatinine: Option<f64>,
    pub liver_function: String,
    pub liver_function_details: String,
}

/// Step 6 — Infectious Disease Screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfectiousDiseaseScreening {
    pub hiv_status: String,
    pub hepatitis_b_surface_antigen: String,
    pub hepatitis_b_core_antibody: String,
    pub hepatitis_c_abntibody: String,
    pub htlv_status: String,
    pub syphilis_screen: String,
    pub cmv_status: String,
    pub ebv_status: String,
    pub toxoplasma_status: String,
    pub tuberculosis_screen: String,
    pub recent_travel: YesNo,
    pub travel_details: String,
    pub recent_infection: YesNo,
    pub infection_details: String,
    pub vaccination_up_to_date: YesNo,
}

/// Step 7 — Anaesthetic Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnaestheticAssessment {
    pub asa_grade: String,
    pub previous_anaesthetic: YesNo,
    pub anaesthetic_complications: YesNo,
    pub complication_details: String,
    pub family_anaesthetic_problems: YesNo,
    pub family_problem_details: String,
    pub mallampati_score: String,
    pub airway_concerns: YesNo,
    pub airway_details: String,
    pub nil_by_mouth_confirmed: YesNo,
    pub smoking_status: String,
    pub alcohol_use: String,
    pub anaesthetic_plan: String,
}

/// Step 8 — Collection Method Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CollectionMethodAssessment {
    pub preferred_method: String,
    pub recipient_preference: String,
    pub final_collection_method: String,
    pub gcsf_eligible: String,
    pub gcsf_contraindications: String,
    pub venous_access_suitable_for_apheresis: String,
    pub central_line_required: YesNo,
    pub estimated_donor_weight_kg: Option<f64>,
    pub target_cd34_dose: Option<f64>,
    pub estimated_collection_days: Option<i32>,
    pub bone_marrow_harvest_volume_ml: Option<f64>,
    pub autologous_blood_donation: YesNo,
}

/// Step 9 — Psychological Readiness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalReadiness {
    pub understands_procedure: YesNo,
    pub understands_risks: YesNo,
    pub voluntary_decision: YesNo,
    pub coercion_concerns: YesNo,
    pub coercion_details: String,
    pub anxiety_about_procedure: String,
    pub previous_psychological_issues: YesNo,
    pub psychological_issue_details: String,
    pub support_network: YesNo,
    pub time_off_work_arranged: YesNo,
    pub donor_advocate_consulted: YesNo,
    pub willing_to_proceed: String,
}

/// Step 10 — Consent & Eligibility Decision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsentEligibility {
    pub informed_consent_given: YesNo,
    pub consent_form_signed: YesNo,
    pub consent_date: String,
    pub witness_name: String,
    pub witness_role: String,
    pub information_leaflet_provided: YesNo,
    pub questions_answered: YesNo,
    pub eligibility_decision: String,
    pub eligibility_conditions: String,
    pub deferral_reason: String,
    pub deferral_duration: String,
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessment_date: String,
}

/// Full bone marrow donor assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub donor_registration_hla_typing: DonorRegistrationHlaTyping,
    pub medical_history: MedicalHistory,
    pub physical_examination: PhysicalExamination,
    pub haematological_assessment: HaematologicalAssessment,
    pub infectious_disease_screening: InfectiousDiseaseScreening,
    pub anaesthetic_assessment: AnaestheticAssessment,
    pub collection_method_assessment: CollectionMethodAssessment,
    pub psychological_readiness: PsychologicalReadiness,
    pub consent_eligibility: ConsentEligibility,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: u32,
}

/// A flagged issue (independent of rule firing).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a donor assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub eligibility: Eligibility,
    pub overall_risk: RiskLevel,
    pub suggested_eligibility: Eligibility,
    pub hla_match_level: String,
    pub collection_method: String,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
