//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Impairment level.
pub type ImpairmentLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Referring provider.
    pub referring_provider: String,
    /// Primary complaint.
    pub primary_complaint: String,
    /// Onset date.
    pub onset_date: String,
    /// Mechanism of injury.
    pub mechanism_of_injury: String,
}

// ─── Movement History (Step 2) ──────────────────────────────

/// Movement history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MovementHistory {
    /// Activity level.
    pub activity_level: Option<u8>,
    /// Exercise frequency.
    pub exercise_frequency: String,
    /// Sport participation.
    pub sport_participation: String,
    /// Occupational demands.
    pub occupational_demands: Option<u8>,
    /// Previous injuries.
    pub previous_injuries: String,
    /// Surgical history.
    pub surgical_history: String,
    /// Daily activity limitation.
    pub daily_activity_limitation: Option<u8>,
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
}

// ─── Postural Assessment (Step 3) ───────────────────────────

/// Postural assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PosturalAssessment {
    /// Head alignment.
    pub head_alignment: Option<u8>,
    /// Shoulder symmetry.
    pub shoulder_symmetry: Option<u8>,
    /// Spinal curvature.
    pub spinal_curvature: Option<u8>,
    /// Pelvic tilt.
    pub pelvic_tilt: Option<u8>,
    /// Knee alignment.
    pub knee_alignment: Option<u8>,
    /// Foot arch.
    pub foot_arch: Option<u8>,
    /// Overall posture.
    pub overall_posture: Option<u8>,
}

// ─── Range of Motion (Step 4) ───────────────────────────────

/// Range of motion.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RangeOfMotion {
    /// Cervical flexion.
    pub cervical_flexion: Option<u8>,
    /// Cervical rotation.
    pub cervical_rotation: Option<u8>,
    /// Shoulder flexion.
    pub shoulder_flexion: Option<u8>,
    /// Shoulder abduction.
    pub shoulder_abduction: Option<u8>,
    /// Lumbar flexion.
    pub lumbar_flexion: Option<u8>,
    /// Lumbar extension.
    pub lumbar_extension: Option<u8>,
    /// Hip flexion.
    pub hip_flexion: Option<u8>,
    /// Knee flexion.
    pub knee_flexion: Option<u8>,
}

// ─── Muscle Strength Testing (Step 5) ───────────────────────

/// Muscle strength testing.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MuscleStrengthTesting {
    /// Upper extremity strength.
    pub upper_extremity_strength: Option<u8>,
    /// Lower extremity strength.
    pub lower_extremity_strength: Option<u8>,
    /// Core stability.
    pub core_stability: Option<u8>,
    /// Grip strength.
    pub grip_strength: Option<u8>,
    /// Bilateral symmetry.
    pub bilateral_symmetry: Option<u8>,
    /// Muscle endurance.
    pub muscle_endurance: Option<u8>,
    /// Functional strength.
    pub functional_strength: Option<u8>,
}

// ─── Gait Analysis (Step 6) ────────────────────────────────

/// Gait analysis.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GaitAnalysis {
    /// Stride symmetry.
    pub stride_symmetry: Option<u8>,
    /// Cadence.
    pub cadence: Option<u8>,
    /// Heel strike pattern.
    pub heel_strike_pattern: Option<u8>,
    /// Toe off pattern.
    pub toe_off_pattern: Option<u8>,
    /// Arm swing.
    pub arm_swing: Option<u8>,
    /// Balance during gait.
    pub balance_during_gait: Option<u8>,
    /// Assistive device used.
    pub assistive_device_used: String,
}

// ─── Functional Testing (Step 7) ───────────────────────────

/// Functional testing.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalTesting {
    /// Sit to stand.
    pub sit_to_stand: Option<u8>,
    /// Single leg balance.
    pub single_leg_balance: Option<u8>,
    /// Squat quality.
    pub squat_quality: Option<u8>,
    /// Lunge quality.
    pub lunge_quality: Option<u8>,
    /// Push up quality.
    pub push_up_quality: Option<u8>,
    /// Overhead reach.
    pub overhead_reach: Option<u8>,
    /// Step up quality.
    pub step_up_quality: Option<u8>,
}

// ─── Pain Assessment (Step 8) ──────────────────────────────

/// Pain assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PainAssessment {
    /// Pain severity.
    pub pain_severity: Option<u8>,
    /// Pain location.
    pub pain_location: String,
    /// Pain type.
    pub pain_type: String,
    /// Pain with movement.
    pub pain_with_movement: Option<u8>,
    /// Pain at rest.
    pub pain_at_rest: Option<u8>,
    /// Pain frequency.
    pub pain_frequency: String,
    /// Aggravating factors.
    pub aggravating_factors: String,
    /// Relieving factors.
    pub relieving_factors: String,
}

// ─── Exercise Prescription (Step 9) ─────────────────────────

/// Exercise prescription.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ExercisePrescription {
    /// Exercise tolerance.
    pub exercise_tolerance: Option<u8>,
    /// Cardiovascular fitness.
    pub cardiovascular_fitness: Option<u8>,
    /// Flexibility level.
    pub flexibility_level: Option<u8>,
    /// Motivation level.
    pub motivation_level: Option<u8>,
    /// Home exercise compliance.
    pub home_exercise_compliance: Option<u8>,
    /// Equipment access.
    pub equipment_access: String,
    /// Exercise goals.
    pub exercise_goals: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall functional status.
    pub overall_functional_status: Option<u8>,
    /// Treatment response.
    pub treatment_response: Option<u8>,
    /// Prognosis rating.
    pub prognosis_rating: Option<u8>,
    /// Follow up needed.
    pub follow_up_needed: String,
    /// Referral recommended.
    pub referral_recommended: String,
    /// Clinician notes.
    pub clinician_notes: String,
    /// Patient goals.
    pub patient_goals: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Movement history.
    pub movement_history: MovementHistory,
    /// Postural assessment.
    pub postural_assessment: PosturalAssessment,
    /// Range of motion.
    pub range_of_motion: RangeOfMotion,
    /// Muscle strength testing.
    pub muscle_strength_testing: MuscleStrengthTesting,
    /// Gait analysis.
    pub gait_analysis: GaitAnalysis,
    /// Functional testing.
    pub functional_testing: FunctionalTesting,
    /// Pain assessment.
    pub pain_assessment: PainAssessment,
    /// Exercise prescription.
    pub exercise_prescription: ExercisePrescription,
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
    /// Impairment level.
    pub impairment_level: ImpairmentLevel,
    /// Impairment score.
    pub impairment_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
