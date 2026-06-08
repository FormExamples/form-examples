//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Mobility level.
pub type MobilityLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Referral source.
    pub referral_source: String,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Assessor name.
    pub assessor_name: String,
    /// Assessor role.
    pub assessor_role: String,
    /// Setting.
    pub setting: String,
}

// ─── Mobility History (Step 2) ──────────────────────────────

/// Mobility history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MobilityHistory {
    /// Pre morbid mobility.
    pub pre_morbid_mobility: Option<u8>,
    /// Current mobility level.
    pub current_mobility_level: Option<u8>,
    /// Mobility change onset.
    pub mobility_change_onset: String,
    /// Mobility change duration.
    pub mobility_change_duration: String,
    /// Pain with movement.
    pub pain_with_movement: Option<u8>,
    /// Endurance level.
    pub endurance_level: Option<u8>,
}

// ─── Balance Assessment (Step 3) ────────────────────────────

/// Balance assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BalanceAssessment {
    /// Static sitting balance.
    pub static_sitting_balance: Option<u8>,
    /// Dynamic sitting balance.
    pub dynamic_sitting_balance: Option<u8>,
    /// Static standing balance.
    pub static_standing_balance: Option<u8>,
    /// Dynamic standing balance.
    pub dynamic_standing_balance: Option<u8>,
    /// Single leg stance.
    pub single_leg_stance: Option<u8>,
    /// Tandem stance.
    pub tandem_stance: Option<u8>,
}

// ─── Gait Analysis (Step 4) ────────────────────────────────

/// Gait analysis.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GaitAnalysis {
    /// Gait pattern quality.
    pub gait_pattern_quality: Option<u8>,
    /// Gait speed.
    pub gait_speed: Option<u8>,
    /// Step length symmetry.
    pub step_length_symmetry: Option<u8>,
    /// Turning ability.
    pub turning_ability: Option<u8>,
    /// Outdoor walking.
    pub outdoor_walking: Option<u8>,
    /// Walking endurance.
    pub walking_endurance: Option<u8>,
}

// ─── Transfers & Bed Mobility (Step 5) ──────────────────────

/// Transfers bed mobility.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TransfersBedMobility {
    /// Bed mobility.
    pub bed_mobility: Option<u8>,
    /// Sit to stand.
    pub sit_to_stand: Option<u8>,
    /// Stand to sit.
    pub stand_to_sit: Option<u8>,
    /// Chair transfer.
    pub chair_transfer: Option<u8>,
    /// Toilet transfer.
    pub toilet_transfer: Option<u8>,
    /// Car transfer.
    pub car_transfer: Option<u8>,
}

// ─── Stairs & Obstacles (Step 6) ────────────────────────────

/// Stairs obstacles.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StairsObstacles {
    /// Stair ascent.
    pub stair_ascent: Option<u8>,
    /// Stair descent.
    pub stair_descent: Option<u8>,
    /// Curb negotiation.
    pub curb_negotiation: Option<u8>,
    /// Uneven surfaces.
    pub uneven_surfaces: Option<u8>,
    /// Obstacle avoidance.
    pub obstacle_avoidance: Option<u8>,
    /// Ramp navigation.
    pub ramp_navigation: Option<u8>,
}

// ─── Upper Limb Function (Step 7) ───────────────────────────

/// Upper limb function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UpperLimbFunction {
    /// Reaching overhead.
    pub reaching_overhead: Option<u8>,
    /// Grip strength.
    pub grip_strength: Option<u8>,
    /// Fine motor control.
    pub fine_motor_control: Option<u8>,
    /// Bilateral coordination.
    pub bilateral_coordination: Option<u8>,
    /// Upper limb weight bearing.
    pub upper_limb_weight_bearing: Option<u8>,
    /// Functional reach.
    pub functional_reach: Option<u8>,
}

// ─── Assistive Devices (Step 8) ─────────────────────────────

/// Assistive devices.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssistiveDevices {
    /// Current device type.
    pub current_device_type: String,
    /// Device appropriateness.
    pub device_appropriateness: Option<u8>,
    /// Device usage competence.
    pub device_usage_competence: Option<u8>,
    /// Device condition.
    pub device_condition: Option<u8>,
    /// Home equipment needs.
    pub home_equipment_needs: String,
    /// Wheelchair skills.
    pub wheelchair_skills: Option<u8>,
}

// ─── Falls Risk Assessment (Step 9) ─────────────────────────

/// Falls risk assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FallsRiskAssessment {
    /// Falls in past year.
    pub falls_in_past_year: String,
    /// Fear of falling.
    pub fear_of_falling: Option<u8>,
    /// Medication fall risk.
    pub medication_fall_risk: Option<u8>,
    /// Postural hypotension.
    pub postural_hypotension: Option<u8>,
    /// Vision impairment.
    pub vision_impairment: Option<u8>,
    /// Cognitive impact on mobility.
    pub cognitive_impact_on_mobility: Option<u8>,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall mobility rating.
    pub overall_mobility_rating: Option<u8>,
    /// Rehabilitation potential.
    pub rehabilitation_potential: Option<u8>,
    /// Patient goals.
    pub patient_goals: String,
    /// Recommended interventions.
    pub recommended_interventions: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Mobility history.
    pub mobility_history: MobilityHistory,
    /// Balance assessment.
    pub balance_assessment: BalanceAssessment,
    /// Gait analysis.
    pub gait_analysis: GaitAnalysis,
    /// Transfers bed mobility.
    pub transfers_bed_mobility: TransfersBedMobility,
    /// Stairs obstacles.
    pub stairs_obstacles: StairsObstacles,
    /// Upper limb function.
    pub upper_limb_function: UpperLimbFunction,
    /// Assistive devices.
    pub assistive_devices: AssistiveDevices,
    /// Falls risk assessment.
    pub falls_risk_assessment: FallsRiskAssessment,
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
    /// Mobility level.
    pub mobility_level: MobilityLevel,
    /// Mobility score.
    pub mobility_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
