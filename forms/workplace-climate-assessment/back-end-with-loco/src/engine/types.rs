use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered Likert numeric field.
pub type LikertValue = Option<i32>;
pub type ClimateCategory = String;

/// Demographics — anonymised banding only; NOT graded into the composite.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub department: String,
    pub tenure_band: String,
    pub hours_band: String,
    pub role_level: String,
    pub work_location: String,
}

/// Leadership & Management (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Leadership {
    pub ld1: LikertValue,
    pub ld2: LikertValue,
    pub ld3: LikertValue,
    pub ld4: LikertValue,
    pub ld5: LikertValue,
}

/// Psychological Safety (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PsychSafety {
    pub ps1: LikertValue,
    pub ps2: LikertValue,
    pub ps3: LikertValue,
    pub ps4: LikertValue,
    pub ps5: LikertValue,
}

/// Inclusion & Belonging (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Inclusion {
    pub in1: LikertValue,
    pub in2: LikertValue,
    pub in3: LikertValue,
    pub in4: LikertValue,
    pub in5: LikertValue,
}

/// Communication (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Communication {
    pub co1: LikertValue,
    pub co2: LikertValue,
    pub co3: LikertValue,
    pub co4: LikertValue,
}

/// Collaboration & Teamwork (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Collaboration {
    pub cl1: LikertValue,
    pub cl2: LikertValue,
    pub cl3: LikertValue,
    pub cl4: LikertValue,
}

/// Recognition & Reward (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Recognition {
    pub re1: LikertValue,
    pub re2: LikertValue,
    pub re3: LikertValue,
    pub re4: LikertValue,
}

/// Wellbeing (5 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Wellbeing {
    pub we1: LikertValue,
    pub we2: LikertValue,
    pub we3: LikertValue,
    pub we4: LikertValue,
    pub we5: LikertValue,
}

/// Career Development (4 items).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Career {
    pub ca1: LikertValue,
    pub ca2: LikertValue,
    pub ca3: LikertValue,
    pub ca4: LikertValue,
}

/// Overall Climate & Recommendations — 3 Likert items (NOT graded into composite),
/// a recommend-as-place-to-work choice, and free-text feedback.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallClimate {
    pub oc1: LikertValue,
    pub oc2: LikertValue,
    pub oc3: LikertValue,
    pub recommend_as_place_to_work: String,
    pub biggest_strength: String,
    pub biggest_improvement: String,
    pub other_comments: String,
}

/// Full Workplace Climate Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub leadership: Leadership,
    pub psych_safety: PsychSafety,
    pub inclusion: Inclusion,
    pub communication: Communication,
    pub collaboration: Collaboration,
    pub recognition: Recognition,
    pub wellbeing: Wellbeing,
    pub career: Career,
    pub overall: OverallClimate,
}

/// Per-item answered record (preserved verbatim for the fired-rules list).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub domain: String,
    pub label: String,
    pub raw_value: i32,
}

/// A flag emitted by `flagged_issues` after grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Per-domain score.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScore {
    pub mean: Option<f64>,
    pub score: Option<f64>,
    pub answered_count: u32,
    pub total_count: u32,
    pub category: ClimateCategory,
}

/// All eight graded domain scores.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScores {
    pub leadership: DomainScore,
    pub psych_safety: DomainScore,
    pub inclusion: DomainScore,
    pub communication: DomainScore,
    pub collaboration: DomainScore,
    pub recognition: DomainScore,
    pub wellbeing: DomainScore,
    pub career: DomainScore,
}

/// Grading output for the entire Workplace Climate Assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub composite_score: Option<f64>,
    pub category: ClimateCategory,
    pub domain_scores: DomainScores,
    pub answered_count: u32,
    pub total_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
