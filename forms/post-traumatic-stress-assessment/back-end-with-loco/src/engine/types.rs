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
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    /// `"male"` / `"female"` / `"other"` / `""`
    pub sex: String,
}

/// Trauma event identification (Step 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TraumaEvent {
    pub event_description: String,
    pub event_date: String,
    pub is_ongoing: bool,
}

/// DSM-5 Cluster B — Intrusion Symptoms (5 items, PCL-5 items 1-5).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterBIntrusion {
    pub item1_repeated_disturbing_memories: PclItemScore,
    pub item2_repeated_disturbing_dreams: PclItemScore,
    pub item3_feeling_reliving: PclItemScore,
    pub item4_feeling_upset_by_reminders: PclItemScore,
    pub item5_strong_physical_reactions: PclItemScore,
}

/// DSM-5 Cluster C — Avoidance Symptoms (2 items, PCL-5 items 6-7).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterCAvoidance {
    pub item6_avoiding_memories_thoughts_feelings: PclItemScore,
    pub item7_avoiding_external_reminders: PclItemScore,
}

/// DSM-5 Cluster D — Negative Alterations in Cognitions & Mood (7 items, PCL-5 items 8-14).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterDNegativeAlterations {
    pub item8_trouble_remembering_important_parts: PclItemScore,
    pub item9_strong_negative_beliefs: PclItemScore,
    pub item10_blaming_self_or_others: PclItemScore,
    pub item11_strong_negative_feelings: PclItemScore,
    pub item12_loss_of_interest: PclItemScore,
    pub item13_feeling_distant_from_others: PclItemScore,
    pub item14_trouble_experiencing_positive_feelings: PclItemScore,
}

/// DSM-5 Cluster E — Alterations in Arousal & Reactivity (6 items, PCL-5 items 15-20).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterEArousalReactivity {
    pub item15_irritable_or_aggressive: PclItemScore,
    pub item16_reckless_or_self_destructive: PclItemScore,
    pub item17_super_alert_or_on_guard: PclItemScore,
    pub item18_jumpy_or_easily_startled: PclItemScore,
    pub item19_difficulty_concentrating: PclItemScore,
    pub item20_trouble_sleeping: PclItemScore,
}

/// Full Post-Traumatic Stress Assessment (PCL-5) case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub trauma_event: TraumaEvent,
    pub cluster_b_intrusion: ClusterBIntrusion,
    pub cluster_c_avoidance: ClusterCAvoidance,
    pub cluster_d_negative_alterations: ClusterDNegativeAlterations,
    pub cluster_e_arousal_reactivity: ClusterEArousalReactivity,
}

/// Per-cluster summed scores.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClusterScores {
    pub b: i32,
    pub c: i32,
    pub d: i32,
    pub e: i32,
}

/// A clinical rule that fired against the scoring result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    /// `"low"` / `"medium"` / `"high"` / `"critical"`
    pub severity: String,
}

/// A safety-critical flag raised independently of the cluster rules.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// `"urgent"` / `"high"` / `"medium"` / `"low"`
    pub priority: String,
}

/// PCL-5 grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub total_score: i32,
    pub category: SeverityCategory,
    pub probable_dsm5_diagnosis: bool,
    pub cluster_scores: ClusterScores,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub answered_count: i32,
    pub timestamp: String,
}
