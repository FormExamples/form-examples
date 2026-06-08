//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ─────────────────────────────

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

// ─── Event Details (Step 2) ───────────────────────────────────

/// Event details.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EventDetails {
    /// Symptom onset date.
    pub symptom_onset_date: String,
    /// Symptom onset time.
    pub symptom_onset_time: String,
    /// Last known well.
    pub last_known_well: String,
    /// Arrival time.
    pub arrival_time: String,
    /// Stroke code.
    pub stroke_code: String,
    /// Facial droop.
    pub facial_droop: String,
    /// Arm weakness.
    pub arm_weakness: String,
    /// Speech difficulty.
    pub speech_difficulty: String,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Tia or stroke.
    pub tia_or_stroke: String,
}

// ─── NIHSS Assessment (Step 3) ────────────────────────────────

/// Nihss assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct NihssAssessment {
    /// Consciousness.
    pub consciousness: Option<u8>,
    /// Orientation questions.
    pub orientation_questions: Option<u8>,
    /// Response to commands.
    pub response_to_commands: Option<u8>,
    /// Best gaze.
    pub best_gaze: Option<u8>,
    /// Visual fields.
    pub visual_fields: Option<u8>,
    /// Facial palsy.
    pub facial_palsy: Option<u8>,
    /// Motor left arm.
    pub motor_left_arm: Option<u8>,
    /// Motor right arm.
    pub motor_right_arm: Option<u8>,
    /// Motor left leg.
    pub motor_left_leg: Option<u8>,
    /// Motor right leg.
    pub motor_right_leg: Option<u8>,
    /// Limb ataxia.
    pub limb_ataxia: Option<u8>,
    /// Sensory.
    pub sensory: Option<u8>,
    /// Language.
    pub language: Option<u8>,
    /// Dysarthria.
    pub dysarthria: Option<u8>,
    /// Neglect.
    pub neglect: Option<u8>,
}

// ─── Stroke Classification (Step 4) ──────────────────────────

/// Stroke classification.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StrokeClassification {
    /// Stroke type.
    pub stroke_type: String,
    /// Bamford classification.
    pub bamford_classification: String,
    /// Toast classification.
    pub toast_classification: String,
    /// Territory.
    pub territory: String,
    /// Side affected.
    pub side_affected: String,
}

// ─── Risk Factors (Step 5) ────────────────────────────────────

/// Risk factors.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RiskFactors {
    /// Hypertension.
    pub hypertension: String,
    /// Atrial fibrillation.
    pub atrial_fibrillation: String,
    /// Diabetes.
    pub diabetes: String,
    /// Dyslipidaemia.
    pub dyslipidaemia: String,
    /// Previous stroke.
    pub previous_stroke: String,
    /// Previous tia.
    pub previous_tia: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Alcohol excess.
    pub alcohol_excess: String,
    /// Carotid stenosis.
    pub carotid_stenosis: String,
    /// Pfo.
    pub pfo: String,
}

// ─── Investigations (Step 6) ─────────────────────────────────

/// Investigations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// CT brain.
    pub ct_brain: String,
    /// CT angiography.
    pub ct_angiography: String,
    /// MRI.
    pub mri: String,
    /// Carotid doppler.
    pub carotid_doppler: String,
    /// Echocardiogram.
    pub echocardiogram: String,
    /// Holter monitor.
    pub holter_monitor: String,
    /// Blood glucose.
    pub blood_glucose: Option<f64>,
    /// Inr.
    pub inr: Option<f64>,
    /// Lipid profile.
    pub lipid_profile: String,
}

// ─── Acute Treatment (Step 7) ─────────────────────────────────

/// Acute treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AcuteTreatment {
    /// Thrombolysis.
    pub thrombolysis: String,
    /// Thrombolysis time.
    pub thrombolysis_time: String,
    /// Thrombectomy.
    pub thrombectomy: String,
    /// Antiplatelet.
    pub antiplatelet: String,
    /// Anticoagulant.
    pub anticoagulant: String,
    /// BP management.
    pub bp_management: String,
    /// Nil by mouth.
    pub nil_by_mouth: String,
    /// Swallow assessment.
    pub swallow_assessment: String,
}

// ─── Functional Assessment (Step 8) ──────────────────────────

/// Functional assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalAssessment {
    /// Modified rankin score.
    pub modified_rankin_score: Option<u8>,
    /// Barthel index.
    pub barthel_index: Option<u8>,
    /// Mobility status.
    pub mobility_status: String,
    /// Speech assessment.
    pub speech_assessment: String,
    /// Swallowing status.
    pub swallowing_status: String,
    /// Cognition.
    pub cognition: String,
    /// Mood screening.
    pub mood_screening: String,
    /// Continence.
    pub continence: String,
}

// ─── Secondary Prevention (Step 9) ───────────────────────────

/// Secondary prevention.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SecondaryPrevention {
    /// Antiplatelet therapy.
    pub antiplatelet_therapy: String,
    /// Anticoagulation indicated.
    pub anticoagulation_indicated: String,
    /// Statin therapy.
    pub statin_therapy: String,
    /// Antihypertensive.
    pub antihypertensive: String,
    /// Target BP.
    pub target_bp: String,
    /// Carotid endarterectomy.
    pub carotid_endarterectomy: String,
    /// Lifestyle advice.
    pub lifestyle_advice: String,
    /// Driving advice.
    pub driving_advice: String,
}

// ─── Clinical Review (Step 10) ───────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Nihss total.
    pub nihss_total: Option<u8>,
    /// Severity level.
    pub severity_level: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Discharge destination.
    pub discharge_destination: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Referrals.
    pub referrals: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Event details.
    pub event_details: EventDetails,
    /// Nihss assessment.
    pub nihss_assessment: NihssAssessment,
    /// Stroke classification.
    pub stroke_classification: StrokeClassification,
    /// Risk factors.
    pub risk_factors: RiskFactors,
    /// Investigations.
    pub investigations: Investigations,
    /// Acute treatment.
    pub acute_treatment: AcuteTreatment,
    /// Functional assessment.
    pub functional_assessment: FunctionalAssessment,
    /// Secondary prevention.
    pub secondary_prevention: SecondaryPrevention,
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
    /// Nihss total.
    pub nihss_total: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
