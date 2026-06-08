//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend JS engine.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Axis status.
pub type AxisStatus = String;

/// Demographics section (Step 1).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Ethnicity.
    pub ethnicity: String,
}

/// Presenting symptoms (Step 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSymptoms {
    /// Fatigue.
    pub fatigue: YesNo,
    /// Weight change.
    pub weight_change: YesNo,
    /// Weight change direction.
    pub weight_change_direction: String,
    /// Heat intolerance.
    pub heat_intolerance: YesNo,
    /// Cold intolerance.
    pub cold_intolerance: YesNo,
    /// Palpitations.
    pub palpitations: YesNo,
    /// Tremor.
    pub tremor: YesNo,
    /// Sweating.
    pub sweating: YesNo,
    /// Polyuria.
    pub polyuria: YesNo,
    /// Polydipsia.
    pub polydipsia: YesNo,
    /// Mood.
    pub mood: YesNo,
    /// Skin changes.
    pub skin_changes: YesNo,
    /// Hair changes.
    pub hair_changes: YesNo,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Other symptoms.
    pub other_symptoms: String,
}

/// Thyroid axis review (Step 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThyroidAxis {
    /// Tsh.
    pub tsh: Option<f64>,
    /// Ft4.
    pub ft4: Option<f64>,
    /// Ft3.
    pub ft3: Option<f64>,
    /// Antibodies positive.
    pub antibodies_positive: YesNo,
    /// Goitre.
    pub goitre: YesNo,
    /// Family history thyroid.
    pub family_history_thyroid: YesNo,
    /// Thyroid notes.
    pub thyroid_notes: String,
}

/// Adrenal axis review (Step 4).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdrenalAxis {
    /// Morning cortisol.
    pub morning_cortisol: Option<f64>,
    /// Acth.
    pub acth: Option<f64>,
    /// Aldosterone.
    pub aldosterone: Option<f64>,
    /// Renin.
    pub renin: Option<f64>,
    /// Hyperpigmentation.
    pub hyperpigmentation: YesNo,
    /// Cushingoid features.
    pub cushingoid_features: YesNo,
    /// Postural hypotension.
    pub postural_hypotension: YesNo,
    /// Adrenal notes.
    pub adrenal_notes: String,
}

/// Glucose metabolism (Step 5).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlucoseMetabolism {
    /// Hba1c.
    pub hba1c: Option<f64>,
    /// Fasting glucose.
    pub fasting_glucose: Option<f64>,
    /// Random glucose.
    pub random_glucose: Option<f64>,
    /// Known diabetes.
    pub known_diabetes: YesNo,
    /// Diabetes type.
    pub diabetes_type: String,
    /// Hypoglycaemia episodes.
    pub hypoglycaemia_episodes: YesNo,
    /// Glucose notes.
    pub glucose_notes: String,
}

/// Reproductive axis (Step 6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReproductiveAxis {
    /// Fsh.
    pub fsh: Option<f64>,
    /// Lh.
    pub lh: Option<f64>,
    /// Testosterone.
    pub testosterone: Option<f64>,
    /// Oestradiol.
    pub oestradiol: Option<f64>,
    /// Menstrual irregularity.
    pub menstrual_irregularity: YesNo,
    /// Infertility.
    pub infertility: YesNo,
    /// Libido change.
    pub libido_change: YesNo,
    /// Galactorrhoea.
    pub galactorrhoea: YesNo,
    /// Reproductive notes.
    pub reproductive_notes: String,
}

/// Pituitary function (Step 7).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PituitaryFunction {
    /// Prolactin.
    pub prolactin: Option<f64>,
    /// Igf1.
    pub igf1: Option<f64>,
    /// Growth hormone.
    pub growth_hormone: Option<f64>,
    /// Headaches.
    pub headaches: YesNo,
    /// Visual disturbance.
    pub visual_disturbance: YesNo,
    /// Acromegalic features.
    pub acromegalic_features: YesNo,
    /// Pituitary imaging done.
    pub pituitary_imaging_done: YesNo,
    /// Pituitary imaging findings.
    pub pituitary_imaging_findings: String,
    /// Pituitary notes.
    pub pituitary_notes: String,
}

/// Bone & calcium (Step 8).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoneCalcium {
    /// Pth.
    pub pth: Option<f64>,
    /// Vitamin d.
    pub vitamin_d: Option<f64>,
    /// Calcium corrected.
    pub calcium_corrected: Option<f64>,
    /// Phosphate.
    pub phosphate: Option<f64>,
    /// Fragility fracture.
    pub fragility_fracture: YesNo,
    /// Bone pain.
    pub bone_pain: YesNo,
    /// Dexa scan done.
    pub dexa_scan_done: YesNo,
    /// Dexa result.
    pub dexa_result: String,
    /// Bone notes.
    pub bone_notes: String,
}

/// A free-text medication entry on the medications list (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationItem {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
}

/// Medications & lifestyle review (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsLifestyle {
    /// Current medications.
    pub current_medications: Vec<MedicationItem>,
    /// Steroid use.
    pub steroid_use: YesNo,
    /// Steroid details.
    pub steroid_details: String,
    /// Hormone therapy.
    pub hormone_therapy: YesNo,
    /// Hormone therapy details.
    pub hormone_therapy_details: String,
    /// Smoking.
    pub smoking: String,
    /// Alcohol units.
    pub alcohol_units: String,
    /// Exercise level.
    pub exercise_level: String,
    /// Diet pattern.
    pub diet_pattern: String,
    /// Family history endocrine.
    pub family_history_endocrine: String,
}

/// Clinical impression & management plan (Step 10).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpression {
    /// Working diagnosis.
    pub working_diagnosis: String,
    /// Differential diagnoses.
    pub differential_diagnoses: String,
    /// Investigations requested.
    pub investigations_requested: String,
    /// Management plan.
    pub management_plan: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Referral required.
    pub referral_required: YesNo,
    /// Referral specialty.
    pub referral_specialty: String,
    /// Clinician notes.
    pub clinician_notes: String,
}

/// Full endocrinology assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Presenting symptoms.
    pub presenting_symptoms: PresentingSymptoms,
    /// Thyroid axis.
    pub thyroid_axis: ThyroidAxis,
    /// Adrenal axis.
    pub adrenal_axis: AdrenalAxis,
    /// Glucose metabolism.
    pub glucose_metabolism: GlucoseMetabolism,
    /// Reproductive axis.
    pub reproductive_axis: ReproductiveAxis,
    /// Pituitary function.
    pub pituitary_function: PituitaryFunction,
    /// Bone calcium.
    pub bone_calcium: BoneCalcium,
    /// Medications lifestyle.
    pub medications_lifestyle: MedicationsLifestyle,
    /// Clinical impression.
    pub clinical_impression: ClinicalImpression,
}

/// Per-axis grading outcome.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AxisGrade {
    /// Axis.
    pub axis: String,
    /// Status.
    pub status: AxisStatus,
    /// Rationale.
    pub rationale: String,
    /// Contributing findings.
    pub contributing_findings: Vec<String>,
}

/// A rule that fired during grading (an axis produced a non-empty status).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Status.
    pub status: AxisStatus,
}

/// A clinician-facing alert flag computed independently of axis grading.
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

/// Grading output for an endocrinology assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Axis grades.
    pub axis_grades: Vec<AxisGrade>,
    /// Overall status.
    pub overall_status: AxisStatus,
    /// Answered count.
    pub answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
