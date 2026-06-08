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
    /// Postcode.
    pub postcode: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
}

/// Demographics ethnicity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DemographicsEthnicity {
    /// Age.
    pub age: Option<u8>,
    /// Sex.
    pub sex: String,
    /// Ethnicity.
    pub ethnicity: String,
    /// Townsend deprivation.
    pub townsend_deprivation: Option<f64>,
}

/// Blood pressure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BloodPressure {
    /// Systolic BP.
    pub systolic_bp: Option<f64>,
    /// Systolic BP sd.
    pub systolic_bp_sd: Option<f64>,
    /// Diastolic BP.
    pub diastolic_bp: Option<f64>,
    /// On BP treatment.
    pub on_bp_treatment: String,
    /// Number of BP medications.
    pub number_of_bp_medications: Option<u8>,
}

/// Cholesterol.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Cholesterol {
    /// Total cholesterol.
    pub total_cholesterol: Option<f64>,
    /// Hdl cholesterol.
    pub hdl_cholesterol: Option<f64>,
    /// Total hdl ratio.
    pub total_hdl_ratio: Option<f64>,
    /// On statin.
    pub on_statin: String,
}

/// Medical conditions.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalConditions {
    /// Has diabetes.
    pub has_diabetes: String,
    /// Has atrial fibrillation.
    pub has_atrial_fibrillation: String,
    /// Has rheumatoid arthritis.
    pub has_rheumatoid_arthritis: String,
    /// Has chronic kidney disease.
    pub has_chronic_kidney_disease: String,
    /// Has migraine.
    pub has_migraine: String,
    /// Has severe mental illness.
    pub has_severe_mental_illness: String,
    /// Has erectile dysfunction.
    pub has_erectile_dysfunction: String,
    /// On atypical antipsychotic.
    pub on_atypical_antipsychotic: String,
    /// On corticosteroids.
    pub on_corticosteroids: String,
}

/// Family history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FamilyHistory {
    /// Family cvd under 60.
    pub family_cvd_under_60: String,
    /// Family cvd relationship.
    pub family_cvd_relationship: String,
    /// Family diabetes history.
    pub family_diabetes_history: String,
}

/// Smoking alcohol.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SmokingAlcohol {
    /// Smoking status.
    pub smoking_status: String,
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<u8>,
    /// Years since quit.
    pub years_since_quit: Option<u8>,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<f64>,
    /// Alcohol frequency.
    pub alcohol_frequency: String,
}

/// Physical activity diet.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalActivityDiet {
    /// Physical activity minutes per week.
    pub physical_activity_minutes_per_week: Option<u16>,
    /// Activity intensity.
    pub activity_intensity: String,
    /// Fruit veg portions per day.
    pub fruit_veg_portions_per_day: Option<u8>,
    /// Diet quality.
    pub diet_quality: String,
    /// Salt intake.
    pub salt_intake: String,
}

/// Body measurements.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BodyMeasurements {
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Waist circumference cm.
    pub waist_circumference_cm: Option<f64>,
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
    /// Audit score.
    pub audit_score: Option<u8>,
}

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Demographics ethnicity.
    pub demographics_ethnicity: DemographicsEthnicity,
    /// Blood pressure.
    pub blood_pressure: BloodPressure,
    /// Cholesterol.
    pub cholesterol: Cholesterol,
    /// Medical conditions.
    pub medical_conditions: MedicalConditions,
    /// Family history.
    pub family_history: FamilyHistory,
    /// Smoking alcohol.
    pub smoking_alcohol: SmokingAlcohol,
    /// Physical activity diet.
    pub physical_activity_diet: PhysicalActivityDiet,
    /// Body measurements.
    pub body_measurements: BodyMeasurements,
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
    /// Heart age.
    pub heart_age: Option<u8>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
