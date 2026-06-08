//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ────────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
}

// ─── Cardiac History (Step 2) ────────────────────────────────

/// Cardiac history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiacHistory {
    /// Previous mi.
    pub previous_mi: String,
    /// Previous cabg.
    pub previous_cabg: String,
    /// Previous pci.
    pub previous_pci: String,
    /// Heart failure.
    pub heart_failure: String,
    /// Atrial fibrillation.
    pub atrial_fibrillation: String,
    /// Valvular disease.
    pub valvular_disease: String,
    /// Pacemaker.
    pub pacemaker: String,
    /// Family cardiac history.
    pub family_cardiac_history: String,
    /// Sudden cardiac death.
    pub sudden_cardiac_death: String,
}

// ─── Symptoms Assessment (Step 3) ────────────────────────────

/// Symptoms assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomsAssessment {
    /// Chest pain.
    pub chest_pain: String,
    /// Chest pain type.
    pub chest_pain_type: String,
    /// Dyspnoea.
    pub dyspnoea: Option<u8>,
    /// Orthopnoea.
    pub orthopnoea: String,
    /// Pnd.
    pub pnd: String,
    /// Palpitations.
    pub palpitations: String,
    /// Syncope.
    pub syncope: String,
    /// Peripheral oedema.
    pub peripheral_oedema: String,
    /// Nyha class.
    pub nyha_class: String,
    /// Exercise tolerance.
    pub exercise_tolerance: String,
}

// ─── Risk Factors (Step 4) ───────────────────────────────────

/// Risk factors.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RiskFactors {
    /// Hypertension.
    pub hypertension: String,
    /// Diabetes.
    pub diabetes: String,
    /// Dyslipidaemia.
    pub dyslipidaemia: String,
    /// Smoking status.
    pub smoking_status: String,
    /// BMI.
    pub bmi: Option<f64>,
    /// Family cad history.
    pub family_cad_history: String,
    /// Chronic kidney disease.
    pub chronic_kidney_disease: String,
    /// Obstructive sleep apnoea.
    pub obstructive_sleep_apnoea: String,
}

// ─── Physical Examination (Step 5) ───────────────────────────

/// Physical examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    /// Heart rate.
    pub heart_rate: Option<u8>,
    /// Blood pressure systolic.
    pub blood_pressure_systolic: Option<f64>,
    /// Blood pressure diastolic.
    pub blood_pressure_diastolic: Option<f64>,
    /// Heart rhythm.
    pub heart_rhythm: String,
    /// Heart sounds.
    pub heart_sounds: String,
    /// Murmur.
    pub murmur: String,
    /// Murmur grade.
    pub murmur_grade: String,
    /// Jvp elevated.
    pub jvp_elevated: String,
    /// Peripheral oedema exam.
    pub peripheral_oedema_exam: String,
    /// Lung creps.
    pub lung_creps: String,
}

// ─── ECG Findings (Step 6) ───────────────────────────────────

/// ECG findings.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EcgFindings {
    /// ECG rhythm.
    pub ecg_rhythm: String,
    /// Heart rate ECG.
    pub heart_rate_ecg: Option<u8>,
    /// Pr interval.
    pub pr_interval: Option<u16>,
    /// Qrs duration.
    pub qrs_duration: Option<u16>,
    /// Qtc interval.
    pub qtc_interval: Option<u16>,
    /// St changes.
    pub st_changes: String,
    /// T wave changes.
    pub t_wave_changes: String,
    /// Bundle branch block.
    pub bundle_branch_block: String,
    /// Lvh.
    pub lvh: String,
    /// ECG interpretation.
    pub ecg_interpretation: String,
}

// ─── Echocardiography (Step 7) ───────────────────────────────

/// Echocardiography.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Echocardiography {
    /// Lvef.
    pub lvef: Option<u8>,
    /// Lvef category.
    pub lvef_category: String,
    /// Lv diastolic function.
    pub lv_diastolic_function: String,
    /// Rwma.
    pub rwma: String,
    /// Valvular abnormality.
    pub valvular_abnormality: String,
    /// Aortic valve.
    pub aortic_valve: String,
    /// Mitral valve.
    pub mitral_valve: String,
    /// Right heart function.
    pub right_heart_function: String,
    /// Pericardial effusion.
    pub pericardial_effusion: String,
}

// ─── Investigations (Step 8) ─────────────────────────────────

/// Investigations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// Troponin.
    pub troponin: Option<f64>,
    /// Bnp.
    pub bnp: Option<f64>,
    /// Creatinine.
    pub creatinine: Option<f64>,
    /// Egfr.
    pub egfr: Option<f64>,
    /// Lipid profile.
    pub lipid_profile: String,
    /// Thyroid function.
    pub thyroid_function: String,
    /// Coronary angiogram done.
    pub coronary_angiogram_done: String,
    /// Coronary angiogram result.
    pub coronary_angiogram_result: String,
    /// Stress test done.
    pub stress_test_done: String,
    /// Stress test result.
    pub stress_test_result: String,
}

// ─── Current Treatment (Step 9) ──────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Beta blocker.
    pub beta_blocker: String,
    /// Ace inhibitor.
    pub ace_inhibitor: String,
    /// Arb.
    pub arb: String,
    /// Diuretic.
    pub diuretic: String,
    /// Anticoagulant.
    pub anticoagulant: String,
    /// Antiplatelet.
    pub antiplatelet: String,
    /// Statin.
    pub statin: String,
    /// Calcium channel blocker.
    pub calcium_channel_blocker: String,
    /// Nitrate.
    pub nitrate: String,
    /// Device therapy.
    pub device_therapy: String,
}

// ─── Clinical Review (Step 10) ───────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Severity level.
    pub severity_level: String,
    /// Nyha classification.
    pub nyha_classification: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Management plan.
    pub management_plan: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Urgency.
    pub urgency: String,
}

// ─── Assessment Data (all sections) ──────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Cardiac history.
    pub cardiac_history: CardiacHistory,
    /// Symptoms assessment.
    pub symptoms_assessment: SymptomsAssessment,
    /// Risk factors.
    pub risk_factors: RiskFactors,
    /// Physical examination.
    pub physical_examination: PhysicalExamination,
    /// ECG findings.
    pub ecg_findings: EcgFindings,
    /// Echocardiography.
    pub echocardiography: Echocardiography,
    /// Investigations.
    pub investigations: Investigations,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ───────────────────────────────────────────

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
