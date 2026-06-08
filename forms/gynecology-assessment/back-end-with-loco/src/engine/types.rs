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
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
}

// ─── Menstrual History (Step 2) ─────────────────────────────

/// Menstrual history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistory {
    /// Menarche age.
    pub menarche_age: Option<u8>,
    /// Cycle length.
    pub cycle_length: String,
    /// Duration.
    pub duration: String,
    /// Regularity.
    pub regularity: String,
    /// Last period.
    pub last_period: String,
    /// Flow amount.
    pub flow_amount: String,
    /// Intermenstrual bleeding.
    pub intermenstrual_bleeding: String,
}

// ─── Gynecological Symptoms (Step 3) ────────────────────────

/// Gynecological symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GynecologicalSymptoms {
    /// Pelvic pain severity.
    pub pelvic_pain_severity: Option<u8>,
    /// Dysmenorrhoea.
    pub dysmenorrhoea: Option<u8>,
    /// Dyspareunia.
    pub dyspareunia: String,
    /// Abnormal discharge.
    pub abnormal_discharge: String,
    /// Urinary symptoms.
    pub urinary_symptoms: String,
    /// Prolapse symptoms.
    pub prolapse_symptoms: String,
}

// ─── Obstetric History (Step 4) ─────────────────────────────

/// Obstetric history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ObstetricHistory {
    /// Gravida.
    pub gravida: Option<u8>,
    /// Para.
    pub para: Option<u8>,
    /// Miscarriages.
    pub miscarriages: Option<u8>,
    /// Terminations.
    pub terminations: Option<u8>,
    /// Ectopic.
    pub ectopic: Option<u8>,
    /// Delivery modes.
    pub delivery_modes: String,
    /// Complications.
    pub complications: String,
}

// ─── Cervical Screening (Step 5) ────────────────────────────

/// Cervical screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CervicalScreening {
    /// Last smear date.
    pub last_smear_date: String,
    /// Smear result.
    pub smear_result: String,
    /// Hpv status.
    pub hpv_status: String,
    /// Colposcopy history.
    pub colposcopy_history: String,
    /// Treatment history.
    pub treatment_history: String,
}

// ─── Contraception & Fertility (Step 6) ─────────────────────

/// Contraception fertility.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ContraceptionFertility {
    /// Current method.
    pub current_method: String,
    /// Satisfaction.
    pub satisfaction: String,
    /// Future fertility wishes.
    pub future_fertility_wishes: String,
    /// Fertility concerns.
    pub fertility_concerns: String,
    /// Ivf history.
    pub ivf_history: String,
}

// ─── Menopause Assessment (Step 7) ──────────────────────────

/// Menopause assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MenopauseAssessment {
    /// Menopausal status.
    pub menopausal_status: String,
    /// Vasomotor symptoms.
    pub vasomotor_symptoms: Option<u8>,
    /// Urogenital symptoms.
    pub urogenital_symptoms: Option<u8>,
    /// Mood changes.
    pub mood_changes: Option<u8>,
    /// Hrt use.
    pub hrt_use: String,
    /// Bone health.
    pub bone_health: String,
}

// ─── Breast Health (Step 8) ─────────────────────────────────

/// Breast health.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BreastHealth {
    /// Last mammogram.
    pub last_mammogram: String,
    /// Breast symptoms.
    pub breast_symptoms: String,
    /// Family breast cancer.
    pub family_breast_cancer: String,
    /// Brca status.
    pub brca_status: String,
}

// ─── Sexual Health (Step 9) ─────────────────────────────────

/// Sexual health.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SexualHealth {
    /// Sti screening.
    pub sti_screening: String,
    /// Current concerns.
    pub current_concerns: String,
    /// Domestic violence screening.
    pub domestic_violence_screening: String,
    /// Fgm assessment.
    pub fgm_assessment: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

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
    /// Management plan.
    pub management_plan: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Follow up.
    pub follow_up: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Menstrual history.
    pub menstrual_history: MenstrualHistory,
    /// Gynecological symptoms.
    pub gynecological_symptoms: GynecologicalSymptoms,
    /// Obstetric history.
    pub obstetric_history: ObstetricHistory,
    /// Cervical screening.
    pub cervical_screening: CervicalScreening,
    /// Contraception fertility.
    pub contraception_fertility: ContraceptionFertility,
    /// Menopause assessment.
    pub menopause_assessment: MenopauseAssessment,
    /// Breast health.
    pub breast_health: BreastHealth,
    /// Sexual health.
    pub sexual_health: SexualHealth,
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
