use serde::{Deserialize, Serialize};

// Type aliases matching the frontend JS engine.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type AxisStatus = String;

/// Demographics section (Step 1).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub ethnicity: String,
}

/// Presenting symptoms (Step 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSymptoms {
    pub fatigue: YesNo,
    pub weight_change: YesNo,
    pub weight_change_direction: String,
    pub heat_intolerance: YesNo,
    pub cold_intolerance: YesNo,
    pub palpitations: YesNo,
    pub tremor: YesNo,
    pub sweating: YesNo,
    pub polyuria: YesNo,
    pub polydipsia: YesNo,
    pub mood: YesNo,
    pub skin_changes: YesNo,
    pub hair_changes: YesNo,
    pub symptom_duration: String,
    pub other_symptoms: String,
}

/// Thyroid axis review (Step 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThyroidAxis {
    pub tsh: Option<f64>,
    pub ft4: Option<f64>,
    pub ft3: Option<f64>,
    pub antibodies_positive: YesNo,
    pub goitre: YesNo,
    pub family_history_thyroid: YesNo,
    pub thyroid_notes: String,
}

/// Adrenal axis review (Step 4).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdrenalAxis {
    pub morning_cortisol: Option<f64>,
    pub acth: Option<f64>,
    pub aldosterone: Option<f64>,
    pub renin: Option<f64>,
    pub hyperpigmentation: YesNo,
    pub cushingoid_features: YesNo,
    pub postural_hypotension: YesNo,
    pub adrenal_notes: String,
}

/// Glucose metabolism (Step 5).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlucoseMetabolism {
    pub hba1c: Option<f64>,
    pub fasting_glucose: Option<f64>,
    pub random_glucose: Option<f64>,
    pub known_diabetes: YesNo,
    pub diabetes_type: String,
    pub hypoglycaemia_episodes: YesNo,
    pub glucose_notes: String,
}

/// Reproductive axis (Step 6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReproductiveAxis {
    pub fsh: Option<f64>,
    pub lh: Option<f64>,
    pub testosterone: Option<f64>,
    pub oestradiol: Option<f64>,
    pub menstrual_irregularity: YesNo,
    pub infertility: YesNo,
    pub libido_change: YesNo,
    pub galactorrhoea: YesNo,
    pub reproductive_notes: String,
}

/// Pituitary function (Step 7).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PituitaryFunction {
    pub prolactin: Option<f64>,
    pub igf1: Option<f64>,
    pub growth_hormone: Option<f64>,
    pub headaches: YesNo,
    pub visual_disturbance: YesNo,
    pub acromegalic_features: YesNo,
    pub pituitary_imaging_done: YesNo,
    pub pituitary_imaging_findings: String,
    pub pituitary_notes: String,
}

/// Bone & calcium (Step 8).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoneCalcium {
    pub pth: Option<f64>,
    pub vitamin_d: Option<f64>,
    pub calcium_corrected: Option<f64>,
    pub phosphate: Option<f64>,
    pub fragility_fracture: YesNo,
    pub bone_pain: YesNo,
    pub dexa_scan_done: YesNo,
    pub dexa_result: String,
    pub bone_notes: String,
}

/// A free-text medication entry on the medications list (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationItem {
    pub name: String,
    pub dose: String,
    pub frequency: String,
}

/// Medications & lifestyle review (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsLifestyle {
    pub current_medications: Vec<MedicationItem>,
    pub steroid_use: YesNo,
    pub steroid_details: String,
    pub hormone_therapy: YesNo,
    pub hormone_therapy_details: String,
    pub smoking: String,
    pub alcohol_units: String,
    pub exercise_level: String,
    pub diet_pattern: String,
    pub family_history_endocrine: String,
}

/// Clinical impression & management plan (Step 10).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpression {
    pub working_diagnosis: String,
    pub differential_diagnoses: String,
    pub investigations_requested: String,
    pub management_plan: String,
    pub follow_up_plan: String,
    pub referral_required: YesNo,
    pub referral_specialty: String,
    pub clinician_notes: String,
}

/// Full endocrinology assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub presenting_symptoms: PresentingSymptoms,
    pub thyroid_axis: ThyroidAxis,
    pub adrenal_axis: AdrenalAxis,
    pub glucose_metabolism: GlucoseMetabolism,
    pub reproductive_axis: ReproductiveAxis,
    pub pituitary_function: PituitaryFunction,
    pub bone_calcium: BoneCalcium,
    pub medications_lifestyle: MedicationsLifestyle,
    pub clinical_impression: ClinicalImpression,
}

/// Per-axis grading outcome.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AxisGrade {
    pub axis: String,
    pub status: AxisStatus,
    pub rationale: String,
    pub contributing_findings: Vec<String>,
}

/// A rule that fired during grading (an axis produced a non-empty status).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub status: AxisStatus,
}

/// A clinician-facing alert flag computed independently of axis grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an endocrinology assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub axis_grades: Vec<AxisGrade>,
    pub overall_status: AxisStatus,
    pub answered_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
