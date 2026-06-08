//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Control level.
pub type ControlLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

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

// ─── Diabetes History (Step 2) ──────────────────────────────

/// Diabetes history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DiabetesHistory {
    /// Diabetes type.
    pub diabetes_type: String,
    /// Age at diagnosis.
    pub age_at_diagnosis: Option<u8>,
    /// Years duration.
    pub years_duration: Option<u8>,
    /// Diagnosis method.
    pub diagnosis_method: String,
    /// Family history.
    pub family_history: String,
    /// Autoantibodies tested.
    pub autoantibodies_tested: String,
}

// ─── Glycaemic Control (Step 3) ─────────────────────────────

/// Glycaemic control.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlycaemicControl {
    /// Hba1c value.
    pub hba1c_value: Option<f64>,
    /// Hba1c unit.
    pub hba1c_unit: String,
    /// Hba1c target.
    pub hba1c_target: Option<f64>,
    /// Fasting glucose.
    pub fasting_glucose: Option<f64>,
    /// Postprandial glucose.
    pub postprandial_glucose: Option<f64>,
    /// Glucose monitoring type.
    pub glucose_monitoring_type: String,
    /// Hypoglycaemia frequency.
    pub hypoglycaemia_frequency: String,
    /// Severe hypoglycaemia.
    pub severe_hypoglycaemia: String,
    /// Time in range.
    pub time_in_range: Option<u8>,
}

// ─── Medications (Step 4) ───────────────────────────────────

/// Medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Medications {
    /// Metformin.
    pub metformin: String,
    /// Sulfonylurea.
    pub sulfonylurea: String,
    /// Sglt2 inhibitor.
    pub sglt2_inhibitor: String,
    /// Glp1 agonist.
    pub glp1_agonist: String,
    /// Dpp4 inhibitor.
    pub dpp4_inhibitor: String,
    /// Insulin.
    pub insulin: String,
    /// Insulin regimen.
    pub insulin_regimen: String,
    /// Insulin daily dose.
    pub insulin_daily_dose: Option<f64>,
    /// Medication adherence.
    pub medication_adherence: Option<u8>,
    /// Other medications.
    pub other_medications: String,
}

// ─── Complications Screening (Step 5) ───────────────────────

/// Complications screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ComplicationsScreening {
    /// Retinopathy status.
    pub retinopathy_status: String,
    /// Last eye screening.
    pub last_eye_screening: String,
    /// Nephropathy status.
    pub nephropathy_status: String,
    /// Egfr.
    pub egfr: Option<f64>,
    /// Urine acr.
    pub urine_acr: Option<f64>,
    /// Neuropathy symptoms.
    pub neuropathy_symptoms: String,
    /// Autonomic neuropathy.
    pub autonomic_neuropathy: String,
    /// Erectile dysfunction.
    pub erectile_dysfunction: String,
}

// ─── Cardiovascular Risk (Step 6) ───────────────────────────

/// Cardiovascular risk.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularRisk {
    /// Systolic BP.
    pub systolic_bp: Option<f64>,
    /// Diastolic BP.
    pub diastolic_bp: Option<f64>,
    /// On antihypertensive.
    pub on_antihypertensive: String,
    /// Total cholesterol.
    pub total_cholesterol: Option<f64>,
    /// Ldl cholesterol.
    pub ldl_cholesterol: Option<f64>,
    /// On statin.
    pub on_statin: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Previous cvd event.
    pub previous_cvd_event: String,
    /// Qrisk score.
    pub qrisk_score: Option<f64>,
}

// ─── Self-Care & Lifestyle (Step 7) ─────────────────────────

/// Self care lifestyle.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SelfCareLifestyle {
    /// Diet adherence.
    pub diet_adherence: Option<u8>,
    /// Carb counting.
    pub carb_counting: String,
    /// Physical activity.
    pub physical_activity: String,
    /// BMI.
    pub bmi: Option<f64>,
    /// Weight change.
    pub weight_change: String,
    /// Alcohol consumption.
    pub alcohol_consumption: String,
    /// Smoking cessation.
    pub smoking_cessation: String,
}

// ─── Psychological Wellbeing (Step 8) ───────────────────────

/// Psychological wellbeing.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PsychologicalWellbeing {
    /// Diabetes distress.
    pub diabetes_distress: Option<u8>,
    /// Depression screening.
    pub depression_screening: Option<u8>,
    /// Anxiety screening.
    pub anxiety_screening: Option<u8>,
    /// Eating disorder.
    pub eating_disorder: String,
    /// Fear of hypoglycaemia.
    pub fear_of_hypoglycaemia: Option<u8>,
    /// Coping ability.
    pub coping_ability: Option<u8>,
    /// Needs support.
    pub needs_support: String,
}

// ─── Foot Assessment (Step 9) ───────────────────────────────

/// Foot assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FootAssessment {
    /// Foot pulses.
    pub foot_pulses: String,
    /// Monofilament test.
    pub monofilament_test: String,
    /// Vibration sense.
    pub vibration_sense: String,
    /// Foot deformity.
    pub foot_deformity: String,
    /// Callus present.
    pub callus_present: String,
    /// Ulcer present.
    pub ulcer_present: String,
    /// Previous amputation.
    pub previous_amputation: String,
    /// Foot risk category.
    pub foot_risk_category: String,
}

// ─── Review & Care Plan (Step 10) ───────────────────────────

/// Review care plan.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReviewCarePlan {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Hba1c target agreed.
    pub hba1c_target_agreed: Option<f64>,
    /// Care plan updated.
    pub care_plan_updated: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Referrals.
    pub referrals: String,
    /// Next review date.
    pub next_review_date: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Diabetes history.
    pub diabetes_history: DiabetesHistory,
    /// Glycaemic control.
    pub glycaemic_control: GlycaemicControl,
    /// Medications.
    pub medications: Medications,
    /// Complications screening.
    pub complications_screening: ComplicationsScreening,
    /// Cardiovascular risk.
    pub cardiovascular_risk: CardiovascularRisk,
    /// Self care lifestyle.
    pub self_care_lifestyle: SelfCareLifestyle,
    /// Psychological wellbeing.
    pub psychological_wellbeing: PsychologicalWellbeing,
    /// Foot assessment.
    pub foot_assessment: FootAssessment,
    /// Review care plan.
    pub review_care_plan: ReviewCarePlan,
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
    /// Control level.
    pub control_level: ControlLevel,
    /// Control score.
    pub control_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
