//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Risk category.
pub type RiskCategory = String;

// Step 1: Patient Demographics
/// Patient demographics.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientDemographics {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,           // "male" | "female"
    /// NHS number.
    pub nhs_number: String,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// Ethnicity.
    pub ethnicity: String,
}

// Step 2: Diabetes History
/// Diabetes history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DiabetesHistory {
    /// Diabetes type.
    pub diabetes_type: String,         // "type1" | "type2" | "gestational" | "other"
    /// Age at diagnosis.
    pub age_at_diagnosis: Option<f64>,
    /// Diabetes duration years.
    pub diabetes_duration_years: Option<f64>,
    /// Hba1c value.
    pub hba1c_value: Option<f64>,      // mmol/mol
    /// Hba1c unit.
    pub hba1c_unit: String,            // "mmolMol" | "percent"
    /// Fasting glucose.
    pub fasting_glucose: Option<f64>,  // mmol/L
    /// Diabetes treatment.
    pub diabetes_treatment: String,    // "diet" | "oral" | "insulin" | "combined"
    /// Insulin duration years.
    pub insulin_duration_years: Option<f64>,
}

// Step 3: Cardiovascular History
/// Cardiovascular history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularHistory {
    /// Previous mi.
    pub previous_mi: String,            // "yes" | "no"
    /// Previous stroke.
    pub previous_stroke: String,        // "yes" | "no"
    /// Previous tia.
    pub previous_tia: String,           // "yes" | "no"
    /// Peripheral arterial disease.
    pub peripheral_arterial_disease: String, // "yes" | "no"
    /// Heart failure.
    pub heart_failure: String,          // "yes" | "no"
    /// Atrial fibrillation.
    pub atrial_fibrillation: String,    // "yes" | "no"
    /// Family cvd history.
    pub family_cvd_history: String,     // "yes" | "no"
    /// Family cvd details.
    pub family_cvd_details: String,
    /// Current chest pain.
    pub current_chest_pain: String,     // "yes" | "no"
    /// Current dyspnoea.
    pub current_dyspnoea: String,       // "yes" | "no"
}

// Step 4: Blood Pressure
/// Blood pressure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BloodPressure {
    /// Systolic BP.
    pub systolic_bp: Option<f64>,       // mmHg
    /// Diastolic BP.
    pub diastolic_bp: Option<f64>,      // mmHg
    /// On antihypertensive.
    pub on_antihypertensive: String,    // "yes" | "no"
    /// Number of BP medications.
    pub number_of_bp_medications: Option<f64>,
    /// BP at target.
    pub bp_at_target: String,           // "yes" | "no" | ""
    /// Home BP monitoring.
    pub home_bp_monitoring: String,     // "yes" | "no"
}

// Step 5: Lipid Profile
/// Lipid profile.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LipidProfile {
    /// Total cholesterol.
    pub total_cholesterol: Option<f64>,  // mmol/L
    /// Hdl cholesterol.
    pub hdl_cholesterol: Option<f64>,    // mmol/L
    /// Ldl cholesterol.
    pub ldl_cholesterol: Option<f64>,    // mmol/L
    /// Triglycerides.
    pub triglycerides: Option<f64>,      // mmol/L
    /// Non hdl cholesterol.
    pub non_hdl_cholesterol: Option<f64>, // mmol/L
    /// On statin.
    pub on_statin: String,               // "yes" | "no"
    /// Statin name.
    pub statin_name: String,
    /// On other lipid therapy.
    pub on_other_lipid_therapy: String,  // "yes" | "no"
}

// Step 6: Renal Function
/// Renal function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RenalFunction {
    /// Egfr.
    pub egfr: Option<f64>,               // mL/min/1.73m²
    /// Creatinine.
    pub creatinine: Option<f64>,         // µmol/L
    /// Urine acr.
    pub urine_acr: Option<f64>,          // mg/mmol
    /// Proteinuria.
    pub proteinuria: String,             // "none" | "microalbuminuria" | "macroalbuminuria"
    /// Ckd stage.
    pub ckd_stage: String,               // "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5" | ""
}

