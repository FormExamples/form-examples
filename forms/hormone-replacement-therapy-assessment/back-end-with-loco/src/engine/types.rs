//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Risk level.
pub type RiskLevel = String;

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
    /// Ethnicity.
    pub ethnicity: String,
    /// Referral date.
    pub referral_date: String,
    /// Referring clinician.
    pub referring_clinician: String,
    /// Reason for referral.
    pub reason_for_referral: String,
}

// ─── Menopausal Symptoms (Step 2) ───────────────────────────

/// Menopausal symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MenopausalSymptoms {
    /// Hot flushes severity.
    pub hot_flushes_severity: Option<u8>,
    /// Night sweats severity.
    pub night_sweats_severity: Option<u8>,
    /// Sleep disturbance severity.
    pub sleep_disturbance_severity: Option<u8>,
    /// Mood changes severity.
    pub mood_changes_severity: Option<u8>,
    /// Vaginal dryness severity.
    pub vaginal_dryness_severity: Option<u8>,
    /// Urinary symptoms severity.
    pub urinary_symptoms_severity: Option<u8>,
    /// Joint pain severity.
    pub joint_pain_severity: Option<u8>,
    /// Cognitive difficulty severity.
    pub cognitive_difficulty_severity: Option<u8>,
    /// Symptom duration months.
    pub symptom_duration_months: String,
    /// Symptom impact on daily life.
    pub symptom_impact_on_daily_life: Option<u8>,
}

// ─── Menstrual History (Step 3) ─────────────────────────────

/// Menstrual history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistory {
    /// Menopausal status.
    pub menopausal_status: String,
    /// Last menstrual period.
    pub last_menstrual_period: String,
    /// Age at menopause.
    pub age_at_menopause: String,
    /// Menopause type.
    pub menopause_type: String,
    /// Surgical menopause reason.
    pub surgical_menopause_reason: String,
    /// Previous hrt use.
    pub previous_hrt_use: String,
    /// Previous hrt details.
    pub previous_hrt_details: String,
    /// Contraception status.
    pub contraception_status: String,
}

// ─── Medical History (Step 4) ───────────────────────────────

/// Medical history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// History of vte.
    pub history_of_vte: String,
    /// History of stroke.
    pub history_of_stroke: String,
    /// History of mi.
    pub history_of_mi: String,
    /// Liver disease.
    pub liver_disease: String,
    /// Undiagnosed vaginal bleeding.
    pub undiagnosed_vaginal_bleeding: String,
    /// Endometriosis.
    pub endometriosis: String,
    /// Fibroids.
    pub fibroids: String,
    /// Migraine with aura.
    pub migraine_with_aura: String,
    /// Diabetes.
    pub diabetes: String,
    /// Hypertension.
    pub hypertension: String,
    /// Autoimmune conditions.
    pub autoimmune_conditions: String,
    /// Other conditions.
    pub other_conditions: String,
}

// ─── Cardiovascular Risk (Step 5) ───────────────────────────

/// Cardiovascular risk.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularRisk {
    /// Smoking status.
    pub smoking_status: String,
    /// BMI category.
    pub bmi_category: String,
    /// Blood pressure status.
    pub blood_pressure_status: String,
    /// Cholesterol status.
    pub cholesterol_status: String,
    /// Family history cvd.
    pub family_history_cvd: String,
    /// Physical activity level.
    pub physical_activity_level: String,
    /// Alcohol consumption.
    pub alcohol_consumption: String,
}

// ─── Breast Health (Step 6) ─────────────────────────────────

/// Breast health.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BreastHealth {
    /// Personal breast cancer history.
    pub personal_breast_cancer_history: String,
    /// Family breast cancer history.
    pub family_breast_cancer_history: String,
    /// Brca gene status.
    pub brca_gene_status: String,
    /// Last mammogram date.
    pub last_mammogram_date: String,
    /// Mammogram result.
    pub mammogram_result: String,
    /// Breast density.
    pub breast_density: String,
    /// Current breast symptoms.
    pub current_breast_symptoms: String,
}

// ─── Bone Health (Step 7) ───────────────────────────────────

/// Bone health.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BoneHealth {
    /// Dexa scan result.
    pub dexa_scan_result: String,
    /// Previous fractures.
    pub previous_fractures: String,
    /// Family history osteoporosis.
    pub family_history_osteoporosis: String,
    /// Calcium intake.
    pub calcium_intake: String,
    /// Vitamin d status.
    pub vitamin_d_status: String,
    /// Fall risk assessment.
    pub fall_risk_assessment: Option<u8>,
}

// ─── Current Medications (Step 8) ───────────────────────────

/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// Current medications list.
    pub current_medications_list: String,
    /// Herbal supplements.
    pub herbal_supplements: String,
    /// Previous hrt preparations.
    pub previous_hrt_preparations: String,
    /// Drug allergies.
    pub drug_allergies: String,
    /// Contraindicated medications.
    pub contraindicated_medications: String,
}

// ─── HRT Options & Counselling (Step 9) ─────────────────────

/// Hrt options counselling.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HrtOptionsCounselling {
    /// Preferred hrt route.
    pub preferred_hrt_route: String,
    /// Combined vs estrogen only.
    pub combined_vs_estrogen_only: String,
    /// Risks discussed.
    pub risks_discussed: String,
    /// Benefits discussed.
    pub benefits_discussed: String,
    /// Alternatives discussed.
    pub alternatives_discussed: String,
    /// Informed consent obtained.
    pub informed_consent_obtained: String,
    /// Patient preference noted.
    pub patient_preference_noted: String,
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
    /// Overall risk assessment.
    pub overall_risk_assessment: Option<u8>,
    /// Recommended action.
    pub recommended_action: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Additional investigations.
    pub additional_investigations: String,
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
    /// Menopausal symptoms.
    pub menopausal_symptoms: MenopausalSymptoms,
    /// Menstrual history.
    pub menstrual_history: MenstrualHistory,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Cardiovascular risk.
    pub cardiovascular_risk: CardiovascularRisk,
    /// Breast health.
    pub breast_health: BreastHealth,
    /// Bone health.
    pub bone_health: BoneHealth,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Hrt options counselling.
    pub hrt_options_counselling: HrtOptionsCounselling,
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
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Risk score.
    pub risk_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
