use serde::{Deserialize, Serialize};

// Tri-state checklist response: `yes`, `no`, `na`, or `''` (unanswered).
pub type TriState = String;
// Pass/Fail outcome: `pass`, `fail`, or `''`.
pub type Outcome = String;

/// Step 1 — Trainee Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TraineeDetails {
    pub first_name: String,
    pub last_name: String,
    pub trainee_id: String,
    pub role: String,
    pub prior_certification_expiry: String,
    pub session_date: String,
    pub examiner_name: String,
}

/// Step 2 — Scene Safety & Initial Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SceneSafety {
    pub scene_safe: TriState,
    pub ppe_applied: TriState,
    pub hazards_identified: TriState,
    pub bystanders_controlled: TriState,
}

/// Step 3 — Responsiveness & Breathing Check.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponsivenessBreathing {
    pub tapped_and_shouted: TriState,
    pub checked_breathing: TriState,
    pub checked_pulse_simultaneously: TriState,
    pub time_within_ten_seconds: TriState,
}

/// Step 4 — Activate Emergency Response.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActivateEmergencyResponse {
    pub called_emergency_number: TriState,
    pub stated_location_and_condition: TriState,
    pub designated_aed_retriever: TriState,
    pub used_speakerphone: TriState,
}

/// Step 5 — Chest Compressions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChestCompressions {
    pub compression_rate: Option<f64>,
    pub compression_depth: Option<f64>,
    pub correct_hand_position: TriState,
    pub full_chest_recoil: TriState,
    pub minimised_interruptions: TriState,
    pub compressions_at_correct_rate: TriState,
    pub compressions_at_correct_depth: TriState,
}

/// Step 6 — Airway & Rescue Breaths.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AirwayRescueBreaths {
    pub head_tilt_chin_lift: TriState,
    pub effective_seal: TriState,
    pub visible_chest_rise: TriState,
    pub one_second_per_breath: TriState,
    pub ratio30to2: TriState,
    pub avoided_excessive_ventilation: TriState,
}

/// Step 7 — AED Use & Shock Delivery.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AedShockDelivery {
    pub powered_on_promptly: TriState,
    pub correct_pad_placement: TriState,
    pub cleared_during_analysis: TriState,
    pub delivered_shock_safely: TriState,
    pub resumed_compressions_immediately: TriState,
    pub time_to_first_shock_seconds: Option<f64>,
}

/// Step 8 — Team Dynamics, Handoff & Feedback.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamDynamicsHandoff {
    pub clear_communication: TriState,
    pub closed_loop_orders: TriState,
    pub appropriate_handoff: TriState,
    pub debrief_participated: TriState,
    pub examiner_notes: String,
    pub trainee_feedback: String,
}

/// Full BLS Skills Verification assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub trainee_details: TraineeDetails,
    pub scene_safety: SceneSafety,
    pub responsiveness_breathing: ResponsivenessBreathing,
    pub activate_emergency_response: ActivateEmergencyResponse,
    pub chest_compressions: ChestCompressions,
    pub airway_rescue_breaths: AirwayRescueBreaths,
    pub aed_shock_delivery: AedShockDelivery,
    pub team_dynamics_handoff: TeamDynamicsHandoff,
}

/// A rule evaluated during grading; `status` is the tri-state result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub step: u32,
    pub category: String,
    pub description: String,
    pub critical: bool,
    pub status: TriState,
}

/// A safety flag emitted by the report.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a BLS skills assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub outcome: Outcome,
    pub critical_failures: Vec<FiredRule>,
    pub non_critical_deficiencies: Vec<FiredRule>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub answered_count: u32,
    pub total_rules: u32,
    pub timestamp: String,
}
