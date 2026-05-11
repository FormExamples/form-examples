use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ReporterMetadata {
    pub reporter_name: String,
    pub reporter_email: String,
    pub reporter_role: String,
    pub reported_at: String,
    pub discovered_at: String,
    pub issue_category: String,
    pub environment: String,
    pub system_name: String,
    pub component: String,
    pub customer_or_project_tag: String,
    pub external_reference: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct RawScores {
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<u8>,
    pub score_by_magnitude_of_damage: Option<u8>,
    pub score_by_harm_grade: Option<u8>,
    pub score_by_failure_condition: FailureCondition,
    pub score_by_moscow_requirement: Option<u8>,
    pub score_by_frequency_percent: Option<f64>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct IssueTrackerAssessment {
    pub reporter: ReporterMetadata,
    pub scores: RawScores,
    // The nine SOAP sections are not needed by the scoring engine
    // itself; they live on the issue_tracker SQL row and are passed
    // through to the report renderer. They are intentionally omitted
    // from this struct.
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum FailureCondition {
    A,
    B,
    C,
    D,
    E,
    #[serde(rename = "")]
    None,
}

impl Default for FailureCondition {
    fn default() -> Self {
        Self::None
    }
}

impl FailureCondition {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::A => "A",
            Self::B => "B",
            Self::C => "C",
            Self::D => "D",
            Self::E => "E",
            Self::None => "",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Band {
    Low,
    Moderate,
    High,
    Critical,
}

impl Band {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Low => "low",
            Self::Moderate => "moderate",
            Self::High => "high",
            Self::Critical => "critical",
        }
    }
}

pub type CompositePriority = Band;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Instrument {
    Priority,
    Severity,
    Magnitude,
    Harm,
    Failure,
    Moscow,
    Frequency,
    Composite,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub instrument: Instrument,
    pub grade: String,
    pub category: String,
    pub description: String,
    pub band: Band,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagPriority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagCategory {
    HarmFatal,
    FailureCatastrophic,
    SeverityCatastrophic,
    MagnitudeTotalDestruction,
    FrequencyUniversal,
    RequirementMandatory,
    Regulatory,
    Safeguarding,
    DataLoss,
    Outage,
    Security,
    Safety,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: FlagCategory,
    pub priority: FlagPriority,
    pub description: String,
    pub suggested_action: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<u8>,
    pub score_by_magnitude_of_damage: Option<u8>,
    pub score_by_harm_grade: Option<u8>,
    pub score_by_failure_condition: FailureCondition,
    pub score_by_moscow_requirement: Option<u8>,
    pub score_by_frequency_percent: Option<f64>,
    pub composite_priority: CompositePriority,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
}