// Step 7: Lifestyle Factors
/// Lifestyle factors.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleFactors {
    /// Smoking status.
    pub smoking_status: String,          // "never" | "former" | "current"
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<f64>,
    /// Years since quit.
    pub years_since_quit: Option<f64>,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<f64>,
    /// Physical activity.
    pub physical_activity: String,       // "sedentary" | "lightlyActive" | "moderatelyActive" | "veryActive"
    /// Diet quality.
    pub diet_quality: String,            // "poor" | "fair" | "good" | "excellent"
    /// BMI.
    pub bmi: Option<f64>,
    /// Waist circumference cm.
    pub waist_circumference_cm: Option<f64>,
}

// Step 8: Current Medications
/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// Metformin.
    pub metformin: String,               // "yes" | "no"
    /// Sglt2 inhibitor.
    pub sglt2_inhibitor: String,         // "yes" | "no"
    /// Glp1 agonist.
    pub glp1_agonist: String,            // "yes" | "no"
    /// Sulfonylurea.
    pub sulfonylurea: String,            // "yes" | "no"
    /// Dpp4 inhibitor.
    pub dpp4_inhibitor: String,          // "yes" | "no"
    /// Insulin.
    pub insulin: String,                 // "yes" | "no"
    /// Ace inhibitor or arb.
    pub ace_inhibitor_or_arb: String,    // "yes" | "no"
    /// Antiplatelet.
    pub antiplatelet: String,            // "yes" | "no"
    /// Anticoagulant.
    pub anticoagulant: String,           // "yes" | "no"
    /// Other medications.
    pub other_medications: String,
}

// Step 9: Complications Screening
/// Complications screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ComplicationsScreening {
    /// Retinopathy status.
    pub retinopathy_status: String,      // "none" | "background" | "preProliferative" | "proliferative" | "maculopathy" | "notScreened"
    /// Last eye screening date.
    pub last_eye_screening_date: String,
    /// Neuropathy symptoms.
    pub neuropathy_symptoms: String,     // "yes" | "no"
    /// Monofilament test.
    pub monofilament_test: String,       // "normal" | "abnormal" | "notDone"
    /// Foot pulses.
    pub foot_pulses: String,             // "normal" | "absent" | "notChecked"
    /// Foot ulcer history.
    pub foot_ulcer_history: String,      // "yes" | "no"
    /// Ankle brachial index.
    pub ankle_brachial_index: Option<f64>,
    /// Erectile dysfunction.
    pub erectile_dysfunction: String,    // "yes" | "no" | "notApplicable"
}

// Step 10: Risk Assessment Summary
/// Risk assessment summary.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RiskAssessmentSummary {
    /// Risk region.
    pub risk_region: String,             // "low" | "moderate" | "high" | "veryHigh"
    /// Additional risk factors.
    pub additional_risk_factors: String, // free text
    /// Clinical notes.
    pub clinical_notes: String,
    /// Agreed treatment targets.
    pub agreed_treatment_targets: String,
    /// Follow up interval.
    pub follow_up_interval: String,      // "3months" | "6months" | "12months" | ""
}

// Complete assessment data
/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient demographics.
    pub patient_demographics: PatientDemographics,
    /// Diabetes history.
    pub diabetes_history: DiabetesHistory,
    /// Cardiovascular history.
    pub cardiovascular_history: CardiovascularHistory,
    /// Blood pressure.
    pub blood_pressure: BloodPressure,
    /// Lipid profile.
    pub lipid_profile: LipidProfile,
    /// Renal function.
    pub renal_function: RenalFunction,
    /// Lifestyle factors.
    pub lifestyle_factors: LifestyleFactors,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Complications screening.
    pub complications_screening: ComplicationsScreening,
    /// Risk assessment summary.
    pub risk_assessment_summary: RiskAssessmentSummary,
}

// Grading types
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
    pub risk_level: String,  // "high" | "medium" | "low"
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
    pub priority: String,    // "high" | "medium" | "low"
}

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Risk category.
    pub risk_category: RiskCategory,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
