//! Core types for the DASS-21 scoring engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// DASS-21 item response: 0..=3, or `None` when unanswered.
pub type DassItem = Option<u8>;

/// DASS-21 severity category for a subscale.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum DassSeverity {
    Normal,
    Mild,
    Moderate,
    Severe,
    ExtremelySevere,
}

/// Which subscale a rule belongs to.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Subscale {
    Depression,
    Anxiety,
    Stress,
}

/// Priority level for a clinician-facing flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority {
    Urgent,
    High,
    Medium,
    Low,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub occupation: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonForAssessment {
    pub reason: String,
    pub reason_details: String,
    pub primary_concern: String,
    pub symptom_duration_weeks: Option<u32>,
}

/// DASS-21 Depression subscale items (3, 5, 10, 13, 16, 17, 21).
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
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

/// DASS-21 Anxiety subscale items (2, 4, 7, 9, 15, 19, 20).
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
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

/// DASS-21 Stress subscale items (1, 6, 8, 11, 12, 14, 18).
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalImpact {
    pub work_impact: String,
    pub relationship_impact: String,
    pub daily_activities_impact: String,
    pub sleep_impact: String,
    pub notes: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskScreen {
    pub suicidal_ideation: String,
    pub suicidal_ideation_details: String,
    pub self_harm: String,
    pub harm_to_others: String,
    pub psychiatric_emergency_history: String,
    pub has_safety_plan: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SupportAndHistory {
    pub previous_mental_health_care: String,
    pub previous_mental_health_details: String,
    pub currently_in_treatment: String,
    pub current_treatment_details: String,
    pub current_medications: String,
    pub family_mental_health_history: String,
    pub family_mental_health_details: String,
    pub social_support: String,
    pub substance_use_concern: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscaleScore {
    /// Sum of the seven raw item scores (0..=21).
    pub raw: u32,
    /// Doubled raw score, aligning with DASS-42 norms (0..=42).
    pub scaled: u32,
    /// Severity category derived from `scaled`.
    pub severity: DassSeverity,
    /// Number of items answered out of 7.
    pub answered: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub subscale: Subscale,
    pub item_number: u32,
    pub description: String,
    pub score: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: FlagPriority,
}

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

impl DassSeverity {
    /// Human-readable label for a DASS severity category.
    pub fn label(self) -> &'static str {
        match self {
            DassSeverity::Normal => "Normal",
            DassSeverity::Mild => "Mild",
            DassSeverity::Moderate => "Moderate",
            DassSeverity::Severe => "Severe",
            DassSeverity::ExtremelySevere => "Extremely Severe",
        }
    }
}

impl Subscale {
    pub fn label(self) -> &'static str {
        match self {
            Subscale::Depression => "Depression",
            Subscale::Anxiety => "Anxiety",
            Subscale::Stress => "Stress",
        }
    }
}
