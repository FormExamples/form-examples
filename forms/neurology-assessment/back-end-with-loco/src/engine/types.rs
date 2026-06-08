//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ──────────────────────────

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

// ─── Neurological History (Step 2) ─────────────────────────

/// Neurological history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct NeurologicalHistory {
    /// Primary complaint.
    pub primary_complaint: String,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Symptom onset.
    pub symptom_onset: String,
    /// Previous neurological condition.
    pub previous_neurological_condition: String,
    /// Seizure history.
    pub seizure_history: String,
    /// Stroke history.
    pub stroke_history: String,
    /// Head injury.
    pub head_injury: String,
    /// Family neurological history.
    pub family_neurological_history: String,
}

// ─── Headache Assessment (Step 3) ──────────────────────────

/// Headache assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HeadacheAssessment {
    /// Headache type.
    pub headache_type: String,
    /// Headache frequency.
    pub headache_frequency: String,
    /// Headache severity.
    pub headache_severity: Option<u8>,
    /// Aura present.
    pub aura_present: String,
    /// Headache duration.
    pub headache_duration: String,
    /// Trigger factors.
    pub trigger_factors: String,
    /// Red flag symptoms.
    pub red_flag_symptoms: String,
    /// Thunderclap onset.
    pub thunderclap_onset: String,
}

// ─── Cranial Nerve Examination (Step 4) ────────────────────

/// Cranial nerve examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CranialNerveExamination {
    /// Visual acuity.
    pub visual_acuity: String,
    /// Visual fields.
    pub visual_fields: String,
    /// Pupil reaction.
    pub pupil_reaction: String,
    /// Eye movements.
    pub eye_movements: String,
    /// Facial sensation.
    pub facial_sensation: String,
    /// Facial symmetry.
    pub facial_symmetry: String,
    /// Hearing.
    pub hearing: String,
    /// Swallowing.
    pub swallowing: String,
    /// Tongue movement.
    pub tongue_movement: String,
}

// ─── Motor Assessment (Step 5) ─────────────────────────────

/// Motor assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MotorAssessment {
    /// Upper limb power right.
    pub upper_limb_power_right: Option<u8>,
    /// Upper limb power left.
    pub upper_limb_power_left: Option<u8>,
    /// Lower limb power right.
    pub lower_limb_power_right: Option<u8>,
    /// Lower limb power left.
    pub lower_limb_power_left: Option<u8>,
    /// Tonus abnormality.
    pub tonus_abnormality: String,
    /// Muscle wasting.
    pub muscle_wasting: String,
    /// Involuntary movements.
    pub involuntary_movements: String,
    /// Gait assessment.
    pub gait_assessment: String,
}

// ─── Sensory Assessment (Step 6) ───────────────────────────

/// Sensory assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SensoryAssessment {
    /// Light touch.
    pub light_touch: String,
    /// Pinprick.
    pub pinprick: String,
    /// Vibration sense.
    pub vibration_sense: String,
    /// Proprioception.
    pub proprioception: String,
    /// Temperature sense.
    pub temperature_sense: String,
    /// Sensory level.
    pub sensory_level: String,
    /// Dermatomal pattern.
    pub dermatomal_pattern: String,
    /// Peripheral neuropathy.
    pub peripheral_neuropathy: String,
}

// ─── Reflexes & Coordination (Step 7) ──────────────────────

/// Reflexes coordination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReflexesCoordination {
    /// Biceps reflex.
    pub biceps_reflex: String,
    /// Knee reflex.
    pub knee_reflex: String,
    /// Ankle reflex.
    pub ankle_reflex: String,
    /// Plantar response.
    pub plantar_response: String,
    /// Finger nose test.
    pub finger_nose_test: String,
    /// Heel shin test.
    pub heel_shin_test: String,
    /// Romberg sign.
    pub romberg_sign: String,
    /// Dysdiadochokinesis.
    pub dysdiadochokinesis: String,
}

// ─── Cognitive Screening (Step 8) ──────────────────────────

/// Cognitive screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveScreening {
    /// Orientation.
    pub orientation: Option<u8>,
    /// Attention.
    pub attention: Option<u8>,
    /// Memory.
    pub memory: Option<u8>,
    /// Language.
    pub language: Option<u8>,
    /// Executive function.
    pub executive_function: Option<u8>,
    /// Mmse score.
    pub mmse_score: Option<u8>,
    /// Moca score.
    pub moca_score: Option<u8>,
    /// Consciousness level.
    pub consciousness_level: String,
}

// ─── Investigations (Step 9) ───────────────────────────────

/// Investigations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// CT scan.
    pub ct_scan: String,
    /// MRI scan.
    pub mri_scan: String,
    /// Eeg.
    pub eeg: String,
    /// Nerve conduction study.
    pub nerve_conduction_study: String,
    /// Lumbar puncture.
    pub lumbar_puncture: String,
    /// Blood tests.
    pub blood_tests: String,
    /// Imaging findings.
    pub imaging_findings: String,
}

// ─── Clinical Review (Step 10) ─────────────────────────────

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
    /// Differential diagnosis.
    pub differential_diagnosis: String,
    /// Severity level.
    pub severity_level: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Treatment plan.
    pub treatment_plan: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Urgency.
    pub urgency: String,
}

// ─── Assessment Data (all sections) ────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Neurological history.
    pub neurological_history: NeurologicalHistory,
    /// Headache assessment.
    pub headache_assessment: HeadacheAssessment,
    /// Cranial nerve examination.
    pub cranial_nerve_examination: CranialNerveExamination,
    /// Motor assessment.
    pub motor_assessment: MotorAssessment,
    /// Sensory assessment.
    pub sensory_assessment: SensoryAssessment,
    /// Reflexes coordination.
    pub reflexes_coordination: ReflexesCoordination,
    /// Cognitive screening.
    pub cognitive_screening: CognitiveScreening,
    /// Investigations.
    pub investigations: Investigations,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ─────────────────────────────────────────

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
