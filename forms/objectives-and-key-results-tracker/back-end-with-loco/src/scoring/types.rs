use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RagBand { Green, Amber, Red }

impl RagBand {
    pub fn as_str(&self) -> &'static str {
        match self { RagBand::Green => "green", RagBand::Amber => "amber", RagBand::Red => "red" }
    }
    pub fn rank(&self) -> u8 {
        match self { RagBand::Green => 0, RagBand::Amber => 1, RagBand::Red => 2 }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Instrument { Progress, Confidence, Stretch, Alignment, Impact, Smart, Pace, Composite }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FiredRule {
    #[serde(rename = "ruleId")]
    pub rule_id: String,
    pub instrument: Instrument,
    pub grade: String,
    pub category: String,
    pub description: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagCode {
    MisAligned, Orphaned, NonSmart, Unmeasurable, NoDri,
    CommittedAtRisk, PaceCollapse, ConfidenceCollapse,
    StaleCheckIn, CascadingBroken, OverScoped, MoonshotProgress,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority { High, Medium, Low }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FiredFlag {
    #[serde(rename = "flagCode")]
    pub flag_code: FlagCode,
    pub priority: FlagPriority,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RawScores {
    pub progress_percent: Option<f64>,
    pub confidence_decile: Option<i32>,
    pub stretch_tier: Option<i32>,
    pub alignment_grade: Option<i32>,
    pub impact_tier: Option<i32>,
    pub smart_quality: Option<i32>,
    pub pace_deviation_percent: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Milestone { pub name: String, pub done: bool }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyResult {
    pub position: i32,
    pub title: String,
    pub kr_type: String,
    pub start_value: Option<f64>,
    pub current_value: Option<f64>,
    pub target_value: Option<f64>,
    pub milestones_json: Option<Vec<Milestone>>,
    pub binary_done: Option<bool>,
    pub progress_fraction: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectiveContext {
    pub level: String,
    pub parent_objective_id: Option<String>,
    pub parent_objective_status: Option<String>,
    pub dri_present: bool,
    pub cycle_start_date: Option<String>,
    pub cycle_end_date: Option<String>,
    pub checked_in_at: Option<String>,
    pub previous_confidence_decile: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectiveAssessment {
    pub scores: RawScores,
    pub key_results: Vec<KeyResult>,
    pub context: ObjectiveContext,
    pub now: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    pub computed_composite_rag: RagBand,
    pub rules_fired: Vec<FiredRule>,
    pub flags: Vec<FiredFlag>,
}
