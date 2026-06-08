//! Types module.

use serde::{Deserialize, Serialize};

/// Rag band.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RagBand {
    /// Green.
    Green,
    /// Amber.
    Amber,
    /// Red.
    Red,
}

impl RagBand {
    /// As str.
    pub fn as_str(&self) -> &'static str {
        match self { RagBand::Green => "green", RagBand::Amber => "amber", RagBand::Red => "red" }
    }
    /// Rank.
    pub fn rank(&self) -> u8 {
        match self { RagBand::Green => 0, RagBand::Amber => 1, RagBand::Red => 2 }
    }
}

/// Instrument.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Instrument {
    /// Progress.
    Progress,
    /// Confidence.
    Confidence,
    /// Stretch.
    Stretch,
    /// Alignment.
    Alignment,
    /// Impact.
    Impact,
    /// Smart.
    Smart,
    /// Pace.
    Pace,
    /// Composite.
    Composite,
}

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FiredRule {
    /// Rule ID.
    #[serde(rename = "ruleId")]
    pub rule_id: String,
    /// Instrument.
    pub instrument: Instrument,
    /// Grade.
    pub grade: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
}

/// Flag code.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagCode {
    /// Mis aligned.
    MisAligned,
    /// Orphaned.
    Orphaned,
    /// Non smart.
    NonSmart,
    /// Unmeasurable.
    Unmeasurable,
    /// No dri.
    NoDri,
    /// Committed at risk.
    CommittedAtRisk,
    /// Pace collapse.
    PaceCollapse,
    /// Confidence collapse.
    ConfidenceCollapse,
    /// Stale check in.
    StaleCheckIn,
    /// Cascading broken.
    CascadingBroken,
    /// Over scoped.
    OverScoped,
    /// Moonshot progress.
    MoonshotProgress,
}

/// Flag priority.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority {
    /// High.
    High,
    /// Medium.
    Medium,
    /// Low.
    Low,
}

/// Fired flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FiredFlag {
    /// Flag code.
    #[serde(rename = "flagCode")]
    pub flag_code: FlagCode,
    /// Priority.
    pub priority: FlagPriority,
    /// Description.
    pub description: String,
}

/// Raw scores.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RawScores {
    /// Progress percent.
    pub progress_percent: Option<f64>,
    /// Confidence decile.
    pub confidence_decile: Option<i32>,
    /// Stretch tier.
    pub stretch_tier: Option<i32>,
    /// Alignment grade.
    pub alignment_grade: Option<i32>,
    /// Impact tier.
    pub impact_tier: Option<i32>,
    /// Smart quality.
    pub smart_quality: Option<i32>,
    /// Pace deviation percent.
    pub pace_deviation_percent: Option<f64>,
}

/// Milestone.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Milestone {
    /// Name.
    pub name: String,
    /// Done.
    pub done: bool,
}

/// Key result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyResult {
    /// Position.
    pub position: i32,
    /// Title.
    pub title: String,
    /// Kr type.
    pub kr_type: String,
    /// Start value.
    pub start_value: Option<f64>,
    /// Current value.
    pub current_value: Option<f64>,
    /// Target value.
    pub target_value: Option<f64>,
    /// Milestones JSON.
    pub milestones_json: Option<Vec<Milestone>>,
    /// Binary done.
    pub binary_done: Option<bool>,
    /// Progress fraction.
    pub progress_fraction: Option<f64>,
}

/// Objective context.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectiveContext {
    /// Level.
    pub level: String,
    /// Parent objective ID.
    pub parent_objective_id: Option<String>,
    /// Parent objective status.
    pub parent_objective_status: Option<String>,
    /// Dri present.
    pub dri_present: bool,
    /// Cycle start date.
    pub cycle_start_date: Option<String>,
    /// Cycle end date.
    pub cycle_end_date: Option<String>,
    /// Checked in at.
    pub checked_in_at: Option<String>,
    /// Previous confidence decile.
    pub previous_confidence_decile: Option<i32>,
}

/// Objective assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectiveAssessment {
    /// Scores.
    pub scores: RawScores,
    /// Key results.
    pub key_results: Vec<KeyResult>,
    /// Context.
    pub context: ObjectiveContext,
    /// Now.
    pub now: String,
}

/// Grade result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    /// Computed composite rag.
    pub computed_composite_rag: RagBand,
    /// Rules fired.
    pub rules_fired: Vec<FiredRule>,
    /// Flags.
    pub flags: Vec<FiredFlag>,
}
