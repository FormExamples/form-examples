//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Oncology level.
pub type OncologyLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Medical record number.
    pub medical_record_number: String,
    /// Referring physician.
    pub referring_physician: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Primary oncologist.
    pub primary_oncologist: String,
    /// Insurance status.
    pub insurance_status: String,
}

// ─── Cancer Diagnosis (Step 2) ──────────────────────────────

/// Cancer diagnosis.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CancerDiagnosis {
    /// Cancer type.
    pub cancer_type: String,
    /// Cancer site.
    pub cancer_site: String,
    /// Histology.
    pub histology: String,
    /// Histology other.
    pub histology_other: String,
    /// Date of diagnosis.
    pub date_of_diagnosis: String,
    /// Diagnosis method.
    pub diagnosis_method: String,
    /// Biomarkers tested.
    pub biomarkers_tested: String,
    /// Genetic testing done.
    pub genetic_testing_done: String,
    /// Family cancer history.
    pub family_cancer_history: String,
}

// ─── Staging & Grading (Step 3) ─────────────────────────────

/// Staging grading.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StagingGrading {
    /// TNM t stage.
    pub tnm_t_stage: String,
    /// TNM n stage.
    pub tnm_n_stage: String,
    /// TNM m stage.
    pub tnm_m_stage: String,
    /// Overall stage.
    pub overall_stage: String,
    /// Tumor grade.
    pub tumor_grade: String,
    /// Metastatic sites.
    pub metastatic_sites: String,
    /// Staging date.
    pub staging_date: String,
    /// Staging method.
    pub staging_method: String,
}

// ─── Treatment History (Step 4) ─────────────────────────────

/// Treatment history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentHistory {
    /// Prior surgery.
    pub prior_surgery: String,
    /// Surgery date.
    pub surgery_date: String,
    /// Prior radiation.
    pub prior_radiation: String,
    /// Radiation site.
    pub radiation_site: String,
    /// Prior chemotherapy.
    pub prior_chemotherapy: String,
    /// Chemotherapy regimen.
    pub chemotherapy_regimen: String,
    /// Prior immunotherapy.
    pub prior_immunotherapy: String,
    /// Treatment response.
    pub treatment_response: String,
}

// ─── Current Treatment (Step 5) ─────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Current treatment type.
    pub current_treatment_type: String,
    /// Current regimen.
    pub current_regimen: String,
    /// Treatment cycle.
    pub treatment_cycle: String,
    /// Treatment start date.
    pub treatment_start_date: String,
    /// Treatment intent.
    pub treatment_intent: String,
    /// Clinical trial enrollment.
    pub clinical_trial_enrollment: String,
    /// Treatment modifications.
    pub treatment_modifications: String,
    /// Next treatment date.
    pub next_treatment_date: String,
}

// ─── Side Effects & Toxicity (Step 6) ───────────────────────

/// Side effects toxicity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SideEffectsToxicity {
    /// Nausea severity.
    pub nausea_severity: Option<u8>,
    /// Fatigue severity.
    pub fatigue_severity: Option<u8>,
    /// Pain severity.
    pub pain_severity: Option<u8>,
    /// Neuropathy severity.
    pub neuropathy_severity: Option<u8>,
    /// Mucositis severity.
    pub mucositis_severity: Option<u8>,
    /// Skin toxicity severity.
    pub skin_toxicity_severity: Option<u8>,
    /// Hematologic toxicity.
    pub hematologic_toxicity: String,
    /// Weight change.
    pub weight_change: String,
}

// ─── Performance Status (Step 7) ────────────────────────────

/// Performance status.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PerformanceStatus {
    /// Ecog score.
    pub ecog_score: Option<u8>,
    /// Karnofsky score.
    pub karnofsky_score: Option<u8>,
    /// Mobility level.
    pub mobility_level: String,
    /// Self care ability.
    pub self_care_ability: Option<u8>,
    /// Daily activity level.
    pub daily_activity_level: Option<u8>,
    /// Nutritional status.
    pub nutritional_status: Option<u8>,
    /// Cognitive function.
    pub cognitive_function: Option<u8>,
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
}

// ─── Psychosocial Assessment (Step 8) ───────────────────────

/// Psychosocial assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PsychosocialAssessment {
    /// Anxiety level.
    pub anxiety_level: Option<u8>,
    /// Depression screening.
    pub depression_screening: Option<u8>,
    /// Distress thermometer.
    pub distress_thermometer: Option<u8>,
    /// Social support.
    pub social_support: Option<u8>,
    /// Financial toxicity.
    pub financial_toxicity: Option<u8>,
    /// Coping ability.
    pub coping_ability: Option<u8>,
    /// Spiritual needs.
    pub spiritual_needs: String,
    /// Caregiver burden.
    pub caregiver_burden: String,
}

// ─── Palliative Care Needs (Step 9) ─────────────────────────

/// Palliative care needs.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PalliativeCareNeeds {
    /// Symptom burden.
    pub symptom_burden: Option<u8>,
    /// Pain management adequacy.
    pub pain_management_adequacy: Option<u8>,
    /// Advance directive status.
    pub advance_directive_status: String,
    /// Goals of care discussed.
    pub goals_of_care_discussed: String,
    /// Hospice referral indicated.
    pub hospice_referral_indicated: String,
    /// Quality of life score.
    pub quality_of_life_score: Option<u8>,
    /// End of life planning.
    pub end_of_life_planning: String,
    /// Palliative care referral.
    pub palliative_care_referral: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Tumor board reviewed.
    pub tumor_board_reviewed: String,
    /// Next imaging date.
    pub next_imaging_date: String,
    /// Lab monitoring plan.
    pub lab_monitoring_plan: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Referrals needed.
    pub referrals_needed: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Survivorship plan.
    pub survivorship_plan: String,
    /// Patient education provided.
    pub patient_education_provided: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Cancer diagnosis.
    pub cancer_diagnosis: CancerDiagnosis,
    /// Staging grading.
    pub staging_grading: StagingGrading,
    /// Treatment history.
    pub treatment_history: TreatmentHistory,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
    /// Side effects toxicity.
    pub side_effects_toxicity: SideEffectsToxicity,
    /// Performance status.
    pub performance_status: PerformanceStatus,
    /// Psychosocial assessment.
    pub psychosocial_assessment: PsychosocialAssessment,
    /// Palliative care needs.
    pub palliative_care_needs: PalliativeCareNeeds,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

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
    /// Oncology level.
    pub oncology_level: OncologyLevel,
    /// Oncology score.
    pub oncology_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
