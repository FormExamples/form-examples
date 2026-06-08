//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Tri-state checklist response: `yes`, `no`, `na`, or `''` (unanswered).
/// Tri state.
pub type TriState = String;
// Pass/Fail outcome: `pass`, `fail`, or `''`.
/// Outcome.
pub type Outcome = String;

/// Step 1 — Trainee Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TraineeDetails {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Trainee ID.
    pub trainee_id: String,
    /// Role.
    pub role: String,
    /// Prior certification expiry.
    pub prior_certification_expiry: String,
    /// Session date.
    pub session_date: String,
    /// Examiner name.
    pub examiner_name: String,
}

/// Step 2 — Scene Safety & Initial Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SceneSafety {
    /// Scene safe.
    pub scene_safe: TriState,
    /// Ppe applied.
    pub ppe_applied: TriState,
    /// Hazards identified.
    pub hazards_identified: TriState,
    /// Bystanders controlled.
    pub bystanders_controlled: TriState,
}

/// Step 3 — Responsiveness & Breathing Check.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponsivenessBreathing {
    /// Tapped and shouted.
    pub tapped_and_shouted: TriState,
    /// Checked breathing.
    pub checked_breathing: TriState,
    /// Checked pulse simultaneously.
    pub checked_pulse_simultaneously: TriState,
    /// Time within ten seconds.
    pub time_within_ten_seconds: TriState,
}

/// Step 4 — Activate Emergency Response.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActivateEmergencyResponse {
    /// Called emergency number.
    pub called_emergency_number: TriState,
    /// Stated location and condition.
    pub stated_location_and_condition: TriState,
    /// Designated aed retriever.
    pub designated_aed_retriever: TriState,
    /// Used speakerphone.
    pub used_speakerphone: TriState,
}

/// Step 5 — Chest Compressions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChestCompressions {
    /// Compression rate.
    pub compression_rate: Option<f64>,
    /// Compression depth.
    pub compression_depth: Option<f64>,
    /// Correct hand position.
    pub correct_hand_position: TriState,
    /// Full chest recoil.
    pub full_chest_recoil: TriState,
    /// Minimised interruptions.
    pub minimised_interruptions: TriState,
    /// Compressions at correct rate.
    pub compressions_at_correct_rate: TriState,
    /// Compressions at correct depth.
    pub compressions_at_correct_depth: TriState,
}

/// Step 6 — Airway & Rescue Breaths.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AirwayRescueBreaths {
    /// Head tilt chin lift.
    pub head_tilt_chin_lift: TriState,
    /// Effective seal.
    pub effective_seal: TriState,
    /// Visible chest rise.
    pub visible_chest_rise: TriState,
    /// One second per breath.
    pub one_second_per_breath: TriState,
    /// Ratio30to2.
    pub ratio30to2: TriState,
    /// Avoided excessive ventilation.
    pub avoided_excessive_ventilation: TriState,
}

/// Step 7 — AED Use & Shock Delivery.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AedShockDelivery {
    /// Powered on promptly.
    pub powered_on_promptly: TriState,
    /// Correct pad placement.
    pub correct_pad_placement: TriState,
    /// Cleared during analysis.
    pub cleared_during_analysis: TriState,
    /// Delivered shock safely.
    pub delivered_shock_safely: TriState,
    /// Resumed compressions immediately.
    pub resumed_compressions_immediately: TriState,
    /// Time to first shock seconds.
    pub time_to_first_shock_seconds: Option<f64>,
}

/// Step 8 — Team Dynamics, Handoff & Feedback.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamDynamicsHandoff {
    /// Clear communication.
    pub clear_communication: TriState,
    /// Closed loop orders.
    pub closed_loop_orders: TriState,
    /// Appropriate handoff.
    pub appropriate_handoff: TriState,
    /// Debrief participated.
    pub debrief_participated: TriState,
    /// Examiner notes.
    pub examiner_notes: String,
    /// Trainee feedback.
    pub trainee_feedback: String,
}

/// Full BLS Skills Verification assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Trainee details.
    pub trainee_details: TraineeDetails,
    /// Scene safety.
    pub scene_safety: SceneSafety,
    /// Responsiveness breathing.
    pub responsiveness_breathing: ResponsivenessBreathing,
    /// Activate emergency response.
    pub activate_emergency_response: ActivateEmergencyResponse,
    /// Chest compressions.
    pub chest_compressions: ChestCompressions,
    /// Airway rescue breaths.
    pub airway_rescue_breaths: AirwayRescueBreaths,
    /// Aed shock delivery.
    pub aed_shock_delivery: AedShockDelivery,
    /// Team dynamics handoff.
    pub team_dynamics_handoff: TeamDynamicsHandoff,
}

/// A rule evaluated during grading; `status` is the tri-state result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Step.
    pub step: u32,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Critical.
    pub critical: bool,
    /// Status.
    pub status: TriState,
}

/// A safety flag emitted by the report.
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

/// Grading output for a BLS skills assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Outcome.
    pub outcome: Outcome,
    /// Critical failures.
    pub critical_failures: Vec<FiredRule>,
    /// Non critical deficiencies.
    pub non_critical_deficiencies: Vec<FiredRule>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Answered count.
    pub answered_count: u32,
    /// Total rules.
    pub total_rules: u32,
    /// Timestamp.
    pub timestamp: String,
}
