//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// PCL-5 single-item score: 0 (Not at all) through 4 (Extremely), or `None`
/// if the patient has not yet answered.
pub type PclItemScore = Option<i32>;

/// Severity category derived from the PCL-5 total score.
pub type SeverityCategory = String;

/// Demographics step (Step 1).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// `"male"` / `"female"` / `"other"` / `""`
    pub sex: String,
}

/// Trauma event identification (Step 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TraumaEvent {
    /// Event description.
    pub event_description: String,
    /// Event date.
    pub event_date: String,
    /// Is ongoing.
    pub is_ongoing: bool,
}

/// DSM-5 Cluster B — Intrusion Symptoms (5 items, PCL-5 items 1-5).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterBIntrusion {
    /// Item1 repeated disturbing memories.
    pub item1_repeated_disturbing_memories: PclItemScore,
    /// Item2 repeated disturbing dreams.
    pub item2_repeated_disturbing_dreams: PclItemScore,
    /// Item3 feeling reliving.
    pub item3_feeling_reliving: PclItemScore,
    /// Item4 feeling upset by reminders.
    pub item4_feeling_upset_by_reminders: PclItemScore,
    /// Item5 strong physical reactions.
    pub item5_strong_physical_reactions: PclItemScore,
}

/// DSM-5 Cluster C — Avoidance Symptoms (2 items, PCL-5 items 6-7).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterCAvoidance {
    /// Item6 avoiding memories thoughts feelings.
    pub item6_avoiding_memories_thoughts_feelings: PclItemScore,
    /// Item7 avoiding external reminders.
    pub item7_avoiding_external_reminders: PclItemScore,
}

/// DSM-5 Cluster D — Negative Alterations in Cognitions & Mood (7 items, PCL-5 items 8-14).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterDNegativeAlterations {
    /// Item8 trouble remembering important parts.
    pub item8_trouble_remembering_important_parts: PclItemScore,
    /// Item9 strong negative beliefs.
    pub item9_strong_negative_beliefs: PclItemScore,
    /// Item10 blaming self or others.
    pub item10_blaming_self_or_others: PclItemScore,
    /// Item11 strong negative feelings.
    pub item11_strong_negative_feelings: PclItemScore,
    /// Item12 loss of interest.
    pub item12_loss_of_interest: PclItemScore,
    /// Item13 feeling distant from others.
    pub item13_feeling_distant_from_others: PclItemScore,
    /// Item14 trouble experiencing positive feelings.
    pub item14_trouble_experiencing_positive_feelings: PclItemScore,
}

/// DSM-5 Cluster E — Alterations in Arousal & Reactivity (6 items, PCL-5 items 15-20).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterEArousalReactivity {
    /// Item15 irritable or aggressive.
    pub item15_irritable_or_aggressive: PclItemScore,
    /// Item16 reckless or self destructive.
    pub item16_reckless_or_self_destructive: PclItemScore,
    /// Item17 super alert or on guard.
    pub item17_super_alert_or_on_guard: PclItemScore,
    /// Item18 jumpy or easily startled.
    pub item18_jumpy_or_easily_startled: PclItemScore,
    /// Item19 difficulty concentrating.
    pub item19_difficulty_concentrating: PclItemScore,
    /// Item20 trouble sleeping.
    pub item20_trouble_sleeping: PclItemScore,
}

/// Full Post-Traumatic Stress Assessment (PCL-5) case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Trauma event.
    pub trauma_event: TraumaEvent,
    /// Cluster b intrusion.
    pub cluster_b_intrusion: ClusterBIntrusion,
    /// Cluster c avoidance.
    pub cluster_c_avoidance: ClusterCAvoidance,
    /// Cluster d negative alterations.
    pub cluster_d_negative_alterations: ClusterDNegativeAlterations,
    /// Cluster e arousal reactivity.
    pub cluster_e_arousal_reactivity: ClusterEArousalReactivity,
}

/// Per-cluster summed scores.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterScores {
    /// B.
    pub b: i32,
    /// C.
    pub c: i32,
    /// D.
    pub d: i32,
    /// E.
    pub e: i32,
}

/// A clinical rule that fired against the scoring result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// `"low"` / `"medium"` / `"high"` / `"critical"`
    pub severity: String,
}

/// A safety-critical flag raised independently of the cluster rules.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// `"urgent"` / `"high"` / `"medium"` / `"low"`
    pub priority: String,
}

/// PCL-5 grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Total score.
    pub total_score: i32,
    /// Category.
    pub category: SeverityCategory,
    /// Probable dsm5 diagnosis.
    pub probable_dsm5_diagnosis: bool,
    /// Cluster scores.
    pub cluster_scores: ClusterScores,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Answered count.
    pub answered_count: i32,
    /// Timestamp.
    pub timestamp: String,
}
