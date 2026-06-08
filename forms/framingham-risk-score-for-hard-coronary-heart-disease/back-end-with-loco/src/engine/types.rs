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
    pub sex: String, // "male" | "female"
    /// Ethnicity.
    pub ethnicity: String,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Weight kg.
    pub weight_kg: Option<f64>,
}

/// Smoking history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SmokingHistory {
    /// Smoking status.
    pub smoking_status: String, // "current" | "former" | "never"
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<u8>,
    /// Years smoked.
    pub years_smoked: Option<u8>,
    /// Years since quit.
    pub years_since_quit: Option<u8>,
}

/// Blood pressure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BloodPressure {
    /// Systolic BP.
    pub systolic_bp: Option<f64>,
    /// Diastolic BP.
    pub diastolic_bp: Option<f64>,
    /// On BP treatment.
    pub on_bp_treatment: String, // "yes" | "no"
    /// BP medication name.
    pub bp_medication_name: String,
    /// BP measurement method.
    pub bp_measurement_method: String,
}

/// Cholesterol.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Cholesterol {
    /// Total cholesterol.
    pub total_cholesterol: Option<f64>, // mg/dL
    /// Hdl cholesterol.
    pub hdl_cholesterol: Option<f64>,   // mg/dL
    /// Ldl cholesterol.
    pub ldl_cholesterol: Option<f64>,   // mg/dL
    /// Triglycerides.
    pub triglycerides: Option<f64>,
    /// Cholesterol unit.
    pub cholesterol_unit: String, // "mgDl" | "mmolL"
    /// Fasting sample.
    pub fasting_sample: String,   // "yes" | "no"
}

/// Medical history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Has diabetes.
    pub has_diabetes: String, // "yes" | "no"
    /// Has prior chd.
    pub has_prior_chd: String, // "yes" | "no"
    /// Has peripheral vascular disease.
    pub has_peripheral_vascular_disease: String,
    /// Has cerebrovascular disease.
    pub has_cerebrovascular_disease: String,
    /// Has heart failure.
    pub has_heart_failure: String,
    /// Has atrial fibrillation.
    pub has_atrial_fibrillation: String,
    /// Other conditions.
    pub other_conditions: String,
}

/// Family history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FamilyHistory {
    /// Family chd history.
    pub family_chd_history: String, // "yes" | "no"
    /// Family chd age onset.
    pub family_chd_age_onset: String, // "under55" | "55to65" | "over65" | ""
    /// Family chd relationship.
    pub family_chd_relationship: String,
    /// Family stroke history.
    pub family_stroke_history: String,
    /// Family diabetes history.
    pub family_diabetes_history: String,
}

/// Lifestyle factors.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleFactors {
    /// Physical activity.
    pub physical_activity: String, // "sedentary" | "light" | "moderate" | "vigorous"
    /// Alcohol consumption.
    pub alcohol_consumption: String, // "none" | "moderate" | "heavy"
    /// Diet quality.
    pub diet_quality: String, // "poor" | "average" | "good" | "excellent"
    /// BMI.
    pub bmi: Option<f64>,
    /// Waist circumference cm.
    pub waist_circumference_cm: Option<f64>,
    /// Stress level.
    pub stress_level: String, // "low" | "moderate" | "high"
}

/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// On statin.
    pub on_statin: String,
    /// Statin name.
    pub statin_name: String,
    /// On aspirin.
    pub on_aspirin: String,
    /// On antihypertensive.
    pub on_antihypertensive: String,
    /// Antihypertensive name.
    pub antihypertensive_name: String,
    /// Other medications.
    pub other_medications: String,
}

/// Review calculate.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReviewCalculate {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Patient consent.
    pub patient_consent: String, // "yes" | "no"
}

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Demographics.
    pub demographics: Demographics,
    /// Smoking history.
    pub smoking_history: SmokingHistory,
    /// Blood pressure.
    pub blood_pressure: BloodPressure,
    /// Cholesterol.
    pub cholesterol: Cholesterol,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Family history.
    pub family_history: FamilyHistory,
    /// Lifestyle factors.
    pub lifestyle_factors: LifestyleFactors,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Review calculate.
    pub review_calculate: ReviewCalculate,
}

/// Risk level.
pub type RiskLevel = String; // "draft" | "low" | "intermediate" | "high"

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
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
