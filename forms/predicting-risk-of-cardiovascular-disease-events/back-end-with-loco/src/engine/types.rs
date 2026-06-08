//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

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

/// Demographics.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// Age.
    pub age: Option<u8>,
    /// Sex.
    pub sex: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// Zip code.
    pub zip_code: String,
}

/// Blood pressure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BloodPressure {
    /// Systolic BP.
    pub systolic_bp: Option<f64>,
    /// Diastolic BP.
    pub diastolic_bp: Option<f64>,
    /// On antihypertensive.
    pub on_antihypertensive: String,
    /// Number of BP medications.
    pub number_of_bp_medications: Option<u8>,
    /// BP at target.
    pub bp_at_target: String,
}

/// Cholesterol lipids.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CholesterolLipids {
    /// Total cholesterol.
    pub total_cholesterol: Option<f64>,
    /// Hdl cholesterol.
    pub hdl_cholesterol: Option<f64>,
    /// Ldl cholesterol.
    pub ldl_cholesterol: Option<f64>,
    /// Triglycerides.
    pub triglycerides: Option<f64>,
    /// Non hdl cholesterol.
    pub non_hdl_cholesterol: Option<f64>,
    /// On statin.
    pub on_statin: String,
    /// Statin name.
    pub statin_name: String,
}

/// Metabolic health.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MetabolicHealth {
    /// Has diabetes.
    pub has_diabetes: String,
    /// Diabetes type.
    pub diabetes_type: String,
    /// Hba1c value.
    pub hba1c_value: Option<f64>,
    /// Hba1c unit.
    pub hba1c_unit: String,
    /// Fasting glucose.
    pub fasting_glucose: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Waist circumference cm.
    pub waist_circumference_cm: Option<f64>,
}

/// Renal function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RenalFunction {
    /// Egfr.
    pub egfr: Option<f64>,
    /// Creatinine.
    pub creatinine: Option<f64>,
    /// Urine acr.
    pub urine_acr: Option<f64>,
    /// Ckd stage.
    pub ckd_stage: String,
}

/// Smoking history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SmokingHistory {
    /// Smoking status.
    pub smoking_status: String,
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<u8>,
    /// Years smoked.
    pub years_smoked: Option<u8>,
    /// Years since quit.
    pub years_since_quit: Option<u8>,
}

/// Medical history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Has known cvd.
    pub has_known_cvd: String,
    /// Previous mi.
    pub previous_mi: String,
    /// Previous stroke.
    pub previous_stroke: String,
    /// Heart failure.
    pub heart_failure: String,
    /// Atrial fibrillation.
    pub atrial_fibrillation: String,
    /// Peripheral arterial disease.
    pub peripheral_arterial_disease: String,
    /// Family cvd history.
    pub family_cvd_history: String,
    /// Family cvd details.
    pub family_cvd_details: String,
}

/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// On antihypertensive detail.
    pub on_antihypertensive_detail: String,
    /// On statin detail.
    pub on_statin_detail: String,
    /// On aspirin.
    pub on_aspirin: String,
    /// On anticoagulant.
    pub on_anticoagulant: String,
    /// On diabetes medication.
    pub on_diabetes_medication: String,
    /// Other medications.
    pub other_medications: String,
}

/// Review calculate.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReviewCalculate {
    /// Model type.
    pub model_type: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Clinical notes.
    pub clinical_notes: String,
}

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Demographics.
    pub demographics: Demographics,
    /// Blood pressure.
    pub blood_pressure: BloodPressure,
    /// Cholesterol lipids.
    pub cholesterol_lipids: CholesterolLipids,
    /// Metabolic health.
    pub metabolic_health: MetabolicHealth,
    /// Renal function.
    pub renal_function: RenalFunction,
    /// Smoking history.
    pub smoking_history: SmokingHistory,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Review calculate.
    pub review_calculate: ReviewCalculate,
}

/// Risk level.
pub type RiskLevel = String;

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
    /// Risk level.
    pub risk_level: String,
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
    /// Risk category.
    pub risk_category: String,
    /// Ten year risk percent.
    pub ten_year_risk_percent: f64,
    /// Thirty year risk percent.
    pub thirty_year_risk_percent: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
