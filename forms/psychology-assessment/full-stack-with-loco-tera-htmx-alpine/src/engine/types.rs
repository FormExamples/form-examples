use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered DASS item / numeric field.
pub type YesNo = String;
pub type Sex = String;
pub type AssessmentReason = String;
pub type ImpactLevel = String;
pub type DassSeverity = String;
pub type SocialSupport = String;

/// DASS-21 Likert item response: 0..=3, or `None` if unanswered.
pub type DassItem = Option<i32>;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub occupation: String,
}

/// Step 2 — Reason for Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonForAssessment {
    pub reason: AssessmentReason,
    pub reason_details: String,
    pub primary_concern: String,
    pub symptom_duration_weeks: Option<i32>,
}

/// Step 3 — DASS-21 Depression subscale (items 3, 5, 10, 13, 16, 17, 21).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DassDepression {
    pub item3_could_not_experience_positive: DassItem,
    pub item5_difficult_initiating: DassItem,
    pub item10_nothing_to_look_forward_to: DassItem,
    pub item13_downhearted_blue: DassItem,
    pub item16_unable_to_become_enthusiastic: DassItem,
    pub item17_not_worth_much: DassItem,
    pub item21_life_meaningless: DassItem,
}

/// Step 4 — DASS-21 Anxiety subscale (items 2, 4, 7, 9, 15, 19, 20).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DassAnxiety {
    pub item2_dryness_of_mouth: DassItem,
    pub item4_breathing_difficulty: DassItem,
    pub item7_trembling: DassItem,
    pub item9_panic_worry: DassItem,
    pub item15_closed_to_panic: DassItem,
    pub item19_heart_action_aware: DassItem,
    pub item20_scared_without_reason: DassItem,
}

/// Step 5 — DASS-21 Stress subscale (items 1, 6, 8, 11, 12, 14, 18).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DassStress {
    pub item1_hard_to_wind_down: DassItem,
    pub item6_over_react: DassItem,
    pub item8_nervous_energy: DassItem,
    pub item11_agitated_easily: DassItem,
    pub item12_difficult_to_relax: DassItem,
    pub item14_intolerant: DassItem,
    pub item18_touchy_easily: DassItem,
}

/// Step 6 — Functional Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalImpact {
    pub work_impact: ImpactLevel,
    pub relationship_impact: ImpactLevel,
    pub daily_activities_impact: ImpactLevel,
    pub sleep_impact: ImpactLevel,
    pub notes: String,
}

/// Step 7 — Risk Screen.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskScreen {
    pub suicidal_ideation: YesNo,
    pub suicidal_ideation_details: String,
    pub self_harm: YesNo,
    pub harm_to_others: YesNo,
    pub psychiatric_emergency_history: YesNo,
    pub has_safety_plan: YesNo,
}

/// Step 8 — Support and History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SupportAndHistory {
    pub previous_mental_health_care: YesNo,
    pub previous_mental_health_details: String,
    pub currently_in_treatment: YesNo,
    pub current_treatment_details: String,
    pub current_medications: String,
    pub family_mental_health_history: YesNo,
    pub family_mental_health_details: String,
    pub social_support: SocialSupport,
    pub substance_use_concern: YesNo,
}

/// Full psychology-assessment case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub reason_for_assessment: ReasonForAssessment,
    pub dass_depression: DassDepression,
    pub dass_anxiety: DassAnxiety,
    pub dass_stress: DassStress,
    pub functional_impact: FunctionalImpact,
    pub risk_screen: RiskScreen,
    pub support_and_history: SupportAndHistory,
}

/// A DASS-21 rule that was answered (i.e. the item has a 0..=3 score).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub subscale: String,
    pub item_number: i32,
    pub description: String,
    pub score: i32,
}

/// A safety / clinical flag computed by the engine (independent of DASS-21
/// scoring). Priority: urgent > high > medium > low.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Per-subscale DASS-21 score.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscaleScore {
    /// Sum of seven raw 0..=3 item responses (0..=21).
    pub raw: i32,
    /// Doubled raw, aligned with DASS-42 normative cutoffs (0..=42).
    pub scaled: i32,
    /// `normal` | `mild` | `moderate` | `severe` | `extremely-severe`.
    pub severity: DassSeverity,
    /// Count of items answered out of 7.
    pub answered: i32,
}

/// Grading output for a psychology-assessment case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub depression: SubscaleScore,
    pub anxiety: SubscaleScore,
    pub stress: SubscaleScore,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
