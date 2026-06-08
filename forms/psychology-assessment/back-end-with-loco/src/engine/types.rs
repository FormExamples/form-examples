//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered DASS item / numeric field.
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Assessment reason.
pub type AssessmentReason = String;
/// Impact level.
pub type ImpactLevel = String;
/// Dass severity.
pub type DassSeverity = String;
/// Social support.
pub type SocialSupport = String;

/// DASS-21 Likert item response: 0..=3, or `None` if unanswered.
pub type DassItem = Option<i32>;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Occupation.
    pub occupation: String,
}

/// Step 2 — Reason for Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonForAssessment {
    /// Reason.
    pub reason: AssessmentReason,
    /// Reason details.
    pub reason_details: String,
    /// Primary concern.
    pub primary_concern: String,
    /// Symptom duration weeks.
    pub symptom_duration_weeks: Option<i32>,
}

/// Step 3 — DASS-21 Depression subscale (items 3, 5, 10, 13, 16, 17, 21).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DassDepression {
    /// Item3 could not experience positive.
    pub item3_could_not_experience_positive: DassItem,
    /// Item5 difficult initiating.
    pub item5_difficult_initiating: DassItem,
    /// Item10 nothing to look forward to.
    pub item10_nothing_to_look_forward_to: DassItem,
    /// Item13 downhearted blue.
    pub item13_downhearted_blue: DassItem,
    /// Item16 unable to become enthusiastic.
    pub item16_unable_to_become_enthusiastic: DassItem,
    /// Item17 not worth much.
    pub item17_not_worth_much: DassItem,
    /// Item21 life meaningless.
    pub item21_life_meaningless: DassItem,
}

/// Step 4 — DASS-21 Anxiety subscale (items 2, 4, 7, 9, 15, 19, 20).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DassAnxiety {
    /// Item2 dryness of mouth.
    pub item2_dryness_of_mouth: DassItem,
    /// Item4 breathing difficulty.
    pub item4_breathing_difficulty: DassItem,
    /// Item7 trembling.
    pub item7_trembling: DassItem,
    /// Item9 panic worry.
    pub item9_panic_worry: DassItem,
    /// Item15 closed to panic.
    pub item15_closed_to_panic: DassItem,
    /// Item19 heart action aware.
    pub item19_heart_action_aware: DassItem,
    /// Item20 scared without reason.
    pub item20_scared_without_reason: DassItem,
}

/// Step 5 — DASS-21 Stress subscale (items 1, 6, 8, 11, 12, 14, 18).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DassStress {
    /// Item1 hard to wind down.
    pub item1_hard_to_wind_down: DassItem,
    /// Item6 over react.
    pub item6_over_react: DassItem,
    /// Item8 nervous energy.
    pub item8_nervous_energy: DassItem,
    /// Item11 agitated easily.
    pub item11_agitated_easily: DassItem,
    /// Item12 difficult to relax.
    pub item12_difficult_to_relax: DassItem,
    /// Item14 intolerant.
    pub item14_intolerant: DassItem,
    /// Item18 touchy easily.
    pub item18_touchy_easily: DassItem,
}

/// Step 6 — Functional Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalImpact {
    /// Work impact.
    pub work_impact: ImpactLevel,
    /// Relationship impact.
    pub relationship_impact: ImpactLevel,
    /// Daily activities impact.
    pub daily_activities_impact: ImpactLevel,
    /// Sleep impact.
    pub sleep_impact: ImpactLevel,
    /// Notes.
    pub notes: String,
}

/// Step 7 — Risk Screen.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskScreen {
    /// Suicidal ideation.
    pub suicidal_ideation: YesNo,
    /// Suicidal ideation details.
    pub suicidal_ideation_details: String,
    /// Self harm.
    pub self_harm: YesNo,
    /// Harm to others.
    pub harm_to_others: YesNo,
    /// Psychiatric emergency history.
    pub psychiatric_emergency_history: YesNo,
    /// Has safety plan.
    pub has_safety_plan: YesNo,
}

/// Step 8 — Support and History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SupportAndHistory {
    /// Previous mental health care.
    pub previous_mental_health_care: YesNo,
    /// Previous mental health details.
    pub previous_mental_health_details: String,
    /// Currently in treatment.
    pub currently_in_treatment: YesNo,
    /// Current treatment details.
    pub current_treatment_details: String,
    /// Current medications.
    pub current_medications: String,
    /// Family mental health history.
    pub family_mental_health_history: YesNo,
    /// Family mental health details.
    pub family_mental_health_details: String,
    /// Social support.
    pub social_support: SocialSupport,
    /// Substance use concern.
    pub substance_use_concern: YesNo,
}

/// Full psychology-assessment case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Reason for assessment.
    pub reason_for_assessment: ReasonForAssessment,
    /// Dass depression.
    pub dass_depression: DassDepression,
    /// Dass anxiety.
    pub dass_anxiety: DassAnxiety,
    /// Dass stress.
    pub dass_stress: DassStress,
    /// Functional impact.
    pub functional_impact: FunctionalImpact,
    /// Risk screen.
    pub risk_screen: RiskScreen,
    /// Support and history.
    pub support_and_history: SupportAndHistory,
}

/// A DASS-21 rule that was answered (i.e. the item has a 0..=3 score).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Subscale.
    pub subscale: String,
    /// Item number.
    pub item_number: i32,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
}

/// A safety / clinical flag computed by the engine (independent of DASS-21
/// scoring). Priority: urgent > high > medium > low.
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
    /// Depression.
    pub depression: SubscaleScore,
    /// Anxiety.
    pub anxiety: SubscaleScore,
    /// Stress.
    pub stress: SubscaleScore,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
