use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the endometriosis assessment dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub created_at: String,
    pub asrm_stage: Option<i32>,
    pub asrm_points: i32,
    pub ehp30_score: Option<i32>,
    pub overall_severity: String,
    pub high_priority_flag_count: u32,
    pub fired_rule_count: u32,
}

impl AssessmentRow {
    /// Build an AssessmentRow from a model that has a completed grading result.
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

        Some(Self {
            id: m.id.to_string(),
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            created_at: m.created_at.to_rfc3339(),
            asrm_stage: result.asrm_stage,
            asrm_points: result.asrm_points,
            ehp30_score: result.ehp30_score,
            overall_severity: result.overall_severity,
            high_priority_flag_count,
            fired_rule_count,
        })
    }
}
