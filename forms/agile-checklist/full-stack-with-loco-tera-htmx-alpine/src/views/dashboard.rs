use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the agile-checklist dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentRow {
    pub id: String,
    pub assessment_date: String,
    pub respondent_name: String,
    pub respondent_role: String,
    pub team: String,
    pub organisation: String,
    pub assessment_period: String,
    pub answered_count: u32,
    pub teams_percent: Option<f64>,
    pub stakeholders_percent: Option<f64>,
    pub practices_percent: Option<f64>,
    pub overall_percent: Option<f64>,
    pub maturity: String,
    pub maturity_label: String,
    pub high_priority_flag_count: u32,
    pub is_anonymous: bool,
}

impl AssessmentRow {
    /// Build a row from an assessment model that has a completed grading
    /// result. Returns `None` when either the data or the grading result is
    /// missing / unparsable.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        let is_anonymous = data.respondent.is_anonymous == "yes"
            || data.respondent.respondent_name.trim().is_empty();
        let respondent_name = if is_anonymous {
            "Anonymous".to_string()
        } else {
            data.respondent.respondent_name
        };
        let respondent_role = if is_anonymous {
            String::new()
        } else {
            data.respondent.respondent_role
        };

        Some(Self {
            id: m.id.to_string(),
            assessment_date: data.respondent.assessment_date,
            respondent_name,
            respondent_role,
            team: data.respondent.team,
            organisation: data.respondent.organisation,
            assessment_period: data.respondent.assessment_period,
            answered_count: result.answered_count,
            teams_percent: result.teams.percent,
            stakeholders_percent: result.stakeholders.percent,
            practices_percent: result.practices.percent,
            overall_percent: result.overall_percent,
            maturity: result.maturity,
            maturity_label: result.maturity_label,
            high_priority_flag_count,
            is_anonymous,
        })
    }
}
