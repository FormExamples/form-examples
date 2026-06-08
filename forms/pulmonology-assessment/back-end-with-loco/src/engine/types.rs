//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referring physician.
    pub referring_physician: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Primary complaint.
    pub primary_complaint: String,
    /// Insurance status.
    pub insurance_status: String,
}

// ─── Respiratory History (Step 2) ───────────────────────────

/// Respiratory history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RespiratoryHistory {
    /// Asthma history.
    pub asthma_history: String,
    /// Copd history.
    pub copd_history: String,
    /// Pneumonia history.
    pub pneumonia_history: String,
    /// Tuberculosis history.
    pub tuberculosis_history: String,
    /// Lung cancer history.
    pub lung_cancer_history: String,
    /// Interstitial lung disease.
    pub interstitial_lung_disease: String,
    /// Family respiratory history.
    pub family_respiratory_history: String,
    /// Previous hospitalizations.
    pub previous_hospitalizations: Option<u8>,
}

// ─── Symptom Assessment (Step 3) ────────────────────────────

/// Symptom assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomAssessment {
    /// Dyspnea severity.
    pub dyspnea_severity: Option<u8>,
    /// Cough severity.
    pub cough_severity: Option<u8>,
    /// Sputum production.
    pub sputum_production: Option<u8>,
    /// Wheezing frequency.
    pub wheezing_frequency: Option<u8>,
    /// Chest tightness.
    pub chest_tightness: Option<u8>,
    /// Hemoptysis present.
    pub hemoptysis_present: String,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Nocturnal symptoms.
    pub nocturnal_symptoms: Option<u8>,
}

// ─── Smoking & Exposure (Step 4) ────────────────────────────

/// Smoking exposure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SmokingExposure {
    /// Smoking status.
    pub smoking_status: String,
    /// Pack years.
    pub pack_years: String,
    /// Secondhand smoke.
    pub secondhand_smoke: String,
    /// Occupational exposure.
    pub occupational_exposure: String,
    /// Environmental allergens.
    pub environmental_allergens: String,
    /// Dust exposure.
    pub dust_exposure: String,
    /// Chemical exposure.
    pub chemical_exposure: String,
    /// Asbestos exposure.
    pub asbestos_exposure: String,
}

// ─── Pulmonary Function Tests (Step 5) ──────────────────────

/// Pulmonary function tests.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PulmonaryFunctionTests {
    /// Fev1 percent predicted.
    pub fev1_percent_predicted: Option<u8>,
    /// Fvc percent predicted.
    pub fvc_percent_predicted: Option<u8>,
    /// Fev1 fvc ratio.
    pub fev1_fvc_ratio: Option<u8>,
    /// Dlco percent predicted.
    pub dlco_percent_predicted: Option<u8>,
    /// Bronchodilator response.
    pub bronchodilator_response: String,
    /// Peak flow variability.
    pub peak_flow_variability: Option<u8>,
    /// Lung volumes normal.
    pub lung_volumes_normal: String,
    /// Flow volume loop pattern.
    pub flow_volume_loop_pattern: String,
}

// ─── Chest Imaging (Step 6) ─────────────────────────────────

/// Chest imaging.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ChestImaging {
    /// Chest xray findings.
    pub chest_xray_findings: String,
    /// CT scan findings.
    pub ct_scan_findings: String,
    /// Nodule detected.
    pub nodule_detected: String,
    /// Nodule size mm.
    pub nodule_size_mm: String,
    /// Pleural effusion.
    pub pleural_effusion: String,
    /// Consolidation present.
    pub consolidation_present: String,
    /// Fibrosis pattern.
    pub fibrosis_pattern: String,
    /// Imaging urgency.
    pub imaging_urgency: Option<u8>,
}

// ─── Arterial Blood Gases (Step 7) ──────────────────────────

/// Arterial blood gases.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ArterialBloodGases {
    /// Pao2 mmhg.
    pub pao2_mmhg: String,
    /// Paco2 mmhg.
    pub paco2_mmhg: String,
    /// Ph level.
    pub ph_level: String,
    /// Sao2 percent.
    pub sao2_percent: String,
    /// Bicarbonate level.
    pub bicarbonate_level: String,
    /// Supplemental oxygen.
    pub supplemental_oxygen: String,
    /// Oxygen flow rate.
    pub oxygen_flow_rate: String,
    /// Abg interpretation.
    pub abg_interpretation: Option<u8>,
}

// ─── Sleep & Breathing (Step 8) ─────────────────────────────

/// Sleep breathing.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SleepBreathing {
    /// Snoring severity.
    pub snoring_severity: Option<u8>,
    /// Apnea witnessed.
    pub apnea_witnessed: String,
    /// Daytime sleepiness.
    pub daytime_sleepiness: Option<u8>,
    /// Sleep study done.
    pub sleep_study_done: String,
    /// Ahi score.
    pub ahi_score: String,
    /// Cpap compliance.
    pub cpap_compliance: String,
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
    /// Morning headaches.
    pub morning_headaches: String,
}

// ─── Current Treatment (Step 9) ─────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Inhaler use.
    pub inhaler_use: String,
    /// Inhaler technique.
    pub inhaler_technique: Option<u8>,
    /// Oral medications.
    pub oral_medications: String,
    /// Oxygen therapy.
    pub oxygen_therapy: String,
    /// Pulmonary rehab.
    pub pulmonary_rehab: String,
    /// Treatment adherence.
    pub treatment_adherence: Option<u8>,
    /// Side effects reported.
    pub side_effects_reported: String,
    /// Treatment effectiveness.
    pub treatment_effectiveness: Option<u8>,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall severity impression.
    pub overall_severity_impression: Option<u8>,
    /// Exacerbation frequency.
    pub exacerbation_frequency: String,
    /// Exercise tolerance.
    pub exercise_tolerance: Option<u8>,
    /// Quality of life impact.
    pub quality_of_life_impact: Option<u8>,
    /// Follow up urgency.
    pub follow_up_urgency: Option<u8>,
    /// Specialist referral needed.
    pub specialist_referral_needed: String,
    /// Additional tests needed.
    pub additional_tests_needed: String,
    /// Clinical notes.
    pub clinical_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Respiratory history.
    pub respiratory_history: RespiratoryHistory,
    /// Symptom assessment.
    pub symptom_assessment: SymptomAssessment,
    /// Smoking exposure.
    pub smoking_exposure: SmokingExposure,
    /// Pulmonary function tests.
    pub pulmonary_function_tests: PulmonaryFunctionTests,
    /// Chest imaging.
    pub chest_imaging: ChestImaging,
    /// Arterial blood gases.
    pub arterial_blood_gases: ArterialBloodGases,
    /// Sleep breathing.
    pub sleep_breathing: SleepBreathing,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
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
    /// Severity level.
    pub severity_level: SeverityLevel,
    /// Severity score.
    pub severity_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
