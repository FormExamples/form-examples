use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the clinician dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentRow {
    pub id: String,
    pub athlete_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub primary_sport: String,
    pub primary_position: String,
    pub contact_level: String,
    pub competitive_level: String,
    pub clinician_name: String,
    pub clinician_signature_date: String,
    pub clearance: String,
    pub answered_count: u32,
    pub fired_rule_count: u32,
    pub high_priority_flag_count: u32,
}

impl AssessmentRow {
    /// Build a row from a stored model that has a grading result.
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
        let fired_rule_count = result.fired_rules.len() as u32;

        let athlete_name = format!(
            "{} {}",
            data.demographics.first_name.trim(),
            data.demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            athlete_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            primary_sport: data.sport_position_details.primary_sport,
            primary_position: data.sport_position_details.primary_position,
            contact_level: data.sport_position_details.contact_level,
            competitive_level: data.sport_position_details.competitive_level,
            clinician_name: data.clearance_decision.clinician_name,
            clinician_signature_date: data.clearance_decision.clinician_signature_date,
            clearance: result.clearance,
            answered_count: result.answered_count,
            fired_rule_count,
            high_priority_flag_count,
        })
    }
}
