//! Dashboard-row projection of a stored scorecard. Mirrors
//! `ScorecardRow` in
//! `front-end-dashboard-with-svelte/src/lib/types.ts` so the same
//! JSON shape is consumed by either origin.

use serde::Serialize;

use crate::models::_entities::scorecards::Model;
use crate::scoring::types::{AdditionalFlag, FlagCategory, FlagPriority, GradeResult};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScorecardRow {
    pub id: String,
    pub organization_name: String,
    pub sector: String,
    pub size_band: String,
    pub respondent_name: String,
    pub assessment_date: String,
    pub score_total: u8,
    pub manifesto_subtotal: u8,
    pub principles_subtotal: u8,
    pub computed_band: String,
    pub flags: Vec<ScorecardFlag>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScorecardFlag {
    pub category: String,
    pub priority: String,
}

fn flag_category_slug(c: FlagCategory) -> &'static str {
    use FlagCategory::*;
    match c {
        NoSeniorLeadershipBuyin => "no-senior-leadership-buyin",
        NoCustomerContact => "no-customer-contact",
        NoWorkingSoftware => "no-working-software",
        NoSustainableBudget => "no-sustainable-budget",
        NoSelfOrganization => "no-self-organization",
        NoReflectionCulture => "no-reflection-culture",
        Other => "other",
    }
}

fn flag_priority_slug(p: FlagPriority) -> &'static str {
    use FlagPriority::*;
    match p {
        Low => "low",
        Medium => "medium",
        High => "high",
    }
}

fn flag_to_row(f: &AdditionalFlag) -> ScorecardFlag {
    ScorecardFlag {
        category: flag_category_slug(f.category).into(),
        priority: flag_priority_slug(f.priority).into(),
    }
}

impl ScorecardRow {
    pub fn from_model(model: &Model, grade: &GradeResult) -> Self {
        // Best-effort respondent name extraction from the JSON `data`
        // blob; the dashboard column tolerates an empty value.
        let respondent_name = model
            .data
            .get("respondent")
            .and_then(|r| r.get("respondentName"))
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();

        Self {
            id: format!("s-{}", model.id),
            organization_name: model.organization_name.clone(),
            sector: model.sector.clone(),
            size_band: model.size_band.clone(),
            respondent_name,
            assessment_date: model.assessment_date.clone(),
            score_total: grade.score_total,
            manifesto_subtotal: grade.manifesto_subtotal,
            principles_subtotal: grade.principles_subtotal,
            computed_band: model.computed_band.clone(),
            flags: grade.additional_flags.iter().map(flag_to_row).collect(),
        }
    }
}
