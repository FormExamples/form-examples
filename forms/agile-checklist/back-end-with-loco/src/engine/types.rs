//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// Respondent identification (step 1 of the wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Respondent {
    /// Respondent name.
    pub respondent_name: String,
    /// Respondent role.
    pub respondent_role: String,
    /// Team.
    pub team: String,
    /// Organisation.
    pub organisation: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Assessment period.
    pub assessment_period: String,
    /// Is anonymous.
    pub is_anonymous: String,
}

/// Action plan (step 5 of the wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlan {
    /// Top action 1.
    pub top_action_1: String,
    /// Top action 2.
    pub top_action_2: String,
    /// Top action 3.
    pub top_action_3: String,
    /// Coach notes.
    pub coach_notes: String,
    /// Overall notes.
    pub overall_notes: String,
}

/// Full agile-checklist case record.
///
/// `answers` is a flat map keyed by item id (`t01`..`p18`) whose values are
/// one of `"yes"`, `"no"`, `"not-applicable"`, or `""` (unanswered).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Respondent.
    pub respondent: Respondent,
    /// Answers.
    pub answers: BTreeMap<String, String>,
    /// Action plan.
    pub action_plan: ActionPlan,
}

/// Per-section band: ≥75% = high, 50–74% = mid, <50% = low,
/// no applicable answers = unanswered.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Band {
    /// High.
    High,
    /// Mid.
    Mid,
    /// Low.
    Low,
    /// Unanswered.
    Unanswered,
}

impl Band {
    /// Slug.
    pub fn slug(self) -> &'static str {
        match self {
            Band::High => "high",
            Band::Mid => "mid",
            Band::Low => "low",
            Band::Unanswered => "unanswered",
        }
    }
}

/// Composite maturity level computed from the unweighted mean of the three
/// section percentages.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Maturity {
    /// Optimising.
    Optimising,
    /// Mature.
    Mature,
    /// Developing.
    Developing,
    /// Initial.
    Initial,
    /// Ad hoc.
    #[serde(rename = "ad-hoc")]
    AdHoc,
    /// Insufficient data.
    #[serde(rename = "insufficient-data")]
    InsufficientData,
}

impl Maturity {
    /// Slug.
    pub fn slug(self) -> &'static str {
        match self {
            Maturity::Optimising => "optimising",
            Maturity::Mature => "mature",
            Maturity::Developing => "developing",
            Maturity::Initial => "initial",
            Maturity::AdHoc => "ad-hoc",
            Maturity::InsufficientData => "insufficient-data",
        }
    }

    /// Label.
    pub fn label(self) -> &'static str {
        match self {
            Maturity::Optimising => "OPTIMISING",
            Maturity::Mature => "MATURE",
            Maturity::Developing => "DEVELOPING",
            Maturity::Initial => "INITIAL",
            Maturity::AdHoc => "AD-HOC",
            Maturity::InsufficientData => "INSUFFICIENT DATA",
        }
    }
}

/// Per-section score: yes/no/n-a counts, applicable count, percentage, band.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionScore {
    /// Section.
    pub section: String,
    /// Yes count.
    pub yes_count: u32,
    /// No count.
    pub no_count: u32,
    /// Not applicable count.
    pub not_applicable_count: u32,
    /// Unanswered count.
    pub unanswered_count: u32,
    /// Applicable count.
    pub applicable_count: u32,
    /// Percent.
    pub percent: Option<f64>,
    /// Band.
    pub band: String,
}

/// A fired maturity rule (section + band coaching narrative).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Section.
    pub section: String,
    /// Band.
    pub band: String,
    /// Description.
    pub description: String,
}

/// A flagged operational concern computed independently of the maturity
/// banding (e.g. finished-work risk, psychological-safety risk).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Priority.
    pub priority: String,
    /// Section.
    pub section: String,
    /// Triggering items.
    pub triggering_items: Vec<String>,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Grading output for an agile-checklist submission.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Answered count.
    pub answered_count: u32,
    /// Teams.
    pub teams: SectionScore,
    /// Stakeholders.
    pub stakeholders: SectionScore,
    /// Practices.
    pub practices: SectionScore,
    /// Overall percent.
    pub overall_percent: Option<f64>,
    /// Maturity.
    pub maturity: String,
    /// Maturity label.
    pub maturity_label: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
