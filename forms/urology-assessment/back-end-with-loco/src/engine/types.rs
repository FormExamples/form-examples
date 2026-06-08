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
    /// Patient sex.
    pub patient_sex: String,
    /// Referral date.
    pub referral_date: String,
    /// Referring provider.
    pub referring_provider: String,
    /// Reason for referral.
    pub reason_for_referral: String,
}

// ─── Urinary Symptoms / IPSS (Step 2) ──────────────────────

/// Urinary symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UrinarySymptoms {
    /// Incomplete emptying.
    pub incomplete_emptying: Option<u8>,
    /// Frequency.
    pub frequency: Option<u8>,
    /// Intermittency.
    pub intermittency: Option<u8>,
    /// Urgency.
    pub urgency: Option<u8>,
    /// Weak stream.
    pub weak_stream: Option<u8>,
    /// Straining.
    pub straining: Option<u8>,
    /// Nocturia.
    pub nocturia: Option<u8>,
    /// Quality of life.
    pub quality_of_life: Option<u8>,
}

// ─── Lower Urinary Tract (Step 3) ──────────────────────────

/// Lower urinary tract.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LowerUrinaryTract {
    /// Dysuria.
    pub dysuria: String,
    /// Haematuria.
    pub haematuria: String,
    /// Incontinence type.
    pub incontinence_type: String,
    /// Incontinence severity.
    pub incontinence_severity: Option<u8>,
    /// Urinary retention.
    pub urinary_retention: String,
    /// Recurrent uti.
    pub recurrent_uti: String,
    /// Uti frequency per year.
    pub uti_frequency_per_year: Option<u8>,
}

// ─── Renal Function (Step 4) ───────────────────────────────

/// Renal function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RenalFunction {
    /// Egfr.
    pub egfr: Option<u8>,
    /// Creatinine.
    pub creatinine: Option<u16>,
    /// Proteinuria.
    pub proteinuria: String,
    /// Hydronephrosis.
    pub hydronephrosis: String,
    /// Renal impairment known.
    pub renal_impairment_known: String,
    /// Dialysis.
    pub dialysis: String,
}

// ─── Prostate Assessment (Step 5) ──────────────────────────

/// Prostate assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ProstateAssessment {
    /// Psa level.
    pub psa_level: Option<f64>,
    /// Psa velocity.
    pub psa_velocity: String,
    /// Dre findings.
    pub dre_findings: String,
    /// Prostate volume.
    pub prostate_volume: String,
    /// Bph medication.
    pub bph_medication: String,
    /// Family history prostate cancer.
    pub family_history_prostate_cancer: String,
}

// ─── Bladder Assessment (Step 6) ───────────────────────────

/// Bladder assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BladderAssessment {
    /// Post void residual.
    pub post_void_residual: String,
    /// Bladder capacity.
    pub bladder_capacity: String,
    /// Overactive bladder.
    pub overactive_bladder: String,
    /// Bladder diary completed.
    pub bladder_diary_completed: String,
    /// Fluid intake daily.
    pub fluid_intake_daily: String,
    /// Caffeine intake.
    pub caffeine_intake: String,
}

// ─── Stone Disease (Step 7) ────────────────────────────────

/// Stone disease.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StoneDisease {
    /// Stone history.
    pub stone_history: String,
    /// Stone location.
    pub stone_location: String,
    /// Stone size mm.
    pub stone_size_mm: Option<u8>,
    /// Stone composition.
    pub stone_composition: String,
    /// Current pain level.
    pub current_pain_level: Option<u8>,
    /// Recurrent stones.
    pub recurrent_stones: String,
}

// ─── Urological Cancers (Step 8) ───────────────────────────

/// Urological cancers.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UrologicalCancers {
    /// Cancer type.
    pub cancer_type: String,
    /// Cancer stage.
    pub cancer_stage: String,
    /// Prior cancer treatment.
    pub prior_cancer_treatment: String,
    /// Surveillance status.
    pub surveillance_status: String,
    /// Unexplained weight loss.
    pub unexplained_weight_loss: String,
    /// Bone pain.
    pub bone_pain: String,
}

// ─── Sexual Function (Step 9) ──────────────────────────────

/// Sexual function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SexualFunction {
    /// Erectile dysfunction.
    pub erectile_dysfunction: String,
    /// Ed severity.
    pub ed_severity: Option<u8>,
    /// Ed duration months.
    pub ed_duration_months: String,
    /// Libido change.
    pub libido_change: String,
    /// Ejaculatory dysfunction.
    pub ejaculatory_dysfunction: String,
    /// Fertility concerns.
    pub fertility_concerns: String,
}

// ─── Clinical Review (Step 10) ─────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Comorbidities.
    pub comorbidities: String,
    /// Current medications.
    pub current_medications: String,
    /// Anticoagulant use.
    pub anticoagulant_use: String,
    /// Allergy history.
    pub allergy_history: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Urinary symptoms.
    pub urinary_symptoms: UrinarySymptoms,
    /// Lower urinary tract.
    pub lower_urinary_tract: LowerUrinaryTract,
    /// Renal function.
    pub renal_function: RenalFunction,
    /// Prostate assessment.
    pub prostate_assessment: ProstateAssessment,
    /// Bladder assessment.
    pub bladder_assessment: BladderAssessment,
    /// Stone disease.
    pub stone_disease: StoneDisease,
    /// Urological cancers.
    pub urological_cancers: UrologicalCancers,
    /// Sexual function.
    pub sexual_function: SexualFunction,
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
