use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// Respondent identification (step 1 of the wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Respondent {
    pub respondent_name: String,
    pub respondent_role: String,
    pub team: String,
    pub organisation: String,
    pub assessment_date: String,
    pub assessment_period: String,
    pub is_anonymous: String,
}

/// Action plan (step 5 of the wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlan {
    pub top_action_1: String,
    pub top_action_2: String,
    pub top_action_3: String,
    pub coach_notes: String,
    pub overall_notes: String,
}

/// Full agile-checklist case record.
///
/// `answers` is a flat map keyed by item id (`t01`..`p18`) whose values are
/// one of `"yes"`, `"no"`, `"not-applicable"`, or `""` (unanswered).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub respondent: Respondent,
    pub answers: BTreeMap<String, String>,
    pub action_plan: ActionPlan,
}

/// Per-section band: ≥75% = high, 50–74% = mid, <50% = low,
/// no applicable answers = unanswered.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Band {
    High,
    Mid,
    Low,
    Unanswered,
}

impl Band {
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
    Optimising,
    Mature,
    Developing,
    Initial,
    #[serde(rename = "ad-hoc")]
    AdHoc,
    #[serde(rename = "insufficient-data")]
    InsufficientData,
}

impl Maturity {
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
    pub section: String,
    pub yes_count: u32,
    pub no_count: u32,
    pub not_applicable_count: u32,
    pub unanswered_count: u32,
    pub applicable_count: u32,
    pub percent: Option<f64>,
    pub band: String,
}

/// A fired maturity rule (section + band coaching narrative).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub section: String,
    pub band: String,
    pub description: String,
}

/// A flagged operational concern computed independently of the maturity
/// banding (e.g. finished-work risk, psychological-safety risk).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: String,
    pub priority: String,
    pub section: String,
    pub triggering_items: Vec<String>,
    pub description: String,
    pub suggested_action: String,
}

/// Grading output for an agile-checklist submission.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub answered_count: u32,
    pub teams: SectionScore,
    pub stakeholders: SectionScore,
    pub practices: SectionScore,
    pub overall_percent: Option<f64>,
    pub maturity: String,
    pub maturity_label: String,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
